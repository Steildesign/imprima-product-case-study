import { useMemo, useState } from "react";
import { Button } from "../components/Button";
import { ProgressBar } from "../components/ProgressBar";
import { RiskDots } from "../components/RiskDots";
import { StatusBadge } from "../components/StatusBadge";
import { getVisibleProjects } from "../domain/selectors";
import type { Project, ProjectFilters, RiskLevel } from "../domain/types";

interface ProjectOverviewProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

const riskOptions: Array<RiskLevel | "alle"> = ["alle", "hoch", "mittel", "niedrig"];

export function ProjectOverview({ projects, onSelectProject }: ProjectOverviewProps) {
  const [filters, setFilters] = useState<ProjectFilters>({ query: "", risk: "alle", status: "alle" });
  const visibleProjects = useMemo(() => getVisibleProjects(projects, filters), [filters, projects]);

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Projektuebersicht</p>
          <h1>Projekte</h1>
          <p className="muted">Alle laufenden Titel, Deadlines und Engpaesse in einer Produktionssicht.</p>
        </div>
        <Button disabled title="Im Prototyp nicht umgesetzt">
          Neues Projekt
        </Button>
      </header>

      <div className="toolbar">
        <label className="search-field">
          <span className="sr-only">Suche</span>
          <input
            value={filters.query}
            onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
            placeholder="Suche nach Titel, Verlag, ISBN..."
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

      <div className="data-card">
        <table className="project-table">
          <thead>
            <tr>
              <th>Titel</th>
              <th>Verlag</th>
              <th>Seiten</th>
              <th>Deadline</th>
              <th>Fortschritt</th>
              <th>Status</th>
              <th>Risiko</th>
            </tr>
          </thead>
          <tbody>
            {visibleProjects.map((project) => (
              <tr key={project.id}>
                <td>
                  <button
                    type="button"
                    className="table-link"
                    aria-label={`${project.title} oeffnen`}
                    onClick={() => onSelectProject(project.id)}
                  >
                    {project.title}
                  </button>
                </td>
                <td>{project.publisher}</td>
                <td>{project.pages}</td>
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
            ))}
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
