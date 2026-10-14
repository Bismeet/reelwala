import {
  createHmac,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import {
  mkdir,
  open,
  readFile,
  rename,
  unlink,
  writeFile,
  stat,
} from "node:fs/promises";
import { join } from "node:path";
import { fileTypeFromFile } from "file-type";
import sharp from "sharp";
import { uploadLimits } from "@/content/site";
import { AppError } from "@/lib/validation";
import { database, dataPath } from "./db";

let secretPromise: Promise<string> | undefined;
async function secret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  secretPromise ??= (async () => {
    await mkdir(dataPath(), { recursive: true });
    const path = join(dataPath(), "session.key");
    try {
      await writeFile(path, randomBytes(48).toString("hex"), {
        flag: "wx",
        mode: 0o600,
      });
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
    }
    return readFile(path, "utf8");
  })();
  return secretPromise;
}
async function sign(value: string) {
  return createHmac("sha256", await secret())
    .update(value)
    .digest("hex");
}
async function verify(value: string, signature: string) {
  const expected = await sign(value);
  return (
    /^[a-f0-9]{64}$/.test(signature) &&
    timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"))
  );
}
export async function createSession() {
  const id = randomUUID();
  const expires = new Date(Date.now() + 86400000);
  const db = await database();
  await db.query("INSERT INTO upload_sessions(id,expires_at) VALUES($1,$2)", [
    id,
    expires.toISOString(),
  ]);
  return {
    id,
    expiresAt: expires.toISOString(),
    cookie: `rw-upload=${id}.${await sign(id)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
  };
}
export async function readSession(request: Request) {
  const raw = request.headers
    .get("cookie")
    ?.split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith("rw-upload="))
    ?.slice(10);
  if (!raw) return null;
  const [id, sig] = raw.split(".");
  if (!/^[a-f0-9-]{36}$/.test(id ?? "") || !(await verify(id, sig ?? "")))
    return null;
  const db = await database();
  const row = (
    await db.query(
      "SELECT id,expires_at FROM upload_sessions WHERE id=$1 AND expires_at>now()",
      [id],
    )
  ).rows[0];
  return row ? { id: String(row.id) } : null;
}
export async function authorizeUpload(request: Request, body: unknown) {
  const session = await readSession(request);
  if (!session)
    throw new AppError(
      "UPLOAD_SESSION",
      401,
      "Your upload session has expired. Please choose the files again.",
    );
  const v = body as Record<string, unknown>;
  const kind = v?.kind;
  if (kind !== "video" && kind !== "photo")
    throw new AppError("UPLOAD_KIND", 422, "Choose a photo or video.");
  const limit = uploadLimits[kind];
  const bytes = Number(v.byteSize);
  if (!Number.isInteger(bytes) || bytes <= 0 || bytes > limit.bytes)
    throw new AppError(
      "UPLOAD_SIZE",
      422,
      `This ${kind} exceeds the ${limit.bytes / 1024 / 1024} MB limit.`,
    );
  const mime = String(v.declaredMime ?? "");
  const allowed =
    kind === "video"
      ? ["video/mp4", "video/quicktime"]
      : ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(mime))
    throw new AppError(
      "UPLOAD_FORMAT",
      422,
      kind === "video"
        ? "Choose an MP4 or MOV video."
        : "Choose a JPEG, PNG, or WebP image.",
    );
  const filename = String(v.filename ?? "")
    .split(/[\\/]/)
    .pop()!
    .replace(/[\x00-\x1f]/g, "")
    .slice(0, 150);
  if (!filename)
    throw new AppError("UPLOAD_FILENAME", 422, "Choose a named file.");
  const id = randomUUID();
  const db = await database();
  const expires = new Date(Date.now() + 86400000).toISOString();
  await db.transaction(async (tx) => {
    const lock = (
      await tx.query(
        "SELECT id FROM upload_sessions WHERE id=$1 AND expires_at>now() FOR UPDATE",
        [session.id],
      )
    ).rows[0];
    if (!lock)
      throw new AppError(
        "UPLOAD_SESSION",
        401,
        "Your upload session has expired.",
      );
    const rows = (
      await tx.query(
        "SELECT kind,byte_size FROM uploads WHERE session_id=$1 AND state NOT IN ('rejected','expired','deleting')",
        [session.id],
      )
    ).rows;
    if (
      rows.filter((r) => r.kind === kind).length >= limit.count ||
      rows.reduce((sum, r) => sum + Number(r.byte_size), 0) + bytes >
        uploadLimits.total
    )
      throw new AppError(
        "UPLOAD_LIMIT",
        422,
        "Your file allowance has been reached. Remove a file before adding another.",
      );
    await tx.query(
      "INSERT INTO uploads(id,session_id,kind,filename,object_key,declared_mime,byte_size,state,expires_at) VALUES($1,$2,$3,$4,$5,$6,$7,'authorized',$8)",
      [id, session.id, kind, filename, id, mime, bytes, expires],
    );
  });
  const tokenExpiry = Date.now() + 600000;
  const token = `${tokenExpiry}.${await sign(`${id}:${session.id}:${tokenExpiry}`)}`;
  return {
    uploadId: id,
    url: `/api/uploads/${id}/content?token=${token}`,
    method: "PUT",
    headers: { "Content-Type": mime },
    expiresAt: new Date(tokenExpiry).toISOString(),
  };
}
function filePath(id: string) {
  if (!/^[a-f0-9-]{36}$/.test(id))
    throw new AppError("UPLOAD_NOT_FOUND", 404, "File not found.");
  return join(dataPath(), "uploads", id);
}
export async function ownedUpload(request: Request, id: string) {
  filePath(id);
  const session = await readSession(request);
  if (!session)
    throw new AppError(
      "UPLOAD_SESSION",
      401,
      "Your upload session has expired.",
    );
  const db = await database();
  const row = (
    await db.query(
      "SELECT * FROM uploads WHERE id=$1 AND session_id=$2 AND expires_at>now()",
      [id, session.id],
    )
  ).rows[0];
  if (!row) throw new AppError("UPLOAD_NOT_FOUND", 404, "File not found.");
  return row;
}
export async function receiveUpload(request: Request, id: string) {
  const row = await ownedUpload(request, id);
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const [expiry, sig] = token.split(".");
  if (
    !expiry ||
    Number(expiry) < Date.now() ||
    !(await verify(`${id}:${row.session_id}:${expiry}`, sig ?? ""))
  )
    throw new AppError(
      "UPLOAD_EXPIRED",
      401,
      "This upload link expired. Choose the file again.",
    );
  if (row.state !== "authorized")
    throw new AppError(
      "UPLOAD_STATE",
      409,
      "This file has already been uploaded or is unavailable.",
    );
  const db = await database();
  const claim = await db.query(
    "UPDATE uploads SET state='uploading' WHERE id=$1 AND state='authorized' RETURNING id",
    [id],
  );
  if (!claim.rows.length)
    throw new AppError("UPLOAD_STATE", 409, "This file is already uploading.");
  await mkdir(join(dataPath(), "uploads"), { recursive: true });
  const destination = filePath(id);
  const partial = destination + ".part";
  const handle = await open(partial, "w", 0o600);
  let count = 0;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new AppError("UPLOAD_EMPTY", 422, "The file is empty.");
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      count += chunk.value.length;
      if (count > Number(row.byte_size)) {
        await reader.cancel();
        throw new AppError(
          "UPLOAD_SIZE",
          413,
          "The file is larger than expected.",
        );
      }
      await handle.writeFile(chunk.value);
    }
    if (count !== Number(row.byte_size))
      throw new AppError(
        "UPLOAD_INCOMPLETE",
        422,
        "The upload was incomplete. Please retry.",
      );
    await handle.close();
    await rename(partial, destination);
    await db.query(
      "UPDATE uploads SET state='uploaded' WHERE id=$1 AND state='uploading'",
      [id],
    );
    return { state: "uploaded" };
  } catch (error) {
    await handle.close().catch(() => {});
    await unlink(partial).catch(() => {});
    await db.query(
      "UPDATE uploads SET state='authorized' WHERE id=$1 AND state='uploading'",
      [id],
    );
    throw error;
  }
}
async function inspectMovie(path: string, size: number) {
  const handle = await open(path, "r");
  let offset = 0;
  const atoms = new Set<string>();
  try {
    while (offset < size) {
      const header = Buffer.alloc(16);
      const { bytesRead } = await handle.read(header, 0, 16, offset);
      if (bytesRead < 8) throw new Error("Incomplete video container.");
      let length = header.readUInt32BE(0);
      const type = header.toString("ascii", 4, 8);
      let headerSize = 8;
      if (length === 1) {
        if (bytesRead < 16) throw new Error("Incomplete video container.");
        length = Number(header.readBigUInt64BE(8));
        headerSize = 16;
      }
      if (length === 0) length = size - offset;
      if (length < headerSize || offset + length > size)
        throw new Error("Incomplete video container.");
      atoms.add(type);
      offset += length;
    }
    if (!atoms.has("ftyp") || !atoms.has("moov") || !atoms.has("mdat"))
      throw new Error("Choose a complete MP4 or MOV video.");
  } finally {
    await handle.close();
  }
}
export async function completeUpload(request: Request, id: string) {
  const row = await ownedUpload(request, id);
  if (row.state === "ready" || row.state === "inspecting")
    return { state: row.state };
  if (row.state !== "uploaded")
    throw new AppError(
      "UPLOAD_STATE",
      409,
      "Upload the file before completing it.",
    );
  const db = await database();
  const claim = await db.query(
    "UPDATE uploads SET state='inspecting' WHERE id=$1 AND state='uploaded' RETURNING id",
    [id],
  );
  if (!claim.rows.length) return { state: "inspecting" };
  try {
    const path = filePath(id);
    const info = await stat(path);
    if (info.size !== Number(row.byte_size))
      throw new Error("The upload was incomplete.");
    const type = await fileTypeFromFile(path);
    const allowed =
      row.kind === "photo"
        ? ["image/jpeg", "image/png", "image/webp"]
        : ["video/mp4", "video/quicktime"];
    if (!type || !allowed.includes(type.mime))
      throw new Error(
        "The file format doesn’t match a supported photo or video.",
      );
    if (row.kind === "photo")
      await sharp(path, { limitInputPixels: 40_000_000 }).stats();
    else await inspectMovie(path, info.size);
    const result = await db.query(
      "UPDATE uploads SET state='ready',inspected_mime=$1,error=NULL WHERE id=$2 AND state='inspecting' RETURNING state",
      [type.mime, id],
    );
    if (!result.rows.length)
      throw new AppError(
        "UPLOAD_STATE",
        409,
        "This file is no longer available.",
      );
    return { state: "ready" };
  } catch (error) {
    if (error instanceof AppError) throw error;
    const message =
      error instanceof Error ? error.message : "The file could not be read.";
    await db.query(
      "UPDATE uploads SET state='rejected',error=$1 WHERE id=$2 AND state='inspecting'",
      [message, id],
    );
    await unlink(filePath(id)).catch(() => {});
    return { state: "rejected", message };
  }
}
export async function removeUpload(request: Request, id: string) {
  const row = await ownedUpload(request, id);
  const db = await database();
  if (
    row.application_id ||
    ["attached", "uploading", "inspecting"].includes(String(row.state))
  )
    throw new AppError(
      "UPLOAD_STATE",
      409,
      "This file cannot be removed right now.",
    );
  const claim = await db.query(
    "UPDATE uploads SET state='deleting' WHERE id=$1 AND application_id IS NULL AND state NOT IN ('attached','uploading','inspecting') RETURNING id",
    [id],
  );
  if (!claim.rows.length)
    throw new AppError(
      "UPLOAD_STATE",
      409,
      "This file cannot be removed right now.",
    );
  await unlink(filePath(id)).catch(() => {});
  await unlink(filePath(id) + ".part").catch(() => {});
  await db.query(
    "UPDATE uploads SET state='expired' WHERE id=$1 AND state='deleting'",
    [id],
  );
}
export async function cleanupUploads() {
  const db = await database();
  const rows = await db.transaction(async (tx) => {
    const expired = await tx.query(
      "SELECT id FROM uploads WHERE expires_at<now() AND application_id IS NULL AND state NOT IN ('attached','expired') FOR UPDATE",
    );
    for (const r of expired.rows)
      await tx.query("UPDATE uploads SET state='deleting' WHERE id=$1", [r.id]);
    return expired.rows;
  });
  for (const r of rows) {
    const id = String(r.id);
    await unlink(filePath(id)).catch(() => {});
    await unlink(filePath(id) + ".part").catch(() => {});
    await db.query(
      "UPDATE uploads SET state='expired' WHERE id=$1 AND state='deleting'",
      [id],
    );
  }
  return rows.length;
}
