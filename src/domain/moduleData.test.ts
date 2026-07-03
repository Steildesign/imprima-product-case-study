import { describe, expect, it } from "vitest";
import { calendarEvents, communicationThreads, fileAssets, reportHighlights, taskItems } from "./moduleData";

describe("module mock data", () => {
  it("fills every product navigation module that is not a cockpit tab", () => {
    expect(taskItems.length).toBeGreaterThanOrEqual(4);
    expect(fileAssets.length).toBeGreaterThanOrEqual(4);
    expect(calendarEvents.length).toBeGreaterThanOrEqual(4);
    expect(reportHighlights.length).toBeGreaterThanOrEqual(3);
    expect(communicationThreads.length).toBeGreaterThanOrEqual(3);
  });
});
