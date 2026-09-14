"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import { createPlacementHistory } from "@/lib/usePlacementHistory";
import {
  GUIDING_DECISIONS,
  QUADRANT_CARDS,
  RACI_LETTERS,
  RACI_ROLES,
  RANK_SLOTS,
  R3,
  quadrantCardById,
  type QuadrantId,
  type RaciLetter,
} from "@/lib/route3";

/**
 * Route 3's own undo/redo history for the quadrant map — a separate instance of
 * the shared factory, so an undo here can never restore a snapshot from Route
 * 1's category bins after a client-side navigation.
 */
export const useQuadrantHistory = createPlacementHistory();

/** DOM ids the missing-item list scrolls to and flashes. */
export const domId = {
  name: "r3-name",
  rank: "r3-rank",
  rankRationale: "r3-rank-why",
  quadrant: "r3-quadrant",
  quadrantCell: (cellId: string) => `r3-quadrant-${cellId}`,
  raci: "r3-raci",
  raciLetter: (letter: RaciLetter) => `r3-raci-${letter}`,
  decideNow: "r3-decide",
  decideWhy: "r3-decide-why",
  export: "r3-export",
};

export type QuadrantPlacements = Record<string, QuadrantId | null>;

export function useRoute3() {
  const hydrated = useHydrated();
  const notes = useProgress((s) => s.notes);
  const choices = useProgress((s) => s.choices);
  const checks = useProgress((s) => s.checks);
  const seen = useProgress((s) => s.seen);

  const name = notes[R3.name] ?? "";

  // --- Step 1: ranking -----------------------------------------------------
  const ranking = (seen[R3.ranking] ?? []).slice(0, RANK_SLOTS);
  const rankedDecisions = ranking
    .map((id) => GUIDING_DECISIONS.find((d) => d.id === id))
    .filter((d): d is (typeof GUIDING_DECISIONS)[number] => !!d);
  const rankRationale = (notes[R3.rankRationale] ?? "").trim();
  // No ranking is "correct" (several are defensible), so Step 1 gates the next
  // step on being complete, not on being right — the same idea as Route 1's
  // gate, applied to the one kind of confirmation this step actually has.
  const rankComplete = rankedDecisions.length === RANK_SLOTS && rankRationale.length > 0;

  // --- Step 2: quadrant map ------------------------------------------------
  const placements: QuadrantPlacements = {};
  for (const c of QUADRANT_CARDS) {
    const raw = choices[R3.quadrant(c.id)];
    placements[c.id] = raw ? (raw as QuadrantId) : null;
  }
  const placedCards = QUADRANT_CARDS.filter((c) => placements[c.id]);
  const unplacedCards = QUADRANT_CARDS.filter((c) => !placements[c.id]);
  const quadrantChecked = !!checks[R3.quadrantChecked];
  const quadrantAllCorrect =
    placedCards.length === QUADRANT_CARDS.length && placedCards.every((c) => placements[c.id] === c.correct);
  /** Gates Step 3: every card placed, checked at least once, and every one correct. */
  const quadrantConfirmed = quadrantChecked && quadrantAllCorrect;

  // --- Step 3: RACI --------------------------------------------------------
  const raci: Record<RaciLetter, string[]> = { R: [], A: [], C: [], I: [] };
  for (const letter of RACI_LETTERS) {
    for (const role of RACI_ROLES) {
      if (checks[R3.raci(role.id, letter.id)]) raci[letter.id].push(role.id);
    }
  }
  const accountableCount = raci.A.length;
  /** The one structural rule the check enforces — never which role should hold which letter. */
  const accountableValid = accountableCount === 1;
  const raciTouched = RACI_LETTERS.some((l) => raci[l.id].length > 0);
  const emptyLetters = RACI_LETTERS.filter((l) => raci[l.id].length === 0);
  const raciChecked = !!checks[R3.raciChecked];
  /** Gates Step 4: checked at least once and the one-Accountable rule holds. */
  const raciConfirmed = raciChecked && accountableValid;

  // --- Step 4: decide now --------------------------------------------------
  const decideNow = (notes[R3.decideNow] ?? "").trim();
  const decideWhy = (notes[R3.decideWhy] ?? "").trim();

  /**
   * Standard #1: one named entry per concretely-missing thing. While a later
   * step is locked, one combined entry stands in for everything inside it —
   * pointing at the step that unlocks it — rather than listing fields the
   * learner cannot even see yet.
   */
  const missing: MissingItem[] = [];
  if (!name.trim()) {
    missing.push({ id: domId.name, label: "Your name — needed to label the export" });
  }

  // Step 1 — always reachable, so its own fields are always checked directly.
  if (rankedDecisions.length < RANK_SLOTS) {
    const n = RANK_SLOTS - rankedDecisions.length;
    missing.push({
      id: domId.rank,
      label: `Rank your top ${RANK_SLOTS} guiding decisions — ${n} slot${n === 1 ? "" : "s"} still empty`,
    });
  }
  if (!rankRationale) {
    missing.push({ id: domId.rankRationale, label: "Rationale for your #1-ranked decision" });
  }

  // Step 2 — locked until Step 1 is complete.
  if (!rankComplete) {
    missing.push({
      id: domId.rank,
      label: "Finish ranking above to unlock the trade-off map",
    });
  } else if (!quadrantConfirmed) {
    missing.push({
      id: domId.quadrant,
      label: "Confirm all five measures are placed correctly — use Check placements",
    });
  }

  // Step 3 — locked until Step 2 is confirmed correct.
  if (quadrantConfirmed && !raciConfirmed) {
    missing.push({
      id: domId.raci,
      label: "Confirm the RACI model holds — exactly one Accountable — use Check the model",
    });
  }
  if (raciConfirmed) {
    for (const l of emptyLetters) {
      missing.push({
        id: domId.raciLetter(l.id),
        label: `RACI assignment for ${l.name} — no role assigned`,
      });
    }
  }

  // Step 4 — locked until Step 3 is confirmed valid.
  if (raciConfirmed) {
    if (!decideNow) {
      missing.push({ id: domId.decideNow, label: "The decision you must make now, despite incomplete data" });
    }
    if (!decideWhy) {
      missing.push({ id: domId.decideWhy, label: "Why waiting for better data would cost more" });
    }
  }

  return {
    hydrated,
    name,
    ranking,
    rankedDecisions,
    rankRationale,
    rankComplete,
    placements,
    placedCards,
    unplacedCards,
    totalCards: QUADRANT_CARDS.length,
    quadrantChecked,
    quadrantAllCorrect,
    quadrantConfirmed,
    raci,
    accountableCount,
    accountableValid,
    raciTouched,
    raciChecked,
    raciConfirmed,
    decideNow,
    decideWhy,
    quadrantCardById,
    missing,
    allComplete: missing.length === 0,
  };
}

export type Route3State = ReturnType<typeof useRoute3>;
