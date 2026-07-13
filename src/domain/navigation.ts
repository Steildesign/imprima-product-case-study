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

export type BookTab = "overview" | "corrections" | "preflight" | "risk";

export interface AppNavigationState {
  view: ViewId;
  projectId: string;
  tab: BookTab;
}

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

const viewIds = new Set<ViewId>(appNavItems.map((item) => item.id));
const bookTabs = new Set<BookTab>(["overview", "corrections", "preflight", "risk"]);

export function getBookTabForView(view: ViewId, requestedTab: BookTab = "overview"): BookTab {
  if (view === "corrections") {
    return "corrections";
  }

  if (view === "approval") {
    return "preflight";
  }

  return view === "projects" ? requestedTab : "overview";
}

export function parseAppNavigation(search: string, defaultProjectId: string): AppNavigationState {
  const params = new URLSearchParams(search);
  const requestedView = params.get("view") as ViewId | null;
  const requestedTab = params.get("tab") as BookTab | null;
  const view = requestedView && viewIds.has(requestedView) ? requestedView : "overview";
  const tab = getBookTabForView(view, requestedTab && bookTabs.has(requestedTab) ? requestedTab : "overview");

  return {
    view,
    projectId: params.get("project")?.trim() || defaultProjectId,
    tab,
  };
}

export function createAppNavigationSearch(state: AppNavigationState): string {
  const params = new URLSearchParams();
  params.set("view", state.view);
  params.set("project", state.projectId);

  if (state.view === "projects" || state.view === "corrections" || state.view === "approval") {
    params.set("tab", getBookTabForView(state.view, state.tab));
  }

  return `?${params.toString()}`;
}

const createProjectViews = new Set<ViewId>(appNavItems.map((item) => item.id));

export function canCreateProjectFromView(view: ViewId): boolean {
  return createProjectViews.has(view);
}
