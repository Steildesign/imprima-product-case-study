import { useEffect, useMemo, useRef, useState } from "react";
import {
  assistPrompts,
  getAssistPromptAnswer,
  getProjectCommunicationEntries,
  type AssistPromptId,
} from "../domain/communicationAssist";
import type { Project } from "../domain/types";

interface ImprimaAssistProps {
  project?: Project;
  onOpenCommunication: () => void;
}

const toneLabel = {
  neutral: "Im Blick",
  attention: "Klärung offen",
  critical: "Termin prüfen",
  positive: "Stabil",
};

export function ImprimaAssist({ project, onOpenCommunication }: ImprimaAssistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const [activePromptId, setActivePromptId] = useState<AssistPromptId>("open-clarifications");
  const entries = useMemo(() => (project ? getProjectCommunicationEntries(project.id) : []), [project]);
  const openEntryCount = entries.filter((entry) => entry.status === "offen" || entry.status === "wartet").length;
  const activeAnswer = project ? getAssistPromptAnswer(project, activePromptId) : undefined;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    panelRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  if (!project) {
    return null;
  }

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className={`assist-launcher${openEntryCount > 0 ? " has-signal" : ""}`}
        aria-label="Imprima Assist öffnen"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <span className="assist-launcher-mark" aria-hidden="true">
          IA
        </span>
        <span>
          <strong>Assist</strong>
          <small>{openEntryCount > 0 ? `${openEntryCount} Klärungen` : "Bereit"}</small>
        </span>
      </button>

      {isOpen && (
        <aside className="assist-drawer" aria-label="Imprima Assist" role="dialog" aria-modal="true">
          <div className="assist-drawer-panel" ref={panelRef} tabIndex={-1}>
            <header className="assist-header">
              <div>
                <p className="panel-label">Imprima Assist</p>
                <h2>{project.title}</h2>
                <p className="project-id-line">
                  ISBN {project.isbn} · Titel-Nr. {project.titleNumber}
                </p>
              </div>
              <button type="button" className="assist-close" aria-label="Assist schließen" onClick={() => setIsOpen(false)}>
                x
              </button>
            </header>

            <div className="assist-status-line">
              <span className={`assist-tone assist-tone-${activeAnswer?.tone ?? "neutral"}`}>
                {toneLabel[activeAnswer?.tone ?? "neutral"]}
              </span>
              <span>{entries.length} entscheidende Kommunikationspunkte</span>
            </div>

            <div className="assist-prompt-list" aria-label="Beispielfragen">
              {assistPrompts.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  className={`assist-prompt${activePromptId === prompt.id ? " is-active" : ""}`}
                  onClick={() => setActivePromptId(prompt.id)}
                >
                  <strong>{prompt.label}</strong>
                  <span>{prompt.helper}</span>
                </button>
              ))}
            </div>

            {activeAnswer && (
              <article className="assist-answer">
                <p className="panel-label">Antwort</p>
                <h3>{activeAnswer.summary}</h3>
                <p>{activeAnswer.body}</p>
                <div className="assist-next-step">
                  <span>Nächster Schritt</span>
                  <strong>{activeAnswer.nextAction}</strong>
                </div>
              </article>
            )}

            <div className="assist-source-list">
              <p className="panel-label">Quellen aus der Kommunikationsakte</p>
              {entries.map((entry) => (
                <article className="assist-source" key={entry.id}>
                  <span>{entry.kind}</span>
                  <strong>{entry.subject}</strong>
                  <p>{entry.summary}</p>
                  <small>
                    {entry.from} - {entry.date}
                  </small>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="button button-secondary assist-communication-button"
              onClick={() => {
                onOpenCommunication();
                setIsOpen(false);
              }}
            >
              Kommunikationsakte öffnen
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
