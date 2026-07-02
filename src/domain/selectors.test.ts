import { describe, expect, it } from "vitest";
import { projects } from "./mockData";
import {
  getActiveCorrectionStep,
  getProjectById,
  getProjectRiskCounts,
  getVisibleProjects,
  summarizePreflight,
} from "./selectors";

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
    expect(step.label).toBe("Autorenkorrektur");
    expect(step.state).toBe("active");
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
});
