"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  RACI_ANSWER_KEY,
  RACI_LETTERS,
  RACI_ROLES,
  RACI_SUBJECT,
  R3,
  TASK3,
  materialRefs,
} from "@/lib/route3";
import { ClueToggle } from "@/components/ui/ClueToggle";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { GatedSection } from "@/components/ui/GatedSection";
import { Check as CheckGlyph } from "@/components/icons/LineIcons";
import { useRoute3, domId } from "./useRoute3";

/**
 * Step 3 — the RACI grid.
 *
 * Locked until Step 2's trade-off map is confirmed correct — same deliberate
 * deviation from CLAUDE.md #3/#6 as the quadrant gate before it.
 *
 * The check enforces RACI's one structural rule only: exactly one Accountable.
 * It deliberately says nothing about which role should hold which letter,
 * because that judgement is the exercise — and the full reasoning lives in the
 * mentor answer key instead. `raciChecked` is a single persisted flag: once
 * clicked the first time, the accountable-count state (and whether Step 4
 * unlocks) stays live as roles are toggled, with no need to click again.
 */
export function RaciStep() {
  const r3 = useRoute3();
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const checks = useProgress((s) => s.checks);
  const checked = r3.raciChecked;

  const accountableClue =
    r3.accountableCount === 0
      ? "Nobody currently answers for the outcome. Ask which single role holds a budget line, a contract or a release gate that would actually change it."
      : "More than one role is marked Accountable. That reads as coverage and behaves like nobody owning it — both quietly assume the other does. Pick the one that controls the outcome, and move the others to Responsible or Consulted.";

  if (!r3.quadrantConfirmed) {
    return (
      <>
        <GatedSection
          id={domId.raci}
          title="Step 3 locked — confirm the trade-off map first"
          message="Place all five measures on the map above and confirm every one holds up, then the governance model unlocks."
          jump={{ anchorId: domId.quadrant, label: "Go check the trade-off map" }}
        />
        {/* Mentor answer key stays available regardless of the learner-facing lock. */}
        <AnswerKey block={RACI_ANSWER_KEY} />
      </>
    );
  }

  return (
    <section id={domId.raci} className="scroll-mt-24 rounded-2xl border border-line bg-paper p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">Step 3 · Govern</p>
      <h3 className="text-h3 text-ink">{TASK3.raci.heading}</h3>
      <p className="mt-1 max-w-prose text-caption text-ash">{TASK3.raci.instruction}</p>
      <p className="mt-1.5 text-caption font-semibold text-ink">
        Subject: <span className="text-accent">{RACI_SUBJECT}</span>
      </p>
      <MaterialRefs refs={materialRefs(["governance"])} />

      {/* Letter legend */}
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {RACI_LETTERS.map((l) => (
          <li
            key={l.id}
            id={domId.raciLetter(l.id)}
            className={clsx(
              "scroll-mt-24 rounded-xl border p-3",
              l.id === "A" ? "border-warn/40 bg-warn/5" : "border-line bg-canvas",
            )}
          >
            <p className="flex items-baseline gap-2">
              <span
                className={clsx(
                  "flex h-6 w-6 items-center justify-center rounded-lg text-micro font-bold",
                  l.id === "A" ? "bg-warn text-paper" : "bg-ink text-paper",
                )}
              >
                {l.id}
              </span>
              <span className="text-caption font-semibold text-ink">{l.name}</span>
            </p>
            <p className="mt-1 text-micro text-ash">{l.meaning}</p>
            <p className="mt-1.5 text-micro font-semibold text-ash">
              {r3.raci[l.id].length === 0 ? (
                <span className="text-danger">No role assigned</span>
              ) : (
                `${r3.raci[l.id].length} role${r3.raci[l.id].length === 1 ? "" : "s"}`
              )}
            </p>
          </li>
        ))}
      </ul>

      {/* The matrix */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse">
          <thead>
            <tr>
              <th className="border-b border-line py-2 text-left text-micro font-semibold uppercase tracking-wide text-ash">
                Role
              </th>
              {RACI_LETTERS.map((l) => (
                <th
                  key={l.id}
                  className={clsx(
                    "w-16 border-b border-line py-2 text-center text-micro font-semibold uppercase tracking-wide",
                    l.id === "A" ? "text-warn" : "text-ash",
                  )}
                >
                  {l.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RACI_ROLES.map((role) => (
              <tr key={role.id}>
                <td className="border-b border-line/60 py-2 pr-3">
                  <p className="text-caption font-semibold text-ink">{role.name}</p>
                  <p className="text-micro text-ash">{role.note}</p>
                </td>
                {RACI_LETTERS.map((l) => {
                  const key = R3.raci(role.id, l.id);
                  const on = !!checks[key];
                  return (
                    <td key={l.id} className="border-b border-line/60 py-2 text-center">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        aria-label={`${role.name} — ${l.name}`}
                        onClick={() => toggleCheck(key, !on)}
                        className={clsx(
                          "mx-auto flex h-8 w-8 items-center justify-center rounded-lg border text-micro font-bold transition-colors duration-150",
                          on
                            ? l.id === "A"
                              ? "border-warn bg-warn text-paper"
                              : "border-accent bg-accent text-paper"
                            : "border-line bg-paper text-ash hover:border-ash",
                        )}
                      >
                        {on ? l.id : ""}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Check — structural rule only */}
      <div className="mt-4 rounded-xl border border-line bg-canvas p-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => toggleCheck(R3.raciChecked, true)}
            className="btn-ghost !py-1.5 !text-caption"
          >
            {checked ? "Re-check the model" : "Check the model"}
          </button>
          <p className="text-micro text-ash">
            Checks RACI&apos;s structural rule only — never which role should hold which letter.
          </p>
        </div>

        {checked && (
          <div className="reveal-in mt-2">
            {r3.accountableValid ? (
              <p className="inline-flex items-center gap-1.5 text-caption font-semibold text-accent">
                <CheckGlyph className="h-4 w-4" />
                Exactly one Accountable. The structure holds — whether it is the right role is your call to
                defend.
              </p>
            ) : (
              <>
                <p className="text-caption font-semibold text-danger">
                  {r3.accountableCount === 0
                    ? "No role is marked Accountable."
                    : `${r3.accountableCount} roles are marked Accountable.`}{" "}
                  RACI allows exactly one.
                </p>
                <ClueToggle clue={accountableClue} />
              </>
            )}
          </div>
        )}

        <AnswerKey block={RACI_ANSWER_KEY} />
      </div>
    </section>
  );
}
