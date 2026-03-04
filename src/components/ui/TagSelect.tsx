"use client";

interface TagSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multi?: boolean;
}

export function TagSelect({ options, selected, onChange, multi = true }: TagSelectProps) {
  const toggle = (value: string) => {
    if (!multi) {
      onChange([value]);
      return;
    }
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingTop: "4px" }}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            style={{
              padding: "7px 14px",
              borderRadius: "2px",
              fontSize: "11px",
              fontWeight: isSelected ? 600 : 400,
              fontFamily: "var(--font-dm-sans), sans-serif",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              background: isSelected ? "var(--accent)" : "transparent",
              color: isSelected ? "var(--background)" : "var(--muted-foreground)",
              border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--foreground)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--muted-foreground)";
              }
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
