import { useEffect, useMemo, useRef, useState } from "react";
import { Wordmark } from "./components/Brand";
import { Icon } from "./components/Icon";
import { ImprimaAssist } from "./components/ImprimaAssist";
import { PageUtilityNav } from "./components/PageUtilityNav";
import { ActionNotice, type ActionNoticeModel } from "./components/ActionNotice";
import { ProjectContextBar } from "./components/ProjectContextBar";
import {
  appNavItems,
  canCreateProjectFromView,
  createAppNavigationSearch,
  getBookTabForView,
  parseAppNavigation,
  type AppNavigationState,
  type BookTab,
  type ViewId,
} from "./domain/navigation";
import { loadStoredProjects, loadStoredTasks, saveStoredProjects, saveStoredTasks } from "./domain/appStorage";
import { projects } from "./domain/mockData";
import { taskItems, type TaskItem } from "./domain/moduleData";
import { createChapterFromDraft, type ChapterDraft } from "./domain/chapterFactory";
import { createProjectFromDraft, type ProjectDraft } from "./domain/projectFactory";
import type { Chapter, ProductionStatus, Project } from "./domain/types";
import { BookCockpit } from "./screens/BookCockpit";
import { CalendarScreen } from "./screens/CalendarScreen";
import { CaseStudy } from "./screens/CaseStudy";
import { CommunicationScreen } from "./screens/CommunicationScreen";
import { FilesScreen } from "./screens/FilesScreen";
import { NewProjectDialog } from "./screens/NewProjectDialog";
import { ProjectOverview } from "./screens/ProjectOverview";
import { ReportsScreen } from "./screens/ReportsScreen";
import { SharedStatusPage } from "./screens/SharedStatusPage";
import { TasksScreen } from "./screens/TasksScreen";
import { getSharedStatusPath } from "./domain/sharedStatus";

type CockpitView = "projects" | "corrections" | "approval";
type ModuleView = "tasks" | "files" | "calendar" | "reports" | "communication";
type RouteMode = "app" | "case-study" | "shared-status";

const CASE_STUDY_PATH = "/case-study";
const SHARED_STATUS_PREFIX = "/status/";
const DEFAULT_PROJECT_ID = "kunst-des-satzes";

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

function ModuleScreen({
  view,
  projectList,
  tasks,
  onCreateProject,
  onOpenProject,
  onUpdateTask,
  onFeedback,
}: {
  view: ModuleView;
  projectList: Project[];
  tasks: TaskItem[];
  onCreateProject: () => void;
  onOpenProject: (projectId: string) => void;
  onUpdateTask: (taskId: string, patch: Partial<TaskItem>) => void;
  onFeedback: (message: string, onUndo?: () => void) => void;
}) {
  switch (view) {
    case "tasks":
      return <TasksScreen projects={projectList} tasks={tasks} onCreateProject={onCreateProject} onOpenProject={onOpenProject} onUpdateTask={onUpdateTask} />;
    case "files":
      return (
        <FilesScreen projects={projectList} onCreateProject={onCreateProject} onOpenProject={onOpenProject} />
      );
    case "calendar":
      return (
        <CalendarScreen projects={projectList} onCreateProject={onCreateProject} onOpenProject={onOpenProject} onFeedback={onFeedback} />
      );
    case "reports":
      return (
        <ReportsScreen projects={projectList} onCreateProject={onCreateProject} onOpenProject={onOpenProject} />
      );
    case "communication":
      return (
        <CommunicationScreen projects={projectList} onCreateProject={onCreateProject} onOpenProject={onOpenProject} />
      );
  }
}

function getRouteMode(): RouteMode {
  if (window.location.pathname === CASE_STUDY_PATH) {
    return "case-study";
  }

  if (window.location.pathname.startsWith(SHARED_STATUS_PREFIX)) {
    return "shared-status";
  }

  return "app";
}

function getSharedStatusProjectId(): string | undefined {
  if (!window.location.pathname.startsWith(SHARED_STATUS_PREFIX)) {
    return undefined;
  }

  return decodeURIComponent(window.location.pathname.slice(SHARED_STATUS_PREFIX.length)) || undefined;
}

export default function App() {
  const [routeMode, setRouteMode] = useState<RouteMode>(() => getRouteMode());
  const [projectList, setProjectList] = useState<Project[]>(() => loadStoredProjects(window.localStorage, projects));
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadStoredTasks(window.localStorage, taskItems));
  const [initialNavigation] = useState(() =>
    parseAppNavigation(window.location.search, projectList.at(0)?.id ?? DEFAULT_PROJECT_ID),
  );
  const [view, setView] = useState<ViewId>(initialNavigation.view);
  const [selectedProjectId, setSelectedProjectId] = useState(initialNavigation.projectId);
  const [activeBookTab, setActiveBookTab] = useState<BookTab>(initialNavigation.tab);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const newProjectTriggerRef = useRef<HTMLElement | null>(null);
  const [notice, setNotice] = useState<ActionNoticeModel | undefined>();
  const selectedProject = useMemo(
    () => projectList.find((project) => project.id === selectedProjectId) ?? projectList.at(0),
    [projectList, selectedProjectId],
  );
  const showCreateProjectAction = canCreateProjectFromView(view);
  const sharedStatusProject = useMemo(() => {
    const projectId = getSharedStatusProjectId();
    return projectList.find((project) => project.id === projectId);
  }, [projectList, routeMode]);

  useEffect(() => {
    const syncRoute = () => {
      const nextRouteMode = getRouteMode();
      setRouteMode(nextRouteMode);

      if (nextRouteMode === "app") {
        const navigation = parseAppNavigation(window.location.search, DEFAULT_PROJECT_ID);
        setView(navigation.view);
        setSelectedProjectId(navigation.projectId);
        setActiveBookTab(navigation.tab);
      }
    };
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  useEffect(() => {
    saveStoredProjects(window.localStorage, projectList);
  }, [projectList]);

  useEffect(() => {
    saveStoredTasks(window.localStorage, tasks);
  }, [tasks]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timeoutId = window.setTimeout(() => setNotice(undefined), 5200);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const showFeedback = (message: string, onUndo?: () => void) => {
    setNotice({ id: Date.now(), message, onUndo });
  };

  const updateProjects = (updater: (current: Project[]) => Project[], message: string) => {
    const previous = projectList;
    const next = updater(previous);
    setProjectList(next);
    showFeedback(message, () => {
      setProjectList(previous);
      setNotice({ id: Date.now(), message: "Änderung rückgängig gemacht." });
    });
  };

  useEffect(() => {
    if (routeMode !== "app" || !selectedProject || selectedProject.id === selectedProjectId) {
      return;
    }

    setSelectedProjectId(selectedProject.id);
    window.history.replaceState(
      {},
      "",
      `/${createAppNavigationSearch({ view, projectId: selectedProject.id, tab: activeBookTab })}`,
    );
  }, [activeBookTab, routeMode, selectedProject, selectedProjectId, view]);

  const navigateInApp = (navigation: AppNavigationState, mode: "push" | "replace" = "push") => {
    setRouteMode("app");
    setView(navigation.view);
    setSelectedProjectId(navigation.projectId);
    setActiveBookTab(navigation.tab);
    window.history[`${mode}State`]({}, "", `/${createAppNavigationSearch(navigation)}`);
  };

  const handleViewChange = (nextView: ViewId) => {
    navigateInApp({
      view: nextView,
      projectId: selectedProject?.id ?? DEFAULT_PROJECT_ID,
      tab: nextView === "projects" ? "overview" : getBookTabForView(nextView, activeBookTab),
    });
    resetPageScroll();
  };

  const handleBookTabChange = (nextTab: BookTab) => {
    navigateInApp({
      view: tabToCockpitView[nextTab],
      projectId: selectedProject?.id ?? DEFAULT_PROJECT_ID,
      tab: nextTab,
    });
  };

  const resetPageScroll = () => {
    window.scrollTo({ top: 0 });
  };

  const openPrototypeFromCaseStudy = () => {
    navigateInApp({ view: "overview", projectId: selectedProject?.id ?? DEFAULT_PROJECT_ID, tab: "overview" });
    resetPageScroll();
  };

  const openPrototypeFromSharedStatus = (projectId: string) => {
    navigateInApp({ view: "projects", projectId, tab: "overview" });
    resetPageScroll();
  };

  const openSharedStatus = (projectId: string) => {
    window.history.pushState({}, "", getSharedStatusPath(projectId));
    setRouteMode("shared-status");
    resetPageScroll();
  };

  const returnToWorkspaceOverview = () => {
    navigateInApp({ view: "overview", projectId: selectedProject?.id ?? DEFAULT_PROJECT_ID, tab: "overview" });
    resetPageScroll();
  };

  const openNewProjectDialog = () => {
    newProjectTriggerRef.current = document.activeElement as HTMLElement | null;
    setIsNewProjectOpen(true);
  };

  const closeNewProjectDialog = () => {
    setIsNewProjectOpen(false);
    window.requestAnimationFrame(() => newProjectTriggerRef.current?.focus());
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

    updateProjects((current) => [uniqueProject, ...current], `Projekt „${uniqueProject.title}“ wurde angelegt.`);
    navigateInApp({ view: "projects", projectId: uniqueProject.id, tab: "overview" });
    setIsNewProjectOpen(false);
  };

  const addChapterToProject = (projectId: string, draft: ChapterDraft) => {
    updateProjects(
      (current) =>
      current.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        const nextChapter = createChapterFromDraft(draft, {
          projectPages: project.pages,
          existingChapterIds: project.chapters.map((chapter) => chapter.id),
        });

        return {
          ...project,
          chapters: [...project.chapters, nextChapter],
        };
      }),
      "Kapitel wurde angelegt und in der Projektstruktur gespeichert.",
    );
  };

  const updateChapter = (projectId: string, chapterId: string, patch: Partial<Chapter>) => {
    updateProjects(
      (current) => current.map((project) => project.id === projectId
        ? { ...project, chapters: project.chapters.map((chapter) => chapter.id === chapterId ? { ...chapter, ...patch } : chapter) }
        : project),
      "Kapiteländerung wurde gespeichert.",
    );
  };

  const updateProjectStatus = (projectId: string, status: ProductionStatus) => {
    updateProjects(
      (current) => current.map((project) => project.id === projectId ? { ...project, status } : project),
      "Projektstatus wurde aktualisiert. Berichte und Übersichten sind synchron.",
    );
  };

  const updateTask = (taskId: string, patch: Partial<TaskItem>) => {
    const previous = tasks;
    setTasks((current) => current.map((task) => task.id === taskId ? { ...task, ...patch } : task));
    showFeedback("Aufgabenstatus wurde gespeichert.", () => {
      setTasks(previous);
      setNotice({ id: Date.now(), message: "Aufgabenänderung rückgängig gemacht." });
    });
  };

  const setProjectApproval = (projectId: string, approved: boolean) => {
    updateProjects(
      (current) => current.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        return approved
          ? { ...project, preApprovalStatus: project.status, status: "freigegeben" }
          : { ...project, status: project.preApprovalStatus ?? "preflight", preApprovalStatus: undefined };
      }),
      approved ? "Druckfreigabe wurde erteilt." : "Druckfreigabe wurde zurückgenommen.",
    );
  };

  const openProject = (projectId: string) => {
    navigateInApp({ view: "projects", projectId, tab: "overview" });
    resetPageScroll();
  };

  if (routeMode === "case-study") {
    return (
      <>
        <a className="skip-link" href="#main-content">Zum Inhalt springen</a>
        <main className="case-page" id="main-content">
          <CaseStudy onOpenPrototype={openPrototypeFromCaseStudy} />
        </main>
      </>
    );
  }

  if (routeMode === "shared-status") {
    return sharedStatusProject ? (
      <SharedStatusPage
        project={sharedStatusProject}
        onOpenPrototype={() => openPrototypeFromSharedStatus(sharedStatusProject.id)}
      />
    ) : (
      <>
        <a className="skip-link" href="#main-content">Zum Inhalt springen</a>
        <main className="share-page" id="main-content">
          <ProjectEmptyState />
        </main>
      </>
    );
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Zum Inhalt springen</a>
      <div className="app-shell">
        <aside className="sidebar">
        <div className="sidebar-brand">
          <Wordmark />
        </div>

        <nav className="sidebar-nav" aria-label="Hauptnavigation">
          {appNavItems.map((item) => (
            <a
              key={item.id}
              href={`/${createAppNavigationSearch({
                view: item.id,
                projectId: selectedProject?.id ?? DEFAULT_PROJECT_ID,
                tab: item.id === "projects" ? "overview" : getBookTabForView(item.id, activeBookTab),
              })}`}
              className={`nav-item${view === item.id ? " is-active" : ""}`}
              aria-label={item.label}
              aria-current={view === item.id ? "page" : undefined}
              onClick={(event) => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                  return;
                }

                event.preventDefault();
                handleViewChange(item.id);
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </a>
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

        <main className="workspace" id="main-content">
        {isModuleView(view) ? (
          <>
            <ProjectContextBar
              projects={projectList}
              projectId={selectedProject?.id ?? DEFAULT_PROJECT_ID}
              onChange={(projectId) => navigateInApp({ view, projectId, tab: "overview" })}
              onOpen={() => selectedProject && openProject(selectedProject.id)}
            />
            <ModuleScreen
              view={view}
              projectList={projectList}
              tasks={tasks}
              onCreateProject={openNewProjectDialog}
              onOpenProject={openProject}
              onUpdateTask={updateTask}
              onFeedback={showFeedback}
            />
          </>
        ) : isCockpitView(view) ? (
          selectedProject ? (
            <BookCockpit
              project={selectedProject}
              projects={projectList}
              activeTab={activeBookTab}
              onTabChange={handleBookTabChange}
              onSelectProject={(projectId) => {
                navigateInApp({ view, projectId, tab: activeBookTab });
                resetPageScroll();
              }}
              onCreateProject={showCreateProjectAction ? openNewProjectDialog : undefined}
              onShareStatus={openSharedStatus}
              onBackToOverview={returnToWorkspaceOverview}
              onAddChapter={addChapterToProject}
              onUpdateChapter={updateChapter}
              onUpdateProjectStatus={updateProjectStatus}
              onSetApproval={setProjectApproval}
            />
          ) : (
            <ProjectEmptyState />
          )
        ) : (
          <ProjectOverview
            projects={projectList}
            onCreateProject={openNewProjectDialog}
            onSelectProject={(projectId) => {
              openProject(projectId);
            }}
          />
        )}
        <PageUtilityNav
          backLabel={isCockpitView(view) ? "Zur Projektübersicht" : "Zur Übersicht"}
          onBack={view === "overview" ? undefined : returnToWorkspaceOverview}
        />
        </main>

        {isNewProjectOpen && <NewProjectDialog onClose={closeNewProjectDialog} onCreate={createProject} />}
        {notice && <ActionNotice notice={notice} onDismiss={() => setNotice(undefined)} />}
        <ImprimaAssist
          project={selectedProject}
          onOpenCommunication={() => {
            handleViewChange("communication");
          }}
        />
      </div>
    </>
  );
}
