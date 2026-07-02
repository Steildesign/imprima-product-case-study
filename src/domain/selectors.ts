import type {
  CorrectionStep,
  PreflightCheck,
  PreflightSummary,
  Project,
  ProjectFilters,
  RiskLevel,
} from "./types";

export function getProjectById(projects: Project[], id: string): Project {
  const project = projects.find((candidate) => candidate.id === id);
  if (!project) {
    throw new Error(`Project not found: ${id}`);
  }
  return project;
}

export function getVisibleProjects(projects: Project[], filters: ProjectFilters): Project[] {
  const query = filters.query.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesQuery =
      query.length === 0 ||
      project.title.toLowerCase().includes(query) ||
      project.publisher.toLowerCase().includes(query) ||
      project.isbn.toLowerCase().includes(query);
    const matchesRisk = filters.risk === "alle" || project.risk === filters.risk;
    const matchesStatus = filters.status === "alle" || project.status === filters.status;

    return matchesQuery && matchesRisk && matchesStatus;
  });
}

export function getProjectRiskCounts(projects: Project[]): Record<RiskLevel, number> {
  return projects.reduce<Record<RiskLevel, number>>(
    (counts, project) => {
      counts[project.risk] += 1;
      return counts;
    },
    { hoch: 0, mittel: 0, niedrig: 0 },
  );
}

export function getActiveCorrectionStep(project: Project): CorrectionStep | undefined {
  return project.correctionSteps.find((step) => step.state === "active");
}

export function summarizePreflight(checks: PreflightCheck[]): PreflightSummary {
  return checks.reduce<PreflightSummary>(
    (summary, check) => {
      summary[check.state] += 1;
      summary.total += 1;
      return summary;
    },
    { passed: 0, warning: 0, failed: 0, total: 0 },
  );
}
