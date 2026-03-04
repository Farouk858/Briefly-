"use client";

import { FormField, Textarea } from "@/components/ui/FormField";
import { FileUpload } from "@/components/ui/FileUpload";
import { ReferenceLinkInput } from "@/components/ui/ReferenceLinkInput";
import type { BriefFormData, UploadedFile, ReferenceLink } from "@/types/brief";

interface Props {
  data: BriefFormData;
  onChange: (data: Partial<BriefFormData>) => void;
  errors: Partial<Record<keyof BriefFormData, string>>;
}

export function Step6References({ data, onChange, errors }: Props) {
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
          References & Assets
        </h2>
        <p style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
          Share anything that will help us understand your vision — the more context, the better.
        </p>
      </div>

      {/* Reference Links */}
      <FormField
        label="Reference Links"
        hint="Add links to websites, Behance projects, Pinterest boards, or anything you love visually"
      >
        <ReferenceLinkInput
          links={data.referenceLinks}
          onChange={(links: ReferenceLink[]) => onChange({ referenceLinks: links })}
        />
      </FormField>

      {/* Existing Brief Upload */}
      <FormField
        label="Existing Brief or Brief Documents"
        hint="If you already have a brief, scope document, or any written notes — upload them here"
      >
        <FileUpload
          files={data.existingBrief}
          onFilesChange={(files: UploadedFile[]) => onChange({ existingBrief: files })}
          accept=".pdf,.doc,.docx,.txt,.pages"
          maxFiles={5}
          label="Upload existing brief documents"
        />
      </FormField>

      {/* Image & Reference Files */}
      <FormField
        label="Visual References & Inspiration"
        hint="Upload images, mood boards, screenshots, or any visuals that inspire or reference this project"
      >
        <FileUpload
          files={data.uploadedFiles}
          onFilesChange={(files: UploadedFile[]) => onChange({ uploadedFiles: files })}
          accept="image/*,.pdf"
          maxFiles={20}
          label="Upload images, mood boards, references"
        />
      </FormField>

      {/* Additional Notes */}
      <FormField
        label="Anything Else?"
        hint="Any other context, instructions, constraints, or thoughts you want us to know. Don&apos;t hold back."
      >
        <Textarea
          value={data.additionalNotes}
          onChange={(e) => onChange({ additionalNotes: e.target.value })}
          placeholder="We&apos;re going through a full rebrand so everything will be fresh. The CEO has strong opinions about the logo mark. We have an existing brand guide from 5 years ago I can send if needed. The launch is tied to our funding announcement so the date is non-negotiable..."
          rows={4}
        />
      </FormField>

      {/* Final note */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "rgba(201, 169, 110, 0.06)",
          border: "1px solid rgba(201, 169, 110, 0.2)",
        }}
      >
        <p className="text-xs" style={{ color: "var(--accent-light)" }}>
          <span className="font-semibold">Almost done.</span> Once you submit, we&apos;ll compile everything into a clean, structured brief. You&apos;ll be able to review it before we begin work.
        </p>
      </div>
    </div>
  );
}
