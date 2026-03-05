import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  // Set PORTAL_PASSWORD in .env.local — defaults to "studio858" if not set
  const correct = process.env.PORTAL_PASSWORD || "studio858";

  if (password === correct) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
