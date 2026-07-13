import type { Project } from "./types";

export type AssistPromptId = "open-clarifications" | "reply-draft" | "deadline-check" | "status-summary";
export type CommunicationEntryKind = "entscheidung" | "klaerung" | "auftragsaenderung" | "freigabe" | "risiko";
export type CommunicationEntryStatus = "offen" | "wartet" | "geklaert" | "umgesetzt";
export type AssistAnswerTone = "neutral" | "attention" | "critical" | "positive";

export interface CommunicationDecisionEntry {
  id: string;
  projectId: string;
  kind: CommunicationEntryKind;
  subject: string;
  from: string;
  date: string;
  ageInDays?: number;
  status: CommunicationEntryStatus;
  decisionRelevant: true;
  summary: string;
  impact: string;
  nextStep: string;
  deadline?: string;
}

export interface AssistPrompt {
  id: AssistPromptId;
  label: string;
  helper: string;
}

export interface AssistAnswer {
  promptId: AssistPromptId;
  tone: AssistAnswerTone;
  summary: string;
  body: string;
  nextAction: string;
  relatedEntryIds: string[];
}

export const assistPrompts: AssistPrompt[] = [
  {
    id: "open-clarifications",
    label: "Welche Klärungen sind offen?",
    helper: "Zeigt entscheidende Mails und nächste Schritte.",
  },
  {
    id: "reply-draft",
    label: "Antwort an Redaktion entwerfen",
    helper: "Formuliert eine ruhige Rückmeldung aus Projektstand und Risiken.",
  },
  {
    id: "deadline-check",
    label: "Ist die Deadline realistisch?",
    helper: "Vergleicht Klärungen, Risiko und Produktionsstand.",
  },
  {
    id: "status-summary",
    label: "Status kurz zusammenfassen",
    helper: "Erstellt eine sendbare Projektzusammenfassung.",
  },
];

export const criticalCommunicationEntries: CommunicationDecisionEntry[] = [
  {
    id: "comm-kds-legenden",
    projectId: "kunst-des-satzes",
    kind: "klaerung",
    subject: "Bildlegenden und Abbildungsreihenfolge Kapitel 4",
    from: "S. Klein, Autor",
    date: "15.07., 11:18",
    ageInDays: 0,
    status: "offen",
    decisionRelevant: true,
    summary: "Bildlegenden 4.2 und 4.3 sind noch nicht final bestätigt.",
    impact: "Kapitel 4 kann erst nach Klärung sauber in die Schlusskorrektur.",
    nextStep: "Redaktion soll Legendenreihenfolge und finalen Wortlaut bestätigen.",
    deadline: "Heute, 15:00",
  },
  {
    id: "comm-kds-marginalien",
    projectId: "kunst-des-satzes",
    kind: "auftragsaenderung",
    subject: "Marginalien und Hybridverweise im Praxisteil",
    from: "L. Bauer, Korrektorat",
    date: "14.07., 16:05",
    ageInDays: 1,
    status: "wartet",
    decisionRelevant: true,
    summary: "Zwei Marginalien wurden nachträglich erweitert und beeinflussen den Satzmix.",
    impact: "Mehr bildintegrierte Seiten, weniger Puffer vor Preflight.",
    nextStep: "Umfangsänderung im Satzmix markieren und mit Verlag rückbestätigen.",
  },
  {
    id: "comm-dm-feedback",
    projectId: "digital-mindset",
    kind: "risiko",
    subject: "V2-Rückmeldung und Terminpuffer",
    from: "S. Reuter, Redaktion",
    date: "Gestern, 16:40",
    ageInDays: 4,
    status: "offen",
    decisionRelevant: true,
    summary: "Die Autorenseite hat die V2-Rückmeldung noch nicht final bestätigt.",
    impact: "Der Drucktermin bleibt erreichbar, wenn die Rückmeldung heute eingeht.",
    nextStep: "Sachlich auf fehlende Rückmeldung und knappen Terminpuffer hinweisen.",
    deadline: "Heute, 17:30",
  },
  {
    id: "comm-nh-alttexte",
    projectId: "nachhaltig-handeln",
    kind: "freigabe",
    subject: "Alt-Texte für Preflight abgeschlossen",
    from: "M. Schneider, Projektleitung",
    date: "Mo, 09:12",
    ageInDays: 4,
    status: "umgesetzt",
    decisionRelevant: true,
    summary: "Alt-Texte wurden ergänzt und der WCAG-Check kann erneut laufen.",
    impact: "Freigabefenster bleibt stabil, keine zusätzliche Eskalation nötig.",
    nextStep: "Preflight-Bericht aktualisieren und Freigabe vorbereiten.",
  },
  {
    id: "comm-sh-bildstrecke",
    projectId: "storytelling-heute",
    kind: "klaerung",
    subject: "Bildstrecke Kapitel 1 und komplexe Seiten",
    from: "J. Wegner, Satz",
    date: "Heute, 09:35",
    ageInDays: 0,
    status: "wartet",
    decisionRelevant: true,
    summary: "Die Bildstrecke in Kapitel 1 verschiebt mehrere Seiten in den komplexen Satzmix.",
    impact: "Der Aufwand steigt, bleibt mit früher Entscheidung aber steuerbar.",
    nextStep: "Layoutfenster und Bildpriorität bis zur V1 verbindlich bestätigen lassen.",
    deadline: "Diese Woche",
  },
  {
    id: "comm-dt-manuskript",
    projectId: "design-thinking",
    kind: "entscheidung",
    subject: "Manuskripteingang und Template-Freigabe",
    from: "Nova Books Herstellung",
    date: "14.07., 16:05",
    ageInDays: 1,
    status: "geklaert",
    decisionRelevant: true,
    summary: "Template ist bestätigt, Manuskriptprüfung startet mit festem Satzfenster.",
    impact: "Projekt kann ohne Ad-hoc-Call in die Vorbereitung gehen.",
    nextStep: "Dateien prüfen und offene Metadaten vor Satzbeginn einsammeln.",
  },
];

export function getProjectCommunicationEntries(projectId: string) {
  return criticalCommunicationEntries.filter((entry) => entry.projectId === projectId);
}

function getTone(project: Project, entries: CommunicationDecisionEntry[]): AssistAnswerTone {
  if (project.risk === "hoch" || entries.some((entry) => entry.kind === "risiko" && entry.status === "offen")) {
    return "critical";
  }

  if (entries.some((entry) => entry.status === "offen" || entry.status === "wartet")) {
    return "attention";
  }

  if (project.risk === "niedrig" && project.progress >= 80) {
    return "positive";
  }

  return "neutral";
}

function formatEntryList(entries: CommunicationDecisionEntry[]) {
  return entries.map((entry) => `${entry.subject}: ${entry.summary} Nächster Schritt: ${entry.nextStep}`).join("\n");
}

function getOpenEntries(entries: CommunicationDecisionEntry[]) {
  return entries.filter((entry) => entry.status === "offen" || entry.status === "wartet");
}

export function getAssistPromptAnswer(project: Project, promptId: AssistPromptId): AssistAnswer {
  const entries = getProjectCommunicationEntries(project.id);
  const openEntries = getOpenEntries(entries);
  const sourceEntries = openEntries.length > 0 ? openEntries : entries;
  const tone = getTone(project, entries);

  if (promptId === "open-clarifications") {
    return {
      promptId,
      tone: sourceEntries.length > 0 ? tone : "neutral",
      summary:
        sourceEntries.length > 0
          ? `${sourceEntries.at(0)?.subject}: ${sourceEntries.length} entscheidende Klärung${
              sourceEntries.length === 1 ? "" : "en"
            } für ${project.title}.`
          : `Für ${project.title} gibt es aktuell keine offenen Klärungen.`,
      body: sourceEntries.length > 0 ? formatEntryList(sourceEntries) : "Alle entscheidenden Kommunikationspunkte sind geklärt.",
      nextAction: sourceEntries.at(0)?.nextStep ?? "Status beobachten.",
      relatedEntryIds: sourceEntries.map((entry) => entry.id),
    };
  }

  if (promptId === "reply-draft") {
    const leadEntry = sourceEntries.at(0);

    return {
      promptId,
      tone,
      summary: "sachlich formulierter Antwortentwurf ohne unnötige Eskalation.",
      body: `Danke für die Rückmeldung zu ${project.title}. Der aktuelle Stand ist sachlich so einzuordnen: ${
        leadEntry?.summary ?? "die entscheidenden Punkte sind dokumentiert"
      } Bitte geben Sie uns die fehlende Rückmeldung zum Termin, damit wir den nächsten Produktionsschritt belastbar planen können.`,
      nextAction: leadEntry?.nextStep ?? "Antwortentwurf prüfen und senden.",
      relatedEntryIds: sourceEntries.map((entry) => entry.id),
    };
  }

  if (promptId === "deadline-check") {
    const isRisky = project.risk === "hoch" || sourceEntries.some((entry) => entry.kind === "risiko");

    return {
      promptId,
      tone: isRisky ? "critical" : tone,
      summary: isRisky ? "Deadline nur mit schneller Klärung belastbar." : "Deadline wirkt mit aktuellem Stand belastbar.",
      body: `${project.title} liegt bei ${project.progress}% Fortschritt. ${
        sourceEntries.length > 0
          ? `Entscheidend ist jetzt: ${sourceEntries.map((entry) => entry.nextStep).join(" ")}`
          : "Es gibt keine blockierende Kommunikation im Entscheidungslog."
      }`,
      nextAction: sourceEntries.at(0)?.nextStep ?? "Regelmäßig prüfen.",
      relatedEntryIds: sourceEntries.map((entry) => entry.id),
    };
  }

  return {
    promptId,
    tone,
    summary:
      tone === "positive"
        ? `${project.title} läuft stabil im Freigabefenster.`
        : `${project.title}: ${sourceEntries.length} relevante Kommunikationspunkte im Blick behalten.`,
    body:
      tone === "positive"
        ? `${project.title} steht bei ${project.progress}% und bleibt im Freigabefenster. ${formatEntryList(sourceEntries)}`
        : `${project.title} steht bei ${project.progress}%. ${formatEntryList(sourceEntries)}`,
    nextAction: sourceEntries.at(0)?.nextStep ?? "Keine Aktion nötig.",
    relatedEntryIds: sourceEntries.map((entry) => entry.id),
  };
}
