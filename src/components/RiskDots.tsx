import { getRiskVisual } from "../domain/statusVisuals";
import type { RiskLevel } from "../domain/types";

const order: RiskLevel[] = ["hoch", "mittel", "niedrig"];

interface RiskDotsProps {
  risk: RiskLevel;
}

export function RiskDots({ risk }: RiskDotsProps) {
  const visual = getRiskVisual(risk);

  return (
    <span className="risk-dots" role="img" aria-label={visual.label}>
      {order.map((level) => (
        <span
          key={level}
          className={`${getRiskVisual(level).className}${level === risk ? " is-active" : ""}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
