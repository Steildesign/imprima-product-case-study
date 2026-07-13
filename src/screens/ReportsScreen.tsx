import { BudgetSignalBadge } from "../components/BudgetSignalBadge";
import { Button } from "../components/Button";
import { InsightBars, InsightDonut } from "../components/InsightCharts";
import { ProfileBadge } from "../components/ProfileBadge";
import { ProfileWorkloadBars, WorkloadStateBadge } from "../components/ProfileWorkloadBars";
import { ProgressBar } from "../components/ProgressBar";
import { RiskDots } from "../components/RiskDots";
import { StatusBadge } from "../components/StatusBadge";
import { getBudgetOverview, getProjectBudgetModel } from "../domain/budgeting";
import { getProjectReadinessChartData } from "../domain/chartVisuals";
import { criticalCommunicationEntries } from "../domain/communicationAssist";
import { getProfileWorkloadTotals } from "../domain/profileWorkload";
import { getRunningReportModel } from "../domain/reporting";
import type { Project } from "../domain/types";
import { TimelineRisk } from "./TimelineRisk";

interface ReportsScreenProps {
  projects: Project[];
  onCreateProject: () => void;
  onOpenProject: (projectId: string) => void;
}

export function ReportsScreen({ projects, onCreateProject, onOpenProject }: ReportsScreenProps) {
  const reportModel = getRunningReportModel(projects, criticalCommunicationEntries);
  const workloadTotals = getProfileWorkloadTotals(reportModel.runningProjects);
  const readinessCharts = getProjectReadinessChartData(reportModel.runningProjects);
  const budgetOverview = getBudgetOverview(reportModel.runningProjects);
  const actualPages = workloadTotals.reduce((sum, row) => sum + row.actualPages, 0);
  const remainingPages = workloadTotals.reduce((sum, row) => sum + row.remainingPages, 0);

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Berichte</p>
          <h1>Berichte laufender Projekte.</h1>
          <p className="muted">
            Nur aktive Titel im Produktionslauf. Nachfragen werden erst ab drei Tagen als eigener Stau markiert.
          </p>
        </div>
        <Button onClick={onCreateProject}>Neues Projekt</Button>
      </header>

      <div className="report-grid">
        {reportModel.highlightCards.map((report) => (
          <article className={`panel report-card report-${report.tone}`} key={report.id}>
            <p className="panel-label">{report.label}</p>
            <strong>{report.value}</strong>
            <p>{report.detail}</p>
          </article>
        ))}
        <article className="panel report-card report-budget">
          <p className="panel-label">Auftragsrahmen</p>
          <strong>{budgetOverview.attentionCount}</strong>
          <p>Titel mit Budgetsignal Beobachten oder Nachtrag prüfen.</p>
        </article>
      </div>

      <article className="panel running-report-panel">
        <header>
          <div>
            <p className="panel-label">Projektberichte</p>
            <h2>Lage pro aktivem Titel</h2>
          </div>
          <span>{reportModel.runningProjects.length} laufend</span>
        </header>

        <div className="running-report-columns" aria-label="Spalten der Projektberichte">
          <span>Aktiver Titel</span>
          <span>Fortschritt</span>
          <span>Status und Risiko</span>
          <span>Berichtsfokus</span>
        </div>
        <div className="running-report-list">
          {reportModel.projectRows.map((row) => (
            <button
              type="button"
              className={`running-report-item${row.stalledInquiryCount > 0 ? " has-backlog" : ""}`}
              key={row.project.id}
              aria-label={`${row.project.title} im Projektcockpit öffnen`}
              onClick={() => onOpenProject(row.project.id)}
            >
              <div className="running-report-title">
                <strong>{row.project.title}</strong>
                <span>
                  ISBN {row.project.isbn} · Titel-Nr. {row.project.titleNumber}
                </span>
              </div>
              <div className="running-report-progress">
                <ProgressBar value={row.project.progress} label={`${row.project.title} Fortschritt`} />
              </div>
              <div className="running-report-meta">
                <StatusBadge status={row.project.status} />
                <RiskDots risk={row.project.risk} />
                <BudgetSignalBadge budget={getProjectBudgetModel(row.project)} compact />
              </div>
              <div className="running-report-focus">
                <span>
                  {row.openInquiryCount} offen · {row.stalledInquiryCount} Stau
                </span>
                <strong>{row.reportFocus}</strong>
              </div>
            </button>
          ))}
        </div>
      </article>

      <article className={`panel inquiry-backlog-panel${reportModel.inquiryBacklog.length > 0 ? " has-backlog" : ""}`}>
        <header>
          <div>
            <p className="panel-label">Nachfragefenster</p>
            <h2>Auflaufende Anfragen</h2>
          </div>
          <span>{reportModel.inquiryBacklog.length} im Stau</span>
        </header>
        <div className="inquiry-backlog-list">
          {reportModel.inquiryBacklog.length > 0 ? (
            reportModel.inquiryBacklog.map((entry) => {
              const project = reportModel.runningProjects.find((item) => item.id === entry.projectId);

              return (
                <article className="inquiry-backlog-item" key={entry.id}>
                  <span>{project?.title ?? entry.projectId}</span>
                  <strong>{entry.subject}</strong>
                  <p>{entry.nextStep}</p>
                  <small>{entry.ageInDays} Tage offen · {entry.from}</small>
                </article>
              );
            })
          ) : (
            <div className="empty-state compact">
              <strong>Kein Nachfrage-Stau.</strong>
              <span>Alle offenen Klärungen liegen noch innerhalb des Drei-Tage-Fensters.</span>
            </div>
          )}
        </div>
      </article>

      <section className="module-insight-grid report-insight-grid">
        <div className="panel insight-panel">
          <InsightDonut
            data={readinessCharts.readiness}
            caption="Welche Titel bereits im finalen Produktionsfenster liegen."
          />
          <InsightBars title="Projektstatus" segments={readinessCharts.readiness.segments} />
        </div>
        <div className="panel insight-panel">
          <InsightDonut data={readinessCharts.risk} caption="Wie stark die Woche durch offene Risiken belastet ist." />
          <InsightBars title="Risikostufen" segments={readinessCharts.risk.segments} />
        </div>
      </section>

      <article className="panel profile-report">
        <div>
          <p className="panel-label">Aufwandsmix</p>
          <h2>Satzprofile nach Seitenumfang</h2>
          <p className="muted">
            {actualPages} reale Satzseiten, davon {remainingPages} noch offen.
          </p>
        </div>
        <div className="profile-report-content">
          <ProfileWorkloadBars rows={workloadTotals} showLegend />
          <div className="profile-report-columns" aria-label="Spalten des Aufwandsmixes">
            <span>Profil und Umfang</span>
            <span>Erledigt</span>
            <span>Offen</span>
            <span>Abweichung</span>
            <span>Status</span>
          </div>
          {workloadTotals.map((row) => (
            <div className="profile-report-row" key={row.profile.id}>
              <span>
                <ProfileBadge profileId={row.profile.id} />
                <strong>{row.actualPages} Seiten</strong>
              </span>
              <span>{row.completedPages} erledigt</span>
              <span>{row.remainingPages} offen</span>
              <span>{row.deltaPages >= 0 ? `+${row.deltaPages}` : row.deltaPages} gegen Plan</span>
              <WorkloadStateBadge state={row.state} label={row.stateLabel} />
            </div>
          ))}
        </div>
      </article>

      <TimelineRisk projects={reportModel.runningProjects} />
    </section>
  );
}
