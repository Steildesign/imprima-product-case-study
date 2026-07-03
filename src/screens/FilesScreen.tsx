import { fileAssets } from "../domain/moduleData";

export function FilesScreen() {
  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Dateien</p>
          <h1>Produktionsstände ohne Sucharbeit.</h1>
          <p className="muted">Aktuelle Manuskripte, Satzdateien, Markups und Druck-PDFs in einer Ansicht.</p>
        </div>
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
                  <strong>{file.name}</strong>
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
