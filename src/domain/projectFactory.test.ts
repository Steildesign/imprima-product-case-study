import { describe, expect, it } from "vitest";
import { createProjectFromDraft, getProjectDraftIssues } from "./projectFactory";

describe("createProjectFromDraft", () => {
  it("creates a visible initial project with open status and one percent progress", () => {
    const project = createProjectFromDraft({
      title: "Atlas der Druckkunst",
      publisher: "Edition Morgen",
      isbn: "978-3-202607-01-1",
      titleNumber: "EM-2026-4187",
      pages: 144,
      deadline: "2026-09-18",
      leadId: "m-schneider",
      compositionProfile: "complex",
      profilePlan: {
        linear: 80,
        "image-led": 40,
        complex: 24,
      },
      priceProfile: {
        label: "Individueller Auftrag",
        pageRates: {
          linear: 21,
          "image-led": 34,
          complex: 58,
        },
        imageEditingRate: 14,
        correctionRoundRate: 170,
        aiCreditRate: 2,
      },
    });

    expect(project).toMatchObject({
      id: "atlas-der-druckkunst",
      title: "Atlas der Druckkunst",
      publisher: "Edition Morgen",
      isbn: "978-3-202607-01-1",
      titleNumber: "EM-2026-4187",
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
      priceProfile: {
        label: "Individueller Auftrag",
        pageRates: {
          linear: 21,
          "image-led": 34,
          complex: 58,
        },
        imageEditingRate: 14,
        correctionRoundRate: 170,
        aiCreditRate: 2,
      },
      profileWorkload: [
        { profileId: "linear", plannedPages: 80, actualPages: 80, completedPages: 1, issueCount: 0 },
        { profileId: "image-led", plannedPages: 40, actualPages: 40, completedPages: 0, issueCount: 0 },
        { profileId: "complex", plannedPages: 24, actualPages: 24, completedPages: 0, issueCount: 0 },
      ],
    });
  });

  it("trims required identifiers and creates a stable id", () => {
    const project = createProjectFromDraft({
      title: "  Neues Buch  ",
      publisher: "  Verlag Test  ",
      isbn: "  978-3-202610-02-5  ",
      titleNumber: "  VT-2026-011  ",
      pages: 96,
      deadline: "2026-10-02",
      leadId: "m-schneider",
      compositionProfile: "linear",
      profilePlan: {
        linear: 96,
        "image-led": 0,
        complex: 0,
      },
    });

    expect(project.id).toBe("neues-buch");
    expect(project.isbn).toBe("978-3-202610-02-5");
    expect(project.titleNumber).toBe("VT-2026-011");
    expect(project.publisher).toBe("Verlag Test");
    expect(project.deadlineLabel).toBe("02.10.2026");
  });

  it("rejects projects without ISBN or title number", () => {
    const draft = {
      title: "Unvollständiger Titel",
      publisher: "Verlag Test",
      isbn: "978-3-202610-02-5",
      titleNumber: "VT-2026-011",
      pages: 96,
      deadline: "2026-10-02",
      leadId: "m-schneider",
      compositionProfile: "linear" as const,
      profilePlan: {
        linear: 96,
        "image-led": 0,
        complex: 0,
      },
    };

    expect(() => createProjectFromDraft({ ...draft, isbn: "" })).toThrow("ISBN");
    expect(() => createProjectFromDraft({ ...draft, titleNumber: "" })).toThrow("Titelnummer");
  });

  it("reports missing required project fields before creation", () => {
    const issues = getProjectDraftIssues({
      title: "",
      publisher: "",
      isbn: "",
      titleNumber: "",
      pages: 0,
      deadline: "",
      leadId: "m-schneider",
      compositionProfile: "linear",
      profilePlan: {
        linear: 0,
        "image-led": 0,
        complex: 0,
      },
    });

    expect(issues.map((issue) => issue.id)).toEqual([
      "title",
      "publisher",
      "isbn",
      "titleNumber",
      "deadline",
      "pages",
      "profilePlan",
    ]);
  });

  it("rejects projects when the planned Satzmix does not match the page count", () => {
    const draft = {
      title: "Unsauberer Satzmix",
      publisher: "Verlag Test",
      isbn: "978-3-202610-03-2",
      titleNumber: "VT-2026-012",
      pages: 144,
      deadline: "2026-10-02",
      leadId: "m-schneider",
      compositionProfile: "linear" as const,
      profilePlan: {
        linear: 70,
        "image-led": 30,
        complex: 20,
      },
    };

    expect(getProjectDraftIssues(draft).map((issue) => issue.id)).toContain("profilePlan");
    expect(() => createProjectFromDraft(draft)).toThrow("Satzmix");
  });
});
