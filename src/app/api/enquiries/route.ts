import { enquirySchema, parseInput } from "@/lib/validation";
import {
  guard,
  idempotencyKey,
  jsonBody,
  responseError,
} from "@/lib/server/http";
import { saveIntake } from "@/lib/server/intake";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    await guard(request, "enquiry");
    const input = parseInput(enquirySchema, await jsonBody(request));
    const result = await saveIntake("enquiry", input, idempotencyKey(request));
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
