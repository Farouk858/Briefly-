"use client";

import { useState } from "react";
import {
  FileText,
  Target,
  Users,
  Palette,
  Package,
  Clock,
  DollarSign,
  Link2,
  StickyNote,
  Copy,
  Check,
  Download,
  RotateCcw,
  Mail,
  Loader2,
  Briefcase,
} from "lucide-react";
import type { GeneratedBrief, BriefFormData } from "@/types/brief";

interface GeneratedBriefViewProps {
  brief: GeneratedBrief;
  formData: BriefFormData;
  onReset: () => void;
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accentBar?: boolean;
}

function Section({ icon, title, children, accentBar = false }: SectionProps) {
  return (
    <div
      className="glass-surface hover-glow"
      style={{
        borderRadius: "6px",
        padding: "clamp(20px, 3vw, 32px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {accentBar && (
        <div
          className="accent-glow"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "2px",
            height: "100%",
            background: "var(--accent)",
          }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <span style={{ color: "var(--accent)", opacity: 0.85, flexShrink: 0 }}>{icon}</span>
        <h3
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

export function GeneratedBriefView({ brief, formData, onReset }: GeneratedBriefViewProps) {
  const [copied, setCopied] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "saved" | "error">("idle");
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const generatePdfBlob = async (): Promise<{ blob: Blob; base64: string }> => {
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentW = pageW - margin * 2;
    let y = margin;

    // Background
    doc.setFillColor(4, 4, 4);
    doc.rect(0, 0, pageW, pageH, "F");

    const checkPageBreak = (needed: number) => {
      if (y + needed > pageH - margin) {
        doc.addPage();
        doc.setFillColor(4, 4, 4);
        doc.rect(0, 0, pageW, pageH, "F");
        y = margin;
      }
    };

    const drawAccentLine = (xPos: number, yPos: number, w: number) => {
      doc.setDrawColor(1, 255, 0);
      doc.setLineWidth(0.3);
      doc.line(xPos, yPos, xPos + w, yPos);
    };

    // Header block
    doc.setFillColor(15, 15, 15);
    doc.roundedRect(margin - 4, y - 4, contentW + 8, 38, 2, 2, "F");
    doc.setDrawColor(1, 255, 0);
    doc.setLineWidth(0.5);
    doc.line(margin - 4, y - 4, margin - 4, y + 34);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.text("BRIEFLY / STUDIO 858", margin + 4, y + 2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(240, 235, 225);
    doc.text(formData.projectName || "Untitled Project", margin + 4, y + 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    const metaParts = [
      formData.clientName,
      formData.jobRole,
      formData.companyName,
    ].filter(Boolean);
    doc.text(metaParts.join("  /  "), margin + 4, y + 22);
    doc.text(`Generated ${formatDate(brief.generatedAt)}`, margin + 4, y + 29);

    y += 48;

    // Sections
    const addSection = (title: string, content: string | string[]) => {
      const isArray = Array.isArray(content);
      const lineCount = isArray
        ? content.length
        : doc.splitTextToSize(content, contentW - 12).length;
      const blockH = 14 + lineCount * 6 + 10;
      checkPageBreak(blockH);

      doc.setFillColor(8, 8, 8);
      doc.roundedRect(margin, y, contentW, blockH, 2, 2, "F");
      drawAccentLine(margin, y + 12, 30);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(180, 180, 180);
      doc.text(title.toUpperCase(), margin + 4, y + 8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(208, 202, 194);

      if (isArray) {
        content.forEach((item, idx) => {
          doc.setTextColor(1, 255, 0);
          doc.text(`${idx + 1}`, margin + 4, y + 16 + idx * 6);
          doc.setTextColor(208, 202, 194);
          const wrapped = doc.splitTextToSize(item, contentW - 20);
          doc.text(wrapped, margin + 10, y + 16 + idx * 6);
        });
      } else {
        const wrapped = doc.splitTextToSize(content, contentW - 8);
        doc.text(wrapped, margin + 4, y + 16);
      }

      y += blockH + 4;
    };

    addSection("Project Overview", brief.projectOverview);
    addSection("Objectives", brief.objectives);

    checkPageBreak(60);
    const halfW = (contentW - 4) / 2;

    // Two-column row
    const twoCol = (leftTitle: string, leftContent: string, rightTitle: string, rightContent: string) => {
      const leftLines = doc.splitTextToSize(leftContent, halfW - 12).length;
      const rightLines = doc.splitTextToSize(rightContent, halfW - 12).length;
      const blockH = 14 + Math.max(leftLines, rightLines) * 6 + 10;
      checkPageBreak(blockH);

      [
        { title: leftTitle, content: leftContent, x: margin },
        { title: rightTitle, content: rightContent, x: margin + halfW + 4 },
      ].forEach(({ title, content, x }) => {
        doc.setFillColor(8, 8, 8);
        doc.roundedRect(x, y, halfW, blockH, 2, 2, "F");
        drawAccentLine(x, y + 12, 24);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(180, 180, 180);
        doc.text(title.toUpperCase(), x + 4, y + 8);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(208, 202, 194);
        const wrapped = doc.splitTextToSize(content, halfW - 8);
        doc.text(wrapped, x + 4, y + 16);
      });

      y += blockH + 4;
    };

    twoCol("Target Audience", brief.targetAudience, "Creative Direction", brief.creativeDirection);
    addSection("Deliverables", brief.deliverables);
    twoCol("Timeline", brief.timeline, "Budget", brief.budget);

    if (brief.technicalRequirements) {
      addSection("Technical Requirements", brief.technicalRequirements);
    }

    if (brief.notes && brief.notes !== "No additional notes provided.") {
      addSection("Additional Notes", brief.notes);
    }

    if (brief.references.length > 0) {
      const refContent = brief.references.map((r) =>
        `${r.label || r.url}${r.notes ? ` - ${r.notes}` : ""}`
      );
      addSection("References", refContent);
    }

    // Footer
    checkPageBreak(16);
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("Generated by Briefly / Studio 858", margin, pageH - 10);
    doc.setTextColor(1, 255, 0);
    doc.text("studio@858.ie", pageW - margin - 22, pageH - 10);

    const blob = doc.output("blob");
    const base64 = doc.output("datauristring").split(",")[1];
    return { blob, base64 };
  };

  const handleSubmitBrief = async () => {
    if (submitStatus === "sending" || submitStatus === "saved") return;
    setSubmitStatus("sending");
    try {
      const res = await fetch("/api/submit-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, brief }),
      });
      setSubmitStatus(res.ok ? "saved" : "error");
    } catch {
      setSubmitStatus("error");
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const { blob } = await generatePdfBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `brief-${(formData.projectName || "project").toLowerCase().replace(/\s+/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const buildCopyText = () => {
    const lines = [
      `PROJECT BRIEF: ${formData.projectName || "Untitled Project"}`,
      `Prepared by: ${formData.clientName}${formData.jobRole ? ` (${formData.jobRole})` : ""}`,
      `Company: ${formData.companyName || "N/A"}`,
      `Generated: ${formatDate(brief.generatedAt)}`,
      ``,
      `PROJECT OVERVIEW`,
      brief.projectOverview,
      ``,
      `OBJECTIVES`,
      ...brief.objectives.map((o) => `  ${o}`),
      ``,
      `TARGET AUDIENCE`,
      brief.targetAudience,
      ``,
      `CREATIVE DIRECTION`,
      brief.creativeDirection,
      ``,
      `DELIVERABLES`,
      ...brief.deliverables.map((d) => `  ${d}`),
      ``,
      `TIMELINE`,
      brief.timeline,
      ``,
      `BUDGET`,
      brief.budget,
      ``,
      ...(brief.references.length > 0
        ? [
            `REFERENCES`,
            ...brief.references.map((r) => `  ${r.label}: ${r.url}${r.notes ? ` - ${r.notes}` : ""}`),
            ``,
          ]
        : []),
      `TECHNICAL REQUIREMENTS`,
      brief.technicalRequirements,
      ``,
      `ADDITIONAL NOTES`,
      brief.notes,
      ``,
      `Generated by Briefly / Studio 858`,
    ];
    return lines.join("\n");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildCopyText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bodyText: React.CSSProperties = {
    fontSize: "14px",
    lineHeight: 1.75,
    color: "var(--foreground)",
  };

  const submitLabel = {
    idle: null,
    sending: "Saving...",
    saved: "Saved to portal",
    error: "Save failed — try again",
  };

  return (
    <div className="animate-fade-in">
      {/* Hero header */}
      <div
        style={{
          marginBottom: "40px",
          paddingBottom: "40px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--accent)",
            fontFamily: "var(--font-dm-sans), sans-serif",
            marginBottom: "16px",
          }}
        >
          Project Brief
        </p>

        <h1
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(36px, 7vw, 60px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: "var(--foreground)",
            marginBottom: "12px",
          }}
        >
          {formData.projectName || "Untitled Project"}
        </h1>

        {/* Client meta */}
        <div style={{ marginBottom: "20px" }}>
          {(formData.companyName || formData.clientName) && (
            <p style={{ fontSize: "14px", color: "var(--muted-foreground)", marginBottom: "3px" }}>
              {formData.companyName || formData.clientName}
              {formData.jobRole && (
                <span style={{ opacity: 0.6 }}> &middot; {formData.jobRole}</span>
              )}
            </p>
          )}
          {formData.clientEmail && (
            <p style={{ fontSize: "12px", color: "var(--muted-foreground)", opacity: 0.6 }}>
              {formData.clientEmail}
            </p>
          )}
          <p
            style={{
              fontSize: "11px",
              color: "var(--muted-foreground)",
              letterSpacing: "0.04em",
              opacity: 0.5,
              fontFamily: "var(--font-mono), monospace",
              marginTop: "4px",
            }}
          >
            Generated {formatDate(brief.generatedAt)}
          </p>
        </div>

        {/* Submit status badge (shown only after an attempt) */}
        {submitLabel[submitStatus] && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "4px",
              background: submitStatus === "saved"
                ? "rgba(1, 255, 0, 0.06)"
                : submitStatus === "error"
                ? "rgba(255, 100, 100, 0.06)"
                : "rgba(240, 235, 225, 0.04)",
              border: `1px solid ${
                submitStatus === "saved"
                  ? "rgba(1, 255, 0, 0.15)"
                  : submitStatus === "error"
                  ? "rgba(255, 100, 100, 0.15)"
                  : "var(--border)"
              }`,
              marginBottom: "16px",
            }}
          >
            {submitStatus === "sending" && <Loader2 size={11} className="animate-spin" style={{ color: "var(--muted-foreground)" }} />}
            {submitStatus === "saved" && <Check size={11} style={{ color: "var(--accent)" }} />}
            {submitStatus === "error" && <Mail size={11} style={{ color: "rgba(255,100,100,0.7)" }} />}
            <span
              style={{
                fontSize: "11px",
                color: submitStatus === "saved" ? "var(--accent)" : submitStatus === "error" ? "rgba(255,120,120,0.9)" : "var(--muted-foreground)",
                fontFamily: "var(--font-dm-sans), sans-serif",
              }}
            >
              {submitLabel[submitStatus]}
            </span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <button
            onClick={handleCopy}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "3px",
              color: copied ? "var(--accent)" : "var(--muted-foreground)",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "var(--font-dm-sans), sans-serif",
            }}
            onMouseEnter={(e) => { if (!copied) e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={(e) => { if (!copied) e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "3px",
              color: "var(--muted-foreground)",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: downloadingPdf ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              fontFamily: "var(--font-dm-sans), sans-serif",
              opacity: downloadingPdf ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { if (!downloadingPdf) e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={(e) => { if (!downloadingPdf) e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            {downloadingPdf ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
            {downloadingPdf ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Brief Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Section icon={<FileText size={14} />} title="Project Overview" accentBar>
          <p style={bodyText}>{brief.projectOverview}</p>
        </Section>

        <Section icon={<Target size={14} />} title="Objectives">
          <ul style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {brief.objectives.map((obj, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: "2px",
                    color: "var(--accent)",
                    background: "rgba(1, 255, 0, 0.08)",
                    borderRadius: "2px",
                    fontFamily: "var(--font-mono), monospace",
                  }}
                >
                  {i + 1}
                </span>
                <p style={bodyText}>{obj}</p>
              </li>
            ))}
          </ul>
        </Section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "10px",
          }}
        >
          <Section icon={<Users size={14} />} title="Target Audience">
            <p style={bodyText}>{brief.targetAudience}</p>
          </Section>

          <Section icon={<Palette size={14} />} title="Creative Direction">
            <p style={bodyText}>{brief.creativeDirection}</p>
          </Section>
        </div>

        {(formData.clientName || formData.jobRole || formData.companyName) && (
          <Section icon={<Briefcase size={14} />} title="Client Details">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {formData.clientName && (
                <p style={bodyText}>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Name: </span>
                  {formData.clientName}
                </p>
              )}
              {formData.jobRole && (
                <p style={bodyText}>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Role: </span>
                  {formData.jobRole}
                </p>
              )}
              {formData.companyName && (
                <p style={bodyText}>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Company: </span>
                  {formData.companyName}
                </p>
              )}
              {formData.clientEmail && (
                <p style={bodyText}>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>Email: </span>
                  {formData.clientEmail}
                </p>
              )}
            </div>
          </Section>
        )}

        <Section icon={<Package size={14} />} title="Deliverables">
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {brief.deliverables.map((d, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    flexShrink: 0,
                    marginTop: "9px",
                    boxShadow: "0 0 6px rgba(1, 255, 0, 0.5)",
                  }}
                />
                <p style={bodyText}>{d}</p>
              </li>
            ))}
          </ul>
        </Section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px",
          }}
        >
          <Section icon={<Clock size={14} />} title="Timeline">
            <p style={bodyText}>{brief.timeline}</p>
          </Section>

          <Section icon={<DollarSign size={14} />} title="Budget">
            <p style={bodyText}>{brief.budget}</p>
          </Section>
        </div>

        {brief.references.length > 0 && (
          <Section icon={<Link2 size={14} />} title="References">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {brief.references.map((ref) => (
                <div key={ref.id} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--accent)",
                      textDecoration: "none",
                      transition: "opacity 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    {ref.label || ref.url}
                  </a>
                  {ref.notes && (
                    <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{ref.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section icon={<FileText size={14} />} title="Technical Requirements">
          <p style={bodyText}>{brief.technicalRequirements}</p>
        </Section>

        {brief.notes && brief.notes !== "No additional notes provided." && (
          <Section icon={<StickyNote size={14} />} title="Additional Notes">
            <p style={bodyText}>{brief.notes}</p>
          </Section>
        )}

        {(formData.uploadedFiles.length > 0 || formData.existingBrief.length > 0) && (
          <Section icon={<FileText size={14} />} title="Attached Files">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[...formData.existingBrief, ...formData.uploadedFiles].map((file) => (
                <div key={file.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      flexShrink: 0,
                    }}
                  />
                  <p style={{ fontSize: "14px", color: "var(--foreground)" }}>{file.name}</p>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                      fontFamily: "var(--font-mono), monospace",
                    }}
                  >
                    ({(file.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Footer CTA */}
      <div
        style={{
          marginTop: "48px",
          paddingTop: "32px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Primary action — Save to Portal */}
        <button
          onClick={handleSubmitBrief}
          disabled={submitStatus === "sending" || submitStatus === "saved"}
          className={submitStatus !== "saved" ? "glow-button" : undefined}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "16px 28px",
            background: submitStatus === "saved"
              ? "rgba(1, 255, 0, 0.08)"
              : "var(--accent)",
            border: `1px solid ${submitStatus === "saved" ? "rgba(1,255,0,0.25)" : "var(--accent)"}`,
            borderRadius: "4px",
            color: submitStatus === "saved" ? "var(--accent)" : "var(--background)",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: submitStatus === "sending" || submitStatus === "saved" ? "not-allowed" : "pointer",
            transition: "all 0.25s ease",
            fontFamily: "var(--font-dm-sans), sans-serif",
            opacity: submitStatus === "sending" ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (submitStatus === "idle" || submitStatus === "error") {
              e.currentTarget.style.background = "var(--accent-light)";
              e.currentTarget.style.borderColor = "var(--accent-light)";
            }
          }}
          onMouseLeave={(e) => {
            if (submitStatus === "idle" || submitStatus === "error") {
              e.currentTarget.style.background = "var(--accent)";
              e.currentTarget.style.borderColor = "var(--accent)";
            }
          }}
        >
          {submitStatus === "sending" && <Loader2 size={14} className="animate-spin" />}
          {submitStatus === "saved" && <Check size={14} />}
          {submitStatus === "error" && <Mail size={14} />}
          {submitStatus === "idle" && <Mail size={14} />}
          {submitStatus === "saved"
            ? "Brief saved to portal"
            : submitStatus === "sending"
            ? "Saving to portal..."
            : submitStatus === "error"
            ? "Retry — save to portal"
            : "Save to portal"}
        </button>

        {/* Secondary actions */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={onReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "3px",
              color: "var(--muted-foreground)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "var(--font-dm-sans), sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--muted-foreground)";
              e.currentTarget.style.color = "var(--foreground)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--muted-foreground)";
            }}
          >
            <RotateCcw size={12} />
            New Brief
          </button>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={handleCopy}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "3px",
                color: copied ? "var(--accent)" : "var(--foreground)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-dm-sans), sans-serif",
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy Brief"}
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "3px",
                color: "var(--foreground)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: downloadingPdf ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-dm-sans), sans-serif",
                opacity: downloadingPdf ? 0.6 : 1,
              }}
              onMouseEnter={(e) => { if (!downloadingPdf) e.currentTarget.style.borderColor = "var(--accent)"; }}
              onMouseLeave={(e) => { if (!downloadingPdf) e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              {downloadingPdf ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
              {downloadingPdf ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
