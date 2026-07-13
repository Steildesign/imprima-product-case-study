import { describe, expect, it } from "vitest";
import type { CommunicationDecisionEntry } from "./communicationAssist";
import { getTaskCommandCenter } from "./taskCommandCenter";
import type { TaskItem } from "./moduleData";
import type { Project } from "./types";

function createTask(overrides: Partial<TaskItem>): TaskItem {
  return {
    id: "task-fixture",
    title: "Fixture Aufgabe",
    projectId: "project-a",
    project: "Project A",
    owner: "M. Schneider",
    due: "Heute, 12:00",
    status: "Heute",
    priority: "mittel",
    detailStatus: "offen",
    chapter: "Kapitel 1",
    pageRange: "S. 1-24",
    productionPhase: "Korrektur",
    reason: "Fixture reason",
    impact: "Fixture impact",
    nextStep: "Fixture next step",
    relatedCommunicationId: "comm-a",
    checkpoints: ["Fixture checkpoint"],
    ...overrides,
  };
}

function createProject(overrides: Partial<Project>): Project {
  return {
    id: "project-a",
    title: "Project A",
    publisher: "Fixture Verlag",
    isbn: "978-3-000000-00-0",
    titleNumber: "FIX-001",
    pages: 120,
    deadline: "2026-07-24",
    deadlineLabel: "24.07.2026",
    progress: 45,
    status: "im-satz",
    risk: "mittel",
    compositionProfile: "linear",
    profileWorkload: [],
    phase: "Korrektur",
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

function createCommunicationEntry(overrides: Partial<CommunicationDecisionEntry>): CommunicationDecisionEntry {
  return {
    id: "comm-a",
    projectId: "project-a",
    kind: "klaerung",
    subject: "Fixture Klärung",
    from: "Redaktion",
    date: "Heute",
    ageInDays: 0,
    status: "offen",
    decisionRelevant: true,
    summary: "Fixture summary",
    impact: "Fixture impact",
    nextStep: "Fixture next step",
    ...overrides,
  };
}

describe("task command center", () => {
  it("summarizes task pressure into kpis, timeline, project focus and attention items", () => {
    const tasks = [
      createTask({
        id: "urgent-waiting",
        title: "Autorenantwort fehlt",
        projectId: "project-a",
        priority: "hoch",
        detailStatus: "wartet",
        status: "Heute",
        relatedCommunicationId: "comm-a",
      }),
      createTask({
        id: "active-tomorrow",
        title: "Preflight prüfen",
        projectId: "project-b",
        project: "Project B",
        priority: "mittel",
        detailStatus: "in-arbeit",
        status: "Morgen",
        relatedCommunicationId: "comm-b",
      }),
      createTask({
        id: "done-week",
        title: "Dateien ablegen",
        projectId: "project-a",
        priority: "niedrig",
        detailStatus: "erledigt",
        status: "Diese Woche",
        relatedCommunicationId: "comm-c",
      }),
    ];
    const projects = [
      createProject({ id: "project-a", title: "Project A", risk: "hoch", progress: 42 }),
      createProject({ id: "project-b", title: "Project B", risk: "niedrig", progress: 88 }),
    ];
    const communication = [
      createCommunicationEntry({ id: "comm-a", projectId: "project-a", status: "offen", ageInDays: 4 }),
      createCommunicationEntry({ id: "comm-b", projectId: "project-b", status: "umgesetzt", ageInDays: 0 }),
      createCommunicationEntry({ id: "comm-c", projectId: "project-a", status: "geklaert", ageInDays: 1 }),
    ];

    const model = getTaskCommandCenter(tasks, projects, communication);

    expect(model.kpis.map((kpi) => [kpi.id, kpi.value])).toEqual([
      ["today", "1"],
      ["attention", "1"],
      ["waiting", "1"],
      ["decision", "1"],
    ]);
    expect(model.timeline.find((bucket) => bucket.id === "Heute")).toMatchObject({
      taskCount: 1,
      highPriorityCount: 1,
      waitingCount: 1,
    });
    expect(model.projectFocus[0]).toMatchObject({
      projectId: "project-a",
      taskCount: 2,
      highPriorityCount: 1,
      openCommunicationCount: 1,
      tone: "red",
    });
    expect(model.ownerLoad[0]).toMatchObject({ owner: "M. Schneider", taskCount: 3 });
    expect(model.attentionItems[0]).toMatchObject({
      taskId: "urgent-waiting",
      linkedCommunicationStatus: "offen",
      tone: "red",
    });
  });
});
