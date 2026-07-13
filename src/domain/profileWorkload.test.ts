import { describe, expect, it } from "vitest";
import {
  getDominantActualProfile,
  getProfileWorkloadMotion,
  getProfileWorkloadBalance,
  getProfileWorkloadTotals,
  getProjectProfileWorkloadSummary,
  estimateRemainingDailyCapacity,
} from "./profileWorkload";
import type { Project } from "./types";

function createProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "fixture",
    title: "Fixture Project",
    publisher: "Fixture Verlag",
    isbn: "978-3-000000-00-0",
    titleNumber: "FIX-300",
    pages: 300,
    deadline: "2026-06-30",
    deadlineLabel: "30.06.2026",
    progress: 0,
    status: "offen",
    risk: "niedrig",
    compositionProfile: "image-led",
    phase: "Fixture",
    leadId: "m-schneider",
    team: [],
    chapters: [],
    correctionSteps: [],
    comments: [],
    preflight: [],
    timeline: [],
    profileWorkload: [
      { profileId: "linear", plannedPages: 180, actualPages: 150, completedPages: 120, issueCount: 0 },
      { profileId: "image-led", plannedPages: 90, actualPages: 105, completedPages: 50, issueCount: 2 },
      { profileId: "complex", plannedPages: 30, actualPages: 45, completedPages: 8, issueCount: 5 },
    ],
    ...overrides,
  };
}

describe("profile workload", () => {
  it("summarizes plan, actual workload, remaining pages and risk state per composition profile", () => {
    const summary = getProjectProfileWorkloadSummary(createProject());

    expect(summary).toMatchObject({
      plannedPages: 300,
      actualPages: 300,
      completedPages: 178,
      remainingPages: 122,
      issueCount: 7,
      overPlanPages: 30,
      highestState: "ueber-plan",
    });
    expect(summary.rows.map((row) => [row.profile.id, row.deltaPages, row.remainingPages, row.completion, row.state]))
      .toEqual([
        ["linear", -30, 30, 80, "im-plan"],
        ["image-led", 15, 55, 48, "ueber-plan"],
        ["complex", 15, 37, 18, "ueber-plan"],
      ]);
  });

  it("identifies the dominant actual profile and estimates mixed remaining capacity", () => {
    const project = createProject();

    expect(getDominantActualProfile(project).profile.shortLabel).toBe("Linear");
    expect(estimateRemainingDailyCapacity(project)).toBe(37);
  });

  it("aggregates workload totals across projects", () => {
    const totals = getProfileWorkloadTotals([
      createProject({ id: "a" }),
      createProject({
        id: "b",
        pages: 120,
        profileWorkload: [
          { profileId: "linear", plannedPages: 80, actualPages: 74, completedPages: 30, issueCount: 1 },
          { profileId: "image-led", plannedPages: 40, actualPages: 38, completedPages: 12, issueCount: 0 },
          { profileId: "complex", plannedPages: 0, actualPages: 8, completedPages: 0, issueCount: 2 },
        ],
      }),
    ]);

    expect(totals.map((row) => [row.profile.id, row.plannedPages, row.actualPages, row.completedPages, row.issueCount]))
      .toEqual([
        ["linear", 260, 224, 150, 1],
        ["image-led", 130, 143, 62, 2],
        ["complex", 30, 53, 8, 7],
      ]);
  });

  it("derives a directional balance between planned and actual Satzmix", () => {
    const summary = getProjectProfileWorkloadSummary(createProject());
    const balance = getProfileWorkloadBalance(summary.rows);

    expect(balance).toMatchObject({
      plannedPages: 300,
      actualPages: 300,
      totalDeltaPages: 0,
      complexityShiftPercent: 8,
      direction: "more-complex",
    });
    expect(balance.rows.map((row) => [row.profile.id, row.plannedShare, row.actualShare, row.shareDelta]))
      .toEqual([
        ["linear", 60, 50, -10],
        ["image-led", 30, 35, 5],
        ["complex", 10, 15, 5],
      ]);
    expect(balance.dominantShift?.profile.id).toBe("linear");
  });

  it("classifies the motion emphasis for visible Satzmix shifts", () => {
    const summary = getProjectProfileWorkloadSummary(createProject());
    const motion = getProfileWorkloadMotion(summary.rows);

    expect(motion).toEqual({
      intensity: "flow",
      maxShareDelta: 10,
      dominantProfileId: "linear",
      hasMaterialShift: true,
    });
  });
});
