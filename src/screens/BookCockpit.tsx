import { ProgressBar } from "../components/ProgressBar";
import { RiskDots } from "../components/RiskDots";
import { StatusBadge } from "../components/StatusBadge";
import { Tabs } from "../components/Tabs";
import { people } from "../domain/mockData";
import { getRiskVisual } from "../domain/statusVisuals";
import type { Project } from "../domain/types";
import { CorrectionFlow } from "./CorrectionFlow";
import { PreflightPanel } from "./PreflightPanel";
import { TimelineRisk } from "./TimelineRisk";

export type BookTab = "overview" | "corrections" | "preflight" | "risk";

interface BookCockpitProps {
  project: Project;
  activeTab: BookTab;
  onTabChange: (tab: BookTab) => void;
}

const tabs: Array<{ id: BookTab; label: string }> = [
  { id: "overview", label: "Übersicht" },
  { id: "corrections", label: "Korrekturen" },
  { id: "preflight", label: "Preflight" },
  { id: "risk", label: "Risiko" },
];

function getPersonName(personId: string) {
  return people.find((person) => person.id === personId)?.name ?? "Nicht zugewiesen";
}

export function BookCockpit({ project, activeTab, onTabChange }: BookCockpitProps) {
  const lead = people.find((person) => person.id === project.leadId);
  const team = people.filter((person) => project.team.includes(person.id));
  const risk = getRiskVisual(project.risk);

  return (
    <section className="screen">
      <header className="cockpit-header">
        <div>
          <p className="breadcrumb">Projekte &gt; {project.title}</p>
          <h1>{project.title}</h1>
          <p className="muted">
            {project.publisher} | ISBN {project.isbn} | {project.pages} Seiten | Projektleitung{" "}
            {lead?.name ?? "Nicht zugewiesen"}
          </p>
        </div>
        <StatusBadge status={project.status} />
      </header>

      <Tabs items={tabs} activeId={activeTab} onChange={onTabChange} />

      {activeTab === "overview" && (
        <div className="cockpit-grid">
          <article className="panel progress-panel">
            <p className="panel-label">Projektfortschritt</p>
            <strong className="large-number">{project.progress}%</strong>
            <ProgressBar value={project.progress} label={`${project.title} Gesamtfortschritt`} />
            <dl className="metric-list">
              <div>
                <dt>Phase</dt>
                <dd>{project.phase}</dd>
              </div>
              <div>
                <dt>Deadline</dt>
                <dd>{project.deadlineLabel}</dd>
              </div>
              <div>
                <dt>Risiko</dt>
                <dd>
                  <span className="risk-summary">
                    <RiskDots risk={project.risk} />
                    <span>{risk.label}</span>
                  </span>
                </dd>
              </div>
            </dl>
          </article>

          <article className="panel chapter-panel">
            <p className="panel-label">Kapitel</p>
            {project.chapters.length > 0 ? (
              <table className="chapter-table">
                <thead>
                  <tr>
                    <th>Kapitel</th>
                    <th>Seiten</th>
                    <th>Verantwortlich</th>
                    <th>Status</th>
                    <th>Runde</th>
                    <th>Risiko</th>
                  </tr>
                </thead>
                <tbody>
                  {project.chapters.map((chapter) => (
                    <tr key={chapter.id}>
                      <td>
                        <strong>{chapter.title}</strong>
                        {chapter.blocker && <small>{chapter.blocker}</small>}
                      </td>
                      <td>{chapter.pages}</td>
                      <td>{getPersonName(chapter.ownerId)}</td>
                      <td>
                        <StatusBadge status={chapter.status} />
                      </td>
                      <td>{chapter.correctionRound}</td>
                      <td>
                        <RiskDots risk={chapter.risk} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state compact">
                <strong>Noch keine Kapitel angelegt.</strong>
                <span>Kapitelstruktur wird nach Manuskripteingang erfasst.</span>
              </div>
            )}
          </article>

          <aside className="panel side-panel">
            <p className="panel-label">Zugewiesene</p>
            {team.length > 0 ? (
              team.map((person) => (
                <div className="person-row" key={person.id}>
                  <span className={`avatar avatar-${person.tone}`}>{person.initials}</span>
                  <span>
                    <strong>{person.name}</strong>
                    <small>{person.role}</small>
                  </span>
                </div>
              ))
            ) : (
              <p className="muted">Noch keine Teammitglieder zugewiesen.</p>
            )}

            {project.blocker && (
              <div className="blocker-box">
                <strong>Blocker</strong>
                <span>{project.blocker}</span>
              </div>
            )}
          </aside>
        </div>
      )}

      {activeTab === "corrections" && <CorrectionFlow project={project} />}
      {activeTab === "preflight" && <PreflightPanel project={project} />}
      {activeTab === "risk" && <TimelineRisk projects={[project]} />}
    </section>
  );
}
