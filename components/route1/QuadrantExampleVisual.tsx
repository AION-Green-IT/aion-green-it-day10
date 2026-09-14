"use client";

import clsx from "clsx";
import type { GlossaryEntry } from "@/lib/glossary";
import { CORRECTNESS_GRID, EXAMPLE_FIGURES } from "@/lib/route1";

/**
 * The diagram inside each Section B "Deep example": two questions, answered by
 * different people. The top lane is correctness — tests and real users. The
 * bottom lane is efficiency — energy (E), grid carbon intensity (I) and the
 * hardware share (M) folding into one number. The small 2×2 on the right is the
 * same matrix as the card the learner opened, with this example's square filled.
 *
 * Sentences live in HTML under the SVG; the SVG only carries a few large words
 * so it stays legible at phone width.
 */

const LANDING_FILL = { goal: "fill-accent", focus: "fill-warn", reject: "fill-ash", worst: "fill-danger" } as const;
const TITLE = { fontSize: 22, fontWeight: 600 } as const;
const LABEL = { fontSize: 21, fontWeight: 600 } as const;

function Mark({ x, y, ok, bad, r = 22 }: { x: number; y: number; ok: boolean; bad: "danger" | "warn"; r?: number }) {
  const k = r / 22;
  const d = ok
    ? `M${x - 11 * k} ${y} L${x - 3 * k} ${y + 8 * k} L${x + 12 * k} ${y - 8 * k}`
    : `M${x - 9 * k} ${y - 9 * k} L${x + 9 * k} ${y + 9 * k} M${x + 9 * k} ${y - 9 * k} L${x - 9 * k} ${y + 9 * k}`;
  return (
    <g>
      <circle cx={x} cy={y} r={r} className={ok ? "fill-accent" : bad === "danger" ? "fill-danger" : "fill-warn"} />
      <path d={d} className="fill-none stroke-paper" strokeWidth={4 * k} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

export function QuadrantExampleVisual({ entry }: { entry: GlossaryEntry }) {
  const f = EXAMPLE_FIGURES[entry.id];
  if (!f) return null;
  const landing = CORRECTNESS_GRID.find((c) => c.correct === f.correct && c.efficient === f.efficient)!;

  return (
    <figure className="m-0 rounded-2xl border border-line bg-paper p-3 sm:p-4">
      <figcaption className="text-caption font-semibold text-ink">{entry.visual.title}</figcaption>

      <svg
        viewBox="0 0 640 300"
        role="img"
        aria-label={`Correct: ${f.correct ? "yes" : "no"}. Efficient: ${f.number}, ${f.numberDetail}. Lands in ${landing.label}.`}
        className="mt-3 h-auto w-full"
      >
        <defs>
          <marker
            id="gloss-q-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="10"
            markerHeight="10"
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" className="fill-ash" />
          </marker>
        </defs>

        {/* The software — a tracking page */}
        <text x={83} y={80} textAnchor="middle" className="fill-ink" style={TITLE}>
          Software
        </text>
        <rect x={16} y={96} width={134} height={108} rx={16} className="fill-paper stroke-ink" strokeWidth={1.6} />
        <rect x={30} y={112} width={106} height={76} rx={8} className="fill-canvas stroke-line" strokeWidth={1.2} />
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={40}
            y={124 + i * 20}
            width={i === 0 ? 60 : 86}
            height={8}
            rx={4}
            className={i === 0 ? "fill-accent" : "fill-line"}
          />
        ))}

        {/* Lane 1 — is the output right? Tests and real users answer it. */}
        <text x={196} y={44} className="fill-ink" style={LABEL}>
          Correct?
        </text>
        <path d="M150 124 C 176 124, 176 70, 200 70 H446" className="fill-none stroke-line" strokeWidth={2} />
        <path
          d="M150 124 C 176 124, 176 70, 200 70 H446"
          className={clsx("anim-flow fill-none", f.correct ? "stroke-accent" : "stroke-danger")}
          strokeWidth={2}
        />
        <rect x={300} y={50} width={52} height={40} rx={8} className="fill-paper stroke-ash" strokeWidth={1.4} />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M310 ${60 + i * 10} h6 M322 ${60 + i * 10} h22`}
            className="stroke-ash"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
        ))}
        <Mark x={470} y={70} ok={f.correct} bad="danger" />

        {/* Lane 2 — how much did that output cost? E, I and M fold into one number. */}
        <path d="M150 176 C 176 176, 176 230, 200 230 H424" className="fill-none stroke-line" strokeWidth={2} />
        <path
          d="M150 176 C 176 176, 176 230, 200 230 H424"
          className={clsx("anim-flow fill-none", f.efficient ? "stroke-accent" : "stroke-warn")}
          strokeWidth={2}
        />
        {["E", "I", "M"].map((letter, i) => (
          <g key={letter}>
            <rect x={228 + i * 66} y={212} width={44} height={36} rx={9} className="fill-paper stroke-ash" strokeWidth={1.4} />
            <text x={250 + i * 66} y={238} textAnchor="middle" className="fill-ink" style={{ fontSize: 22, fontWeight: 700 }}>
              {letter}
            </text>
          </g>
        ))}
        <text x={196} y={284} className="fill-ink" style={LABEL}>
          Efficient?
        </text>
        <rect
          x={424}
          y={206}
          width={100}
          height={48}
          rx={10}
          className={f.efficient ? "fill-accentSoft stroke-accent" : "fill-warn/10 stroke-warn"}
          strokeWidth={1.8}
        />
        <text
          x={474}
          y={239}
          textAnchor="middle"
          className={f.efficient ? "fill-accent" : "fill-warn"}
          style={{ fontSize: 26, fontWeight: 700 }}
        >
          {f.number}
        </text>
        <Mark x={524} y={206} r={12} ok={f.efficient} bad="warn" />

        {/* Where it lands — the same 2×2 as the card */}
        <path d="M492 70 C 540 70, 586 76, 586 96" className="fill-none stroke-ash" strokeWidth={1.6} markerEnd="url(#gloss-q-arrow)" />
        <path d="M524 236 C 562 236, 586 228, 586 206" className="fill-none stroke-ash" strokeWidth={1.6} markerEnd="url(#gloss-q-arrow)" />
        {CORRECTNESS_GRID.map((c) => {
          const on = c.id === landing.id;
          return (
            <rect
              key={c.id}
              x={546 + (c.efficient ? 0 : 1) * 42}
              y={102 + (c.correct ? 0 : 1) * 50}
              width={38}
              height={46}
              rx={7}
              className={on ? LANDING_FILL[c.tone] : "fill-mist stroke-line"}
              strokeWidth={on ? 0 : 1.2}
            />
          );
        })}
      </svg>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className={clsx("rounded-xl border p-3", f.correct ? "border-accent/35 bg-accentSoft" : "border-danger/35 bg-danger/5")}>
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">Correct?</p>
          <p className={clsx("mt-0.5 text-h2", f.correct ? "text-accent" : "text-danger")}>{f.correct ? "Yes" : "No"}</p>
          <p className="mt-1 text-caption text-ink">{f.correctEvidence}</p>
        </div>
        <div className={clsx("rounded-xl border p-3", f.efficient ? "border-accent/35 bg-accentSoft" : "border-warn/40 bg-warn/10")}>
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">Efficient?</p>
          <p className={clsx("mt-0.5 text-h2 tabular-nums", f.efficient ? "text-accent" : "text-warn")}>{f.number}</p>
          <p className="mt-1 text-caption text-ink">{f.numberDetail}</p>
        </div>
      </div>

      <p className="mt-2 text-micro text-ash">
        E = energy the servers used · I = carbon per kWh on that grid · M = the servers&apos; share of their
        manufacturing footprint. The small grid on the right is the same 2×2 as the card you opened, with this
        example&apos;s square filled.
      </p>
    </figure>
  );
}
