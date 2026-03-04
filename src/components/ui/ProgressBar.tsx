"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div style={{ width: "100%" }}>
      {/* Step labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
          overflow: "hidden",
        }}
      >
        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <span
              key={index}
              style={{
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontFamily: "var(--font-dm-sans), sans-serif",
                color: isCurrent
                  ? "var(--accent)"
                  : isCompleted
                  ? "var(--foreground)"
                  : "var(--muted-foreground)",
                opacity: isCompleted ? 0.45 : 1,
                transition: "all 0.4s ease",
              }}
              className="hidden sm:block"
            >
              {label}
            </span>
          );
        })}
      </div>

      {/* Progress track */}
      <div
        style={{
          width: "100%",
          height: "1px",
          background: "var(--border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${progress}%`,
            background: "var(--accent)",
            transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      {/* Step counter */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            color: "var(--muted-foreground)",
            fontFamily: "var(--font-mono), monospace",
            letterSpacing: "0.04em",
          }}
        >
          {String(currentStep).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
        </span>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--accent)",
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}
        >
          {stepLabels[currentStep - 1]}
        </span>
      </div>
    </div>
  );
}
