import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Button } from "../components/Button";
import { compositionProfiles } from "../domain/compositionProfiles";
import { getProjectDraftIssues, type ProjectDraft } from "../domain/projectFactory";
import type { CompositionProfileId, ProjectPriceProfile } from "../domain/types";

interface NewProjectDialogProps {
  onClose: () => void;
  onCreate: (draft: ProjectDraft) => void;
}

function createDefaultProfilePlan(pageCount: number): Record<CompositionProfileId, number> {
  const linear = Math.round(pageCount * 0.52);
  const imageLed = Math.round(pageCount * 0.34);

  return {
    linear,
    "image-led": imageLed,
    complex: Math.max(0, pageCount - linear - imageLed),
  };
}

function createDefaultProfileRates(): Record<CompositionProfileId, number> {
  return {
    linear: 17,
    "image-led": 30,
    complex: 50,
  };
}

export function NewProjectDialog({ onClose, onCreate }: NewProjectDialogProps) {
  const dialogRef = useRef<HTMLElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isbn, setIsbn] = useState("");
  const [titleNumber, setTitleNumber] = useState("");
  const [pages, setPages] = useState("144");
  const [deadline, setDeadline] = useState("2026-09-18");
  const [profilePlan, setProfilePlan] = useState<Record<CompositionProfileId, number>>(() =>
    createDefaultProfilePlan(144),
  );
  const [profileRates, setProfileRates] = useState<Record<CompositionProfileId, number>>(() =>
    createDefaultProfileRates(),
  );
  const pageCount = Number.parseInt(pages, 10);
  const safePageCount = Number.isNaN(pageCount) ? 0 : pageCount;
  const profilePlanTotal = compositionProfiles.reduce((sum, profile) => sum + profilePlan[profile.id], 0);
  const dominantProfile = compositionProfiles.reduce((dominant, profile) =>
    profilePlan[profile.id] > profilePlan[dominant.id] ? profile : dominant,
  );
  const priceProfile: ProjectPriceProfile = {
    label: "Individueller Auftrag",
    pageRates: { ...profileRates },
    imageEditingRate: 14,
    correctionRoundRate: 170,
    aiCreditRate: 2,
  };
  const draftCandidate: ProjectDraft = {
    title,
    publisher,
    isbn,
    titleNumber,
    pages: safePageCount,
    deadline,
    leadId: "m-schneider",
    compositionProfile: dominantProfile.id,
    profilePlan,
    priceProfile,
  };
  const draftIssues = getProjectDraftIssues(draftCandidate);
  const canSubmit = draftIssues.length === 0;
  const profilePlanIssue = draftIssues.find((issue) => issue.id === "profilePlan");
  const profilePlanDelta = profilePlanTotal - safePageCount;
  const profilePlanSummary =
    profilePlanIssue && safePageCount > 0
      ? `Abweichung: ${profilePlanDelta > 0 ? "+" : ""}${profilePlanDelta} Seiten`
      : profilePlanIssue
        ? "Seitenzahl und Satzmix prüfen"
        : "Summe passt";

  useEffect(() => {
    if (window.matchMedia("(min-width: 761px)").matches) {
      titleInputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const closeFromBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const updatePages = (value: string) => {
    setPages(value);
    const nextPageCount = Number.parseInt(value, 10);

    if (!Number.isNaN(nextPageCount) && nextPageCount > 0) {
      setProfilePlan(createDefaultProfilePlan(nextPageCount));
    }
  };

  const updateProfilePlan = (profileId: CompositionProfileId, value: string) => {
    const nextValue = Math.max(0, Number.parseInt(value, 10) || 0);
    setProfilePlan((current) => ({ ...current, [profileId]: nextValue }));
  };

  const updateProfileRate = (profileId: CompositionProfileId, value: string) => {
    const nextValue = Math.max(0, Number.parseFloat(value) || 0);
    setProfileRates((current) => ({ ...current, [profileId]: nextValue }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    onCreate({
      title,
      publisher,
      isbn,
      titleNumber,
      pages: safePageCount,
      deadline,
      leadId: "m-schneider",
      compositionProfile: dominantProfile.id,
      profilePlan,
      priceProfile,
    });
  };

  return (
    <div className="dialog-backdrop" onMouseDown={closeFromBackdrop}>
      <section ref={dialogRef} className="dialog" role="dialog" aria-modal="true" aria-labelledby="new-project-title">
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
            <input
              ref={titleInputRef}
              name="project-title"
              autoComplete="off"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>

          <label>
            <span>Verlag</span>
            <input
              name="project-publisher"
              autoComplete="organization"
              value={publisher}
              onChange={(event) => setPublisher(event.target.value)}
              required
            />
          </label>

          <div className="form-row">
            <label>
              <span>ISBN</span>
              <input
                name="project-isbn"
                autoComplete="off"
                value={isbn}
                onChange={(event) => setIsbn(event.target.value)}
                placeholder="978-3-…"
                required
              />
            </label>

            <label>
              <span>Titelnummer</span>
              <input
                name="project-title-number"
                autoComplete="off"
                value={titleNumber}
                onChange={(event) => setTitleNumber(event.target.value)}
                placeholder="z. B. VZ-2026-0418"
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              <span>Seiten</span>
              <input
                name="project-pages"
                type="number"
                min="1"
                value={pages}
                onChange={(event) => updatePages(event.target.value)}
                required
              />
            </label>

            <label>
              <span>Deadline</span>
              <input
                name="project-deadline"
                type="date"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
                required
              />
            </label>
          </div>

          <label>
            <span>Projektleitung</span>
            <input name="project-lead" value="M. Schneider" disabled />
          </label>

          <fieldset className="profile-picker">
            <legend>Satzmix laut Verlagsschätzung</legend>
            <p className="form-hint">
              Diese Werte sind die erwarteten Seitenanteile. Der reale Ist-Mix kann später abweichen.
            </p>
            <div className="profile-options profile-plan-options">
              {compositionProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`profile-option${dominantProfile.id === profile.id ? " is-active" : ""}`}
                >
                  <strong>{profile.label}</strong>
                  <span>{profile.effortLabel}</span>
                  <small>{profile.description}</small>
                  <div className="profile-option-fields">
                    <label>
                      <span>Seiten</span>
                      <input
                        name={`profile-${profile.id}-pages`}
                        type="number"
                        min="0"
                        value={profilePlan[profile.id]}
                        onChange={(event) => updateProfilePlan(profile.id, event.target.value)}
                      />
                    </label>
                    <label>
                      <span>EUR/Seite</span>
                      <input
                        name={`profile-${profile.id}-rate`}
                        type="number"
                        min="0"
                        step="0.5"
                        value={profileRates[profile.id]}
                        onChange={(event) => updateProfileRate(profile.id, event.target.value)}
                        aria-label={`${profile.label} Euro je Seite`}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className={`profile-plan-summary${profilePlanIssue ? " has-warning" : " is-valid"}`}>
              <span>
                Plan: <strong>{profilePlanTotal}</strong> / {safePageCount} Seiten
              </span>
              <span>
                Dominant: <strong>{dominantProfile.shortLabel}</strong>
              </span>
              <span>
                Status: <strong>{profilePlanSummary}</strong>
              </span>
              <span>
                Preise: <strong>individuell</strong>
              </span>
            </div>
          </fieldset>

          <div
            id="new-project-validation"
            className={`form-validation${canSubmit ? " is-valid" : " has-issues"}`}
            role="status"
            aria-live="polite"
          >
            <strong>{canSubmit ? "Projekt kann angelegt werden." : "Projekt noch nicht anlegbar."}</strong>
            {draftIssues.length > 0 ? (
              <ul>
                {draftIssues.map((issue) => (
                  <li key={issue.id}>{issue.label}</li>
                ))}
              </ul>
            ) : (
              <span>Pflichtangaben, Deadline und Satzmix sind vollständig.</span>
            )}
          </div>

          <footer>
            <Button variant="secondary" onClick={onClose}>
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              aria-describedby="new-project-validation"
              title={canSubmit ? "Projekt anlegen" : draftIssues.map((issue) => issue.label).join(" ")}
            >
              Projekt anlegen
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}
