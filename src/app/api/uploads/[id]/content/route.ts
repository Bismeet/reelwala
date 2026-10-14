import { receiveUpload } from "@/lib/server/uploads";
import { guard, responseError } from "@/lib/server/http";
export const runtime = "nodejs";
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await guard(request, "upload");
    return Response.json(
      { ok: true, ...(await receiveUpload(request, (await params).id)) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return responseError(error);
  }
}
