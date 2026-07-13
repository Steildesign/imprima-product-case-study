import { describe, expect, it } from "vitest";
import { projects } from "./mockData";
import {
  criticalCommunicationEntries,
  getAssistPromptAnswer,
  getProjectCommunicationEntries,
} from "./communicationAssist";

describe("communication assist", () => {
  it("keeps decision-relevant communication attached to every mock project", () => {
    for (const project of projects) {
      expect(getProjectCommunicationEntries(project.id).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("summarizes open clarification points for the selected project", () => {
    const project = projects.find((item) => item.id === "kunst-des-satzes");

    expect(project).toBeDefined();
    const answer = getAssistPromptAnswer(project!, "open-clarifications");

    expect(answer.tone).toBe("attention");
    expect(answer.summary).toContain("Bildlegenden");
    expect(answer.relatedEntryIds.length).toBeGreaterThanOrEqual(1);
  });

  it("can generate a calm external reply draft from decision entries", () => {
    const project = projects.find((item) => item.id === "digital-mindset");

    expect(project).toBeDefined();
    const answer = getAssistPromptAnswer(project!, "reply-draft");

    expect(answer.summary).toContain("sachlich");
    expect(answer.body).toContain("Rückmeldung");
    expect(answer.body).toContain("Termin");
  });

  it("keeps positive projects from sounding unnecessarily negative", () => {
    const project = projects.find((item) => item.id === "nachhaltig-handeln");

    expect(project).toBeDefined();
    const answer = getAssistPromptAnswer(project!, "status-summary");

    expect(answer.tone).toBe("positive");
    expect(answer.body).toContain("Freigabefenster");
  });

  it("marks only decision-relevant entries as assist sources", () => {
    expect(criticalCommunicationEntries.every((entry) => entry.decisionRelevant)).toBe(true);
  });
});
