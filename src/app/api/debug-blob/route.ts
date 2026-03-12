import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const token1 = process.env.BLOB1_READ_WRITE_TOKEN;
  const token2 = process.env.BLOB_READ_WRITE_TOKEN;
  const activeToken = token1 || token2;

  const result: Record<string, unknown> = {
    BLOB1_READ_WRITE_TOKEN: token1 ? `set (${token1.slice(0, 8)}...)` : "not set",
    BLOB_READ_WRITE_TOKEN: token2 ? `set (${token2.slice(0, 8)}...)` : "not set",
    activeToken: activeToken ? `${activeToken.slice(0, 8)}...` : "none",
  };

  if (activeToken) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "briefly-submissions/", token: activeToken });
      result.blobCount = blobs.length;
      result.blobs = blobs.map((b) => b.pathname);
    } catch (err) {
      result.listError = String(err);
    }

    // Test write
    try {
      const { put, del } = await import("@vercel/blob");
      const testBlob = await put("briefly-submissions/debug-test.json", JSON.stringify({ test: true }), {
        access: "private",
        addRandomSuffix: false,
        token: activeToken,
      });
      await del(testBlob.url, { token: activeToken });
      result.writeTest = "success";
    } catch (err) {
      result.writeError = String(err);
    }
  }

  return NextResponse.json(result);
}
