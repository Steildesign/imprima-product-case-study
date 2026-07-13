export interface TaskItem {
  id: string;
  title: string;
  projectId: string;
  project: string;
  owner: string;
  due: string;
  status: "Heute" | "Morgen" | "Diese Woche";
  priority: "hoch" | "mittel" | "niedrig";
  detailStatus: "offen" | "wartet" | "in-arbeit" | "erledigt";
  chapter: string;
  pageRange: string;
  productionPhase: string;
  reason: string;
  impact: string;
  nextStep: string;
  relatedCommunicationId: string;
  checkpoints: string[];
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

export type CalendarEventType = "Deadline" | "Korrektur" | "Preflight" | "Freigabe";
export type CalendarEventPriority = "kritisch" | "hoch" | "stabil";

export interface CalendarEvent {
  id: string;
  projectId: string;
  date: string;
  weekday: string;
  title: string;
  project: string;
  type: CalendarEventType;
  priority: CalendarEventPriority;
  impact: string;
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
    projectId: "kunst-des-satzes",
    project: "Die Kunst des Satzes",
    owner: "S. Klein",
    due: "Heute, 15:00",
    status: "Heute",
    priority: "hoch",
    detailStatus: "offen",
    chapter: "Kapitel 4 - Layout & Struktur",
    pageRange: "S. 98-104",
    productionPhase: "Autorenkorrektur vor Schlusskorrektur",
    reason: "Die Abbildungen 4.2 und 4.3 sind in der Korrektur markiert, aber die finale Legendenreihenfolge ist nicht bestätigt.",
    impact: "Ohne Klärung bleibt Kapitel 4 blockiert und die Schlusskorrektur kann nicht sauber starten.",
    nextStep: "Legendenreihenfolge und finalen Wortlaut durch S. Klein bestätigen lassen.",
    relatedCommunicationId: "comm-kds-legenden",
    checkpoints: [
      "Markup-PDF mit Kapitel 4 öffnen",
      "Legenden 4.2 und 4.3 gegen Autorenmail prüfen",
      "Änderung im Satzmix als bildintegrierte Korrektur markieren",
    ],
  },
  {
    id: "task-dm-feedback",
    title: "Autorenfeedback V2 nachfassen",
    projectId: "digital-mindset",
    project: "Digital Mindset",
    owner: "S. Reuter",
    due: "Heute, 17:30",
    status: "Heute",
    priority: "hoch",
    detailStatus: "wartet",
    chapter: "Kapitel 2 - Transformation im Team",
    pageRange: "S. 83-160",
    productionPhase: "V2-Korrektur mit knappem Terminpuffer",
    reason: "Die Autorenseite hat die V2-Rückmeldung noch nicht final bestätigt.",
    impact: "Der Drucktermin ist nur belastbar, wenn die fehlende Rückmeldung heute eingeht.",
    nextStep: "Sachliche Erinnerung an Redaktion und Autorenseite senden und Terminfenster benennen.",
    relatedCommunicationId: "comm-dm-feedback",
    checkpoints: [
      "Offene Kommentare in V2 bündeln",
      "Antwortentwurf über Imprima Assist prüfen",
      "Terminrisiko im Statusbericht aktualisieren",
    ],
  },
  {
    id: "task-nh-alt",
    title: "Alt-Texte für Preflight prüfen",
    projectId: "nachhaltig-handeln",
    project: "Nachhaltig handeln",
    owner: "M. Schneider",
    due: "Morgen, 10:00",
    status: "Morgen",
    priority: "mittel",
    detailStatus: "in-arbeit",
    chapter: "Preflight-Paket",
    pageRange: "S. 1-196",
    productionPhase: "Barrierefreiheitscheck vor Druckfreigabe",
    reason: "Die Alt-Texte wurden ergänzt und müssen im finalen Preflight-Bericht noch einmal geprüft werden.",
    impact: "Das Freigabefenster bleibt stabil, wenn der WCAG-Hinweis geschlossen wird.",
    nextStep: "Preflight erneut laufen lassen und Freigabebericht aktualisieren.",
    relatedCommunicationId: "comm-nh-alttexte",
    checkpoints: [
      "Alt-Texte gegen Bildliste abgleichen",
      "WCAG-Hinweis im Preflight schließen",
      "Freigabebericht als finalen Kandidaten ablegen",
    ],
  },
  {
    id: "task-sh-layout",
    title: "Layoutfenster für Kapitel 1 bestätigen",
    projectId: "storytelling-heute",
    project: "Storytelling heute",
    owner: "J. Wegner",
    due: "Diese Woche",
    status: "Diese Woche",
    priority: "niedrig",
    detailStatus: "offen",
    chapter: "Kapitel 1 - Grundlagen des Erzählens",
    pageRange: "S. 1-96",
    productionPhase: "Erstsatz mit komplexer Bildstrecke",
    reason: "Die Bildstrecke in Kapitel 1 verschiebt mehrere Seiten in den komplexen Satzmix.",
    impact: "Eine frühe Entscheidung verhindert spätere Umbrüche in V1 und hält den Aufwand transparent.",
    nextStep: "Layoutfenster, Bildpriorität und Umfang der komplexen Seiten mit Redaktion bestätigen.",
    relatedCommunicationId: "comm-sh-bildstrecke",
    checkpoints: [
      "Bildprioritäten aus Redaktion prüfen",
      "Komplexe Seiten im Satzmix markieren",
      "V1-Fenster im Kalender gegen Kapazität prüfen",
    ],
  },
  {
    id: "task-kds-marginalien",
    title: "Marginalien und Hybridverweise rückbestätigen",
    projectId: "kunst-des-satzes",
    project: "Die Kunst des Satzes",
    owner: "L. Bauer",
    due: "Morgen, 12:00",
    status: "Morgen",
    priority: "mittel",
    detailStatus: "offen",
    chapter: "Kapitel 5 - Praxis & Beispiele",
    pageRange: "S. 185-268",
    productionPhase: "Umfangsänderung vor Preflight",
    reason: "Nachträglich erweiterte Marginalien verändern den realen Satzmix und müssen als Auftragsdelta sichtbar bleiben.",
    impact: "Ohne Rückbestätigung wirkt der Mehraufwand später wie ein Satzfehler statt wie eine dokumentierte Änderung.",
    nextStep: "Marginalienliste gegen Korrekturmail prüfen und Änderung im Satzmix markieren.",
    relatedCommunicationId: "comm-kds-marginalien",
    checkpoints: [
      "Hybridverweise gegen Manuskriptstand prüfen",
      "Geänderte Marginalien im Kapitelprotokoll markieren",
      "Auftragsdelta für Statusbericht vorbereiten",
    ],
  },
  {
    id: "task-dm-delivery",
    title: "Druck-PDF-Paket gegen Terminfenster prüfen",
    projectId: "digital-mindset",
    project: "Digital Mindset",
    owner: "M. Schneider",
    due: "Heute, 18:00",
    status: "Heute",
    priority: "hoch",
    detailStatus: "offen",
    chapter: "Finalpaket",
    pageRange: "S. 1-248",
    productionPhase: "Finalisierung unter Terminrisiko",
    reason: "Der Drucktermin ist kritisch und die fehlende V2-Rückmeldung darf nicht im finalen Paket verschwinden.",
    impact: "Ein sauberer Paketcheck verhindert, dass ein unfertiger Stand als druckfertig kommuniziert wird.",
    nextStep: "Paketstatus mit offener V2-Rückmeldung abgleichen und nur belastbare Bestandteile freigeben.",
    relatedCommunicationId: "comm-dm-feedback",
    checkpoints: [
      "Final-PDF gegen letzte Korrekturliste prüfen",
      "Offene Autorenrückmeldung im Statusbericht markieren",
      "Lieferfähigkeit mit realem Puffer abgleichen",
    ],
  },
  {
    id: "task-nh-release",
    title: "Freigabebericht für Herstellung vorbereiten",
    projectId: "nachhaltig-handeln",
    project: "Nachhaltig handeln",
    owner: "M. Schneider",
    due: "Diese Woche",
    status: "Diese Woche",
    priority: "mittel",
    detailStatus: "in-arbeit",
    chapter: "Freigabeakte",
    pageRange: "S. 1-196",
    productionPhase: "Druckfreigabe nach technischem Check",
    reason: "Der Preflight ist stabil, aber der Freigabebericht muss die Alt-Text-Änderungen nachvollziehbar dokumentieren.",
    impact: "Die Herstellung kann ohne Rückfrage übernehmen, wenn Bericht und finaler Kandidat konsistent sind.",
    nextStep: "Preflight-Bericht aktualisieren und Freigabepaket als finalen Kandidaten ablegen.",
    relatedCommunicationId: "comm-nh-alttexte",
    checkpoints: [
      "WCAG-Hinweis als geschlossen dokumentieren",
      "Final-PDF und Bericht versionieren",
      "Freigabeübergabe im Kalender bestätigen",
    ],
  },
  {
    id: "task-dt-template",
    title: "Template-Freigabe und Manuskriptmetadaten prüfen",
    projectId: "design-thinking",
    project: "Design Thinking im Unterricht",
    owner: "J. Wegner",
    due: "Diese Woche",
    status: "Diese Woche",
    priority: "niedrig",
    detailStatus: "erledigt",
    chapter: "Projektstart",
    pageRange: "S. 1-224",
    productionPhase: "Vorbereitung vor Erstsatz",
    reason: "Template und Manuskripteingang sind geklärt, die Metadaten müssen für spätere Suche sauber abgelegt sein.",
    impact: "Der Erstsatz kann ohne Rückfragen starten und die ISBN/Titelnummer bleiben in allen Modulen auffindbar.",
    nextStep: "Metadaten prüfen und Startpaket als erledigten Vorbereitungspunkt schließen.",
    relatedCommunicationId: "comm-dt-manuskript",
    checkpoints: [
      "ISBN und Titelnummer gegen Vertrag prüfen",
      "Template-Freigabe im Projektlog ablegen",
      "Startpaket als erledigt markieren",
    ],
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
    projectId: "digital-mindset",
    date: "10.07.",
    weekday: "Fr",
    title: "Drucktermin Digital Mindset",
    project: "Digital Mindset",
    type: "Deadline",
    priority: "kritisch",
    impact: "Verbindlicher Liefertermin. Zusatzumfang nur mit neuem Terminfenster übernehmen.",
  },
  {
    id: "event-kds-correction",
    projectId: "kunst-des-satzes",
    date: "15.07.",
    weekday: "Mi",
    title: "Autorenkorrektur Kapitel 4",
    project: "Die Kunst des Satzes",
    type: "Korrektur",
    priority: "hoch",
    impact: "Bildlegenden und Marginalien entscheiden, ob die Schlusskorrektur sauber starten kann.",
  },
  {
    id: "event-kds-preflight",
    projectId: "kunst-des-satzes",
    date: "22.07.",
    weekday: "Mi",
    title: "Preflight vorbereiten",
    project: "Die Kunst des Satzes",
    type: "Preflight",
    priority: "hoch",
    impact: "Technische Prüfung vor der Freigabe. Hinweise parallel schließen, damit kein Rückstau entsteht.",
  },
  {
    id: "event-nh-final",
    projectId: "nachhaltig-handeln",
    date: "27.07.",
    weekday: "Mo",
    title: "Druckfreigabe Nachhaltig handeln",
    project: "Nachhaltig handeln",
    type: "Freigabe",
    priority: "stabil",
    impact: "Finales Freigabefenster. Nach positiver Sichtprüfung kann die Übergabe an Herstellung erfolgen.",
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
    label: "Freigabe",
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
