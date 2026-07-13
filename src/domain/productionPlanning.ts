import type { Project } from "./types";

export type PlanningPhaseKind = "manuskript" | "satz" | "korrektur" | "preflight" | "freigabe" | "pause";
export type PlanningCapacityLevel = "ruhig" | "normal" | "eng" | "kritisch";

export interface PlanningMonth {
  id: string;
  label: string;
  year: string;
}

export interface PlanningWeek {
  id: string;
  label: string;
  rangeLabel: string;
  startDate: string;
  endDate: string;
  monthLabel: string;
}

export interface ProjectPlanningMeta {
  projectId: string;
  code: string;
  color: string;
  accent: string;
}

export interface ProductionPlanningPhase {
  projectId: string;
  id: string;
  label: string;
  kind: PlanningPhaseKind;
  start: number;
  end: number;
  startDate: string;
  endDate: string;
  load: PlanningCapacityLevel;
}

export interface CapacityWindow {
  id: string;
  label: string;
  month: number;
  load: number;
  level: PlanningCapacityLevel;
  note: string;
}

export interface VacationWindow {
  id: string;
  owner: string;
  label: string;
  start: number;
  end: number;
  quality: "gut" | "moeglich" | "nicht-empfohlen";
  note: string;
}

export interface PlanningInsight {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: "green" | "blue" | "orange";
}

export interface CapacityMotionState {
  levelClass: "is-calm" | "is-steady" | "is-watch" | "is-pressure";
  meterScale: number;
  pulse: boolean;
  delayMs: number;
}

export interface PhaseMotionState {
  delayMs: number;
  loadClass: "is-calm" | "is-steady" | "is-watch" | "is-pressure";
}

export interface PlanningDateWindow {
  startDate: string;
  endDate: string;
}

export interface PlanningTimelinePlacement {
  leftPercent: number;
  widthPercent: number;
}

export const planningMonths: PlanningMonth[] = [
  { id: "2026-07", label: "Jul", year: "2026" },
  { id: "2026-08", label: "Aug", year: "2026" },
  { id: "2026-09", label: "Sep", year: "2026" },
  { id: "2026-10", label: "Okt", year: "2026" },
  { id: "2026-11", label: "Nov", year: "2026" },
  { id: "2026-12", label: "Dez", year: "2026" },
  { id: "2027-01", label: "Jan", year: "2027" },
  { id: "2027-02", label: "Feb", year: "2027" },
  { id: "2027-03", label: "Mär", year: "2027" },
  { id: "2027-04", label: "Apr", year: "2027" },
];

const oneDayMs = 24 * 60 * 60 * 1000;
export const planningStartDate = "2026-07-06";
export const planningWeekCount = 43;

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(value: string, days: number) {
  const date = parseDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
}

function getCalendarWeek(value: string) {
  const date = parseDate(value);
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

  return Math.ceil((((date.getTime() - yearStart.getTime()) / oneDayMs) + 1) / 7);
}

function formatDayMonth(value: string) {
  const [year, month, day] = value.split("-");
  void year;
  return `${day}.${month}.`;
}

function createPlanningWeeks(): PlanningWeek[] {
  return Array.from({ length: planningWeekCount }, (_, index) => {
    const startDate = addDays(planningStartDate, index * 7);
    const endDate = addDays(startDate, 6);
    const month = planningMonths.find((item) => item.id === startDate.slice(0, 7));

    return {
      id: startDate,
      label: `KW ${getCalendarWeek(startDate)}`,
      rangeLabel: `${formatDayMonth(startDate)}-${formatDayMonth(endDate)}`,
      startDate,
      endDate,
      monthLabel: month ? `${month.label} ${month.year}` : startDate.slice(0, 7),
    };
  });
}

export const planningWeeks = createPlanningWeeks();

export const projectPlanningMeta: ProjectPlanningMeta[] = [
  { projectId: "kunst-des-satzes", code: "KDS", color: "#079d38", accent: "#eaf8ee" },
  { projectId: "digital-mindset", code: "DM", color: "#2f8ded", accent: "#edf5ff" },
  { projectId: "nachhaltig-handeln", code: "NH", color: "#4fcf97", accent: "#ecfbf4" },
  { projectId: "storytelling-heute", code: "SH", color: "#f0ad1d", accent: "#fff5dc" },
  { projectId: "design-thinking", code: "DT", color: "#8f62db", accent: "#f5efff" },
];

export const productionPlanningPhases: ProductionPlanningPhase[] = [
  {
    projectId: "kunst-des-satzes",
    id: "kds-autorenkorrektur",
    label: "Autorenkorrektur & Bildabstimmung",
    kind: "korrektur",
    start: 1,
    end: 1,
    startDate: "2026-07-08",
    endDate: "2026-07-24",
    load: "eng",
  },
  {
    projectId: "kunst-des-satzes",
    id: "kds-freigabe",
    label: "Schlusskorrektur, Preflight, Freigabe",
    kind: "freigabe",
    start: 1,
    end: 2,
    startDate: "2026-07-27",
    endDate: "2026-08-07",
    load: "eng",
  },
  {
    projectId: "digital-mindset",
    id: "dm-v2",
    label: "V2 blockiert, Final-PDF offen",
    kind: "korrektur",
    start: 1,
    end: 1,
    startDate: "2026-07-13",
    endDate: "2026-07-31",
    load: "kritisch",
  },
  {
    projectId: "nachhaltig-handeln",
    id: "nh-preflight",
    label: "Preflight & Druckfreigabe",
    kind: "preflight",
    start: 1,
    end: 2,
    startDate: "2026-07-20",
    endDate: "2026-08-14",
    load: "normal",
  },
  {
    projectId: "storytelling-heute",
    id: "sh-satz",
    label: "Satz komplexe Bildstrecken",
    kind: "satz",
    start: 1,
    end: 3,
    startDate: "2026-07-06",
    endDate: "2026-09-18",
    load: "kritisch",
  },
  {
    projectId: "storytelling-heute",
    id: "sh-korrektur",
    label: "V1/V2 Korrekturrunden",
    kind: "korrektur",
    start: 3,
    end: 4,
    startDate: "2026-09-21",
    endDate: "2026-10-16",
    load: "eng",
  },
  {
    projectId: "storytelling-heute",
    id: "sh-preflight",
    label: "Preflight & Freigabe",
    kind: "preflight",
    start: 5,
    end: 5,
    startDate: "2026-11-02",
    endDate: "2026-11-13",
    load: "normal",
  },
  {
    projectId: "design-thinking",
    id: "dt-manuskript",
    label: "Manuskript & Strukturfreigabe",
    kind: "manuskript",
    start: 2,
    end: 3,
    startDate: "2026-08-10",
    endDate: "2026-09-11",
    load: "normal",
  },
  {
    projectId: "design-thinking",
    id: "dt-satz",
    label: "Satz, Bildlogik, Marginalien",
    kind: "satz",
    start: 4,
    end: 5,
    startDate: "2026-10-05",
    endDate: "2026-11-20",
    load: "normal",
  },
  {
    projectId: "design-thinking",
    id: "dt-korrektur",
    label: "Korrekturfenster Redaktion",
    kind: "korrektur",
    start: 6,
    end: 7,
    startDate: "2026-12-14",
    endDate: "2027-01-22",
    load: "eng",
  },
  {
    projectId: "design-thinking",
    id: "dt-preflight",
    label: "Preflight & Druckfreigabe",
    kind: "preflight",
    start: 8,
    end: 9,
    startDate: "2027-02-08",
    endDate: "2027-03-12",
    load: "ruhig",
  },
];

export const capacityWindows: CapacityWindow[] = [
  { id: "cap-jul", label: "Juli", month: 1, load: 94, level: "kritisch", note: "KDS, Digital Mindset und SH starten parallel." },
  { id: "cap-aug", label: "August", month: 2, load: 62, level: "normal", note: "Kurzes Fenster nach KDS-Freigabe." },
  { id: "cap-sep", label: "September", month: 3, load: 78, level: "eng", note: "Storytelling Korrektur bindet viel Abstimmung." },
  { id: "cap-okt", label: "Oktober", month: 4, load: 86, level: "eng", note: "DT Satz und SH-Korrektur überschneiden sich." },
  { id: "cap-nov", label: "November", month: 5, load: 68, level: "normal", note: "Planbares Satzfenster mit Reserve." },
  { id: "cap-dez", label: "Dezember", month: 6, load: 52, level: "ruhig", note: "Gutes Ruhefenster vor DT-Korrektur." },
  { id: "cap-jan", label: "Januar", month: 7, load: 73, level: "normal", note: "DT-Korrektur läuft, aber ohne Zusatzspitzen." },
  { id: "cap-feb", label: "Februar", month: 8, load: 46, level: "ruhig", note: "Preflightlast ist gut planbar." },
];

export const vacationWindows: VacationWindow[] = [
  {
    id: "vac-aug",
    owner: "M. Schneider",
    label: "05.08.-11.08.",
    start: 2,
    end: 2,
    quality: "gut",
    note: "Nach KDS-Freigabe und vor DT-Strukturphase.",
  },
  {
    id: "vac-dec",
    owner: "J. Wegner",
    label: "14.12.-18.12.",
    start: 6,
    end: 6,
    quality: "gut",
    note: "Niedrige Last vor DT-Korrektur im Januar.",
  },
  {
    id: "vac-oct",
    owner: "S. Reuter",
    label: "12.10.-16.10.",
    start: 4,
    end: 4,
    quality: "moeglich",
    note: "Nur möglich, wenn SH-Korrektur bis Monatsmitte stabil ist.",
  },
  {
    id: "vac-jul",
    owner: "Team Satz",
    label: "15.07.-24.07.",
    start: 1,
    end: 1,
    quality: "nicht-empfohlen",
    note: "Kritisch wegen Digital Mindset, KDS und Storytelling-Start.",
  },
];

export const planningInsights: PlanningInsight[] = [
  {
    id: "planning-horizon",
    label: "Planungshorizont",
    value: "10 Monate",
    detail: "Juli 2026 bis April 2027 inklusive Langläufer.",
    tone: "blue",
  },
  {
    id: "planning-vacation",
    label: "Urlaubsfenster",
    value: "2 gute",
    detail: "August und Dezember sind aktuell am saubersten.",
    tone: "green",
  },
  {
    id: "planning-load",
    label: "Kritische Last",
    value: "Juli",
    detail: "Drei Produktionsstränge liegen parallel.",
    tone: "orange",
  },
];

export function getProjectPlanningMeta(projectId: string): ProjectPlanningMeta {
  return (
    projectPlanningMeta.find((item) => item.projectId === projectId) ?? {
      projectId,
      code: projectId.slice(0, 3).toUpperCase(),
      color: "#0d172a",
      accent: "#f3f4f7",
    }
  );
}

export function getProjectPlanningPhases(projectId: string) {
  return productionPlanningPhases.filter((phase) => phase.projectId === projectId);
}

export function getProjectPlanningWindow(projectId: string) {
  const phases = getProjectPlanningPhases(projectId);

  if (phases.length === 0) {
    return undefined;
  }

  const start = Math.min(...phases.map((phase) => phase.start));
  const end = Math.max(...phases.map((phase) => phase.end));
  const startMonth = planningMonths[start - 1];
  const endMonth = planningMonths[end - 1];

  return {
    start,
    end,
    label: startMonth && endMonth ? `${startMonth.label} ${startMonth.year}-${endMonth.label} ${endMonth.year}` : "Noch offen",
    shortLabel: startMonth && endMonth ? `${startMonth.label}-${endMonth.label}` : "Offen",
  };
}

export function getPlanningDateWindow(phase: ProductionPlanningPhase): PlanningDateWindow {
  return {
    startDate: phase.startDate,
    endDate: phase.endDate,
  };
}

export function getPhaseDateRangeLabel(window: PlanningDateWindow) {
  return `${formatDayMonth(window.startDate)}-${formatDayMonth(window.endDate)}`;
}

export function getPlanningTimelinePlacement(window: PlanningDateWindow): PlanningTimelinePlacement {
  const timelineStart = parseDate(planningStartDate).getTime();
  const timelineEnd = parseDate(addDays(planningStartDate, planningWeekCount * 7)).getTime();
  const totalDays = Math.max(1, (timelineEnd - timelineStart) / oneDayMs);
  const startOffset = Math.max(0, (parseDate(window.startDate).getTime() - timelineStart) / oneDayMs);
  const endOffset = Math.min(totalDays, (parseDate(window.endDate).getTime() - timelineStart) / oneDayMs + 1);

  return {
    leftPercent: Number(((startOffset / totalDays) * 100).toFixed(3)),
    widthPercent: Number(((Math.max(1, endOffset - startOffset) / totalDays) * 100).toFixed(3)),
  };
}

export function getVisiblePlanningPhases(projects: Project[]) {
  const visibleIds = new Set(projects.map((project) => project.id));

  return productionPlanningPhases.filter((phase) => visibleIds.has(phase.projectId));
}

export function getCapacityMotionState(window: CapacityWindow, index = 0): CapacityMotionState {
  const levelClassByLoad: Record<PlanningCapacityLevel, CapacityMotionState["levelClass"]> = {
    ruhig: "is-calm",
    normal: "is-steady",
    eng: "is-watch",
    kritisch: "is-pressure",
  };

  return {
    levelClass: levelClassByLoad[window.level],
    meterScale: Number((window.load / 100).toFixed(2)),
    pulse: window.level === "eng" || window.level === "kritisch",
    delayMs: index * 85,
  };
}

export function getPhaseMotionState(phase: ProductionPlanningPhase, index = 0): PhaseMotionState {
  const loadClassByLevel: Record<PlanningCapacityLevel, PhaseMotionState["loadClass"]> = {
    ruhig: "is-calm",
    normal: "is-steady",
    eng: "is-watch",
    kritisch: "is-pressure",
  };

  return {
    delayMs: index * 90,
    loadClass: loadClassByLevel[phase.load],
  };
}
