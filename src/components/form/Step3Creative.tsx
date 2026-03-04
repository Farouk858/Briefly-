"use client";

import { FormField, Input, Textarea } from "@/components/ui/FormField";
import { TagSelect } from "@/components/ui/TagSelect";
import type { BriefFormData } from "@/types/brief";

const TONE_OPTIONS = [
  { value: "bold", label: "Bold" },
  { value: "minimal", label: "Minimal" },
  { value: "luxury", label: "Luxury" },
  { value: "playful", label: "Playful" },
  { value: "professional", label: "Professional" },
  { value: "edgy", label: "Edgy" },
  { value: "warm", label: "Warm" },
  { value: "clean", label: "Clean" },
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
  { value: "energetic", label: "Energetic" },
  { value: "serene", label: "Serene" },
  { value: "technical", label: "Technical" },
  { value: "artful", label: "Artful" },
  { value: "rebellious", label: "Rebellious" },
  { value: "trustworthy", label: "Trustworthy" },
];

interface Props {
  data: BriefFormData;
  onChange: (data: Partial<BriefFormData>) => void;
  errors: Partial<Record<keyof BriefFormData, string>>;
}

export function Step3Creative({ data, onChange, errors }: Props) {
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
          Creative Direction
        </h2>
        <p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
          Help us understand the look, feel, and personality of this project.
        </p>
      </div>

      <FormField
        label="Tone & Feel"
        hint="Select the words that best describe how this project should feel"
      >
        <TagSelect
          options={TONE_OPTIONS}
          selected={data.toneKeywords}
          onChange={(v) => onChange({ toneKeywords: v })}
        />
      </FormField>

      <FormField
        label="Visual Style"
        hint="Describe the visual aesthetic you have in mind — or the direction you&apos;d like to explore"
      >
        <Textarea
          value={data.visualStyle}
          onChange={(e) => onChange({ visualStyle: e.target.value })}
          placeholder="Think muted tones with sharp typography. Swiss graphic design influence. Clean white space, no clutter. Similar to a high-end editorial magazine..."
          rows={3}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          label="Colours to Use / Include"
          hint="Existing brand colours, or colours you want incorporated"
        >
          <Input
            value={data.colorsToUse}
            onChange={(e) => onChange({ colorsToUse: e.target.value })}
            placeholder="e.g. Navy blue, gold, white — or #1a2b3c"
          />
        </FormField>

        <FormField
          label="Colours to Avoid"
          hint="Colours that don&apos;t work for this brand or project"
        >
          <Input
            value={data.colorsToAvoid}
            onChange={(e) => onChange({ colorsToAvoid: e.target.value })}
            placeholder="e.g. Red, orange, bright neons"
          />
        </FormField>
      </div>

      <FormField
        label="Must Include"
        hint="Anything that must appear in the final work — logos, taglines, specific elements"
      >
        <Textarea
          value={data.mustInclude}
          onChange={(e) => onChange({ mustInclude: e.target.value })}
          placeholder="Company logo, tagline 'Built for Tomorrow', phone number, website URL, social media handles..."
          rows={2}
        />
      </FormField>

      <FormField
        label="Must Avoid"
        hint="Styles, elements, or approaches that are off-limits"
      >
        <Textarea
          value={data.mustAvoid}
          onChange={(e) => onChange({ mustAvoid: e.target.value })}
          placeholder="No stock photos of handshakes, avoid clichéd corporate imagery, no gradients, nothing that looks like a tech startup..."
          rows={2}
        />
      </FormField>
    </div>
  );
}
