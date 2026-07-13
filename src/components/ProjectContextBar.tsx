import type { Project } from "../domain/types";
import { Button } from "./Button";

export function ProjectContextBar({
  projects,
  projectId,
  onChange,
  onOpen,
}: {
  projects: Project[];
  projectId: string;
  onChange: (projectId: string) => void;
  onOpen: () => void;
}) {
  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  if (!project) {
    return null;
  }

  return (
    <section className="project-context-bar" aria-label="Aktiver Projektkontext">
      <div>
        <span>Aktiver Titel</span>
        <strong>{project.title}</strong>
        <small>ISBN {project.isbn} · Titel-Nr. {project.titleNumber}</small>
      </div>
      <label>
        <span className="sr-only">Aktives Projekt wechseln</span>
        <select name="active-project" value={project.id} onChange={(event) => onChange(event.target.value)}>
          {projects.map((item) => (
            <option value={item.id} key={item.id}>{item.title}</option>
          ))}
        </select>
      </label>
      <Button variant="secondary" onClick={onOpen}>Projekt öffnen</Button>
    </section>
  );
}
