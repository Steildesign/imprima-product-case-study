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

  it("counts project risks for the production overview", () => {
    expect(getProjectRiskCounts(projects)).toEqual({
      hoch: 1,
      mittel: 2,
      niedrig: 2,
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

  it("summarizes preflight checks", () => {
    const project = getProjectById(projects, "nachhaltig-handeln");
    expect(summarizePreflight(project.preflight)).toEqual({
      passed: 6,
      warning: 1,
      failed: 0,
      total: 7,
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
