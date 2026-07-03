import { ProfileBadge } from "../components/ProfileBadge";
import { getCompositionProfileCounts } from "../domain/compositionProfiles";
import { reportHighlights } from "../domain/moduleData";
import type { Project } from "../domain/types";
import { TimelineRisk } from "./TimelineRisk";

interface ReportsScreenProps {
  projects: Project[];
}

export function ReportsScreen({ projects }: ReportsScreenProps) {
  const profileCounts = getCompositionProfileCounts(projects);

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

      <article className="panel profile-report">
        <div>
          <p className="panel-label">Aufwandsmix</p>
          <h2>Satzprofile der laufenden Titel</h2>
        </div>
        <div className="profile-report-grid">
          {profileCounts.map(({ profile, count }) => (
            <div className="profile-report-item" key={profile.id}>
              <ProfileBadge profileId={profile.id} />
              <strong>{count}</strong>
              <span>{profile.effortLabel}</span>
            </div>
          ))}
        </div>
      </article>

      <TimelineRisk projects={projects} />
    </section>
  );
}
