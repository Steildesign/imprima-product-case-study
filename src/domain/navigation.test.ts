import { describe, expect, it } from "vitest";
import { appNavItems } from "./navigation";

describe("app navigation", () => {
  it("keeps nine product modules without exposing the portfolio case study", () => {
    expect(appNavItems).toHaveLength(9);
    expect(appNavItems.map((item) => item.label)).toEqual([
      "Übersicht",
      "Projekte",
      "Aufgaben",
      "Korrekturen",
      "Freigaben",
      "Dateien",
      "Kalender",
      "Berichte",
      "Kommunikation",
    ]);
    expect(appNavItems.some((item) => item.label === "Case Study")).toBe(false);
  });
});
