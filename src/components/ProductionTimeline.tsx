import {
  getPhaseDateRangeLabel,
  getPhaseMotionState,
  getPlanningDateWindow,
  getPlanningTimelinePlacement,
  getProjectPlanningMeta,
  getVisiblePlanningPhases,
  planningWeeks,
} from "../domain/productionPlanning";
import { useEffect, useState, type CSSProperties } from "react";
import type { PlanningDateWindow } from "../domain/productionPlanning";
import type { Project } from "../domain/types";
import { StatusBadge } from "./StatusBadge";

interface ProductionTimelineProps {
  projects: Project[];
  compact?: boolean;
  onOpenProject?: (projectId: string) => void;
  onFeedback?: (message: string, onUndo?: () => void) => void;
}

const PLANNING_STORAGE_KEY = "imprima.planning-dates.v1";

function loadPlanningDates(): Record<string, PlanningDateWindow> {
  try {
    const rawValue = window.localStorage.getItem(PLANNING_STORAGE_KEY);
    if (!rawValue) {
      return {};
    }

    const parsedValue = JSON.parse(rawValue) as Record<string, PlanningDateWindow>;
    if (!parsedValue || typeof parsedValue !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsedValue).filter(([, window]) =>
        typeof window?.startDate === "string" &&
        typeof window?.endDate === "string" &&
        window.startDate <= window.endDate,
      ),
    );
  } catch {
    return {};
  }
}

function getProjectStyle(color: string, accent: string) {
  return { "--project-color": color, "--project-accent": accent } as CSSProperties;
}

export function ProductionTimeline({ projects, compact = false, onOpenProject, onFeedback }: ProductionTimelineProps) {
  const phases = getVisiblePlanningPhases(projects);
  const [phaseDates, setPhaseDates] = useState<Record<string, PlanningDateWindow>>(loadPlanningDates);
  const [planningError, setPlanningError] = useState<string | undefined>();

  useEffect(() => {
    window.localStorage.setItem(PLANNING_STORAGE_KEY, JSON.stringify(phaseDates));
  }, [phaseDates]);

  const updatePhaseDate = (phaseId: string, field: keyof PlanningDateWindow, value: string) => {
    const phase = phases.find((item) => item.id === phaseId);
    if (!phase) {
      return;
    }

    const previous = phaseDates;
    const currentWindow = previous[phaseId] ?? getPlanningDateWindow(phase);
    const nextWindow = { ...currentWindow, [field]: value };
    if (nextWindow.startDate > nextWindow.endDate) {
      setPlanningError("Das Enddatum muss am oder nach dem Startdatum liegen.");
      return;
    }

    setPlanningError(undefined);
    setPhaseDates({ ...previous, [phaseId]: nextWindow });
    onFeedback?.(`${phase.label} wurde taggenau verschoben.`, () => setPhaseDates(previous));
  };

  return (
    <div
      className={`production-timeline${compact ? " is-compact" : ""}`}
      aria-label="Produktionstimeline mit Wochenraster und horizontalem Scrollbereich"
      style={{ "--planning-week-count": planningWeeks.length } as CSSProperties}
    >
      {planningError && <p className="planning-validation" role="alert">{planningError}</p>}
      <div className="planning-week-axis" aria-hidden="true">
        {planningWeeks.map((week) => (
          <span key={week.id} className="planning-week">
            <strong>{week.label}</strong>
            <small>{compact ? week.monthLabel : week.rangeLabel}</small>
          </span>
        ))}
      </div>

      <div className="planning-rows">
        {projects.map((project, projectIndex) => {
          const meta = getProjectPlanningMeta(project.id);
          const projectPhases = phases.filter((phase) => phase.projectId === project.id);

          return (
            <section
              className="planning-row"
              key={project.id}
              aria-label={`${project.title} Produktionsplanung`}
              style={{ "--planning-row-delay": `${projectIndex * 70}ms` } as CSSProperties}
            >
              <div className="planning-project">
                <span
                  className="project-code"
                  style={getProjectStyle(meta.color, meta.accent)}
                >
                  {meta.code}
                </span>
                <span>
                  {onOpenProject ? (
                    <button
                      type="button"
                      className="planning-project-link"
                      onClick={() => onOpenProject(project.id)}
                    >
                      {project.title}
                    </button>
                  ) : (
                    <strong>{project.title}</strong>
                  )}
                  <small className="project-id-line">ISBN {project.isbn}</small>
                  {!compact && <StatusBadge status={project.status} />}
                </span>
              </div>

              <div className="planning-track">
                {projectPhases.map((phase, phaseIndex) => {
                  const motion = getPhaseMotionState(phase, phaseIndex + projectIndex);
                  const window = phaseDates[phase.id] ?? getPlanningDateWindow(phase);
                  const placement = getPlanningTimelinePlacement(window);

                  return (
                    <span
                      className={`planning-bar planning-${phase.kind} planning-load-${phase.load} ${motion.loadClass}`}
                      key={phase.id}
                      style={{
                        "--phase-delay": `${motion.delayMs}ms`,
                        "--phase-left": `${placement.leftPercent}%`,
                        "--phase-width": `${placement.widthPercent}%`,
                        ...getProjectStyle(meta.color, meta.accent),
                      } as CSSProperties}
                      title={`${phase.label}: ${getPhaseDateRangeLabel(window)}`}
                    >
                      <span className="planning-bar-copy">
                        <strong>{phase.label}</strong>
                        <small>{getPhaseDateRangeLabel(window)}</small>
                      </span>
                      {!compact && (
                        <span className="planning-bar-controls" aria-label={`${phase.label} taggenau anpassen`}>
                          <input
                            name={`${project.id}-${phase.id}-start`}
                            type="date"
                            value={window.startDate}
                            onChange={(event) => updatePhaseDate(phase.id, "startDate", event.target.value)}
                            aria-label={`${phase.label} Startdatum`}
                          />
                          <input
                            name={`${project.id}-${phase.id}-end`}
                            type="date"
                            value={window.endDate}
                            onChange={(event) => updatePhaseDate(phase.id, "endDate", event.target.value)}
                            aria-label={`${phase.label} Enddatum`}
                          />
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
