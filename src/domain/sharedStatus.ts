import { getCompositionProfile } from "./compositionProfiles";
import { getActiveCorrectionStep, summarizePreflight } from "./selectors";
import { getRiskVisual, getStatusVisual } from "./statusVisuals";
import type { CompositionProfileId, Project } from "./types";

export type FeasibilityLevel = "realistic" | "critical" | "not-realistic";

export interface DeliveryRequest {
  requestedPages: number;
  availableWorkdays: number;
}

export interface DeliveryFeasibility extends DeliveryRequest {
  level: FeasibilityLevel;
  capacityPages: number;
  message: string;
}

const dailyCapacityByProfile: Record<CompositionProfileId, number> = {
  linear: 70,
  "image-led": 42,
  complex: 24,
};

const defaultDeliveryRequest: DeliveryRequest = {
  requestedPages: 360,
  availableWorkdays: 3,
};

export function getSharedStatusPath(projectId: string): string {
  return `/status/${projectId}`;
}

export function estimateDeliveryFeasibility(project: Project, request: DeliveryRequest): DeliveryFeasibility {
  const dailyCapacity = dailyCapacityByProfile[project.compositionProfile];
  const capacityPages = dailyCapacity * request.availableWorkdays;
  const pressure = request.requestedPages / capacityPages;

  if (pressure > 1.15) {
    return {
      ...request,
      capacityPages,
      level: "not-realistic",
      message: `${request.requestedPages} Seiten in ${request.availableWorkdays} Arbeitstagen sind mit diesem Satzprofil nicht seriös machbar.`,
    };
  }

  if (pressure > 0.85) {
    return {
      ...request,
      capacityPages,
      level: "critical",
      message: `${request.requestedPages} Seiten sind kritisch und nur mit reduziertem Korrektur- oder Layoutumfang realistisch.`,
    };
  }

  return {
    ...request,
    capacityPages,
    level: "realistic",
    message: `${request.requestedPages} Seiten liegen innerhalb des geschätzten Produktionsfensters.`,
  };
}

export function buildSharedStatus(project: Project, request: DeliveryRequest = defaultDeliveryRequest) {
  const profile = getCompositionProfile(project.compositionProfile);
  const activeStep = getActiveCorrectionStep(project);
  const preflight = summarizePreflight(project.preflight);
  const remainingPages = Math.max(0, Math.round(project.pages * (1 - project.progress / 100)));
  const status = getStatusVisual(project.status);
  const risk = getRiskVisual(project.risk);
  const openItems = [
    project.blocker,
    activeStep ? `${activeStep.label}: ${activeStep.note}` : undefined,
    preflight.warning > 0 ? `${preflight.warning} Preflight-Hinweis(e) offen` : undefined,
    preflight.failed > 0 ? `${preflight.failed} Preflight-Blocker offen` : undefined,
  ].filter((item): item is string => Boolean(item));

  return {
    projectId: project.id,
    sharePath: getSharedStatusPath(project.id),
    title: project.title,
    publisher: project.publisher,
    statusLabel: status.label,
    riskLabel: risk.label,
    phase: project.phase,
    progress: project.progress,
    pages: project.pages,
    remainingPages,
    deadlineLabel: project.deadlineLabel,
    profileLabel: profile.label,
    profileShortLabel: profile.shortLabel,
    profileEffort: profile.effortLabel,
    profileHint: profile.riskHint,
    activeStep,
    openItems,
    feasibility: estimateDeliveryFeasibility(project, request),
  };
}
