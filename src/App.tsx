import { useMemo, useState } from "react";
import { Wordmark } from "./components/Brand";
import { Icon } from "./components/Icon";
import { projects } from "./domain/mockData";
import { getProjectById } from "./domain/selectors";
import { BookCockpit } from "./screens/BookCockpit";
import { CaseStudy } from "./screens/CaseStudy";
import { ProjectOverview } from "./screens/ProjectOverview";

type ViewId =
  | "overview"
  | "projects"
  | "tasks"
  | "corrections"
  | "approval"
  | "files"
  | "calendar"
  | "reports"
  | "case";

const navItems: Array<{ id: ViewId; label: string; icon: Parameters<typeof Icon>[0]["name"] }> = [
  { id: "overview", label: "Uebersicht", icon: "overview" },
  { id: "projects", label: "Projekte", icon: "projects" },
  { id: "tasks", label: "Aufgaben", icon: "tasks" },
  { id: "corrections", label: "Korrekturen", icon: "corrections" },
  { id: "approval", label: "Freigaben", icon: "approval" },
  { id: "files", label: "Dateien", icon: "files" },
  { id: "calendar", label: "Kalender", icon: "calendar" },
  { id: "reports", label: "Berichte", icon: "reports" },
  { id: "case", label: "Case Study", icon: "case" },
];

const cockpitViews: ViewId[] = ["projects", "corrections", "approval", "reports"];

function getInitialBookTab(view: ViewId) {
  if (view === "corrections") {
    return "corrections";
  }
  if (view === "approval") {
    return "preflight";
  }
  if (view === "reports") {
    return "risk";
  }
  return "overview";
}

export default function App() {
  const [view, setView] = useState<ViewId>("overview");
  const [selectedProjectId, setSelectedProjectId] = useState("kunst-des-satzes");
  const selectedProject = useMemo(() => getProjectById(projects, selectedProjectId), [selectedProjectId]);
  const showCockpit = cockpitViews.includes(view);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Wordmark />
        </div>

        <nav className="sidebar-nav" aria-label="Hauptnavigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item${view === item.id ? " is-active" : ""}`}
              onClick={() => setView(item.id)}
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
        {view === "case" ? (
          <CaseStudy onOpenPrototype={() => setView("overview")} />
        ) : showCockpit ? (
          <BookCockpit project={selectedProject} initialTab={getInitialBookTab(view)} />
        ) : (
          <ProjectOverview
            projects={projects}
            onSelectProject={(projectId) => {
              setSelectedProjectId(projectId);
              setView("projects");
            }}
          />
        )}
      </main>
    </div>
  );
}
