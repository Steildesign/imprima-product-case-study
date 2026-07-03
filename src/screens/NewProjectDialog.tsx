import { useState, type FormEvent } from "react";
import { Button } from "../components/Button";
import type { ProjectDraft } from "../domain/projectFactory";

interface NewProjectDialogProps {
  onClose: () => void;
  onCreate: (draft: ProjectDraft) => void;
}

export function NewProjectDialog({ onClose, onCreate }: NewProjectDialogProps) {
  const [title, setTitle] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isbn, setIsbn] = useState("");
  const [pages, setPages] = useState("144");
  const [deadline, setDeadline] = useState("2026-09-18");
  const canSubmit = title.trim().length > 0 && publisher.trim().length > 0 && Number.parseInt(pages, 10) > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    const pageCount = Number.parseInt(pages, 10);

    onCreate({
      title,
      publisher,
      isbn,
      pages: Number.isNaN(pageCount) ? 1 : pageCount,
      deadline,
      leadId: "m-schneider",
    });
  };

  return (
    <div className="dialog-backdrop">
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="new-project-title">
        <header>
          <div>
            <p className="eyebrow">Neues Projekt</p>
            <h2 id="new-project-title">Titel in die Produktion aufnehmen</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Dialog schließen" onClick={onClose}>
            ×
          </button>
        </header>

        <form className="project-form" onSubmit={handleSubmit}>
          <label>
            <span>Titel</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} required autoFocus />
          </label>

          <label>
            <span>Verlag</span>
            <input value={publisher} onChange={(event) => setPublisher(event.target.value)} required />
          </label>

          <label>
            <span>ISBN optional</span>
            <input value={isbn} onChange={(event) => setIsbn(event.target.value)} placeholder="978-3-..." />
          </label>

          <div className="form-row">
            <label>
              <span>Seiten</span>
              <input
                type="number"
                min="1"
                value={pages}
                onChange={(event) => setPages(event.target.value)}
                required
              />
            </label>

            <label>
              <span>Deadline</span>
              <input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} required />
            </label>
          </div>

          <label>
            <span>Projektleitung</span>
            <input value="M. Schneider" disabled />
          </label>

          <footer>
            <Button variant="secondary" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              Projekt anlegen
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}
