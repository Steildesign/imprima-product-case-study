import { useState } from "react";
import { Button } from "../components/Button";
import { summarizePreflight } from "../domain/selectors";
import type { Project } from "../domain/types";

interface PreflightPanelProps {
  project: Project;
}

function getCheckLabel(state: string) {
  if (state === "passed") {
    return "Erfuellt";
  }
  if (state === "warning") {
    return "Hinweis";
  }
  return "Fehler";
}

export function PreflightPanel({ project }: PreflightPanelProps) {
  const [approved, setApproved] = useState(false);
  const summary = summarizePreflight(project.preflight);
  const hasWarnings = summary.warning > 0 || summary.failed > 0;

  if (project.preflight.length === 0) {
    return (
      <div className="empty-state preflight-empty">
        <strong>Keine Preflight-Pruefungen vorhanden.</strong>
        <span>Der finale PDF-Check wurde fuer diesen Titel noch nicht angelegt.</span>
      </div>
    );
  }

  return (
    <div className="preflight-grid">
      <article className="panel preflight-list">
        <p className="panel-label">Preflight</p>
        <table className="check-table">
          <thead>
            <tr>
              <th>Pruefpunkt</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {project.preflight.map((check) => (
              <tr key={check.id}>
                <td>{check.label}</td>
                <td>
                  <span className={`check-state check-${check.state}`}>{getCheckLabel(check.state)}</span>
                </td>
                <td>{check.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <aside className="panel result-panel">
        <div className={`result-icon${hasWarnings ? " result-warning" : ""}`}>{hasWarnings ? "!" : "OK"}</div>
        <h2>{hasWarnings ? "Pruefung mit Hinweisen" : "Pruefung erfolgreich"}</h2>
        <p>
          {summary.passed} von {summary.total} Pruefpunkten erfuellt. {summary.warning} Hinweise und {summary.failed} Fehler offen.
        </p>
        <Button onClick={() => setApproved((current) => !current)}>
          {approved ? "Druckfreigabe zuruecknehmen" : "Druckfreigabe erteilen"}
        </Button>
        <Button variant="secondary">Bericht herunterladen</Button>
        {approved && <p className="approval-note">Druckfreigabe im Prototyp erteilt. Erneut klicken zum Zuruecknehmen.</p>}
      </aside>
    </div>
  );
}
