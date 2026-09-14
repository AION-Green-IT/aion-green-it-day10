"use client";

import { useProgress } from "@/lib/store";
import { MentorFillButton } from "@/components/ui/MentorFillButton";
import { AnswerKeyButton } from "@/components/ui/AnswerKeyButton";
import { QUADRANT_CARDS, RACI_LETTERS, RACI_ROLES, R3, TASK3 } from "@/lib/route3";

/**
 * Route 3's mentor bar. The demo fill ranks A, D, E — a defensible sample
 * rather than "the" answer, since the ranking is deliberately not graded —
 * places all five quadrant cards on their reference squares, and assigns a
 * valid one-Accountable RACI so the export pipeline can be QA'd end to end.
 */
export function MentorTools() {
  const setNote = useProgress((s) => s.setNote);
  const choose = useProgress((s) => s.choose);
  const markSeen = useProgress((s) => s.markSeen);
  const toggleCheck = useProgress((s) => s.toggleCheck);
  const resetSection = useProgress((s) => s.resetSection);

  const fill = () => {
    setNote(R3.name, "Muchson");

    // Step 1 — a defensible top three, in order.
    resetSection(R3.ranking);
    for (const id of ["A", "D", "E"]) markSeen(R3.ranking, id);
    setNote(R3.rankRationale, TASK3.rank.rationale.sample);

    // Step 2 — every card on its reference square.
    for (const c of QUADRANT_CARDS) choose(R3.quadrant(c.id), c.correct);

    // Step 3 — a valid RACI: exactly one Accountable, nothing left empty.
    for (const role of RACI_ROLES) {
      for (const letter of RACI_LETTERS) toggleCheck(R3.raci(role.id, letter.id), false);
    }
    toggleCheck(R3.raci("cto", "A"), true);
    toggleCheck(R3.raci("guild", "R"), true);
    toggleCheck(R3.raci("leads", "R"), true);
    toggleCheck(R3.raci("vpeng", "C"), true);
    toggleCheck(R3.raci("pm", "C"), true);
    toggleCheck(R3.raci("auditor", "I"), true);

    // Steps 2 and 3 are correct/valid by construction above, but Steps 3 and 4
    // stay locked until each is actually checked once — flip both flags too, so
    // a mentor-filled run unlocks fully, matching a real completed one.
    toggleCheck(R3.quadrantChecked, true);
    toggleCheck(R3.raciChecked, true);

    // Step 4.
    setNote(R3.decideNow, TASK3.decideNow.now.sample);
    setNote(R3.decideWhy, TASK3.decideNow.why.sample);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <MentorFillButton onFill={fill} />
      <AnswerKeyButton />
    </div>
  );
}
