import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Storage helpers — Vercel Blob in production, local JSON file in dev
// ---------------------------------------------------------------------------

const USE_BLOB = !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB1_READ_WRITE_TOKEN);
const BLOB_PREFIX = "briefly-submissions/";

// Local-dev fallback
let devStore: object[] = [];
function getDevStore() { return devStore; }
function saveDevStore(data: object[]) { devStore = data; }

// Attempt to lazy-load the local JSON file once per cold-start in dev
import path from "path";
import fs from "fs";
const LOCAL_FILE = path.join(process.cwd(), "data", "submissions.json");
function localRead(): object[] {
  try {
    if (fs.existsSync(LOCAL_FILE)) return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf8"));
  } catch { /* ignore */ }
  return getDevStore();
}
function localWrite(submissions: object[]) {
  try {
    const dir = path.dirname(LOCAL_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_FILE, JSON.stringify(submissions, null, 2), "utf8");
  } catch { /* ignore */ }
  saveDevStore(submissions);
}

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB1_READ_WRITE_TOKEN;

async function blobWrite(submission: object & { id: string }) {
  const { put } = await import("@vercel/blob");
  await put(
    `${BLOB_PREFIX}${submission.id}.json`,
    JSON.stringify(submission),
    { access: "public", addRandomSuffix: false, token: BLOB_TOKEN }
  );
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData, brief } = body;

    const submission = {
      id: uuidv4(),
      submittedAt: new Date().toISOString(),
      formData,
      brief,
    };

    if (USE_BLOB) {
      try {
        await blobWrite(submission);
      } catch (blobErr) {
        console.error("submit-brief blob write failed:", blobErr);
      }
    } else {
      const existing = localRead() as object[];
      existing.unshift(submission);
      localWrite(existing);
    }

    // Send email if SMTP configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: smtpUser, pass: smtpPass },
      });

      const projectName = formData?.projectName || "Untitled Project";
      const clientName = formData?.clientName || "Client";
      const clientEmail = formData?.clientEmail || "";
      const companyName = formData?.companyName || "";
      const jobRole = formData?.jobRole || "";

      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, sans-serif; background: #040404; color: #f0ebe1; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
    .header { border-bottom: 1px solid #1e1e1e; padding-bottom: 24px; margin-bottom: 32px; }
    .logo { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #909090; }
    .logo span { color: #01ff00; }
    h1 { font-size: 28px; font-weight: 600; color: #f0ebe1; margin: 16px 0 4px; }
    .meta { font-size: 13px; color: #909090; }
    .section { margin-bottom: 24px; }
    .section-label { font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #909090; margin-bottom: 8px; }
    .section-content { font-size: 14px; line-height: 1.75; color: #d0cac2; }
    .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #1e1e1e; font-size: 11px; color: #333; text-align: center; }
    ul { padding-left: 20px; }
    li { margin-bottom: 6px; font-size: 14px; color: #d0cac2; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Briefly <span>/</span> Studio 858</div>
      <h1>${projectName}</h1>
      <div class="meta">
        ${clientName}${jobRole ? ` &middot; ${jobRole}` : ""}${companyName ? ` &middot; ${companyName}` : ""}
        ${clientEmail ? `<br>${clientEmail}` : ""}
      </div>
    </div>
    <div class="section">
      <div class="section-label">Project Overview</div>
      <div class="section-content">${brief?.projectOverview || ""}</div>
    </div>
    <div class="section">
      <div class="section-label">Objectives</div>
      <ul>${(brief?.objectives || []).map((o: string) => `<li>${o}</li>`).join("")}</ul>
    </div>
    <div class="section">
      <div class="section-label">Target Audience</div>
      <div class="section-content">${brief?.targetAudience || ""}</div>
    </div>
    <div class="section">
      <div class="section-label">Creative Direction</div>
      <div class="section-content">${brief?.creativeDirection || ""}</div>
    </div>
    <div class="section">
      <div class="section-label">Deliverables</div>
      <ul>${(brief?.deliverables || []).map((d: string) => `<li>${d}</li>`).join("")}</ul>
    </div>
    <div class="section">
      <div class="section-label">Timeline</div>
      <div class="section-content">${brief?.timeline || ""}</div>
    </div>
    <div class="section">
      <div class="section-label">Budget</div>
      <div class="section-content">${brief?.budget || ""}</div>
    </div>
    ${brief?.notes && brief.notes !== "No additional notes provided." ? `
    <div class="section">
      <div class="section-label">Additional Notes</div>
      <div class="section-content">${brief.notes}</div>
    </div>` : ""}
    <div class="footer">
      Generated by Briefly &middot; Studio 858 &middot; ${new Date().toLocaleDateString("en-IE")}
    </div>
  </div>
</body>
</html>`;

      try {
        await transporter.sendMail({
          from: `"Briefly / Studio 858" <${smtpUser}>`,
          to: "studio@858.ie",
          replyTo: clientEmail || undefined,
          subject: `New Brief: ${projectName}${companyName ? ` / ${companyName}` : ""}`,
          html: emailHtml,
        });
      } catch (emailErr) {
        console.error("submit-brief email error (non-fatal):", emailErr);
      }
    }

    return NextResponse.json({ success: true, id: (submission as { id: string }).id });
  } catch (err) {
    console.error("submit-brief error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
