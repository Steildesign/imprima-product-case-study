import { describe, expect, it } from "vitest";
import { projects } from "./mockData";
import {
  capacityWindows,
  getPhaseDateRangeLabel,
  getCapacityMotionState,
  getPhaseMotionState,
  getPlanningDateWindow,
  getProjectPlanningMeta,
  getProjectPlanningWindow,
  planningMonths,
  planningWeeks,
  productionPlanningPhases,
  vacationWindows,
} from "./productionPlanning";

describe("production planning", () => {
  it("covers a long-running planning horizon into 2027", () => {
    expect(planningMonths.at(0)).toMatchObject({ id: "2026-07" });
    expect(planningMonths.some((month) => month.year === "2027")).toBe(true);
    expect(planningMonths.length).toBeGreaterThanOrEqual(10);
    expect(planningWeeks.length).toBeGreaterThanOrEqual(40);
    expect(planningWeeks[0]).toMatchObject({ label: "KW 28", startDate: "2026-07-06" });
  });

  it("assigns every visible project a planning color and at least one production phase", () => {
    projects.forEach((project) => {
      expect(getProjectPlanningMeta(project.id).code.length).toBeGreaterThan(0);
      expect(productionPlanningPhases.some((phase) => phase.projectId === project.id)).toBe(true);
      expect(getProjectPlanningWindow(project.id)?.shortLabel).toMatch(/-/);
    });
  });

  it("marks vacation windows with clear planning quality", () => {
    expect(vacationWindows.map((window) => window.quality)).toContain("gut");
    expect(vacationWindows.map((window) => window.quality)).toContain("nicht-empfohlen");
  });

  it("derives motion signals for capacity and timeline phases", () => {
    const criticalCapacity = capacityWindows.find((window) => window.level === "kritisch");
    const calmCapacity = capacityWindows.find((window) => window.level === "ruhig");

    expect(criticalCapacity ? getCapacityMotionState(criticalCapacity) : undefined).toMatchObject({
      levelClass: "is-pressure",
      meterScale: 0.94,
      pulse: true,
    });
    expect(calmCapacity ? getCapacityMotionState(calmCapacity) : undefined).toMatchObject({
      levelClass: "is-calm",
      pulse: false,
    });
    expect(getPhaseMotionState(productionPlanningPhases[2], 2)).toMatchObject({
      delayMs: 180,
      loadClass: "is-pressure",
    });
  });

  it("exposes taggenaue planning windows for timeline editing", () => {
    const phase = productionPlanningPhases.find((item) => item.id === "kds-freigabe");

    expect(phase ? getPlanningDateWindow(phase) : undefined).toMatchObject({
      startDate: "2026-07-27",
      endDate: "2026-08-07",
    });
    expect(phase ? getPhaseDateRangeLabel(getPlanningDateWindow(phase)) : undefined).toBe("27.07.-07.08.");
  });
});
