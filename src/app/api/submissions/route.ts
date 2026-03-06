import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_PREFIX = "briefly-submissions/";

// ---------------------------------------------------------------------------
// Local dev fallback (in-memory + filesystem)
// ---------------------------------------------------------------------------
import path from "path";
import fs from "fs";
const LOCAL_FILE = path.join(process.cwd(), "data", "submissions.json");

function localRead(): object[] {
  try {
    if (fs.existsSync(LOCAL_FILE)) return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf8"));
  } catch { /* ignore */ }
  return [];
}
function localWrite(data: object[]) {
  try {
    const dir = path.dirname(LOCAL_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch { /* ignore */ }
}

// ---------------------------------------------------------------------------
// Blob helpers
// ---------------------------------------------------------------------------
async function blobList() {
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: BLOB_PREFIX });
  return blobs;
}

async function fetchBlob(url: string) {
  const res = await fetch(url);
  return res.json();
}

// ---------------------------------------------------------------------------
// GET — list all submissions
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    if (USE_BLOB) {
      const blobs = await blobList();
      const submissions = await Promise.all(blobs.map((b) => fetchBlob(b.url)));
      submissions.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      return NextResponse.json({ submissions });
    } else {
      return NextResponse.json({ submissions: localRead() });
    }
  } catch (err) {
    console.error("submissions GET error:", err);
    return NextResponse.json({ submissions: [] });
  }
}

// ---------------------------------------------------------------------------
// DELETE — remove a submission by id
// ---------------------------------------------------------------------------
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (USE_BLOB) {
      const { del } = await import("@vercel/blob");
      const blobs = await blobList();
      const target = blobs.find((b) => b.pathname === `${BLOB_PREFIX}${id}.json`);
      if (target) await del(target.url);
    } else {
      const existing = localRead() as Array<{ id: string }>;
      localWrite(existing.filter((s) => s.id !== id));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("submissions DELETE error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
