"use client";

import type { ReactNode } from "react";
import { Lock } from "@/components/icons/LineIcons";

/**
 * A whole step/section locked behind an earlier one. Renders in place of its
 * real content — same `id`, so a missing-item link or an in-page anchor lands
 * in the right spot whether the step is locked or not, and the page layout
 * never jumps once it unlocks.
 *
 * Unlike CLAUDE.md #3/#6's usual "never hard-lock the next step" pattern, a
 * route that uses this has deliberately opted into gating one step behind the
 * previous one being confirmed complete or correct — see the call site for
 * why. `jump`, if given, is a real link to the prerequisite section so the
 * learner is never just told "no" with nowhere to go.
 */
export function GatedSection({
  id,
  title,
  message,
  jump,
}: {
  id?: string;
  title: string;
  message: ReactNode;
  jump?: { anchorId: string; label: string };
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-dashed border-line bg-canvas p-6 text-center">
      <Lock className="mx-auto h-5 w-5 text-ash" />
      <p className="mt-2 text-body font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-prose text-caption text-ash">{message}</p>
      {jump && (
        <a
          href={`#${jump.anchorId}`}
          className="mt-3 inline-block text-caption font-semibold text-accent underline underline-offset-2 hover:text-accentHi"
        >
          {jump.label}
        </a>
      )}
    </section>
  );
}
