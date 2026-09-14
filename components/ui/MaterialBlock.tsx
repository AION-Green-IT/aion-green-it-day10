import { Icon } from "@/components/icons/LineIcons";
import { Reveal } from "@/components/ui/Reveal";
import { IndustryCallout } from "./IndustryCallout";
import { RichText } from "./Glossary";
import type { IconKey } from "@/lib/routes";

export type MaterialBlockContent = {
  id: string;
  icon: IconKey;
  kicker: string;
  title: string;
  definition: string;
  insight: string;
  takeaway: string;
  /**
   * Standard #11a: the decision rules this section hands the learner, phrased
   * the way the task will need them — including the rule that rules out the
   * plausible wrong option. Prose explains a concept; these tell someone how to
   * actually answer.
   */
  reasoning: string[];
  callout: { label: string; text: string };
  /** Named external sources for this block. Optional so older routes that cite inline still typecheck. */
  references?: { label: string; url?: string }[];
};

/** One material block: header, deep prose, a visualizer slot, decision rules, and a callout. */
export function MaterialBlock({
  block,
  anchorId,
  children,
}: {
  block: MaterialBlockContent;
  /** DOM id a task step's MaterialRefs chip scrolls to. Defaults to the block id. */
  anchorId?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section" id={anchorId ?? block.id} className="scroll-mt-24 space-y-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accentSoft text-accent">
          <Icon name={block.icon} className="h-5 w-5" />
        </span>
        <div>
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">
            {block.kicker}
          </p>
          <h2 className="text-h2 text-ink">{block.title}</h2>
        </div>
      </div>

      <div className="max-w-prose space-y-3 text-body text-ash">
        <p>
          <span className="font-semibold text-ink">Definition. </span>
          <RichText text={block.definition} />
        </p>
        <p>
          <span className="font-semibold text-ink">Insight. </span>
          <RichText text={block.insight} />
        </p>
        <p>
          <span className="font-semibold text-ink">Practical takeaway. </span>
          <RichText text={block.takeaway} />
        </p>
      </div>

      <div className="card p-5">{children}</div>

      {block.reasoning.length > 0 && (
        <div className="rounded-2xl border border-accent/30 bg-accentSoft/50 p-4">
          <p className="text-micro font-semibold uppercase tracking-wide text-accent">
            How to decide when this comes up in the task
          </p>
          <ul className="mt-2 space-y-1.5">
            {block.reasoning.map((rule, i) => (
              <li key={i} className="flex gap-2 text-caption text-ink">
                <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <RichText text={rule} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <IndustryCallout label={block.callout.label} text={block.callout.text} />

      {block.references && block.references.length > 0 && (
        <div className="border-t border-line pt-3">
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">Sources</p>
          <ul className="mt-1 space-y-0.5">
            {block.references.map((r) => (
              <li key={r.label} className="text-micro text-ash">
                {r.url ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted underline-offset-2 hover:text-ink"
                  >
                    {r.label}
                  </a>
                ) : (
                  r.label
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Reveal>
  );
}
