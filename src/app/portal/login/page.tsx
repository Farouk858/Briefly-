"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function PortalLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError("");

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 400));

    const res = await fetch("/api/portal-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      sessionStorage.setItem("portal_auth", "1");
      router.push("/portal");
    } else {
      setError("Incorrect password.");
      setChecking(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(1, 255, 0, 0.04) 0%, transparent 60%)",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "380px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center" }}>
          <Logo size="sm" />
        </div>

        {/* Card */}
        <div
          className="glass-surface"
          style={{
            borderRadius: "8px",
            padding: "36px 32px",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(1, 255, 0, 0.06)",
                border: "1px solid rgba(1, 255, 0, 0.15)",
                marginBottom: "16px",
              }}
            >
              <Lock size={16} style={{ color: "var(--accent)" }} />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "26px",
                fontWeight: 600,
                color: "var(--foreground)",
                letterSpacing: "-0.01em",
                marginBottom: "6px",
              }}
            >
              Studio Portal
            </h1>
            <p style={{ fontSize: "12px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
              Enter your password to access the submissions portal.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Password"
                autoFocus
                required
                style={{
                  width: "100%",
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${error ? "rgba(255,80,80,0.4)" : "var(--border)"}`,
                  borderRadius: "4px",
                  padding: "12px 44px 12px 16px",
                  color: "var(--foreground)",
                  fontSize: "14px",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  if (!error) e.currentTarget.style.borderColor = "rgba(1, 255, 0, 0.3)";
                }}
                onBlur={(e) => {
                  if (!error) e.currentTarget.style.borderColor = "var(--border)";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted-foreground)",
                  display: "flex",
                  padding: "4px",
                }}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {error && (
              <p style={{ fontSize: "12px", color: "rgba(255,100,100,0.9)", marginTop: "-4px" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={checking || !password}
              className="glow-button"
              style={{
                width: "100%",
                padding: "13px",
                background: checking || !password ? "var(--accent-dark)" : "var(--accent)",
                border: "none",
                borderRadius: "4px",
                color: "var(--background)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: checking || !password ? "not-allowed" : "pointer",
                fontFamily: "var(--font-dm-sans), sans-serif",
                transition: "all 0.2s ease",
                opacity: !password ? 0.5 : 1,
              }}
            >
              {checking ? "Checking..." : "Enter Portal"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: "11px", color: "var(--muted-foreground)", opacity: 0.5 }}>
          Studio 858 &mdash; Internal Tool
        </p>
      </div>
    </div>
  );
}
