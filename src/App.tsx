import { useMemo, useState } from "react";
import { Wordmark } from "./components/Brand";
import { Icon } from "./components/Icon";
import { projects } from "./domain/mockData";
import { BookCockpit } from "./screens/BookCockpit";
import type { BookTab } from "./screens/BookCockpit";
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

type CockpitView = "projects" | "corrections" | "approval" | "reports";
type StubView = "tasks" | "files" | "calendar";

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

const cockpitViewToTab: Record<CockpitView, BookTab> = {
  projects: "overview",
  corrections: "corrections",
  approval: "preflight",
  reports: "risk",
};

const tabToCockpitView: Record<BookTab, CockpitView> = {
  overview: "projects",
  corrections: "corrections",
  preflight: "approval",
  risk: "reports",
};

const moduleStubs: Record<StubView, { title: string; description: string }> = {
  tasks: {
    title: "Aufgaben",
    description: "Dieses Modul liegt ausserhalb des Prototype-Umfangs und ist daher nicht umgesetzt.",
  },
  files: {
    title: "Dateien",
    description: "Die Dateiverwaltung ist in diesem Prototyp bewusst nicht abgebildet.",
  },
  calendar: {
    title: "Kalender",
    description: "Die Kalenderansicht ist ausserhalb des Prototype-Umfangs.",
  },
};

function isCockpitView(view: ViewId): view is CockpitView {
  return view === "projects" || view === "corrections" || view === "approval" || view === "reports";
}

function isStubView(view: ViewId): view is StubView {
  return view === "tasks" || view === "files" || view === "calendar";
}

function ModuleStub({ title, description }: { title: string; description: string }) {
  return (
    <section className="screen">
      <article className="panel module-stub">
        <p className="eyebrow">Modul</p>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </article>
    </section>
  );
}

function ProjectEmptyState() {
  return (
    <section className="screen">
      <div className="empty-state compact">
        <strong>Kein Projekt verfuegbar.</strong>
        <span>Es gibt aktuell kein Projekt, das im Cockpit angezeigt werden kann.</span>
      </div>
    </section>
  );
}

export default function App() {
  const [view, setView] = useState<ViewId>("overview");
  const [selectedProjectId, setSelectedProjectId] = useState("kunst-des-satzes");
  const [activeBookTab, setActiveBookTab] = useState<BookTab>("overview");
  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? projects.at(0),
    [selectedProjectId],
  );

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
        {view === "case" ? (
          <CaseStudy onOpenPrototype={() => handleViewChange("overview")} />
        ) : isStubView(view) ? (
          <ModuleStub title={moduleStubs[view].title} description={moduleStubs[view].description} />
        ) : isCockpitView(view) ? (
          selectedProject ? (
            <BookCockpit project={selectedProject} activeTab={activeBookTab} onTabChange={handleBookTabChange} />
          ) : (
            <ProjectEmptyState />
          )
        ) : (
          <ProjectOverview
            projects={projects}
            onSelectProject={(projectId) => {
              setSelectedProjectId(projectId);
              setActiveBookTab("overview");
              setView("projects");
            }}
          />
        )}
      </main>
    </div>
  );
}
