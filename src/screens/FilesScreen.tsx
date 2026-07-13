import { Button } from "../components/Button";
import { fileAssets } from "../domain/moduleData";
import type { Project } from "../domain/types";

interface FilesScreenProps {
  projects: Project[];
  onCreateProject: () => void;
  onOpenProject: (projectId: string) => void;
}

export function FilesScreen({ projects, onCreateProject, onOpenProject }: FilesScreenProps) {
  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Dateien</p>
          <h1>Produktionsstände ohne Sucharbeit.</h1>
          <p className="muted">Aktuelle Manuskripte, Satzdateien, Markups und Druck-PDFs in einer Ansicht.</p>
        </div>
        <Button onClick={onCreateProject}>Neues Projekt</Button>
      </header>

      <div className="data-card">
        <table className="module-table">
          <thead>
            <tr>
              <th>Datei</th>
              <th>Projekt</th>
              <th>Typ</th>
              <th>Version</th>
              <th>Stand</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fileAssets.map((file) => (
              <tr key={file.id}>
                <td>
                  {projects.find((project) => project.title === file.project) ? (
                    <button
                      type="button"
                      className="table-link file-project-link"
                      onClick={() => {
                        const project = projects.find((candidate) => candidate.title === file.project);
                        if (project) {
                          onOpenProject(project.id);
                        }
                      }}
                    >
                      {file.name}
                    </button>
                  ) : (
                    <strong>{file.name}</strong>
                  )}
                </td>
                <td>{file.project}</td>
                <td>{file.type}</td>
                <td>{file.version}</td>
                <td>{file.updated}</td>
                <td>{file.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
