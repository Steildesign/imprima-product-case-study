import { useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";
import { BudgetSignalBadge } from "../components/BudgetSignalBadge";
import { Button } from "../components/Button";
import { ProfileBadge } from "../components/ProfileBadge";
import {
  ProfileWorkloadBars,
  ProfileWorkloadComparison,
  ProfileWorkloadHeading,
  WorkloadStateBadge,
} from "../components/ProfileWorkloadBars";
import { ProgressBar } from "../components/ProgressBar";
import { RiskDots } from "../components/RiskDots";
import { StatusBadge } from "../components/StatusBadge";
import { getBudgetOverview, getProjectBudgetModel } from "../domain/budgeting";
import { getProfileWorkloadTotals, getProjectProfileWorkloadSummary } from "../domain/profileWorkload";
import { getProjectPlanningMeta, getProjectPlanningWindow, planningInsights } from "../domain/productionPlanning";
import { getVisibleProjects } from "../domain/selectors";
import type { Project, ProjectFilters, RiskLevel } from "../domain/types";

interface ProjectOverviewProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
}

const riskOptions: Array<RiskLevel | "alle"> = ["alle", "hoch", "mittel", "niedrig"];

function getPlanningChipStyle(color: string, accent: string) {
  return { "--project-color": color, "--project-accent": accent } as CSSProperties;
}

export function ProjectOverview({ projects, onSelectProject, onCreateProject }: ProjectOverviewProps) {
  const [filters, setFilters] = useState<ProjectFilters>({ query: "", risk: "alle", status: "alle" });
  const visibleProjects = useMemo(() => getVisibleProjects(projects, filters), [filters, projects]);
  const workloadTotals = useMemo(() => getProfileWorkloadTotals(visibleProjects), [visibleProjects]);
  const plannedPages = workloadTotals.reduce((sum, row) => sum + row.plannedPages, 0);
  const actualPages = workloadTotals.reduce((sum, row) => sum + row.actualPages, 0);
  const remainingPages = workloadTotals.reduce((sum, row) => sum + row.remainingPages, 0);
  const overPlanPages = workloadTotals.reduce((sum, row) => sum + Math.max(0, row.deltaPages), 0);
  const budgetOverview = useMemo(() => getBudgetOverview(visibleProjects), [visibleProjects]);

  const handleProjectRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, projectId: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectProject(projectId);
    }
  };

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Projektübersicht</p>
          <h1>Projekte</h1>
          <p className="muted">Alle laufenden Titel, Deadlines und Engpässe in einer Produktionssicht.</p>
        </div>
        <Button onClick={onCreateProject}>
          Neues Projekt
        </Button>
      </header>

      <div className="toolbar">
        <label className="search-field">
          <span className="sr-only">Suche</span>
          <input
            type="search"
            name="project-search"
            autoComplete="off"
            value={filters.query}
            onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
            placeholder="Suche nach Titel, Verlag, ISBN, Titelnummer…"
          />
        </label>

        <div className="chip-group" role="group" aria-label="Risiko filtern">
          {riskOptions.map((risk) => (
            <button
              key={risk}
              type="button"
              className={`filter-chip${filters.risk === risk ? " is-active" : ""}`}
              aria-pressed={filters.risk === risk}
              onClick={() => setFilters((current) => ({ ...current, risk }))}
            >
              {risk === "alle" ? "Alle" : risk}
            </button>
          ))}
        </div>
      </div>

      <article className="panel overview-workload">
        <div className="overview-workload-head">
          <ProfileWorkloadHeading />
          <dl className="overview-workload-metrics">
            <div>
              <dt>Plan</dt>
              <dd>{plannedPages}</dd>
            </div>
            <div>
              <dt>Ist</dt>
              <dd>{actualPages}</dd>
            </div>
            <div>
              <dt>Offen</dt>
              <dd>{remainingPages}</dd>
            </div>
            <div>
              <dt>Über Plan</dt>
              <dd>+{overPlanPages}</dd>
            </div>
            <div>
              <dt>Budget prüfen</dt>
              <dd>{budgetOverview.attentionCount}</dd>
            </div>
          </dl>
        </div>
        <ProfileWorkloadComparison rows={workloadTotals} />
        <div className="overview-budget-signals" aria-label="Budgetsignale">
          <span>
            <strong>{budgetOverview.counts.puffer}</strong>
            Puffer
          </span>
          <span>
            <strong>{budgetOverview.counts["im-rahmen"]}</strong>
            Im Rahmen
          </span>
          <span>
            <strong>{budgetOverview.counts.beobachten}</strong>
            Beobachten
          </span>
          <span>
            <strong>{budgetOverview.counts["nachtrag-pruefen"]}</strong>
            Nachtrag prüfen
          </span>
        </div>
      </article>

      <article className="panel overview-planning">
        <div>
          <p className="panel-label">Produktionsplanung</p>
          <h2>Timeline, Kapazität und Urlaubsfenster</h2>
        </div>
        <div className="overview-planning-list">
          {planningInsights.map((insight) => (
            <span key={insight.id}>
              <strong>{insight.value}</strong>
              {insight.detail}
            </span>
          ))}
        </div>
      </article>

      <div className="data-card">
        <table className="project-table">
          <thead>
            <tr>
              <th>Titel</th>
              <th>Verlag</th>
              <th>Seiten</th>
              <th>Satzmix</th>
              <th>Planung</th>
              <th>Budget</th>
              <th>Deadline</th>
              <th>Fortschritt</th>
              <th>Status</th>
              <th>Risiko</th>
            </tr>
          </thead>
          <tbody>
            {visibleProjects.map((project) => {
              const workload = getProjectProfileWorkloadSummary(project);
              const planningMeta = getProjectPlanningMeta(project.id);
              const planningWindow = getProjectPlanningWindow(project.id);
              const budget = getProjectBudgetModel(project);
              const highestStateLabel =
                workload.rows.find((row) => row.state === workload.highestState)?.stateLabel ?? "Im Plan";

              return (
                <tr
                  key={project.id}
                  className="project-row"
                  role="button"
                  tabIndex={0}
                  aria-label={`${project.title} öffnen`}
                  onClick={() => onSelectProject(project.id)}
                  onKeyDown={(event) => handleProjectRowKeyDown(event, project.id)}
                >
                  <td>
                    <span className="project-title-cell">
                      <span className="table-link" aria-hidden="true">
                        {project.title}
                      </span>
                      <span className="project-id-line">ISBN {project.isbn}</span>
                    </span>
                  </td>
                  <td>
                    <span className="project-publisher-cell">
                      <span>{project.publisher}</span>
                      <span className="project-id-line">Titel-Nr. {project.titleNumber}</span>
                    </span>
                  </td>
                  <td>{project.pages}</td>
                  <td>
                    <div className="table-workload">
                      <div className="table-workload-head">
                        <ProfileBadge profileId={workload.dominantProfile.profile.id} />
                        <WorkloadStateBadge state={workload.highestState} label={highestStateLabel} />
                      </div>
                      <ProfileWorkloadBars rows={workload.rows} />
                      <small>
                        {workload.actualPages} Ist / {workload.plannedPages} Plan · {workload.remainingPages} offen
                      </small>
                    </div>
                  </td>
                  <td>
                    <span
                      className="table-planning-chip"
                      style={getPlanningChipStyle(planningMeta.color, planningMeta.accent)}
                    >
                      <strong>{planningMeta.code}</strong>
                      {planningWindow?.shortLabel ?? "Offen"}
                    </span>
                  </td>
                  <td>
                    <BudgetSignalBadge budget={budget} compact />
                  </td>
                  <td>{project.deadlineLabel}</td>
                  <td>
                    <ProgressBar value={project.progress} label={`${project.title} Fortschritt`} />
                  </td>
                  <td>
                    <StatusBadge status={project.status} />
                  </td>
                  <td>
                    <RiskDots risk={project.risk} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {visibleProjects.length === 0 && (
          <div className="empty-state">
            <strong>Keine Projekte gefunden.</strong>
            <span>Suche oder Risikofilter anpassen.</span>
          </div>
        )}

        <footer className="table-footer">
          {visibleProjects.length} von {projects.length} Projekten sichtbar
        </footer>
      </div>
    </section>
  );
}
