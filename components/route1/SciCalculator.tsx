"use client";

import { useState } from "react";
import clsx from "clsx";
import { SCI_CALCULATOR, type SciCalcVarKey } from "@/lib/route1";
import { Check as CheckGlyph, Help } from "@/components/icons/LineIcons";

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 3 });

type Fields = Record<SciCalcVarKey, string>;
const EMPTY: Fields = { E: "", I: "", M: "", R: "" };

/**
 * The "try it yourself" calculator under Section C's formula visual. A real
 * scenario with real numbers, typed in by hand, so C = ((E × I) + M) per R
 * stops being four letters and becomes one calculation the learner has
 * actually done — not a graded exercise, so Reveal gives the full answer and
 * the reasoning directly, unlike Task 1's clue-only checks.
 */
export function SciCalculator() {
  const d = SCI_CALCULATOR;
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [revealed, setRevealed] = useState(false);

  const nums: Record<SciCalcVarKey, number | null> = {
    E: parseFloat(fields.E),
    I: parseFloat(fields.I),
    M: parseFloat(fields.M),
    R: parseFloat(fields.R),
  } as Record<SciCalcVarKey, number | null>;
  const complete = (Object.keys(nums) as SciCalcVarKey[]).every(
    (k) => fields[k].trim() !== "" && Number.isFinite(nums[k]),
  );
  const result = complete && nums.R !== 0 ? ((nums.E! * nums.I! + nums.M!) / nums.R!) : null;

  const set = (key: SciCalcVarKey, v: string) => {
    setFields((f) => ({ ...f, [key]: v }));
  };

  const reveal = () => {
    const next: Fields = { E: "", I: "", M: "", R: "" };
    for (const v of d.variables) next[v.key] = String(v.value);
    setFields(next);
    setRevealed(true);
  };

  const clear = () => {
    setFields(EMPTY);
    setRevealed(false);
  };

  return (
    <div className="rounded-2xl border border-line bg-canvas p-4">
      <p className="text-h3 text-ink">{d.heading}</p>
      <p className="mt-1 text-caption text-ash">{d.intro}</p>

      <div className="mt-3 space-y-2 rounded-xl border border-line bg-paper p-3">
        {d.story.map((p, i) => (
          <p key={i} className="text-caption text-ink">
            {p}
          </p>
        ))}
      </div>

      <p className="mt-3 text-micro font-semibold text-ash">{d.instruction}</p>

      {/* The four inputs */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {d.variables.map((v) => {
          const match = revealed && fields[v.key] === String(v.value);
          return (
            <div key={v.key}>
              <label htmlFor={`sci-calc-${v.key}`} className="block text-caption font-semibold text-ink">
                {v.label}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id={`sci-calc-${v.key}`}
                  type="text"
                  inputMode="decimal"
                  value={fields[v.key]}
                  onChange={(e) => {
                    // Digits, one decimal point — enough to keep the field numeric without fighting typing.
                    const v2 = e.target.value.replace(/[^\d.]/g, "");
                    set(v.key, v2);
                  }}
                  placeholder={v.placeholder}
                  className={clsx(
                    "w-full rounded-lg border bg-paper px-3 py-2 text-caption text-ink",
                    match ? "border-accent" : "border-line",
                  )}
                />
                <span className="shrink-0 text-micro text-ash">{v.unit}</span>
                {match && <CheckGlyph className="h-4 w-4 shrink-0 text-accent" />}
              </div>
              {revealed && (
                <p className="reveal-in mt-1.5 text-micro text-ash">{v.reason}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Live formula + result */}
      <div className="mt-4 rounded-xl border border-accent/30 bg-accentSoft p-4 text-center">
        <p className="font-mono text-caption text-ink">
          C = (({fields.E || "E"} × {fields.I || "I"}) + {fields.M || "M"}) ÷ {fields.R || "R"}
        </p>
        <p className="mt-2 text-micro font-semibold uppercase tracking-wide text-accent">{d.resultLabel}</p>
        <p className="mt-1 text-display text-accent">{result !== null ? fmt(result) : "—"}</p>
        <p className="text-micro text-ash">{d.resultUnit}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={reveal} className="btn-ghost inline-flex items-center gap-1.5 !py-1.5 !text-caption">
          <Help className="h-3.5 w-3.5" />
          {revealed ? "Reveal again" : "Reveal the numbers"}
        </button>
        {(fields.E || fields.I || fields.M || fields.R) && (
          <button type="button" onClick={clear} className="text-caption text-ash hover:text-ink">
            Clear and try again
          </button>
        )}
      </div>

      {/* The rate-not-total payoff, tied to this same scenario */}
      <div className="mt-4 rounded-xl border border-line bg-paper p-4">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">One month later</p>
        <p className="mt-1 text-caption text-ink">{d.followUp.intro}</p>
        <p className="mt-1 text-caption text-ink">{d.followUp.result}</p>
      </div>
    </div>
  );
}
