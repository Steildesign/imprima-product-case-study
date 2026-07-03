import { describe, expect, it } from "vitest";
import { getRiskVisual, getStatusVisual } from "./statusVisuals";
import type { ProductionStatus, RiskLevel } from "./types";

describe("status visual mappings", () => {
  const statusCases: Array<
    [
      ProductionStatus,
      {
        label: string;
        className: string;
        icon: string;
      },
    ]
  > = [
    ["offen", { label: "Offen", className: "status status-neutral", icon: "" }],
    ["im-satz", { label: "Im Satz", className: "status status-blue", icon: "" }],
    ["in-korrektur", { label: "In Korrektur", className: "status status-orange", icon: "" }],
    ["final", { label: "Final", className: "status status-green-outline", icon: "✓" }],
    ["preflight", { label: "Preflight", className: "status status-violet", icon: "" }],
    ["freigegeben", { label: "Freigegeben", className: "status status-green-filled", icon: "✓" }],
  ];

  const riskCases: Array<
    [
      RiskLevel,
      {
        label: string;
        className: string;
      },
    ]
  > = [
    ["niedrig", { label: "Im Plan", className: "risk-dot risk-low" }],
    ["mittel", { label: "Puffer knapp", className: "risk-dot risk-medium" }],
    ["hoch", { label: "Termin gefährdet", className: "risk-dot risk-high" }],
  ];

  it.each(statusCases)("maps production status %s to German labels and class names", (status, expected) => {
    expect(getStatusVisual(status)).toEqual(expected);
  });

  it.each(riskCases)("maps risk level %s without reusing status badge language", (risk, expected) => {
    expect(getRiskVisual(risk)).toEqual(expected);
  });
});
