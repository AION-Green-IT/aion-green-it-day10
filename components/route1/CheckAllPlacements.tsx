"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { R1 } from "@/lib/route1";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { Check as CheckGlyph } from "@/components/icons/LineIcons";
import { useRoute1, domId } from "./useRoute1";

/**
 * The one category check for the whole task. Replaces the old per-hotspot
 * "Check placement" button — same job, checked once for everything that has
 * been sorted so far.
 *
 * This is where the deliberate deviation from the course-wide "never gate the
 * next step" pattern lives: clicking this is what confirms a category and
 * unlocks that hotspot's lever/justification/fix-type fields in the workup
 * list below (HotspotWorkup). The flag persists, so from the first click
 * onward every hotspot's state — right here and in the six bins above —
 * updates live as placements change, with no need to click again.
 */
export function CheckAllPlacements() {
  const r1 = useRoute1();
  const toggleCheck = useProgress((s) => s.toggleCheck);

  const sorted = r1.findings.filter((f) => f.category);
  const wrong = r1.findings.filter((f) => f.categoryWrong);
  const stillToSort = r1.totalHotspots - sorted.length;

  return (
    <div id={domId.checkAll} className="scroll-mt-24 rounded-2xl border border-line bg-canvas p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => toggleCheck(R1.categoriesChecked, true)}
          className="btn-ghost !py-1.5 !text-caption"
        >
          {r1.categoriesChecked ? "Re-check all placements" : "Check all placements"}
        </button>
        <p className="text-micro text-ash">
          Checks every sorted category at once, and unlocks the lever and fix type for the ones that hold up —
          never reveals the lever or fix type itself.
        </p>
      </div>

      {r1.categoriesChecked && (
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
              <ul className="mt-2 space-y-2">
                {wrong.map((f) => (
                  <li key={f.hotspot.id} className="rounded-xl border border-danger/30 bg-danger/5 p-3">
                    <button
                      type="button"
                      onClick={() => scrollToAndFlash(domId.hotspot(f.hotspot.id))}
                      className={clsx(
                        "text-left text-caption font-semibold text-ink underline decoration-dotted",
                        "underline-offset-2 hover:text-danger",
                      )}
                    >
                      Hotspot {f.hotspot.n} — {f.hotspot.title}
                    </button>
                    <ClueToggle clue={f.hotspot.clue} />
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-micro text-ash">
                Move each one to a different bin above, then check again — its lever, justification and fix type
                stay locked until it holds up.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
