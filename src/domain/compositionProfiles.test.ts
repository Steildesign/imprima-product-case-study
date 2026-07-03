import { describe, expect, it } from "vitest";
import { compositionProfiles, getCompositionProfile, getCompositionProfileCounts } from "./compositionProfiles";
import type { Project } from "./types";

describe("composition profiles", () => {
  it("keeps three neutral publishing workload profiles in increasing complexity order", () => {
    expect(compositionProfiles.map((profile) => profile.id)).toEqual(["linear", "image-led", "complex"]);
    expect(compositionProfiles.map((profile) => profile.label)).toEqual([
      "Linearer Satz",
      "Bildintegrierter Satz",
      "Komplexes Seitenlayout",
    ]);
    expect(compositionProfiles.map((profile) => profile.shortLabel)).toEqual(["Linear", "Bildintegriert", "Komplex"]);
  });

  it("returns profile metadata for visible project badges and cockpit details", () => {
    expect(getCompositionProfile("image-led")).toMatchObject({
      label: "Bildintegrierter Satz",
      shortLabel: "Bildintegriert",
      effortLabel: "mittlerer Aufwand",
      riskHint: "Bildplatzierung, Marginalien und Annotationen brauchen Abstimmung.",
    });
  });

  it("counts project profiles for reporting", () => {
    const projects = [
      { compositionProfile: "linear" },
      { compositionProfile: "image-led" },
      { compositionProfile: "image-led" },
      { compositionProfile: "complex" },
    ] as Project[];

    expect(getCompositionProfileCounts(projects)).toEqual([
      { profile: getCompositionProfile("linear"), count: 1 },
      { profile: getCompositionProfile("image-led"), count: 2 },
      { profile: getCompositionProfile("complex"), count: 1 },
    ]);
  });
});
