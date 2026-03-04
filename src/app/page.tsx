"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Sparkles, Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Step1Project } from "@/components/form/Step1Project";
import { Step2Goals } from "@/components/form/Step2Goals";
import { Step3Creative } from "@/components/form/Step3Creative";
import { Step4Deliverables } from "@/components/form/Step4Deliverables";
import { Step5Timeline } from "@/components/form/Step5Timeline";
import { Step6References } from "@/components/form/Step6References";
import { GeneratedBriefView } from "@/components/brief/GeneratedBriefView";
import { generateBrief } from "@/lib/brief-generator";
import type { BriefFormData, GeneratedBrief } from "@/types/brief";

const STEP_LABELS = [
  "Project",
  "Goals",
  "Creative",
  "Deliverables",
  "Timeline",
  "References",
];

const TOTAL_STEPS = 6;

const defaultFormData: BriefFormData = {
  clientName: "",
  clientEmail: "",
  companyName: "",
  projectName: "",
  projectType: [],
  projectDescription: "",
  projectGoals: "",
  targetAudience: "",
  audienceAge: "",
  audienceLocation: "",
  competitorBrands: "",
  uniqueSellingPoint: "",
  toneKeywords: [],
  colorsToUse: "",
  colorsToAvoid: "",
  visualStyle: "",
  mustInclude: "",
  mustAvoid: "",
  deliverables: "",
  outputFormats: [],
  filesRequired: "",
  revisionRounds: "",
  timeline: "1-month",
  specificDeadline: "",
  budget: "tbd",
  budgetNotes: "",
  referenceLinks: [],
  uploadedFiles: [],
  existingBrief: [],
  additionalNotes: "",
};

type ValidationErrors = Partial<Record<keyof BriefFormData, string>>;

function validateStep(step: number, data: BriefFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (step === 1) {
    if (!data.clientName.trim()) errors.clientName = "Name is required";
    if (!data.clientEmail.trim()) errors.clientEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail))
      errors.clientEmail = "Invalid email address";
    if (!data.projectName.trim()) errors.projectName = "Project name is required";
    if (data.projectType.length === 0)
      (errors as Record<string, string>).projectType = "Select at least one project type";
    if (!data.projectDescription.trim())
      errors.projectDescription = "Project description is required";
  }

  if (step === 2) {
    if (!data.projectGoals.trim()) errors.projectGoals = "Project goals are required";
    if (!data.targetAudience.trim())
      errors.targetAudience = "Target audience is required";
  }

  if (step === 4) {
    if (!data.deliverables.trim()) errors.deliverables = "Please list your deliverables";
  }

  return errors;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BriefFormData>(defaultFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<GeneratedBrief | null>(null);

  const updateFormData = (updates: Partial<BriefFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    const updatedKeys = Object.keys(updates) as (keyof BriefFormData)[];
    setErrors((prev) => {
      const next = { ...prev };
      updatedKeys.forEach((k) => delete next[k]);
      return next;
    });
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenerate = async () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const brief = generateBrief(formData);
    setGeneratedBrief(brief);
    setIsGenerating(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setGeneratedBrief(null);
    setCurrentStep(1);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stepProps = { data: formData, onChange: updateFormData, errors };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)" }}
    >
      {/* Radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201, 169, 110, 0.07) 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: "rgba(8, 8, 8, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Logo size="sm" />
        {!generatedBrief && (
          <div className="text-xs font-medium tracking-widest uppercase" style={{ color: "var(--muted-foreground)" }}>
            Client Brief
          </div>
        )}
        {generatedBrief && (
          <button
            onClick={handleReset}
            className="text-xs font-medium transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
          >
            ← New Brief
          </button>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-5 py-12">
        {/* Generated Brief */}
        {generatedBrief && (
          <GeneratedBriefView
            brief={generatedBrief}
            formData={formData}
            onReset={handleReset}
          />
        )}

        {/* Intake Form */}
        {!generatedBrief && (
          <>
            {/* Hero — step 1 only */}
            {currentStep === 1 && (
              <div className="mb-10 animate-fade-in-up">
                <h1
                  className="text-5xl font-bold mb-4"
                  style={{
                    color: "var(--foreground)",
                    letterSpacing: "-0.04em",
                    lineHeight: "1.08",
                  }}
                >
                  Tell us about
                  <br />
                  <span style={{ color: "var(--accent)" }}>your project.</span>
                </h1>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--muted-foreground)", maxWidth: "400px" }}
                >
                  Fill in the details below and we&apos;ll compile everything into a
                  clean, structured brief — ready to use.
                </p>
              </div>
            )}

            {/* Progress */}
            <div className="mb-8">
              <ProgressBar
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                stepLabels={STEP_LABELS}
              />
            </div>

            {/* Step card */}
            <div
              className="rounded-2xl p-7 sm:p-9 mb-5"
              style={{
                background: "var(--surface-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              {currentStep === 1 && <Step1Project {...stepProps} />}
              {currentStep === 2 && <Step2Goals {...stepProps} />}
              {currentStep === 3 && <Step3Creative {...stepProps} />}
              {currentStep === 4 && <Step4Deliverables {...stepProps} />}
              {currentStep === 5 && <Step5Timeline {...stepProps} />}
              {currentStep === 6 && <Step6References {...stepProps} />}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: currentStep === 1 ? "var(--muted-foreground)" : "var(--foreground)",
                  opacity: currentStep === 1 ? 0.35 : 1,
                  cursor: currentStep === 1 ? "not-allowed" : "pointer",
                }}
              >
                <ChevronLeft size={15} />
                Back
              </button>

              {currentStep < TOTAL_STEPS ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                  style={{ background: "var(--accent)", color: "var(--background)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Continue
                  <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                  style={{
                    background: isGenerating ? "var(--accent-dark)" : "var(--accent)",
                    color: "var(--background)",
                    cursor: isGenerating ? "not-allowed" : "pointer",
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Generating Brief...
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      Generate Brief
                    </>
                  )}
                </button>
              )}
            </div>

            <p
              className="text-center text-xs mt-5"
              style={{ color: "var(--muted-foreground)" }}
            >
              Fields marked with{" "}
              <span style={{ color: "var(--accent)" }}>*</span> are required
            </p>
          </>
        )}
      </main>

      {/* Footer */}
      <footer
        className="mt-16 py-8 px-6 text-center"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <Logo size="sm" />
        <p className="text-xs mt-3" style={{ color: "var(--muted-foreground)" }}>
          © {new Date().getFullYear()} Studio 858. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
