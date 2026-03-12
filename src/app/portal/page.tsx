"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Paperclip,
  Image,
  Film,
  Clock,
  Users,
  ChevronRight,
  X,
  Trash2,
  Download,
  RefreshCw,
  Calendar,
  Target,
  Palette,
  Link2,
  Briefcase,
  Mail,
  Building2,
  StickyNote,
  Save,
  Loader2,
  Package,
  DollarSign,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import type { BriefFormData, GeneratedBrief } from "@/types/brief";

interface Submission {
  id: string;
  submittedAt: string;
  formData: BriefFormData;
  brief: GeneratedBrief;
  studioNotes?: string;
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div
      className="glass-surface hover-glow"
      style={{
        padding: "20px 24px",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "var(--accent)", opacity: 0.7 }}>{icon}</span>
        <span
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--foreground)",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
      </div>
      <p
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--muted-foreground)",
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}
      >
        {label}
      </p>
    </div>
  );
}

function BriefDetailPanel({
  submission,
  onClose,
  onDelete,
  onNotesUpdate,
}: {
  submission: Submission;
  onClose: () => void;
  onDelete: (id: string) => void;
  onNotesUpdate: (id: string, notes: string) => void;
}) {
  const { formData, brief } = submission;
  const [studioNotes, setStudioNotes] = useState(submission.studioNotes || "");
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IE", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSaveNotes = async () => {
    setNotesSaving(true);
    try {
      await fetch("/api/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: submission.id, studioNotes }),
      });
      onNotesUpdate(submission.id, studioNotes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } finally {
      setNotesSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentW = pageW - margin * 2;
      let y = margin;

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

      // Header
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
      const metaParts = [formData.clientName, formData.jobRole, formData.companyName].filter(Boolean);
      doc.text(metaParts.join("  /  "), margin + 4, y + 22);
      doc.text(`Submitted ${formatDate(submission.submittedAt)}`, margin + 4, y + 29);
      y += 48;

      const addSection = (title: string, content: string | string[]) => {
        const isArray = Array.isArray(content);
        const lineCount = isArray ? content.length : doc.splitTextToSize(content, contentW - 12).length;
        const blockH = 14 + lineCount * 6 + 10;
        checkPageBreak(blockH);
        doc.setFillColor(8, 8, 8);
        doc.roundedRect(margin, y, contentW, blockH, 2, 2, "F");
        doc.setDrawColor(1, 255, 0);
        doc.setLineWidth(0.3);
        doc.line(margin, y + 12, margin + 30, y + 12);
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
            doc.text(doc.splitTextToSize(item, contentW - 20), margin + 10, y + 16 + idx * 6);
          });
        } else {
          doc.text(doc.splitTextToSize(content, contentW - 8), margin + 4, y + 16);
        }
        y += blockH + 4;
      };

      addSection("Project Overview", brief.projectOverview);
      addSection("Objectives", brief.objectives);
      addSection("Target Audience", brief.targetAudience);
      addSection("Creative Direction", brief.creativeDirection);
      addSection("Deliverables", brief.deliverables);
      addSection("Timeline", brief.timeline);
      addSection("Budget", brief.budget);
      if (brief.technicalRequirements) addSection("Technical Requirements", brief.technicalRequirements);
      if (brief.notes && brief.notes !== "No additional notes provided.") addSection("Client Notes", brief.notes);
      if (studioNotes) addSection("Studio Notes", studioNotes);

      doc.save(`brief-${(formData.projectName || "project").toLowerCase().replace(/\s+/g, "-")}.pdf`);
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const card: React.CSSProperties = {
    borderRadius: "6px",
    padding: "16px 18px",
    background: "rgba(255,255,255,0.025)",
    border: "1px solid var(--border)",
    borderLeft: "3px solid var(--accent)",
  };

  const label: React.CSSProperties = {
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--muted-foreground)",
    fontFamily: "var(--font-dm-sans), sans-serif",
    marginBottom: "8px",
  };

  const body: React.CSSProperties = {
    fontSize: "13px",
    lineHeight: 1.75,
    color: "var(--foreground)",
    opacity: 0.85,
  };

  return (
    <motion.div
      key="detail-panel"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "clamp(340px, 48vw, 680px)",
        background: "rgba(6, 6, 6, 0.98)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        borderLeft: "1px solid var(--border)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexShrink: 0 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "6px", fontFamily: "var(--font-dm-sans), sans-serif" }}>
            Project Brief
          </p>
          <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 600, color: "var(--foreground)", lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {formData.projectName || "Untitled Project"}
          </h2>
          <p style={{ fontSize: "11px", color: "var(--muted-foreground)", opacity: 0.6, marginTop: "4px" }}>
            {formatDate(submission.submittedAt)}
          </p>
        </div>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            title="Download PDF"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", background: "transparent", border: "1px solid var(--border)", borderRadius: "3px", color: "var(--muted-foreground)", cursor: "pointer", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
          >
            {downloadingPdf ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          </button>
          <button
            onClick={() => onDelete(submission.id)}
            title="Delete"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", background: "transparent", border: "1px solid var(--border)", borderRadius: "3px", color: "var(--muted-foreground)", cursor: "pointer", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,80,80,0.4)"; e.currentTarget.style.color = "rgba(255,80,80,0.8)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={onClose}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", background: "transparent", border: "1px solid var(--border)", borderRadius: "3px", color: "var(--muted-foreground)", cursor: "pointer", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--muted-foreground)"; e.currentTarget.style.color = "var(--foreground)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* Client strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px" }}>
            {[
              { icon: <Users size={11} />, value: formData.clientName },
              formData.jobRole ? { icon: <Briefcase size={11} />, value: formData.jobRole } : null,
              formData.companyName ? { icon: <Building2 size={11} />, value: formData.companyName } : null,
              formData.clientEmail ? { icon: <Mail size={11} />, value: formData.clientEmail, href: `mailto:${formData.clientEmail}` } : null,
            ].filter(Boolean).map((item, i) => item && (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 10px", background: "rgba(1,255,0,0.04)", border: "1px solid rgba(1,255,0,0.1)", borderRadius: "4px" }}>
                <span style={{ color: "var(--accent)", opacity: 0.7, flexShrink: 0 }}>{item.icon}</span>
                {item.href ? (
                  <a href={item.href} style={{ fontSize: "11px", color: "var(--accent)", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.value}</a>
                ) : (
                  <span style={{ fontSize: "11px", color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.value}</span>
                )}
              </div>
            ))}
          </div>

          {/* Project types */}
          {formData.projectType?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {formData.projectType.map((t: string) => (
                <span key={t} style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", padding: "4px 10px", borderRadius: "20px", background: "rgba(1,255,0,0.08)", border: "1px solid rgba(1,255,0,0.2)", color: "var(--accent)", fontFamily: "var(--font-dm-sans), sans-serif" }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <FileText size={11} style={{ color: "var(--accent)" }} />
              <p style={{ ...label, marginBottom: 0 }}>Project Overview</p>
            </div>
            <p style={body}>{brief.projectOverview}</p>
          </div>

          {/* Objectives */}
          <div style={{ ...card, borderLeftColor: "#4af" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <Target size={11} style={{ color: "#4af" }} />
              <p style={{ ...label, marginBottom: 0 }}>Objectives</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {brief.objectives.map((obj, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "9px", fontWeight: 700, color: "#4af", fontFamily: "var(--font-mono), monospace", marginTop: "4px", flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                  <p style={body}>{obj}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Target audience */}
          <div style={{ ...card, borderLeftColor: "#a4f" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <Users size={11} style={{ color: "#a4f" }} />
              <p style={{ ...label, marginBottom: 0 }}>Target Audience</p>
            </div>
            <p style={body}>{brief.targetAudience}</p>
          </div>

          {/* Creative direction */}
          <div style={{ ...card, borderLeftColor: "#fa4" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <Palette size={11} style={{ color: "#fa4" }} />
              <p style={{ ...label, marginBottom: 0 }}>Creative Direction</p>
            </div>
            <p style={body}>{brief.creativeDirection}</p>
          </div>

          {/* Deliverables */}
          <div style={{ ...card, borderLeftColor: "var(--accent)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <Package size={11} style={{ color: "var(--accent)" }} />
              <p style={{ ...label, marginBottom: 0 }}>Deliverables</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {brief.deliverables.map((d, i) => (
                <span key={i} style={{ fontSize: "11px", padding: "5px 10px", borderRadius: "4px", background: "rgba(1,255,0,0.06)", border: "1px solid rgba(1,255,0,0.15)", color: "var(--foreground)", lineHeight: 1.4 }}>
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline + Budget */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={{ padding: "16px", borderRadius: "6px", background: "rgba(255,200,60,0.05)", border: "1px solid rgba(255,200,60,0.2)", textAlign: "center" }}>
              <Calendar size={16} style={{ color: "#fc3", margin: "0 auto 6px" }} />
              <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fc3", fontFamily: "var(--font-dm-sans), sans-serif", marginBottom: "4px" }}>Timeline</p>
              <p style={{ fontSize: "12px", color: "var(--foreground)", lineHeight: 1.4 }}>{brief.timeline}</p>
            </div>
            <div style={{ padding: "16px", borderRadius: "6px", background: "rgba(60,255,120,0.05)", border: "1px solid rgba(60,255,120,0.2)", textAlign: "center" }}>
              <DollarSign size={16} style={{ color: "#3f8", margin: "0 auto 6px" }} />
              <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3f8", fontFamily: "var(--font-dm-sans), sans-serif", marginBottom: "4px" }}>Budget</p>
              <p style={{ fontSize: "12px", color: "var(--foreground)", lineHeight: 1.4 }}>{brief.budget}</p>
            </div>
          </div>

          {/* Technical requirements */}
          {brief.technicalRequirements && (
            <div style={card}>
              <p style={label}>Technical Requirements</p>
              <p style={body}>{brief.technicalRequirements}</p>
            </div>
          )}

          {/* References */}
          {brief.references?.length > 0 && (
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                <Link2 size={11} style={{ color: "var(--accent)" }} />
                <p style={{ ...label, marginBottom: 0 }}>References</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {brief.references.map((ref) => (
                  <div key={ref.id} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: "6px" }} />
                    <div>
                      <a href={ref.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
                        {ref.label || ref.url}
                      </a>
                      {ref.notes && <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "2px" }}>{ref.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attached files */}
          {((formData.uploadedFiles?.length > 0) || (formData.existingBrief?.length > 0)) && (
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                <Paperclip size={11} style={{ color: "var(--accent)" }} />
                <p style={{ ...label, marginBottom: 0 }}>Attached Files</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[...(formData.existingBrief || []), ...(formData.uploadedFiles || [])].map((file) => {
                  const isImage = file.type?.startsWith("image/");
                  const isVideo = file.type?.startsWith("video/");
                  const IconComp = isImage ? Image : isVideo ? Film : FileText;
                  const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
                  return (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "5px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", textDecoration: "none" }}
                    >
                      {isImage && file.preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={file.preview} alt={file.name} style={{ width: "32px", height: "32px", borderRadius: "3px", objectFit: "cover", flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: "32px", height: "32px", borderRadius: "3px", background: "rgba(1,255,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <IconComp size={14} style={{ color: "var(--accent)" }} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "12px", color: "var(--foreground)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                        <p style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>{formatSize(file.size)}</p>
                      </div>
                      <Download size={11} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Client notes */}
          {brief.notes && brief.notes !== "No additional notes provided." && (
            <div style={card}>
              <p style={label}>Client Notes</p>
              <p style={body}>{brief.notes}</p>
            </div>
          )}

          {/* Studio notes */}
          <div style={{ borderRadius: "6px", padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "3px solid rgba(255,255,255,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <StickyNote size={11} style={{ color: "var(--muted-foreground)" }} />
              <p style={{ ...label, marginBottom: 0 }}>Studio Notes</p>
              <span style={{ fontSize: "9px", color: "var(--muted-foreground)", opacity: 0.5, marginLeft: "auto" }}>Private — not shared with client</span>
            </div>
            <textarea
              value={studioNotes}
              onChange={(e) => setStudioNotes(e.target.value)}
              placeholder="Add your internal notes, ideas, or next steps..."
              rows={4}
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", resize: "vertical", fontSize: "13px", lineHeight: 1.7, color: "var(--foreground)", opacity: 0.8, fontFamily: "var(--font-dm-sans), sans-serif" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <button
                onClick={handleSaveNotes}
                disabled={notesSaving}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", background: notesSaved ? "rgba(1,255,0,0.1)" : "transparent", border: `1px solid ${notesSaved ? "rgba(1,255,0,0.3)" : "var(--border)"}`, borderRadius: "3px", color: notesSaved ? "var(--accent)" : "var(--muted-foreground)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s ease", fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                {notesSaving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                {notesSaved ? "Saved" : "Save Notes"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

export default function Portal() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);

  const handleNotesUpdate = (id: string, notes: string) => {
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, studioNotes: notes } : s));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, studioNotes: notes } : prev);
  };

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("portal_auth") === "1") {
        setAuthed(true);
      } else {
        window.location.href = "/portal/login";
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("portal_auth");
    window.location.href = "/portal/login";
  };

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/submissions");
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await fetch("/api/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (selected?.id === id) setSelected(null);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = submissions.filter((s) => {
    const q = search.toLowerCase();
    return (
      !q ||
      s.formData.projectName?.toLowerCase().includes(q) ||
      s.formData.clientName?.toLowerCase().includes(q) ||
      s.formData.companyName?.toLowerCase().includes(q) ||
      s.formData.clientEmail?.toLowerCase().includes(q) ||
      s.formData.jobRole?.toLowerCase().includes(q)
    );
  });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-IE", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Stats
  const thisMonth = submissions.filter((s) => {
    const d = new Date(s.submittedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const uniqueClients = new Set(submissions.map((s) => s.formData.companyName || s.formData.clientName)).size;

  // Don't render until auth is confirmed (prevents flash)
  if (!authed) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Ambient background */}
      <div
        className="aurora-bg"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(1, 255, 0, 0.04) 0%, transparent 60%)",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        className="liquid-glass"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "0 clamp(20px, 5vw, 48px)",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Logo size="sm" />
          <div
            style={{
              height: "16px",
              width: "1px",
              background: "var(--border)",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <LayoutDashboard size={13} style={{ color: "var(--accent)", opacity: 0.8 }} />
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--muted-foreground)",
                fontFamily: "var(--font-dm-sans), sans-serif",
              }}
            >
              Submissions Portal
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={fetchSubmissions}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "3px",
              color: "var(--muted-foreground)",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "var(--font-dm-sans), sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--muted-foreground)";
            }}
          >
            <RefreshCw size={11} />
            Refresh
          </button>
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              background: "var(--accent)",
              border: "1px solid var(--accent)",
              borderRadius: "3px",
              color: "var(--background)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.2s ease",
              fontFamily: "var(--font-dm-sans), sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-light)";
              e.currentTarget.style.borderColor = "var(--accent-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--accent)";
              e.currentTarget.style.borderColor = "var(--accent)";
            }}
          >
            New Brief
          </a>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "3px",
              color: "var(--muted-foreground)",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "var(--font-dm-sans), sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,80,80,0.4)";
              e.currentTarget.style.color = "rgba(255,100,100,0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--muted-foreground)";
            }}
          >
            Log out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(28px, 5vw, 56px) clamp(20px, 5vw, 48px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "36px" }}
        >
          <h1
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--foreground)",
              lineHeight: 1.1,
              marginBottom: "8px",
            }}
          >
            Brief{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Submissions</em>
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
            All client brief submissions, in one place.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "10px",
            marginBottom: "28px",
          }}
        >
          <StatCard label="Total Briefs" value={submissions.length} icon={<FileText size={16} />} />
          <StatCard label="This Month" value={thisMonth} icon={<Calendar size={16} />} />
          <StatCard label="Unique Clients" value={uniqueClients} icon={<Users size={16} />} />
          <StatCard
            label="Latest"
            value={
              submissions.length > 0
                ? formatDate(submissions[0].submittedAt)
                : "None yet"
            }
            icon={<Clock size={16} />}
          />
        </motion.div>

        {/* Search + table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Search */}
          <div style={{ marginBottom: "16px" }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project, client, company..."
              style={{
                width: "100%",
                maxWidth: "400px",
                background: "var(--surface-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                padding: "10px 16px",
                color: "var(--foreground)",
                fontSize: "13px",
                fontFamily: "var(--font-dm-sans), sans-serif",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(1, 255, 0, 0.3)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Table */}
          <div
            className="glass-surface"
            style={{ borderRadius: "6px", overflow: "hidden" }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 160px 160px 120px 80px",
                gap: "0",
                padding: "12px 20px",
                borderBottom: "1px solid var(--border)",
                background: "rgba(0, 0, 0, 0.3)",
              }}
            >
              {["Project", "Client", "Company", "Submitted", ""].map((col) => (
                <span
                  key={col}
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--muted-foreground)",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                  }}
                >
                  {col}
                </span>
              ))}
            </div>

            {/* Rows */}
            {loading ? (
              <div
                style={{
                  padding: "48px 20px",
                  textAlign: "center",
                  color: "var(--muted-foreground)",
                  fontSize: "13px",
                }}
              >
                Loading submissions...
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  padding: "64px 20px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FileText size={32} style={{ color: "var(--border)" }} />
                <p style={{ fontSize: "14px", color: "var(--muted-foreground)" }}>
                  {search ? "No results found" : "No submissions yet"}
                </p>
                {!search && (
                  <p style={{ fontSize: "12px", color: "var(--muted-foreground)", opacity: 0.6 }}>
                    Briefs submitted via the intake form will appear here.
                  </p>
                )}
              </div>
            ) : (
              <AnimatePresence>
                {filtered.map((submission, i) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelected(submission)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 160px 160px 120px 80px",
                      gap: "0",
                      padding: "16px 20px",
                      borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                      cursor: "pointer",
                      transition: "background 0.2s ease",
                      background:
                        selected?.id === submission.id
                          ? "rgba(1, 255, 0, 0.03)"
                          : "transparent",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => {
                      if (selected?.id !== submission.id) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selected?.id !== submission.id) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {/* Project */}
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: selected?.id === submission.id ? "var(--accent)" : "var(--foreground)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {submission.formData.projectName || "Untitled"}
                      </p>
                      {submission.formData.projectType?.length > 0 && (
                        <p
                          style={{
                            fontSize: "10px",
                            color: "var(--muted-foreground)",
                            marginTop: "2px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {submission.formData.projectType.join(", ")}
                        </p>
                      )}
                    </div>

                    {/* Client */}
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "var(--foreground)",
                          opacity: 0.8,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {submission.formData.clientName || "-"}
                      </p>
                      {submission.formData.jobRole && (
                        <p
                          style={{
                            fontSize: "10px",
                            color: "var(--muted-foreground)",
                            marginTop: "2px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {submission.formData.jobRole}
                        </p>
                      )}
                    </div>

                    {/* Company */}
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--muted-foreground)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {submission.formData.companyName || "-"}
                    </p>

                    {/* Date */}
                    <div>
                      <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                        {formatDate(submission.submittedAt)}
                      </p>
                      <p style={{ fontSize: "10px", color: "var(--muted-foreground)", opacity: 0.5, marginTop: "1px" }}>
                        {formatTime(submission.submittedAt)}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      {deleting === submission.id ? (
                        <span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>...</span>
                      ) : (
                        <ChevronRight
                          size={14}
                          style={{
                            color: selected?.id === submission.id ? "var(--accent)" : "var(--border)",
                            transition: "color 0.2s ease",
                          }}
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {filtered.length > 0 && (
            <p
              style={{
                marginTop: "12px",
                fontSize: "11px",
                color: "var(--muted-foreground)",
                opacity: 0.5,
              }}
            >
              {filtered.length} {filtered.length === 1 ? "submission" : "submissions"}
              {search && ` matching "${search}"`}
            </p>
          )}
        </motion.div>
      </main>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.5)",
                zIndex: 90,
                backdropFilter: "blur(2px)",
              }}
            />
            <BriefDetailPanel
              submission={selected}
              onClose={() => setSelected(null)}
              onDelete={handleDelete}
              onNotesUpdate={handleNotesUpdate}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
