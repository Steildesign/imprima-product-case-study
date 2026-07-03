import type { ProductionStatus, RiskLevel } from "./types";

interface StatusVisual {
  label: string;
  className: string;
  icon: string;
}

interface RiskVisual {
  label: string;
  className: string;
}

export function getStatusVisual(status: ProductionStatus): StatusVisual {
  const map: Record<ProductionStatus, StatusVisual> = {
    offen: { label: "Offen", className: "status status-neutral", icon: "" },
    "im-satz": { label: "Im Satz", className: "status status-blue", icon: "" },
    "in-korrektur": { label: "In Korrektur", className: "status status-orange", icon: "" },
    final: { label: "Final", className: "status status-green-outline", icon: "✓" },
    preflight: { label: "Preflight", className: "status status-violet", icon: "" },
    freigegeben: { label: "Freigegeben", className: "status status-green-filled", icon: "✓" },
  };

  return map[status];
}

export function getRiskVisual(risk: RiskLevel): RiskVisual {
  const map: Record<RiskLevel, RiskVisual> = {
    niedrig: { label: "Im Plan", className: "risk-dot risk-low" },
    mittel: { label: "Puffer knapp", className: "risk-dot risk-medium" },
    hoch: { label: "Termin gefährdet", className: "risk-dot risk-high" },
  };

  return map[risk];
}
