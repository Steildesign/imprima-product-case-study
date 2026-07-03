import { useEffect, useMemo, useState } from "react";
import { Wordmark } from "./components/Brand";
import { Icon } from "./components/Icon";
import { appNavItems, type ViewId } from "./domain/navigation";
import { projects } from "./domain/mockData";
import { createProjectFromDraft, type ProjectDraft } from "./domain/projectFactory";
import type { Project } from "./domain/types";
import { BookCockpit } from "./screens/BookCockpit";
import type { BookTab } from "./screens/BookCockpit";
import { CalendarScreen } from "./screens/CalendarScreen";
import { CaseStudy } from "./screens/CaseStudy";
import { CommunicationScreen } from "./screens/CommunicationScreen";
import { FilesScreen } from "./screens/FilesScreen";
import { NewProjectDialog } from "./screens/NewProjectDialog";
import { ProjectOverview } from "./screens/ProjectOverview";
import { ReportsScreen } from "./screens/ReportsScreen";
import { TasksScreen } from "./screens/TasksScreen";

type CockpitView = "projects" | "corrections" | "approval";
type ModuleView = "tasks" | "files" | "calendar" | "reports" | "communication";
type RouteMode = "app" | "case-study";

const CASE_STUDY_PATH = "/case-study";

const cockpitViewToTab: Record<CockpitView, BookTab> = {
  projects: "overview",
  corrections: "corrections",
  approval: "preflight",
};

const tabToCockpitView: Record<BookTab, CockpitView> = {
  overview: "projects",
  corrections: "corrections",
  preflight: "approval",
  risk: "projects",
};

function isCockpitView(view: ViewId): view is CockpitView {
  return view === "projects" || view === "corrections" || view === "approval";
}

function isModuleView(view: ViewId): view is ModuleView {
  return view === "tasks" || view === "files" || view === "calendar" || view === "reports" || view === "communication";
}

function ProjectEmptyState() {
  return (
    <section className="screen">
      <div className="empty-state compact">
        <strong>Kein Projekt verfügbar.</strong>
        <span>Es gibt aktuell kein Projekt, das im Cockpit angezeigt werden kann.</span>
      </div>
    </section>
  );
}

function ModuleScreen({ view, projectList }: { view: ModuleView; projectList: Project[] }) {
  switch (view) {
    case "tasks":
      return <TasksScreen />;
    case "files":
      return <FilesScreen />;
    case "calendar":
      return <CalendarScreen />;
    case "reports":
      return <ReportsScreen projects={projectList} />;
    case "communication":
      return <CommunicationScreen />;
  }
}

function getRouteMode(): RouteMode {
  return window.location.pathname === CASE_STUDY_PATH ? "case-study" : "app";
}

export default function App() {
  const [routeMode, setRouteMode] = useState<RouteMode>(() => getRouteMode());
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [view, setView] = useState<ViewId>("overview");
  const [selectedProjectId, setSelectedProjectId] = useState("kunst-des-satzes");
  const [activeBookTab, setActiveBookTab] = useState<BookTab>("overview");
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const selectedProject = useMemo(
    () => projectList.find((project) => project.id === selectedProjectId) ?? projectList.at(0),
    [projectList, selectedProjectId],
  );

  useEffect(() => {
    const syncRoute = () => setRouteMode(getRouteMode());
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  const handleViewChange = (nextView: ViewId) => {
    setView(nextView);
    if (isCockpitView(nextView)) {
      setActiveBookTab(cockpitViewToTab[nextView]);
    }
  };

  const handleBookTabChange = (nextTab: BookTab) => {
    setActiveBookTab(nextTab);
    setView(tabToCockpitView[nextTab]);
  };

  const openPrototypeFromCaseStudy = () => {
    window.history.pushState({}, "", "/");
    setRouteMode("app");
    setView("overview");
    setActiveBookTab("overview");
  };

  const createProject = (draft: ProjectDraft) => {
    const nextProject = createProjectFromDraft(draft);
    const existingIds = new Set(projectList.map((project) => project.id));
    let uniqueProject = nextProject;
    let suffix = 2;

    while (existingIds.has(uniqueProject.id)) {
      uniqueProject = { ...nextProject, id: `${nextProject.id}-${suffix}` };
      suffix += 1;
    }

    setProjectList((current) => [uniqueProject, ...current]);
    setSelectedProjectId(uniqueProject.id);
    setActiveBookTab("overview");
    setView("projects");
    setIsNewProjectOpen(false);
  };

  if (routeMode === "case-study") {
    return (
      <main className="case-page">
        <CaseStudy onOpenPrototype={openPrototypeFromCaseStudy} />
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Wordmark />
        </div>

        <nav className="sidebar-nav" aria-label="Hauptnavigation">
          {appNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item${view === item.id ? " is-active" : ""}`}
              aria-label={item.label}
              aria-current={view === item.id ? "page" : undefined}
              onClick={() => handleViewChange(item.id)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="profile-chip">
          <span className="avatar">MS</span>
          <span>
            <strong>M. Schneider</strong>
            <small>Projektleiter</small>
          </span>
        </div>
      </aside>

      <main className="workspace">
        {isModuleView(view) ? (
          <ModuleScreen view={view} projectList={projectList} />
        ) : isCockpitView(view) ? (
          selectedProject ? (
            <BookCockpit project={selectedProject} activeTab={activeBookTab} onTabChange={handleBookTabChange} />
          ) : (
            <ProjectEmptyState />
          )
        ) : (
          <ProjectOverview
            projects={projectList}
            onCreateProject={() => setIsNewProjectOpen(true)}
            onSelectProject={(projectId) => {
              setSelectedProjectId(projectId);
              setActiveBookTab("overview");
              setView("projects");
            }}
          />
        )}
      </main>

      {isNewProjectOpen && <NewProjectDialog onClose={() => setIsNewProjectOpen(false)} onCreate={createProject} />}
    </div>
  );
}
