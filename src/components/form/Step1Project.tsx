"use client";

import { FormField, Input, Textarea } from "@/components/ui/FormField";
import { TagSelect } from "@/components/ui/TagSelect";
import type { BriefFormData, ProjectType } from "@/types/brief";

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: "branding", label: "Brand Identity" },
  { value: "web-design", label: "Web Design" },
  { value: "web-development", label: "Web Development" },
  { value: "ui-ux", label: "UI / UX" },
  { value: "print", label: "Print Design" },
  { value: "social-media", label: "Social Media" },
  { value: "motion", label: "Motion & Animation" },
  { value: "photography", label: "Photography" },
  { value: "video", label: "Video Production" },
  { value: "strategy", label: "Creative Strategy" },
  { value: "other", label: "Other" },
];

interface Props {
  data: BriefFormData;
  onChange: (data: Partial<BriefFormData>) => void;
  errors: Partial<Record<keyof BriefFormData, string>>;
}

export function Step1Project({ data, onChange, errors }: Props) {
  return (
    <div className="flex flex-col gap-7 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
          About the Project
        </h2>
        <p className="text-sm mt-1.5" style={{ color: "var(--muted-foreground)" }}>
          Let&apos;s start with the basics. Who are you and what are we making?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Your Name" required error={errors.clientName}>
          <Input
            value={data.clientName}
            onChange={(e) => onChange({ clientName: e.target.value })}
            placeholder="Alex Johnson"
            error={!!errors.clientName}
          />
        </FormField>

        <FormField label="Your Email" required error={errors.clientEmail}>
          <Input
            type="email"
            value={data.clientEmail}
            onChange={(e) => onChange({ clientEmail: e.target.value })}
            placeholder="alex@company.com"
            error={!!errors.clientEmail}
          />
        </FormField>
      </div>

      <FormField
        label="Company / Brand Name"
        hint="The brand or organisation this project is for"
      >
        <Input
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
          placeholder="Acme Corp"
        />
      </FormField>

      <FormField label="Project Name" required error={errors.projectName}>
        <Input
          value={data.projectName}
          onChange={(e) => onChange({ projectName: e.target.value })}
          placeholder="e.g. Brand Refresh 2025, New Website, Campaign Launch"
          error={!!errors.projectName}
        />
      </FormField>

      <FormField
        label="Project Type"
        hint="Select all that apply"
        required
        error={errors.projectType as string}
      >
        <TagSelect
          options={PROJECT_TYPES}
          selected={data.projectType}
          onChange={(v) => onChange({ projectType: v as ProjectType[] })}
        />
      </FormField>

      <FormField
        label="Project Description"
        hint="Describe the project in your own words. What do you need, and why?"
        required
        error={errors.projectDescription}
      >
        <Textarea
          value={data.projectDescription}
          onChange={(e) => onChange({ projectDescription: e.target.value })}
          placeholder="We're launching a new product and need a full brand identity system — logo, colours, typography, and brand guidelines. The brand should feel premium and modern, aimed at professionals aged 28–45..."
          rows={5}
          error={!!errors.projectDescription}
        />
      </FormField>
    </div>
  );
}
