"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const configs = {
    sm: { wordmark: "18px", dot: "18px", studio: "8px", gap: "6px" },
    md: { wordmark: "24px", dot: "24px", studio: "9px", gap: "8px" },
    lg: { wordmark: "36px", dot: "36px", studio: "11px", gap: "10px" },
  };

  const c = configs[size];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: c.gap }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "1px" }}>
        <span
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: c.wordmark,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--foreground)",
            lineHeight: 1,
          }}
        >
          Briefly
        </span>
        <span
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: c.dot,
            fontWeight: 300,
            color: "var(--accent)",
            lineHeight: 1,
          }}
        >
          .
        </span>
      </div>
      <span
        style={{
          fontSize: c.studio,
          fontWeight: 500,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--muted-foreground)",
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}
      >
        Studio 858
      </span>
    </div>
  );
}
