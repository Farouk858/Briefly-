import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const DATA_FILE = path.join(process.cwd(), "data", "submissions.json");

function readSubmissions(): object[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeSubmissions(submissions: object[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2), "utf8");
}

export async function GET() {
  const submissions = readSubmissions();
  return NextResponse.json({ submissions });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const submissions = readSubmissions() as Array<{ id: string }>;
  const filtered = submissions.filter((s) => s.id !== id);
  writeSubmissions(filtered);
  return NextResponse.json({ success: true });
}
