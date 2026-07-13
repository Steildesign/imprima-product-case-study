import type { CommunicationDecisionEntry } from "./communicationAssist";
import type { Project } from "./types";

export type ReportCardTone = "green" | "blue" | "orange";

export interface RunningReportCard {
  id: "running-projects" | "report-attention" | "inquiry-backlog";
  label: string;
  value: string;
  detail: string;
  tone: ReportCardTone;
}

export interface RunningProjectReportRow {
  project: Project;
  openInquiryCount: number;
  stalledInquiryCount: number;
  reportFocus: string;
}

export interface RunningReportModel {
  runningProjects: Project[];
  highlightCards: RunningReportCard[];
  projectRows: RunningProjectReportRow[];
  inquiryBacklog: CommunicationDecisionEntry[];
}

const RELEASE_STATUSES = new Set<Project["status"]>(["preflight", "final", "freigegeben"]);

function isOpenInquiry(entry: CommunicationDecisionEntry) {
  return entry.status === "offen" || entry.status === "wartet";
}

function isRunningProject(project: Project) {
  return project.status !== "freigegeben";
}

function getReportAttention(project: Project, entries: CommunicationDecisionEntry[]) {
  if (project.risk === "hoch") {
    return "Termin- und Risikoentwicklung im Bericht klar ausweisen.";
  }

  const stalledCount = entries.filter((entry) => isOpenInquiry(entry) && (entry.ageInDays ?? 0) >= 3).length;
  if (stalledCount > 0) {
    return `${stalledCount} Nachfrage${stalledCount === 1 ? "" : "n"} über 3 Tage separat klären.`;
  }

  const openCount = entries.filter(isOpenInquiry).length;
  if (openCount > 0) {
    return `${openCount} offene Klärung${openCount === 1 ? "" : "en"} beobachten, noch kein Stau.`;
  }

  if (RELEASE_STATUSES.has(project.status)) {
    return "Freigabe- oder Preflight-Stand kompakt bestätigen.";
  }

  return "Produktionsstand normal fortschreiben.";
}

export function getRunningReportModel(
  projects: Project[],
  entries: CommunicationDecisionEntry[],
  staleThresholdDays = 3,
): RunningReportModel {
  const runningProjects = projects.filter(isRunningProject);
  const runningProjectIds = new Set(runningProjects.map((project) => project.id));
  const runningEntries = entries.filter((entry) => runningProjectIds.has(entry.projectId));
  const inquiryBacklog = runningEntries
    .filter((entry) => isOpenInquiry(entry) && (entry.ageInDays ?? 0) >= staleThresholdDays)
    .sort((a, b) => (b.ageInDays ?? 0) - (a.ageInDays ?? 0));
  const attentionCount = runningProjects.filter((project) => project.risk === "hoch" || project.blocker).length;
  const releaseCount = runningProjects.filter((project) => RELEASE_STATUSES.has(project.status)).length;
  const projectRows = runningProjects.map((project) => {
    const projectEntries = runningEntries.filter((entry) => entry.projectId === project.id);
    const openInquiryCount = projectEntries.filter(isOpenInquiry).length;
    const stalledInquiryCount = projectEntries.filter(
      (entry) => isOpenInquiry(entry) && (entry.ageInDays ?? 0) >= staleThresholdDays,
    ).length;

    return {
      project,
      openInquiryCount,
      stalledInquiryCount,
      reportFocus: getReportAttention(project, projectEntries),
    };
  });

  return {
    runningProjects,
    highlightCards: [
      {
        id: "running-projects",
        label: "Laufende Projekte",
        value: runningProjects.length.toString(),
        detail: `${releaseCount} Titel im Preflight- oder Freigabefenster.`,
        tone: "blue",
      },
      {
        id: "report-attention",
        label: "Berichtsfokus",
        value: attentionCount.toString(),
        detail:
          attentionCount === 0
            ? "Keine akuten Risiken in den laufenden Titeln."
            : `${attentionCount} Titel brauchen klare Lageformulierung.`,
        tone: attentionCount > 0 ? "orange" : "green",
      },
      {
        id: "inquiry-backlog",
        label: "Nachfrage-Stau",
        value: inquiryBacklog.length.toString(),
        detail:
          inquiryBacklog.length === 0
            ? "Keine offene Nachfrage über 3 Tage."
            : `${inquiryBacklog.length} Anfrage${inquiryBacklog.length === 1 ? "" : "n"} separat priorisieren.`,
        tone: inquiryBacklog.length > 0 ? "orange" : "green",
      },
    ],
    projectRows,
    inquiryBacklog,
  };
}
