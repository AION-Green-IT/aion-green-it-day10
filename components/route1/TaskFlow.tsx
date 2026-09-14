"use client";

import { useProgress, useHydrated } from "@/lib/store";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { R1, TASK1, materialRefs } from "@/lib/route1";
import { SystemTrace } from "./SystemTrace";
import { CheckAllPlacements } from "./CheckAllPlacements";
import { HotspotWorkups } from "./HotspotWorkup";
import { DiagnosisReport } from "./DiagnosisReport";
import { ExportBar } from "./ExportBar";
import { useRoute1, domId } from "./useRoute1";

/**
 * Task 1 — AppNexa System Trace. Work on the left, the Diagnosis Report
 * building itself on the right, and the never-disabled export bar underneath.
 */
export function TaskFlow() {
  return (
    <section id="task" className="scroll-mt-24 space-y-8">
      <SectionHeading
        kicker={`${TASK1.tag} · about 20 minutes`}
        title={TASK1.title}
        intro={TASK1.framing}
      />

      <div className="rounded-2xl border border-line bg-mist p-5">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">The case</p>
        <p className="mt-1 max-w-prose text-caption text-ash">{TASK1.companyBrief}</p>
        <MaterialRefs refs={materialRefs(["footprint", "correctness"])} lead="Grounded in" />
      </div>

      <NameField />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-8">
          <SystemTrace />
          <CheckAllPlacements />
          <HotspotWorkups />
        </div>

        <div className="lg:sticky lg:top-20">
          <DiagnosisReport />
        </div>
      </div>

      <ExportBar />
    </section>
  );
}

/** Learner name — prompted once, persisted, and what the export filename is built from. */
function NameField() {
  const hydrated = useHydrated();
  const setNote = useProgress((s) => s.setNote);
  const r1 = useRoute1();

  return (
    <div id={domId.name} className="scroll-mt-24 rounded-2xl border border-line bg-paper p-5">
      <label htmlFor="r1-name-field" className="block text-caption font-semibold text-ink">
        {TASK1.nameField.label}
      </label>
      <p className="mt-0.5 text-micro text-ash">{TASK1.nameField.instruction}</p>
      <input
        id="r1-name-field"
        type="text"
        value={hydrated ? r1.name : ""}
        onChange={(e) => setNote(R1.name, e.target.value)}
        placeholder={TASK1.nameField.placeholder}
        className="mt-2 w-full max-w-sm rounded-xl border border-line bg-paper px-3 py-2.5 text-caption text-ink"
      />
    </div>
  );
}
