import { describe, expect, it } from "vitest";
import { createChapterFromDraft, getChapterDraftIssues } from "./chapterFactory";

describe("chapterFactory", () => {
  it("creates a chapter row from a focused chapter draft", () => {
    const chapter = createChapterFromDraft(
      {
        title: "Kapitel 1 - Einstieg",
        fromPage: 1,
        toPage: 24,
        ownerId: "m-schneider",
        status: "offen",
        correctionRound: "V1",
        risk: "niedrig",
        note: "Bildrechte prüfen",
      },
      { projectPages: 144, existingChapterIds: [] },
    );

    expect(chapter).toEqual({
      id: "kapitel-1-einstieg",
      title: "Kapitel 1 - Einstieg",
      pages: "S. 1-24",
      ownerId: "m-schneider",
      status: "offen",
      correctionRound: "V1",
      risk: "niedrig",
      blocker: "Bildrechte prüfen",
    });
  });

  it("reports missing title and invalid page ranges before creation", () => {
    const issues = getChapterDraftIssues(
      {
        title: "",
        fromPage: 32,
        toPage: 12,
        ownerId: "",
        status: "offen",
        correctionRound: "",
        risk: "mittel",
        note: "",
      },
      144,
    );

    expect(issues.map((issue) => issue.id)).toEqual(["title", "ownerId", "correctionRound", "pageRange"]);
  });

  it("keeps generated chapter ids unique within the project", () => {
    const chapter = createChapterFromDraft(
      {
        title: "Kapitel 1",
        fromPage: 1,
        toPage: 12,
        ownerId: "m-schneider",
        status: "offen",
        correctionRound: "V1",
        risk: "niedrig",
        note: "",
      },
      { projectPages: 144, existingChapterIds: ["kapitel-1"] },
    );

    expect(chapter.id).toBe("kapitel-1-2");
  });
});
