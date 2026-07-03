export type ViewId =
  | "overview"
  | "projects"
  | "tasks"
  | "corrections"
  | "approval"
  | "files"
  | "calendar"
  | "reports"
  | "communication";

export type NavIconName =
  | "overview"
  | "projects"
  | "tasks"
  | "corrections"
  | "approval"
  | "files"
  | "calendar"
  | "reports"
  | "communication";

export interface NavItem {
  id: ViewId;
  label: string;
  icon: NavIconName;
}

export const appNavItems: NavItem[] = [
  { id: "overview", label: "Übersicht", icon: "overview" },
  { id: "projects", label: "Projekte", icon: "projects" },
  { id: "tasks", label: "Aufgaben", icon: "tasks" },
  { id: "corrections", label: "Korrekturen", icon: "corrections" },
  { id: "approval", label: "Freigaben", icon: "approval" },
  { id: "files", label: "Dateien", icon: "files" },
  { id: "calendar", label: "Kalender", icon: "calendar" },
  { id: "reports", label: "Berichte", icon: "reports" },
  { id: "communication", label: "Kommunikation", icon: "communication" },
];
