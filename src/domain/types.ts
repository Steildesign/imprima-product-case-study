export type ProductionStatus =
  | "offen"
  | "im-satz"
  | "in-korrektur"
  | "final"
  | "preflight"
  | "freigegeben";

export type RiskLevel = "niedrig" | "mittel" | "hoch";
export type CompositionProfileId = "linear" | "image-led" | "complex";
export type ProfileWorkloadState = "im-plan" | "beobachten" | "ueber-plan";
export type CorrectionState = "done" | "active" | "planned";
export type PreflightState = "passed" | "warning" | "failed";

export interface Person {
  id: string;
  name: string;
  role: string;
  initials: string;
  tone: "green" | "blue" | "orange" | "violet" | "navy";
}

export interface Chapter {
  id: string;
  title: string;
  pages: string;
  ownerId: string;
  status: ProductionStatus;
  correctionRound: string;
  blocker?: string;
  risk: RiskLevel;
}

export interface CorrectionStep {
  id: string;
  label: string;
  owner: string;
  date: string;
  state: CorrectionState;
  note: string;
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  date: string;
  chapter: string;
  text: string;
}

export interface PreflightCheck {
  id: string;
  label: string;
  state: PreflightState;
  details: string;
}

export interface TimelinePhase {
  label: string;
  status: ProductionStatus;
  startWeek: number;
  endWeek: number;
}

export interface ProfileWorkload {
  profileId: CompositionProfileId;
  plannedPages: number;
  actualPages: number;
  completedPages: number;
  issueCount: number;
}

export interface ProjectPriceProfile {
  label: string;
  pageRates: Record<CompositionProfileId, number>;
  imageEditingRate: number;
  correctionRoundRate: number;
  aiCreditRate: number;
}

export interface Project {
  id: string;
  title: string;
  publisher: string;
  isbn: string;
  titleNumber: string;
  pages: number;
  deadline: string;
  // Display copy used by the static mock data; keep deadline as the canonical date.
  deadlineLabel: string;
  progress: number;
  status: ProductionStatus;
  risk: RiskLevel;
  compositionProfile: CompositionProfileId;
  profileWorkload: ProfileWorkload[];
  phase: string;
  leadId: string;
  team: string[];
  chapters: Chapter[];
  correctionSteps: CorrectionStep[];
  comments: Comment[];
  preflight: PreflightCheck[];
  timeline: TimelinePhase[];
  priceProfile?: ProjectPriceProfile;
  preApprovalStatus?: ProductionStatus;
  blocker?: string;
}

export interface ProjectFilters {
  query: string;
  risk: RiskLevel | "alle";
  status: ProductionStatus | "alle";
}

export interface PreflightSummary {
  passed: number;
  warning: number;
  failed: number;
  total: number;
}
