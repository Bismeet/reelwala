import { ownedUpload, removeUpload } from "@/lib/server/uploads";
import { guard, responseError } from "@/lib/server/http";
export const runtime = "nodejs";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const row = await ownedUpload(request, (await params).id);
    return Response.json(
      {
        ok: true,
        uploadId: row.id,
        state: row.state,
        filename: row.filename,
        message: row.error,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return responseError(error);
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await guard(request, "upload");
    await removeUpload(request, (await params).id);
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return responseError(error);
  }
}
