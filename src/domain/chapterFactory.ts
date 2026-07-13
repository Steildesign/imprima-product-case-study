import type { Chapter, ProductionStatus, RiskLevel } from "./types";

export interface ChapterDraft {
  title: string;
  fromPage: number;
  toPage: number;
  ownerId: string;
  status: ProductionStatus;
  correctionRound: string;
  risk: RiskLevel;
  note: string;
}

export type ChapterDraftIssueId = "title" | "ownerId" | "correctionRound" | "pageRange";

export interface ChapterDraftIssue {
  id: ChapterDraftIssueId;
  label: string;
}

const chapterIssueLabels: Record<ChapterDraftIssueId, string> = {
  title: "Kapiteltitel fehlt.",
  ownerId: "Verantwortliche Person fehlt.",
  correctionRound: "Korrekturrunde fehlt.",
  pageRange: "Seitenbereich muss innerhalb des Projekts liegen.",
};

function slugify(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "kapitel";
}

function createIssue(id: ChapterDraftIssueId): ChapterDraftIssue {
  return { id, label: chapterIssueLabels[id] };
}

function getUniqueChapterId(baseId: string, existingChapterIds: string[]) {
  const usedIds = new Set(existingChapterIds);
  let chapterId = baseId;
  let suffix = 2;

  while (usedIds.has(chapterId)) {
    chapterId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  return chapterId;
}

export function getChapterDraftIssues(draft: ChapterDraft, projectPages: number): ChapterDraftIssue[] {
  const issues: ChapterDraftIssue[] = [];
  const hasValidPageRange =
    Number.isInteger(draft.fromPage) &&
    Number.isInteger(draft.toPage) &&
    draft.fromPage > 0 &&
    draft.toPage >= draft.fromPage &&
    draft.toPage <= projectPages;

  if (!draft.title.trim()) {
    issues.push(createIssue("title"));
  }

  if (!draft.ownerId.trim()) {
    issues.push(createIssue("ownerId"));
  }

  if (!draft.correctionRound.trim()) {
    issues.push(createIssue("correctionRound"));
  }

  if (!hasValidPageRange) {
    issues.push(createIssue("pageRange"));
  }

  return issues;
}

export function createChapterFromDraft(
  draft: ChapterDraft,
  context: { projectPages: number; existingChapterIds: string[] },
): Chapter {
  const issues = getChapterDraftIssues(draft, context.projectPages);
  if (issues.length > 0) {
    throw new Error(`Kapitel ist unvollständig: ${issues.map((issue) => issue.label).join(" ")}`);
  }

  const title = draft.title.trim();

  return {
    id: getUniqueChapterId(slugify(title), context.existingChapterIds),
    title,
    pages: `S. ${draft.fromPage}-${draft.toPage}`,
    ownerId: draft.ownerId,
    status: draft.status,
    correctionRound: draft.correctionRound.trim(),
    risk: draft.risk,
    blocker: draft.note.trim() || undefined,
  };
}
