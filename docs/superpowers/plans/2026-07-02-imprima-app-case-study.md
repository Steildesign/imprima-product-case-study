# Imprima App + Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clickable German Imprima product prototype and portfolio case-study page from the approved design spec.

**Architecture:** The app is a static React/Vite single-page application. Mock production data lives in typed frontend modules; navigation, filters, selected project, active tab, and lightweight prototype actions live in local React state.

**Tech Stack:** React, Vite, TypeScript, Vitest, CSS with local design tokens, static assets in `public/`.

---

## File Structure

Create this structure:

```text
.
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── brand/
│       ├── imprima-ui-kit.png
│       └── imprima-logo-identity.png
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── styles.css
    ├── components/
    │   ├── Brand.tsx
    │   ├── Button.tsx
    │   ├── Icon.tsx
    │   ├── ProgressBar.tsx
    │   ├── RiskDots.tsx
    │   ├── StatusBadge.tsx
    │   └── Tabs.tsx
    ├── domain/
    │   ├── mockData.ts
    │   ├── selectors.test.ts
    │   ├── selectors.ts
    │   ├── statusVisuals.test.ts
    │   ├── statusVisuals.ts
    │   └── types.ts
    └── screens/
        ├── BookCockpit.tsx
        ├── CaseStudy.tsx
        ├── CorrectionFlow.tsx
        ├── PreflightPanel.tsx
        ├── ProjectOverview.tsx
        └── TimelineRisk.tsx
```

Responsibilities:

- `src/domain/types.ts`: shared domain types for projects, chapters, correction steps, preflight checks, risks, and statuses.
- `src/domain/mockData.ts`: all local German mock data.
- `src/domain/selectors.ts`: pure filtering and summary functions used by screens.
- `src/domain/statusVisuals.ts`: pure visual mapping for status/risk tokens.
- `src/components/*`: reusable, presentation-only primitives.
- `src/screens/*`: product and case-study screens assembled from data and components.
- `src/App.tsx`: application shell, sidebar navigation, current screen state, selected project state.
- `src/styles.css`: design tokens, layout, component styling, responsive rules.

## Task 1: Scaffold Vite React App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Create package manifest**

Create `package.json`:

```json
{
  "name": "imprima-app-case-study",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.8.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:

```bash
npm install
```

Expected: `node_modules/` and `package-lock.json` are created. If network access is blocked, rerun with escalated permission.

- [ ] **Step 3: Add HTML entry**

Create `index.html`:

```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Imprima ist ein klickbarer UX/Product Case Study Prototyp fuer Buchproduktion, Korrekturen und Druckfreigabe."
    />
    <title>Imprima | UX/Product Case Study</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Add TypeScript config**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": []
}
```

- [ ] **Step 5: Add Vite config**

Create `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 6: Add minimal React entry**

Create `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-placeholder">
      <p className="eyebrow">IMPRIMA</p>
      <h1>Produktionsuebersicht fuer Buchprojekte</h1>
      <p>Projekt wird initialisiert.</p>
    </main>
  );
}
```

Create `src/styles.css`:

```css
:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #0d172a;
  background: #f3f4ef;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  --brand-green: #079d38;
  --positive-green: #4fcf97;
  --satz-blue: #2f8ded;
  --navy: #0d172a;
  --warm-gray: #f3f4ef;
  --soft-gray: #cfcdd4;
  --white: #ffffff;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
select {
  font: inherit;
}

.app-placeholder {
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: 12px;
  padding: 48px;
  text-align: center;
}

.eyebrow {
  margin: 0;
  color: var(--brand-green);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

h1,
p {
  margin: 0;
}
```

- [ ] **Step 7: Verify scaffold**

Run:

```bash
npm run build
```

Expected: command exits with status 0 and creates `dist/`.

- [ ] **Step 8: Commit scaffold**

Run:

```bash
git add package.json package-lock.json index.html tsconfig.json vite.config.ts src/main.tsx src/App.tsx src/styles.css
git commit -m "chore: scaffold Imprima app"
```

## Task 2: Add Domain Types, Mock Data, and Selectors

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/mockData.ts`
- Create: `src/domain/selectors.test.ts`
- Create: `src/domain/selectors.ts`

- [ ] **Step 1: Write failing selector tests**

Create `src/domain/selectors.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { projects } from "./mockData";
import {
  getActiveCorrectionStep,
  getProjectById,
  getProjectRiskCounts,
  getVisibleProjects,
  summarizePreflight,
} from "./selectors";

describe("project selectors", () => {
  it("finds the canonical hero project by id", () => {
    const project = getProjectById(projects, "kunst-des-satzes");
    expect(project.title).toBe("Die Kunst des Satzes");
    expect(project.chapters).toHaveLength(6);
  });

  it("filters projects by risk and search term", () => {
    const visible = getVisibleProjects(projects, {
      query: "digital",
      risk: "hoch",
      status: "alle",
    });
    expect(visible.map((project) => project.title)).toEqual(["Digital Mindset"]);
  });

  it("counts project risks for the production overview", () => {
    expect(getProjectRiskCounts(projects)).toEqual({
      hoch: 1,
      mittel: 2,
      niedrig: 2,
    });
  });

  it("returns the active correction step for the hero project", () => {
    const project = getProjectById(projects, "kunst-des-satzes");
    const step = getActiveCorrectionStep(project);
    expect(step.label).toBe("Autorenkorrektur");
    expect(step.state).toBe("active");
  });

  it("summarizes preflight checks", () => {
    const project = getProjectById(projects, "nachhaltig-handeln");
    expect(summarizePreflight(project.preflight)).toEqual({
      passed: 6,
      warning: 1,
      failed: 0,
      total: 7,
    });
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm run test
```

Expected: FAIL because `types.ts`, `mockData.ts`, and `selectors.ts` do not exist yet.

- [ ] **Step 3: Add domain types**

Create `src/domain/types.ts`:

```ts
export type ProductionStatus =
  | "offen"
  | "im-satz"
  | "in-korrektur"
  | "final"
  | "preflight"
  | "freigegeben";

export type RiskLevel = "niedrig" | "mittel" | "hoch";
export type CorrectionState = "done" | "active" | "planned";
export type PreflightState = "passed" | "warning" | "failed";

export interface Person {
  id: string;
  name: string;
  role: string;
  initials: string;
  tone: "green" | "blue" | "orange" | "violet" | "navy";
}

export interface Chapter {
  id: string;
  title: string;
  pages: string;
  ownerId: string;
  status: ProductionStatus;
  correctionRound: string;
  blocker?: string;
  risk: RiskLevel;
}

export interface CorrectionStep {
  id: string;
  label: string;
  owner: string;
  date: string;
  state: CorrectionState;
  note: string;
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  date: string;
  chapter: string;
  text: string;
}

export interface PreflightCheck {
  id: string;
  label: string;
  state: PreflightState;
  details: string;
}

export interface TimelinePhase {
  label: string;
  status: ProductionStatus;
  startWeek: number;
  endWeek: number;
}

export interface Project {
  id: string;
  title: string;
  publisher: string;
  isbn: string;
  pages: number;
  deadline: string;
  deadlineLabel: string;
  progress: number;
  status: ProductionStatus;
  risk: RiskLevel;
  phase: string;
  leadId: string;
  team: string[];
  chapters: Chapter[];
  correctionSteps: CorrectionStep[];
  comments: Comment[];
  preflight: PreflightCheck[];
  timeline: TimelinePhase[];
  blocker?: string;
}

export interface ProjectFilters {
  query: string;
  risk: RiskLevel | "alle";
  status: ProductionStatus | "alle";
}

export interface PreflightSummary {
  passed: number;
  warning: number;
  failed: number;
  total: number;
}
```

- [ ] **Step 4: Add mock data**

Create `src/domain/mockData.ts`:

```ts
import type { Person, Project } from "./types";

export const people: Person[] = [
  { id: "m-schneider", name: "M. Schneider", role: "Projektleiter", initials: "MS", tone: "navy" },
  { id: "j-wegner", name: "J. Wegner", role: "Satz", initials: "JW", tone: "blue" },
  { id: "l-bauer", name: "L. Bauer", role: "Korrektorat", initials: "LB", tone: "orange" },
  { id: "s-klein", name: "S. Klein", role: "Autor", initials: "SK", tone: "green" },
  { id: "s-reuter", name: "S. Reuter", role: "Redaktion", initials: "SR", tone: "violet" },
];

export const projects: Project[] = [
  {
    id: "kunst-des-satzes",
    title: "Die Kunst des Satzes",
    publisher: "Verlag Zukunft",
    isbn: "978-3-123456-78-9",
    pages: 312,
    deadline: "2026-06-24",
    deadlineLabel: "24.06.2026",
    progress: 72,
    status: "im-satz",
    risk: "mittel",
    phase: "Autorenkorrektur",
    leadId: "m-schneider",
    team: ["m-schneider", "j-wegner", "l-bauer", "s-klein"],
    blocker: "3 offene Korrekturhinweise in Kapitel 4",
    chapters: [
      { id: "kds-1", title: "Einleitung", pages: "1-24", ownerId: "j-wegner", status: "im-satz", correctionRound: "V2", risk: "niedrig" },
      { id: "kds-2", title: "Grundlagen", pages: "25-68", ownerId: "j-wegner", status: "im-satz", correctionRound: "V2", risk: "niedrig" },
      { id: "kds-3", title: "Typografie", pages: "69-122", ownerId: "l-bauer", status: "im-satz", correctionRound: "Autorenkorrektur", risk: "mittel" },
      { id: "kds-4", title: "Layout & Struktur", pages: "123-184", ownerId: "s-klein", status: "in-korrektur", correctionRound: "Autorenkorrektur", blocker: "Bildlegenden fehlen", risk: "hoch" },
      { id: "kds-5", title: "Praxis & Beispiele", pages: "185-268", ownerId: "j-wegner", status: "offen", correctionRound: "V1", risk: "mittel" },
      { id: "kds-6", title: "Anhang", pages: "269-312", ownerId: "s-reuter", status: "offen", correctionRound: "V1", risk: "niedrig" },
    ],
    correctionSteps: [
      { id: "v1", label: "V1", owner: "Erstsatz", date: "08.05.", state: "done", note: "Erfassung erstellt" },
      { id: "v2", label: "V2", owner: "Autor Review", date: "12.05.", state: "done", note: "Abgeschlossen von S. Klein" },
      { id: "autorenkorrektur", label: "Autorenkorrektur", owner: "S. Klein", date: "15.05.", state: "active", note: "In Bearbeitung" },
      { id: "schlusskorrektur", label: "Schlusskorrektur", owner: "Redaktion", date: "26.05.", state: "planned", note: "Geplant" },
      { id: "freigabe", label: "Freigabe", owner: "Herstellung", date: "28.05.", state: "planned", note: "Ausstehend" },
    ],
    comments: [
      { id: "c1", author: "S. Klein", role: "Autor", date: "15.05.", chapter: "Kapitel 4, Seite 98", text: "Bitte Bildunterschrift praezisieren." },
      { id: "c2", author: "L. Bauer", role: "Korrektorat", date: "15.05.", chapter: "Kapitel 4, Seite 102", text: "Komma nach Absatz 3 entfernen." },
    ],
    preflight: [
      { id: "pdfx", label: "PDF/X-Konformitaet", state: "passed", details: "Erfuellt" },
      { id: "fonts", label: "Schriften eingebettet", state: "passed", details: "Erfuellt" },
      { id: "wcag", label: "Barrierefreiheit WCAG 2.1", state: "warning", details: "3 Hinweise" },
      { id: "images", label: "Bildaufloesung", state: "passed", details: "Erfuellt" },
      { id: "colors", label: "Farbraum & Transparenzen", state: "passed", details: "Erfuellt" },
      { id: "links", label: "Links & Interaktivitaet", state: "passed", details: "Erfuellt" },
      { id: "meta", label: "Dokumentinformationen", state: "passed", details: "Erfuellt" },
    ],
    timeline: [
      { label: "Satz", status: "im-satz", startWeek: 20, endWeek: 23 },
      { label: "Korrektur", status: "in-korrektur", startWeek: 22, endWeek: 25 },
      { label: "Preflight", status: "preflight", startWeek: 25, endWeek: 26 },
    ],
  },
  {
    id: "digital-mindset",
    title: "Digital Mindset",
    publisher: "Nova Books",
    isbn: "978-3-445566-10-4",
    pages: 248,
    deadline: "2026-06-10",
    deadlineLabel: "10.06.2026",
    progress: 45,
    status: "in-korrektur",
    risk: "hoch",
    phase: "V2 blockiert",
    leadId: "s-reuter",
    team: ["s-reuter", "j-wegner", "l-bauer"],
    blocker: "Autorenfeedback seit 4 Tagen ueberfaellig",
    chapters: [],
    correctionSteps: [],
    comments: [],
    preflight: [],
    timeline: [
      { label: "Satz", status: "im-satz", startWeek: 19, endWeek: 21 },
      { label: "Korrektur", status: "in-korrektur", startWeek: 21, endWeek: 25 },
    ],
  },
  {
    id: "nachhaltig-handeln",
    title: "Nachhaltig handeln",
    publisher: "Gruen Verlag",
    isbn: "978-3-445566-88-6",
    pages: 196,
    deadline: "2026-06-02",
    deadlineLabel: "02.06.2026",
    progress: 88,
    status: "preflight",
    risk: "niedrig",
    phase: "Preflight",
    leadId: "m-schneider",
    team: ["m-schneider", "s-reuter"],
    chapters: [],
    correctionSteps: [],
    comments: [],
    preflight: [
      { id: "pdfx", label: "PDF/X-Konformitaet", state: "passed", details: "Erfuellt" },
      { id: "fonts", label: "Schriften eingebettet", state: "passed", details: "Erfuellt" },
      { id: "wcag", label: "Barrierefreiheit WCAG 2.1", state: "warning", details: "Alt-Texte pruefen" },
      { id: "images", label: "Bildaufloesung", state: "passed", details: "Erfuellt" },
      { id: "colors", label: "Farbraum & Transparenzen", state: "passed", details: "Erfuellt" },
      { id: "links", label: "Links & Interaktivitaet", state: "passed", details: "Erfuellt" },
      { id: "meta", label: "Dokumentinformationen", state: "passed", details: "Erfuellt" },
    ],
    timeline: [
      { label: "Preflight", status: "preflight", startWeek: 22, endWeek: 25 },
    ],
  },
  {
    id: "storytelling-heute",
    title: "Storytelling heute",
    publisher: "Vision Media",
    isbn: "978-3-987654-12-3",
    pages: 276,
    deadline: "2026-06-18",
    deadlineLabel: "18.06.2026",
    progress: 25,
    status: "im-satz",
    risk: "mittel",
    phase: "Satz",
    leadId: "j-wegner",
    team: ["j-wegner", "l-bauer"],
    chapters: [],
    correctionSteps: [],
    comments: [],
    preflight: [],
    timeline: [
      { label: "Satz", status: "im-satz", startWeek: 21, endWeek: 23 },
    ],
  },
  {
    id: "design-thinking",
    title: "Design Thinking im Unterricht",
    publisher: "Nova Books",
    isbn: "978-3-101010-55-1",
    pages: 224,
    deadline: "2026-06-29",
    deadlineLabel: "29.06.2026",
    progress: 10,
    status: "offen",
    risk: "niedrig",
    phase: "Manuskript",
    leadId: "m-schneider",
    team: ["m-schneider"],
    chapters: [],
    correctionSteps: [],
    comments: [],
    preflight: [],
    timeline: [
      { label: "Manuskript", status: "offen", startWeek: 20, endWeek: 22 },
    ],
  },
];
```

- [ ] **Step 5: Add selector implementation**

Create `src/domain/selectors.ts`:

```ts
import type { PreflightCheck, PreflightSummary, Project, ProjectFilters, RiskLevel } from "./types";

export function getProjectById(projects: Project[], id: string): Project {
  const project = projects.find((candidate) => candidate.id === id);
  if (!project) {
    throw new Error(`Project not found: ${id}`);
  }
  return project;
}

export function getVisibleProjects(projects: Project[], filters: ProjectFilters): Project[] {
  const query = filters.query.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesQuery =
      query.length === 0 ||
      project.title.toLowerCase().includes(query) ||
      project.publisher.toLowerCase().includes(query) ||
      project.isbn.toLowerCase().includes(query);
    const matchesRisk = filters.risk === "alle" || project.risk === filters.risk;
    const matchesStatus = filters.status === "alle" || project.status === filters.status;

    return matchesQuery && matchesRisk && matchesStatus;
  });
}

export function getProjectRiskCounts(projects: Project[]): Record<RiskLevel, number> {
  return projects.reduce<Record<RiskLevel, number>>(
    (counts, project) => {
      counts[project.risk] += 1;
      return counts;
    },
    { hoch: 0, mittel: 0, niedrig: 0 },
  );
}

export function getActiveCorrectionStep(project: Project) {
  return project.correctionSteps.find((step) => step.state === "active") ?? project.correctionSteps[0];
}

export function summarizePreflight(checks: PreflightCheck[]): PreflightSummary {
  return checks.reduce<PreflightSummary>(
    (summary, check) => {
      summary[check.state] += 1;
      summary.total += 1;
      return summary;
    },
    { passed: 0, warning: 0, failed: 0, total: 0 },
  );
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm run test
```

Expected: PASS with 5 tests.

- [ ] **Step 7: Commit domain layer**

Run:

```bash
git add src/domain
git commit -m "feat: add Imprima domain data"
```

## Task 3: Add Status Visuals and UI Primitives

**Files:**
- Create: `src/domain/statusVisuals.test.ts`
- Create: `src/domain/statusVisuals.ts`
- Create: `src/components/Brand.tsx`
- Create: `src/components/Button.tsx`
- Create: `src/components/Icon.tsx`
- Create: `src/components/ProgressBar.tsx`
- Create: `src/components/RiskDots.tsx`
- Create: `src/components/StatusBadge.tsx`
- Create: `src/components/Tabs.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing visual mapping tests**

Create `src/domain/statusVisuals.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getRiskVisual, getStatusVisual } from "./statusVisuals";

describe("status visual mappings", () => {
  it("maps production statuses to German labels and class names", () => {
    expect(getStatusVisual("im-satz")).toEqual({
      label: "Im Satz",
      className: "status status-blue",
      icon: "",
    });
    expect(getStatusVisual("freigegeben")).toEqual({
      label: "Freigegeben",
      className: "status status-green-filled",
      icon: "✓",
    });
  });

  it("maps risk levels without reusing status badge language", () => {
    expect(getRiskVisual("hoch")).toEqual({
      label: "Termin gefaehrdet",
      className: "risk-dot risk-high",
    });
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm run test
```

Expected: FAIL because `statusVisuals.ts` does not exist.

- [ ] **Step 3: Add visual mapping implementation**

Create `src/domain/statusVisuals.ts`:

```ts
import type { ProductionStatus, RiskLevel } from "./types";

export function getStatusVisual(status: ProductionStatus) {
  const map: Record<ProductionStatus, { label: string; className: string; icon: string }> = {
    offen: { label: "Offen", className: "status status-neutral", icon: "" },
    "im-satz": { label: "Im Satz", className: "status status-blue", icon: "" },
    "in-korrektur": { label: "In Korrektur", className: "status status-orange", icon: "" },
    final: { label: "Final", className: "status status-green-outline", icon: "✓" },
    preflight: { label: "Preflight", className: "status status-violet", icon: "" },
    freigegeben: { label: "Freigegeben", className: "status status-green-filled", icon: "✓" },
  };

  return map[status];
}

export function getRiskVisual(risk: RiskLevel) {
  const map: Record<RiskLevel, { label: string; className: string }> = {
    niedrig: { label: "Im Plan", className: "risk-dot risk-low" },
    mittel: { label: "Puffer knapp", className: "risk-dot risk-medium" },
    hoch: { label: "Termin gefaehrdet", className: "risk-dot risk-high" },
  };

  return map[risk];
}
```

- [ ] **Step 4: Add reusable components**

Create `src/components/StatusBadge.tsx`:

```tsx
import { getStatusVisual } from "../domain/statusVisuals";
import type { ProductionStatus } from "../domain/types";

interface StatusBadgeProps {
  status: ProductionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const visual = getStatusVisual(status);
  return (
    <span className={visual.className}>
      {visual.icon && <span aria-hidden="true">{visual.icon}</span>}
      {visual.label}
    </span>
  );
}
```

Create `src/components/RiskDots.tsx`:

```tsx
import { getRiskVisual } from "../domain/statusVisuals";
import type { RiskLevel } from "../domain/types";

const order: RiskLevel[] = ["hoch", "mittel", "niedrig"];

interface RiskDotsProps {
  risk: RiskLevel;
}

export function RiskDots({ risk }: RiskDotsProps) {
  const visual = getRiskVisual(risk);

  return (
    <span className="risk-dots" aria-label={visual.label}>
      {order.map((level) => (
        <span
          key={level}
          className={`${getRiskVisual(level).className}${level === risk ? " is-active" : ""}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
```

Create `src/components/ProgressBar.tsx`:

```tsx
interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const normalized = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-wrap" aria-label={label ?? `Fortschritt ${normalized}%`}>
      <span className="progress-track">
        <span className="progress-fill" style={{ width: `${normalized}%` }} />
      </span>
      <span className="progress-value">{normalized}%</span>
    </div>
  );
}
```

Create `src/components/Button.tsx`:

```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  children: ReactNode;
}

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  return (
    <button className={`button button-${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
```

Create `src/components/Tabs.tsx`:

```tsx
interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ items, activeId, onChange }: TabsProps) {
  return (
    <div className="tabs" role="tablist" aria-label="Ansichten">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === activeId}
          className={`tab${item.id === activeId ? " is-active" : ""}`}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
```

Create `src/components/Icon.tsx`:

```tsx
interface IconProps {
  name: "overview" | "projects" | "tasks" | "corrections" | "approval" | "files" | "calendar" | "reports" | "case";
}

export function Icon({ name }: IconProps) {
  return <span className={`nav-icon nav-icon-${name}`} aria-hidden="true" />;
}
```

Create `src/components/Brand.tsx`:

```tsx
export function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <span className="logo-facet logo-facet-top" />
      <span className="logo-facet logo-facet-stem" />
      <span className="logo-facet logo-facet-bottom" />
    </span>
  );
}

export function Wordmark() {
  return (
    <span className="wordmark">
      <LogoMark />
      <span className="wordmark-text">IMPRIMA</span>
    </span>
  );
}
```

- [ ] **Step 5: Add component CSS**

Append these sections to `src/styles.css`:

```css
.status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 78px;
  min-height: 24px;
  border-radius: 4px;
  padding: 4px 9px;
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}

.status-neutral {
  color: #495266;
  background: #eef0f2;
  border: 1px solid #cfcdd4;
}

.status-blue {
  color: #ffffff;
  background: #2f8ded;
  border: 1px solid #2f8ded;
}

.status-orange {
  color: #7c4a00;
  background: #fff2cf;
  border: 1px solid #f0ad1d;
}

.status-green-outline {
  color: #079d38;
  background: #ffffff;
  border: 1px solid #4fcf97;
}

.status-green-filled {
  color: #ffffff;
  background: #079d38;
  border: 1px solid #079d38;
}

.status-violet {
  color: #6d3bd6;
  background: #f5efff;
  border: 1px solid #a97cff;
}

.risk-dots {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.risk-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #d8d8de;
}

.risk-low.is-active {
  background: #079d38;
}

.risk-medium.is-active {
  background: #f2a900;
}

.risk-high.is-active {
  background: #e5362e;
}

.progress-wrap {
  display: grid;
  grid-template-columns: minmax(80px, 1fr) 42px;
  align-items: center;
  gap: 10px;
}

.progress-track {
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: #e1e4e8;
}

.progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--brand-green);
}

.progress-value {
  color: #495266;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 38px;
  border-radius: 5px;
  padding: 0 16px;
  font-weight: 800;
  cursor: pointer;
}

.button-primary {
  color: #ffffff;
  background: var(--brand-green);
  border: 1px solid var(--brand-green);
}

.button-secondary {
  color: var(--navy);
  background: #ffffff;
  border: 1px solid #d9dce2;
}

.button-tertiary {
  color: var(--brand-green);
  background: transparent;
  border: 1px solid transparent;
}

.tabs {
  display: flex;
  align-items: center;
  gap: 18px;
  border-bottom: 1px solid #e1e4e8;
}

.tab {
  min-height: 40px;
  padding: 0;
  color: #667085;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  cursor: pointer;
}

.tab.is-active {
  color: var(--brand-green);
  border-bottom-color: var(--brand-green);
}

.wordmark {
  display: inline-flex;
  align-items: center;
  gap: 16px;
}

.wordmark-text {
  color: var(--navy);
  font-size: 30px;
  font-weight: 500;
  letter-spacing: 0.4em;
}

.logo-mark {
  position: relative;
  width: 34px;
  height: 45px;
  display: inline-block;
}

.logo-facet {
  position: absolute;
  display: block;
  background: linear-gradient(135deg, #079d38, #4fcf97);
  box-shadow: inset -8px -8px 16px rgb(0 0 0 / 0.12);
}

.logo-facet-top {
  top: 0;
  left: 0;
  width: 34px;
  height: 12px;
  clip-path: polygon(0 0, 100% 0, 82% 100%, 18% 100%);
}

.logo-facet-stem {
  top: 9px;
  left: 11px;
  width: 12px;
  height: 28px;
}

.logo-facet-bottom {
  bottom: 0;
  left: 1px;
  width: 32px;
  height: 11px;
  clip-path: polygon(18% 0, 82% 0, 100% 100%, 0 100%);
}

.nav-icon {
  width: 15px;
  height: 15px;
  border: 1.5px solid currentColor;
  border-radius: 3px;
  display: inline-block;
}
```

- [ ] **Step 6: Run tests and build**

Run:

```bash
npm run test
npm run build
```

Expected: tests PASS; build exits with status 0.

- [ ] **Step 7: Commit UI primitives**

Run:

```bash
git add src/domain/statusVisuals.ts src/domain/statusVisuals.test.ts src/components src/styles.css
git commit -m "feat: add Imprima UI primitives"
```

## Task 4: Build Product Prototype Screens

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Create: `src/screens/CaseStudy.tsx`
- Create: `src/screens/ProjectOverview.tsx`
- Create: `src/screens/BookCockpit.tsx`
- Create: `src/screens/CorrectionFlow.tsx`
- Create: `src/screens/PreflightPanel.tsx`
- Create: `src/screens/TimelineRisk.tsx`

- [ ] **Step 1: Replace App shell**

Modify `src/App.tsx`:

```tsx
import { useMemo, useState } from "react";
import { Wordmark } from "./components/Brand";
import { Icon } from "./components/Icon";
import { projects } from "./domain/mockData";
import { getProjectById } from "./domain/selectors";
import { BookCockpit } from "./screens/BookCockpit";
import { CaseStudy } from "./screens/CaseStudy";
import { ProjectOverview } from "./screens/ProjectOverview";

type ViewId = "overview" | "projects" | "tasks" | "corrections" | "approval" | "files" | "calendar" | "reports" | "case";

const navItems: Array<{ id: ViewId; label: string; icon: Parameters<typeof Icon>[0]["name"] }> = [
  { id: "overview", label: "Uebersicht", icon: "overview" },
  { id: "projects", label: "Projekte", icon: "projects" },
  { id: "tasks", label: "Aufgaben", icon: "tasks" },
  { id: "corrections", label: "Korrekturen", icon: "corrections" },
  { id: "approval", label: "Freigaben", icon: "approval" },
  { id: "files", label: "Dateien", icon: "files" },
  { id: "calendar", label: "Kalender", icon: "calendar" },
  { id: "reports", label: "Berichte", icon: "reports" },
  { id: "case", label: "Case Study", icon: "case" },
];

export default function App() {
  const [view, setView] = useState<ViewId>("overview");
  const [selectedProjectId, setSelectedProjectId] = useState("kunst-des-satzes");
  const selectedProject = useMemo(() => getProjectById(projects, selectedProjectId), [selectedProjectId]);

  const showCockpit = view === "projects" || view === "corrections" || view === "approval" || view === "reports";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Wordmark />
        </div>
        <nav className="sidebar-nav" aria-label="Hauptnavigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item${view === item.id ? " is-active" : ""}`}
              onClick={() => setView(item.id)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="profile-chip">
          <span className="avatar">MS</span>
          <span>
            <strong>M. Schneider</strong>
            <small>Projektleiter</small>
          </span>
        </div>
      </aside>

      <main className="workspace">
        {view === "case" ? (
          <CaseStudy onOpenPrototype={() => setView("overview")} />
        ) : showCockpit ? (
          <BookCockpit project={selectedProject} initialTab={view === "corrections" ? "corrections" : view === "approval" ? "preflight" : view === "reports" ? "risk" : "overview"} />
        ) : (
          <ProjectOverview
            projects={projects}
            onSelectProject={(projectId) => {
              setSelectedProjectId(projectId);
              setView("projects");
            }}
          />
        )}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Create temporary case-study stub**

Create `src/screens/CaseStudy.tsx`:

```tsx
import { Button } from "../components/Button";

interface CaseStudyProps {
  onOpenPrototype: () => void;
}

export function CaseStudy({ onOpenPrototype }: CaseStudyProps) {
  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Case Study</p>
          <h1>Imprima UX/Product Case Study</h1>
          <p className="muted">Die ausformulierte Case-Study-Seite entsteht im naechsten Task.</p>
        </div>
        <Button onClick={onOpenPrototype}>Prototyp ansehen</Button>
      </header>
    </section>
  );
}
```

- [ ] **Step 3: Create project overview screen**

Create `src/screens/ProjectOverview.tsx`:

```tsx
import { useMemo, useState } from "react";
import { Button } from "../components/Button";
import { ProgressBar } from "../components/ProgressBar";
import { RiskDots } from "../components/RiskDots";
import { StatusBadge } from "../components/StatusBadge";
import { getVisibleProjects } from "../domain/selectors";
import type { Project, ProjectFilters, RiskLevel } from "../domain/types";

interface ProjectOverviewProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

const riskOptions: Array<RiskLevel | "alle"> = ["alle", "hoch", "mittel", "niedrig"];

export function ProjectOverview({ projects, onSelectProject }: ProjectOverviewProps) {
  const [filters, setFilters] = useState<ProjectFilters>({ query: "", risk: "alle", status: "alle" });
  const visibleProjects = useMemo(() => getVisibleProjects(projects, filters), [filters, projects]);

  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Projektuebersicht</p>
          <h1>Projekte</h1>
        </div>
        <Button>+ Neues Projekt</Button>
      </header>

      <div className="toolbar">
        <label className="search-field">
          <span className="sr-only">Suche</span>
          <input
            value={filters.query}
            onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
            placeholder="Suche nach Titel, Verlag, ISBN..."
          />
        </label>
        <div className="chip-group" aria-label="Risiko filtern">
          {riskOptions.map((risk) => (
            <button
              key={risk}
              type="button"
              className={`filter-chip${filters.risk === risk ? " is-active" : ""}`}
              onClick={() => setFilters((current) => ({ ...current, risk }))}
            >
              {risk === "alle" ? "Alle" : risk}
            </button>
          ))}
        </div>
      </div>

      <div className="data-card">
        <table className="project-table">
          <thead>
            <tr>
              <th>Titel</th>
              <th>Verlag</th>
              <th>Seiten</th>
              <th>Deadline</th>
              <th>Fortschritt</th>
              <th>Status</th>
              <th>Risiko</th>
            </tr>
          </thead>
          <tbody>
            {visibleProjects.map((project) => (
              <tr key={project.id} onClick={() => onSelectProject(project.id)}>
                <td>
                  <button type="button" className="table-link">
                    {project.title}
                  </button>
                </td>
                <td>{project.publisher}</td>
                <td>{project.pages}</td>
                <td>{project.deadlineLabel}</td>
                <td>
                  <ProgressBar value={project.progress} label={`${project.title} Fortschritt`} />
                </td>
                <td>
                  <StatusBadge status={project.status} />
                </td>
                <td>
                  <RiskDots risk={project.risk} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleProjects.length === 0 && <p className="empty-state">Keine Projekte fuer diese Filter.</p>}
        <footer className="table-footer">1-{visibleProjects.length} von {projects.length} Projekten</footer>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create cockpit and panels**

Create `src/screens/BookCockpit.tsx`:

```tsx
import { useState } from "react";
import { ProgressBar } from "../components/ProgressBar";
import { RiskDots } from "../components/RiskDots";
import { StatusBadge } from "../components/StatusBadge";
import { Tabs } from "../components/Tabs";
import { people } from "../domain/mockData";
import type { Project } from "../domain/types";
import { CorrectionFlow } from "./CorrectionFlow";
import { PreflightPanel } from "./PreflightPanel";
import { TimelineRisk } from "./TimelineRisk";

interface BookCockpitProps {
  project: Project;
  initialTab: BookTab;
}

type BookTab = "overview" | "corrections" | "preflight" | "risk";

const tabs: Array<{ id: BookTab; label: string }> = [
  { id: "overview", label: "Uebersicht" },
  { id: "corrections", label: "Korrekturen" },
  { id: "preflight", label: "Preflight" },
  { id: "risk", label: "Risiko" },
];

export function BookCockpit({ project, initialTab }: BookCockpitProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const lead = people.find((person) => person.id === project.leadId);
  const team = people.filter((person) => project.team.includes(person.id));

  return (
    <section className="screen">
      <header className="cockpit-header">
        <div>
          <p className="breadcrumb">Projekte &gt; {project.title}</p>
          <h1>{project.title}</h1>
          <p className="muted">{project.publisher} | ISBN {project.isbn} | {project.pages} Seiten | Projektleitung {lead?.name}</p>
        </div>
        <StatusBadge status={project.status} />
      </header>

      <Tabs items={tabs} activeId={activeTab} onChange={(id) => setActiveTab(id as BookTab)} />

      {activeTab === "overview" && (
        <div className="cockpit-grid">
          <article className="panel progress-panel">
            <p className="panel-label">Projektfortschritt</p>
            <strong className="large-number">{project.progress}%</strong>
            <ProgressBar value={project.progress} />
            <dl className="metric-list">
              <div><dt>Phase</dt><dd>{project.phase}</dd></div>
              <div><dt>Deadline</dt><dd>{project.deadlineLabel}</dd></div>
              <div><dt>Risiko</dt><dd><RiskDots risk={project.risk} /></dd></div>
            </dl>
          </article>
          <article className="panel chapter-panel">
            <p className="panel-label">Kapitel</p>
            <table className="chapter-table">
              <thead>
                <tr>
                  <th>Kapitel</th>
                  <th>Seiten</th>
                  <th>Status</th>
                  <th>Runde</th>
                </tr>
              </thead>
              <tbody>
                {project.chapters.map((chapter) => (
                  <tr key={chapter.id}>
                    <td>
                      <strong>{chapter.title}</strong>
                      {chapter.blocker && <small>{chapter.blocker}</small>}
                    </td>
                    <td>{chapter.pages}</td>
                    <td><StatusBadge status={chapter.status} /></td>
                    <td>{chapter.correctionRound}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
          <aside className="panel side-panel">
            <p className="panel-label">Zugewiesene</p>
            {team.map((person) => (
              <div className="person-row" key={person.id}>
                <span className={`avatar avatar-${person.tone}`}>{person.initials}</span>
                <span><strong>{person.name}</strong><small>{person.role}</small></span>
              </div>
            ))}
            {project.blocker && <div className="blocker-box"><strong>Blocker</strong><span>{project.blocker}</span></div>}
          </aside>
        </div>
      )}

      {activeTab === "corrections" && <CorrectionFlow project={project} />}
      {activeTab === "preflight" && <PreflightPanel project={project} />}
      {activeTab === "risk" && <TimelineRisk projects={[project]} />}
    </section>
  );
}
```

Create `src/screens/CorrectionFlow.tsx`:

```tsx
import { useState } from "react";
import { ProgressBar } from "../components/ProgressBar";
import { getActiveCorrectionStep } from "../domain/selectors";
import type { Project } from "../domain/types";

interface CorrectionFlowProps {
  project: Project;
}

export function CorrectionFlow({ project }: CorrectionFlowProps) {
  const active = getActiveCorrectionStep(project);
  const [selectedStepId, setSelectedStepId] = useState(active?.id ?? project.correctionSteps[0]?.id);
  const selectedStep = project.correctionSteps.find((step) => step.id === selectedStepId) ?? active;

  return (
    <div className="correction-layout">
      <div className="stepper" aria-label="Korrektur- und Freigabe-Flow">
        {project.correctionSteps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            className={`step step-${step.state}${step.id === selectedStepId ? " is-selected" : ""}`}
            onClick={() => setSelectedStepId(step.id)}
          >
            <span>{index + 1}</span>
            <strong>{step.label}</strong>
            <small>{step.note}</small>
          </button>
        ))}
      </div>

      <article className="panel">
        <p className="panel-label">Aktueller Schritt</p>
        <h2>{selectedStep?.label}</h2>
        <p>{selectedStep?.note}</p>
        <dl className="metric-list">
          <div><dt>Verantwortlich</dt><dd>{selectedStep?.owner}</dd></div>
          <div><dt>Faellig am</dt><dd>28.05.2026</dd></div>
          <div><dt>Fortschritt</dt><dd><ProgressBar value={60} /></dd></div>
        </dl>
      </article>

      <article className="panel">
        <p className="panel-label">Ablauf</p>
        <ol className="activity-list">
          {project.correctionSteps.map((step) => (
            <li key={step.id} className={`activity-${step.state}`}>
              <strong>{step.label}</strong>
              <span>{step.note}</span>
              <time>{step.date}</time>
            </li>
          ))}
        </ol>
      </article>

      <article className="panel">
        <p className="panel-label">Feedback & Kommentare</p>
        <div className="version-chip">gilt jetzt: Autorenkorrektur</div>
        {project.comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <strong>{comment.author} <span>{comment.role}</span></strong>
            <p>{comment.text}</p>
            <small>{comment.chapter} | {comment.date}</small>
          </div>
        ))}
      </article>
    </div>
  );
}
```

Create `src/screens/PreflightPanel.tsx`:

```tsx
import { useState } from "react";
import { Button } from "../components/Button";
import { summarizePreflight } from "../domain/selectors";
import type { Project } from "../domain/types";

interface PreflightPanelProps {
  project: Project;
}

export function PreflightPanel({ project }: PreflightPanelProps) {
  const [approved, setApproved] = useState(false);
  const summary = summarizePreflight(project.preflight);
  const hasWarnings = summary.warning > 0 || summary.failed > 0;

  return (
    <div className="preflight-grid">
      <article className="panel preflight-list">
        <p className="panel-label">Preflight</p>
        <table className="check-table">
          <thead>
            <tr>
              <th>Pruefpunkt</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {project.preflight.map((check) => (
              <tr key={check.id}>
                <td>{check.label}</td>
                <td><span className={`check-state check-${check.state}`}>{check.state === "passed" ? "Erfuellt" : check.state === "warning" ? "Teilweise" : "Fehler"}</span></td>
                <td>{check.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      <aside className="panel result-panel">
        <div className={`result-icon${hasWarnings ? " result-warning" : ""}`}>{hasWarnings ? "!" : "✓"}</div>
        <h2>{hasWarnings ? "Pruefung mit Hinweisen" : "Pruefung erfolgreich"}</h2>
        <p>{summary.passed} von {summary.total} Pruefpunkten erfuellt. {summary.warning} Hinweise offen.</p>
        <Button onClick={() => setApproved(true)}>Druckfreigabe erteilen</Button>
        <Button variant="secondary">Bericht herunterladen</Button>
        {approved && <p className="approval-note">Druckfreigabe im Prototyp erteilt.</p>}
      </aside>
    </div>
  );
}
```

Create `src/screens/TimelineRisk.tsx`:

```tsx
import { getProjectRiskCounts } from "../domain/selectors";
import type { Project } from "../domain/types";
import { RiskDots } from "../components/RiskDots";
import { StatusBadge } from "../components/StatusBadge";

interface TimelineRiskProps {
  projects: Project[];
}

export function TimelineRisk({ projects }: TimelineRiskProps) {
  const counts = getProjectRiskCounts(projects);

  return (
    <div className="timeline-layout">
      <article className="panel timeline-panel">
        <p className="panel-label">Produktions-Timeline & Risiko</p>
        <div className="timeline-grid">
          {projects.map((project) => (
            <div className="timeline-row" key={project.id}>
              <div>
                <strong>{project.title}</strong>
                <StatusBadge status={project.status} />
              </div>
              <div className="timeline-track">
                {project.timeline.map((phase) => (
                  <span
                    key={`${project.id}-${phase.label}`}
                    className={`timeline-bar timeline-${phase.status}`}
                    style={{
                      gridColumn: `${phase.startWeek - 18} / ${phase.endWeek - 18}`,
                    }}
                  >
                    {phase.label}
                  </span>
                ))}
              </div>
              <RiskDots risk={project.risk} />
            </div>
          ))}
        </div>
      </article>
      <aside className="panel risk-summary">
        <p className="panel-label">Risikoueberblick</p>
        <dl>
          <div><dt>Hoch</dt><dd>{counts.hoch}</dd></div>
          <div><dt>Mittel</dt><dd>{counts.mittel}</dd></div>
          <div><dt>Niedrig</dt><dd>{counts.niedrig}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
```

- [ ] **Step 5: Add shell and screen CSS**

Append this layout CSS to `src/styles.css`:

```css
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  background: var(--warm-gray);
}

.sidebar {
  position: sticky;
  top: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 22px 18px;
  color: #ffffff;
  background: var(--navy);
}

.sidebar-brand .wordmark {
  gap: 10px;
}

.sidebar-brand .wordmark-text {
  color: #ffffff;
  font-size: 17px;
  letter-spacing: 0.28em;
}

.sidebar-nav {
  display: grid;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  border: 0;
  border-radius: 5px;
  padding: 0 11px;
  color: #d9dce2;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.nav-item.is-active {
  color: #ffffff;
  background: var(--brand-green);
}

.profile-chip {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid rgb(255 255 255 / 0.12);
  padding-top: 16px;
}

.profile-chip strong,
.profile-chip small {
  display: block;
}

.workspace {
  min-width: 0;
  padding: 28px;
}

.screen {
  max-width: 1320px;
  margin: 0 auto;
}

.screen-header,
.cockpit-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}

.screen h1,
.cockpit-header h1 {
  margin: 4px 0 8px;
  color: var(--navy);
  font-size: 34px;
  line-height: 1.1;
  letter-spacing: 0;
}

.muted,
.breadcrumb {
  color: #667085;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.search-field {
  flex: 1;
}

.search-field input {
  width: 100%;
  min-height: 40px;
  border: 1px solid #d9dce2;
  border-radius: 5px;
  padding: 0 13px;
  color: var(--navy);
  background: #ffffff;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  min-height: 34px;
  border: 1px solid #d9dce2;
  border-radius: 5px;
  padding: 0 12px;
  color: #495266;
  background: #ffffff;
  cursor: pointer;
  text-transform: capitalize;
}

.filter-chip.is-active {
  color: var(--brand-green);
  border-color: var(--brand-green);
}

.data-card,
.panel {
  border: 1px solid #d9dce2;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 30px rgb(13 23 42 / 0.06);
}

.data-card {
  overflow: hidden;
}

.project-table,
.chapter-table,
.check-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.project-table th,
.project-table td,
.chapter-table th,
.chapter-table td,
.check-table th,
.check-table td {
  border-bottom: 1px solid #edf0f3;
  padding: 13px 16px;
  text-align: left;
  vertical-align: middle;
}

.project-table th,
.chapter-table th,
.check-table th {
  color: #667085;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.project-table tbody tr {
  cursor: pointer;
}

.project-table tbody tr:hover {
  background: #f8faf8;
}

.table-link {
  border: 0;
  padding: 0;
  color: var(--navy);
  background: transparent;
  font-weight: 800;
  cursor: pointer;
}

.table-footer,
.empty-state {
  padding: 14px 16px;
  color: #667085;
  font-size: 13px;
}

.cockpit-grid {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr) 260px;
  gap: 16px;
  margin-top: 18px;
}

.panel {
  padding: 18px;
}

.panel-label {
  margin: 0 0 12px;
  color: var(--brand-green);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.large-number {
  display: block;
  margin-bottom: 12px;
  color: var(--navy);
  font-size: 38px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.metric-list {
  display: grid;
  gap: 10px;
  margin: 16px 0 0;
}

.metric-list div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.metric-list dt {
  color: #667085;
}

.metric-list dd {
  margin: 0;
  color: var(--navy);
  font-weight: 800;
}

.chapter-table small,
.person-row small {
  display: block;
  margin-top: 3px;
  color: #667085;
}

.person-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
}

.avatar {
  width: 32px;
  height: 32px;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  color: #ffffff;
  background: var(--navy);
  font-size: 11px;
  font-weight: 900;
}

.avatar-green {
  background: var(--brand-green);
}

.avatar-blue {
  background: var(--satz-blue);
}

.avatar-orange {
  background: #f0ad1d;
}

.avatar-violet {
  background: #8f62db;
}

.blocker-box {
  margin-top: 14px;
  border: 1px solid #f2b8b5;
  border-radius: 6px;
  padding: 12px;
  color: #a62a22;
  background: #fff5f3;
}

.blocker-box strong,
.blocker-box span {
  display: block;
}

.correction-layout {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr 1fr;
  gap: 16px;
  margin-top: 18px;
}

.stepper {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.step {
  min-height: 88px;
  border: 1px solid #d9dce2;
  border-radius: 8px;
  padding: 12px;
  color: var(--navy);
  background: #ffffff;
  cursor: pointer;
  text-align: left;
}

.step span {
  width: 26px;
  height: 26px;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: #edf0f3;
  font-weight: 900;
}

.step strong,
.step small {
  display: block;
  margin-top: 8px;
}

.step-done span,
.step-active span {
  color: #ffffff;
  background: var(--brand-green);
}

.step-active,
.step.is-selected {
  border-color: var(--brand-green);
  box-shadow: 0 0 0 3px rgb(7 157 56 / 0.12);
}

.activity-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.activity-list li {
  display: grid;
  gap: 4px;
  border-left: 3px solid #d9dce2;
  padding-left: 12px;
}

.activity-done,
.activity-active {
  border-left-color: var(--brand-green);
}

.version-chip {
  display: inline-flex;
  margin-bottom: 12px;
  border: 1px solid #4fcf97;
  border-radius: 999px;
  padding: 6px 10px;
  color: var(--brand-green);
  font-weight: 800;
}

.comment {
  border-top: 1px solid #edf0f3;
  padding: 12px 0 0;
}

.comment span,
.comment small {
  color: #667085;
}

.preflight-grid,
.timeline-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 16px;
  margin-top: 18px;
}

.check-state {
  font-weight: 900;
}

.check-passed {
  color: var(--brand-green);
}

.check-warning {
  color: #b77900;
}

.check-failed {
  color: #e5362e;
}

.result-panel {
  display: grid;
  align-content: start;
  gap: 12px;
  text-align: center;
}

.result-icon {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  justify-self: center;
  border-radius: 999px;
  color: #ffffff;
  background: var(--brand-green);
  font-size: 34px;
  font-weight: 900;
}

.result-warning {
  background: #f0ad1d;
}

.approval-note {
  color: var(--brand-green);
  font-weight: 800;
}

.timeline-grid {
  display: grid;
  gap: 14px;
}

.timeline-row {
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr) 72px;
  align-items: center;
  gap: 14px;
}

.timeline-row strong {
  display: block;
  margin-bottom: 6px;
}

.timeline-track {
  display: grid;
  grid-template-columns: repeat(10, minmax(20px, 1fr));
  min-height: 30px;
  align-items: center;
  border-radius: 5px;
  background-image: linear-gradient(to right, #edf0f3 1px, transparent 1px);
  background-size: 10% 100%;
}

.timeline-bar {
  min-height: 18px;
  border-radius: 999px;
  padding: 3px 8px;
  color: #ffffff;
  font-size: 10px;
  font-weight: 900;
  overflow: hidden;
  white-space: nowrap;
}

.timeline-im-satz {
  background: var(--satz-blue);
}

.timeline-in-korrektur {
  background: #f0ad1d;
}

.timeline-preflight {
  background: #8f62db;
}

.timeline-offen {
  background: #9aa3b2;
}

.risk-summary dl {
  display: grid;
  gap: 12px;
  margin: 0;
}

.risk-summary div {
  display: flex;
  justify-content: space-between;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 6: Run build**

Run:

```bash
npm run build
```

Expected: build exits with status 0.

- [ ] **Step 7: Commit product screens**

Run:

```bash
git add src/App.tsx src/screens src/styles.css
git commit -m "feat: build Imprima product prototype"
```

## Task 5: Build Portfolio Case Study Page and Add Brand Boards

**Files:**
- Modify: `src/screens/CaseStudy.tsx`
- Modify: `src/styles.css`
- Create by copying: `public/brand/imprima-ui-kit.png`
- Create by copying: `public/brand/imprima-logo-identity.png`

- [ ] **Step 1: Copy brand boards into public assets**

Run:

```bash
mkdir -p public/brand
cp "/Users/hal9000/Documents/Imprima/Design System/Imprima Ui UX Kit.png" public/brand/imprima-ui-kit.png
cp "/Users/hal9000/Documents/Imprima/Design System/Imprima_Logo_und_visuelle_Idendität.png" public/brand/imprima-logo-identity.png
```

Expected: both files exist under `public/brand/`.

- [ ] **Step 2: Create case-study screen**

Create `src/screens/CaseStudy.tsx`:

```tsx
import { Button } from "../components/Button";
import { Wordmark } from "../components/Brand";

interface CaseStudyProps {
  onOpenPrototype: () => void;
}

const decisions = [
  "Eine Quelle der Wahrheit statt fuenf verstreuter Kanaele.",
  "Ein eindeutiger Status je Kapitel erzwingt Klarheit im Team.",
  "Zustand, Risiko und Marke erhalten getrennte visuelle Rollen.",
  "Inter bleibt im Tool, weil Datendichte Ruhe und Lesbarkeit braucht.",
  "Barrierefreiheit ist ein Produkt-Schritt, kein Nachgedanke.",
  "Gruen ist Zielzustand: Am Ende steht die Freigabe.",
];

export function CaseStudy({ onOpenPrototype }: CaseStudyProps) {
  return (
    <article className="case-study">
      <section className="case-hero">
        <div>
          <p className="eyebrow">UX/UI | Product Design | 2026</p>
          <Wordmark />
          <h1>Struktur schaffen. Korrekturen steuern. Druckfreigabe sichern.</h1>
          <p>
            Imprima ist ein Dashboard fuer professionelle Buchproduktion. Von Satz ueber
            Korrektur bis zur Druckfreigabe macht es sichtbar, wo jedes Kapitel steht,
            wer worauf wartet und ob der Termin haelt.
          </p>
          <Button onClick={onOpenPrototype}>Prototyp ansehen</Button>
        </div>
        <div className="case-meta">
          <dl>
            <div><dt>Kunde</dt><dd>Eigenprojekt</dd></div>
            <div><dt>Disziplin</dt><dd>UX/UI, Product Design</dd></div>
            <div><dt>Rolle</dt><dd>Konzept, UX, UI, Design-System</dd></div>
            <div><dt>Typ</dt><dd>Case Study auf realer Verlagserfahrung</dd></div>
          </dl>
        </div>
      </section>

      <section className="case-section case-two-col">
        <div>
          <p className="eyebrow">Ausgangslage</p>
          <h2>Der Status eines 600-Seiten-Bandes liegt heute oft in fuenf Systemen.</h2>
        </div>
        <p>
          E-Mail-Threads, Excel-Listen, PDF-Markups, InDesign-Staende und muendliche
          Zurufe erzeugen Reibung. Herstellung, Redaktion und Satz sehen nicht dieselbe
          Wahrheit. Risiken werden sichtbar, wenn der Drucktermin bereits wackelt.
        </p>
      </section>

      <section className="case-section persona-grid">
        {[
          ["Katrin", "Herstellung", "Alle laufenden Titel, Deadlines und Risiken auf einen Blick."],
          ["Markus", "Satz", "Eine klare Arbeitsschlange mit aktuellem Stand und Korrektureingang."],
          ["Sabine", "Redaktion", "Korrekturlaufe, Versionen und wartende Freigaben nachvollziehen."],
        ].map(([name, role, text]) => (
          <article className="panel" key={name}>
            <p className="panel-label">{role}</p>
            <h3>{name}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="case-section flow-band">
        <p className="eyebrow">Prozess</p>
        <h2>Vom Manuskript bis zur Druckfreigabe</h2>
        <div className="flow-steps">
          {["Manuskript", "Satz", "Korrektur", "Freigabe", "Preflight", "WCAG-PDF", "Druckfreigabe"].map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </section>

      <section className="case-section decision-grid">
        <p className="eyebrow">Designentscheidungen</p>
        {decisions.map((decision, index) => (
          <article className="decision-card" key={decision}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{decision}</p>
          </article>
        ))}
      </section>

      <section className="case-section system-board">
        <div>
          <p className="eyebrow">Design System</p>
          <h2>Gruenes Geschwister zu TYMETRA, aber eigenstaendiges Produkt.</h2>
          <p>
            Marken-Gruen fuehrt Interaktionen, Satz-Blau bleibt semantischer Status,
            Positiv-Gruen signalisiert Fertigstellung und Freigabe.
          </p>
        </div>
        <img src="/brand/imprima-logo-identity.png" alt="Imprima Logo und visuelle Identitaet" />
        <img src="/brand/imprima-ui-kit.png" alt="Imprima UI Kit und Produktscreens" />
      </section>

      <section className="case-section reflection">
        <p className="eyebrow">Reflexion</p>
        <h2>Der Prototyp zeigt den Happy Path, nicht die komplette Verlagssystem-Landschaft.</h2>
        <p>
          Eine spaetere Produktversion koennte InDesign-Exports, echte PDF-Pruefungen,
          Rollenrechte und Verlagssystem-Integrationen anbinden. Fuer die Case Study reicht
          der klickbare Kern: Sichtbarkeit, Korrekturlauf, Risiko und Freigabe.
        </p>
      </section>
    </article>
  );
}
```

- [ ] **Step 3: Add case-study CSS**

Append this CSS to `src/styles.css`:

```css
.case-study {
  max-width: 1360px;
  margin: 0 auto;
  color: var(--navy);
}

.case-hero {
  min-height: 72vh;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) 360px;
  align-items: center;
  gap: 48px;
  border-bottom: 1px solid #d9dce2;
  padding: 38px 0 56px;
}

.case-hero .wordmark {
  margin: 18px 0 28px;
}

.case-hero .wordmark-text {
  font-size: clamp(32px, 5vw, 72px);
  letter-spacing: 0.36em;
}

.case-hero h1 {
  max-width: 760px;
  margin: 0 0 18px;
  font-size: clamp(38px, 6vw, 82px);
  line-height: 0.95;
  letter-spacing: 0;
}

.case-hero p {
  max-width: 720px;
  color: #495266;
  font-size: 18px;
  line-height: 1.7;
}

.case-meta {
  border-left: 1px solid #d9dce2;
  padding-left: 28px;
}

.case-meta dl,
.case-meta div {
  display: grid;
  gap: 12px;
}

.case-meta dl {
  margin: 0;
}

.case-meta dt {
  color: var(--brand-green);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.case-meta dd {
  margin: 0 0 14px;
  font-weight: 800;
}

.case-section {
  padding: 64px 0;
  border-bottom: 1px solid #d9dce2;
}

.case-two-col {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 56px;
}

.case-section h2 {
  margin: 0;
  font-size: clamp(28px, 4vw, 52px);
  line-height: 1.05;
  letter-spacing: 0;
}

.case-section p {
  color: #495266;
  line-height: 1.75;
}

.persona-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.persona-grid h3 {
  margin: 0 0 10px;
  font-size: 24px;
}

.flow-band {
  background: #ffffff;
  margin-inline: -28px;
  padding-inline: 28px;
}

.flow-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.flow-steps span {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  border: 1px solid #d9dce2;
  border-radius: 5px;
  padding: 0 14px;
  background: #ffffff;
  font-weight: 800;
}

.decision-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.decision-grid > .eyebrow {
  grid-column: 1 / -1;
}

.decision-card {
  min-height: 160px;
  border: 1px solid #d9dce2;
  border-radius: 8px;
  padding: 18px;
  background: #ffffff;
}

.decision-card span {
  color: var(--brand-green);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
}

.decision-card p {
  margin: 16px 0 0;
  color: var(--navy);
  font-weight: 800;
  line-height: 1.5;
}

.system-board {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

.system-board > div {
  grid-row: span 2;
}

.system-board img {
  width: 100%;
  height: auto;
  display: block;
  border: 1px solid #d9dce2;
  border-radius: 8px;
  background: #ffffff;
}

.reflection {
  max-width: 900px;
  border-bottom: 0;
}
```

- [ ] **Step 4: Run build**

Run:

```bash
npm run build
```

Expected: build exits with status 0 and referenced images are included in `dist/brand/`.

- [ ] **Step 5: Commit case study**

Run:

```bash
git add src/screens/CaseStudy.tsx src/styles.css public/brand
git commit -m "feat: add Imprima portfolio case study"
```

## Task 6: Responsive Polish, Accessibility, and Verification

**Files:**
- Modify: `src/styles.css`
- Create: `README.md`

- [ ] **Step 1: Add README**

Create `README.md`:

```markdown
# Imprima

Imprima is a German UX/Product Design case-study prototype for professional book production.

It contains:

- a clickable product dashboard prototype
- realistic local mock data
- a German portfolio case-study page
- an Imprima design system based on the supplied brand and UI kit boards

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm run test
npm run build
```

## Scope

This is a static portfolio prototype. It has no backend, no database, no login, and no real PDF or WCAG analysis.
```

- [ ] **Step 2: Polish responsive CSS**

Modify `src/styles.css`:

```css
@media (max-width: 1100px) {
  .app-shell {
    grid-template-columns: 84px minmax(0, 1fr);
  }

  .sidebar .wordmark-text,
  .nav-item span,
  .profile-chip span:not(.avatar) {
    display: none;
  }

  .cockpit-grid,
  .correction-layout,
  .preflight-grid,
  .timeline-layout,
  .case-hero,
  .case-two-col {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .app-shell {
    display: block;
  }

  .sidebar {
    position: static;
    width: 100%;
    min-height: auto;
  }

  .sidebar-nav {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .workspace,
  .screen,
  .case-study {
    padding: 18px;
  }

  .project-table,
  .chapter-table,
  .check-table {
    min-width: 760px;
  }

  .data-card,
  .chapter-panel,
  .preflight-list {
    overflow-x: auto;
  }

  .wordmark-text {
    font-size: 22px;
    letter-spacing: 0.24em;
  }
}
```

- [ ] **Step 3: Run automated verification**

Run:

```bash
npm run test
npm run build
```

Expected: tests PASS; build exits with status 0.

- [ ] **Step 4: Start local dev server**

Run:

```bash
npm run dev
```

Expected: Vite prints a local URL, usually `http://127.0.0.1:5173/`.

- [ ] **Step 5: Manual browser verification**

Open the local URL and verify:

- Project overview renders with five projects.
- Clicking "Die Kunst des Satzes" opens the book cockpit.
- Tabs switch between Uebersicht, Korrekturen, Preflight, and Risiko.
- The Case Study navigation item opens the German portfolio page.
- The brand boards render inside the Case Study page.
- No table text overlaps at desktop width.
- At a narrow viewport, tables scroll horizontally instead of crushing text.

- [ ] **Step 6: Commit final polish**

Run:

```bash
git add README.md src/styles.css
git commit -m "docs: add usage and responsive polish"
```

## Self-Review

Spec coverage:

- Product prototype: covered by Tasks 2, 3, and 4.
- German portfolio case study: covered by Task 5.
- Imprima brand and UI kit assets: covered by Tasks 3 and 5.
- Mock data with realistic book production examples: covered by Task 2.
- Local static architecture without backend: covered by Tasks 1 and 2.
- Accessibility and responsive checks: covered by Task 6.

Type consistency:

- `Project`, `ProductionStatus`, `RiskLevel`, and selector names are defined before usage.
- Screen components import the domain and component names introduced in earlier tasks.
- `CaseStudy` is created as a temporary buildable screen in Task 4 and replaced with the complete portfolio page in Task 5.

Execution note:

- Each task includes a build or test checkpoint before the commit step.
