import { useEffect, useMemo, useState } from "react";
import { GateFlow, InsightBars, InsightDonut } from "../components/InsightCharts";
import { ProgressBar } from "../components/ProgressBar";
import { getCorrectionChartData } from "../domain/chartVisuals";
import { getActiveCorrectionStep } from "../domain/selectors";
import type { Project } from "../domain/types";

interface CorrectionFlowProps {
  project: Project;
}

export function CorrectionFlow({ project }: CorrectionFlowProps) {
  const activeStep = getActiveCorrectionStep(project);
  const correctionChart = getCorrectionChartData(project.correctionSteps);
  const defaultStepId = activeStep?.id ?? project.correctionSteps[0]?.id;
  const [selectedStepId, setSelectedStepId] = useState<string | undefined>(defaultStepId);
  const selectedStep = useMemo(
    () => project.correctionSteps.find((step) => step.id === selectedStepId) ?? activeStep ?? project.correctionSteps[0],
    [activeStep, project.correctionSteps, selectedStepId],
  );

  useEffect(() => {
    setSelectedStepId(defaultStepId);
  }, [defaultStepId, project.id]);

  if (project.correctionSteps.length === 0) {
    return (
      <div className="empty-state correction-empty">
        <strong>Keine Korrekturschritte vorhanden.</strong>
        <span>Dieser Titel hat noch keinen Korrektur- oder Freigabe-Flow.</span>
      </div>
    );
  }

  return (
    <div className="correction-layout">
      <div className="stepper" role="group" aria-label="Korrektur- und Freigabe-Flow">
        {project.correctionSteps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            className={`step step-${step.state}${step.id === selectedStep?.id ? " is-selected" : ""}`}
            aria-pressed={step.id === selectedStep?.id}
            onClick={() => setSelectedStepId(step.id)}
          >
            <span>{index + 1}</span>
            <strong>{step.label}</strong>
            <small>{step.note}</small>
          </button>
        ))}
      </div>

      <section className="panel insight-panel correction-insight-panel">
        <InsightDonut
          data={correctionChart}
          caption="Zeigt, wie weit der Korrektur- und Freigabeweg belastbar geschlossen ist."
        />
        <InsightBars title="Schrittstatus" segments={correctionChart.segments} />
        <GateFlow
          steps={project.correctionSteps.map((step) => ({
            id: step.id,
            label: step.label,
            state: step.state,
          }))}
        />
      </section>

      <article className="panel">
        <p className="panel-label">Aktueller Schritt</p>
        <h2>{selectedStep.label}</h2>
        <p>{selectedStep.note}</p>
        <dl className="metric-list">
          <div>
            <dt>Verantwortlich</dt>
            <dd>{selectedStep.owner}</dd>
          </div>
          <div>
            <dt>Fällig</dt>
            <dd>{selectedStep.date}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{selectedStep.state === "done" ? "Erledigt" : selectedStep.state === "active" ? "Aktiv" : "Geplant"}</dd>
          </div>
        </dl>
        <ProgressBar value={selectedStep.state === "done" ? 100 : selectedStep.state === "active" ? 60 : 15} />
      </article>

      <article className="panel">
        <p className="panel-label">Ablauf</p>
        <ol className="activity-list">
          {project.correctionSteps.map((step) => (
            <li key={step.id} className={`activity-${step.state}`}>
              <strong>{step.label}</strong>
              <span>{step.note}</span>
              <time>{step.date}</time>
            </li>
          ))}
        </ol>
      </article>

      <article className="panel">
        <p className="panel-label">Feedback & Kommentare</p>
        <div className="version-chip">gilt jetzt: {activeStep?.label ?? selectedStep.label}</div>
        {project.comments.length > 0 ? (
          project.comments.map((comment) => (
            <div className="comment" key={comment.id}>
              <strong>
                {comment.author} <span>{comment.role}</span>
              </strong>
              <p>{comment.text}</p>
              <small>
                {comment.chapter} | {comment.date}
              </small>
            </div>
          ))
        ) : (
          <div className="empty-state compact">
            <strong>Keine Kommentare.</strong>
            <span>Für diesen Korrekturschritt liegen keine Rückmeldungen vor.</span>
          </div>
        )}
      </article>
    </div>
  );
}
