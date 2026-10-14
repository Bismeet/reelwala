import { authorizeUpload } from "@/lib/server/uploads";
import { guard, jsonBody, responseError } from "@/lib/server/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    await guard(request, "upload");
    return Response.json(
      {
        ok: true,
        ...(await authorizeUpload(request, await jsonBody(request))),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return responseError(error);
  }
}
