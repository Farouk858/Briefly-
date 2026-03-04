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
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer"
            style={{
              background: isSelected ? "var(--accent)" : "var(--surface)",
              color: isSelected ? "var(--background)" : "var(--muted-foreground)",
              border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
              transform: isSelected ? "scale(1.02)" : "scale(1)",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
