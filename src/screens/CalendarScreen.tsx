import type { CSSProperties, ReactNode } from "react";
import { Button } from "../components/Button";
import { ProductionTimeline } from "../components/ProductionTimeline";
import { calendarEvents } from "../domain/moduleData";
import type { CalendarEventType } from "../domain/moduleData";
import {
  capacityWindows,
  getCapacityMotionState,
  getProjectPlanningMeta,
  planningInsights,
  planningMonths,
  vacationWindows,
} from "../domain/productionPlanning";
import type { Project } from "../domain/types";

interface CalendarScreenProps {
  projects: Project[];
  onCreateProject: () => void;
  onOpenProject: (projectId: string) => void;
  onFeedback?: (message: string, onUndo?: () => void) => void;
}

const qualityLabels = {
  gut: "Gutes Fenster",
  moeglich: "Möglich",
  "nicht-empfohlen": "Nicht einplanen",
};

const priorityLabels = {
  kritisch: "kritisch",
  hoch: "hoch",
  stabil: "stabil",
};

const fixpointVisuals: Record<
  CalendarEventType,
  { color: string; background: string; border: string; label: string }
> = {
  Deadline: {
    color: "#e5362e",
    background: "#fff5f3",
    border: "#f2b8b5",
    label: "Terminkritisch",
  },
  Korrektur: {
    color: "#c77700",
    background: "#fff9ed",
    border: "#f4d79a",
    label: "Klärung nötig",
  },
  Preflight: {
    color: "#2f8ded",
    background: "#f0f7ff",
    border: "#b8dcff",
    label: "Technische Prüfung",
  },
  Freigabe: {
    color: "#079d38",
    background: "#f2fbf5",
    border: "#b7e6c4",
    label: "Freigabefenster",
  },
};

function getFixpointStyle(type: CalendarEventType, projectColor: string) {
  const visual = fixpointVisuals[type];

  return {
    "--fixpoint-color": visual.color,
    "--fixpoint-bg": visual.background,
    "--fixpoint-border": visual.border,
    "--project-color": projectColor,
  } as CSSProperties;
}

function FixpointIcon({ type }: { type: CalendarEventType }) {
  const icons: Record<CalendarEventType, ReactNode> = {
    Deadline: (
      <>
        <path d="M6 4v16" />
        <path d="M7 5h10l-2 4 2 4H7" />
      </>
    ),
    Korrektur: (
      <>
        <path d="M5 17.5 6.2 13 16 3.2l3 3L9.2 16z" />
        <path d="m14.5 4.7 3 3" />
        <path d="M5 20h14" />
      </>
    ),
    Preflight: (
      <>
        <path d="M7 4h7l3 3v13H7z" />
        <path d="M14 4v4h3" />
        <path d="m9.5 14 1.8 1.8 3.8-4.1" />
      </>
    ),
    Freigabe: (
      <>
        <path d="M12 3.5 18 6v5.1c0 3.8-2.2 6.8-6 8.4-3.8-1.6-6-4.6-6-8.4V6z" />
        <path d="m8.8 12 2.1 2.1 4.4-4.6" />
      </>
    ),
  };

  return (
    <svg className="fixpoint-icon" aria-hidden="true" viewBox="0 0 24 24">
      {icons[type]}
    </svg>
  );
}

export function CalendarScreen({ projects, onCreateProject, onOpenProject, onFeedback }: CalendarScreenProps) {
  return (
    <section className="screen planning-screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Produktionsplanung</p>
          <h1>Langzeitplanung für Titel, Kapazität und Urlaub.</h1>
          <p className="muted">
            Fortlaufende Timeline von Juli 2026 bis April 2027 mit Projektfarben, Produktionsphasen und belastbaren
            Ruhefenstern.
          </p>
        </div>
        <Button onClick={onCreateProject}>Neues Projekt</Button>
      </header>

      <div className="planning-kpis">
        {planningInsights.map((insight) => (
          <article className={`panel report-card report-${insight.tone}`} key={insight.id}>
            <p className="panel-label">{insight.label}</p>
            <strong>{insight.value}</strong>
            <p>{insight.detail}</p>
          </article>
        ))}
      </div>

      <section className="panel planning-board">
        <div className="planning-board-header">
          <div>
            <p className="panel-label">Produktions-Timeline</p>
            <h2>Alle laufenden Projekte über den Planungszeitraum</h2>
          </div>
          <div className="project-legend" aria-label="Projektfarben">
            {projects.map((project) => {
              const meta = getProjectPlanningMeta(project.id);

              return (
                <span key={project.id}>
                  <i style={{ background: meta.color }} />
                  {meta.code}
                </span>
              );
            })}
          </div>
        </div>

        <ProductionTimeline projects={projects} onOpenProject={onOpenProject} onFeedback={onFeedback} />
      </section>

      <div className="planning-detail-grid">
        <section className="panel capacity-panel">
          <p className="panel-label">Kapazität</p>
          <h2>Auslastung nach Monat</h2>
          <div className="capacity-months">
            {capacityWindows.map((window, index) => {
              const motion = getCapacityMotionState(window, index);

              return (
                <article
                  className={`capacity-month capacity-${window.level} ${motion.levelClass}${motion.pulse ? " has-pulse" : ""}`}
                  key={window.id}
                  style={
                    {
                      "--capacity-meter-scale": motion.meterScale,
                      "--capacity-delay": `${motion.delayMs}ms`,
                    } as CSSProperties
                  }
                >
                  <div>
                    <strong>{window.label}</strong>
                    <span>{window.load}%</span>
                  </div>
                  <div className="capacity-meter" aria-label={`${window.label} Auslastung ${window.load} Prozent`}>
                    <span />
                  </div>
                  <p>{window.note}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="panel vacation-panel">
          <p className="panel-label">Urlaubsplanung</p>
          <h2>Freiräume und No-Go-Fenster</h2>
          <div className="vacation-list">
            {vacationWindows.map((window) => (
              <article className={`vacation-item vacation-${window.quality}`} key={window.id}>
                <div>
                  <strong>{window.label}</strong>
                  <span>{window.owner}</span>
                </div>
                <small>{qualityLabels[window.quality]}</small>
                <p>{window.note}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="panel calendar-fixpoints">
        <div className="fixpoint-header">
          <div>
            <p className="panel-label">Fixpunkte</p>
            <h2>Termine, die den Produktionsfluss bestimmen</h2>
          </div>
          <div className="fixpoint-legend" aria-label="Fixpunkt-Farbcodes">
            {Object.entries(fixpointVisuals).map(([type, visual]) => (
              <span key={type} style={getFixpointStyle(type as CalendarEventType, visual.color)}>
                <i />
                {visual.label}
              </span>
            ))}
          </div>
        </div>
        <div className="calendar-stack">
          {calendarEvents.map((event) => {
            const visual = fixpointVisuals[event.type];
            const projectMeta = getProjectPlanningMeta(event.projectId);

            return (
              <article
                className={`calendar-event calendar-event-${event.priority}`}
                key={event.id}
                style={getFixpointStyle(event.type, projectMeta.color)}
              >
                <time className="fixpoint-date">
                  <span>{event.weekday}</span>
                  <strong>{event.date}</strong>
                </time>
                <div className="fixpoint-content">
                  <div className="fixpoint-topline">
                    <span className="fixpoint-icon-shell">
                      <FixpointIcon type={event.type} />
                    </span>
                    <span className="fixpoint-type">{event.type}</span>
                    <span className="fixpoint-project-code">{projectMeta.code}</span>
                    <strong>{visual.label}</strong>
                  </div>
                  <h3>{event.title}</h3>
                  <p>{event.impact}</p>
                  <div className="fixpoint-meta">
                    <span>{event.project}</span>
                    <strong>{priorityLabels[event.priority]}</strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="planning-month-range" aria-label="Planungszeitraum">
          {planningMonths.map((month) => (
            <span key={month.id}>{`${month.label} ${month.year}`}</span>
          ))}
        </div>
      </section>
    </section>
  );
}
