import type { TaskItem } from "./moduleData";
import type { CorrectionStep, PreflightCheck, Project } from "./types";

export type ChartTone = "green" | "blue" | "orange" | "red" | "gray";

export interface ChartSegment {
  id: string;
  label: string;
  value: number;
  percent: number;
  tone: ChartTone;
}

export interface DonutChartData {
  title: string;
  total: number;
  primaryValue: string;
  statusLabel: string;
  segments: ChartSegment[];
}

export interface TaskChartData {
  pressure: DonutChartData;
  status: DonutChartData;
}

export interface ProjectReadinessChartData {
  readiness: DonutChartData;
  risk: DonutChartData;
}

function getPercent(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}

function createSegments<T extends string>(
  order: Array<{ id: T; label: string; tone: ChartTone }>,
  counts: Record<T, number>,
  total: number,
): ChartSegment[] {
  return order.map((item) => ({
    ...item,
    value: counts[item.id],
    percent: getPercent(counts[item.id], total),
  }));
}

export function getCorrectionChartData(steps: CorrectionStep[]): DonutChartData {
  const total = steps.length;
  const counts = steps.reduce<Record<CorrectionStep["state"], number>>(
    (result, step) => {
      result[step.state] += 1;
      return result;
    },
    { done: 0, active: 0, planned: 0 },
  );
  const weightedProgress = total === 0 ? 0 : Math.round(((counts.done + counts.active * 0.6) / total) * 100);

  return {
    title: "Korrekturfluss",
    total,
    primaryValue: `${weightedProgress}%`,
    statusLabel: counts.active > 0 ? "Aktiv" : counts.planned > 0 ? "Geplant" : "Abgeschlossen",
    segments: createSegments(
      [
        { id: "done", label: "Erledigt", tone: "green" },
        { id: "active", label: "Aktiv", tone: "blue" },
        { id: "planned", label: "Geplant", tone: "gray" },
      ],
      counts,
      total,
    ),
  };
}

export function getPreflightChartData(checks: PreflightCheck[]): DonutChartData {
  const total = checks.length;
  const counts = checks.reduce<Record<PreflightCheck["state"], number>>(
    (result, check) => {
      result[check.state] += 1;
      return result;
    },
    { passed: 0, warning: 0, failed: 0 },
  );

  return {
    title: "Preflight-Qualität",
    total,
    primaryValue: `${getPercent(counts.passed, total)}%`,
    statusLabel: counts.failed > 0 ? "Fehler offen" : counts.warning > 0 ? "Hinweise offen" : "Freigabereif",
    segments: createSegments(
      [
        { id: "passed", label: "Erfüllt", tone: "green" },
        { id: "warning", label: "Hinweis", tone: "orange" },
        { id: "failed", label: "Fehler", tone: "red" },
      ],
      counts,
      total,
    ),
  };
}

export function getTaskChartData(tasks: TaskItem[]): TaskChartData {
  const total = tasks.length;
  const priorityCounts = tasks.reduce<Record<TaskItem["priority"], number>>(
    (result, task) => {
      result[task.priority] += 1;
      return result;
    },
    { hoch: 0, mittel: 0, niedrig: 0 },
  );
  const statusCounts = tasks.reduce<Record<TaskItem["detailStatus"], number>>(
    (result, task) => {
      result[task.detailStatus] += 1;
      return result;
    },
    { offen: 0, wartet: 0, "in-arbeit": 0, erledigt: 0 },
  );

  return {
    pressure: {
      title: "Aufgabendruck",
      total,
      primaryValue: `${getPercent(priorityCounts.hoch, total)}%`,
      statusLabel: `${priorityCounts.hoch} hoch priorisiert`,
      segments: createSegments(
        [
          { id: "hoch", label: "Hoch", tone: "red" },
          { id: "mittel", label: "Mittel", tone: "orange" },
          { id: "niedrig", label: "Niedrig", tone: "green" },
        ],
        priorityCounts,
        total,
      ),
    },
    status: {
      title: "Bearbeitungsstand",
      total,
      primaryValue: `${getPercent(statusCounts.erledigt, total)}%`,
      statusLabel: `${statusCounts["in-arbeit"]} aktiv · ${statusCounts.wartet} wartet`,
      segments: createSegments(
        [
          { id: "offen", label: "Offen", tone: "orange" },
          { id: "wartet", label: "Wartet", tone: "red" },
          { id: "in-arbeit", label: "In Arbeit", tone: "blue" },
          { id: "erledigt", label: "Erledigt", tone: "green" },
        ],
        statusCounts,
        total,
      ),
    },
  };
}

export function getProjectReadinessChartData(projects: Project[]): ProjectReadinessChartData {
  const total = projects.length;
  const readyCount = projects.filter((project) =>
    ["preflight", "final", "freigegeben"].includes(project.status),
  ).length;
  const riskCounts = projects.reduce<Record<Project["risk"], number>>(
    (result, project) => {
      result[project.risk] += 1;
      return result;
    },
    { niedrig: 0, mittel: 0, hoch: 0 },
  );
  const riskPressure = riskCounts.hoch * 2 + riskCounts.mittel;
  const maxRiskPressure = total * 2;

  return {
    readiness: {
      title: "Freigabe",
      total,
      primaryValue: `${getPercent(readyCount, total)}%`,
      statusLabel: `${readyCount} von ${total} Titeln nahe Freigabe`,
      segments: [
        { id: "ready", label: "Nahe Freigabe", value: readyCount, percent: getPercent(readyCount, total), tone: "green" },
        {
          id: "active",
          label: "In Produktion",
          value: total - readyCount,
          percent: getPercent(total - readyCount, total),
          tone: "blue",
        },
      ],
    },
    risk: {
      title: "Risikobild",
      total,
      primaryValue: `${getPercent(riskPressure, maxRiskPressure)}%`,
      statusLabel: `${riskCounts.hoch} hoch · ${riskCounts.mittel} mittel`,
      segments: createSegments(
        [
          { id: "niedrig", label: "Niedrig", tone: "green" },
          { id: "mittel", label: "Mittel", tone: "orange" },
          { id: "hoch", label: "Hoch", tone: "red" },
        ],
        riskCounts,
        total,
      ),
    },
  };
}
