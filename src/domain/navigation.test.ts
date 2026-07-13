import { describe, expect, it } from "vitest";
import {
  appNavItems,
  canCreateProjectFromView,
  createAppNavigationSearch,
  parseAppNavigation,
} from "./navigation";

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

  it("makes the new project action available from every product module", () => {
    expect(appNavItems.filter((item) => canCreateProjectFromView(item.id)).map((item) => item.label)).toEqual([
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
  });

  it("restores module, project and cockpit tab from the URL", () => {
    expect(parseAppNavigation("?view=projects&project=digital-mindset&tab=risk", "fallback")).toEqual({
      view: "projects",
      projectId: "digital-mindset",
      tab: "risk",
    });
    expect(parseAppNavigation("?view=approval&project=book&tab=risk", "fallback").tab).toBe("preflight");
  });

  it("creates a stable shareable app query", () => {
    expect(createAppNavigationSearch({ view: "reports", projectId: "book", tab: "overview" })).toBe(
      "?view=reports&project=book",
    );
  });
});
