import { describe, expect, it } from "vitest";
import { getRiskVisual, getStatusVisual } from "./statusVisuals";

describe("status visual mappings", () => {
  it("maps production statuses to German labels and class names", () => {
    expect(getStatusVisual("im-satz")).toEqual({
      label: "Im Satz",
      className: "status status-blue",
      icon: "",
    });
    expect(getStatusVisual("freigegeben")).toEqual({
      label: "Freigegeben",
      className: "status status-green-filled",
      icon: "✓",
    });
  });

  it("maps risk levels without reusing status badge language", () => {
    expect(getRiskVisual("hoch")).toEqual({
      label: "Termin gefaehrdet",
      className: "risk-dot risk-high",
    });
  });
});
