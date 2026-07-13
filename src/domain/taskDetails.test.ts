import { describe, expect, it } from "vitest";
import { criticalCommunicationEntries } from "./communicationAssist";
import { projects } from "./mockData";
import { taskItems } from "./moduleData";

describe("task detail data", () => {
  it("connects every task to a real project and production context", () => {
    const projectIds = new Set(projects.map((project) => project.id));

    for (const task of taskItems) {
      expect(projectIds.has(task.projectId)).toBe(true);
      expect(task.chapter).toBeTruthy();
      expect(task.pageRange).toBeTruthy();
      expect(task.productionPhase).toBeTruthy();
      expect(task.reason).toBeTruthy();
      expect(task.impact).toBeTruthy();
      expect(task.nextStep).toBeTruthy();
      expect(task.detailStatus).toMatch(/offen|wartet|in-arbeit|erledigt/);
    }
  });

  it("links task details to decision-relevant communication entries", () => {
    const communicationById = new Map(criticalCommunicationEntries.map((entry) => [entry.id, entry]));

    for (const task of taskItems) {
      const communication = communicationById.get(task.relatedCommunicationId);

      expect(communication).toBeDefined();
      expect(communication?.projectId).toBe(task.projectId);
    }
  });
});
