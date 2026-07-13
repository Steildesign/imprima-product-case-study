import { Button } from "../components/Button";
import { criticalCommunicationEntries } from "../domain/communicationAssist";
import { communicationThreads } from "../domain/moduleData";
import type { Project } from "../domain/types";

interface CommunicationScreenProps {
  projects: Project[];
  onCreateProject: () => void;
  onOpenProject: (projectId: string) => void;
}

const entryStatusLabel = {
  offen: "Offen",
  wartet: "Wartet",
  geklaert: "Geklärt",
  umgesetzt: "Umgesetzt",
};

export function CommunicationScreen({ projects, onCreateProject, onOpenProject }: CommunicationScreenProps) {
  const projectMeta = new Map(projects.map((project) => [project.id, project]));

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Kommunikation</p>
          <h1>Klärungen dort halten, wo der Produktionsstand ist.</h1>
          <p className="muted">
            Entscheidende E-Mails, Auftragsänderungen und Freigaben als nachvollziehbare Kommunikationsakte.
          </p>
        </div>
        <Button onClick={onCreateProject}>Neues Projekt</Button>
      </header>

      <div className="communication-focus-grid">
        <article className="panel communication-brief">
          <p className="panel-label">Assist-Fokus</p>
          <h2>Wichtige Mails werden zu Entscheidungen.</h2>
          <p>
            Statt einzelne Nachrichten zu suchen, sammelt Imprima nur die Punkte, die Produktion, Frist oder Freigabe
            verändern. Der Assist nutzt diese Akte für Statusantworten und sachliche Rückmeldungen.
          </p>
        </article>
        <article className="panel communication-brief">
          <p className="panel-label">Heute relevant</p>
          <h2>{criticalCommunicationEntries.filter((entry) => entry.status === "offen" || entry.status === "wartet").length} offene Punkte</h2>
          <p>Offene Klärungen fließen in Projektstatus, Terminprüfung und Antwortentwürfe ein.</p>
        </article>
      </div>

      <div className="decision-mail-list">
        {criticalCommunicationEntries.map((entry) => (
          <article className="panel decision-mail-item" key={entry.id}>
            <div>
              <button
                type="button"
                className="panel-label communication-project-link"
                onClick={() => onOpenProject(entry.projectId)}
              >
                {projectMeta.get(entry.projectId)?.title ?? entry.projectId}
              </button>
              {projectMeta.get(entry.projectId) && (
                <p className="project-id-line">
                  ISBN {projectMeta.get(entry.projectId)?.isbn} · Titel-Nr. {projectMeta.get(entry.projectId)?.titleNumber}
                </p>
              )}
              <h2>{entry.subject}</h2>
              <p>{entry.summary}</p>
              <div className="decision-mail-impact">
                <span>Auswirkung</span>
                <strong>{entry.impact}</strong>
              </div>
            </div>
            <dl className="compact-meta">
              <div>
                <dt>Von</dt>
                <dd>{entry.from}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className={`communication-status communication-status-${entry.status}`}>
                    {entryStatusLabel[entry.status]}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Nächster Schritt</dt>
                <dd>{entry.nextStep}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="thread-list">
        {communicationThreads.map((thread) => (
          <article className="panel thread-item" key={thread.id}>
            <div>
              {projects.find((project) => project.title === thread.project) ? (
                <button
                  type="button"
                  className="panel-label communication-project-link"
                  onClick={() => {
                    const project = projects.find((candidate) => candidate.title === thread.project);
                    if (project) {
                      onOpenProject(project.id);
                    }
                  }}
                >
                  {thread.project}
                </button>
              ) : (
                <p className="panel-label">{thread.project}</p>
              )}
              <h2>{thread.title}</h2>
              <p>{thread.preview}</p>
            </div>
            <dl className="compact-meta">
              <div>
                <dt>Von</dt>
                <dd>{thread.from}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{thread.status}</dd>
              </div>
              <div>
                <dt>Zeit</dt>
                <dd>{thread.time}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
