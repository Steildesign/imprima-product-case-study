import { taskItems } from "../domain/moduleData";

export function TasksScreen() {
  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Aufgaben</p>
          <h1>Was heute Produktion blockieren kann.</h1>
          <p className="muted">Priorisierte Arbeitspunkte aus Satz, Korrektur und Freigabe.</p>
        </div>
      </header>

      <div className="module-list">
        {taskItems.map((task) => (
          <article className={`panel task-item priority-${task.priority}`} key={task.id}>
            <div>
              <p className="panel-label">{task.status}</p>
              <h2>{task.title}</h2>
              <p>{task.project}</p>
            </div>
            <dl className="compact-meta">
              <div>
                <dt>Verantwortlich</dt>
                <dd>{task.owner}</dd>
              </div>
              <div>
                <dt>Fällig</dt>
                <dd>{task.due}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
