import type { CompositionProfileId, Project } from "./types";

export interface CompositionProfile {
  id: CompositionProfileId;
  label: string;
  shortLabel: string;
  effortLabel: string;
  description: string;
  riskHint: string;
  className: string;
}

export const compositionProfiles: CompositionProfile[] = [
  {
    id: "linear",
    label: "Linearer Satz",
    shortLabel: "Linear",
    effortLabel: "geringer Aufwand",
    description: "Textsatz mit Formatübernahme, Reihenlogik, Tabellen-, Absatz- und Zeichenformaten.",
    riskHint: "Formatvorlagen, Tabellenformate und Reihenlogik vor Satzstart bestätigen.",
    className: "profile-linear",
  },
  {
    id: "image-led",
    label: "Bildintegrierter Satz",
    shortLabel: "Bildintegriert",
    effortLabel: "mittlerer Aufwand",
    description: "Textsatz plus Bildplatzierung, Marginalien, Verweise, Annotationen und Abstimmung pro Seite.",
    riskHint: "Bildplatzierung, Marginalien, Annotationen und Probenabstimmung vor Freigabe klären.",
    className: "profile-image",
  },
  {
    id: "complex",
    label: "Komplexes Seitenlayout",
    shortLabel: "Komplex",
    effortLabel: "hoher Aufwand",
    description: "Variable Raster, Sonderseiten, große Bildflächen, Carving, Textumfluss und gesplittete Spalten.",
    riskHint: "Sonderseiten, Carving, Bildstrecken und Textumflüsse vor Umbruch fixieren.",
    className: "profile-complex",
  },
];

export function getCompositionProfile(id: CompositionProfileId): CompositionProfile {
  return compositionProfiles.find((profile) => profile.id === id) ?? compositionProfiles[0];
}

export function getCompositionProfileCounts(projects: Project[]) {
  return compositionProfiles.map((profile) => ({
    profile,
    count: projects.filter((project) => project.compositionProfile === profile.id).length,
  }));
}
