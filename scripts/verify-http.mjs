import assert from "node:assert/strict";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
const origin = "http://127.0.0.1:3000";
async function request(
  path,
  { body, method = "POST", cookie, key, raw, headers = {} } = {},
) {
  const response = await fetch(origin + path, {
    method,
    headers: {
      Origin: origin,
      ...(cookie ? { Cookie: cookie } : {}),
      ...(key ? { "Idempotency-Key": key } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: raw ?? (body ? JSON.stringify(body) : undefined),
  });
  return {
    status: response.status,
    data: await response.json(),
    cookie: response.headers.get("set-cookie")?.split(";")[0],
  };
}
const a = await request("/api/upload-sessions");
assert.equal(a.status, 200);
const b = await request("/api/upload-sessions");
assert.ok(a.cookie && b.cookie);
const bytes = await sharp({
  create: { width: 32, height: 32, channels: 3, background: "#f59e0b" },
})
  .png()
  .toBuffer();
const auth = await request("/api/uploads/authorize", {
  cookie: a.cookie,
  body: {
    kind: "photo",
    filename: "preview-test.png",
    declaredMime: "image/png",
    byteSize: bytes.length,
  },
});
assert.equal(auth.status, 200);
const id = auth.data.uploadId;
assert.equal(
  (await request(`/api/uploads/${id}`, { cookie: b.cookie, method: "GET" }))
    .status,
  404,
);
assert.equal(
  (await request(`/api/uploads/${id}/complete`, { cookie: a.cookie })).status,
  409,
);
assert.equal(
  (
    await request(auth.data.url, {
      cookie: a.cookie,
      method: "PUT",
      raw: bytes,
      headers: { "Content-Type": "image/png" },
    })
  ).status,
  200,
);
assert.equal(
  (await request(`/api/uploads/${id}/complete`, { cookie: a.cookie })).data
    .state,
  "ready",
);
const input = {
  name: "HTTP Preview Tester",
  phone: "9876543210",
  email: "test@example.test",
  gender: "Prefer not to say",
  deviceModelId: "iphone-15",
  locality: "Test area",
  videoUploadIds: [],
  photoUploadIds: [id],
  noticeVersion: "local-preview-v1",
};
const key = randomUUID();
assert.equal(
  (
    await request("/api/creator-applications", {
      cookie: b.cookie,
      body: input,
      key,
    })
  ).status,
  422,
);
const saved = await request("/api/creator-applications", {
  cookie: a.cookie,
  body: input,
  key,
});
assert.equal(saved.status, 201);
const replay = await request("/api/creator-applications", {
  cookie: a.cookie,
  body: input,
  key,
});
assert.equal(replay.status, 200);
assert.equal(replay.data.reference, saved.data.reference);
assert.equal(
  (await request(`/api/uploads/${id}`, { cookie: a.cookie, method: "DELETE" }))
    .status,
  409,
);
const bad = Buffer.from("This is not a photo");
const badAuth = await request("/api/uploads/authorize", {
  cookie: b.cookie,
  body: {
    kind: "photo",
    filename: "fake.jpg",
    declaredMime: "image/jpeg",
    byteSize: bad.length,
  },
});
assert.equal(badAuth.status, 200);
await request(badAuth.data.url, {
  cookie: b.cookie,
  method: "PUT",
  raw: bad,
  headers: { "Content-Type": "image/jpeg" },
});
assert.equal(
  (
    await request(`/api/uploads/${badAuth.data.uploadId}/complete`, {
      cookie: b.cookie,
    })
  ).data.state,
  "rejected",
);
assert.equal(
  (await request("/api/enquiries", { body: {}, key: randomUUID() })).status,
  422,
);
assert.equal(
  (
    await request("/api/enquiries", {
      body: {},
      key: randomUUID(),
      headers: { Origin: "https://unrelated.example" },
    })
  ).status,
  403,
);
console.log(
  JSON.stringify(
    {
      passed: true,
      checks: [
        "private upload session ownership",
        "actual PNG inspection",
        "cross-session rejection",
        "application attachment",
        "idempotent replay",
        "attached-file removal protection",
        "spoofed image rejection",
        "field validation",
        "cross-origin rejection",
      ],
      testApplication: saved.data.reference,
    },
    null,
    2,
  ),
);
