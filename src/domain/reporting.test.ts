import { describe, expect, it } from "vitest";
import { getRunningReportModel } from "./reporting";
import type { CommunicationDecisionEntry } from "./communicationAssist";
import type { Project } from "./types";

function createProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "fixture",
    title: "Fixture Project",
    publisher: "Fixture Verlag",
    isbn: "978-3-000000-00-0",
    titleNumber: "FIX-000",
    pages: 120,
    deadline: "2026-06-30",
    deadlineLabel: "30.06.2026",
    progress: 0,
    status: "offen",
    risk: "niedrig",
    compositionProfile: "linear",
    profileWorkload: [],
    phase: "Fixture",
    leadId: "m-schneider",
    team: [],
    chapters: [],
    correctionSteps: [],
    comments: [],
    preflight: [],
    timeline: [],
    ...overrides,
  };
}

function createEntry(overrides: Partial<CommunicationDecisionEntry> = {}): CommunicationDecisionEntry {
  return {
    id: "entry-fixture",
    projectId: "fixture",
    kind: "klaerung",
    subject: "Fixture Klärung",
    from: "Redaktion",
    date: "Heute, 10:00",
    ageInDays: 0,
    status: "offen",
    decisionRelevant: true,
    summary: "Fixture summary.",
    impact: "Fixture impact.",
    nextStep: "Fixture next step.",
    ...overrides,
  };
}

describe("running report model", () => {
  it("reports only active projects and escalates inquiries after three days", () => {
    const projects = [
      createProject({ id: "active-a", title: "Aktiv A", status: "im-satz", risk: "hoch", progress: 42 }),
      createProject({ id: "active-b", title: "Aktiv B", status: "preflight", risk: "niedrig", progress: 88 }),
      createProject({ id: "done", title: "Archiviert", status: "freigegeben", risk: "niedrig", progress: 100 }),
    ];
    const entries = [
      createEntry({ id: "fresh", projectId: "active-a", ageInDays: 2, status: "offen" }),
      createEntry({ id: "stalled", projectId: "active-a", ageInDays: 4, status: "wartet" }),
      createEntry({ id: "done-entry", projectId: "active-b", ageInDays: 6, status: "umgesetzt" }),
      createEntry({ id: "archived-entry", projectId: "done", ageInDays: 7, status: "offen" }),
    ];

    const model = getRunningReportModel(projects, entries);

    expect(model.runningProjects.map((project) => project.id)).toEqual(["active-a", "active-b"]);
    expect(model.highlightCards.map((card) => [card.id, card.value])).toEqual([
      ["running-projects", "2"],
      ["report-attention", "1"],
      ["inquiry-backlog", "1"],
    ]);
    expect(model.projectRows.map((row) => [row.project.id, row.openInquiryCount, row.stalledInquiryCount])).toEqual([
      ["active-a", 2, 1],
      ["active-b", 0, 0],
    ]);
    expect(model.inquiryBacklog.map((entry) => entry.id)).toEqual(["stalled"]);
  });
});
