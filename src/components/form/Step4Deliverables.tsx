"use client";

import { FormField, Input, Textarea } from "@/components/ui/FormField";
import { TagSelect } from "@/components/ui/TagSelect";
import type { BriefFormData, OutputFormat } from "@/types/brief";

const OUTPUT_FORMAT_OPTIONS: { value: OutputFormat; label: string }[] = [
  { value: "print-ready", label: "Print-Ready Files" },
  { value: "digital", label: "Digital Assets" },
  { value: "web", label: "Web Assets" },
  { value: "social", label: "Social Media Assets" },
  { value: "video", label: "Video Files" },
  { value: "presentation", label: "Presentation Format" },
  { value: "both", label: "Print & Digital" },
  { value: "other", label: "Other" },
];

interface Props {
  data: BriefFormData;
  onChange: (data: Partial<BriefFormData>) => void;
  errors: Partial<Record<keyof BriefFormData, string>>;
}

export function Step4Deliverables({ data, onChange, errors }: Props) {
  return (
    <div className="flex flex-col gap-7 animate-fade-in-up">
      <div>
        <h2
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(26px, 4vw, 34px)",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "var(--foreground)",
            lineHeight: 1.1,
            marginBottom: "6px",
          }}
        >
          Deliverables
        </h2>
        <p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
          What exactly do you need at the end of this project?
        </p>
      </div>

      <FormField
        label="List of Deliverables"
        hint="Be as specific as possible — what files, assets, or outputs do you expect to receive?"
        required
        error={errors.deliverables}
      >
        <Textarea
          value={data.deliverables}
          onChange={(e) => onChange({ deliverables: e.target.value })}
          placeholder="Primary logo (horizontal + stacked versions), secondary logo, icon/mark, brand guidelines PDF, colour palette, typography guide, business card design, letterhead, social media profile templates (Instagram, LinkedIn), email signature..."
          rows={5}
          error={!!errors.deliverables}
        />
      </FormField>

      <FormField
        label="Output Formats Required"
        hint="Select all formats you need"
      >
        <TagSelect
          options={OUTPUT_FORMAT_OPTIONS}
          selected={data.outputFormats}
          onChange={(v) => onChange({ outputFormats: v as OutputFormat[] })}
        />
      </FormField>

      <FormField
        label="Specific File Types"
        hint="Any specific file formats required (e.g. AI, EPS, SVG, PDF, PNG, MP4)"
      >
        <Input
          value={data.filesRequired}
          onChange={(e) => onChange({ filesRequired: e.target.value })}
          placeholder="e.g. AI source files, PDF, SVG, PNG with transparent background"
        />
      </FormField>

      <FormField
        label="Revision Rounds"
        hint="How many rounds of revisions do you expect / want included?"
      >
        <Input
          value={data.revisionRounds}
          onChange={(e) => onChange({ revisionRounds: e.target.value })}
          placeholder="e.g. 2 rounds of revisions, or 'as needed'"
        />
      </FormField>

      {/* Helpful callout */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "rgba(201, 169, 110, 0.06)",
          border: "1px solid rgba(201, 169, 110, 0.2)",
        }}
      >
        <p className="text-xs" style={{ color: "var(--accent-light)" }}>
          <span className="font-semibold">Tip:</span> The more specific you are about deliverables, the more accurate your brief and timeline estimate will be. Include quantities where relevant — e.g. &quot;5 social post templates&quot; rather than &quot;social posts&quot;.
        </p>
      </div>
    </div>
  );
}
