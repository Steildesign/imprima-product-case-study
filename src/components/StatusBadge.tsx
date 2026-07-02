import { getStatusVisual } from "../domain/statusVisuals";
import type { ProductionStatus } from "../domain/types";

interface StatusBadgeProps {
  status: ProductionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const visual = getStatusVisual(status);

  return (
    <span className={visual.className}>
      {visual.icon && <span aria-hidden="true">{visual.icon}</span>}
      {visual.label}
    </span>
  );
}
