# Imprima App Navigation and Project Create Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separate the portfolio case study from the product app, fill the remaining app modules, and add one minimal recruiter-facing project creation interaction.

**Architecture:** Keep the existing single React/Vite app and stateful prototype model. The root path `/` renders the product app shell; `/case-study` renders the existing `CaseStudy` as a standalone portfolio page without app navigation. New app modules are static screens backed by focused mock data and the project creation flow uses local React state only.

**Tech Stack:** React, TypeScript, Vite, plain CSS, Vitest.

---

### Task 1: Domain tests for navigation and project creation

**Files:**
- Create: `src/domain/navigation.ts`
- Create: `src/domain/navigation.test.ts`
- Create: `src/domain/projectFactory.ts`
- Create: `src/domain/projectFactory.test.ts`

- [ ] **Step 1: Write failing navigation tests**

Create `src/domain/navigation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { appNavItems } from "./navigation";

describe("app navigation", () => {
  it("keeps nine product modules without exposing the portfolio case study", () => {
    expect(appNavItems).toHaveLength(9);
    expect(appNavItems.map((item) => item.label)).toEqual([
      "Übersicht",
      "Projekte",
      "Aufgaben",
      "Korrekturen",
      "Freigaben",
      "Dateien",
      "Kalender",
      "Berichte",
      "Kommunikation",
    ]);
    expect(appNavItems.some((item) => item.label === "Case Study")).toBe(false);
  });
});
```

- [ ] **Step 2: Write failing project factory tests**

Create `src/domain/projectFactory.test.ts`:

```ts
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
    });

    expect(project.id).toBe("neues-buch");
    expect(project.isbn).toBe("ISBN offen");
    expect(project.publisher).toBe("Verlag Test");
    expect(project.deadlineLabel).toBe("02.10.2026");
  });
});
```

- [ ] **Step 3: Run tests and verify RED**

Run:

```bash
npm test -- src/domain/navigation.test.ts src/domain/projectFactory.test.ts
```

Expected: tests fail because `navigation.ts` and `projectFactory.ts` do not exist yet.

### Task 2: Implement navigation and project factory

**Files:**
- Create: `src/domain/navigation.ts`
- Create: `src/domain/projectFactory.ts`
- Modify: `src/components/Icon.tsx`

- [ ] **Step 1: Add navigation domain data**

Create `src/domain/navigation.ts` with exported `ViewId`, `NavItem`, and `appNavItems`. Include `communication`; exclude `case`.

- [ ] **Step 2: Add communication icon support**

Extend `Icon` to accept `communication` and keep the icon decorative via `aria-hidden`.

- [ ] **Step 3: Add project factory**

Create `src/domain/projectFactory.ts` with `ProjectDraft` and `createProjectFromDraft`. It should trim text, slugify title, format `YYYY-MM-DD` to `DD.MM.YYYY`, set progress to `1`, status to `offen`, risk to `niedrig`, phase to `Manuskript`, and create empty workflow arrays.

- [ ] **Step 4: Verify GREEN**

Run:

```bash
npm test -- src/domain/navigation.test.ts src/domain/projectFactory.test.ts
```

Expected: new tests pass.

### Task 3: Separate case study route from product app

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/screens/CaseStudy.tsx`
- Modify: `src/styles.css`
- Modify: `README.md`

- [ ] **Step 1: Route `/case-study` to standalone page**

In `App.tsx`, derive a route mode from `window.location.pathname`. If it is `/case-study`, render `CaseStudy` without `.app-shell` and without sidebar. The `Prototyp ansehen` CTA should push `/` into browser history and show `overview`.

- [ ] **Step 2: Remove Case Study from app nav**

Use `appNavItems` from `src/domain/navigation.ts`. The app shell should show exactly nine product modules, ending with `Kommunikation`.

- [ ] **Step 3: Document standalone URL**

Add `/case-study` to `README.md` as the portfolio overview page.

### Task 4: Fill remaining app modules

**Files:**
- Create: `src/domain/moduleData.ts`
- Create: `src/screens/TasksScreen.tsx`
- Create: `src/screens/FilesScreen.tsx`
- Create: `src/screens/CalendarScreen.tsx`
- Create: `src/screens/ReportsScreen.tsx`
- Create: `src/screens/CommunicationScreen.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add focused module mock data**

Create `moduleData.ts` with static arrays for tasks, files, calendar events, report metrics, and communication threads. Keep data close to book production.

- [ ] **Step 2: Add five screen components**

Each screen should use existing `.screen`, `.panel`, `.data-card`, and list/table patterns. No empty placeholder pages remain.

- [ ] **Step 3: Wire modules in `App.tsx`**

Render `TasksScreen`, `FilesScreen`, `CalendarScreen`, `ReportsScreen`, and `CommunicationScreen` for their matching nav ids. Keep `Korrekturen` and `Freigaben` connected to the selected book cockpit tabs.

### Task 5: Add minimal new project flow

**Files:**
- Create: `src/screens/NewProjectDialog.tsx`
- Modify: `src/App.tsx`
- Modify: `src/screens/ProjectOverview.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add controlled dialog component**

Create a modal dialog with fields: title, publisher, optional ISBN, pages, deadline, and disabled/default lead display `M. Schneider`.

- [ ] **Step 2: Create project on submit**

In `App.tsx`, maintain `projectList` state initialized from mock `projects`. On submit, call `createProjectFromDraft`, prepend the new project, select it, and open cockpit overview.

- [ ] **Step 3: Preserve prototype scope**

Do not persist to localStorage or backend. Reload resets to the original mock state.

### Task 6: Verification and commit

**Files:**
- All changed files.

- [ ] **Step 1: Run automated verification**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and Vite build succeeds.

- [ ] **Step 2: Browser smoke test**

Verify:
- app nav has no `Case Study`
- app nav has `Kommunikation`
- `/case-study` shows standalone case study
- `Neues Projekt` opens a dialog
- submitting a project prepends it with `1%`, `Offen`, and `Im Plan`
- empty cockpit states render for the new project

- [ ] **Step 3: Commit**

Run:

```bash
git add docs/superpowers/plans/2026-07-03-imprima-app-navigation-and-project-create.md src README.md
git commit -m "feat: separate case study and add app interactions"
```

## Self-Review

- Spec coverage: App navigation separation, standalone case study, filled modules, and minimal new project creation are all covered.
- Placeholder scan: No `TODO`, `TBD`, or deferred requirements remain.
- Type consistency: `ViewId`, `ProjectDraft`, and `Project` fields match the existing app and domain types.
