import type { CSSProperties } from "react";

import type { ProfileWorkloadBalance, ProfileWorkloadRow } from "../domain/profileWorkload";
import { getProfileWorkloadBalance } from "../domain/profileWorkload";
import { getProfileWorkloadMotion } from "../domain/profileWorkload";
import type { ProfileWorkloadState } from "../domain/types";
import { ProfileBadge } from "./ProfileBadge";

type WorkloadValue = "planned" | "actual";

interface ProfileWorkloadBarsProps {
  rows: ProfileWorkloadRow[];
  showLegend?: boolean;
  value?: WorkloadValue;
  ariaLabel?: string;
}

interface WorkloadStateBadgeProps {
  state: ProfileWorkloadState;
  label: string;
}

export function WorkloadStateBadge({ state, label }: WorkloadStateBadgeProps) {
  return <span className={`workload-state workload-state-${state}`}>{label}</span>;
}

export function ProfileWorkloadHeading({ meta }: { meta?: string }) {
  return (
    <div className="workload-heading">
      <div>
        <h2 lang="de">
          <span>Satzmix</span>
          {" "}
          <span>&amp; Auftragsabweichung</span>
        </h2>
        {meta && <p>{meta}</p>}
      </div>
    </div>
  );
}

function getPages(row: ProfileWorkloadRow, value: WorkloadValue) {
  return value === "planned" ? row.plannedPages : row.actualPages;
}

function getShare(row: ProfileWorkloadRow, rows: ProfileWorkloadRow[], value: WorkloadValue) {
  const total = rows.reduce((sum, item) => sum + getPages(item, value), 0);

  return total === 0 ? 0 : Math.round((getPages(row, value) / total) * 100);
}

function getSignedPercent(value: number) {
  if (value > 0) {
    return `+${value}%`;
  }

  if (value < 0) {
    return `${value}%`;
  }

  return "0%";
}

function getCompactProfileLabel(label: string) {
  return label === "Bildintegriert" ? "Bild" : label;
}

export function ProfileWorkloadBars({
  rows,
  showLegend = false,
  value = "actual",
  ariaLabel,
}: ProfileWorkloadBarsProps) {
  const visibleRows = rows.filter((row) => getPages(row, value) > 0);

  return (
    <div className="workload-visual" aria-label={ariaLabel ?? "Satzmix nach Seiten"}>
      <div className="workload-stack">
        {visibleRows.map((row, index) => (
          <span
            key={row.profile.id}
            className={`workload-segment ${row.profile.className}`}
            style={
              {
                flexGrow: getPages(row, value),
                "--segment-delay": `${index * 80}ms`,
              } as CSSProperties
            }
            title={`${row.profile.label}: ${getPages(row, value)} Seiten`}
          />
        ))}
      </div>

      {showLegend && (
        <div className="workload-legend">
          {rows.map((row) => (
            <span key={row.profile.id}>
              <ProfileBadge profileId={row.profile.id} />
              <strong>{row.actualPages}</strong>
              <small>Ist / {row.plannedPages} Plan</small>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProfileWorkloadComparison({ rows }: { rows: ProfileWorkloadRow[] }) {
  const columns: Array<{ label: string; value: WorkloadValue; note: string }> = [
    { label: "Verlagsschätzung", value: "planned", note: "Soll laut Auftrag" },
    { label: "Aktueller Ist-Mix", value: "actual", note: "Real erfasster Umfang" },
  ];
  const balance = getProfileWorkloadBalance(rows);
  const motion = getProfileWorkloadMotion(rows);

  const renderColumn = (column: { label: string; value: WorkloadValue; note: string }) => {
    const total = rows.reduce((sum, row) => sum + getPages(row, column.value), 0);

    return (
      <section className="workload-comparison-card" key={column.value}>
        <header>
          <span>{column.note}</span>
          <strong>{column.label}</strong>
        </header>

        <ProfileWorkloadBars
          rows={rows}
          value={column.value}
          ariaLabel={`${column.label} nach Satzprofilen`}
        />

        <div className="workload-comparison-rows">
          {rows.map((row) => (
            <div key={row.profile.id}>
              <span>
                <i className={`workload-dot ${row.profile.className}`} aria-hidden="true" />
                {row.profile.shortLabel}
              </span>
              <strong>{getPages(row, column.value)}</strong>
              <small>{getShare(row, rows, column.value)}%</small>
            </div>
          ))}
        </div>

        <footer>{total} Seiten</footer>
      </section>
    );
  };

  return (
    <div
      className={`workload-comparison motion-${motion.intensity}`}
      aria-label="Vergleich zwischen Verlagsschätzung und aktuellem Satzmix"
    >
      {renderColumn(columns[0])}
      <ProfileWorkloadBalanceSphere balance={balance} />
      {renderColumn(columns[1])}
    </div>
  );
}

function ProfileWorkloadBalanceSphere({ balance }: { balance: ProfileWorkloadBalance }) {
  const shift = Math.max(-34, Math.min(34, balance.complexityShiftPercent * 1.45));
  const directionLabel =
    balance.direction === "more-complex"
      ? "komplexer"
      : balance.direction === "less-complex"
        ? "linearer"
        : "stabil";
  const dominantShift = balance.dominantShift;

  return (
    <aside
      className={`workload-balance-sphere is-${balance.direction}`}
      style={{ "--balance-shift": `${shift}%` } as CSSProperties}
      aria-label={`Satzmix-Balance: ${getSignedPercent(balance.complexityShiftPercent)} ${directionLabel}`}
    >
      <div className="workload-balance-labels" aria-hidden="true">
        <span>Soll</span>
        <span>Ist</span>
      </div>
      <div className="workload-balance-field" aria-hidden="true">
        <span className="workload-balance-axis" />
        <span className="workload-balance-orb">
          {balance.rows.map((row, index) => (
            <i
              key={row.profile.id}
              className={`workload-balance-particle ${row.profile.className}`}
              style={
                {
                  "--profile-size": `${Math.max(18, Math.min(38, row.actualShare))}px`,
                  "--profile-drift": `${Math.max(-10, Math.min(10, row.shareDelta * 0.8))}px`,
                  "--profile-delay": `${index * -1.1}s`,
                } as CSSProperties
              }
            />
          ))}
        </span>
      </div>
      <ProfileWorkloadDeltaRail balance={balance} />
      <div className="workload-balance-caption">
        <strong>{getSignedPercent(balance.complexityShiftPercent)}</strong>
        <span>{directionLabel}</span>
      </div>
      {dominantShift && (
        <small>
          {dominantShift.profile.shortLabel} {getSignedPercent(dominantShift.shareDelta)}
        </small>
      )}
    </aside>
  );
}

function ProfileWorkloadDeltaRail({ balance }: { balance: ProfileWorkloadBalance }) {
  return (
    <div className="workload-delta-rail" aria-label="Satzmix-Abweichung nach Profilen">
      {balance.rows.map((row) => (
        <span
          key={row.profile.id}
          className={`workload-delta-chip ${row.profile.className}${
            row.shareDelta > 0 ? " is-positive" : row.shareDelta < 0 ? " is-negative" : " is-neutral"
          }`}
          style={
            {
              "--delta-size": `${Math.min(100, Math.max(12, Math.abs(row.shareDelta) * 8))}%`,
            } as CSSProperties
          }
        >
          <i aria-hidden="true" />
          <strong>{getCompactProfileLabel(row.profile.shortLabel)}</strong>
          <small>{getSignedPercent(row.shareDelta)}</small>
        </span>
      ))}
    </div>
  );
}
