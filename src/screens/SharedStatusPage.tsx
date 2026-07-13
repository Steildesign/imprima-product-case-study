import { useState } from "react";
import { Wordmark } from "../components/Brand";
import { Button } from "../components/Button";
import { PageUtilityNav } from "../components/PageUtilityNav";
import { ProfileBadge } from "../components/ProfileBadge";
import { ProfileWorkloadBars, WorkloadStateBadge } from "../components/ProfileWorkloadBars";
import { ProgressBar } from "../components/ProgressBar";
import { RiskDots } from "../components/RiskDots";
import { StatusBadge } from "../components/StatusBadge";
import { buildSharedStatus } from "../domain/sharedStatus";
import type { FeasibilityLevel } from "../domain/sharedStatus";
import type { Project } from "../domain/types";
import { prependBasePath } from "../domain/appPath";

interface SharedStatusPageProps {
  project: Project;
  onOpenPrototype: () => void;
}

const feasibilityLabels: Record<FeasibilityLevel, string> = {
  realistic: "Machbar",
  critical: "Kritisch",
  "not-realistic": "Nicht realistisch",
};

export function SharedStatusPage({ project, onOpenPrototype }: SharedStatusPageProps) {
  const [copyState, setCopyState] = useState("Ansichtslink kopieren");
  const status = buildSharedStatus(project);
  const shareUrl =
    typeof window === "undefined"
      ? prependBasePath(status.sharePath)
      : `${window.location.origin}${prependBasePath(status.sharePath)}`;
  const reportDate = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(new Date());

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("Link kopiert");
    } catch {
      setCopyState("Link im Feld markieren");
    }
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Zum Inhalt springen</a>
      <main className="share-page" id="main-content">
      <div className="page-return-bar">
        <Button variant="secondary" className="button-nav button-nav-back" onClick={onOpenPrototype}>
          <span className="button-symbol" aria-hidden="true">
            ←
          </span>
          <span>Zurück zum Projekt</span>
        </Button>
      </div>

      <section className="share-hero">
        <div>
          <Wordmark />
          <p className="eyebrow">Produktionsstatus</p>
          <h1>{status.title}</h1>
          <p>
            Freigegebene Statusansicht für Redaktion und Autor:innen. Diese Seite zeigt Stand, offene Punkte und eine
            realistische Einschätzung zum verbleibenden Produktionsfenster.
          </p>
        </div>

        <aside className="share-meta">
          <dl>
            <div>
              <dt>Stand</dt>
              <dd>{reportDate}</dd>
            </div>
            <div>
              <dt>Verlag</dt>
              <dd>{status.publisher}</dd>
            </div>
            <div>
              <dt>ISBN</dt>
              <dd>{status.isbn}</dd>
            </div>
            <div>
              <dt>Titelnummer</dt>
              <dd>{status.titleNumber}</dd>
            </div>
            <div>
              <dt>Deadline</dt>
              <dd>{status.deadlineLabel}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="share-kpis" aria-label="Statuskennzahlen">
        <article>
          <span>Fortschritt</span>
          <strong>{status.progress}%</strong>
          <ProgressBar value={status.progress} label={`${status.title} Fortschritt`} />
        </article>
        <article>
          <span>Restumfang</span>
          <strong>{status.remainingPages}</strong>
          <small>von {status.pages} Seiten offen</small>
        </article>
        <article>
          <span>Satzmix</span>
          <ProfileBadge profileId={status.workload.dominantProfile.profile.id} />
          <small>{status.profileEffort}</small>
        </article>
        <article className={`feasibility-${status.feasibility.level}`}>
          <span>Machbarkeit</span>
          <strong>{feasibilityLabels[status.feasibility.level]}</strong>
          <small>
            {status.feasibility.requestedPages} Seiten / {status.feasibility.availableWorkdays} Arbeitstage
          </small>
        </article>
      </section>

      <section className={`share-status-message share-status-${status.report.tone}`}>
        <div>
          <p className="panel-label">Statusmitteilung</p>
          <h2>{status.report.headline}</h2>
          <p>{status.report.summary}</p>
        </div>
        <ul>
          {status.report.nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </section>

      <section className="share-grid">
        <article className="share-section">
          <p className="panel-label">Aktueller Stand</p>
          <dl className="share-detail-list">
            <div>
              <dt>Phase</dt>
              <dd>{status.phase}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <StatusBadge status={project.status} />
              </dd>
            </div>
            <div>
              <dt>Risiko</dt>
              <dd>
                <span className="risk-summary">
                  <RiskDots risk={project.risk} />
                  <span>{status.riskLabel}</span>
                </span>
              </dd>
            </div>
          </dl>
        </article>

        <article className="share-section share-workload">
          <div>
            <p className="panel-label">Satzmix</p>
            <h2>Plan/Ist nach Seitenkategorie</h2>
          </div>
          <ProfileWorkloadBars rows={status.workload.rows} showLegend />
          <div className="share-workload-list">
            {status.workload.rows.map((row) => (
              <div key={row.profile.id}>
                <span>
                  <ProfileBadge profileId={row.profile.id} />
                  <strong>{row.actualPages} Ist</strong>
                </span>
                <small>
                  {row.plannedPages} Plan · {row.remainingPages} offen · {row.issueCount} Problem(e)
                </small>
                <WorkloadStateBadge state={row.state} label={row.stateLabel} />
              </div>
            ))}
          </div>
        </article>

        <article className="share-section">
          <p className="panel-label">Offene Punkte</p>
          {status.openItems.length > 0 ? (
            <ul className="share-open-list">
              {status.openItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">Aktuell sind keine Blocker für diese freigegebene Ansicht markiert.</p>
          )}
        </article>

        <article className="share-section share-capacity">
          <p className="panel-label">Kapazitätsprüfung</p>
          <h2>{status.feasibility.message}</h2>
          <div className="capacity-bars" aria-label="Kapazitätsvergleich">
            <div>
              <span>Anfrage</span>
              <strong>{status.feasibility.requestedPages} Seiten</strong>
            </div>
            <div>
              <span>Realistisch in {status.feasibility.availableWorkdays} Arbeitstagen</span>
              <strong>{status.feasibility.capacityPages} Seiten</strong>
            </div>
          </div>
          <p>{status.profileHint}</p>
        </article>

        <article className="share-section share-actions">
          <p className="panel-label">Freigabe</p>
          <label>
            <span>Ansichtslink</span>
            <input name="shared-status-url" value={shareUrl} readOnly />
          </label>
          <div>
            <Button onClick={copyShareLink}>{copyState}</Button>
            <Button variant="secondary" onClick={() => window.print()}>
              PDF exportieren
            </Button>
            <Button variant="tertiary" className="button-nav button-nav-back" onClick={onOpenPrototype}>
              <span className="button-symbol" aria-hidden="true">
                ←
              </span>
              <span>Zurück zum Projekt</span>
            </Button>
          </div>
        </article>
      </section>

      <PageUtilityNav backLabel="Zurück zum Projekt" onBack={onOpenPrototype} />
      </main>
    </>
  );
}
