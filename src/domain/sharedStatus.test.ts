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
      capacityPages: 72,
      requestedPages: 360,
      availableWorkdays: 3,
    });
  });

  it("marks a smaller image-led request as critical but negotiable", () => {
    if (!imageProject) {
      throw new Error("Missing image-led project fixture");
    }

    expect(estimateDeliveryFeasibility(imageProject, { requestedPages: 135, availableWorkdays: 3 })).toMatchObject({
      level: "critical",
      capacityPages: 126,
    });
  });

  it("builds an external status payload with open scope and blockers", () => {
    if (!complexProject) {
      throw new Error("Missing complex project fixture");
    }

    expect(buildSharedStatus(complexProject)).toMatchObject({
      projectId: "storytelling-heute",
      sharePath: "/status/storytelling-heute",
      profileLabel: "Komplexes Seitenlayout",
      progress: 25,
      remainingPages: 207,
      feasibility: { level: "not-realistic" },
    });
  });

  it("creates a stable share path", () => {
    expect(getSharedStatusPath("kunst-des-satzes")).toBe("/status/kunst-des-satzes");
  });
});
