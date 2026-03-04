"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: { text: "text-lg", sub: "text-[9px]", gap: "gap-1" },
    md: { text: "text-2xl", sub: "text-[10px]", gap: "gap-1.5" },
    lg: { text: "text-4xl", sub: "text-xs", gap: "gap-2" },
  };

  const s = sizes[size];

  return (
    <div className={`flex flex-col items-start ${s.gap}`}>
      <div className="flex items-baseline gap-0.5">
        <span
          className={`${s.text} font-bold tracking-tight`}
          style={{ color: "var(--foreground)", letterSpacing: "-0.04em" }}
        >
          Briefly
        </span>
        <span
          className={`${s.text} font-light`}
          style={{ color: "var(--accent)" }}
        >
          .
        </span>
      </div>
      <span
        className={`${s.sub} font-medium tracking-widest uppercase`}
        style={{ color: "var(--muted-foreground)" }}
      >
        Studio 858
      </span>
    </div>
  );
}
