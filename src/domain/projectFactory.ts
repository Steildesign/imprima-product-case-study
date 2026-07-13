import type { CompositionProfileId, Project, ProjectPriceProfile } from "./types";
import { createInitialProfileWorkload } from "./profileWorkload";

export interface ProjectDraft {
  title: string;
  publisher: string;
  isbn: string;
  titleNumber: string;
  pages: number;
  deadline: string;
  leadId: string;
  compositionProfile: CompositionProfileId;
  profilePlan: Record<CompositionProfileId, number>;
  priceProfile?: ProjectPriceProfile;
}

export type ProjectDraftIssueId =
  | "title"
  | "publisher"
  | "isbn"
  | "titleNumber"
  | "deadline"
  | "pages"
  | "profilePlan";

export interface ProjectDraftIssue {
  id: ProjectDraftIssueId;
  label: string;
}

const draftIssueLabels: Record<ProjectDraftIssueId, string> = {
  title: "Titel fehlt.",
  publisher: "Verlag fehlt.",
  isbn: "ISBN fehlt.",
  titleNumber: "Titelnummer fehlt.",
  deadline: "Deadline fehlt.",
  pages: "Seitenzahl muss größer 0 sein.",
  profilePlan: "Satzmix muss exakt der Seitenzahl entsprechen.",
};

function slugify(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "neues-projekt";
}

function formatDateLabel(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}.${month}.${year}`;
}

function requireTrimmed(value: string, label: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${label} ist erforderlich.`);
  }

  return trimmed;
}

function createIssue(id: ProjectDraftIssueId): ProjectDraftIssue {
  return { id, label: draftIssueLabels[id] };
}

function getProfilePlanTotal(profilePlan: ProjectDraft["profilePlan"]) {
  return Object.values(profilePlan).reduce((sum, value) => sum + value, 0);
}

export function getProjectDraftIssues(draft: ProjectDraft): ProjectDraftIssue[] {
  const issues: ProjectDraftIssue[] = [];
  const pageCountIsValid = Number.isInteger(draft.pages) && draft.pages > 0;
  const profilePlanValues = Object.values(draft.profilePlan);
  const profilePlanTotal = getProfilePlanTotal(draft.profilePlan);
  const profilePlanIsValid =
    profilePlanValues.every((value) => Number.isInteger(value) && value >= 0) &&
    profilePlanTotal > 0 &&
    (!pageCountIsValid || profilePlanTotal === draft.pages);

  if (!draft.title.trim()) {
    issues.push(createIssue("title"));
  }

  if (!draft.publisher.trim()) {
    issues.push(createIssue("publisher"));
  }

  if (!draft.isbn.trim()) {
    issues.push(createIssue("isbn"));
  }

  if (!draft.titleNumber.trim()) {
    issues.push(createIssue("titleNumber"));
  }

  if (!draft.deadline.trim()) {
    issues.push(createIssue("deadline"));
  }

  if (!pageCountIsValid) {
    issues.push(createIssue("pages"));
  }

  if (!profilePlanIsValid) {
    issues.push(createIssue("profilePlan"));
  }

  return issues;
}

export function createProjectFromDraft(draft: ProjectDraft): Project {
  const issues = getProjectDraftIssues(draft);
  if (issues.length > 0) {
    throw new Error(`Projekt ist unvollständig: ${issues.map((issue) => issue.label).join(" ")}`);
  }

  const title = requireTrimmed(draft.title, "Titel");
  const publisher = requireTrimmed(draft.publisher, "Verlag");
  const isbn = requireTrimmed(draft.isbn, "ISBN");
  const titleNumber = requireTrimmed(draft.titleNumber, "Titelnummer");

  return {
    id: slugify(title),
    title,
    publisher,
    isbn,
    titleNumber,
    pages: draft.pages,
    deadline: draft.deadline,
    deadlineLabel: formatDateLabel(draft.deadline),
    progress: 1,
    status: "offen",
    risk: "niedrig",
    compositionProfile: draft.compositionProfile,
    profileWorkload: createInitialProfileWorkload(draft.profilePlan),
    phase: "Manuskript",
    leadId: draft.leadId,
    team: [draft.leadId],
    chapters: [],
    correctionSteps: [],
    comments: [],
    preflight: [],
    timeline: [],
    priceProfile: draft.priceProfile,
  };
}
