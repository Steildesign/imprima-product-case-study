import { ProductionTimeline } from "../components/ProductionTimeline";
import { capacityWindows, vacationWindows } from "../domain/productionPlanning";
import { getProjectRiskCounts } from "../domain/selectors";
import type { Project } from "../domain/types";

interface TimelineRiskProps {
  projects: Project[];
}

export function TimelineRisk({ projects }: TimelineRiskProps) {
  const counts = getProjectRiskCounts(projects);
  const criticalCapacity = capacityWindows.filter((window) => window.level === "kritisch" || window.level === "eng");
  const goodVacationWindows = vacationWindows.filter((window) => window.quality === "gut");

  return (
    <div className="timeline-layout">
      <article className="panel timeline-panel">
        <div className="timeline-panel-header">
          <div>
            <p className="panel-label">Produktionsplanung & Risiko</p>
            <h2>Langzeit-Timeline mit Kapazitätskontext</h2>
          </div>
          <span>{projects.length} Titel</span>
        </div>
        {projects.length > 0 ? (
          <ProductionTimeline projects={projects} compact />
        ) : (
          <div className="empty-state compact">
            <strong>Keine Timeline-Daten.</strong>
            <span>Es wurden noch keine Projekte ausgewählt.</span>
          </div>
        )}
      </article>

      <aside className="panel risk-summary">
        <p className="panel-label">Planungsrisiko</p>
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
        <div className="planning-side-note">
          <strong>{criticalCapacity.length} enge Monate</strong>
          <span>{goodVacationWindows.length} gute Urlaubsfenster im Plan sichtbar.</span>
        </div>
      </aside>
    </div>
  );
}
