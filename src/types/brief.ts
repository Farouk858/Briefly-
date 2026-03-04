export type ProjectType =
  | "branding"
  | "web-design"
  | "web-development"
  | "print"
  | "social-media"
  | "motion"
  | "photography"
  | "video"
  | "strategy"
  | "ui-ux"
  | "other";

export type BudgetRange =
  | "under-5k"
  | "5k-15k"
  | "15k-30k"
  | "30k-50k"
  | "50k-100k"
  | "100k-plus"
  | "tbd";

export type Timeline =
  | "asap"
  | "1-2-weeks"
  | "1-month"
  | "2-3-months"
  | "3-6-months"
  | "flexible";

export type OutputFormat =
  | "print-ready"
  | "digital"
  | "both"
  | "web"
  | "social"
  | "video"
  | "presentation"
  | "other";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  preview?: string;
}

export interface ReferenceLink {
  id: string;
  url: string;
  label: string;
  notes: string;
}

export interface BriefFormData {
  // Step 1: About the Project
  clientName: string;
  clientEmail: string;
  companyName: string;
  projectName: string;
  projectType: ProjectType[];
  projectDescription: string;

  // Step 2: Goals & Audience
  projectGoals: string;
  targetAudience: string;
  audienceAge: string;
  audienceLocation: string;
  competitorBrands: string;
  uniqueSellingPoint: string;

  // Step 3: Creative Direction
  toneKeywords: string[];
  colorsToUse: string;
  colorsToAvoid: string;
  visualStyle: string;
  mustInclude: string;
  mustAvoid: string;

  // Step 4: Deliverables
  deliverables: string;
  outputFormats: OutputFormat[];
  filesRequired: string;
  revisionRounds: string;

  // Step 5: Timeline & Budget
  timeline: Timeline;
  specificDeadline: string;
  budget: BudgetRange;
  budgetNotes: string;

  // Step 6: References & Assets
  referenceLinks: ReferenceLink[];
  uploadedFiles: UploadedFile[];
  existingBrief: UploadedFile[];
  additionalNotes: string;
}

export interface GeneratedBrief {
  projectOverview: string;
  objectives: string[];
  targetAudience: string;
  creativeDirection: string;
  deliverables: string[];
  timeline: string;
  budget: string;
  references: ReferenceLink[];
  technicalRequirements: string;
  notes: string;
  generatedAt: string;
}
