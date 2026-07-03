import { reportHighlights } from "../domain/moduleData";
import type { Project } from "../domain/types";
import { TimelineRisk } from "./TimelineRisk";

interface ReportsScreenProps {
  projects: Project[];
}

export function ReportsScreen({ projects }: ReportsScreenProps) {
  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Berichte</p>
          <h1>Wochenstatus für Herstellung und Redaktion.</h1>
          <p className="muted">Kompakte KPIs, Risiken und Timeline-Sicht für die laufende Produktionswoche.</p>
        </div>
      </header>

      <div className="report-grid">
        {reportHighlights.map((report) => (
          <article className={`panel report-card report-${report.tone}`} key={report.id}>
            <p className="panel-label">{report.label}</p>
            <strong>{report.value}</strong>
            <p>{report.detail}</p>
          </article>
        ))}
      </div>

      <TimelineRisk projects={projects} />
    </section>
  );
}
