"use client";

import clsx from "clsx";
import { ArrowRight, Icon } from "@/components/icons/LineIcons";
import { GlossaryButton } from "@/components/ui/Glossary";
import { CORRECTNESS_GRID, PRINCIPLES, SCI_VARIABLES } from "@/lib/route1";

/**
 * The three non-diagram visuals for Route 1's material: Section B's 2×2,
 * Section C's `sci-formula-breakdown`, and Section D's `three-principles-triad`.
 * Inline SVG and brand tokens only.
 */

// --- Section B -------------------------------------------------------------

const TONE_CLASS = {
  goal: "border-accent bg-accentSoft",
  focus: "border-warn bg-warn/10",
  reject: "border-line bg-canvas",
  worst: "border-danger/40 bg-danger/5",
} as const;

/** The "Deep example" link reads in the card's own tone; grey would not look clickable. */
const LINK_CLASS = {
  goal: "text-accent hover:text-accentHi",
  focus: "text-warn hover:text-ink",
  reject: "text-ink hover:text-accent",
  worst: "text-danger hover:text-ink",
} as const;

const VERDICT_CLASS = {
  goal: "text-accent",
  focus: "text-warn",
  reject: "text-ash",
  worst: "text-danger",
} as const;

/** Correct × Efficient, as a labelled 2×2 rather than a spectrum. */
export function CorrectnessMatrix() {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-[auto_1fr_1fr] sm:items-stretch">
        {/* Column headers */}
        <div className="hidden sm:block" />
        <p className="hidden text-center text-micro font-semibold uppercase tracking-wide text-ash sm:block">
          Efficient
        </p>
        <p className="hidden text-center text-micro font-semibold uppercase tracking-wide text-ash sm:block">
          Inefficient
        </p>

        {/* Row 1 — correct */}
        <p className="hidden items-center text-micro font-semibold uppercase tracking-wide text-ash sm:flex">
          <span className="[writing-mode:vertical-rl] [transform:rotate(180deg)]">Correct</span>
        </p>
        <Cell id="ce" />
        <Cell id="ci" />

        {/* Row 2 — incorrect */}
        <p className="hidden items-center text-micro font-semibold uppercase tracking-wide text-ash sm:flex">
          <span className="[writing-mode:vertical-rl] [transform:rotate(180deg)]">Incorrect</span>
        </p>
        <Cell id="ie" />
        <Cell id="ii" />
      </div>
      <p className="mt-3 text-caption text-ash">
        Two independent questions, so four states — not one scale from bad to good. The quadrant that costs money is
        the one where nothing looks wrong.
      </p>
    </div>
  );
}

function Cell({ id }: { id: string }) {
  const cell = CORRECTNESS_GRID.find((c) => c.id === id)!;
  return (
    <div className={clsx("flex flex-col rounded-2xl border p-4", TONE_CLASS[cell.tone])}>
      <p className="text-h3 text-ink">{cell.label}</p>
      <p className={clsx("mt-0.5 text-micro font-semibold uppercase tracking-wide", VERDICT_CLASS[cell.tone])}>
        {cell.verdict}
      </p>
      <p className="mt-2 flex-1 text-caption text-ash">{cell.detail}</p>
      <GlossaryButton
        id={`quadrant-${cell.id}`}
        className={clsx(
          "mt-3 inline-flex items-center gap-1.5 self-start text-caption font-semibold underline decoration-dotted decoration-2 underline-offset-4",
          LINK_CLASS[cell.tone],
        )}
      >
        Deep example: how the number is found
        <ArrowRight className="h-4 w-4" />
      </GlossaryButton>
    </div>
  );
}

// --- Section C -------------------------------------------------------------

/** `sci-formula-breakdown` — C = ((E × I) + M) per R, with each variable explained. */
export function SciFormulaBreakdown() {
  return (
    <figure className="m-0">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 900 132"
          role="img"
          aria-label="The SCI formula: C equals open bracket E times I close bracket plus M, per R"
          className="h-auto w-full min-w-[560px]"
        >
          <title>SCI formula: C = ((E × I) + M) per R</title>

          {/* C = */}
          <text x="18" y="76" className="fill-ink" style={{ fontSize: 34, fontWeight: 700 }}>
            C
          </text>
          <text x="52" y="76" className="fill-ash" style={{ fontSize: 28 }}>
            =
          </text>

          {/* (( E x I ) + M) */}
          <text x="84" y="78" className="fill-ash" style={{ fontSize: 34 }}>
            ((
          </text>
          <FormulaBlock x={116} symbol="E" />
          <text x="204" y="76" className="fill-ash" style={{ fontSize: 26 }}>
            ×
          </text>
          <FormulaBlock x={234} symbol="I" />
          <text x="322" y="78" className="fill-ash" style={{ fontSize: 34 }}>
            )
          </text>
          <text x="342" y="76" className="fill-ash" style={{ fontSize: 26 }}>
            +
          </text>
          <FormulaBlock x={374} symbol="M" />
          <text x="462" y="78" className="fill-ash" style={{ fontSize: 34 }}>
            )
          </text>

          {/* per R */}
          <text x="492" y="72" className="fill-ash" style={{ fontSize: 17, fontStyle: "italic" }}>
            per
          </text>
          <FormulaBlock x={538} symbol="R" tone="outline" />

          {/* The rate, spelled out. */}
          <text x="640" y="58" className="fill-ash" style={{ fontSize: 13 }}>
            A rate, not a total —
          </text>
          <text x="640" y="78" className="fill-ink" style={{ fontSize: 13, fontWeight: 600 }}>
            carbon per functional unit.
          </text>
          <text x="640" y="98" className="fill-ash" style={{ fontSize: 12 }}>
            Comparable release over release.
          </text>
        </svg>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {SCI_VARIABLES.map((v) => (
          <div key={v.symbol} className="rounded-2xl border border-line bg-paper p-4">
            <dt className="flex items-baseline gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accentSoft text-readout font-bold text-accent">
                {v.symbol}
              </span>
              <span className="text-h3 text-ink">{v.name}</span>
            </dt>
            <dd className="mt-2 text-caption text-ash">
              {v.caption}
              <span className="mt-1 block text-micro font-semibold uppercase tracking-wide text-accent">
                {v.lever}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

function FormulaBlock({ x, symbol, tone = "solid" }: { x: number; symbol: string; tone?: "solid" | "outline" }) {
  return (
    <g>
      <rect
        x={x}
        y={32}
        width={72}
        height={58}
        rx={12}
        className={tone === "solid" ? "fill-accentSoft stroke-accent" : "fill-paper stroke-ash"}
        strokeWidth={1.6}
        strokeDasharray={tone === "outline" ? "5 4" : undefined}
      />
      <text
        x={x + 36}
        y={71}
        textAnchor="middle"
        className={tone === "solid" ? "fill-accent" : "fill-ink"}
        style={{ fontSize: 30, fontWeight: 700 }}
      >
        {symbol}
      </text>
    </g>
  );
}

// --- Section D -------------------------------------------------------------

const PRINCIPLE_ICONS = ["target", "gauge", "recycleLoop"] as const;

/** `three-principles-triad` — three icon cards in a row. */
export function ThreePrinciplesTriad() {
  return (
    <ul className="grid gap-3 md:grid-cols-3">
      {PRINCIPLES.map((p, i) => (
        <li key={p.id} className="flex flex-col rounded-2xl border border-line bg-paper p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accentSoft text-accent">
              <Icon name={PRINCIPLE_ICONS[i]} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-micro font-semibold uppercase tracking-wide text-ash">
                Principle {p.n}
              </p>
              <p className="text-h3 text-ink">{p.name}</p>
            </div>
          </div>
          <p className="mt-3 text-caption font-semibold text-ink">{p.summary}</p>
          <p className="mt-2 flex-1 text-caption text-ash">{p.detail}</p>
          <p className="mt-3 border-t border-line pt-2 text-micro uppercase tracking-wide text-accent">
            Targets {p.variable === "the composite" ? "the composite" : `SCI variable ${p.variable}`}
          </p>
        </li>
      ))}
    </ul>
  );
}
