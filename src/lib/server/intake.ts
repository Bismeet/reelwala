import { createHash, randomUUID } from "node:crypto";
import {
  AppError,
  type ApplicationInput,
  type EnquiryInput,
} from "@/lib/validation";
import { database, type Connection } from "./db";

const hash = (v: unknown) =>
  createHash("sha256").update(JSON.stringify(v)).digest("hex");
export async function saveIntake(
  kind: "enquiry" | "application",
  input: EnquiryInput | ApplicationInput,
  key: string,
  sessionId?: string,
  db?: Connection,
) {
  const conn = db ?? (await database());
  const requestHash = hash(input);
  const id = randomUUID();
  return conn.transaction(async (tx) => {
    // Serialize same-key submissions on managed PostgreSQL, including requests with conflicting hashes.
    await tx.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
      `${kind}:${key}`,
    ]);
    const existing = await tx.query(
      "SELECT request_hash,resource_id FROM idempotency WHERE scope=$1 AND key=$2",
      [kind, key],
    );
    if (existing.rows.length) {
      if (existing.rows[0].request_hash !== requestHash)
        throw new AppError(
          "IDEMPOTENCY_CONFLICT",
          409,
          "This retry has different details. Please start a new submission.",
        );
      return {
        reference: String(existing.rows[0].resource_id),
        replayed: true,
      };
    }
    if (kind === "enquiry") {
      const v = input as EnquiryInput;
      await tx.query(
        "INSERT INTO enquiries(id,name,phone,service_id,event_date,event_location,package_id,notice_version) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
        [
          id,
          v.name,
          v.phone,
          v.serviceId,
          v.eventDate,
          v.eventLocation,
          v.packageId ?? null,
          v.noticeVersion,
        ],
      );
    } else {
      const v = input as ApplicationInput;
      const ids = [...v.videoUploadIds, ...v.photoUploadIds];
      if (new Set(ids).size !== ids.length)
        throw new AppError(
          "UPLOAD_DUPLICATE",
          422,
          "Please include each file only once.",
        );
      for (const uploadId of ids) {
        const r = await tx.query(
          "SELECT u.*,s.expires_at AS session_expiry FROM uploads u JOIN upload_sessions s ON s.id=u.session_id WHERE u.id=$1 FOR UPDATE OF u",
          [uploadId],
        );
        const file = r.rows[0];
        if (
          !file ||
          file.session_id !== sessionId ||
          file.state !== "ready" ||
          new Date(String(file.expires_at)) <= new Date() ||
          new Date(String(file.session_expiry)) <= new Date() ||
          file.application_id
        )
          throw new AppError(
            "UPLOAD_NOT_READY",
            422,
            "A file is unavailable. Remove it or upload it again.",
          );
        const expected = v.videoUploadIds.includes(uploadId)
          ? "video"
          : "photo";
        if (file.kind !== expected)
          throw new AppError(
            "UPLOAD_TYPE",
            422,
            "A selected file is in the wrong section.",
          );
      }
      await tx.query(
        "INSERT INTO creator_applications(id,name,phone,email,gender,portfolio_url,device_model_id,locality,notice_version) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",
        [
          id,
          v.name,
          v.phone,
          v.email,
          v.gender,
          v.portfolioUrl ?? null,
          v.deviceModelId,
          v.locality,
          v.noticeVersion,
        ],
      );
      for (const uploadId of ids)
        await tx.query(
          "UPDATE uploads SET application_id=$1,state='attached' WHERE id=$2",
          [id, uploadId],
        );
    }
    await tx.query(
      "INSERT INTO outbox(id,entity_type,entity_id) VALUES($1,$2,$3)",
      [randomUUID(), kind, id],
    );
    await tx.query(
      "INSERT INTO idempotency(scope,key,request_hash,resource_id) VALUES($1,$2,$3,$4)",
      [kind, key, requestHash, id],
    );
    return { reference: id, replayed: false };
  });
}
export async function rateLimit(bucket: string, max = 20, db?: Connection) {
  const conn = db ?? (await database());
  const key = hash(bucket);
  const r = await conn.query(
    "INSERT INTO rate_limits(bucket,hits,reset_at) VALUES($1,1,now()+interval '1 hour') ON CONFLICT(bucket) DO UPDATE SET hits=CASE WHEN rate_limits.reset_at<now() THEN 1 ELSE rate_limits.hits+1 END, reset_at=CASE WHEN rate_limits.reset_at<now() THEN now()+interval '1 hour' ELSE rate_limits.reset_at END RETURNING hits",
    [key],
  );
  if (Number(r.rows[0].hits) > max)
    throw new AppError(
      "RATE_LIMITED",
      429,
      "Too many attempts. Please try again later.",
    );
}
