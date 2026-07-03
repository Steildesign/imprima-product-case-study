# Shared Production Status Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shareable production-status view that gives authors or editors a reduced, explainable project status without exposing the internal app.

**Architecture:** Keep the calculation in a domain helper and render it through a standalone route (`/status/:projectId`) outside the app shell. The cockpit gets a contextual `Status teilen` action that opens the status view for the current project.

**Tech Stack:** React, TypeScript, Vite, Vitest, existing Imprima CSS/components.

---

### Task 1: Status Domain Logic

**Files:**
- Create: `src/domain/sharedStatus.ts`
- Create: `src/domain/sharedStatus.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import { projects } from "./mockData";
import { buildSharedStatus, estimateDeliveryFeasibility, getSharedStatusPath } from "./sharedStatus";

describe("shared status", () => {
  const project = projects.find((item) => item.id === "storytelling-heute");

  it("marks a large page request as not realistic for complex layout work", () => {
    if (!project) throw new Error("Missing fixture project");

    expect(estimateDeliveryFeasibility(project, { requestedPages: 360, availableWorkdays: 3 })).toMatchObject({
      level: "not-realistic",
      capacityPages: 72,
    });
  });

  it("builds an external status payload with open scope and blockers", () => {
    if (!project) throw new Error("Missing fixture project");

    expect(buildSharedStatus(project)).toMatchObject({
      sharePath: "/status/storytelling-heute",
      remainingPages: 207,
      feasibility: { level: "not-realistic" },
    });
  });

  it("creates a stable share path", () => {
    expect(getSharedStatusPath("kunst-des-satzes")).toBe("/status/kunst-des-satzes");
  });
});
```

- [ ] **Step 2: Run targeted tests and verify RED**

Run: `npm test -- src/domain/sharedStatus.test.ts`
Expected: fails because `./sharedStatus` does not exist.

- [ ] **Step 3: Implement minimal domain helper**

Create `src/domain/sharedStatus.ts` with:
- `getSharedStatusPath(projectId)`
- `estimateDeliveryFeasibility(project, request)`
- `buildSharedStatus(project)`

- [ ] **Step 4: Run targeted tests and verify GREEN**

Run: `npm test -- src/domain/sharedStatus.test.ts`
Expected: all tests pass.

### Task 2: Shared Status UI

**Files:**
- Create: `src/screens/SharedStatusPage.tsx`
- Modify: `src/screens/BookCockpit.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add route mode and cockpit action**

`App.tsx` should detect `/status/:projectId`, render `SharedStatusPage` without sidebar, and pass `onOpenPrototype`.

`BookCockpit.tsx` should accept `onShareStatus(projectId)` and render a `Status teilen` button in the header.

- [ ] **Step 2: Render external status page**

`SharedStatusPage` should show:
- Project title, publisher, status date
- Progress, phase, profile, risk
- Remaining pages and open blocker/material rows
- Capacity check for `360 Seiten / 3 Arbeitstage`
- Mock actions: `Ansichtslink`, `PDF exportieren`

- [ ] **Step 3: Style and verify**

Use full-width report sections, no nested cards, responsive grids, and compact professional typography. Run browser checks for overview, cockpit action, `/status/storytelling-heute`, and mobile width.

### Task 3: Final Verification

- [ ] Run `npm test`
- [ ] Run `npm run build`
- [ ] Confirm public tunnel loads app HTML with `curl https://fine-worlds-poke.loca.lt`
- [ ] Commit with `feat: add shareable production status`
