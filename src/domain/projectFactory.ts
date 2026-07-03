import type { Project } from "./types";

export interface ProjectDraft {
  title: string;
  publisher: string;
  isbn: string;
  pages: number;
  deadline: string;
  leadId: string;
}

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

export function createProjectFromDraft(draft: ProjectDraft): Project {
  const title = draft.title.trim();
  const publisher = draft.publisher.trim();

  return {
    id: slugify(title),
    title,
    publisher,
    isbn: draft.isbn.trim() || "ISBN offen",
    pages: draft.pages,
    deadline: draft.deadline,
    deadlineLabel: formatDateLabel(draft.deadline),
    progress: 1,
    status: "offen",
    risk: "niedrig",
    phase: "Manuskript",
    leadId: draft.leadId,
    team: [draft.leadId],
    chapters: [],
    correctionSteps: [],
    comments: [],
    preflight: [],
    timeline: [],
  };
}
