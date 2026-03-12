"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
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

const STEP_LABELS = ["Project", "Goals", "Creative", "Deliverables", "Timeline", "References"];
const TOTAL_STEPS = 6;

const defaultFormData: BriefFormData = {
  clientName: "",
  clientEmail: "",
  jobRole: "",
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
  deliverables: [],
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
    if (data.deliverables.length === 0) errors.deliverables = "Please add at least one deliverable";
  }

  return errors;
}

const STEP_VARIANTS = {
  enter: { opacity: 0, y: 18 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

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
    await new Promise((resolve) => setTimeout(resolve, 1400));
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
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Ambient background */}
      <div
        className="aurora-bg"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(1, 255, 0, 0.04) 0%, transparent 60%)",
          zIndex: 0,
        }}
      />

      {/* Fluid liquid blobs */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "5%",
          width: "clamp(200px, 30vw, 480px)",
          height: "clamp(200px, 30vw, 480px)",
          background: "radial-gradient(circle, rgba(1, 255, 0, 0.025) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "liquidFlow 18s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "15%",
          right: "8%",
          width: "clamp(150px, 24vw, 360px)",
          height: "clamp(150px, 24vw, 360px)",
          background: "radial-gradient(circle, rgba(1, 255, 0, 0.018) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "liquidFlow 22s ease-in-out infinite reverse",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        className="liquid-glass"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "0 clamp(20px, 5vw, 48px)",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Logo size="sm" />

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {!generatedBrief && (
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--muted-foreground)",
                fontFamily: "var(--font-dm-sans), sans-serif",
              }}
            >
              Client Brief
            </span>
          )}

          {generatedBrief && (
            <button
              onClick={handleReset}
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.2s ease",
                fontFamily: "var(--font-dm-sans), sans-serif",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
            >
              &larr; New Brief
            </button>
          )}

        </div>
      </header>

      {/* Main */}
      <main
        style={{
          maxWidth: "clamp(600px, 70vw, 860px)",
          margin: "0 auto",
          padding: "clamp(32px, 6vw, 72px) clamp(20px, 5vw, 40px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Generated Brief */}
        {generatedBrief && (
          <GeneratedBriefView brief={generatedBrief} formData={formData} onReset={handleReset} />
        )}

        {/* Intake Form */}
        {!generatedBrief && (
          <>
            {/* Hero - step 1 only */}
            <AnimatePresence>
              {currentStep === 1 && (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ marginBottom: "52px" }}
                >
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: "var(--muted-foreground)",
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      marginBottom: "20px",
                    }}
                  >
                    Client Brief
                  </p>
                  <h1
                    style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontSize: "clamp(44px, 9vw, 88px)",
                      fontWeight: 600,
                      lineHeight: 1.04,
                      letterSpacing: "-0.02em",
                      color: "var(--foreground)",
                      marginBottom: "24px",
                    }}
                  >
                    Tell us about
                    <br />
                    <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
                      your project.
                    </em>
                  </h1>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: 1.75,
                      color: "var(--muted-foreground)",
                      maxWidth: "440px",
                    }}
                  >
                    Fill in the details below and we&apos;ll compile everything into a clean,
                    structured brief - ready to share.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step counter for steps 2-6 */}
            <AnimatePresence>
              {currentStep > 1 && (
                <motion.div
                  key={`heading-${currentStep}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ marginBottom: "8px" }}
                >
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      fontFamily: "var(--font-dm-sans), sans-serif",
                    }}
                  >
                    Step {String(currentStep).padStart(2, "0")} / {TOTAL_STEPS}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress */}
            <div style={{ marginBottom: "36px" }}>
              <ProgressBar
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                stepLabels={STEP_LABELS}
              />
            </div>

            {/* Step card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={STEP_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="glass-surface hover-glow"
                style={{
                  borderRadius: "6px",
                  padding: "clamp(28px, 5vw, 52px) clamp(24px, 5vw, 48px)",
                  marginBottom: "20px",
                }}
              >
                {currentStep === 1 && <Step1Project {...stepProps} />}
                {currentStep === 2 && <Step2Goals {...stepProps} />}
                {currentStep === 3 && <Step3Creative {...stepProps} />}
                {currentStep === 4 && <Step4Deliverables {...stepProps} />}
                {currentStep === 5 && <Step5Timeline {...stepProps} />}
                {currentStep === 6 && <Step6References {...stepProps} />}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 24px",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "3px",
                  color: currentStep === 1 ? "var(--border)" : "var(--muted-foreground)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: currentStep === 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (currentStep !== 1) {
                    e.currentTarget.style.borderColor = "var(--muted-foreground)";
                    e.currentTarget.style.color = "var(--foreground)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentStep !== 1) {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--muted-foreground)";
                  }
                }}
              >
                &larr; Back
              </button>

              {currentStep < TOTAL_STEPS ? (
                <button
                  onClick={handleNext}
                  className="glow-button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 36px",
                    background: "var(--accent)",
                    border: "1px solid var(--accent)",
                    borderRadius: "3px",
                    color: "var(--background)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent-light)";
                    e.currentTarget.style.borderColor = "var(--accent-light)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--accent)";
                    e.currentTarget.style.borderColor = "var(--accent)";
                  }}
                >
                  Continue &rarr;
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="glow-button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 36px",
                    background: isGenerating ? "var(--accent-dark)" : "var(--accent)",
                    border: `1px solid ${isGenerating ? "var(--accent-dark)" : "var(--accent)"}`,
                    borderRadius: "3px",
                    color: "var(--background)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: isGenerating ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      Generate Brief
                    </>
                  )}
                </button>
              )}
            </div>

            <p
              style={{
                textAlign: "center",
                fontSize: "11px",
                marginTop: "20px",
                color: "var(--muted-foreground)",
                opacity: 0.6,
              }}
            >
              Fields marked with <span style={{ color: "var(--accent)" }}>&#xB7;</span> are required
            </p>
          </>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: "80px",
          padding: "32px clamp(20px, 5vw, 48px)",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Logo size="sm" />
        <p
          style={{
            fontSize: "11px",
            color: "var(--muted-foreground)",
            letterSpacing: "0.04em",
            opacity: 0.6,
          }}
        >
          &copy; {new Date().getFullYear()} Studio 858. All rights reserved.
        </p>
        <a
          href="/portal/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
            textDecoration: "none",
            opacity: 0.4,
            transition: "opacity 0.2s ease",
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.4"; }}
        >
          Studio Portal
        </a>
      </footer>
    </div>
  );
}
