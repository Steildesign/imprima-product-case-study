import { describe, expect, it } from "vitest";
import { projects } from "./mockData";
import { buildSharedStatus, estimateDeliveryFeasibility, getSharedStatusPath } from "./sharedStatus";

describe("shared status", () => {
  const complexProject = projects.find((project) => project.id === "storytelling-heute");
  const imageProject = projects.find((project) => project.id === "kunst-des-satzes");

  it("marks a large page request as not realistic for complex layout work", () => {
    if (!complexProject) {
      throw new Error("Missing complex project fixture");
    }

    expect(estimateDeliveryFeasibility(complexProject, { requestedPages: 360, availableWorkdays: 3 })).toMatchObject({
      level: "not-realistic",
      capacityPages: 99,
      requestedPages: 360,
      availableWorkdays: 3,
    });
  });

  it("marks a smaller mixed image-led request as critical but negotiable", () => {
    if (!imageProject) {
      throw new Error("Missing image-led project fixture");
    }

    expect(estimateDeliveryFeasibility(imageProject, { requestedPages: 95, availableWorkdays: 3 })).toMatchObject({
      level: "critical",
      capacityPages: 102,
    });
  });

  it("builds an external status payload with open scope and blockers", () => {
    if (!complexProject) {
      throw new Error("Missing complex project fixture");
    }

    expect(buildSharedStatus(complexProject)).toMatchObject({
      projectId: "storytelling-heute",
      sharePath: "/status/storytelling-heute",
      isbn: "978-3-987654-12-3",
      titleNumber: "VM-2026-0712",
      profileLabel: "Komplexes Seitenlayout",
      progress: 25,
      remainingPages: 207,
      report: {
        tone: "critical",
        headline: "Der aktuelle Umfang ist deutlich größer als geplant.",
      },
      feasibility: { level: "not-realistic" },
    });
  });

  it("provides tailored report tone and delivery request for each visible project", () => {
    expect(
      projects.map((project) => {
        const status = buildSharedStatus(project);

        return {
          projectId: status.projectId,
          tone: status.report.tone,
          requestedPages: status.feasibility.requestedPages,
          availableWorkdays: status.feasibility.availableWorkdays,
          feasibility: status.feasibility.level,
        };
      }),
    ).toEqual([
      {
        projectId: "kunst-des-satzes",
        tone: "warning",
        requestedPages: 95,
        availableWorkdays: 3,
        feasibility: "critical",
      },
      {
        projectId: "digital-mindset",
        tone: "critical",
        requestedPages: 180,
        availableWorkdays: 3,
        feasibility: "critical",
      },
      {
        projectId: "nachhaltig-handeln",
        tone: "positive",
        requestedPages: 42,
        availableWorkdays: 3,
        feasibility: "realistic",
      },
      {
        projectId: "storytelling-heute",
        tone: "critical",
        requestedPages: 360,
        availableWorkdays: 3,
        feasibility: "not-realistic",
      },
      {
        projectId: "design-thinking",
        tone: "positive",
        requestedPages: 120,
        availableWorkdays: 5,
        feasibility: "realistic",
      },
    ]);
  });

  it("creates a stable share path", () => {
    expect(getSharedStatusPath("kunst-des-satzes")).toBe("/status/kunst-des-satzes");
  });
});
