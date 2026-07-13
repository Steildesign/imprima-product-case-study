import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { BudgetSignalBadge } from "../components/BudgetSignalBadge";
import { Button } from "../components/Button";
import { InsightBars, InsightDonut } from "../components/InsightCharts";
import { ProgressBar } from "../components/ProgressBar";
import { getTaskChartData } from "../domain/chartVisuals";
import { criticalCommunicationEntries } from "../domain/communicationAssist";
import { getProjectBudgetModel } from "../domain/budgeting";
import type { TaskItem } from "../domain/moduleData";
import { getTaskCommandCenter, type TaskCommandTone } from "../domain/taskCommandCenter";
import type { Project } from "../domain/types";

const detailStatusLabel: Record<TaskItem["detailStatus"], string> = {
  offen: "Offen",
  wartet: "Wartet",
  "in-arbeit": "In Arbeit",
  erledigt: "Erledigt",
};

const priorityLabel: Record<TaskItem["priority"], string> = {
  hoch: "Hoch",
  mittel: "Mittel",
  niedrig: "Niedrig",
};

const toneLabel: Record<TaskCommandTone, string> = {
  green: "Stabil",
  blue: "Beobachten",
  orange: "Prüfen",
  red: "Kritisch",
};

interface TasksScreenProps {
  projects: Project[];
  tasks: TaskItem[];
  onCreateProject: () => void;
  onOpenProject: (projectId: string) => void;
  onUpdateTask: (taskId: string, patch: Partial<TaskItem>) => void;
}

function getPressureWidth(score: number) {
  return `${Math.min(100, Math.max(8, score * 7))}%`;
}

export function TasksScreen({ projects, tasks, onCreateProject, onOpenProject, onUpdateTask }: TasksScreenProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const taskCharts = getTaskChartData(tasks);
  const commandCenter = useMemo(
    () => getTaskCommandCenter(tasks, projects, criticalCommunicationEntries),
    [projects, tasks],
  );
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);
  const projectsById = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);
  const selectedProject = selectedTask ? projectsById.get(selectedTask.projectId) : undefined;
  const selectedCommunication = useMemo(
    () =>
      selectedTask
        ? criticalCommunicationEntries.find((entry) => entry.id === selectedTask.relatedCommunicationId)
        : undefined,
    [selectedTask],
  );

  useEffect(() => {
    if (!selectedTask) {
      return;
    }

    drawerRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedTaskId(undefined);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedTask]);

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Aufgaben</p>
          <h1>Was heute Produktion blockieren kann.</h1>
          <p className="muted">Priorisierte Arbeitspunkte aus Satz, Korrektur und Freigabe.</p>
        </div>
        <Button onClick={onCreateProject}>Neues Projekt</Button>
      </header>

      <section className="task-command-kpis" aria-label="Aufgaben-Kennzahlen">
        {commandCenter.kpis.map((kpi) => (
          <article className={`task-kpi task-tone-${kpi.tone}`} key={kpi.id}>
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
            <small>{kpi.detail}</small>
          </article>
        ))}
      </section>

      <section className="task-command-layout">
        <article className="panel task-timeline-panel">
          <div className="task-panel-header">
            <div>
              <p className="panel-label">Zeitfenster</p>
              <h2>Was zuerst durch muss</h2>
            </div>
            <span>{tasks.length} Aufgaben</span>
          </div>
          <div className="task-timeline-buckets">
            {commandCenter.timeline.map((bucket) => (
              <div className="task-window" key={bucket.id}>
                <div>
                  <strong>{bucket.label}</strong>
                  <span>{bucket.taskCount} Aufgaben</span>
                </div>
                <div className="task-window-rail" aria-hidden="true">
                  <i
                    className="task-window-high"
                    style={{ "--task-window-width": `${bucket.taskCount === 0 ? 0 : (bucket.highPriorityCount / bucket.taskCount) * 100}%` } as CSSProperties}
                  />
                  <i
                    className="task-window-waiting"
                    style={{ "--task-window-width": `${bucket.taskCount === 0 ? 0 : (bucket.waitingCount / bucket.taskCount) * 100}%` } as CSSProperties}
                  />
                  <i
                    className="task-window-done"
                    style={{ "--task-window-width": `${bucket.taskCount === 0 ? 0 : (bucket.completedCount / bucket.taskCount) * 100}%` } as CSSProperties}
                  />
                </div>
                <dl>
                  <div>
                    <dt>Hoch</dt>
                    <dd>{bucket.highPriorityCount}</dd>
                  </div>
                  <div>
                    <dt>Wartet</dt>
                    <dd>{bucket.waitingCount}</dd>
                  </div>
                  <div>
                    <dt>Erledigt</dt>
                    <dd>{bucket.completedCount}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </article>

        <article className="panel task-pressure-panel">
          <div className="task-panel-header">
            <div>
              <p className="panel-label">Projektlast</p>
              <h2>Wo Aufgaben wirklich drücken</h2>
            </div>
            <span>{commandCenter.projectFocus.length} Titel</span>
          </div>
          <div className="task-pressure-columns" aria-label="Spalten der Projektlast">
            <span>Projekt</span>
            <span>Aufgabendruck</span>
            <span>Nächster Engpass</span>
            <span>Auftragsrahmen</span>
          </div>
          <div className="task-pressure-list">
            {commandCenter.projectFocus.map((row) => {
              const project = projectsById.get(row.projectId);
              const budget = project ? getProjectBudgetModel(project) : undefined;

              return (
                <div className={`task-pressure-row task-tone-${row.tone}`} key={row.projectId}>
                  <div>
                    <strong>{row.title}</strong>
                    <span>
                      ISBN {row.isbn} · {row.taskCount} Aufgaben · {row.openCommunicationCount} Klärungen
                    </span>
                  </div>
                  <div className="task-pressure-meter" aria-label={`${row.title} Druckwert ${row.pressureScore}`}>
                    <i style={{ "--task-pressure-width": getPressureWidth(row.pressureScore) } as CSSProperties} />
                  </div>
                  <small>{row.leadingTaskTitle}</small>
                  {budget && <BudgetSignalBadge budget={budget} compact />}
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="module-insight-grid task-insight-grid">
        <div className="panel insight-panel">
          <InsightDonut data={taskCharts.pressure} caption="Wie viel sofortige Aufmerksamkeit die heutige Arbeit bindet." />
          <InsightBars title="Priorität" segments={taskCharts.pressure.segments} />
        </div>
        <div className="panel insight-panel">
          <InsightDonut data={taskCharts.status} caption="Welche Aufgaben gerade aktiv laufen, warten oder schon geschlossen sind." />
          <InsightBars title="Bearbeitung" segments={taskCharts.status.segments} />
        </div>
      </section>

      <section className="task-operations-grid">
        <article className="panel task-owner-panel">
          <div className="task-panel-header">
            <div>
              <p className="panel-label">Teamlast</p>
              <h2>Wer gerade Klärung trägt</h2>
            </div>
          </div>
          <div className="task-owner-list">
            {commandCenter.ownerLoad.map((owner) => (
              <div className="task-owner-row" key={owner.owner}>
                <div>
                  <strong>{owner.owner}</strong>
                  <span>
                    {owner.highPriorityCount} hoch · {owner.waitingCount} wartet · {owner.activeCount} aktiv
                  </span>
                </div>
                <b>{owner.taskCount}</b>
              </div>
            ))}
          </div>
        </article>

        <article className="panel task-attention-panel">
          <div className="task-panel-header">
            <div>
              <p className="panel-label">Hinweise</p>
              <h2>Was den Ablauf kippen kann</h2>
            </div>
            <span>{commandCenter.attentionItems.length} Punkte</span>
          </div>
          <div className="task-attention-list">
            {commandCenter.attentionItems.slice(0, 5).map((item) => (
              <button
                type="button"
                className={`task-attention-item task-tone-${item.tone}`}
                key={item.taskId}
                onClick={() => setSelectedTaskId(item.taskId)}
              >
                <span>{toneLabel[item.tone]}</span>
                <strong>{item.title}</strong>
                <small>
                  {item.project} · {item.due} · Mail: {item.linkedCommunicationStatus}
                </small>
                <p>{item.nextStep}</p>
              </button>
            ))}
          </div>
        </article>
      </section>

      <div className="task-board-header">
        <div>
          <p className="panel-label">Aufgabenboard</p>
          <h2>Konkrete Arbeitspunkte</h2>
        </div>
        <span>Nach Fälligkeit, Druck und Klärungsbedarf sortiert.</span>
      </div>

      <div className="module-list">
        {tasks.map((task) => {
          const taskProject = projectsById.get(task.projectId);
          const taskBudget = taskProject ? getProjectBudgetModel(taskProject) : undefined;

          return (
            <button
              type="button"
              className={`panel task-item priority-${task.priority}${selectedTaskId === task.id ? " is-selected" : ""}`}
              key={task.id}
              aria-label={`${task.title} öffnen`}
              onClick={() => setSelectedTaskId(task.id)}
            >
              <div>
                <p className="panel-label">{task.status}</p>
                <h2>{task.title}</h2>
                <p>
                  {task.project} · {task.chapter}
                </p>
                {taskProject && (
                  <span className="project-id-line">
                    ISBN {taskProject.isbn} · Titel-Nr. {taskProject.titleNumber}
                  </span>
                )}
              </div>
              <dl className="compact-meta">
                <div>
                  <dt>Priorität</dt>
                  <dd>{priorityLabel[task.priority]}</dd>
                </div>
                <div>
                  <dt>Verantwortlich</dt>
                  <dd>{task.owner}</dd>
                </div>
                <div>
                  <dt>Fällig</dt>
                  <dd>{task.due}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{detailStatusLabel[task.detailStatus]}</dd>
                </div>
              </dl>
              {taskProject && (
                <div className="task-item-progress">
                  <ProgressBar value={taskProject.progress} label={`${task.project} Projektfortschritt`} />
                </div>
              )}
              {taskBudget && (
                <div className="task-item-budget">
                  <span>Auftragsrahmen</span>
                  <BudgetSignalBadge budget={taskBudget} compact />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedTask && (
        <aside className="task-detail-drawer" aria-label="Aufgabendetails" role="dialog" aria-modal="true">
          <div className="task-detail-panel" ref={drawerRef} tabIndex={-1}>
            <header className="task-detail-header">
              <div>
                <p className="panel-label">Aufgabendetail</p>
                <h2>{selectedTask.title}</h2>
              </div>
              <button
                type="button"
                className="assist-close"
                aria-label="Aufgabendetail schließen"
                onClick={() => setSelectedTaskId(undefined)}
              >
                x
              </button>
            </header>

            <div className="task-detail-status">
              <span className={`task-state task-state-${selectedTask.detailStatus}`}>
                {detailStatusLabel[selectedTask.detailStatus]}
              </span>
              <span className={`task-priority task-priority-${selectedTask.priority}`}>{selectedTask.priority}</span>
            </div>

            <label className="task-status-editor">
              <span>Bearbeitungsstatus</span>
              <select
                name="task-status"
                value={selectedTask.detailStatus}
                onChange={(event) => onUpdateTask(selectedTask.id, { detailStatus: event.target.value as TaskItem["detailStatus"] })}
              >
                {Object.entries(detailStatusLabel).map(([value, label]) => (
                  <option value={value} key={value}>{label}</option>
                ))}
              </select>
            </label>

            <dl className="task-detail-meta">
              <div>
                <dt>Projekt</dt>
                <dd>
                  {selectedTask.project}
                  {selectedProject && (
                    <span className="project-id-line">
                      ISBN {selectedProject.isbn} · Titel-Nr. {selectedProject.titleNumber}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt>Bereich</dt>
                <dd>
                  {selectedTask.chapter}, {selectedTask.pageRange}
                </dd>
              </div>
              <div>
                <dt>Phase</dt>
                <dd>{selectedTask.productionPhase}</dd>
              </div>
              <div>
                <dt>Fällig</dt>
                <dd>{selectedTask.due}</dd>
              </div>
            </dl>

            {selectedProject && (
              <Button variant="secondary" onClick={() => onOpenProject(selectedProject.id)}>
                Projektcockpit öffnen
              </Button>
            )}

            {selectedTask.detailStatus !== "erledigt" && (
              <Button onClick={() => onUpdateTask(selectedTask.id, { detailStatus: "erledigt" })}>
                Als erledigt markieren
              </Button>
            )}

            <article className="task-detail-section">
              <span>Warum wichtig</span>
              <p>{selectedTask.reason}</p>
            </article>

            <article className="task-detail-section">
              <span>Auswirkung</span>
              <p>{selectedTask.impact}</p>
            </article>

            <article className="task-detail-next">
              <span>Nächster Schritt</span>
              <strong>{selectedTask.nextStep}</strong>
            </article>

            <div className="task-checklist">
              <p className="panel-label">Checkliste</p>
              <ul>
                {selectedTask.checkpoints.map((checkpoint) => (
                  <li key={checkpoint}>{checkpoint}</li>
                ))}
              </ul>
            </div>

            {selectedCommunication && (
              <article className="task-linked-communication">
                <p className="panel-label">Verknüpfte Klärung</p>
                <h3>{selectedCommunication.subject}</h3>
                <p>{selectedCommunication.summary}</p>
                <small>
                  {selectedCommunication.from} - {selectedCommunication.date}
                </small>
              </article>
            )}
          </div>
        </aside>
      )}
    </section>
  );
}
