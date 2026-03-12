"use client";

import { useState } from "react";
import { Plus, Trash2, Package } from "lucide-react";
import { Input } from "./FormField";

interface Props {
  items: string[];
  onChange: (items: string[]) => void;
}

export function DeliverableListInput({ items, onChange }: Props) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const update = (index: number, value: string) => {
    onChange(items.map((item, i) => (i === index ? value : item)));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Existing items */}
      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-lg px-3 py-2.5 flex items-center gap-2"
              style={{
                background: "var(--surface-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              <Package size={13} style={{ color: "var(--accent)", flexShrink: 0 }} />
              <input
                value={item}
                onChange={(e) => update(i, e.target.value)}
                className="flex-1 bg-transparent text-xs outline-none min-w-0"
                style={{ color: "var(--foreground)" }}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="flex-shrink-0 p-1 rounded transition-colors"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e05252")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new item */}
      <div
        className="rounded-lg p-4 flex flex-col gap-3"
        style={{
          background: "var(--surface)",
          border: "1px dashed var(--border)",
        }}
      >
        <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
          Add a deliverable
        </p>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="e.g. Primary logo (horizontal + stacked versions)"
        />
        <button
          type="button"
          onClick={add}
          disabled={!draft.trim()}
          className="flex items-center justify-center gap-2 w-full transition-all duration-200"
          style={{
            background: draft.trim() ? "var(--accent)" : "rgba(255,255,255,0.04)",
            color: draft.trim() ? "var(--background)" : "var(--muted-foreground)",
            cursor: draft.trim() ? "pointer" : "not-allowed",
            border: draft.trim() ? "1px solid var(--accent)" : "1px dashed var(--border)",
            borderRadius: "6px",
            padding: "12px 16px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}
        >
          <Plus size={15} />
          {draft.trim() ? "Add Deliverable" : "Type above to add a deliverable"}
        </button>
      </div>
    </div>
  );
}
