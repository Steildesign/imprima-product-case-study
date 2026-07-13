import type { CSSProperties } from "react";
import type { ChartSegment, DonutChartData } from "../domain/chartVisuals";

interface InsightDonutProps {
  data: DonutChartData;
  caption?: string;
}

interface InsightBarsProps {
  title: string;
  segments: ChartSegment[];
}

interface GateFlowProps {
  steps: Array<{ id: string; label: string; state: "done" | "active" | "planned" }>;
}

const toneColor: Record<ChartSegment["tone"], string> = {
  green: "#079d38",
  blue: "#2f8ded",
  orange: "#f0ad1d",
  red: "#e5362e",
  gray: "#cfcdd4",
};

function getDonutGradient(segments: ChartSegment[]) {
  let cursor = 0;
  const parts = segments
    .filter((segment) => segment.value > 0)
    .map((segment) => {
      const start = cursor;
      cursor += segment.percent;
      return `${toneColor[segment.tone]} ${start}% ${cursor}%`;
    });

  return `conic-gradient(${parts.length > 0 ? parts.join(", ") : "#edf0f3 0% 100%"})`;
}

export function InsightDonut({ data, caption }: InsightDonutProps) {
  return (
    <article className="insight-donut-card">
      <div
        className="insight-donut"
        style={{ "--donut-gradient": getDonutGradient(data.segments) } as CSSProperties}
        aria-label={`${data.title}: ${data.primaryValue}, ${data.statusLabel}`}
      >
        <span>
          <strong>{data.primaryValue}</strong>
          <small>{data.statusLabel}</small>
        </span>
      </div>
      <div className="insight-chart-copy">
        <p className="panel-label">{data.title}</p>
        {caption && <p>{caption}</p>}
      </div>
      <div className="insight-legend">
        {data.segments.map((segment) => (
          <span key={segment.id}>
            <i style={{ background: toneColor[segment.tone] }} aria-hidden="true" />
            <strong>{segment.label}</strong>
            <small>
              {segment.value} · {segment.percent}%
            </small>
          </span>
        ))}
      </div>
    </article>
  );
}

export function InsightBars({ title, segments }: InsightBarsProps) {
  return (
    <article className="insight-bars-card" aria-label={title}>
      <p className="panel-label">{title}</p>
      <div className="insight-bars">
        {segments.map((segment, index) => (
          <div className="insight-bar-row" key={segment.id}>
            <span>
              <i style={{ background: toneColor[segment.tone] }} aria-hidden="true" />
              {segment.label}
            </span>
            <div className="insight-bar-track">
              <strong
                style={
                  {
                    "--bar-width": `${segment.percent}%`,
                    "--bar-color": toneColor[segment.tone],
                    "--bar-delay": `${index * 90}ms`,
                  } as CSSProperties
                }
              />
            </div>
            <small>{segment.value}</small>
          </div>
        ))}
      </div>
    </article>
  );
}

export function GateFlow({ steps }: GateFlowProps) {
  return (
    <div className="gate-flow" aria-label="Freigabe-Gates">
      {steps.map((step, index) => (
        <span
          key={step.id}
          className={`gate-node gate-${step.state}`}
          style={{ "--gate-delay": `${index * 95}ms` } as CSSProperties}
        >
          <i>{index + 1}</i>
          <strong>{step.label}</strong>
        </span>
      ))}
    </div>
  );
}
