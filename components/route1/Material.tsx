"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialBlock } from "@/components/ui/MaterialBlock";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/icons/LineIcons";
import { ENERGY_CHAIN, FURTHER_READING, GLOSSARY, MATERIAL, materialAnchorId } from "@/lib/route1";
import type { GlossaryEntry } from "@/lib/glossary";
import { GlossaryProvider } from "@/components/ui/Glossary";
import { FlowDiagram } from "@/components/ui/FlowDiagram";
import { SixCategoryGrid } from "./CategoryGrid";
import { CorrectnessMatrix, SciFormulaBreakdown, ThreePrinciplesTriad } from "./MaterialSvgs";
import { ApiCallVisual, NPlusOneVisual } from "./GlossaryVisuals";

/**
 * Route 1 material, Sections A–F. Each block renders through the shared
 * MaterialBlock (definition / insight / takeaway / decision rules / callout /
 * sources); the `children` slot carries that section's visual. Jargon marked
 * in the prose opens a plain-language explainer (see GLOSSARY in lib/route1.ts).
 */
export function Material() {
  const [a, b, c, d, e, f] = MATERIAL;

  return (
    <GlossaryProvider entries={GLOSSARY} renderVisual={renderGlossaryVisual}>
      <section className="space-y-14">
        <SectionHeading
          kicker="Material · about 60 minutes"
          title="The vocabulary and the measurement model"
          intro="Six sections. By the end you will be able to look at a running system you did not build, name where it wastes energy, and say which measurable variable a proposed fix would actually move."
        />

        <MaterialBlock block={a} anchorId={materialAnchorId("footprint")}>
          <FlowDiagram graph={ENERGY_CHAIN} />
        </MaterialBlock>

        <MaterialBlock block={b} anchorId={materialAnchorId("correctness")}>
          <CorrectnessMatrix />
        </MaterialBlock>

        <MaterialBlock block={c} anchorId={materialAnchorId("sci")}>
          <SciFormulaBreakdown />
        </MaterialBlock>

        <MaterialBlock block={d} anchorId={materialAnchorId("principles")}>
          <ThreePrinciplesTriad />
        </MaterialBlock>

        <MaterialBlock block={e} anchorId={materialAnchorId("categories")}>
          <div className="space-y-4">
            <p className="text-micro font-semibold uppercase tracking-wide text-accent">
              The six categories — and Task 1&apos;s six bins
            </p>
            <SixCategoryGrid detailed />
          </div>
        </MaterialBlock>

        <MaterialBlock block={f} anchorId={materialAnchorId("profession")}>
          <ProfessionalContext />
        </MaterialBlock>

        <FurtherReading />
      </section>
    </GlossaryProvider>
  );
}

/** Which diagram each explainer draws. Keys match `GLOSSARY[id].visual.key`. */
function renderGlossaryVisual(entry: GlossaryEntry) {
  switch (entry.visual.key) {
    case "api-call":
      return <ApiCallVisual entry={entry} />;
    case "n-plus-one":
      return <NPlusOneVisual entry={entry} />;
    default:
      return null;
  }
}

/** Section F's visual: where the five technical categories sit against the governance layer. */
function ProfessionalContext() {
  const rows = [
    {
      layer: "Governance layer",
      owner: "Leadership · what gets measured and rewarded",
      scope: "Category 6 — Management Logic. Above the GSF Patterns catalog entirely.",
      tone: "warn" as const,
    },
    {
      layer: "Standards layer",
      owner: "Architects · leads · review criteria",
      scope: "Where the lever for most of categories 1–5 actually sits. iSAQB CPSA Advanced Level, Module GREEN lives here.",
      tone: "accent" as const,
    },
    {
      layer: "Implementation layer",
      owner: "Individual engineers · this sprint's code",
      scope: "Where the symptoms appear — and the layer least able to fix them on its own.",
      tone: "plain" as const,
    },
  ];

  return (
    <ol className="space-y-2">
      {rows.map((r) => (
        <li
          key={r.layer}
          className={
            r.tone === "warn"
              ? "rounded-2xl border border-warn/40 bg-warn/5 p-4"
              : r.tone === "accent"
                ? "rounded-2xl border border-accent/35 bg-accentSoft p-4"
                : "rounded-2xl border border-line bg-canvas p-4"
          }
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-h3 text-ink">{r.layer}</p>
            <p className="text-micro uppercase tracking-wide text-ash">{r.owner}</p>
          </div>
          <p className="mt-1.5 text-caption text-ash">{r.scope}</p>
        </li>
      ))}
    </ol>
  );
}

function FurtherReading() {
  return (
    <Reveal as="aside" className="rounded-2xl border border-line bg-mist p-5">
      <p className="text-micro font-semibold uppercase tracking-wide text-ash">
        {FURTHER_READING.heading}
      </p>
      <p className="mt-1 text-caption text-ash">{FURTHER_READING.intro}</p>
      <ul className="mt-4 grid gap-3 md:grid-cols-3">
        {FURTHER_READING.items.map((item) => (
          <li key={item.title}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-xl border border-line bg-paper p-4 transition-colors duration-150 hover:border-accent"
            >
              <p className="text-micro font-semibold uppercase tracking-wide text-ash">{item.body}</p>
              <p className="mt-1 flex-1 text-caption font-semibold text-ink">{item.title}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-micro text-accent">
                {item.host}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </p>
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
