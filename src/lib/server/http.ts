import { randomUUID } from "node:crypto";
import { AppError } from "@/lib/validation";
import { preview } from "@/content/site";
import { rateLimit } from "./intake";

export async function guard(request: Request, scope: string) {
  // Production intake stays off until live privacy, eligibility, hosting and staff configuration are implemented.
  if (!preview)
    throw new AppError(
      "NOT_CONFIGURED",
      503,
      "Online enquiries are not available yet.",
    );
  const internalUrl = new URL(request.url);
  // Next may normalize request.url to localhost even when the browser uses 127.0.0.1.
  // Validate the incoming Host independently, then compare the browser's exact origin.
  let url: URL;
  try {
    url = new URL(
      `${internalUrl.protocol}//${request.headers.get("host") ?? internalUrl.host}`,
    );
  } catch {
    throw new AppError(
      "ORIGIN_REJECTED",
      403,
      "Please submit from this website.",
    );
  }
  if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
    throw new AppError(
      "LOCAL_PREVIEW_ONLY",
      403,
      "This preview accepts submissions on this computer only.",
    );
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin)
    throw new AppError(
      "ORIGIN_REJECTED",
      403,
      "Please submit from this website.",
    );
  if (!origin && request.headers.get("sec-fetch-site") === "cross-site")
    throw new AppError(
      "ORIGIN_REJECTED",
      403,
      "Please submit from this website.",
    );
  await rateLimit(`local:${scope}`, scope === "upload" ? 100 : 30);
}
export async function jsonBody(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new AppError("CONTENT_TYPE", 415, "Please send JSON.");
  const reader = request.body?.getReader();
  if (!reader) throw new AppError("BAD_REQUEST", 400, "No request body.");
  let total = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    total += part.value.length;
    if (total > 16384) {
      await reader.cancel();
      throw new AppError("BODY_TOO_LARGE", 413, "The request is too large.");
    }
    chunks.push(part.value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new AppError("BAD_REQUEST", 400, "The request could not be read.");
  }
}
export function responseError(error: unknown) {
  const known = error instanceof AppError;
  const requestId = randomUUID();
  if (!known)
    console.error("Intake failure", {
      requestId,
      category: error instanceof Error ? error.name : "Unknown",
    });
  return Response.json(
    {
      ok: false,
      error: {
        code: known ? error.code : "UNAVAILABLE",
        message: known
          ? error.message
          : "We couldn’t save your submission. Please try again.",
        fields: known ? error.fields : undefined,
        requestId,
      },
    },
    {
      status: known ? error.status : 503,
      headers: {
        "Cache-Control": "no-store",
        ...(known && error.status === 429 ? { "Retry-After": "3600" } : {}),
      },
    },
  );
}
export function idempotencyKey(request: Request) {
  const key = request.headers.get("Idempotency-Key");
  if (!key || !/^[a-zA-Z0-9-]{16,100}$/.test(key))
    throw new AppError(
      "IDEMPOTENCY_KEY",
      400,
      "A submission reference is required.",
    );
  return key;
}
