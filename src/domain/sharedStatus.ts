import { estimateRemainingDailyCapacity, getProjectProfileWorkloadSummary } from "./profileWorkload";
import { getActiveCorrectionStep, summarizePreflight } from "./selectors";
import { getRiskVisual, getStatusVisual } from "./statusVisuals";
import type { Project } from "./types";

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

export type SharedStatusTone = "positive" | "balanced" | "warning" | "critical";

export interface SharedStatusReport {
  tone: SharedStatusTone;
  headline: string;
  summary: string;
  nextSteps: string[];
  deliveryRequest: DeliveryRequest;
}

const defaultDeliveryRequest: DeliveryRequest = {
  requestedPages: 120,
  availableWorkdays: 3,
};

const projectStatusReports: Record<string, SharedStatusReport> = {
  "kunst-des-satzes": {
    tone: "warning",
    headline: "Der Termin bleibt erreichbar, wenn Kapitel 4 jetzt geklärt wird.",
    summary:
      "Der Satzstand ist belastbar und die Hauptstrecke ist weit fortgeschritten. Kritisch sind nur die bildgeführten Seiten: Bildplatzierung, Marginalien und drei Hinweise in Kapitel 4 brauchen eine kurzfristige Entscheidung.",
    nextSteps: [
      "Bildlegenden und Marginalien in Kapitel 4 final bestätigen.",
      "Praxisbeispiele nachziehen und anschließend in die Schlusskorrektur geben.",
      "Preflight-Hinweise parallel prüfen, damit die Freigabe nicht blockiert.",
    ],
    deliveryRequest: { requestedPages: 95, availableWorkdays: 3 },
  },
  "digital-mindset": {
    tone: "critical",
    headline: "Ohne Autorenfeedback ist der Termin 10.07. nicht belastbar.",
    summary:
      "Der lineare Satz ist grundsätzlich gut planbar, aber die V2 hängt am ausstehenden Feedback. Neue Zusatzseiten oder größere Umstellungen sollten erst eingeplant werden, wenn die Rückmeldung vorliegt.",
    nextSteps: [
      "Autorenfeedback für Kapitel 2 verbindlich einholen.",
      "Nach Rückmeldung V2 abschließen und Final-PDF erzeugen.",
      "Zusatzumfang erst nach dem Feedback neu terminieren.",
    ],
    deliveryRequest: { requestedPages: 180, availableWorkdays: 3 },
  },
  "nachhaltig-handeln": {
    tone: "positive",
    headline: "Das Projekt läuft sauber und ist kurz vor der Druckfreigabe.",
    summary:
      "Der Umbruch ist weitgehend abgeschlossen, die Produktionskategorien sind kontrolliert und der Preflight zeigt nur noch einen kleinen Hinweis. Die Übergabe kann nach der letzten Alt-Text-Prüfung erfolgen.",
    nextSteps: [
      "Alt-Texte final prüfen.",
      "Freigabe-PDF erzeugen und an Herstellung geben.",
      "Druckfreigabe nach positiver Sichtprüfung erteilen.",
    ],
    deliveryRequest: { requestedPages: 42, availableWorkdays: 3 },
  },
  "storytelling-heute": {
    tone: "critical",
    headline: "Der aktuelle Umfang ist deutlich größer als geplant.",
    summary:
      "Das Projekt ist nicht grundsätzlich gefährdet, aber der Satzmix hat sich in Richtung komplexer Seiten verschoben. Ein großer Zusatzumfang in wenigen Tagen wäre fachlich unseriös und würde Korrekturqualität und Preflight-Ruhe kosten.",
    nextSteps: [
      "Komplexe Sonderseiten priorisieren und Umfang mit Redaktion fixieren.",
      "Bildstrecken und Textumflüsse vor weiterer Satzarbeit einfrieren.",
      "Zusatzseiten nur mit neuem Terminfenster übernehmen.",
    ],
    deliveryRequest: { requestedPages: 360, availableWorkdays: 3 },
  },
  "design-thinking": {
    tone: "positive",
    headline: "Das Projekt ist früh, sauber planbar und ohne akute Blocker.",
    summary:
      "Der Satzmix ist bereits vollständig geschätzt und die Struktur ist stabil. Sobald das Manuskript final freigegeben ist, kann der Satz mit realistischem Puffer starten.",
    nextSteps: [
      "Manuskriptfreigabe und Metadaten einsammeln.",
      "Satzstart nach finaler Kapitelstruktur bestätigen.",
      "Erste Probe zur Bild- und Marginalienlogik vorbereiten.",
    ],
    deliveryRequest: { requestedPages: 120, availableWorkdays: 5 },
  },
};

export function getSharedStatusPath(projectId: string): string {
  return `/status/${projectId}`;
}

export function estimateDeliveryFeasibility(project: Project, request: DeliveryRequest): DeliveryFeasibility {
  const dailyCapacity = estimateRemainingDailyCapacity(project);
  const capacityPages = dailyCapacity * request.availableWorkdays;
  const pressure = request.requestedPages / capacityPages;

  if (pressure > 1.15) {
    return {
      ...request,
      capacityPages,
      level: "not-realistic",
      message: `${request.requestedPages} Seiten in ${request.availableWorkdays} Arbeitstagen sind mit dem aktuellen Satzmix nicht seriös machbar.`,
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

function buildFallbackReport(project: Project): SharedStatusReport {
  return {
    tone: project.risk === "hoch" ? "critical" : project.risk === "mittel" ? "warning" : "balanced",
    headline: `${project.title} ist im aktuellen Status nachvollziehbar geplant.`,
    summary:
      "Diese Statusansicht fasst Fortschritt, Satzmix und offene Punkte zusammen. Die Machbarkeit wird auf Basis des aktuell erfassten Produktionsumfangs bewertet.",
    nextSteps: [
      "Aktuelle Korrektur- und Preflight-Punkte prüfen.",
      "Offenen Satzumfang mit dem Terminfenster abgleichen.",
      "Nächste Freigabeentscheidung dokumentieren.",
    ],
    deliveryRequest: defaultDeliveryRequest,
  };
}

function getProjectStatusReport(project: Project): SharedStatusReport {
  return projectStatusReports[project.id] ?? buildFallbackReport(project);
}

export function buildSharedStatus(project: Project, request?: DeliveryRequest) {
  const workload = getProjectProfileWorkloadSummary(project);
  const profile = workload.dominantProfile.profile;
  const activeStep = getActiveCorrectionStep(project);
  const preflight = summarizePreflight(project.preflight);
  const status = getStatusVisual(project.status);
  const risk = getRiskVisual(project.risk);
  const report = getProjectStatusReport(project);
  const deliveryRequest = request ?? report.deliveryRequest;
  const openItems = [
    project.blocker,
    workload.overPlanPages > 0 ? `${workload.overPlanPages} Satzseiten über der Verlagsschätzung` : undefined,
    activeStep ? `${activeStep.label}: ${activeStep.note}` : undefined,
    preflight.warning > 0 ? `${preflight.warning} Preflight-Hinweis(e) offen` : undefined,
    preflight.failed > 0 ? `${preflight.failed} Preflight-Blocker offen` : undefined,
  ].filter((item): item is string => Boolean(item));

  return {
    projectId: project.id,
    sharePath: getSharedStatusPath(project.id),
    title: project.title,
    publisher: project.publisher,
    isbn: project.isbn,
    titleNumber: project.titleNumber,
    statusLabel: status.label,
    riskLabel: risk.label,
    phase: project.phase,
    progress: project.progress,
    pages: project.pages,
    remainingPages: workload.remainingPages,
    deadlineLabel: project.deadlineLabel,
    profileLabel: profile.label,
    profileShortLabel: profile.shortLabel,
    profileEffort: profile.effortLabel,
    profileHint: profile.riskHint,
    workload,
    activeStep,
    openItems,
    report,
    feasibility: estimateDeliveryFeasibility(project, deliveryRequest),
  };
}
