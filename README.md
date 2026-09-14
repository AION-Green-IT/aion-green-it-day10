# AION Green IT — Day 10

**Energy-Efficient Software & Green Coding Principles** — the interactive working companion
for Day 10. Curriculum source: Module 7 (Day 1 of 2), "Achieving Energy Efficiency in
Programming," per the official Strukturplan (Design — Day 10).

This repo began as the abandoned Day 9 scaffold and was migrated wholesale to Day 10. All
Day 9 case content (UrbanByte Consulting, green workplace, device lifetimes) has been
removed rather than left dormant; only genuinely shared cross-day infrastructure was kept.

**Status: complete.** All three routes are built, building clean, and their export pipelines
are verified. No route is gated on any other — every page is reachable directly by URL, and a
soft order-suggestion banner is the only cross-route signal.

## What's here

- **Static export.** `output: "export"` — `npm run build` writes a plain static site to
  `out/`, servable by anything. No backend, no auth, no runtime.
- **Local-only state.** Zustand + `persist` to `localStorage` under the key
  `aion-greenit-day10`, distinct from every other day's storage so several days can be open
  in one browser without colliding.
- **No extra libraries.** Native HTML5 drag events, CSS-only keyframe animation, inline SVG,
  and a Blob download for export. Dependencies: `next`, `react`, `zustand`, `clsx`.

## Routes

| Route | Case | Deliverable | Status |
|---|---|---|---|
| `/route-1-foundations` | AppNexa Solutions | Diagnosis Report | **built** |
| `/route-2-application` | AppNexa Solutions | Prioritization Memo | **built** |
| `/route-3-management-decision` | SoftPulse (worked example) → CodeVista | Board Memo | **built** |

**Export filenames** follow `{taskNumber}-{name}-day10-l{level}task{taskNumber}` — e.g.
`1-muchson-day10-l1task1`. The leading number is the task's number *within its route*, and
`l{level}` identifies which route the file came from. One shared generator:
`lib/downloadFile.ts`.

## Route 1 — Foundations: Reading the System

Level 1. About 60 minutes of material and 20 minutes of task.

**Material (six sections, A–F).** Why software has a carbon footprint at all — every
instruction, stored byte and transmitted byte is a physical electricity draw, with the IEA's
2024 figure (data centres ≈415 TWh, ~1.5% of global electricity, growing ~12%/year) and the
split-incentive problem that keeps it invisible. Functionally correct versus energy-efficient
as two orthogonal questions, laid out as a 2×2. The Software Carbon Intensity specification
(ISO/IEC 21031:2024) and its formula, `C = ((E × I) + M) per R`, as a rate rather than a
total. The three Green Software Foundation working principles and which SCI variable each
one moves. The six categories where inefficiency hides. And why the lever for most of them
sits at the standards layer, not with individual engineers — with iSAQB's CPSA Advanced
Level Module GREEN as the professional reference point.

Every section carries a `reasoning[]` block ("How to decide when this comes up in the task")
and at least one real external source.

**Task 1 — AppNexa System Trace.** The learner inspects six flagged components on AppNexa's
live system trace, sorts each symptom into one of the six categories, picks an improvement
lever from four options, justifies it against the original behaviour, and marks it Quick Fix
or Structural Fix. The Diagnosis Report assembles itself on the right as they go, and exports
as JSON (raw answers plus correctness flags, for grading) and a standalone print-ready HTML
document.

## Route 2 — Application: Choosing Where to Spend Effort

Level 2. About 60 minutes of material and 20 minutes of task. Same company as Route 1,
continuing the narrative: Route 1 diagnosed the problems, Route 2 decides what to fund.

**Material (five sections, A-E).** The real constraint - four hard edges on AppNexa's
quarter, none of them technical, which turn this from a technical question into a
resource-allocation question under incomplete information. A self-contained recap of SCI
and the six inefficiency areas, so the route stands alone for a learner who skipped Route 1.
Three competing measures mapped onto the Green Software Patterns lifecycle stages
(Requirements / Development / Operations), because the stage predicts how fast a measure
shows a result and how long the result lasts. The seven decision dimensions, written as
questions a consultant has to answer rather than as labels. And how to argue a call you
cannot fully prove - the three things a complete recommendation does, with Cynefin's
complex-domain treatment as the reference point.

**Task 2 - AppNexa Prioritization Room.** For each of the three options the learner answers
a situational question, predicts the option's profile across the seven dimensions on
sliders, then reveals the real profile - which renders as a solid polygon overlaid on their
dashed prediction, so the gap is visible without anyone being told they were wrong. Options
can be explored in any order and revisited freely. The learner then commits to one and
defends it: strategic rationale, feasibility argument, two follow-up decisions the choice
forces, and two risks of the road not taken. The Prioritization Memo assembles alongside and
exports as JSON (including per-dimension prediction gaps, for grading) plus a print-ready
HTML memo.

The ground-truth profiles are built so no option dominates: A wins on leverage and long-term
effect but is weak on immediate impact and team acceptance; B wins on immediate measurable
impact but is weak on leverage and carries execution risk; C wins on feasibility and
measurability but shows nothing visible this quarter. Risk is the one inverted axis - higher
is worse - and the material says so explicitly, because a radar chart otherwise implies a
bigger polygon is a better option.

## Route 3 — Management Decision: Leading the Standard

Level 3. About 60 minutes of material and 20 minutes of task. Two companies on purpose:
**SoftPulse Digital Products GmbH** is a read-only worked example in the material, and
**CodeVista Digital Platforms** is the case the learner actually works. CodeVista appears
nowhere else in the course, so the task tests whether the reasoning transfers rather than
whether AppNexa's specifics were memorised.

**Material (four sections, A-D).** Why this reaches a board at all - the question stops being
"which fix is best" and becomes "which structure makes good fixes the default". RACI in full,
with its one structural rule (exactly one Accountable) and the two ways it fails, plus what a
board-ready recommendation under uncertainty actually owes. The regulatory and professional
backdrop: CSRD / ESRS E1 pulling software's operational footprint into a disclosure, iSAQB's
CPSA Advanced Level Module GREEN making it an examinable architect competency, and the SOFT
framework as the cautionary case of pilots that succeed technically and never scale. Then the
SoftPulse worked example - situation, initial position, the reasoning move, four levers,
which was prioritised and why not the one that felt more productive, and the same four levers
sorted by time horizon.

**Task 3 - CodeVista Board Memo.** Rank three of six guiding decisions and justify the top
one; place five measures on a 2x2 trade-off map (momentum cost against structural impact);
assign a RACI for ownership of the green coding standard; and name one decision that must be
made now plus what waiting would cost. The Board Memo assembles alongside and exports as JSON
(with per-card reference comparison and the one-Accountable flag) plus a print-ready HTML memo.

The worked example renders inside a bordered card with a dark banner, deliberately unlike any
learner-facing surface, so it cannot be mistaken for something to fill in.

### Diagram reuse

`components/ui/FlowDiagram.tsx` takes a graph and renders it. Section A passes
`ENERGY_CHAIN` (code → compute → data centre → grid → CO₂e, plus the network branch) with no
pins; Task 1 passes `APPNEXA_TRACE` through the same component with six interactive hotspot
pins. The task's trace is the material's diagram extended — not a second hand-built SVG that
could drift away from it. Both graphs are data in `lib/route1.ts`.

`components/route1/CategoryGrid.tsx` is the same idea for the six categories: one component
renders Section E's legend grid and the headers of Task 1's six drop-bins, so a bin can never
drift from the material block that taught it.

Route 2 reuses the same `FlowDiagram` for its Green Software Patterns lifecycle strip, with
`pinTone="marker"` for static lettered stage tags instead of Route 1's clickable hotspots.

### Components built for Route 2, shared from the start

- `components/ui/RadarChart.tsx` - inline-SVG radar that overlays a dashed "ghost"
  (predicted) polygon on a solid "real" one. No chart library.
- `components/ui/Slider.tsx` - a native `<input type="range">` on the brand tokens. Value 0
  means "not set" rather than a real answer, so an untouched slider is never recorded as a
  deliberate prediction of 3 - and there is no dead case where clicking the default position
  fires no change event.
- `lib/flowDiagram.ts` - the flow-graph types, lifted out of `lib/route1.ts` once a second
  route needed them.

### Components built for Route 3

- `components/ui/QuadrantMap.tsx` - a draggable 2x2 map: cards placed on a plane with two
  labelled axes, native HTML5 drag plus tap-to-select, controlled placement so the current
  state stays in the persisted store. Styled to match `RadarChart` rather than inventing a
  second visual language for "a measure scored on two dimensions".
- `lib/usePlacementHistory.ts` - the undo/redo utility, now a factory. Each exercise creates
  its own instance, so an undo on Route 3's quadrant map can never restore a snapshot from
  Route 1's category bins after a client-side navigation.

### Plain-language explainers

Jargon inside material prose can be marked inline as `[[id|visible label]]` (parser in
`lib/glossary.ts`). `MaterialBlock` renders the label as a link-styled button that opens a
native `<dialog>` explainer (`components/ui/Glossary.tsx`): a plain definition, an everyday
analogy, an SVG that toggles between the wasteful and the efficient version, why it costs
energy, and a jump to where the material covers it in depth. Route 1 uses it for
"over-fetching API call" and "N+1 query" in Section A (`GLOSSARY` in `lib/route1.ts`, diagrams
in `components/route1/GlossaryVisuals.tsx`). Where no glossary is provided, a marker renders as
plain text, so brackets never leak onto the page.

## Standards all three routes implement

Interaction standards come from [`../CLAUDE.md`](../CLAUDE.md); content standards from
[`../CURRICULUM-GUIDE.md`](../CURRICULUM-GUIDE.md).

- **Itemized missing items, never a generic message.** Each route's `useRouteN().missing` derives one
  named entry per concretely-missing thing ("Justification for Hotspot 3 — The Triple-Send
  Notification"), rendered through the shared `MissingList`. Every entry is a button that
  scrolls to and flashes the exact field.
- **The export button is never disabled.** Clicking it while incomplete opens the missing
  list and jumps to the first gap.
- **Check on demand, clue not answer.** The Check button speaks only to the category
  placement, and only ever tells the learner it is wrong plus a directional hint behind one
  more click. It never reveals the category, the lever or the fix type.
- **Undo/redo and retry on placements.** Full history via `useFindingSortStore`, plus a
  remove-and-retry affordance on every placed card that re-arms it for immediate replacement.
- **No hard locks.** Route 1 is reachable regardless of any other route's state.
- **Mentor tools, both of them.** `MentorFillButton` fills every persisted field with correct
  demo answers; `AnswerKeyButton` unlocks a per-exercise key giving the expected answer and a
  reason for *every* option including the rejected ones, plus teaching notes where more than
  one answer genuinely defends. Shared passcode `muchson123`, in client-side plaintext on
  purpose — a gate against accidental clicks, not security. The unlock flag lives in the
  store's non-persisted session slice, so a reload re-locks it.
- **Field instructions below the label**, never only in a placeholder.
- **Every task step traces back to the material** via `MaterialRefs` chips that scroll to the
  cited section and flash it in the accent (not the red missing-item flash).

## Layout

- `app/` — App Router pages. `layout.tsx` holds the shell; `route-1-foundations/page.tsx` is
  the only built route.
- `lib/routes.ts` — the day-level `CASE` identity and the `ROUTES` registry.
- `lib/route1.ts` — **all** of Route 1's content: material sections, the six categories, both
  flow graphs, the six hotspots with their levers, clues and answer keys, and the task's
  framing and export contract. Components stay presentational.
- `lib/store.ts` — the generic Zustand + `localStorage` store, plus `useHydrated()`.
- `lib/downloadFile.ts` — the shared export-filename generator and Blob download.
- `lib/scrollToAndFlash.ts`, `lib/answerKey.ts`, `lib/mentorPasscode.ts`, `lib/routeGating.ts`
  — shared utilities, reused unchanged across days.
- `components/ui/` — cross-day shared components.
- `components/route1/` — this route's own components.

## Running it

```bash
npm ci
npm run dev
```

Then open `http://localhost:3000`.

To produce the static site:

```bash
npm run build
```

Output lands in `out/`. **Never run the build while the dev server is running** — both write
to `.next`, after which the dev server serves 404s for `main-app.js` and nothing hydrates.
The page still server-renders, so it looks fine while every click is dead.

Typecheck on its own:

```bash
npm run typecheck
```
