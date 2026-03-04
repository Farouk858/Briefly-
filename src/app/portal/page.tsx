"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Clock,
  Users,
  ChevronRight,
  X,
  Trash2,
  Download,
  RefreshCw,
  Calendar,
  DollarSign,
  Package,
  Target,
  Palette,
  Link2,
  StickyNote,
  Briefcase,
  Mail,
  Building2,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import type { BriefFormData, GeneratedBrief } from "@/types/brief";

interface Submission {
  id: string;
  submittedAt: string;
  formData: BriefFormData;
  brief: GeneratedBrief;
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
}: {
  submission: Submission;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const { formData, brief } = submission;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IE", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const bodyText: React.CSSProperties = {
    fontSize: "13px",
    lineHeight: 1.75,
    color: "var(--foreground)",
    opacity: 0.85,
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--muted-foreground)",
    fontFamily: "var(--font-dm-sans), sans-serif",
    marginBottom: "8px",
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
        width: "clamp(320px, 45vw, 640px)",
        background: "rgba(6, 6, 6, 0.97)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        borderLeft: "1px solid var(--border)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "6px",
              fontFamily: "var(--font-dm-sans), sans-serif",
            }}
          >
            Brief Details
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(18px, 3vw, 26px)",
              fontWeight: 600,
              color: "var(--foreground)",
              lineHeight: 1.15,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {formData.projectName || "Untitled Project"}
          </h2>
          <p style={{ fontSize: "11px", color: "var(--muted-foreground)", opacity: 0.7, marginTop: "4px" }}>
            {formatDate(submission.submittedAt)}
          </p>
        </div>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <button
            onClick={() => onDelete(submission.id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "3px",
              color: "var(--muted-foreground)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,80,80,0.4)";
              e.currentTarget.style.color = "rgba(255,80,80,0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--muted-foreground)";
            }}
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "3px",
              color: "var(--muted-foreground)",
              cursor: "pointer",
              transition: "all 0.2s ease",
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
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Client info */}
          <div
            className="glass-surface"
            style={{ borderRadius: "5px", padding: "16px 18px" }}
          >
            <p style={{ ...sectionLabel, marginBottom: "12px" }}>Client</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Users size={12} style={{ color: "var(--accent)", opacity: 0.7, flexShrink: 0 }} />
                <span style={{ ...bodyText, fontSize: "13px" }}>{formData.clientName}</span>
              </div>
              {formData.jobRole && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Briefcase size={12} style={{ color: "var(--accent)", opacity: 0.7, flexShrink: 0 }} />
                  <span style={{ ...bodyText, fontSize: "13px" }}>{formData.jobRole}</span>
                </div>
              )}
              {formData.companyName && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Building2 size={12} style={{ color: "var(--accent)", opacity: 0.7, flexShrink: 0 }} />
                  <span style={{ ...bodyText, fontSize: "13px" }}>{formData.companyName}</span>
                </div>
              )}
              {formData.clientEmail && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Mail size={12} style={{ color: "var(--accent)", opacity: 0.7, flexShrink: 0 }} />
                  <a
                    href={`mailto:${formData.clientEmail}`}
                    style={{ ...bodyText, fontSize: "13px", color: "var(--accent)", textDecoration: "none" }}
                  >
                    {formData.clientEmail}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Project overview */}
          <div>
            <p style={sectionLabel}>Project Overview</p>
            <p style={bodyText}>{brief.projectOverview}</p>
          </div>

          {/* Objectives */}
          <div>
            <p style={sectionLabel}>Objectives</p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {brief.objectives.map((obj, i) => (
                <li key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "var(--accent)",
                      fontFamily: "var(--font-mono), monospace",
                      marginTop: "3px",
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p style={bodyText}>{obj}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Target audience */}
          <div>
            <p style={sectionLabel}>Target Audience</p>
            <p style={bodyText}>{brief.targetAudience}</p>
          </div>

          {/* Creative direction */}
          <div>
            <p style={sectionLabel}>Creative Direction</p>
            <p style={bodyText}>{brief.creativeDirection}</p>
          </div>

          {/* Deliverables */}
          <div>
            <p style={sectionLabel}>Deliverables</p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {brief.deliverables.map((d, i) => (
                <li key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: "3px",
                      height: "3px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      flexShrink: 0,
                      marginTop: "8px",
                    }}
                  />
                  <p style={bodyText}>{d}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline & Budget */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <p style={sectionLabel}>Timeline</p>
              <p style={bodyText}>{brief.timeline}</p>
            </div>
            <div>
              <p style={sectionLabel}>Budget</p>
              <p style={bodyText}>{brief.budget}</p>
            </div>
          </div>

          {/* Technical requirements */}
          {brief.technicalRequirements && (
            <div>
              <p style={sectionLabel}>Technical Requirements</p>
              <p style={bodyText}>{brief.technicalRequirements}</p>
            </div>
          )}

          {/* References */}
          {brief.references.length > 0 && (
            <div>
              <p style={sectionLabel}>References</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {brief.references.map((ref) => (
                  <div key={ref.id}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "13px",
                        color: "var(--accent)",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      {ref.label || ref.url}
                    </a>
                    {ref.notes && (
                      <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "2px" }}>
                        {ref.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {brief.notes && brief.notes !== "No additional notes provided." && (
            <div>
              <p style={sectionLabel}>Additional Notes</p>
              <p style={bodyText}>{brief.notes}</p>
            </div>
          )}
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
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
