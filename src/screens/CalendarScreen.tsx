import { calendarEvents } from "../domain/moduleData";

export function CalendarScreen() {
  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Kalender</p>
          <h1>Termine, die den Produktionsfluss bestimmen.</h1>
          <p className="muted">Nächste Korrektur-, Preflight- und Druckfreigabe-Fenster.</p>
        </div>
      </header>

      <div className="calendar-stack">
        {calendarEvents.map((event) => (
          <article className="panel calendar-event" key={event.id}>
            <time>
              <span>{event.weekday}</span>
              <strong>{event.date}</strong>
            </time>
            <div>
              <p className="panel-label">{event.type}</p>
              <h2>{event.title}</h2>
              <p>{event.project}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
