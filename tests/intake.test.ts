import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { createDatabase, type Connection } from "../src/lib/server/db";
import { saveIntake, rateLimit } from "../src/lib/server/intake";
import {
  enquirySchema,
  applicationSchema,
  todayInBusinessZone,
} from "../src/lib/validation";
import { serviceItems } from "../src/content/site";
let db: Connection;
let directory: string;
before(async () => {
  directory = await mkdtemp(join(tmpdir(), "reelwala-test-"));
  db = await createDatabase(directory);
});
after(async () => {
  await db.close?.();
  await rm(directory, { recursive: true, force: true });
});
const enquiry = () =>
  enquirySchema.parse({
    name: "Preview Tester",
    phone: "9876543210",
    serviceId: serviceItems[0].id,
    eventDate: todayInBusinessZone(),
    eventLocation: "Test venue Pune",
    noticeVersion: "local-preview-v1",
  });
const application = () =>
  applicationSchema.parse({
    name: "Creator Tester",
    phone: "9876543210",
    email: "tester@example.test",
    gender: "Prefer not to say",
    deviceModelId: "iphone-15",
    locality: "Test locality",
    portfolioUrl: "@testcreator",
    videoUploadIds: [],
    photoUploadIds: Array.from({ length: 5 }, () => randomUUID()),
    noticeVersion: "local-preview-v1",
  });
test("all source services are retained and exact calendar dates are validated", () => {
  assert.equal(serviceItems.length, 24);
  assert.equal(enquiry().phone, "+919876543210");
  assert.equal(
    enquirySchema.safeParse({ ...enquiry(), sourceRoute: "/" }).success,
    true,
  );
  assert.equal(
    enquirySchema.safeParse({ ...enquiry(), sourceRoute: "/unrelated" })
      .success,
    false,
  );
  assert.equal(
    enquirySchema.safeParse({ ...enquiry(), eventDate: "2027-02-30" }).success,
    false,
  );
  assert.equal(
    enquirySchema.safeParse({ ...enquiry(), serviceId: "invented" }).success,
    false,
  );
  assert.equal(
    enquirySchema.safeParse({ ...enquiry(), eventDate: "2020-01-01" }).success,
    false,
  );
});
test("durable enquiry and notification are saved exactly once across retries", async () => {
  const input = enquiry();
  const key = randomUUID();
  const responses = await Promise.all([
    saveIntake("enquiry", input, key, undefined, db),
    saveIntake("enquiry", input, key, undefined, db),
  ]);
  assert.equal(responses[0].reference, responses[1].reference);
  assert.equal(responses.filter((r) => r.replayed).length, 1);
  assert.equal(
    (
      await db.query("SELECT count(*) AS n FROM outbox WHERE entity_id=$1", [
        responses[0].reference,
      ])
    ).rows[0].n,
    1,
  );
  await assert.rejects(
    saveIntake(
      "enquiry",
      { ...input, name: "Different Name" },
      key,
      undefined,
      db,
    ),
    /different details/,
  );
});
test("creator requires five photos, accepts zero videos and normalizes a portfolio handle", () => {
  const input = application();
  assert.equal(input.portfolioUrl, "https://instagram.com/testcreator");
  assert.equal(input.videoUploadIds.length, 0);
  for (const count of [0, 4, 6]) {
    assert.equal(
      applicationSchema.safeParse({
        ...input,
        photoUploadIds: Array.from({ length: count }, () => randomUUID()),
      }).success,
      false,
    );
  }
  for (const deviceModelId of [
    "iphone-15",
    "iphone-17e",
    "iphone-18-pro",
    "iphone-18-pro-max",
  ]) {
    assert.equal(
      applicationSchema.safeParse({ ...input, deviceModelId }).success,
      true,
    );
  }
  assert.equal(
    applicationSchema.safeParse({ ...input, deviceModelId: "iphone-99" })
      .success,
    false,
  );
  assert.equal(
    applicationSchema.safeParse({
      ...input,
      portfolioUrl: "javascript:alert(1)",
    }).success,
    false,
  );
});
test("a creator cannot attach another session’s file; failed attachment leaves no partial record", async () => {
  const owner = randomUUID();
  const other = randomUUID();
  const files = Array.from({ length: 5 }, () => randomUUID());
  const file = files[0];
  await db.query(
    "INSERT INTO upload_sessions(id,expires_at) VALUES($1,now()+interval '1 day'),($2,now()+interval '1 day')",
    [owner, other],
  );
  for (const photo of files)
    await db.query(
      "INSERT INTO uploads(id,session_id,kind,filename,object_key,declared_mime,byte_size,state,expires_at) VALUES($1::uuid,$2,'photo','test.jpg',$1::text,'image/jpeg',100,'ready',now()+interval '1 day')",
      [photo, owner],
    );
  const input = { ...application(), photoUploadIds: files };
  const key = randomUUID();
  await assert.rejects(
    saveIntake("application", input, key, other, db),
    /unavailable/,
  );
  assert.equal(
    (
      await db.query("SELECT count(*) AS n FROM idempotency WHERE key=$1", [
        key,
      ])
    ).rows[0].n,
    0,
  );
  const saved = await saveIntake("application", input, key, owner, db);
  assert.equal(
    (
      await db.query("SELECT application_id,state FROM uploads WHERE id=$1", [
        file,
      ])
    ).rows[0].application_id,
    saved.reference,
  );
  assert.equal(
    (await db.query("SELECT state FROM uploads WHERE id=$1", [file])).rows[0]
      .state,
    "attached",
  );
});
test("persisted throttling returns a limit rather than saving excessive requests", async () => {
  const bucket = randomUUID();
  await rateLimit(bucket, 2, db);
  await rateLimit(bucket, 2, db);
  await assert.rejects(rateLimit(bucket, 2, db), /Too many attempts/);
});
test("saved records survive closing and reopening the local database", async () => {
  const saved = await saveIntake(
    "enquiry",
    enquiry(),
    randomUUID(),
    undefined,
    db,
  );
  await db.close?.();
  db = await createDatabase(directory);
  const rows = (
    await db.query("SELECT id FROM enquiries WHERE id=$1", [saved.reference])
  ).rows;
  assert.equal(rows[0].id, saved.reference);
  assert.equal(
    (
      await db.query("SELECT state FROM outbox WHERE entity_id=$1", [
        saved.reference,
      ])
    ).rows[0].state,
    "pending",
  );
});
