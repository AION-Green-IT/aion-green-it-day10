"use client";

import { useProgress } from "@/lib/store";
import { R3, TASK3, materialRefs } from "@/lib/route3";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { AnswerKeyNote } from "@/components/ui/AnswerKey";
import { GatedSection } from "@/components/ui/GatedSection";
import { useRoute3, domId } from "./useRoute3";

/**
 * Step 4 — the two fields that make the memo a recommendation rather than a
 * status report. Locked until Step 3's RACI model holds — same deliberate
 * deviation from CLAUDE.md #3/#6 as the two gates before it.
 */
export function DecideNowStep() {
  const r3 = useRoute3();
  const setNote = useProgress((s) => s.setNote);
  const d = TASK3.decideNow;

  if (!r3.raciConfirmed) {
    return (
      <>
        <GatedSection
          id={domId.decideNow}
          title="Step 4 locked — confirm the RACI model first"
          message="Check the governance model above and make sure exactly one role is Accountable, then this unlocks."
          jump={{ anchorId: domId.raci, label: "Go check the RACI model" }}
        />
        {/* Mentor answer key stays available regardless of the learner-facing lock. */}
        <AnswerKeyNote
          label="What a strong decide-now answer does"
          text="The first field should name something specific and datable — a capacity commitment, a standard adopted by a date, a metric published — not an intention like 'we will prioritise efficiency'. The second should price the delay: what accumulates while you wait, or what gets decided by default in the absence of a decision. A learner who writes 'we might choose wrong' has not answered it; the question is why choosing wrong now beats choosing right later, and at CodeVista the answer is that every quarter of waiting adds more releases built under quality standards that never mention efficiency."
        />
      </>
    );
  }

  return (
    <section className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-accent">Step 4 · Decide</p>
      <h3 className="text-h3 text-ink">{d.heading}</h3>
      <p className="mt-1 max-w-prose text-caption text-ash">
        A board told &ldquo;we need more data before deciding&rdquo; has not been given a recommendation —
        waiting is itself a decision, and someone has to have counted what it costs.
      </p>
      <MaterialRefs refs={materialRefs(["governance", "board"])} />

      <div id={domId.decideNow} className="mt-5 scroll-mt-24">
        <label htmlFor="r3-decide-now-field" className="block text-caption font-semibold text-ink">
          {d.now.label}
        </label>
        <p className="mt-0.5 text-micro text-ash">{d.now.instruction}</p>
        <textarea
          id="r3-decide-now-field"
          rows={3}
          value={r3.decideNow}
          placeholder={d.now.placeholder}
          onChange={(e) => setNote(R3.decideNow, e.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        />
      </div>

      <div id={domId.decideWhy} className="mt-5 scroll-mt-24">
        <label htmlFor="r3-decide-why-field" className="block text-caption font-semibold text-ink">
          {d.why.label}
        </label>
        <p className="mt-0.5 text-micro text-ash">{d.why.instruction}</p>
        <textarea
          id="r3-decide-why-field"
          rows={3}
          value={r3.decideWhy}
          placeholder={d.why.placeholder}
          onChange={(e) => setNote(R3.decideWhy, e.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
        />
      </div>

      <AnswerKeyNote
        label="What a strong decide-now answer does"
        text="The first field should name something specific and datable — a capacity commitment, a standard adopted by a date, a metric published — not an intention like 'we will prioritise efficiency'. The second should price the delay: what accumulates while you wait, or what gets decided by default in the absence of a decision. A learner who writes 'we might choose wrong' has not answered it; the question is why choosing wrong now beats choosing right later, and at CodeVista the answer is that every quarter of waiting adds more releases built under quality standards that never mention efficiency."
      />
    </section>
  );
}
