import { describe, expect, expectTypeOf, it } from "vitest";
import { projects } from "./mockData";
import {
  getActiveCorrectionStep,
  getProjectById,
  getProjectRiskCounts,
  getVisibleProjects,
  summarizePreflight,
} from "./selectors";
import type { CorrectionStep, Project } from "./types";

function createProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "fixture",
    title: "Fixture Project",
    publisher: "Fixture Verlag",
    isbn: "978-3-000000-00-0",
    pages: 120,
    deadline: "2026-06-30",
    deadlineLabel: "30.06.2026",
    progress: 0,
    status: "offen",
    risk: "niedrig",
    compositionProfile: "linear",
    phase: "Fixture",
    leadId: "m-schneider",
    team: [],
    chapters: [],
    correctionSteps: [
      {
        id: "fixture-step",
        label: "Fixture Step",
        owner: "Fixture",
        date: "01.06.",
        state: "planned",
        note: "Planned",
      },
    ],
    comments: [],
    preflight: [],
    timeline: [],
    ...overrides,
  };
}

describe("project selectors", () => {
  it("finds the canonical hero project by id", () => {
    const project = getProjectById(projects, "kunst-des-satzes");
    expect(project.title).toBe("Die Kunst des Satzes");
    expect(project.chapters).toHaveLength(6);
  });

  it("filters projects by risk and search term", () => {
    const visible = getVisibleProjects(projects, {
      query: "digital",
      risk: "hoch",
      status: "alle",
    });
    expect(visible.map((project) => project.title)).toEqual(["Digital Mindset"]);
  });

  it("filters projects by status", () => {
    const visible = getVisibleProjects(
      [
        createProject({ id: "open", title: "Open Project", status: "offen" }),
        createProject({ id: "released", title: "Released Project", status: "freigegeben" }),
      ],
      {
        query: "",
        risk: "alle",
        status: "freigegeben",
      },
    );

    expect(visible.map((project) => project.id)).toEqual(["released"]);
  });

  it("matches project queries against publisher and ISBN", () => {
    const fixtureProjects = [
      createProject({
        id: "publisher-match",
        title: "Typography Notes",
        publisher: "Acme Press",
        isbn: "978-3-111111-11-1",
      }),
      createProject({
        id: "isbn-match",
        title: "Layout Notes",
        publisher: "Beta Books",
        isbn: "978-3-222222-22-2",
      }),
    ];

    expect(
      getVisibleProjects(fixtureProjects, {
        query: "acme",
        risk: "alle",
        status: "alle",
      }).map((project) => project.id),
    ).toEqual(["publisher-match"]);
    expect(
      getVisibleProjects(fixtureProjects, {
        query: "222222-22",
        risk: "alle",
        status: "alle",
      }).map((project) => project.id),
    ).toEqual(["isbn-match"]);
  });

  it("counts project risks for the production overview", () => {
    expect(getProjectRiskCounts(projects)).toEqual({
      hoch: 1,
      mittel: 2,
      niedrig: 2,
    });
  });

  it("counts project risks for synthetic projects", () => {
    expect(
      getProjectRiskCounts([
        createProject({ id: "low-a", risk: "niedrig" }),
        createProject({ id: "medium-a", risk: "mittel" }),
        createProject({ id: "medium-b", risk: "mittel" }),
        createProject({ id: "high-a", risk: "hoch" }),
      ]),
    ).toEqual({
      hoch: 1,
      mittel: 2,
      niedrig: 1,
    });
  });

  it("returns the active correction step for the hero project", () => {
    const project = getProjectById(projects, "kunst-des-satzes");
    const step = getActiveCorrectionStep(project);
    if (!step) {
      throw new Error("Expected hero project to have an active correction step");
    }
    expect(step.label).toBe("Autorenkorrektur");
    expect(step.state).toBe("active");
  });

  it("returns undefined when a project has no correction steps", () => {
    const step = getActiveCorrectionStep(createProject({ correctionSteps: [] }));

    expectTypeOf(step).toEqualTypeOf<CorrectionStep | undefined>();
    expect(step).toBeUndefined();
  });

  it("returns undefined when all correction steps are done or planned", () => {
    const step = getActiveCorrectionStep(
      createProject({
        correctionSteps: [
          {
            id: "done-step",
            label: "V1",
            owner: "Satz",
            date: "01.06.",
            state: "done",
            note: "Complete",
          },
          {
            id: "planned-step",
            label: "Freigabe",
            owner: "Herstellung",
            date: "08.06.",
            state: "planned",
            note: "Planned",
          },
        ],
      }),
    );

    expect(step).toBeUndefined();
  });

  it("summarizes mixed preflight checks", () => {
    expect(
      summarizePreflight([
        { id: "pdfx", label: "PDF/X", state: "passed", details: "OK" },
        { id: "wcag", label: "WCAG", state: "warning", details: "Review alt text" },
        { id: "fonts", label: "Fonts", state: "failed", details: "Missing font" },
        { id: "links", label: "Links", state: "passed", details: "OK" },
      ]),
    ).toEqual({
      passed: 2,
      warning: 1,
      failed: 1,
      total: 4,
    });
  });

  it("summarizes an empty preflight checklist", () => {
    expect(summarizePreflight([])).toEqual({
      passed: 0,
      warning: 0,
      failed: 0,
      total: 0,
    });
  });
});
