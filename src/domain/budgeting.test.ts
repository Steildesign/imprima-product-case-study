import { describe, expect, it } from "vitest";
import { getBudgetOverview, getProjectBudgetModel } from "./budgeting";
import type { Project } from "./types";

function createProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "fixture",
    title: "Fixture Project",
    publisher: "Verlag Zukunft",
    isbn: "978-3-000000-00-0",
    titleNumber: "FIX-001",
    pages: 100,
    deadline: "2026-08-01",
    deadlineLabel: "01.08.2026",
    progress: 50,
    status: "im-satz",
    risk: "mittel",
    compositionProfile: "linear",
    profileWorkload: [
      { profileId: "linear", plannedPages: 100, actualPages: 70, completedPages: 40, issueCount: 0 },
      { profileId: "image-led", plannedPages: 0, actualPages: 0, completedPages: 0, issueCount: 0 },
      { profileId: "complex", plannedPages: 0, actualPages: 0, completedPages: 0, issueCount: 0 },
    ],
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

describe("budgeting", () => {
  it("calculates a soft budget signal without requiring accounting data", () => {
    const model = getProjectBudgetModel(createProject());

    expect(model.priceProfile.publisher).toBe("Verlag Zukunft");
    expect(model.plannedTotal).toBe(1800);
    expect(model.actualTotal).toBe(1260);
    expect(model.usagePercent).toBe(70);
    expect(model.signal.id).toBe("puffer");
    expect(model.publicLabel).toBe("Puffer");
  });

  it("marks projects above the commissioned frame as nachtrag pruefen", () => {
    const model = getProjectBudgetModel(
      createProject({
        id: "over-plan",
        profileWorkload: [
          { profileId: "linear", plannedPages: 100, actualPages: 130, completedPages: 80, issueCount: 0 },
          { profileId: "image-led", plannedPages: 0, actualPages: 0, completedPages: 0, issueCount: 0 },
          { profileId: "complex", plannedPages: 0, actualPages: 0, completedPages: 0, issueCount: 0 },
        ],
      }),
    );

    expect(model.actualTotal).toBe(2340);
    expect(model.deltaAmount).toBe(540);
    expect(model.signal.id).toBe("nachtrag-pruefen");
    expect(model.publicLabel).toBe("Nachtrag prüfen");
  });

  it("adds weighted AI model usage as an internal budget line", () => {
    const model = getProjectBudgetModel(
      createProject({
        id: "kunst-des-satzes",
        profileWorkload: [
          { profileId: "linear", plannedPages: 0, actualPages: 0, completedPages: 0, issueCount: 0 },
          { profileId: "image-led", plannedPages: 0, actualPages: 0, completedPages: 0, issueCount: 0 },
          { profileId: "complex", plannedPages: 0, actualPages: 0, completedPages: 0, issueCount: 0 },
        ],
      }),
    );

    const aiLine = model.lines.find((line) => line.id === "ai-support");

    expect(aiLine).toMatchObject({
      label: "KI-Unterstützung",
      unitLabel: "gewichtete Läufe",
      plannedUnits: 44,
      actualUnits: 69,
      rate: 2,
      plannedAmount: 88,
      actualAmount: 138,
      deltaAmount: 50,
    });
    expect(aiLine?.detail).toContain("Textassistenz");
    expect(model.actualTotal).toBe(1392);
  });

  it("uses custom page rates from a newly created project before publisher defaults", () => {
    const model = getProjectBudgetModel(
      createProject({
        publisher: "Noch unbekannter Verlag",
        priceProfile: {
          label: "Projektangebot 2026",
          pageRates: {
            linear: 22,
            "image-led": 37,
            complex: 64,
          },
          imageEditingRate: 15,
          correctionRoundRate: 190,
          aiCreditRate: 3,
        },
      }),
    );

    expect(model.priceProfile).toMatchObject({
      publisher: "Noch unbekannter Verlag",
      label: "Projektangebot 2026",
    });
    expect(model.lines.find((line) => line.id === "linear")).toMatchObject({
      rate: 22,
      plannedAmount: 2200,
      actualAmount: 1540,
    });
  });

  it("aggregates project signals for overview surfaces", () => {
    const overview = getBudgetOverview([
      createProject({ id: "buffer" }),
      createProject({
        id: "watch",
        profileWorkload: [
          { profileId: "linear", plannedPages: 100, actualPages: 103, completedPages: 80, issueCount: 0 },
          { profileId: "image-led", plannedPages: 0, actualPages: 0, completedPages: 0, issueCount: 0 },
          { profileId: "complex", plannedPages: 0, actualPages: 0, completedPages: 0, issueCount: 0 },
        ],
      }),
      createProject({
        id: "over",
        profileWorkload: [
          { profileId: "linear", plannedPages: 100, actualPages: 125, completedPages: 90, issueCount: 0 },
          { profileId: "image-led", plannedPages: 0, actualPages: 0, completedPages: 0, issueCount: 0 },
          { profileId: "complex", plannedPages: 0, actualPages: 0, completedPages: 0, issueCount: 0 },
        ],
      }),
    ]);

    expect(overview.counts).toEqual({
      puffer: 1,
      "im-rahmen": 0,
      beobachten: 1,
      "nachtrag-pruefen": 1,
    });
    expect(overview.attentionCount).toBe(2);
    expect(overview.rows[0].project.id).toBe("over");
  });
});
