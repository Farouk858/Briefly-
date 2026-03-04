import type { BriefFormData, GeneratedBrief } from "@/types/brief";

const projectTypeLabels: Record<string, string> = {
  branding: "Brand Identity & Strategy",
  "web-design": "Web Design",
  "web-development": "Web Development",
  print: "Print Design",
  "social-media": "Social Media",
  motion: "Motion Graphics & Animation",
  photography: "Photography",
  video: "Video Production",
  strategy: "Creative Strategy",
  "ui-ux": "UI/UX Design",
  other: "Creative Work",
};

const timelineLabels: Record<string, string> = {
  asap: "As soon as possible",
  "1-2-weeks": "1–2 weeks",
  "1-month": "Approximately 1 month",
  "2-3-months": "2–3 months",
  "3-6-months": "3–6 months",
  flexible: "Flexible / to be confirmed",
};

const budgetLabels: Record<string, string> = {
  "under-5k": "Under $5,000",
  "5k-15k": "$5,000 – $15,000",
  "15k-30k": "$15,000 – $30,000",
  "30k-50k": "$30,000 – $50,000",
  "50k-100k": "$50,000 – $100,000",
  "100k-plus": "$100,000+",
  tbd: "To be discussed",
};

export function generateBrief(data: BriefFormData): GeneratedBrief {
  const projectTypes = data.projectType
    .map((t) => projectTypeLabels[t] || t)
    .join(", ");

  // Project Overview
  const projectOverview = buildProjectOverview(data, projectTypes);

  // Objectives
  const objectives = buildObjectives(data);

  // Target Audience
  const targetAudience = buildTargetAudience(data);

  // Creative Direction
  const creativeDirection = buildCreativeDirection(data);

  // Deliverables
  const deliverables = buildDeliverables(data);

  // Timeline
  const timeline = buildTimeline(data);

  // Budget
  const budget = buildBudget(data);

  // Technical Requirements
  const technicalRequirements = buildTechnicalRequirements(data);

  // Notes
  const notes = data.additionalNotes || "No additional notes provided.";

  return {
    projectOverview,
    objectives,
    targetAudience,
    creativeDirection,
    deliverables,
    timeline,
    budget,
    references: data.referenceLinks.filter((r) => r.url),
    technicalRequirements,
    notes,
    generatedAt: new Date().toISOString(),
  };
}

function buildProjectOverview(data: BriefFormData, projectTypes: string): string {
  const client = data.companyName || data.clientName || "The client";
  const project = data.projectName || "this project";
  const contact = data.jobRole
    ? `${data.clientName} (${data.jobRole})`
    : data.clientName;

  let overview = `${client} requires ${projectTypes} for ${project}.`;

  if (contact && contact !== client) {
    overview += ` Brief submitted by ${contact}.`;
  }

  if (data.projectDescription) {
    overview += ` ${data.projectDescription}`;
  }

  return overview;
}

function buildObjectives(data: BriefFormData): string[] {
  const objectives: string[] = [];

  if (data.projectGoals) {
    const goals = data.projectGoals
      .split(/[.\n]+/)
      .map((g) => g.trim())
      .filter((g) => g.length > 5);
    objectives.push(...goals);
  }

  if (data.uniqueSellingPoint) {
    objectives.push(
      `Communicate the unique value proposition: ${data.uniqueSellingPoint}`
    );
  }

  if (objectives.length === 0) {
    objectives.push("Deliver high-quality creative work aligned with the client's vision.");
  }

  return objectives;
}

function buildTargetAudience(data: BriefFormData): string {
  const parts: string[] = [];

  if (data.targetAudience) parts.push(data.targetAudience);
  if (data.audienceAge) parts.push(`Age group: ${data.audienceAge}`);
  if (data.audienceLocation) parts.push(`Location: ${data.audienceLocation}`);
  if (data.competitorBrands) {
    parts.push(`Competing in the same space as: ${data.competitorBrands}`);
  }

  return parts.length > 0
    ? parts.join(". ")
    : "Target audience to be defined in consultation.";
}

function buildCreativeDirection(data: BriefFormData): string {
  const parts: string[] = [];

  if (data.toneKeywords.length > 0) {
    parts.push(`Tone & feel: ${data.toneKeywords.join(", ")}`);
  }

  if (data.visualStyle) {
    parts.push(`Visual style: ${data.visualStyle}`);
  }

  if (data.colorsToUse) {
    parts.push(`Colours to incorporate: ${data.colorsToUse}`);
  }

  if (data.colorsToAvoid) {
    parts.push(`Colours to avoid: ${data.colorsToAvoid}`);
  }

  if (data.mustInclude) {
    parts.push(`Must include: ${data.mustInclude}`);
  }

  if (data.mustAvoid) {
    parts.push(`Must avoid: ${data.mustAvoid}`);
  }

  return parts.length > 0
    ? parts.join(". ")
    : "Creative direction to be developed collaboratively.";
}

function buildDeliverables(data: BriefFormData): string[] {
  const deliverables: string[] = [];

  if (data.deliverables) {
    const items = data.deliverables
      .split(/[,\n]+/)
      .map((d) => d.trim())
      .filter((d) => d.length > 2);
    deliverables.push(...items);
  }

  if (data.outputFormats.length > 0) {
    const formatLabels: Record<string, string> = {
      "print-ready": "Print-ready files",
      digital: "Digital assets",
      both: "Print & digital formats",
      web: "Web-optimised assets",
      social: "Social media assets",
      video: "Video files",
      presentation: "Presentation format",
      other: "Additional formats",
    };
    const formats = data.outputFormats.map((f) => formatLabels[f] || f);
    deliverables.push(`Output formats required: ${formats.join(", ")}`);
  }

  if (data.filesRequired) {
    deliverables.push(`File types: ${data.filesRequired}`);
  }

  if (data.revisionRounds) {
    deliverables.push(`Revision rounds included: ${data.revisionRounds}`);
  }

  return deliverables.length > 0 ? deliverables : ["Deliverables to be scoped."];
}

function buildTimeline(data: BriefFormData): string {
  const base = timelineLabels[data.timeline] || "Timeline to be confirmed";

  if (data.specificDeadline) {
    return `${base}. Hard deadline: ${data.specificDeadline}`;
  }

  return base;
}

function buildBudget(data: BriefFormData): string {
  const base = budgetLabels[data.budget] || "Budget to be discussed";

  if (data.budgetNotes) {
    return `${base}. ${data.budgetNotes}`;
  }

  return base;
}

function buildTechnicalRequirements(data: BriefFormData): string {
  const reqs: string[] = [];

  if (data.outputFormats.includes("web") || data.projectType.includes("web-design") || data.projectType.includes("web-development")) {
    reqs.push("Web-optimised file formats (SVG, WebP, optimised PNG/JPG)");
  }

  if (data.outputFormats.includes("print-ready") || data.projectType.includes("print")) {
    reqs.push("Print-ready files (300 DPI, CMYK, with bleed and crop marks)");
  }

  if (data.outputFormats.includes("social")) {
    reqs.push("Social media assets at platform-specific dimensions");
  }

  if (data.filesRequired) {
    reqs.push(`Specific file formats: ${data.filesRequired}`);
  }

  return reqs.length > 0
    ? reqs.join(". ")
    : "Technical specifications to be confirmed based on final deliverables.";
}
