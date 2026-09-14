"use client";

import clsx from "clsx";
import { useProgress } from "@/lib/store";
import { DIMENSIONS, R2, RADAR_AXES, TASK2, materialRefs } from "@/lib/route2";
import { RadarChart, RadarLegend, type RadarSeries } from "@/components/ui/RadarChart";
import { Slider } from "@/components/ui/Slider";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { Check as CheckGlyph } from "@/components/icons/LineIcons";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { domId, type OptionState } from "./useRoute2";

/**
 * One option's full flow: situational question, seven prediction sliders, then
 * the reveal that overlays the real profile on the learner's guess.
 *
 * The reveal is gated on both being done — the situational question answered
 * AND all seven predictions set — so the comparison it draws is always a real
 * one. Clicking Reveal early never no-ops (CLAUDE.md #3): it scrolls to
 * whichever of the two is still missing. Options themselves stay unordered —
 * any of the three can be worked in any order and revisited freely; only the
 * reveal-then-commit sequence inside and across them is gated.
 */
export function OptionCard({ state }: { state: OptionState }) {
  const o = state.option;
  const choose = useProgress((s) => s.choose);
  const markSeen = useProgress((s) => s.markSeen);

  const reveal = () => {
    if (!state.situational) {
      scrollToAndFlash(domId.situational(o.id));
      return;
    }
    if (!state.predictionComplete) {
      scrollToAndFlash(domId.predict(o.id));
      return;
    }
    markSeen(R2.revealed, o.id);
  };

  const series: RadarSeries[] = [];
  if (state.predictionComplete) {
    series.push({
      id: `${o.id}-ghost`,
      label: "Your prediction",
      values: state.prediction as Record<string, number>,
      tone: "ghost",
    });
  }
  if (state.revealed) {
    series.push({
      id: `${o.id}-real`,
      label: "Real profile",
      values: o.profile as Record<string, number>,
      tone: "real",
    });
  }

  return (
    <li id={domId.option(o.id)} className="scroll-mt-24">
      <div
        className={clsx(
          "rounded-2xl border bg-paper p-5",
          state.revealed ? "border-accent/40" : "border-line",
        )}
      >
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              className={clsx(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-readout font-bold",
                state.revealed ? "bg-accent text-paper" : "bg-ink text-paper",
              )}
            >
              {o.id}
            </span>
            <div>
              <p className="text-micro font-semibold uppercase tracking-wide text-accent">
                {o.stage} · {o.stageNote}
              </p>
              <h3 className="text-h3 text-ink">{o.name}</h3>
            </div>
          </div>
          {state.revealed && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accentSoft px-3 py-1 text-micro font-semibold text-accent">
              <CheckGlyph className="h-3.5 w-3.5" /> Profile revealed
            </span>
          )}
        </div>

        <p className="mt-3 max-w-prose text-body text-ash">{o.summary}</p>
        <p className="mt-2 max-w-prose text-caption text-ash">{o.detail}</p>
        <MaterialRefs refs={materialRefs(["measures", "dimensions"])} />

        {/* --- 1. Situational question --- */}
        <div
          id={domId.situational(o.id)}
          className="mt-5 scroll-mt-24 rounded-xl border border-line bg-canvas p-4"
        >
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">
            Step 1 · Situational question
          </p>
          <p className="mt-1 text-caption font-semibold text-ink">{o.situational.prompt}</p>
          <p className="mt-0.5 text-micro text-ash">
            Not graded — there is no wrong answer here. Committing to a read is what makes the reveal mean something.
          </p>
          <ul className="mt-3 space-y-1.5">
            {o.situational.options.map((s) => {
              const active = state.situational === s.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(R2.situational(o.id), active ? "" : s.id)}
                    className={clsx(
                      "flex w-full items-start gap-2.5 rounded-xl border p-3 text-left transition-colors duration-150",
                      active
                        ? "border-accent bg-accentSoft"
                        : "border-line bg-paper hover:border-ash",
                    )}
                  >
                    <span
                      className={clsx(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                        active ? "border-accent bg-accent" : "border-line",
                      )}
                    >
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-paper" />}
                    </span>
                    <span className={clsx("text-caption", active ? "text-ink" : "text-ash")}>{s.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <AnswerKey block={o.situational.answerKey} />
        </div>

        {/* --- 2. Predict --- */}
        <div id={domId.predict(o.id)} className="mt-5 scroll-mt-24 rounded-xl border border-line bg-canvas p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-micro font-semibold uppercase tracking-wide text-accent">
              Step 2 · Predict the profile
            </p>
            <p className="text-micro font-semibold tabular-nums text-ash">
              <span className={state.predictionComplete ? "text-accent" : "text-ink"}>
                {state.predictedCount}
              </span>{" "}
              / {DIMENSIONS.length} set
            </p>
          </div>
          <p className="mt-0.5 text-micro text-ash">{TASK2.predictInstruction}</p>

          <div className="mt-2 divide-y divide-line">
            {DIMENSIONS.map((d) => (
              <Slider
                key={d.key}
                id={`r2-${o.id}-${d.key}`}
                label={d.name}
                instruction={d.question}
                value={state.prediction[d.key] ?? 0}
                onChange={(v) => choose(R2.predict(o.id, d.key), v >= 1 ? String(v) : "")}
                lowLabel={`1 · ${d.low}`}
                highLabel={`5 · ${d.high}`}
              />
            ))}
          </div>
        </div>

        {/* --- 3. Reveal --- */}
        <div id={domId.reveal(o.id)} className="mt-5 scroll-mt-24">
          {!state.revealed ? (
            <div className="rounded-xl border border-dashed border-line bg-canvas p-4 text-center">
              <p className="text-caption text-ash">
                {state.situational
                  ? state.predictionComplete
                    ? "Ready — reveal the real profile and see where your prediction differs."
                    : `Set the remaining ${state.missingDimensions.length} prediction slider${state.missingDimensions.length === 1 ? "" : "s"} above to unlock the reveal.`
                  : "Answer the situational question above to unlock the reveal."}
              </p>
              <button type="button" onClick={reveal} className="btn-accent mt-3">
                Reveal the real profile
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-accent/30 bg-accentSoft/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-micro font-semibold uppercase tracking-wide text-accent">
                  Step 3 · Real profile vs. your prediction
                </p>
                <RadarLegend ghostLabel="Your prediction" realLabel="Real profile" />
              </div>

              <div className="mt-2 grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
                <div className="mx-auto w-full max-w-[440px]">
                  <RadarChart
                    axes={RADAR_AXES}
                    series={series}
                    max={5}
                    title={`Option ${o.id} — ${o.name}: real profile against your prediction`}
                  />
                </div>

                <div>
                  {!state.predictionComplete && (
                    <p className="mb-2 rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-micro text-ink">
                      No comparison polygon yet — {state.missingDimensions.length} of your sliders are still unset.
                      Set them above and it appears here.
                    </p>
                  )}
                  <p className="text-caption text-ink">{o.readout}</p>
                  <p className="mt-2 text-micro font-semibold uppercase tracking-wide text-warn">
                    Risk here means: {o.riskKind}
                  </p>

                  <dl className="mt-3 space-y-1 border-t border-accent/25 pt-2">
                    {DIMENSIONS.map((d) => {
                      const real = o.profile[d.key];
                      const guess = state.prediction[d.key];
                      const gap = guess ? real - guess : null;
                      return (
                        <div key={d.key} className="flex items-baseline gap-2 text-micro">
                          <dt className="flex-1 text-ash">{d.name}</dt>
                          <dd className="font-semibold tabular-nums text-ink">{real}</dd>
                          <dd
                            className={clsx(
                              "w-14 shrink-0 text-right tabular-nums",
                              gap === null
                                ? "text-ash"
                                : gap === 0
                                  ? "text-accent"
                                  : "text-warn",
                            )}
                          >
                            {gap === null ? "—" : gap === 0 ? "exact" : `${gap > 0 ? "+" : ""}${gap}`}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                  <p className="mt-1.5 text-micro text-ash">
                    Right column: how far the real value sits from your guess.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
