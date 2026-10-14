import { applicationSchema, parseInput } from "@/lib/validation";
import {
  guard,
  idempotencyKey,
  jsonBody,
  responseError,
} from "@/lib/server/http";
import { saveIntake } from "@/lib/server/intake";
import { readSession } from "@/lib/server/uploads";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    await guard(request, "application");
    const input = parseInput(applicationSchema, await jsonBody(request));
    const session = await readSession(request);
    const result = await saveIntake(
      "application",
      input,
      idempotencyKey(request),
      session?.id,
    );
    return Response.json(
      { ok: true, status: "received", ...result },
      {
        status: result.replayed ? 200 : 201,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    return responseError(error);
  }
}
