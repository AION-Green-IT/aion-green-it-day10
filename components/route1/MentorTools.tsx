"use client";

import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import { HOTSPOTS, R1, TASK1 } from "@/lib/route1";

/**
 * Route 1's mentor bar: demo auto-fill and the answer keys, both behind the
 * shared passcode. Deliberately visually minor and out of the way — a
 * convenience gate against accidental clicks, not a security boundary.
 *
 * The fill calls the store's raw actions for every persisted field this route
 * writes, so it exercises the same code path a learner does and the export
 * pipeline can be QA'd end to end without typing through the whole flow.
 */
export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);
  const markSeen = useProgress((s) => s.markSeen);
  const toggleCheck = useProgress((s) => s.toggleCheck);

  const fill = () => {
    setNote(R1.name, "Muchson");

    for (const h of HOTSPOTS) {
      markSeen(R1.inspected, h.id);
      markSeen(R1.order, h.id);
      choose(R1.category(h.id), h.correctCategory);
      choose(R1.lever(h.id), h.correctLever);
      choose(R1.fixType(h.id), h.correctFixType);
      setNote(R1.justification(h.id), h.sampleJustification);
    }
    // Categories are correct by construction above, but the lever/justification/fix-type
    // fields only render once Check all placements has confirmed them — flip that flag too,
    // so a mentor-filled run matches what a real completed run looks like.
    toggleCheck(R1.categoriesChecked, true);

    setNote(R1.reflection, TASK1.reflection.sample);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
    </div>
  );
}
