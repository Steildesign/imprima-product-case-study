import { describe, expect, it } from "vitest";
import { createProjectFromDraft } from "./projectFactory";

describe("createProjectFromDraft", () => {
  it("creates a visible initial project with open status and one percent progress", () => {
    const project = createProjectFromDraft({
      title: "Atlas der Druckkunst",
      publisher: "Edition Morgen",
      isbn: "978-3-202607-01-1",
      pages: 144,
      deadline: "2026-09-18",
      leadId: "m-schneider",
      compositionProfile: "complex",
    });

    expect(project).toMatchObject({
      id: "atlas-der-druckkunst",
      title: "Atlas der Druckkunst",
      publisher: "Edition Morgen",
      isbn: "978-3-202607-01-1",
      pages: 144,
      deadline: "2026-09-18",
      deadlineLabel: "18.09.2026",
      progress: 1,
      status: "offen",
      risk: "niedrig",
      compositionProfile: "complex",
      phase: "Manuskript",
      leadId: "m-schneider",
      team: ["m-schneider"],
      chapters: [],
      correctionSteps: [],
      comments: [],
      preflight: [],
      timeline: [],
    });
  });

  it("falls back to a generated ISBN and stable id for incomplete optional input", () => {
    const project = createProjectFromDraft({
      title: "  Neues Buch  ",
      publisher: "  Verlag Test  ",
      isbn: "",
      pages: 96,
      deadline: "2026-10-02",
      leadId: "m-schneider",
      compositionProfile: "linear",
    });

    expect(project.id).toBe("neues-buch");
    expect(project.isbn).toBe("ISBN offen");
    expect(project.publisher).toBe("Verlag Test");
    expect(project.deadlineLabel).toBe("02.10.2026");
  });
});
