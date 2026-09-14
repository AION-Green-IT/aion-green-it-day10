"use client";

import { useProgress, useHydrated } from "@/lib/store";
import type { MissingItem } from "@/components/ui/MissingList";
import {
  DIMENSIONS,
  OPTIONS,
  R2,
  optionById,
  type DimensionKey,
  type MeasureOption,
  type OptionId,
} from "@/lib/route2";

/** DOM ids the missing-item list scrolls to and flashes. */
export const domId = {
  name: "r2-name",
  option: (id: OptionId) => `r2-option-${id}`,
  situational: (id: OptionId) => `r2-option-${id}-situational`,
  predict: (id: OptionId) => `r2-option-${id}-predict`,
  reveal: (id: OptionId) => `r2-option-${id}-reveal`,
  commit: "r2-commit",
  pick: "r2-commit-pick",
  rationale: "r2-commit-rationale",
  feasibility: "r2-commit-feasibility",
  followUp: (n: 1 | 2) => `r2-commit-followup-${n}`,
  risk: (n: 1 | 2) => `r2-commit-risk-${n}`,
  export: "r2-export",
};

export type OptionState = {
  option: MeasureOption;
  /** Which of the four situational answers was given, if any. */
  situational: string | null;
  /** Dimension key → predicted 1–5. Absent means not set. */
  prediction: Partial<Record<DimensionKey, number>>;
  predictedCount: number;
  predictionComplete: boolean;
  /** Dimensions with no prediction yet — named in the missing list. */
  missingDimensions: string[];
  revealed: boolean;
};

export function useRoute2() {
  const hydrated = useHydrated();
  const notes = useProgress((s) => s.notes);
  const choices = useProgress((s) => s.choices);
  const seen = useProgress((s) => s.seen);

  const name = notes[R2.name] ?? "";
  const revealedIds = seen[R2.revealed] ?? [];

  const optionStates: OptionState[] = OPTIONS.map((option) => {
    const prediction: Partial<Record<DimensionKey, number>> = {};
    const missingDimensions: string[] = [];
    for (const d of DIMENSIONS) {
      const raw = choices[R2.predict(option.id, d.key)];
      const v = raw ? Number(raw) : 0;
      if (v >= 1) prediction[d.key] = v;
      else missingDimensions.push(d.name);
    }
    const predictedCount = DIMENSIONS.length - missingDimensions.length;
    return {
      option,
      situational: choices[R2.situational(option.id)] || null,
      prediction,
      predictedCount,
      predictionComplete: missingDimensions.length === 0,
      missingDimensions,
      revealed: revealedIds.includes(option.id),
    };
  });

  const byId = (id: OptionId) => optionStates.find((s) => s.option.id === id)!;

  const rawPick = choices[R2.pick];
  const pick: OptionId | null =
    rawPick === "A" || rawPick === "B" || rawPick === "C" ? (rawPick as OptionId) : null;

  const rationale = (notes[R2.rationale] ?? "").trim();
  const feasibility = (notes[R2.feasibility] ?? "").trim();
  const followUp: [string, string] = [
    (notes[R2.followUp(1)] ?? "").trim(),
    (notes[R2.followUp(2)] ?? "").trim(),
  ];
  const risks: [string, string] = [
    (notes[R2.risk(1)] ?? "").trim(),
    (notes[R2.risk(2)] ?? "").trim(),
  ];

  /** The commit step opens once all three real profiles have been seen at least once. */
  const allRevealed = optionStates.every((s) => s.revealed);
  const revealedCount = optionStates.filter((s) => s.revealed).length;

  /**
   * Standard #1: one entry per concretely-missing thing, named. Ordered so the
   * list reads top-to-bottom in the same order the page does.
   */
  const missing: MissingItem[] = [];
  if (!name.trim()) {
    missing.push({ id: domId.name, label: "Your name — needed to label the export" });
  }
  for (const s of optionStates) {
    const who = `Option ${s.option.id} — ${s.option.shortName}`;
    if (!s.situational) {
      missing.push({ id: domId.situational(s.option.id), label: `Situational question for ${who}` });
    }
    if (!s.predictionComplete) {
      const n = s.missingDimensions.length;
      missing.push({
        id: domId.predict(s.option.id),
        label: `Prediction sliders for ${who} — ${n} dimension${n === 1 ? "" : "s"} not set (${s.missingDimensions.join(", ")})`,
      });
    }
    if (!s.revealed) {
      missing.push({ id: domId.reveal(s.option.id), label: `Reveal the real profile for ${who}` });
    }
  }
  // The commit step is gated behind all three reveals (see CommitStep) — while
  // that holds, one combined entry stands in for every commit field, pointing
  // at whichever option still needs revealing, rather than listing five commit
  // fields the learner cannot even see yet.
  if (!allRevealed) {
    const next = optionStates.find((s) => !s.revealed);
    missing.push({
      id: next ? domId.reveal(next.option.id) : domId.commit,
      label: `Reveal all three profiles to unlock your recommendation — ${revealedCount} of ${optionStates.length} done`,
    });
  } else {
    if (!pick) {
      missing.push({ id: domId.pick, label: "Your recommendation — pick one option to commit to" });
    }
    if (!rationale) missing.push({ id: domId.rationale, label: "Strategic rationale for your recommendation" });
    if (!feasibility) missing.push({ id: domId.feasibility, label: "Feasibility argument for your recommendation" });
    if (!followUp[0]) missing.push({ id: domId.followUp(1), label: "First follow-up decision this choice forces" });
    if (!followUp[1]) missing.push({ id: domId.followUp(2), label: "Second follow-up decision this choice forces" });
    if (!risks[0]) missing.push({ id: domId.risk(1), label: "First risk of the road not taken" });
    if (!risks[1]) missing.push({ id: domId.risk(2), label: "Second risk of the road not taken" });
  }

  return {
    hydrated,
    name,
    optionStates,
    byId,
    pick,
    pickedOption: pick ? optionById(pick) : null,
    rationale,
    feasibility,
    followUp,
    risks,
    allRevealed,
    revealedCount,
    totalOptions: OPTIONS.length,
    missing,
    allComplete: missing.length === 0,
  };
}

export type Route2State = ReturnType<typeof useRoute2>;
