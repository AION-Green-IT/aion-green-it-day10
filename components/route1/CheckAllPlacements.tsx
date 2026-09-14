"use client";

import { useState } from "react";
import { MissingList } from "@/components/ui/MissingList";
import { Check as CheckGlyph } from "@/components/icons/LineIcons";
import { useRoute1, domId } from "./useRoute1";

/**
 * A summary check sitting above every per-hotspot workup card: one button
 * that checks every sorted category at once and, if anything is off, names
 * which hotspots — each entry jumps to that hotspot's own Check block so the
 * learner finishes the fix (and gets its clue) there, rather than duplicating
 * the clue here.
 *
 * Deliberately unlocks nothing (CLAUDE.md #3/#6): the lever, justification and
 * fix-type fields on every hotspot stay editable regardless of what this
 * reports. It only ever answers "which categories don't hold up yet" —
 * never the lever or fix type, same boundary as the per-hotspot check.
 */
export function CheckAllPlacements() {
  const r1 = useRoute1();
  const [checked, setChecked] = useState(false);

  const sorted = r1.findings.filter((f) => f.category);
  const wrong = sorted.filter((f) => f.category !== f.hotspot.correctCategory);
  const stillToSort = r1.totalHotspots - sorted.length;

  return (
    <div className="rounded-2xl border border-line bg-canvas p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setChecked(true)} className="btn-ghost !py-1.5 !text-caption">
          {checked ? "Re-check all placements" : "Check all placements"}
        </button>
        <p className="text-micro text-ash">
          Checks every sorted category at once — still never reveals the lever or fix type.
        </p>
      </div>

      {checked && (
        <div className="reveal-in mt-3">
          {sorted.length === 0 ? (
            <p className="text-caption text-ash">Nothing sorted yet — sort a card above, then check.</p>
          ) : wrong.length === 0 ? (
            <div>
              <p className="inline-flex items-center gap-1.5 text-caption font-semibold text-accent">
                <CheckGlyph className="h-4 w-4" />
                {sorted.length === r1.totalHotspots
                  ? "All six placements hold up."
                  : `All ${sorted.length} sorted so far hold up.`}
              </p>
              {stillToSort > 0 && (
                <p className="mt-1 text-micro text-ash">
                  {stillToSort} still to sort — come back and check again once they're placed.
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-caption font-semibold text-danger">
                {wrong.length} of {sorted.length} sorted placement{sorted.length === 1 ? "" : "s"}{" "}
                {wrong.length === 1 ? "doesn't" : "don't"} hold up yet.
              </p>
              <div className="mt-2 rounded-xl border border-line bg-paper p-3">
                <MissingList
                  lead="Not where they belong yet:"
                  items={wrong.map((f) => ({
                    id: domId.hotspot(f.hotspot.id),
                    label: `Hotspot ${f.hotspot.n} — ${f.hotspot.title}`,
                  }))}
                />
              </div>
              <p className="mt-1.5 text-micro text-ash">
                Each one jumps to its own Check button below, where Show clue still points at the reasoning, not
                the answer.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
