import { useState } from "react";
import { Button } from "../components/Button";
import { summarizePreflight } from "../domain/selectors";
import type { PreflightState, Project } from "../domain/types";

interface PreflightPanelProps {
  project: Project;
}

const checkLabels: Record<PreflightState, string> = {
  passed: "Erfüllt",
  warning: "Hinweis",
  failed: "Fehler",
};

function getCheckLabel(state: PreflightState) {
  return checkLabels[state];
}

export function PreflightPanel({ project }: PreflightPanelProps) {
  const [approved, setApproved] = useState(false);
  const summary = summarizePreflight(project.preflight);
  const hasWarnings = summary.warning > 0 || summary.failed > 0;

  if (project.preflight.length === 0) {
    return (
      <div className="empty-state preflight-empty">
        <strong>Keine Preflight-Prüfungen vorhanden.</strong>
        <span>Der finale PDF-Check wurde für diesen Titel noch nicht angelegt.</span>
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
              <th>Prüfpunkt</th>
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
        <h2>{hasWarnings ? "Prüfung mit Hinweisen" : "Prüfung erfolgreich"}</h2>
        <p>
          {summary.passed} von {summary.total} Prüfpunkten erfüllt. {summary.warning} Hinweise und {summary.failed} Fehler offen.
        </p>
        <Button onClick={() => setApproved((current) => !current)}>
          {approved ? "Druckfreigabe zurücknehmen" : "Druckfreigabe erteilen"}
        </Button>
        <Button variant="secondary" disabled title="Bericht-Download ist im Prototyp nicht aktiv">
          Bericht herunterladen
        </Button>
        {approved && <p className="approval-note">Druckfreigabe im Prototyp erteilt. Erneut klicken zum Zurücknehmen.</p>}
      </aside>
    </div>
  );
}
