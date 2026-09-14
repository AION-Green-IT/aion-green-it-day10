/**
 * Plain-language explainers for jargon inside material prose.
 *
 * Copy marks a term inline as `[[id|visible label]]` — for example
 * "an [[n-plus-one|N+1 query]] never sees an electricity bill". MaterialBlock
 * renders the label as a button that opens that entry's explainer. Anywhere no
 * glossary is provided, the label renders as ordinary text, so a marker can
 * never leak raw brackets onto the page.
 */

export type GlossaryVisualState = {
  id: string;
  label: string;
  /** May contain `{placeholders}` the visual fills in, e.g. `{n}`. */
  caption: string;
};

export type GlossaryEntry = {
  id: string;
  kicker: string;
  question: string;
  /** The plain definition, one short paragraph per string. */
  plain: string[];
  /** A follow-on idea the term depends on, e.g. "over-fetching" after "API call". */
  secondary?: { heading: string; text: string };
  analogy: { label: string; text: string };
  /** `key` picks the diagram; `states` are the positions of its wasteful/efficient toggle. */
  visual: { key: string; title: string; states: GlossaryVisualState[] };
  whyEnergy: { heading: string; text: string };
  /** Where the material covers this in depth — closes the explainer and scrolls there. */
  seeAlso?: { anchorId: string; label: string };
};

export type RichSegment =
  | { kind: "text"; text: string }
  | { kind: "term"; id: string; label: string };

const MARKER = /\[\[([a-z0-9-]+)\|([^\]]+)\]\]/g;

export function parseRich(text: string): RichSegment[] {
  const out: RichSegment[] = [];
  let last = 0;
  for (const m of text.matchAll(MARKER)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ kind: "text", text: text.slice(last, at) });
    out.push({ kind: "term", id: m[1], label: m[2] });
    last = at + m[0].length;
  }
  if (last < text.length) out.push({ kind: "text", text: text.slice(last) });
  return out;
}

/** The same text with markers reduced to their labels — for anywhere a plain string is needed. */
export function stripRich(text: string): string {
  return text.replace(MARKER, "$2");
}
