import type { ProjectBudgetModel } from "../domain/budgeting";

interface BudgetSignalBadgeProps {
  budget: ProjectBudgetModel;
  compact?: boolean;
}

export function BudgetSignalBadge({ budget, compact = false }: BudgetSignalBadgeProps) {
  return (
    <span
      className={`budget-signal-badge budget-signal-${budget.signal.tone}${compact ? " is-compact" : ""}`}
      title={budget.publicHelper}
      aria-label={`Auftragsrahmen: ${budget.publicLabel}`}
    >
      {budget.publicLabel}
    </span>
  );
}
