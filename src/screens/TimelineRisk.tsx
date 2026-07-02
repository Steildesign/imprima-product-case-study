import { RiskDots } from "../components/RiskDots";
import { StatusBadge } from "../components/StatusBadge";
import { getProjectRiskCounts } from "../domain/selectors";
import type { Project } from "../domain/types";

interface TimelineRiskProps {
  projects: Project[];
}

export function TimelineRisk({ projects }: TimelineRiskProps) {
  const counts = getProjectRiskCounts(projects);

  return (
    <div className="timeline-layout">
      <article className="panel timeline-panel">
        <p className="panel-label">Produktions-Timeline & Risiko</p>
        {projects.length > 0 ? (
          <div className="timeline-grid">
            {projects.map((project) => (
              <div className="timeline-row" key={project.id}>
                <div>
                  <strong>{project.title}</strong>
                  <StatusBadge status={project.status} />
                </div>
                <div className="timeline-track">
                  {project.timeline.length > 0 ? (
                    project.timeline.map((phase) => (
                      <span
                        key={`${project.id}-${phase.label}`}
                        className={`timeline-bar timeline-${phase.status}`}
                        style={{
                          gridColumn: `${Math.max(1, phase.startWeek - 18)} / ${Math.max(2, phase.endWeek - 18)}`,
                        }}
                      >
                        {phase.label}
                      </span>
                    ))
                  ) : (
                    <span className="timeline-empty">Keine Phasen geplant</span>
                  )}
                </div>
                <RiskDots risk={project.risk} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state compact">
            <strong>Keine Timeline-Daten.</strong>
            <span>Es wurden noch keine Projekte ausgewaehlt.</span>
          </div>
        )}
      </article>

      <aside className="panel risk-summary">
        <p className="panel-label">Risikoueberblick</p>
        <dl>
          <div>
            <dt>Hoch</dt>
            <dd>{counts.hoch}</dd>
          </div>
          <div>
            <dt>Mittel</dt>
            <dd>{counts.mittel}</dd>
          </div>
          <div>
            <dt>Niedrig</dt>
            <dd>{counts.niedrig}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
