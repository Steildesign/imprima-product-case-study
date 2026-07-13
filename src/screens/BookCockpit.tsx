import { Button } from "../components/Button";
import { BudgetSignalBadge } from "../components/BudgetSignalBadge";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import {
  ProfileWorkloadComparison,
  ProfileWorkloadHeading,
  WorkloadStateBadge,
} from "../components/ProfileWorkloadBars";
import { ProgressBar } from "../components/ProgressBar";
import { ProfileBadge } from "../components/ProfileBadge";
import { RiskDots } from "../components/RiskDots";
import { StatusBadge } from "../components/StatusBadge";
import { Tabs } from "../components/Tabs";
import { people } from "../domain/mockData";
import { formatBudgetAmount, getProjectBudgetModel } from "../domain/budgeting";
import { getChapterDraftIssues, type ChapterDraft } from "../domain/chapterFactory";
import { getProjectProfileWorkloadSummary } from "../domain/profileWorkload";
import { getProjectPlanningMeta, getProjectPlanningWindow } from "../domain/productionPlanning";
import { getProjectNavigation } from "../domain/selectors";
import { getRiskVisual } from "../domain/statusVisuals";
import type { BookTab } from "../domain/navigation";
import type { Chapter, ProductionStatus, Project } from "../domain/types";
import { CorrectionFlow } from "./CorrectionFlow";
import { PreflightPanel } from "./PreflightPanel";
import { TimelineRisk } from "./TimelineRisk";

interface BookCockpitProps {
  project: Project;
  projects: Project[];
  activeTab: BookTab;
  onTabChange: (tab: BookTab) => void;
  onSelectProject: (projectId: string) => void;
  onCreateProject?: () => void;
  onShareStatus: (projectId: string) => void;
  onBackToOverview: () => void;
  onAddChapter: (projectId: string, draft: ChapterDraft) => void;
  onUpdateChapter: (projectId: string, chapterId: string, patch: Partial<Chapter>) => void;
  onUpdateProjectStatus: (projectId: string, status: ProductionStatus) => void;
  onSetApproval: (projectId: string, approved: boolean) => void;
}

const tabs: Array<{ id: BookTab; label: string }> = [
  { id: "overview", label: "Übersicht" },
  { id: "corrections", label: "Korrekturen" },
  { id: "preflight", label: "Preflight" },
  { id: "risk", label: "Risiko" },
];

const statusOptions = [
  { value: "offen", label: "Offen" },
  { value: "im-satz", label: "Im Satz" },
  { value: "in-korrektur", label: "In Korrektur" },
  { value: "final", label: "Final" },
] as const;

const projectStatusOptions: Array<{ value: ProductionStatus; label: string }> = [
  ...statusOptions,
  { value: "preflight", label: "Preflight" },
  { value: "freigegeben", label: "Freigegeben" },
];

const riskOptions = [
  { value: "niedrig", label: "Niedrig" },
  { value: "mittel", label: "Mittel" },
  { value: "hoch", label: "Hoch" },
] as const;

function getPlanningChipStyle(color: string, accent: string) {
  return { "--project-color": color, "--project-accent": accent } as CSSProperties;
}

function getPersonName(personId: string) {
  return people.find((person) => person.id === personId)?.name ?? "Nicht zugewiesen";
}

export function BookCockpit({
  project,
  projects,
  activeTab,
  onTabChange,
  onSelectProject,
  onCreateProject,
  onShareStatus,
  onBackToOverview,
  onAddChapter,
  onUpdateChapter,
  onUpdateProjectStatus,
  onSetApproval,
}: BookCockpitProps) {
  const activeProjectButtonRef = useRef<HTMLButtonElement | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterFromPage, setChapterFromPage] = useState("1");
  const [chapterToPage, setChapterToPage] = useState(Math.min(project.pages, 24).toString());
  const [chapterOwnerId, setChapterOwnerId] = useState(project.leadId);
  const [chapterStatus, setChapterStatus] = useState<ChapterDraft["status"]>("offen");
  const [chapterRound, setChapterRound] = useState("V1");
  const [chapterRisk, setChapterRisk] = useState<ChapterDraft["risk"]>("niedrig");
  const [chapterNote, setChapterNote] = useState("");
  const lead = people.find((person) => person.id === project.leadId);
  const team = people.filter((person) => project.team.includes(person.id));
  const chapterPeople = team.length > 0 ? team : people;
  const risk = getRiskVisual(project.risk);
  const workload = getProjectProfileWorkloadSummary(project);
  const budget = getProjectBudgetModel(project);
  const planningMeta = getProjectPlanningMeta(project.id);
  const planningWindow = getProjectPlanningWindow(project.id);
  const projectNavigation = getProjectNavigation(projects, project.id);
  const dominantProfile = workload.dominantProfile.profile;
  const highestStateLabel =
    workload.rows.find((row) => row.state === workload.highestState)?.stateLabel ?? "Im Plan";
  const chapterDraft: ChapterDraft = {
    title: chapterTitle,
    fromPage: Number.parseInt(chapterFromPage, 10),
    toPage: Number.parseInt(chapterToPage, 10),
    ownerId: chapterOwnerId,
    status: chapterStatus,
    correctionRound: chapterRound,
    risk: chapterRisk,
    note: chapterNote,
  };
  const chapterIssues = getChapterDraftIssues(chapterDraft, project.pages);
  const canAddChapter = chapterIssues.length === 0;
  const chapterFromNumber = Number.parseInt(chapterFromPage, 10);
  const chapterToNumber = Number.parseInt(chapterToPage, 10);
  const chapterDraftPageCount =
    Number.isInteger(chapterFromNumber) && Number.isInteger(chapterToNumber) && chapterToNumber >= chapterFromNumber
      ? chapterToNumber - chapterFromNumber + 1
      : 0;
  const chapterDraftStatusLabel =
    statusOptions.find((option) => option.value === chapterStatus)?.label ?? "Offen";
  const chapterDraftRiskLabel = riskOptions.find((option) => option.value === chapterRisk)?.label ?? "Niedrig";
  const chapterDraftPreview: Chapter = {
    id: "chapter-draft-preview",
    title: chapterTitle.trim() || "Neues Kapitel",
    pages: chapterDraftPageCount > 0 ? `S. ${chapterFromPage}-${chapterToPage}` : "S. ?",
    ownerId: chapterOwnerId,
    status: chapterStatus,
    correctionRound: chapterRound || "V1",
    blocker: chapterNote.trim() || "Aktueller Entwurf",
    risk: chapterRisk,
  };
  const chapterRows = [chapterDraftPreview, ...project.chapters];

  useEffect(() => {
    setChapterTitle("");
    setChapterFromPage("1");
    setChapterToPage(Math.min(project.pages, 24).toString());
    setChapterOwnerId(project.leadId);
    setChapterStatus("offen");
    setChapterRound("V1");
    setChapterRisk("niedrig");
    setChapterNote("");
  }, [project.id, project.leadId, project.pages]);

  useEffect(() => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    activeProjectButtonRef.current?.scrollIntoView({
      behavior,
      block: "nearest",
      inline: "center",
    });
  }, [project.id]);

  const resetChapterForm = () => {
    setChapterTitle("");
    setChapterFromPage("1");
    setChapterToPage(Math.min(project.pages, 24).toString());
    setChapterOwnerId(project.leadId);
    setChapterStatus("offen");
    setChapterRound("V1");
    setChapterRisk("niedrig");
    setChapterNote("");
  };

  const handleChapterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canAddChapter) {
      return;
    }

    onAddChapter(project.id, chapterDraft);
    resetChapterForm();
  };

  const handleProjectSwitch = (projectId: string) => {
    if (projectId !== project.id) {
      onSelectProject(projectId);
    }
  };

  return (
    <section className="screen">
      <header className="cockpit-header">
        <div>
          <p className="breadcrumb">Projekte &gt; {project.title}</p>
          <h1>{project.title}</h1>
          <p className="muted">
            {project.publisher} | ISBN {project.isbn} | Titel-Nr. {project.titleNumber} | {project.pages} Seiten |
            Projektleitung {lead?.name ?? "Nicht zugewiesen"}
          </p>
        </div>
        <div className="cockpit-actions">
          <Button variant="secondary" className="button-nav button-nav-back" onClick={onBackToOverview}>
            <span className="button-symbol" aria-hidden="true">
              ←
            </span>
            <span>Zur Projektübersicht</span>
          </Button>
          {onCreateProject && (
            <Button variant="primary" className="button-nav button-nav-create" onClick={onCreateProject}>
              Neues Projekt
            </Button>
          )}
          <Button variant="primary" className="button-status-share" onClick={() => onShareStatus(project.id)}>
            <span>Status teilen</span>
            <span className="button-symbol" aria-hidden="true">
              →
            </span>
          </Button>
          <label className="project-status-editor">
            <span className="sr-only">Projektstatus</span>
            <StatusBadge status={project.status} />
            <select
              name="project-status"
              value={project.status}
              onChange={(event) => onUpdateProjectStatus(project.id, event.target.value as ProductionStatus)}
              aria-label={`${project.title} Projektstatus ändern`}
            >
              {projectStatusOptions.map((option) => (
                <option value={option.value} key={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <nav className="project-switcher" aria-label="Projekt im Cockpit wechseln">
        <button
          type="button"
          className="project-switch-arrow"
          onClick={() => projectNavigation.previous && handleProjectSwitch(projectNavigation.previous.id)}
          disabled={!projectNavigation.previous}
          aria-label={
            projectNavigation.previous ? `Vorheriges Projekt: ${projectNavigation.previous.title}` : "Kein vorheriges Projekt"
          }
        >
          ←
        </button>
        <div className="project-switch-track" aria-label="Verfügbare Projekte">
          {projectNavigation.items.map((item) => (
            <button
              key={item.project.id}
              type="button"
              ref={item.isActive ? activeProjectButtonRef : undefined}
              className={`project-switch-chip${item.isActive ? " is-active" : ""}`}
              onClick={() => handleProjectSwitch(item.project.id)}
              aria-current={item.isActive ? "page" : undefined}
            >
              <span className="project-switch-meta">
                Projekt {item.position}/{projectNavigation.total}
              </span>
              <strong>{item.project.title}</strong>
              <small>ISBN {item.project.isbn}</small>
              <span className="project-switch-progress" aria-hidden="true">
                <span style={{ width: `${item.project.progress}%` }} />
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="project-switch-arrow"
          onClick={() => projectNavigation.next && handleProjectSwitch(projectNavigation.next.id)}
          disabled={!projectNavigation.next}
          aria-label={projectNavigation.next ? `Nächstes Projekt: ${projectNavigation.next.title}` : "Kein nächstes Projekt"}
        >
          →
        </button>
      </nav>

      <Tabs items={tabs} activeId={activeTab} onChange={onTabChange} />

      {activeTab === "overview" && (
        <>
          <article className="panel workload-panel cockpit-workload-summary">
            <div className="workload-panel-header">
              <ProfileWorkloadHeading
                meta={`${workload.actualPages} Seiten · ${workload.remainingPages} offen · Entwurf ${chapterDraftPageCount} S.`}
              />
              <WorkloadStateBadge state={workload.highestState} label={highestStateLabel} />
            </div>
            <ProfileWorkloadComparison rows={workload.rows} />
          </article>

          <article className="panel budget-panel cockpit-budget" aria-label="Auftragsrahmen und Budgetstand">
            <div className="budget-panel-header">
              <div>
                <p className="panel-label">Auftragsrahmen</p>
                <h2>Budgetstand nach Verlagspreisprofil</h2>
                <p className="muted">
                  {budget.priceProfile.label} · Details bleiben intern im Projektcockpit.
                </p>
              </div>
              <BudgetSignalBadge budget={budget} />
            </div>
            <div className="budget-total-grid">
              <div>
                <span>Beauftragt</span>
                <strong>{formatBudgetAmount(budget.plannedTotal)}</strong>
              </div>
              <div>
                <span>Erfasst</span>
                <strong>{formatBudgetAmount(budget.actualTotal)}</strong>
              </div>
              <div>
                <span>Differenz</span>
                <strong>{budget.deltaAmount >= 0 ? "+" : ""}{formatBudgetAmount(budget.deltaAmount)}</strong>
              </div>
              <div>
                <span>Auslastung</span>
                <strong>{budget.usagePercent}%</strong>
              </div>
            </div>
            <div className="budget-meter" aria-label={`Budgetauslastung ${budget.usagePercent} Prozent`}>
              <i style={{ "--budget-meter-width": `${Math.min(120, budget.usagePercent)}%` } as CSSProperties} />
            </div>
            <div className="budget-line-header" aria-label="Spalten des Auftragsrahmens">
              <span>Position und Umfang</span>
              <span>Preis je Einheit</span>
              <span>Erfasster Betrag</span>
              <span>Status</span>
            </div>
            <div className="budget-line-list">
              {budget.lines.map((line) => (
                <div className="budget-line-row" key={line.id}>
                  <span>
                    <strong>{line.label}</strong>
                    {line.actualUnits} / {line.plannedUnits} {line.unitLabel}
                    {line.detail && <small className="budget-line-detail">{line.detail}</small>}
                  </span>
                  <span>{formatBudgetAmount(line.rate)} je Einheit</span>
                  <span>{formatBudgetAmount(line.actualAmount)}</span>
                  <BudgetSignalBadge
                    budget={{
                      ...budget,
                      publicLabel:
                        line.deltaAmount > 0 ? "Mehrumfang" : line.deltaAmount < 0 ? "Puffer" : "Im Rahmen",
                      publicHelper:
                        line.deltaAmount > 0
                          ? "Dieser Posten liegt über dem beauftragten Rahmen."
                          : line.deltaAmount < 0
                            ? "Dieser Posten hat aktuell Puffer."
                            : "Dieser Posten liegt im Rahmen.",
                      signal:
                        line.deltaAmount > 0
                          ? { id: "beobachten", label: "Mehrumfang", tone: "orange", helper: "Mehrumfang dokumentieren." }
                          : line.deltaAmount < 0
                            ? { id: "puffer", label: "Puffer", tone: "blue", helper: "Puffer vorhanden." }
                            : { id: "im-rahmen", label: "Im Rahmen", tone: "green", helper: "Im Rahmen." },
                    }}
                    compact
                  />
                </div>
              ))}
            </div>
          </article>

          <div className="cockpit-grid">
            <article className="panel progress-panel">
              <p className="panel-label">Projektfortschritt</p>
              <strong className="large-number">{project.progress}%</strong>
              <ProgressBar value={project.progress} label={`${project.title} Gesamtfortschritt`} />
              <dl className="metric-list">
                <div>
                  <dt>Phase</dt>
                  <dd>{project.phase}</dd>
                </div>
                <div>
                  <dt>Dominanter Satzmix</dt>
                  <dd>
                    <ProfileBadge profileId={dominantProfile.id} />
                  </dd>
                </div>
                <div>
                  <dt>Aufwand</dt>
                  <dd>{dominantProfile.effortLabel}</dd>
                </div>
                <div>
                  <dt>Auftragsdelta</dt>
                  <dd>+{workload.overPlanPages} Seiten</dd>
                </div>
                <div>
                  <dt>Deadline</dt>
                  <dd>{project.deadlineLabel}</dd>
                </div>
                <div>
                  <dt>Planung</dt>
                  <dd>
                    <span
                      className="table-planning-chip"
                      style={getPlanningChipStyle(planningMeta.color, planningMeta.accent)}
                    >
                      <strong>{planningMeta.code}</strong>
                      {planningWindow?.shortLabel ?? "Offen"}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Risiko</dt>
                  <dd>
                    <span className="risk-summary">
                      <RiskDots risk={project.risk} />
                      <span>{risk.label}</span>
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Auftragsrahmen</dt>
                  <dd>
                    <BudgetSignalBadge budget={budget} compact />
                  </dd>
                </div>
              </dl>
              <div className="coordination-alert" role="note" aria-label="Abstimmung prüfen">
                <strong>Abstimmung prüfen</strong>
                <span>{dominantProfile.riskHint}</span>
              </div>
            </article>

            <article className="panel chapter-panel">
              <div className="chapter-panel-header">
                <div>
                  <p className="panel-label">Kapitel</p>
                  <h2>Kapitelstruktur</h2>
                </div>
                <span>{project.chapters.length} angelegt · 1 Entwurf</span>
              </div>
              <form className="chapter-builder" onSubmit={handleChapterSubmit}>
                <div className="chapter-builder-grid">
                  <label className="chapter-title-field">
                    <span>Kapiteltitel</span>
                    <input
                      name="chapter-title"
                      autoComplete="off"
                      value={chapterTitle}
                      onChange={(event) => setChapterTitle(event.target.value)}
                      placeholder="z. B. Kapitel 1 - Auftakt"
                    />
                  </label>
                  <label>
                    <span>Von Seite</span>
                    <input
                      name="chapter-from-page"
                      type="number"
                      min="1"
                      max={project.pages}
                      value={chapterFromPage}
                      onChange={(event) => setChapterFromPage(event.target.value)}
                    />
                  </label>
                  <label>
                    <span>Bis Seite</span>
                    <input
                      name="chapter-to-page"
                      type="number"
                      min="1"
                      max={project.pages}
                      value={chapterToPage}
                      onChange={(event) => setChapterToPage(event.target.value)}
                    />
                  </label>
                  <label>
                    <span>Verantwortlich</span>
                    <select name="chapter-owner" value={chapterOwnerId} onChange={(event) => setChapterOwnerId(event.target.value)}>
                      {chapterPeople.map((person) => (
                        <option value={person.id} key={person.id}>
                          {person.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Status</span>
                    <select
                      name="chapter-status"
                      value={chapterStatus}
                      onChange={(event) => setChapterStatus(event.target.value as ChapterDraft["status"])}
                    >
                      {statusOptions.map((option) => (
                        <option value={option.value} key={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Runde</span>
                    <select name="chapter-round" value={chapterRound} onChange={(event) => setChapterRound(event.target.value)}>
                      <option value="V1">V1</option>
                      <option value="V2">V2</option>
                      <option value="Autorenkorrektur">Autorenkorrektur</option>
                      <option value="Schlusskorrektur">Schlusskorrektur</option>
                    </select>
                  </label>
                  <label>
                    <span>Risiko</span>
                    <select name="chapter-risk" value={chapterRisk} onChange={(event) => setChapterRisk(event.target.value as ChapterDraft["risk"])}>
                      {riskOptions.map((option) => (
                        <option value={option.value} key={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="chapter-note-field">
                    <span>Hinweis optional</span>
                    <input
                      name="chapter-note"
                      autoComplete="off"
                      value={chapterNote}
                      onChange={(event) => setChapterNote(event.target.value)}
                      placeholder="z. B. Bildrechte, Marginalien, Abstimmung"
                    />
                  </label>
                </div>
                <div className={`chapter-builder-status${canAddChapter ? " is-valid" : " has-issues"}`} role="status">
                  <span>
                    {chapterTitle.trim() || "Neues Kapitel"} · S. {chapterFromPage || "?"}-{chapterToPage || "?"} ·{" "}
                    {getPersonName(chapterOwnerId)} · {chapterDraftStatusLabel} · Risiko {chapterDraftRiskLabel} ·{" "}
                    {chapterRound || "Runde fehlt"}
                  </span>
                  {canAddChapter ? (
                    <strong>Bereit zum Anlegen</strong>
                  ) : (
                    <strong>{chapterIssues.map((issue) => issue.label).join(" ")}</strong>
                  )}
                </div>
                <footer>
                  <Button
                    type="submit"
                    disabled={!canAddChapter}
                    title={canAddChapter ? "Kapitel anlegen" : chapterIssues.map((issue) => issue.label).join(" ")}
                  >
                    Kapitel anlegen
                  </Button>
                </footer>
              </form>
              <table className="chapter-table">
                <thead>
                  <tr>
                    <th>Kapitel</th>
                    <th>Seiten</th>
                    <th>Verantwortlich</th>
                    <th>Status</th>
                    <th>Runde</th>
                    <th>Risiko</th>
                  </tr>
                </thead>
                <tbody>
                  {chapterRows.map((chapter) => {
                    const isDraftRow = chapter.id === "chapter-draft-preview";

                    return (
                      <tr className={isDraftRow ? "chapter-draft-row" : undefined} key={chapter.id}>
                        <td>
                          <strong>{chapter.title}</strong>
                          {isDraftRow && <small>Aktueller Entwurf</small>}
                          {chapter.blocker && !isDraftRow && <small>{chapter.blocker}</small>}
                        </td>
                        <td>{chapter.pages}</td>
                        <td>
                          {isDraftRow ? getPersonName(chapter.ownerId) : (
                            <select
                              name={`chapter-${chapter.id}-owner`}
                              className="table-editor"
                              value={chapter.ownerId}
                              aria-label={`${chapter.title} Verantwortliche Person`}
                              onChange={(event) => onUpdateChapter(project.id, chapter.id, { ownerId: event.target.value })}
                            >
                              {chapterPeople.map((person) => (
                                <option value={person.id} key={person.id}>{person.name}</option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td>
                          {isDraftRow ? <StatusBadge status={chapter.status} /> : (
                            <select
                              name={`chapter-${chapter.id}-status`}
                              className="table-editor"
                              value={chapter.status}
                              aria-label={`${chapter.title} Status`}
                              onChange={(event) => onUpdateChapter(project.id, chapter.id, { status: event.target.value as ProductionStatus })}
                            >
                              {statusOptions.map((option) => (
                                <option value={option.value} key={option.value}>{option.label}</option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td>
                          {isDraftRow ? chapter.correctionRound : (
                            <select
                              name={`chapter-${chapter.id}-round`}
                              className="table-editor"
                              value={chapter.correctionRound}
                              aria-label={`${chapter.title} Korrekturrunde`}
                              onChange={(event) => onUpdateChapter(project.id, chapter.id, { correctionRound: event.target.value })}
                            >
                              <option value="V1">V1</option>
                              <option value="V2">V2</option>
                              <option value="Autorenkorrektur">Autorenkorrektur</option>
                              <option value="Schlusskorrektur">Schlusskorrektur</option>
                            </select>
                          )}
                        </td>
                        <td>
                          {isDraftRow ? <RiskDots risk={chapter.risk} /> : (
                            <select
                              name={`chapter-${chapter.id}-risk`}
                              className="table-editor"
                              value={chapter.risk}
                              aria-label={`${chapter.title} Risiko`}
                              onChange={(event) => onUpdateChapter(project.id, chapter.id, { risk: event.target.value as Chapter["risk"] })}
                            >
                              {riskOptions.map((option) => (
                                <option value={option.value} key={option.value}>{option.label}</option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </article>

            <aside className="panel side-panel">
              <p className="panel-label">Zugewiesene</p>
              {team.length > 0 ? (
                team.map((person) => (
                  <div className="person-row" key={person.id}>
                    <span className={`avatar avatar-${person.tone}`}>{person.initials}</span>
                    <span>
                      <strong>{person.name}</strong>
                      <small>{person.role}</small>
                    </span>
                  </div>
                ))
              ) : (
                <p className="muted">Noch keine Teammitglieder zugewiesen.</p>
              )}

              {project.blocker && (
                <div className="blocker-box">
                  <strong>Blocker</strong>
                  <span>{project.blocker}</span>
                </div>
              )}
            </aside>

            <article className="panel workload-panel cockpit-workload">
              <div className="workload-panel-header">
                <div>
                  <p className="panel-label">Satzprofile</p>
                  <h2>Details je Produktionskategorie</h2>
                </div>
                <WorkloadStateBadge state={workload.highestState} label={highestStateLabel} />
              </div>

              <table className="workload-table">
                <thead>
                  <tr>
                    <th>Profil</th>
                    <th>Plan</th>
                    <th>Ist</th>
                    <th>Erledigt</th>
                    <th>Offen</th>
                    <th>Probleme</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workload.rows.map((row) => (
                    <tr key={row.profile.id}>
                      <td>
                        <ProfileBadge profileId={row.profile.id} />
                      </td>
                      <td>{row.plannedPages}</td>
                      <td>{row.actualPages}</td>
                      <td>{row.completedPages}</td>
                      <td>{row.remainingPages}</td>
                      <td>{row.issueCount}</td>
                      <td>
                        <WorkloadStateBadge state={row.state} label={row.stateLabel} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </div>
        </>
      )}

      {activeTab === "corrections" && <CorrectionFlow project={project} />}
      {activeTab === "preflight" && (
        <PreflightPanel
          project={project}
          approved={project.status === "freigegeben"}
          onApprovalChange={(approved) => onSetApproval(project.id, approved)}
        />
      )}
      {activeTab === "risk" && <TimelineRisk projects={[project]} />}
    </section>
  );
}
