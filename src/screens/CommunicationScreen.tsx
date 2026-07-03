import { communicationThreads } from "../domain/moduleData";

export function CommunicationScreen() {
  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Kommunikation</p>
          <h1>Rückfragen dort halten, wo der Produktionsstand ist.</h1>
          <p className="muted">Offene Kommentare, Übergaben und wartende Antworten nach Projekt sortiert.</p>
        </div>
      </header>

      <div className="thread-list">
        {communicationThreads.map((thread) => (
          <article className="panel thread-item" key={thread.id}>
            <div>
              <p className="panel-label">{thread.project}</p>
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
