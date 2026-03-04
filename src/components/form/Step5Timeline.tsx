"use client";

import { FormField, Input, Textarea } from "@/components/ui/FormField";
import { TagSelect } from "@/components/ui/TagSelect";
import type { BriefFormData, Timeline, BudgetRange } from "@/types/brief";

const TIMELINE_OPTIONS: { value: Timeline; label: string }[] = [
  { value: "asap", label: "ASAP" },
  { value: "1-2-weeks", label: "1–2 Weeks" },
  { value: "1-month", label: "~1 Month" },
  { value: "2-3-months", label: "2–3 Months" },
  { value: "3-6-months", label: "3–6 Months" },
  { value: "flexible", label: "Flexible" },
];

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "under-5k", label: "Under $5k" },
  { value: "5k-15k", label: "$5k – $15k" },
  { value: "15k-30k", label: "$15k – $30k" },
  { value: "30k-50k", label: "$30k – $50k" },
  { value: "50k-100k", label: "$50k – $100k" },
  { value: "100k-plus", label: "$100k+" },
  { value: "tbd", label: "To Discuss" },
];

interface Props {
  data: BriefFormData;
  onChange: (data: Partial<BriefFormData>) => void;
  errors: Partial<Record<keyof BriefFormData, string>>;
}

export function Step5Timeline({ data, onChange, errors }: Props) {
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
          Timeline & Budget
        </h2>
        <p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
          When do you need this, and what&apos;s the budget we&apos;re working with?
        </p>
      </div>

      <FormField
        label="Project Timeline"
        hint="How quickly do you need this completed?"
        required
        error={errors.timeline as string}
      >
        <TagSelect
          options={TIMELINE_OPTIONS}
          selected={data.timeline ? [data.timeline] : []}
          onChange={(v) => onChange({ timeline: v[0] as Timeline })}
          multi={false}
        />
      </FormField>

      <FormField
        label="Hard Deadline"
        hint="If there&apos;s a specific date this must be completed by (launch date, event, etc.)"
      >
        <Input
          type="date"
          value={data.specificDeadline}
          onChange={(e) => onChange({ specificDeadline: e.target.value })}
          style={{
            colorScheme: "dark",
          }}
        />
      </FormField>

      <FormField
        label="Budget Range"
        hint="Selecting a range helps us scope the project appropriately"
      >
        <TagSelect
          options={BUDGET_OPTIONS}
          selected={data.budget ? [data.budget] : []}
          onChange={(v) => onChange({ budget: v[0] as BudgetRange })}
          multi={false}
        />
      </FormField>

      <FormField
        label="Budget Notes"
        hint="Any context around the budget - constraints, flexibility, what&apos;s included"
      >
        <Textarea
          value={data.budgetNotes}
          onChange={(e) => onChange({ budgetNotes: e.target.value })}
          placeholder="This budget includes all design work but not printing costs. We have some flexibility if the scope requires it..."
          rows={2}
        />
      </FormField>

      {/* Timeline context */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--surface-elevated)",
          border: "1px solid var(--border)",
        }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--foreground)" }}>
          How we use this information
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Your timeline and budget help us accurately scope the project, allocate the right resources, and build a realistic project plan. There&apos;s no wrong answer - honesty here leads to better outcomes for everyone.
        </p>
      </div>
    </div>
  );
}
