import { createSession } from "@/lib/server/uploads";
import { guard, responseError } from "@/lib/server/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    await guard(request, "upload");
    const s = await createSession();
    return Response.json(
      { ok: true, expiresAt: s.expiresAt },
      { headers: { "Set-Cookie": s.cookie, "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return responseError(error);
  }
}
