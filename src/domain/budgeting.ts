import { compositionProfiles } from "./compositionProfiles";
import type { CompositionProfileId, Project, ProjectPriceProfile } from "./types";

export type BudgetSignalId = "puffer" | "im-rahmen" | "beobachten" | "nachtrag-pruefen";
export type BudgetTone = "blue" | "green" | "orange" | "red";

export interface PublisherPriceProfile extends ProjectPriceProfile {
  publisher: string;
}

export interface AiUsageBucket {
  label: string;
  weight: number;
  plannedRuns: number;
  actualRuns: number;
}

export interface ProjectBudgetExtras {
  plannedImages: number;
  actualImages: number;
  plannedCorrectionRounds: number;
  actualCorrectionRounds: number;
  aiUsage: AiUsageBucket[];
}

export interface BudgetSignal {
  id: BudgetSignalId;
  label: string;
  tone: BudgetTone;
  helper: string;
}

export interface BudgetLineItem {
  id: string;
  label: string;
  detail?: string;
  unitLabel: string;
  plannedUnits: number;
  actualUnits: number;
  rate: number;
  plannedAmount: number;
  actualAmount: number;
  deltaAmount: number;
}

export interface ProjectBudgetModel {
  projectId: string;
  priceProfile: PublisherPriceProfile;
  extras: ProjectBudgetExtras;
  lines: BudgetLineItem[];
  plannedTotal: number;
  actualTotal: number;
  deltaAmount: number;
  usagePercent: number;
  signal: BudgetSignal;
  publicLabel: string;
  publicHelper: string;
}

export interface BudgetOverview {
  rows: Array<{ project: Project; budget: ProjectBudgetModel }>;
  counts: Record<BudgetSignalId, number>;
  attentionCount: number;
}

export const budgetSignals: Record<BudgetSignalId, BudgetSignal> = {
  puffer: {
    id: "puffer",
    label: "Puffer",
    tone: "blue",
    helper: "Auftragsrahmen hat aktuell deutlichen Spielraum.",
  },
  "im-rahmen": {
    id: "im-rahmen",
    label: "Im Rahmen",
    tone: "green",
    helper: "Erfasste Leistung liegt im beauftragten Rahmen.",
  },
  beobachten: {
    id: "beobachten",
    label: "Beobachten",
    tone: "orange",
    helper: "Mehrumfang absehbar. Änderungen dokumentieren.",
  },
  "nachtrag-pruefen": {
    id: "nachtrag-pruefen",
    label: "Nachtrag prüfen",
    tone: "red",
    helper: "Erfasster Umfang liegt über dem Auftragsrahmen.",
  },
};

export const publisherPriceProfiles: Record<string, PublisherPriceProfile> = {
  "Verlag Zukunft": {
    publisher: "Verlag Zukunft",
    label: "VZ Bildungsproduktion 2026",
    pageRates: { linear: 18, "image-led": 31, complex: 52 },
    imageEditingRate: 14,
    correctionRoundRate: 180,
    aiCreditRate: 2,
  },
  "Nova Books": {
    publisher: "Nova Books",
    label: "Nova Sachbuch Rahmen",
    pageRates: { linear: 16, "image-led": 29, complex: 48 },
    imageEditingRate: 12,
    correctionRoundRate: 160,
    aiCreditRate: 2,
  },
  "Grün Verlag": {
    publisher: "Grün Verlag",
    label: "Grün Nachhaltigkeit Paket",
    pageRates: { linear: 17, "image-led": 33, complex: 55 },
    imageEditingRate: 15,
    correctionRoundRate: 175,
    aiCreditRate: 2,
  },
  "Vision Media": {
    publisher: "Vision Media",
    label: "Vision Magazinlayout",
    pageRates: { linear: 19, "image-led": 36, complex: 62 },
    imageEditingRate: 18,
    correctionRoundRate: 190,
    aiCreditRate: 3,
  },
};

const defaultPriceProfile: PublisherPriceProfile = {
  publisher: "Standard",
  label: "Standardprofil",
  pageRates: { linear: 17, "image-led": 30, complex: 50 },
  imageEditingRate: 14,
  correctionRoundRate: 170,
  aiCreditRate: 2,
};

const projectBudgetExtras: Record<string, ProjectBudgetExtras> = {
  "kunst-des-satzes": {
    plannedImages: 42,
    actualImages: 51,
    plannedCorrectionRounds: 2,
    actualCorrectionRounds: 3,
    aiUsage: [
      { label: "Textassistenz", weight: 1, plannedRuns: 14, actualRuns: 18 },
      { label: "Layout-/PDF-Check", weight: 3, plannedRuns: 6, actualRuns: 9 },
      { label: "Bild-/Konzeptmodell", weight: 6, plannedRuns: 2, actualRuns: 4 },
    ],
  },
  "digital-mindset": {
    plannedImages: 18,
    actualImages: 24,
    plannedCorrectionRounds: 2,
    actualCorrectionRounds: 3,
    aiUsage: [
      { label: "Textassistenz", weight: 1, plannedRuns: 8, actualRuns: 10 },
      { label: "Layout-/PDF-Check", weight: 3, plannedRuns: 4, actualRuns: 6 },
    ],
  },
  "nachhaltig-handeln": {
    plannedImages: 64,
    actualImages: 60,
    plannedCorrectionRounds: 2,
    actualCorrectionRounds: 2,
    aiUsage: [
      { label: "Textassistenz", weight: 1, plannedRuns: 12, actualRuns: 11 },
      { label: "Bild-/Konzeptmodell", weight: 6, plannedRuns: 3, actualRuns: 3 },
    ],
  },
  "storytelling-heute": {
    plannedImages: 76,
    actualImages: 91,
    plannedCorrectionRounds: 1,
    actualCorrectionRounds: 2,
    aiUsage: [
      { label: "Textassistenz", weight: 1, plannedRuns: 10, actualRuns: 16 },
      { label: "Layout-/PDF-Check", weight: 3, plannedRuns: 5, actualRuns: 8 },
      { label: "Bild-/Konzeptmodell", weight: 6, plannedRuns: 5, actualRuns: 7 },
    ],
  },
  "design-thinking": {
    plannedImages: 24,
    actualImages: 18,
    plannedCorrectionRounds: 1,
    actualCorrectionRounds: 1,
    aiUsage: [
      { label: "Textassistenz", weight: 1, plannedRuns: 6, actualRuns: 5 },
      { label: "Layout-/PDF-Check", weight: 3, plannedRuns: 2, actualRuns: 2 },
    ],
  },
};

const emptyExtras: ProjectBudgetExtras = {
  plannedImages: 0,
  actualImages: 0,
  plannedCorrectionRounds: 0,
  actualCorrectionRounds: 0,
  aiUsage: [],
};

function getPriceProfile(project: Project): PublisherPriceProfile {
  if (project.priceProfile) {
    return {
      publisher: project.publisher,
      ...project.priceProfile,
    };
  }

  return publisherPriceProfiles[project.publisher] ?? {
    ...defaultPriceProfile,
    publisher: project.publisher,
  };
}

function getBudgetSignal(usagePercent: number): BudgetSignal {
  if (usagePercent <= 85) {
    return budgetSignals.puffer;
  }

  if (usagePercent <= 100) {
    return budgetSignals["im-rahmen"];
  }

  if (usagePercent <= 108) {
    return budgetSignals.beobachten;
  }

  return budgetSignals["nachtrag-pruefen"];
}

function createLine(
  id: string,
  label: string,
  unitLabel: string,
  plannedUnits: number,
  actualUnits: number,
  rate: number,
  detail?: string,
): BudgetLineItem {
  const plannedAmount = plannedUnits * rate;
  const actualAmount = actualUnits * rate;

  return {
    id,
    label,
    detail,
    unitLabel,
    plannedUnits,
    actualUnits,
    rate,
    plannedAmount,
    actualAmount,
    deltaAmount: actualAmount - plannedAmount,
  };
}

function createAiLine(aiUsage: AiUsageBucket[], rate: number): BudgetLineItem {
  const plannedUnits = aiUsage.reduce((sum, item) => sum + item.plannedRuns * item.weight, 0);
  const actualUnits = aiUsage.reduce((sum, item) => sum + item.actualRuns * item.weight, 0);
  const detail = aiUsage.map((item) => `${item.label} x${item.weight}`).join(" · ");

  return createLine(
    "ai-support",
    "KI-Unterstützung",
    "gewichtete Läufe",
    plannedUnits,
    actualUnits,
    rate,
    detail,
  );
}

export function formatBudgetAmount(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getProjectBudgetModel(project: Project): ProjectBudgetModel {
  const priceProfile = getPriceProfile(project);
  const extras = projectBudgetExtras[project.id] ?? emptyExtras;
  const pageLines = compositionProfiles.map((profile) => {
    const workload = project.profileWorkload.find((row) => row.profileId === profile.id);

    return createLine(
      profile.id,
      profile.shortLabel,
      "Seiten",
      workload?.plannedPages ?? 0,
      workload?.actualPages ?? 0,
      priceProfile.pageRates[profile.id],
    );
  });
  const lines = [
    ...pageLines,
    createLine(
      "image-editing",
      "Bildbearbeitung",
      "Bilder",
      extras.plannedImages,
      extras.actualImages,
      priceProfile.imageEditingRate,
    ),
    createLine(
      "correction-rounds",
      "Korrekturrunden",
      "Runden",
      extras.plannedCorrectionRounds,
      extras.actualCorrectionRounds,
      priceProfile.correctionRoundRate,
    ),
    ...(extras.aiUsage.length > 0 ? [createAiLine(extras.aiUsage, priceProfile.aiCreditRate)] : []),
  ];
  const plannedTotal = lines.reduce((sum, line) => sum + line.plannedAmount, 0);
  const actualTotal = lines.reduce((sum, line) => sum + line.actualAmount, 0);
  const usagePercent = plannedTotal === 0 ? 0 : Math.round((actualTotal / plannedTotal) * 100);
  const signal = getBudgetSignal(usagePercent);

  return {
    projectId: project.id,
    priceProfile,
    extras,
    lines,
    plannedTotal,
    actualTotal,
    deltaAmount: actualTotal - plannedTotal,
    usagePercent,
    signal,
    publicLabel: signal.label,
    publicHelper: signal.helper,
  };
}

export function getBudgetOverview(projects: Project[]): BudgetOverview {
  const rows = projects
    .map((project) => ({ project, budget: getProjectBudgetModel(project) }))
    .sort((a, b) => b.budget.usagePercent - a.budget.usagePercent || a.project.title.localeCompare(b.project.title));
  const counts = rows.reduce<Record<BudgetSignalId, number>>(
    (result, row) => {
      result[row.budget.signal.id] += 1;
      return result;
    },
    { puffer: 0, "im-rahmen": 0, beobachten: 0, "nachtrag-pruefen": 0 },
  );

  return {
    rows,
    counts,
    attentionCount: counts.beobachten + counts["nachtrag-pruefen"],
  };
}
