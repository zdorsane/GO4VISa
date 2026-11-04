import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { can, getAdmin } from "@/lib/server/auth";
import { MAX_PDF_BYTES } from "@/lib/server/pdf-import";

/**
 * Signs the browser's direct upload of a PDF to Blob storage, so large files skip the
 * 4.5 MB request limit of server functions. Only signed-in back-office users get a token.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const admin = await getAdmin();
        if (!admin || !can(admin.role, "edit")) throw new Error("unauthorized");
        if (!pathname.startsWith("imports/")) throw new Error("bad-path");
        return { allowedContentTypes: ["application/pdf"], maximumSizeInBytes: MAX_PDF_BYTES, addRandomSuffix: true };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "upload" }, { status: 400 });
  }
}
