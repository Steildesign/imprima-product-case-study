import { describe, expect, it } from "vitest";
import {
  getCorrectionChartData,
  getPreflightChartData,
  getProjectReadinessChartData,
  getTaskChartData,
} from "./chartVisuals";
import type { CorrectionStep, PreflightCheck, Project } from "./types";
import type { TaskItem } from "./moduleData";

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

describe("chart visuals", () => {
  it("derives correction flow segments and completion", () => {
    const steps: CorrectionStep[] = [
      { id: "v1", label: "V1", owner: "Satz", date: "01.07.", state: "done", note: "Fertig" },
      { id: "author", label: "Autorenkorrektur", owner: "Autor", date: "08.07.", state: "active", note: "Aktiv" },
      { id: "final", label: "Freigabe", owner: "Herstellung", date: "15.07.", state: "planned", note: "Geplant" },
    ];

    expect(getCorrectionChartData(steps)).toMatchObject({
      title: "Korrekturfluss",
      total: 3,
      primaryValue: "53%",
      statusLabel: "Aktiv",
      segments: [
        { id: "done", label: "Erledigt", value: 1, percent: 33, tone: "green" },
        { id: "active", label: "Aktiv", value: 1, percent: 33, tone: "blue" },
        { id: "planned", label: "Geplant", value: 1, percent: 33, tone: "gray" },
      ],
    });
  });

  it("derives preflight quality with warnings and failed checks", () => {
    const checks: PreflightCheck[] = [
      { id: "pdfx", label: "PDF/X", state: "passed", details: "OK" },
      { id: "alt", label: "Alt-Texte", state: "warning", details: "Prüfen" },
      { id: "fonts", label: "Schriften", state: "failed", details: "Fehlt" },
      { id: "links", label: "Links", state: "passed", details: "OK" },
    ];

    expect(getPreflightChartData(checks)).toMatchObject({
      title: "Preflight-Qualität",
      total: 4,
      primaryValue: "50%",
      statusLabel: "Fehler offen",
      segments: [
        { id: "passed", label: "Erfüllt", value: 2, percent: 50, tone: "green" },
        { id: "warning", label: "Hinweis", value: 1, percent: 25, tone: "orange" },
        { id: "failed", label: "Fehler", value: 1, percent: 25, tone: "red" },
      ],
    });
  });

  it("derives task pressure across priority and status", () => {
    const tasks: TaskItem[] = [
      {
        id: "a",
        title: "A",
        projectId: "p",
        project: "P",
        owner: "O",
        due: "Heute",
        status: "Heute",
        priority: "hoch",
        detailStatus: "offen",
        chapter: "K",
        pageRange: "S. 1",
        productionPhase: "Phase",
        reason: "Grund",
        impact: "Wirkung",
        nextStep: "Schritt",
        relatedCommunicationId: "c",
        checkpoints: [],
      },
      {
        id: "b",
        title: "B",
        projectId: "p",
        project: "P",
        owner: "O",
        due: "Morgen",
        status: "Morgen",
        priority: "mittel",
        detailStatus: "in-arbeit",
        chapter: "K",
        pageRange: "S. 2",
        productionPhase: "Phase",
        reason: "Grund",
        impact: "Wirkung",
        nextStep: "Schritt",
        relatedCommunicationId: "c",
        checkpoints: [],
      },
    ];

    const chart = getTaskChartData(tasks);

    expect(chart.pressure.primaryValue).toBe("50%");
    expect(chart.pressure.statusLabel).toBe("1 hoch priorisiert");
    expect(chart.status.primaryValue).toBe("0%");
    expect(chart.status.statusLabel).toBe("1 aktiv · 0 wartet");
    expect(chart.status.segments.map((segment) => [segment.id, segment.value, segment.percent])).toEqual([
      ["offen", 1, 50],
      ["wartet", 0, 0],
      ["in-arbeit", 1, 50],
      ["erledigt", 0, 0],
    ]);
  });

  it("derives project readiness from status and risk", () => {
    const chart = getProjectReadinessChartData([
      createProject({ id: "a", status: "freigegeben", risk: "niedrig" }),
      createProject({ id: "b", status: "preflight", risk: "mittel" }),
      createProject({ id: "c", status: "in-korrektur", risk: "hoch" }),
    ]);

    expect(chart.readiness.primaryValue).toBe("67%");
    expect(chart.readiness.title).toBe("Freigabe");
    expect(chart.readiness.statusLabel).toBe("2 von 3 Titeln nahe Freigabe");
    expect(chart.risk.primaryValue).toBe("50%");
    expect(chart.risk.statusLabel).toBe("1 hoch · 1 mittel");
    expect(chart.risk.segments.map((segment) => [segment.id, segment.value, segment.percent])).toEqual([
      ["niedrig", 1, 33],
      ["mittel", 1, 33],
      ["hoch", 1, 33],
    ]);
  });
});
