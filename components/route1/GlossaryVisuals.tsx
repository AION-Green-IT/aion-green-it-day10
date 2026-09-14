"use client";

import { useState } from "react";
import clsx from "clsx";
import type { GlossaryEntry, GlossaryVisualState } from "@/lib/glossary";

/**
 * The diagrams inside Route 1's plain-language explainers. Each draws the
 * wasteful and the efficient version of the same thing, switched by a tap
 * toggle rather than a hover, and keeps its sentences in HTML beside the SVG
 * so they stay readable when the diagram scales down on a phone. The few words
 * inside the SVG are set large for the same reason: at phone width the diagram
 * renders at well under half its drawn size.
 *
 * State ids ("over"/"right", "nplus1"/"batched") match `GLOSSARY` in
 * lib/route1.ts, which owns the captions.
 */

type Tone = "ink" | "warn" | "accent";

const STROKE: Record<Tone, string> = { ink: "stroke-ink", warn: "stroke-warn", accent: "stroke-accent" };
/** The faint base line a travelling dot pattern runs along — same hue, so the dots stay visible on it. */
const STROKE_SOFT: Record<Tone, string> = {
  ink: "stroke-ink/25",
  warn: "stroke-warn/35",
  accent: "stroke-accent/35",
};
const FILL: Record<Tone, string> = { ink: "fill-ink", warn: "fill-warn", accent: "fill-accent" };

const TITLE = { fontSize: 24, fontWeight: 600 } as const;
const LABEL = { fontSize: 21, fontWeight: 600 } as const;

function StateToggle({
  label,
  states,
  active,
  onChange,
}: {
  label: string;
  states: GlossaryVisualState[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap rounded-xl border border-line bg-canvas p-1">
      {states.map((s) => {
        const on = s.id === active;
        return (
          <button
            key={s.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(s.id)}
            className={clsx(
              "rounded-lg px-3 py-1.5 text-caption font-semibold transition-colors duration-150",
              on ? "bg-paper text-ink shadow-sm" : "text-ash hover:text-ink",
            )}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "accent" | "warn" | "muted" }) {
  return (
    <div
      className={clsx(
        "rounded-xl border p-3 transition-colors duration-150",
        tone === "warn" ? "border-warn/40 bg-warn/10" : tone === "accent" ? "border-accent/35 bg-accentSoft" : "border-line bg-canvas",
      )}
    >
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">{label}</p>
      <p
        className={clsx(
          "mt-0.5 text-h2 tabular-nums",
          tone === "warn" ? "text-warn" : tone === "accent" ? "text-accent" : "text-ash",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function ArrowMarker({ id, tone }: { id: string; tone: Tone | "ash" }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="10"
      markerHeight="10"
      markerUnits="userSpaceOnUse"
      orient="auto-start-reverse"
    >
      <path d="M0 0 L10 5 L0 10 z" className={tone === "ash" ? "fill-ash" : FILL[tone]} />
    </marker>
  );
}

// ---------------------------------------------------------------------------
// API call — over-fetching vs right-sized
// ---------------------------------------------------------------------------

const FIELDS_IN_RECORD = 24;
const FIELDS_ON_SCREEN = 3;

export function ApiCallVisual({ entry }: { entry: GlossaryEntry }) {
  const { states, title } = entry.visual;
  const [state, setState] = useState(states[0].id);
  const current = states.find((s) => s.id === state) ?? states[0];
  const over = state === "over";
  const sent = over ? FIELDS_IN_RECORD : FIELDS_ON_SCREEN;

  return (
    <figure className="m-0 rounded-2xl border border-line bg-paper p-3 sm:p-4">
      <figcaption className="text-caption font-semibold text-ink">{title}</figcaption>
      <div className="mt-2">
        <StateToggle label="Show the request" states={states} active={state} onChange={setState} />
      </div>

      <svg
        viewBox="0 0 640 288"
        role="img"
        aria-label={
          over
            ? `Over-fetching: the app asks the server for one customer, the server sends back all ${FIELDS_IN_RECORD} fields, and the screen shows only ${FIELDS_ON_SCREEN}.`
            : `Right-sized: the app asks the server for one customer and gets back only the ${FIELDS_ON_SCREEN} fields the screen shows.`
        }
        className="mt-3 h-auto w-full"
      >
        <defs>
          <ArrowMarker id="gloss-api-arrow" tone="ash" />
        </defs>

        <text x={108} y={26} textAnchor="middle" className="fill-ink" style={TITLE}>
          App
        </text>
        <text x={532} y={26} textAnchor="middle" className="fill-ink" style={TITLE}>
          Server
        </text>

        {/* App — a browser window holding a dashboard card with three fields */}
        <rect x={16} y={36} width={184} height={240} rx={16} className="fill-paper stroke-ink" strokeWidth={1.6} />
        <path d="M16 60 H200" className="stroke-line" strokeWidth={1.4} />
        {[32, 44, 56].map((cx) => (
          <circle key={cx} cx={cx} cy={48} r={3.5} className="fill-line" />
        ))}
        <rect x={34} y={72} width={148} height={144} rx={10} className="fill-canvas stroke-line" strokeWidth={1.2} />
        <rect x={46} y={84} width={60} height={8} rx={4} className="fill-line" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={46} y={112 + i * 32} width={28} height={8} rx={4} className="fill-line" />
            <rect x={82} y={108 + i * 32} width={88} height={16} rx={8} className="fill-accent" />
          </g>
        ))}
        {over && (
          <g key="unused" className="reveal-in">
            <rect
              x={34}
              y={226}
              width={148}
              height={38}
              rx={8}
              className="fill-mist stroke-ash"
              strokeWidth={1.2}
              strokeDasharray="4 4"
            />
            {Array.from({ length: 7 }, (_, i) => (
              <rect key={i} x={44 + i * 19} y={240} width={13} height={10} rx={3} className="fill-line" />
            ))}
          </g>
        )}

        {/* Server — two blades over a database */}
        <rect x={440} y={36} width={184} height={240} rx={16} className="fill-paper stroke-ink" strokeWidth={1.6} />
        {[0, 1].map((i) => (
          <g key={i}>
            <rect x={460} y={56 + i * 42} width={144} height={30} rx={8} className="fill-mist stroke-line" strokeWidth={1.2} />
            <circle cx={476} cy={71 + i * 42} r={4} className="fill-accent" />
            <path d={`M490 ${71 + i * 42} H588`} className="stroke-line" strokeWidth={3} strokeLinecap="round" />
          </g>
        ))}
        <path d="M488 168 V232 A44 11 0 0 0 576 232 V168" className="fill-canvas stroke-line" strokeWidth={1.2} />
        <ellipse cx={532} cy={168} rx={44} ry={11} className="fill-mist stroke-line" strokeWidth={1.2} />
        <path d="M488 200 A44 11 0 0 0 576 200" className="fill-none stroke-line" strokeWidth={1.2} />

        {/* Request: app → server */}
        <text x={320} y={86} textAnchor="middle" className="fill-ink" style={LABEL}>
          Request
        </text>
        <path d="M204 100 H434" className="fill-none stroke-line" strokeWidth={2} markerEnd="url(#gloss-api-arrow)" />
        <path d="M204 100 H434" className="anim-flow fill-none stroke-accent" strokeWidth={2} />

        {/* Response: server → app, carrying the payload */}
        <path d="M436 196 H206" className="fill-none stroke-line" strokeWidth={2} markerEnd="url(#gloss-api-arrow)" />
        <path d="M436 196 H206" className="anim-flow fill-none stroke-accent" strokeWidth={2} />
        {over ? (
          <g key="over" className="reveal-in">
            <rect x={229} y={150} width={182} height={94} rx={10} className="fill-paper stroke-ash" strokeWidth={1.4} />
            {Array.from({ length: FIELDS_IN_RECORD }, (_, i) => (
              <rect
                key={i}
                x={239 + (i % 6) * 28}
                y={160 + Math.floor(i / 6) * 20}
                width={22}
                height={14}
                rx={3}
                className={i < FIELDS_ON_SCREEN ? "fill-accent" : "fill-line"}
              />
            ))}
          </g>
        ) : (
          <g key="right" className="reveal-in">
            <rect x={271} y={179} width={98} height={34} rx={8} className="fill-paper stroke-accent" strokeWidth={1.4} />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={281 + i * 28} y={189} width={22} height={14} rx={3} className="fill-accent" />
            ))}
          </g>
        )}
        <text x={320} y={276} textAnchor="middle" className="fill-ink" style={LABEL}>
          Response
        </text>
      </svg>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-micro text-ash">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded-sm bg-accent" /> Shown on screen
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded-sm bg-line" /> Sent, but never shown
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Stat label="Fields the server sends" value={String(sent)} tone={over ? "warn" : "accent"} />
        <Stat label="Fields the screen shows" value={String(FIELDS_ON_SCREEN)} tone="accent" />
      </div>

      <p className="mt-3 text-caption text-ash">{current.caption}</p>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// N+1 query — a trip per item vs one batched trip
// ---------------------------------------------------------------------------

const ITEM_COUNTS = [10, 50, 200] as const;

function TripLine({
  y,
  tone,
  width = 1.8,
  delay = 0,
  badge,
}: {
  y: number;
  tone: Tone;
  width?: number;
  delay?: number;
  badge: string;
}) {
  const d = `M170 ${y} H470`;
  return (
    <g>
      <path
        d={d}
        className={clsx("fill-none", STROKE_SOFT[tone])}
        strokeWidth={width}
        markerStart={`url(#gloss-n1-${tone})`}
        markerEnd={`url(#gloss-n1-${tone})`}
      />
      <path
        d={d}
        className={clsx("anim-flow fill-none", STROKE[tone])}
        strokeWidth={width}
        style={{ animationDelay: `${delay.toFixed(2)}s` }}
      />
      <circle cx={214} cy={y} r={15} className={clsx("fill-paper", STROKE[tone])} strokeWidth={1.6} />
      <text
        x={214}
        y={y + 5}
        textAnchor="middle"
        className={FILL[tone]}
        style={{ fontSize: badge.length > 2 ? 11.5 : 14, fontWeight: 700 }}
      >
        {badge}
      </text>
    </g>
  );
}

export function NPlusOneVisual({ entry }: { entry: GlossaryEntry }) {
  const { states, title } = entry.visual;
  const [state, setState] = useState(states[0].id);
  const [items, setItems] = useState<number>(50);
  const current = states.find((s) => s.id === state) ?? states[0];
  const nPlusOne = state === "nplus1";
  const caption = current.caption
    .replace(/\{n\}/g, String(items))
    .replace(/\{trips\}/g, String(items + 1));

  return (
    <figure className="m-0 rounded-2xl border border-line bg-paper p-3 sm:p-4">
      <figcaption className="text-caption font-semibold text-ink">{title}</figcaption>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <StateToggle label="Show the pattern" states={states} active={state} onChange={setState} />
        <div className="flex items-center gap-2">
          <span className="text-micro font-semibold uppercase tracking-wide text-ash">Items on screen</span>
          <div role="group" aria-label="Items on screen" className="inline-flex rounded-xl border border-line bg-canvas p-1">
            {ITEM_COUNTS.map((c) => {
              const on = c === items;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setItems(c)}
                  className={clsx(
                    "rounded-lg px-3 py-1.5 text-caption font-semibold tabular-nums transition-colors duration-150",
                    on ? "bg-paper text-ink shadow-sm" : "text-ash hover:text-ink",
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <svg
        viewBox="0 0 640 316"
        role="img"
        aria-label={
          nPlusOne
            ? `N+1 pattern: one query for the list, then one more query per item — ${items + 1} round-trips between the app and the database for ${items} items.`
            : `Batched: one combined query returns the list and every item's details — 1 round-trip for ${items} items.`
        }
        className="mt-3 h-auto w-full"
      >
        <defs>
          <ArrowMarker id="gloss-n1-ink" tone="ink" />
          <ArrowMarker id="gloss-n1-warn" tone="warn" />
          <ArrowMarker id="gloss-n1-accent" tone="accent" />
        </defs>

        <text x={91} y={26} textAnchor="middle" className="fill-ink" style={TITLE}>
          App
        </text>
        <text x={549} y={26} textAnchor="middle" className="fill-ink" style={TITLE}>
          Database
        </text>

        {/* App — server blades over the list it is putting on screen */}
        <rect x={16} y={36} width={150} height={270} rx={16} className="fill-paper stroke-ink" strokeWidth={1.6} />
        {[0, 1].map((i) => (
          <g key={i}>
            <rect x={32} y={54 + i * 38} width={118} height={26} rx={7} className="fill-mist stroke-line" strokeWidth={1.2} />
            <circle cx={46} cy={67 + i * 38} r={3.5} className="fill-accent" />
          </g>
        ))}
        <rect x={32} y={140} width={118} height={148} rx={8} className="fill-canvas stroke-line" strokeWidth={1.2} />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={42} y={152 + i * 22} width={98} height={10} rx={5} className="fill-line" />
        ))}

        {/* Database */}
        <path d="M474 60 V282 A75 16 0 0 0 624 282 V60" className="fill-canvas stroke-line" strokeWidth={1.4} />
        <ellipse cx={549} cy={60} rx={75} ry={16} className="fill-mist stroke-line" strokeWidth={1.4} />
        <path d="M474 134 A75 16 0 0 0 624 134" className="fill-none stroke-line" strokeWidth={1.2} />
        <path d="M474 208 A75 16 0 0 0 624 208" className="fill-none stroke-line" strokeWidth={1.2} />

        {nPlusOne ? (
          <g key="nplus1" className="reveal-in">
            <TripLine y={92} tone="ink" badge="1" />
            {[132, 164, 196].map((y, i) => (
              <TripLine key={y} y={y} tone="warn" delay={0.3 * (i + 1)} badge={String(i + 2)} />
            ))}
            {[222, 231, 240].map((cy) => (
              <circle key={cy} cx={214} cy={cy} r={2.6} className="fill-warn" />
            ))}
            <TripLine y={270} tone="warn" delay={1.2} badge={String(items + 1)} />
          </g>
        ) : (
          <g key="batched" className="reveal-in">
            <TripLine y={186} tone="accent" width={5} badge="1" />
            <rect x={290} y={162} width={96} height={48} rx={8} className="fill-paper stroke-accent" strokeWidth={1.6} />
            {[171, 180, 189, 198].map((y) => (
              <rect key={y} x={300} y={y} width={76} height={5} rx={2.5} className="fill-accent/40" />
            ))}
          </g>
        )}
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Stat label="N+1 · round-trips" value={String(items + 1)} tone={nPlusOne ? "warn" : "muted"} />
        <Stat label="Batched · round-trips" value="1" tone={nPlusOne ? "muted" : "accent"} />
      </div>
      <p className="mt-2 text-micro text-ash">
        Try a different number of items: N+1 grows with every row, batching stays flat.
      </p>

      <p className="mt-3 text-caption text-ash">{caption}</p>
    </figure>
  );
}
