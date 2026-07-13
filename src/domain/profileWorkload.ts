import { compositionProfiles, getCompositionProfile, type CompositionProfile } from "./compositionProfiles";
import type { CompositionProfileId, ProfileWorkload, ProfileWorkloadState, Project } from "./types";

export interface ProfileWorkloadRow extends ProfileWorkload {
  profile: CompositionProfile;
  remainingPages: number;
  deltaPages: number;
  actualShare: number;
  completion: number;
  state: ProfileWorkloadState;
  stateLabel: string;
}

export interface ProfileWorkloadSummary {
  rows: ProfileWorkloadRow[];
  plannedPages: number;
  actualPages: number;
  completedPages: number;
  remainingPages: number;
  issueCount: number;
  overPlanPages: number;
  highestState: ProfileWorkloadState;
  dominantProfile: ProfileWorkloadRow;
  projectedDailyCapacity: number;
}

export type ProfileWorkloadBalanceDirection = "less-complex" | "stable" | "more-complex";

export interface ProfileWorkloadBalanceRow {
  profile: CompositionProfile;
  plannedPages: number;
  actualPages: number;
  plannedShare: number;
  actualShare: number;
  shareDelta: number;
}

export interface ProfileWorkloadBalance {
  rows: ProfileWorkloadBalanceRow[];
  plannedPages: number;
  actualPages: number;
  totalDeltaPages: number;
  complexityShiftPercent: number;
  direction: ProfileWorkloadBalanceDirection;
  dominantShift?: ProfileWorkloadBalanceRow;
}

export type ProfileWorkloadMotionIntensity = "settled" | "flow" | "alert";

export interface ProfileWorkloadMotion {
  intensity: ProfileWorkloadMotionIntensity;
  maxShareDelta: number;
  dominantProfileId?: CompositionProfileId;
  hasMaterialShift: boolean;
}

export const dailyCapacityByProfile: Record<CompositionProfileId, number> = {
  linear: 70,
  "image-led": 42,
  complex: 24,
};

const complexityWeightByProfile: Record<CompositionProfileId, number> = {
  linear: 1,
  "image-led": 2,
  complex: 3,
};

const stateLabels: Record<ProfileWorkloadState, string> = {
  "im-plan": "Im Plan",
  beobachten: "Beobachten",
  "ueber-plan": "Über Plan",
};

const stateRank: Record<ProfileWorkloadState, number> = {
  "im-plan": 0,
  beobachten: 1,
  "ueber-plan": 2,
};

function cleanPageCount(value: number): number {
  return Math.max(0, Math.round(Number.isFinite(value) ? value : 0));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getRoundedShare(pages: number, totalPages: number): number {
  return totalPages === 0 ? 0 : Math.round((pages / totalPages) * 100);
}

function getWorkloadState(plannedPages: number, actualPages: number, issueCount: number): ProfileWorkloadState {
  if (plannedPages === 0 && actualPages > 0) {
    return "ueber-plan";
  }

  if (plannedPages > 0 && actualPages / plannedPages > 1.1) {
    return "ueber-plan";
  }

  if (actualPages > plannedPages || issueCount > 0) {
    return "beobachten";
  }

  return "im-plan";
}

function getNormalizedRows(workload: ProfileWorkload[]): ProfileWorkload[] {
  return compositionProfiles.map((profile) => {
    const entry = workload.find((item) => item.profileId === profile.id);
    const actualPages = cleanPageCount(entry?.actualPages ?? 0);

    return {
      profileId: profile.id,
      plannedPages: cleanPageCount(entry?.plannedPages ?? 0),
      actualPages,
      completedPages: Math.min(cleanPageCount(entry?.completedPages ?? 0), actualPages),
      issueCount: cleanPageCount(entry?.issueCount ?? 0),
    };
  });
}

function buildRows(workload: ProfileWorkload[]): ProfileWorkloadRow[] {
  const normalizedRows = getNormalizedRows(workload);
  const totalActualPages = normalizedRows.reduce((sum, row) => sum + row.actualPages, 0);

  return normalizedRows.map((row) => {
    const remainingPages = Math.max(0, row.actualPages - row.completedPages);
    const deltaPages = row.actualPages - row.plannedPages;
    const completion = row.actualPages === 0 ? 0 : Math.round((row.completedPages / row.actualPages) * 100);
    const state = getWorkloadState(row.plannedPages, row.actualPages, row.issueCount);

    return {
      ...row,
      profile: getCompositionProfile(row.profileId),
      remainingPages,
      deltaPages,
      actualShare: totalActualPages === 0 ? 0 : Math.round((row.actualPages / totalActualPages) * 100),
      completion,
      state,
      stateLabel: stateLabels[state],
    };
  });
}

function getHighestState(rows: ProfileWorkloadRow[]): ProfileWorkloadState {
  return rows.reduce<ProfileWorkloadState>(
    (highest, row) => (stateRank[row.state] > stateRank[highest] ? row.state : highest),
    "im-plan",
  );
}

function getFallbackWorkload(project: Project): ProfileWorkload[] {
  const completedPages = Math.round(project.pages * (project.progress / 100));

  return compositionProfiles.map((profile) => ({
    profileId: profile.id,
    plannedPages: profile.id === project.compositionProfile ? project.pages : 0,
    actualPages: profile.id === project.compositionProfile ? project.pages : 0,
    completedPages: profile.id === project.compositionProfile ? completedPages : 0,
    issueCount: profile.id === project.compositionProfile && project.blocker ? 1 : 0,
  }));
}

export function createInitialProfileWorkload(plan: Record<CompositionProfileId, number>): ProfileWorkload[] {
  return compositionProfiles.map((profile, index) => {
    const plannedPages = cleanPageCount(plan[profile.id]);

    return {
      profileId: profile.id,
      plannedPages,
      actualPages: plannedPages,
      completedPages: index === 0 && plannedPages > 0 ? 1 : 0,
      issueCount: 0,
    };
  });
}

export function getProjectProfileWorkloadRows(project: Project): ProfileWorkloadRow[] {
  return buildRows(project.profileWorkload.length > 0 ? project.profileWorkload : getFallbackWorkload(project));
}

export function getDominantActualProfile(project: Project): ProfileWorkloadRow {
  const rows = getProjectProfileWorkloadRows(project);

  return rows.reduce((dominant, row) => (row.actualPages > dominant.actualPages ? row : dominant), rows[0]);
}

function getWeightedComplexity(rows: ProfileWorkloadRow[], value: "plannedPages" | "actualPages"): number {
  const totalPages = rows.reduce((sum, row) => sum + row[value], 0);

  if (totalPages === 0) {
    return 0;
  }

  return rows.reduce((sum, row) => {
    return sum + (row[value] * complexityWeightByProfile[row.profile.id]) / totalPages;
  }, 0);
}

export function getProfileWorkloadBalance(rows: ProfileWorkloadRow[]): ProfileWorkloadBalance {
  const plannedPages = rows.reduce((sum, row) => sum + row.plannedPages, 0);
  const actualPages = rows.reduce((sum, row) => sum + row.actualPages, 0);
  const plannedComplexity = getWeightedComplexity(rows, "plannedPages");
  const actualComplexity = getWeightedComplexity(rows, "actualPages");
  const normalizedComplexityShift = ((actualComplexity - plannedComplexity) / 2) * 100;
  const complexityShiftPercent = clamp(Math.round(normalizedComplexityShift + 1e-9), -100, 100);
  const balanceRows = rows.map<ProfileWorkloadBalanceRow>((row) => {
    const plannedShare = getRoundedShare(row.plannedPages, plannedPages);
    const actualShare = getRoundedShare(row.actualPages, actualPages);

    return {
      profile: row.profile,
      plannedPages: row.plannedPages,
      actualPages: row.actualPages,
      plannedShare,
      actualShare,
      shareDelta: actualShare - plannedShare,
    };
  });
  const dominantShift = balanceRows.reduce<ProfileWorkloadBalanceRow | undefined>((dominant, row) => {
    if (row.shareDelta === 0) {
      return dominant;
    }

    if (!dominant || Math.abs(row.shareDelta) > Math.abs(dominant.shareDelta)) {
      return row;
    }

    return dominant;
  }, undefined);
  const direction =
    Math.abs(complexityShiftPercent) < 3
      ? "stable"
      : complexityShiftPercent > 0
        ? "more-complex"
        : "less-complex";

  return {
    rows: balanceRows,
    plannedPages,
    actualPages,
    totalDeltaPages: actualPages - plannedPages,
    complexityShiftPercent,
    direction,
    dominantShift,
  };
}

export function getProfileWorkloadMotion(rows: ProfileWorkloadRow[]): ProfileWorkloadMotion {
  const balance = getProfileWorkloadBalance(rows);
  const maxShareDelta = balance.rows.reduce((max, row) => Math.max(max, Math.abs(row.shareDelta)), 0);
  const shiftStrength = Math.max(maxShareDelta, Math.abs(balance.complexityShiftPercent));
  const intensity: ProfileWorkloadMotionIntensity =
    shiftStrength >= 14 ? "alert" : shiftStrength >= 4 ? "flow" : "settled";

  return {
    intensity,
    maxShareDelta,
    dominantProfileId: balance.dominantShift?.profile.id,
    hasMaterialShift: shiftStrength >= 4,
  };
}

export function estimateRemainingDailyCapacity(project: Project): number {
  const rows = getProjectProfileWorkloadRows(project);
  const remainingPages = rows.reduce((sum, row) => sum + row.remainingPages, 0);

  if (remainingPages === 0) {
    return dailyCapacityByProfile[getDominantActualProfile(project).profile.id];
  }

  const estimatedDays = rows.reduce((sum, row) => {
    return sum + row.remainingPages / dailyCapacityByProfile[row.profile.id];
  }, 0);

  return Math.max(1, Math.round(remainingPages / estimatedDays));
}

export function getProjectProfileWorkloadSummary(project: Project): ProfileWorkloadSummary {
  const rows = getProjectProfileWorkloadRows(project);

  return {
    rows,
    plannedPages: rows.reduce((sum, row) => sum + row.plannedPages, 0),
    actualPages: rows.reduce((sum, row) => sum + row.actualPages, 0),
    completedPages: rows.reduce((sum, row) => sum + row.completedPages, 0),
    remainingPages: rows.reduce((sum, row) => sum + row.remainingPages, 0),
    issueCount: rows.reduce((sum, row) => sum + row.issueCount, 0),
    overPlanPages: rows.reduce((sum, row) => sum + Math.max(0, row.deltaPages), 0),
    highestState: getHighestState(rows),
    dominantProfile: getDominantActualProfile(project),
    projectedDailyCapacity: estimateRemainingDailyCapacity(project),
  };
}

export function getProfileWorkloadTotals(projects: Project[]): ProfileWorkloadRow[] {
  const totals = compositionProfiles.map<ProfileWorkload>((profile) => ({
    profileId: profile.id,
    plannedPages: 0,
    actualPages: 0,
    completedPages: 0,
    issueCount: 0,
  }));

  projects.forEach((project) => {
    getProjectProfileWorkloadRows(project).forEach((row) => {
      const total = totals.find((item) => item.profileId === row.profile.id);
      if (!total) {
        return;
      }

      total.plannedPages += row.plannedPages;
      total.actualPages += row.actualPages;
      total.completedPages += row.completedPages;
      total.issueCount += row.issueCount;
    });
  });

  return buildRows(totals);
}
