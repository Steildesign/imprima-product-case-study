export interface TaskItem {
  id: string;
  title: string;
  project: string;
  owner: string;
  due: string;
  status: "Heute" | "Morgen" | "Diese Woche";
  priority: "hoch" | "mittel" | "niedrig";
}

export interface FileAsset {
  id: string;
  name: string;
  project: string;
  type: string;
  version: string;
  updated: string;
  status: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  weekday: string;
  title: string;
  project: string;
  type: string;
}

export interface ReportHighlight {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: "green" | "blue" | "orange";
}

export interface CommunicationThread {
  id: string;
  title: string;
  project: string;
  from: string;
  time: string;
  status: "Offen" | "Wartet" | "Erledigt";
  preview: string;
}

export const taskItems: TaskItem[] = [
  {
    id: "task-kds-captions",
    title: "Bildlegenden in Kapitel 4 klären",
    project: "Die Kunst des Satzes",
    owner: "S. Klein",
    due: "Heute, 15:00",
    status: "Heute",
    priority: "hoch",
  },
  {
    id: "task-dm-feedback",
    title: "Autorenfeedback V2 nachfassen",
    project: "Digital Mindset",
    owner: "S. Reuter",
    due: "Heute, 17:30",
    status: "Heute",
    priority: "hoch",
  },
  {
    id: "task-nh-alt",
    title: "Alt-Texte für Preflight prüfen",
    project: "Nachhaltig handeln",
    owner: "M. Schneider",
    due: "Morgen, 10:00",
    status: "Morgen",
    priority: "mittel",
  },
  {
    id: "task-sh-layout",
    title: "Layoutfenster für Kapitel 1 bestätigen",
    project: "Storytelling heute",
    owner: "J. Wegner",
    due: "Diese Woche",
    status: "Diese Woche",
    priority: "niedrig",
  },
];

export const fileAssets: FileAsset[] = [
  {
    id: "file-kds-indd",
    name: "kunst-des-satzes_v2.indd",
    project: "Die Kunst des Satzes",
    type: "InDesign",
    version: "V2",
    updated: "15.07., 09:42",
    status: "Im Satz",
  },
  {
    id: "file-kds-pdf",
    name: "kunst-des-satzes_kapitel-4_markup.pdf",
    project: "Die Kunst des Satzes",
    type: "PDF-Markup",
    version: "Autorenkorrektur",
    updated: "15.07., 11:18",
    status: "In Korrektur",
  },
  {
    id: "file-nh-final",
    name: "nachhaltig-handeln_preflight.pdf",
    project: "Nachhaltig handeln",
    type: "Druck-PDF",
    version: "Final-Kandidat",
    updated: "16.07., 08:35",
    status: "Preflight",
  },
  {
    id: "file-dt-manuscript",
    name: "design-thinking_manuskript.docx",
    project: "Design Thinking im Unterricht",
    type: "Manuskript",
    version: "Eingang",
    updated: "14.07., 16:05",
    status: "Offen",
  },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: "event-dm-deadline",
    date: "10.07.",
    weekday: "Fr",
    title: "Drucktermin Digital Mindset",
    project: "Digital Mindset",
    type: "Deadline",
  },
  {
    id: "event-kds-correction",
    date: "15.07.",
    weekday: "Mi",
    title: "Autorenkorrektur Kapitel 4",
    project: "Die Kunst des Satzes",
    type: "Korrektur",
  },
  {
    id: "event-kds-preflight",
    date: "22.07.",
    weekday: "Mi",
    title: "Preflight vorbereiten",
    project: "Die Kunst des Satzes",
    type: "Freigabe",
  },
  {
    id: "event-nh-final",
    date: "27.07.",
    weekday: "Mo",
    title: "Druckfreigabe Nachhaltig handeln",
    project: "Nachhaltig handeln",
    type: "Freigabe",
  },
];

export const reportHighlights: ReportHighlight[] = [
  {
    id: "report-progress",
    label: "Aktive Titel",
    value: "5",
    detail: "3 Titel brauchen diese Woche Aufmerksamkeit.",
    tone: "blue",
  },
  {
    id: "report-risk",
    label: "Kritische Risiken",
    value: "1",
    detail: "Digital Mindset ist über Terminpuffer.",
    tone: "orange",
  },
  {
    id: "report-release",
    label: "Freigabereife",
    value: "2",
    detail: "Zwei Titel liegen im Preflight- oder Finalfenster.",
    tone: "green",
  },
];

export const communicationThreads: CommunicationThread[] = [
  {
    id: "thread-kds-captions",
    title: "Bildlegenden Kapitel 4",
    project: "Die Kunst des Satzes",
    from: "S. Klein",
    time: "Heute, 11:18",
    status: "Offen",
    preview: "Bitte prüfen, ob die Abbildungen 4.2 und 4.3 getauscht wurden.",
  },
  {
    id: "thread-dm-v2",
    title: "V2-Rückmeldung ausstehend",
    project: "Digital Mindset",
    from: "S. Reuter",
    time: "Gestern, 16:40",
    status: "Wartet",
    preview: "Autorenseite hat die Korrektur noch nicht final bestätigt.",
  },
  {
    id: "thread-nh-alt",
    title: "Alt-Texte für WCAG-Check",
    project: "Nachhaltig handeln",
    from: "M. Schneider",
    time: "Mo, 09:12",
    status: "Erledigt",
    preview: "Alt-Texte sind ergänzt, Preflight kann erneut laufen.",
  },
];
