"use client";

import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { parseRich, type GlossaryEntry } from "@/lib/glossary";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { ArrowRight, Close, Help, Info } from "@/components/icons/LineIcons";

/**
 * Clickable jargon inside material prose, opening a plain-language explainer.
 *
 * The explainer is a native `<dialog>` opened with `showModal()` — no dialog
 * library (CLAUDE.md #9). That gives the backdrop, focus trapping and focus
 * return to the term for free. One dialog lives beside the content rather than
 * inside each term, because terms sit inside `<p>` elements and a `<dialog>` is
 * not allowed there.
 */

type GlossaryCtx = {
  entries: Record<string, GlossaryEntry>;
  open: (id: string) => void;
};

const GlossaryContext = createContext<GlossaryCtx | null>(null);

export function GlossaryProvider({
  entries,
  renderVisual,
  children,
}: {
  entries: Record<string, GlossaryEntry>;
  /** The route decides which diagram each entry draws. */
  renderVisual: (entry: GlossaryEntry) => ReactNode;
  children: ReactNode;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // One effect owns both the native dialog and the page scroll lock, so the two can never
  // disagree — a page left unscrollable with no dialog on screen is the failure this prevents.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d || !openId) return;
    if (!d.open) d.showModal();

    // Stop the page scrolling behind the dialog, padding for the scrollbar so nothing shifts sideways.
    const { body, documentElement } = document;
    const gutter = window.innerWidth - documentElement.clientWidth;
    const prev = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    return () => {
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
      if (d.open) d.close();
    };
  }, [openId]);

  // A dialog the browser closes on its own reports back through this event. The `close` event
  // is queued, so only honour it if the dialog is still shut by the time it arrives.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => {
      if (!d.open) setOpenId(null);
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const value = useMemo(() => ({ entries, open: setOpenId }), [entries]);
  const entry = openId ? (entries[openId] ?? null) : null;

  const jumpTo = (anchorId: string) => {
    setOpenId(null);
    // Let the dialog close and hand focus back before scrolling, so the two don't fight.
    window.setTimeout(() => scrollToAndFlash(anchorId, "ref"), 60);
  };

  /** Swaps the dialog straight to another entry — a timeline breadcrumb click. The dialog
   * itself never closes; only its content changes, so a multi-part story reads as one
   * continuous read rather than a close-then-reopen. */
  const openRelated = (id: string) => {
    if (entries[id]) setOpenId(id);
  };

  return (
    <GlossaryContext.Provider value={value}>
      <div>
        {children}
        <dialog
          ref={dialogRef}
          aria-labelledby={entry ? `gloss-title-${entry.id}` : undefined}
          // The body fills the box and owns the scrollbar, so only a backdrop click targets the dialog itself.
          onClick={(e) => {
            if (e.target === dialogRef.current) setOpenId(null);
          }}
          // Esc closes a modal dialog natively, but that path depends on the platform key code;
          // handling the key here as well keeps Esc reliable in embedded browsers and automated tests.
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              setOpenId(null);
            }
          }}
          // Explicit size limits replace the browser's default modal insets, which would otherwise
          // narrow the dialog — and shrink its diagram — on a phone.
          className="m-auto max-h-[calc(100dvh-16px)] w-[min(760px,calc(100vw-16px))] max-w-[calc(100vw-16px)] overflow-hidden rounded-2xl border border-line bg-paper p-0 text-ink shadow-lg backdrop:bg-ink/60"
        >
          {entry && (
            <GlossaryBody
              key={entry.id}
              entry={entry}
              visual={renderVisual(entry)}
              onClose={() => setOpenId(null)}
              onJump={jumpTo}
              onRelated={openRelated}
            />
          )}
        </dialog>
      </div>
    </GlossaryContext.Provider>
  );
}

function GlossaryBody({
  entry,
  visual,
  onClose,
  onJump,
  onRelated,
}: {
  entry: GlossaryEntry;
  visual: ReactNode;
  onClose: () => void;
  onJump: (anchorId: string) => void;
  onRelated: (id: string) => void;
}) {
  return (
    // 2px less than the dialog's own limit, for its top and bottom border.
    <div className="reveal-in max-h-[calc(100dvh-18px)] overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur">
        <div className="flex items-start justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 md:px-6">
          <div>
            <p className="text-micro font-semibold uppercase tracking-wide text-accent">{entry.kicker}</p>
            <h2 id={`gloss-title-${entry.id}`} className="text-h3 text-ink md:text-h2">
              {entry.question}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close explanation"
            className="shrink-0 rounded-lg p-1 text-ash transition-colors duration-150 hover:bg-mist hover:text-ink"
          >
            <Close className="h-5 w-5" />
          </button>
        </div>

        {entry.timeline && (
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 border-t border-line/70 px-4 py-2 sm:px-5 md:px-6">
            <span className="mr-1 text-micro font-semibold uppercase tracking-wide text-ash">One story:</span>
            {entry.timeline.sequence.map((step, i) => {
              const current = step.id === entry.id;
              return (
                <span key={step.id} className="flex items-center gap-1">
                  {i > 0 && <span className="text-micro text-ash">→</span>}
                  {current ? (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-micro font-semibold text-paper">
                      {step.label}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRelated(step.id)}
                      className="rounded-full border border-line px-2.5 py-0.5 text-micro font-semibold text-ash transition-colors duration-150 hover:border-accent hover:text-accent"
                    >
                      {step.label}
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        )}
      </header>

      <div className="space-y-5 px-4 py-4 sm:px-5 sm:py-5 md:px-6">
        <div className="space-y-3 text-body text-ink">
          {entry.plain.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {entry.secondary && (
          <div>
            <p className="text-h3 text-ink">{entry.secondary.heading}</p>
            <p className="mt-1.5 text-body text-ink">{entry.secondary.text}</p>
          </div>
        )}

        {entry.analogy && (
          <div className="flex gap-3 rounded-xl border border-accent/30 bg-accentSoft p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-micro font-semibold uppercase tracking-wide text-accent">{entry.analogy.label}</p>
              <p className="mt-1 text-caption text-ink">{entry.analogy.text}</p>
            </div>
          </div>
        )}

        {visual}

        {entry.steps && (
          <div>
            <p className="text-h3 text-ink">{entry.steps.heading}</p>
            {entry.steps.items.some((s) => s.tracks?.length) && (
              <p className="mt-0.5 text-micro text-ash">
                Each step is tagged with the question its evidence settles.
              </p>
            )}
            <ol className="mt-3 space-y-2">
              {entry.steps.items.map((step, i) => (
                <li key={i} className="flex gap-3 rounded-xl border border-line bg-paper p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-micro font-bold tabular-nums text-paper">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-micro font-semibold uppercase tracking-wide text-accent">{step.who}</p>
                      {step.tracks?.map((t) => (
                        <span
                          key={t}
                          className={clsx(
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                            t === "Efficient?" ? "bg-accentSoft text-accent" : "bg-mist text-ash",
                          )}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="mt-1 text-caption text-ink">{step.does}</p>
                    {step.yields && (
                      <p className="mt-1.5 inline-block rounded-lg bg-mist px-2 py-0.5 text-caption font-semibold tabular-nums text-ink">
                        {step.yields}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {entry.verdict && (
          <div className="rounded-xl border-2 border-ink bg-paper p-4">
            <p className="text-micro font-semibold uppercase tracking-wide text-ink">{entry.verdict.heading}</p>
            <p className="mt-1 text-caption text-ink">{entry.verdict.text}</p>
          </div>
        )}

        {entry.news && (
          <div className="rounded-xl border border-line border-l-4 border-l-ink bg-paper p-4">
            <p className="text-micro font-semibold uppercase tracking-wide text-ash">{entry.news.heading}</p>
            <p className="mt-1 text-caption text-ink">{entry.news.text}</p>
            <p className="mt-2 text-micro italic text-ash">Source: {entry.news.source}</p>
          </div>
        )}

        {entry.whyEnergy && (
          <div className="rounded-xl border border-line bg-canvas p-4">
            <p className="text-micro font-semibold uppercase tracking-wide text-ash">{entry.whyEnergy.heading}</p>
            <p className="mt-1 text-caption text-ink">{entry.whyEnergy.text}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          {entry.seeAlso ? (
            <button
              type="button"
              onClick={() => onJump(entry.seeAlso!.anchorId)}
              className="inline-flex items-center gap-1.5 text-caption font-semibold text-accent hover:text-accentHi"
            >
              {entry.seeAlso.label}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <span />
          )}
          <button type="button" onClick={onClose} className="btn-accent">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

/** A marked term, styled as a link but a button — it opens an explainer rather than navigating. */
export function GlossaryTerm({ id, label }: { id: string; label: string }) {
  const ctx = useContext(GlossaryContext);
  if (!ctx?.entries[id]) return <>{label}</>;
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => ctx.open(id)}
      className="inline font-semibold text-accent underline decoration-accent/50 decoration-dotted decoration-2 underline-offset-4 transition-colors duration-150 hover:text-accentHi hover:decoration-accentHi"
    >
      {label}
      <Help className="ml-0.5 inline-block h-3.5 w-3.5 -translate-y-px align-middle" />
      <span className="sr-only"> — open a plain-language explanation</span>
    </button>
  );
}

/** Any other control that opens an explainer, e.g. a "Deep example" link on a card. */
export function GlossaryButton({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(GlossaryContext);
  if (!ctx?.entries[id]) return null;
  return (
    <button type="button" aria-haspopup="dialog" onClick={() => ctx.open(id)} className={className}>
      {children}
    </button>
  );
}

/** Prose that may contain `[[id|label]]` markers. Renders plain text when there is nothing to mark. */
export function RichText({ text }: { text: string }) {
  const segments = parseRich(text);
  if (segments.length === 1 && segments[0].kind === "text") return <>{text}</>;
  return (
    <>
      {segments.map((s, i) =>
        s.kind === "text" ? (
          <Fragment key={i}>{s.text}</Fragment>
        ) : (
          <GlossaryTerm key={i} id={s.id} label={s.label} />
        ),
      )}
    </>
  );
}
