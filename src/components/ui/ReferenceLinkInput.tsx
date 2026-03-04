"use client";

import { useState } from "react";
import { Plus, Trash2, Link2 } from "lucide-react";
import type { ReferenceLink } from "@/types/brief";
import { Input } from "./FormField";

interface ReferenceLinkInputProps {
  links: ReferenceLink[];
  onChange: (links: ReferenceLink[]) => void;
}

export function ReferenceLinkInput({ links, onChange }: ReferenceLinkInputProps) {
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const addLink = () => {
    if (!newUrl.trim()) return;
    const link: ReferenceLink = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: newUrl.trim(),
      label: newLabel.trim() || newUrl.trim(),
      notes: newNotes.trim(),
    };
    onChange([...links, link]);
    setNewUrl("");
    setNewLabel("");
    setNewNotes("");
  };

  const removeLink = (id: string) => {
    onChange(links.filter((l) => l.id !== id));
  };

  const updateLink = (id: string, field: keyof ReferenceLink, value: string) => {
    onChange(links.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Existing links */}
      {links.length > 0 && (
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="rounded-lg p-3 flex flex-col gap-2"
              style={{
                background: "var(--surface-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-start gap-2">
                <Link2 size={14} style={{ color: "var(--accent)", marginTop: 2 }} className="flex-shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <input
                    value={link.url}
                    onChange={(e) => updateLink(link.id, "url", e.target.value)}
                    className="w-full bg-transparent text-xs font-medium truncate outline-none"
                    style={{ color: "var(--accent)" }}
                    placeholder="URL"
                  />
                  <input
                    value={link.label}
                    onChange={(e) => updateLink(link.id, "label", e.target.value)}
                    className="w-full bg-transparent text-xs outline-none"
                    style={{ color: "var(--foreground)" }}
                    placeholder="Label (e.g. Competitor website)"
                  />
                  <input
                    value={link.notes}
                    onChange={(e) => updateLink(link.id, "notes", e.target.value)}
                    className="w-full bg-transparent text-xs outline-none"
                    style={{ color: "var(--muted-foreground)" }}
                    placeholder="Why is this relevant? (optional)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLink(link.id)}
                  className="flex-shrink-0 p-1 rounded transition-colors"
                  style={{ color: "var(--muted-foreground)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#e05252")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--muted-foreground)")
                  }
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new link */}
      <div
        className="rounded-lg p-4 flex flex-col gap-3"
        style={{
          background: "var(--surface)",
          border: "1px dashed var(--border)",
        }}
      >
        <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
          Add reference link
        </p>
        <Input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="https://example.com"
          onKeyDown={(e) => e.key === "Enter" && addLink()}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Label (optional)"
            onKeyDown={(e) => e.key === "Enter" && addLink()}
          />
          <Input
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            placeholder="Why relevant? (optional)"
            onKeyDown={(e) => e.key === "Enter" && addLink()}
          />
        </div>
        <button
          type="button"
          onClick={addLink}
          disabled={!newUrl.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 self-start"
          style={{
            background: newUrl.trim() ? "var(--accent)" : "var(--border)",
            color: newUrl.trim() ? "var(--background)" : "var(--muted-foreground)",
            cursor: newUrl.trim() ? "pointer" : "not-allowed",
          }}
        >
          <Plus size={13} />
          Add Link
        </button>
      </div>
    </div>
  );
}
