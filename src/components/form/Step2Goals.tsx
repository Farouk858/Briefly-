"use client";

import { FormField, Input, Textarea } from "@/components/ui/FormField";
import type { BriefFormData } from "@/types/brief";

interface Props {
  data: BriefFormData;
  onChange: (data: Partial<BriefFormData>) => void;
  errors: Partial<Record<keyof BriefFormData, string>>;
}

export function Step2Goals({ data, onChange, errors }: Props) {
  return (
    <div className="flex flex-col gap-7 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
          Goals & Audience
        </h2>
        <p className="text-sm mt-1.5" style={{ color: "var(--muted-foreground)" }}>
          Who are we talking to, and what do we want them to feel or do?
        </p>
      </div>

      <FormField
        label="What are the primary goals of this project?"
        hint="What does success look like? What should this project achieve?"
        required
        error={errors.projectGoals}
      >
        <Textarea
          value={data.projectGoals}
          onChange={(e) => onChange({ projectGoals: e.target.value })}
          placeholder="We want to increase brand recognition among professionals. The project should make us look more credible and premium. We want potential clients to immediately understand what we do..."
          rows={4}
          error={!!errors.projectGoals}
        />
      </FormField>

      <FormField
        label="Who is the target audience?"
        hint="Describe your ideal customer, user, or viewer"
        required
        error={errors.targetAudience}
      >
        <Textarea
          value={data.targetAudience}
          onChange={(e) => onChange({ targetAudience: e.target.value })}
          placeholder="Urban professionals aged 28–45, working in finance, tech, or consulting. They value quality over price, are design-savvy, and expect premium experiences..."
          rows={3}
          error={!!errors.targetAudience}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          label="Age Range"
          hint="Approximate age of your audience"
        >
          <Input
            value={data.audienceAge}
            onChange={(e) => onChange({ audienceAge: e.target.value })}
            placeholder="e.g. 25–40, 18–35, All ages"
          />
        </FormField>

        <FormField
          label="Location / Market"
          hint="Where is your audience based?"
        >
          <Input
            value={data.audienceLocation}
            onChange={(e) => onChange({ audienceLocation: e.target.value })}
            placeholder="e.g. South Africa, Global, Cape Town"
          />
        </FormField>
      </div>

      <FormField
        label="Competitor Brands"
        hint="Name brands in the same space — this helps us understand the landscape you operate in"
      >
        <Textarea
          value={data.competitorBrands}
          onChange={(e) => onChange({ competitorBrands: e.target.value })}
          placeholder="Competitor A, Competitor B, Competitor C — we want to feel more premium than them but more approachable than..."
          rows={2}
        />
      </FormField>

      <FormField
        label="What makes you / your brand unique?"
        hint="Your unique selling point, differentiator, or core brand promise"
      >
        <Textarea
          value={data.uniqueSellingPoint}
          onChange={(e) => onChange({ uniqueSellingPoint: e.target.value })}
          placeholder="We are the only company in our industry that offers same-day delivery with full custom options. Our customers choose us because..."
          rows={3}
        />
      </FormField>
    </div>
  );
}
