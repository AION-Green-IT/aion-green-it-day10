"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { useProgress } from "@/lib/store";
import {
  APPNEXA_TRACE,
  CATEGORIES,
  HOTSPOTS,
  R1,
  TRACE_PINS,
  hotspotById,
  type CategoryId,
} from "@/lib/route1";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { materialRefs } from "@/lib/route1";
import { Close, DragHandle, Redo, Undo } from "@/components/icons/LineIcons";
import { FlowDiagram } from "@/components/ui/FlowDiagram";
import { CategoryGlyph } from "./CategoryGrid";
import { useFindingSortStore, type PlacementMap } from "./useFindingSortStore";
import { useRoute1, domId } from "./useRoute1";

/**
 * Stage 1 of the task: inspect a flagged component on the trace, then sort its
 * symptom card into one of the six categories.
 *
 * Placement supports native HTML5 drag, tap-to-select as an accessible
 * fallback, removal, and full undo/redo through the shared history utility
 * (CLAUDE.md #5). The *current* placement lives only in the persisted progress
 * store — the history store holds snapshots, never a second copy of the truth.
 */
export function SystemTrace() {
  const r1 = useRoute1();
  const choose = useProgress((s) => s.choose);
  const markSeen = useProgress((s) => s.markSeen);

  const record = useFindingSortStore((s) => s.recordChange);
  const undo = useFindingSortStore((s) => s.undo);
  const redo = useFindingSortStore((s) => s.redo);
  const canUndo = useFindingSortStore((s) => s.past.length > 0);
  const canRedo = useFindingSortStore((s) => s.future.length > 0);

  /** Which symptom card is open on the trace (not yet sorted). */
  const [openId, setOpenId] = useState<string | null>(null);
  /** Tap-to-select fallback: the card armed for a bin click. */
  const [armedId, setArmedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overBin, setOverBin] = useState<CategoryId | null>(null);
  const [noop, setNoop] = useState<"undo" | "redo" | null>(null);
  const noopTimer = useRef<number | null>(null);

  const flashNoop = (which: "undo" | "redo") => {
    setNoop(which);
    if (noopTimer.current) window.clearTimeout(noopTimer.current);
    noopTimer.current = window.setTimeout(() => setNoop(null), 320);
  };

  // Takes the history utility's wide map: it only ever writes category ids back
  // into the store, and the snapshots it restores came from there in the first place.
  const applyPlacements = (next: PlacementMap) => {
    for (const h of HOTSPOTS) choose(R1.category(h.id), next[h.id] ?? "");
  };

  const place = (hotspotId: string, category: CategoryId) => {
    record(r1.placements);
    choose(R1.category(hotspotId), category);
    // First time this card is sorted, stamp its position in the report order.
    markSeen(R1.order, hotspotId);
    setOpenId(null);
    setArmedId(null);
    setDragId(null);
    setOverBin(null);
  };

  const removePlacement = (hotspotId: string) => {
    record(r1.placements);
    choose(R1.category(hotspotId), "");
    // Re-open and re-arm it, so the next click or drop places it again
    // immediately rather than forcing a fresh hunt for the pin (CLAUDE.md #5).
    setOpenId(hotspotId);
    setArmedId(hotspotId);
  };

  const inspect = (hotspotId: string) => {
    markSeen(R1.inspected, hotspotId);
    setOpenId((cur) => (cur === hotspotId ? null : hotspotId));
    setArmedId(r1.placements[hotspotId] ? null : hotspotId);
  };

  const unsorted = HOTSPOTS.filter((h) => !r1.placements[h.id]);
  const openHotspot = openId ? hotspotById(openId) : null;

  return (
    <div id={domId.trace} className="scroll-mt-24 space-y-5">
      {/* --- The trace --- */}
      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-micro font-semibold uppercase tracking-wide text-accent">
              Step 1 · Inspect
            </p>
            <h3 className="text-h3 text-ink">AppNexa Solutions — live system trace</h3>
            <p className="mt-1 max-w-prose text-caption text-ash">
              Six components are flagged. Click a numbered pin to see what that part of the system is actually doing.
              A pin turns green once its finding is fully worked up.
            </p>
          </div>
          <p className="rounded-full border border-line px-3 py-1 text-micro font-semibold text-ash">
            <span className="tabular-nums text-ink">{r1.inspected.length}</span> / {HOTSPOTS.length} inspected
          </p>
        </div>

        <div className="mt-4">
          <FlowDiagram
            graph={APPNEXA_TRACE}
            pins={TRACE_PINS}
            activePinId={openId}
            completePinIds={r1.completeHotspotIds}
            onPinClick={inspect}
          />
        </div>

        {/* Symptom card for the open pin. */}
        {openHotspot && (
          <div className="reveal-in mt-4 rounded-2xl border border-accent/40 bg-accentSoft p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-micro font-semibold uppercase tracking-wide text-accent">
                  Hotspot {openHotspot.n} · {openHotspot.location}
                </p>
                <p className="text-h3 text-ink">{openHotspot.title}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpenId(null);
                  setArmedId(null);
                }}
                aria-label="Close symptom card"
                className="shrink-0 text-ash hover:text-ink"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-body text-ink">{openHotspot.symptom}</p>
            <p className="mt-3 text-caption font-semibold text-accent">
              {r1.placements[openHotspot.id]
                ? "Already sorted — its workup is below."
                : "Now sort it: drag its card into a category, or select the card and click a bin."}
            </p>
          </div>
        )}
      </div>

      {/* --- Unsorted cards + the six bins --- */}
      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-micro font-semibold uppercase tracking-wide text-accent">
              Step 2 · Sort
            </p>
            <h3 className="text-h3 text-ink">Six categories, six bins</h3>
            <p className="mt-1 max-w-prose text-caption text-ash">
              Drag a symptom card into the category it belongs to — or click the card to select it, then click a bin.
              A wrong placement can be removed and retried at any time.
            </p>
            <MaterialRefs refs={materialRefs(["categories", "correctness"])} />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                const prev = undo(r1.placements);
                if (prev) applyPlacements(prev);
                else flashNoop("undo");
              }}
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-micro font-semibold transition-colors duration-150",
                canUndo ? "text-ink hover:border-ash" : "text-ash",
                noop === "undo" && "anim-shake-noop",
              )}
            >
              <Undo className="h-3.5 w-3.5" /> Undo
            </button>
            <button
              type="button"
              onClick={() => {
                const next = redo(r1.placements);
                if (next) applyPlacements(next);
                else flashNoop("redo");
              }}
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-micro font-semibold transition-colors duration-150",
                canRedo ? "text-ink hover:border-ash" : "text-ash",
                noop === "redo" && "anim-shake-noop",
              )}
            >
              <Redo className="h-3.5 w-3.5" /> Redo
            </button>
          </div>
        </div>

        {/* Cards still waiting to be sorted. */}
        <div className="mt-4 rounded-2xl border border-dashed border-line bg-canvas p-3">
          <p className="text-micro font-semibold uppercase tracking-wide text-ash">
            Unsorted findings ({unsorted.length})
          </p>
          {unsorted.length === 0 ? (
            <p className="mt-2 text-caption text-ash">
              All six sorted. Each one&apos;s workup is below — lever, justification and fix type.
            </p>
          ) : (
            <ul className="mt-2 flex flex-wrap gap-2">
              {unsorted.map((h) => {
                const seenIt = r1.inspected.includes(h.id);
                const armed = armedId === h.id;
                return (
                  <li key={h.id} id={domId.unsorted(h.id)} className="scroll-mt-24 rounded-xl">
                    <button
                      type="button"
                      draggable={seenIt}
                      onDragStart={(e) => {
                        setDragId(h.id);
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", h.id);
                      }}
                      onDragEnd={() => {
                        setDragId(null);
                        setOverBin(null);
                      }}
                      onClick={() => {
                        if (!seenIt) {
                          inspect(h.id);
                          return;
                        }
                        setArmedId((cur) => (cur === h.id ? null : h.id));
                        setOpenId(h.id);
                      }}
                      className={clsx(
                        "flex max-w-[260px] items-center gap-2 rounded-xl border px-3 py-2 text-left text-caption transition-all duration-150",
                        dragId === h.id && "is-dragging",
                        armed
                          ? "border-accent bg-accentSoft text-ink shadow-lift"
                          : seenIt
                            ? "border-line bg-paper text-ink hover:border-accent"
                            : "border-dashed border-line bg-paper text-ash hover:border-ash",
                      )}
                    >
                      {seenIt ? (
                        <DragHandle className="h-4 w-4 shrink-0 text-ash" />
                      ) : (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-ash text-micro font-semibold tabular-nums">
                          {h.n}
                        </span>
                      )}
                      <span className="truncate font-semibold">{h.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {unsorted.some((h) => !r1.inspected.includes(h.id)) && (
            <p className="mt-2 text-micro text-ash">
              Faded cards haven&apos;t been inspected yet — click one to jump to its symptom, or use its pin on the
              trace above.
            </p>
          )}
        </div>

        {/* The six bins. */}
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const held = HOTSPOTS.filter((h) => r1.placements[h.id] === c.id);
            const isOver = overBin === c.id;
            return (
              <li
                key={c.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  setOverBin(c.id);
                }}
                onDragLeave={() => setOverBin((cur) => (cur === c.id ? null : cur))}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain") || dragId;
                  if (id) place(id, c.id);
                }}
                className={clsx(
                  "rounded-2xl border-2 border-dashed p-3 transition-all duration-150",
                  isOver ? "is-drop-target" : "border-line bg-canvas",
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (armedId) place(armedId, c.id);
                  }}
                  aria-label={
                    armedId
                      ? `Place the selected card into ${c.name}`
                      : `${c.name} — select a card first`
                  }
                  className="flex w-full items-start gap-2.5 text-left"
                >
                  <CategoryGlyph category={c} size="sm" active={isOver} />
                  <span className="min-w-0">
                    <span className="block text-caption font-semibold text-ink">{c.name}</span>
                    <span className="block text-micro text-ash">{c.short}</span>
                  </span>
                </button>

                <ul className="mt-2.5 space-y-1.5">
                  {held.map((h) => {
                    const correct = h.correctCategory === c.id;
                    const chipTone = !r1.categoriesChecked
                      ? "border-line bg-paper"
                      : correct
                        ? "border-accent/35 bg-accentSoft"
                        : "border-danger/35 bg-danger/10";
                    const badgeTone = !r1.categoriesChecked
                      ? "bg-ink text-paper"
                      : correct
                        ? "bg-accent text-paper"
                        : "bg-danger text-paper";
                    return (
                    <li
                      key={h.id}
                      className={clsx("flex items-center gap-1.5 rounded-lg border px-2 py-1.5", chipTone)}
                    >
                      <span
                        className={clsx(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-micro font-semibold tabular-nums",
                          badgeTone,
                        )}
                      >
                        {h.n}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-micro font-semibold text-ink">
                        {h.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePlacement(h.id)}
                        aria-label={`Remove ${h.title} from ${c.name} and try again`}
                        title="Remove and retry"
                        className="shrink-0 text-ash hover:text-danger"
                      >
                        <Close className="h-3.5 w-3.5" />
                      </button>
                    </li>
                    );
                  })}
                  {held.length === 0 && (
                    <li className="rounded-lg border border-dashed border-line px-2 py-2 text-micro text-ash">
                      {armedId ? "Click to place the selected card" : "Drop a card here"}
                    </li>
                  )}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
