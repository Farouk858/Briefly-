"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full">
      {/* Step indicators */}
      <div className="flex justify-between items-center mb-3">
        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300"
                style={{
                  background: isCompleted || isCurrent
                    ? "var(--accent)"
                    : "var(--border)",
                  color: isCompleted || isCurrent
                    ? "var(--background)"
                    : "var(--muted-foreground)",
                  transform: isCurrent ? "scale(1.15)" : "scale(1)",
                }}
              >
                {isCompleted ? "✓" : stepNum}
              </div>
              <span
                className="text-[9px] font-medium tracking-wider uppercase hidden sm:block"
                style={{
                  color: isCurrent
                    ? "var(--accent)"
                    : isCompleted
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress track */}
      <div
        className="w-full h-px relative"
        style={{ background: "var(--border)" }}
      >
        <div
          className="absolute top-0 left-0 h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, var(--accent-dark), var(--accent))",
          }}
        />
      </div>

      {/* Step counter */}
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
          {stepLabels[currentStep - 1]}
        </span>
      </div>
    </div>
  );
}
