/**
 * Route 2 — Application (L2). All learner-facing copy and pure data live here
 * so components stay presentational. Case: AppNexa Solutions, continuing from
 * Route 1 — Route 1 diagnosed the problems, Route 2 decides what to fund.
 *
 * Curriculum source: Module 7 (Day 1 of 2) — "Achieving Energy Efficiency in
 * Programming: Energy-Efficient Software and Green Coding Principles."
 */

import type { IconKey } from "@/lib/routes";
import type { AnswerKeyBlock } from "@/lib/answerKey";
import type { FlowGraph, FlowPin } from "@/lib/flowDiagram";
import type { RadarAxis } from "@/components/ui/RadarChart";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map — every key this route writes to the shared progress store.
// ---------------------------------------------------------------------------
export const R2 = {
  name: LEARNER_NAME_KEY,
  /** Which of the four answers the learner gave to an option's situational question. */
  situational: (optionId: string) => `r2:sit:${optionId}`,
  /** One key per predicted dimension. Stored as a stringified 1–5. */
  predict: (optionId: string, dimKey: string) => `r2:pred:${optionId}:${dimKey}`,
  /** markSeen bucket: options whose real profile has been revealed at least once. */
  revealed: "r2:revealed",
  pick: "r2:pick",
  rationale: "r2:rationale",
  feasibility: "r2:feasibility",
  followUp: (n: 1 | 2) => `r2:followup:${n}`,
  risk: (n: 1 | 2) => `r2:risk:${n}`,
} as const;

// ---------------------------------------------------------------------------
// Material — five sections (A–E).
// ---------------------------------------------------------------------------
export type MaterialSectionId =
  | "constraint"
  | "recap"
  | "measures"
  | "dimensions"
  | "defensible";

export type MaterialSection = {
  id: MaterialSectionId;
  n: 1 | 2 | 3 | 4 | 5;
  letter: "A" | "B" | "C" | "D" | "E";
  icon: IconKey;
  kicker: string;
  title: string;
  definition: string;
  insight: string;
  takeaway: string;
  reasoning: string[];
  callout: { label: string; text: string };
  references: { label: string; url?: string }[];
};

export function materialAnchorId(id: MaterialSectionId): string {
  return `r2-material-${id}`;
}

const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  constraint: "A · The real constraint",
  recap: "B · What you're choosing between",
  measures: "C · Three measures, three stages",
  dimensions: "D · The seven dimensions",
  defensible: "E · Making a defensible call",
};

export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}

export const PAGE_INTRO = {
  tag: "ROUTE 2 — APPLICATION",
  title: "Choosing Where to Spend Effort",
  body: "Knowing what's wrong is easy. Deciding what to fix first — with limited people and incomplete data — is the actual job. This route gives you a defensible way to compare options, not just a gut feeling.",
} as const;

export const MATERIAL: MaterialSection[] = [
  {
    id: "constraint",
    n: 1,
    letter: "A",
    icon: "coins",
    kicker: "A · What actually limits this decision",
    title: "The Real Constraint",
    definition:
      "AppNexa's quarter has four hard edges, and none of them is technical. Development capacity is limited and already committed — product management continues to demand high implementation speed, and that demand has not been withdrawn to make room for this work. The data on AppNexa's concrete energy and resource effects is incomplete: there is no full SCI telemetry yet, so nobody can say with evidence which application is actually the most expensive to run. Existing applications cannot be rebuilt without limit — the codebase is live, customers are on it, and a free hand to re-architect does not exist. And management wants a visible improvement this quarter while explicitly refusing to create a brake on innovation.",
    insight:
      "Read those four together and the shape of the problem changes. This is no longer a technical question — Route 1 already established what is wrong and roughly where. It is a resource-allocation question under incomplete information: one quarter of limited capacity, three defensible places to spend it, and not enough evidence to prove which is best. That is a different skill, and it is the one that separates an engineer who can diagnose from one who can be trusted with a budget.",
    takeaway:
      "The uncomfortable part is that no amount of further analysis dissolves this. Waiting for complete data is itself a choice with a cost — a quarter spent measuring is a quarter not spent fixing, and the infrastructure bill keeps arriving either way. What a senior engineer is actually paid for here is not certainty. It is a recommendation that names its own trade-off honestly enough that the people funding it can decide with their eyes open.",
    reasoning: [
      "Judge every option against the constraint as it actually is — limited developer capacity, unchanged speed pressure — not against an imagined quarter where the team has spare time.",
      "Treat \"we need more data first\" as an option with a price, not as a neutral safe default. Option C is that choice made deliberately; drifting into it by hesitation is not the same thing.",
      "Rules out the tempting wrong answer: an option is not stronger because it is more thorough. If it cannot realistically be executed this quarter under the real constraint, its feasibility score is what disqualifies it, however good it looks on paper.",
    ],
    callout: {
      label: "Where AppNexa stands now",
      text: "Route 1 produced a diagnosis: six findings, most of them needing a standard rather than a patch. Management has read it, believes it, and has funded exactly one line of measures. That is the situation you are walking into.",
    },
    references: [
      { label: "Green Software Foundation — Green Software Patterns catalog", url: "https://patterns.greensoftware.foundation/" },
      { label: "ISO/IEC 21031:2024 — Software Carbon Intensity (SCI) specification", url: "https://sci.greensoftware.foundation/" },
    ],
  },
  {
    id: "recap",
    n: 2,
    letter: "B",
    icon: "gauge",
    kicker: "B · Enough context to decide, from a standing start",
    title: "Quick Recap: What You're Prioritizing Between",
    definition:
      "If you have not done Route 1, here is the whole of what you need. Software has a physical energy cost, and it can be expressed as a rate rather than a total: the Software Carbon Intensity specification, published as ISO/IEC 21031:2024, defines it as the energy a system consumes multiplied by the carbon intensity of the electricity where that energy is drawn, plus the embodied emissions of the hardware required to run it, all divided by a functional unit — per API call, per user, per transaction. Expressed that way it is comparable release over release, which a yearly total never is. Moving that rate down is the shared goal behind all three options in this route.",
    insight:
      "Inefficiency is not scattered randomly; it collects in six recognisable areas. Architecture — what components return and how they communicate. Data Processing — how much computation one user action triggers. Storage — what gets written, how often, and in how many places. Network Load — how much data moves and how many times. Background Processes — work that runs whether or not anyone benefits. And Management Logic — what the organisation chooses to measure and reward, which is not a technical pattern at all and is the one most often missed. Option B below means fixing instances in the first five; Option A and Option C are both, in different ways, attempts to fix the sixth.",
    takeaway:
      "That is deliberately compact — enough for the three options to make sense, not a replacement for Route 1's full treatment. If a term below feels thin, Route 1 is one click away and nothing here is gated on it. What matters for this route is the frame: every option is a bet about where a limited quarter buys the most movement on that rate.",
    reasoning: [
      "When comparing options, ask which part of the rate each one moves, and when. Technical rework moves energy consumed now; a guideline moves it only for work not yet written; measurement moves nothing yet and tells you where to aim next.",
      "Remember that Management Logic is a real category, not a soft one. Two of the three options on the table are attempts to change it — that is a legitimate engineering intervention, not a detour.",
      "Rules out the tempting wrong answer: an option that produces no measurable movement this quarter is not automatically the weak one. Ask what it makes possible next quarter before scoring it.",
    ],
    callout: {
      label: "Arriving here without Route 1",
      text: "This route stands on its own — every concept Task 2 needs is on this page. Route 1 goes deeper on the six categories and on how SCI is built, but nothing here waits on it.",
    },
    references: [
      { label: "ISO/IEC 21031:2024 — Software Carbon Intensity (SCI) specification", url: "https://sci.greensoftware.foundation/" },
      { label: "Green Software Foundation — Green Software Practitioner", url: "https://learn.greensoftware.foundation/" },
    ],
  },
  {
    id: "measures",
    n: 3,
    letter: "C",
    icon: "layers",
    kicker: "C · Three options, three lifecycle stages",
    title: "Three Measures, Mapped to Where They Act",
    definition:
      "Management is weighing three lines of measures, and the clearest way to tell them apart is to ask at which point in the software lifecycle each one acts. The Green Software Foundation's Green Software Patterns catalog — an open, peer-reviewed collection of vendor-neutral engineering patterns — organises its patterns by exactly that: Requirements, Architecture, Development, Operations. Each of AppNexa's three options lands at a different stage, and the stage predicts most of its behaviour.",
    insight:
      "Option A — Binding Green Coding Guidelines — is a Requirements-stage intervention. It sets constraints and criteria before code is written, which is the cheapest stage at which to change behaviour and also the slowest to show a measurable result, because it only affects work that has not started yet. Option B — Technical Rework of Particularly Inefficient Applications — is a Development-stage intervention. It edits existing code and architecture directly, which is the fastest way to produce a real before-and-after number, and also the option that touches live systems and competes head-on with roadmap time. Option C — Development Controlling & Observability — is an Operations-stage intervention. It changes no behaviour at all this quarter; it builds the measurement layer that would tell you, with evidence instead of guesswork, where A and B would have the most effect next quarter.",
    takeaway:
      "There is no universally correct order among the three. Which stage you fund first depends on what your organisation currently lacks most: a standard, a fix, or the evidence to justify either. An organisation with good telemetry and no rules should start at Requirements. One with clear evidence of three expensive systems and a free sprint should start at Development. One that cannot name its worst workload — which is AppNexa's actual position — has a real case for Operations first. The skill is recognising which of those three you are in.",
    reasoning: [
      "Identify what the organisation is missing before ranking the options: a standard, a fix, or the evidence. The option that supplies the missing one is usually the strongest, regardless of which looks most productive.",
      "A Requirements-stage measure cannot show a result this quarter by construction — it governs work not yet written. Score it on leverage and long-term effect, not on immediate impact.",
      "An Operations-stage measure changes nothing visible in the quarter it is built. Its value is entirely in what the next decision can be based on, so judge it on what it makes decidable.",
      "Rules out the tempting wrong answer: the option that produces the most visible activity this quarter is not automatically the one that moves the rate the most. Development-stage work is the most legible and the least durable.",
    ],
    callout: {
      label: "Why the stage matters",
      text: "Stage predicts speed-to-evidence and durability, and the two pull in opposite directions. The earlier the stage, the cheaper the behaviour change and the longer the wait for a number.",
    },
    references: [
      { label: "Green Software Foundation — Green Software Patterns catalog", url: "https://patterns.greensoftware.foundation/" },
      { label: "Green Software Foundation — Green Software Practitioner", url: "https://learn.greensoftware.foundation/" },
    ],
  },
  {
    id: "dimensions",
    n: 4,
    letter: "D",
    icon: "target",
    kicker: "D · The seven axes you will score on",
    title: "Judging Trade-offs With Real Dimensions",
    definition:
      "Task 2 asks you to predict each option's profile across seven dimensions before seeing the real one. Those dimensions are not arbitrary labels — each names a distinct question a senior consultant has to answer in front of people who control budget, and each can pull against the others. Read them as questions, not as scores. The profiles themselves are a designed teaching case, not a measurement of a real company — built so that no option dominates and every number holds up on its own terms, the way a business-school case is constructed rather than measured. That is why each dimension carries the specific reason behind its number when you reveal it: a score here is something to argue with, not something to take on faith.",
    insight:
      "Strategic Leverage asks whether this creates a foundation other future decisions can build on, or only solves today's instance of today's problem. Impact on Efficiency asks how directly and how soon this moves AppNexa's real resource consumption, as against how much it merely prepares the ground for a future move. Feasibility asks whether, given limited developer capacity and competing roadmap pressure, this can realistically be executed this quarter without quietly failing. Team Acceptance asks whether engineers will experience it as a meaningful, well-supported change or as an unfunded mandate competing with what they are already measured on — the same Management Logic tension from Route 1, where a guideline that does not change what sprint reviews reward loses to the metric that is actually being watched. Measurability asks whether, after the quarter ends, you can show whether this worked with a number rather than a feeling. Long-term Effect asks whether solving it now prevents the same class of problem recurring, or fixes one instance while the underlying cause stays in place. And Risk covers two different things at once: execution risk, meaning touching live systems and breaking something, and inaction risk, meaning spending a quarter with nothing visible to show while the cost keeps accumulating.",
    takeaway:
      "Measurability deserves a note, because it is the dimension most often waved away as impossible. It is not, any more. The major cloud providers have started closing exactly this gap in their own tooling — Microsoft's Azure Carbon Optimization dashboard, for instance, gives operations teams a running per-workload emissions view rather than a single annual total, precisely so that decisions like this one do not have to be argued from intuition. When you score an option low on Measurability, that should be a statement about that option, not a shrug about the state of the art.",
    reasoning: [
      "Score Risk as \"how much risk\", so a higher number is worse. It is the one dimension on the chart where a bigger polygon is not better, and the kind of risk differs per option: execution risk for rework, paper-policy risk for a guideline, optics risk for measurement.",
      "Keep Impact on Efficiency and Long-term Effect apart. The first asks how much moves this quarter; the second asks whether it stays moved. An option can score high on one and low on the other, and the most interesting options do.",
      "Keep Feasibility and Team Acceptance apart too. Feasibility is whether there is capacity to do it; acceptance is whether the people doing it have a reason to care. A measure can be entirely feasible and still fail on acceptance.",
      "Rules out the tempting wrong answer: no option scores high on everything, and an option you have scored as uniformly strong is a sign you have not yet found its trade-off — go back and look for what it gives up.",
    ],
    callout: {
      label: "Risk reads backwards",
      text: "On the radar, six axes are \"more is better\" and Risk is \"more is worse\". That is deliberate — the chart should not let you forget that the biggest-looking profile is not automatically the best bet.",
    },
    references: [
      { label: "Microsoft Azure — Carbon Optimization (per-workload emissions view)", url: "https://learn.microsoft.com/azure/carbon-optimization/" },
      { label: "ISO/IEC 21031:2024 — Software Carbon Intensity (SCI) specification", url: "https://sci.greensoftware.foundation/" },
    ],
  },
  {
    id: "defensible",
    n: 5,
    letter: "E",
    icon: "shield",
    kicker: "E · The skill this task is actually testing",
    title: "Making a Defensible Call You Can't Fully Prove",
    definition:
      "A senior consultant's recommendation is judged less by whether the chosen option is provably best — with the data available it usually cannot be — and more by whether the reasoning is complete. Complete means three specific things, and all three have to be present. It names the real trade-off being made, in the option's own terms rather than as a generality. It says what follow-up decision this choice forces, because every real choice creates the next one. And it honestly names what could go wrong if the call turns out to be the wrong one, including what the options not taken would have prevented.",
    insight:
      "That is exactly how Task 2 evaluates your submission. Not on which letter you pick — all three are genuinely defensible, and the ground-truth profiles are built so that none of them dominates — but on whether your Prioritization Memo does all three of those things. A memo that says \"Option B, because efficiency matters\" fails even if B was the best pick. A memo that says \"Option C, accepting that we will end the quarter with nothing visible to show a customer, which forces management to decide in month three whether they will act on what we measure, and risks a board that reads a measurement quarter as a wasted one\" succeeds regardless of whether C was optimal.",
    takeaway:
      "This is not a soft skill improvised on the spot. Deciding well before the evidence is in is formalised in strategy and operations — the Cynefin framework, for instance, treats \"complex\" domains as ones where cause and effect are only clear in hindsight, and prescribes a small, safe-to-fail action taken deliberately, then observed and adjusted, rather than waiting for a certainty that will never fully arrive. AppNexa's quarter is a complex domain by that definition. The recommendation you write is the safe-to-fail probe.",
    reasoning: [
      "Before committing, write the sentence that begins \"this is worth it even though…\". If you cannot finish it, you have not found the trade-off yet and the memo will not hold up.",
      "Every choice forces a next decision. Name it specifically — who has to decide what, and roughly when — rather than gesturing at future work.",
      "The risks of the road not taken are not the same as the risks of your pick. Ask what the two options you rejected would have prevented, and write that down as the price of your choice.",
      "Rules out the tempting wrong answer: hedging is not honesty. \"We should do a bit of all three\" under a constraint that funds exactly one is a refusal to decide, and a board will read it as one.",
    ],
    callout: {
      label: "How you are actually scored",
      text: "There is no single correct letter in Task 2. The memo is judged on completeness of reasoning: the trade-off named, the next decision named, the failure mode named.",
    },
    references: [
      { label: "Cynefin framework — decision-making in complex domains (Snowden & Boone, HBR 2007)" },
      { label: "Green Software Foundation — Green Software Patterns catalog", url: "https://patterns.greensoftware.foundation/" },
    ],
  },
];

export const FURTHER_READING = {
  heading: "Further reading",
  intro: "The two primary sources behind this route's framing of the options.",
  items: [
    {
      body: "Green Software Foundation",
      title: "Green Software Patterns catalog",
      host: "patterns.greensoftware.foundation",
      url: "https://patterns.greensoftware.foundation/",
    },
    {
      body: "Green Software Foundation",
      title: "Software Carbon Intensity specification (ISO/IEC 21031:2024)",
      host: "sci.greensoftware.foundation",
      url: "https://sci.greensoftware.foundation/",
    },
  ],
} as const;

// ---------------------------------------------------------------------------
// The seven decision dimensions.
// ---------------------------------------------------------------------------
export type DimensionKey =
  | "leverage"
  | "efficiency"
  | "feasibility"
  | "acceptance"
  | "measurability"
  | "longterm"
  | "risk";

export type Dimension = {
  key: DimensionKey;
  n: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** Full name, as used in the memo and the material. */
  name: string;
  /** One word, for the radar axis. */
  short: string;
  question: string;
  detail: string;
  low: string;
  high: string;
  /** True where a higher number is worse — Risk only. */
  inverted?: boolean;
};

export const DIMENSIONS: Dimension[] = [
  {
    key: "leverage",
    n: 1,
    name: "Strategic Leverage",
    short: "Leverage",
    question: "Does this create a foundation other decisions can build on?",
    detail:
      "A high score means future decisions get easier because this exists. A low score means it solves today's instance of today's problem and nothing more.",
    low: "Solves one instance",
    high: "Foundation for later",
  },
  {
    key: "efficiency",
    n: 2,
    name: "Impact on Efficiency",
    short: "Efficiency",
    question: "How directly and how soon does this move real resource consumption?",
    detail:
      "A high score means AppNexa's actual footprint moves inside this quarter. A low score means it only prepares the ground for a future move.",
    low: "Prepares the ground",
    high: "Moves the number now",
  },
  {
    key: "feasibility",
    n: 3,
    name: "Feasibility",
    short: "Feasibility",
    question: "Can this actually be executed this quarter under the real constraint?",
    detail:
      "Judged against limited developer capacity and continued roadmap pressure — not against an imagined quarter with spare time.",
    low: "Likely to stall",
    high: "Deliverable this quarter",
  },
  {
    key: "acceptance",
    n: 4,
    name: "Team Acceptance",
    short: "Acceptance",
    question: "Will engineers read this as support, or as an unfunded mandate?",
    detail:
      "The Management Logic tension: a measure that does not change what sprint reviews reward competes with the metric that is actually being watched — and loses.",
    low: "Competes with their metrics",
    high: "Backed by what they're judged on",
  },
  {
    key: "measurability",
    n: 5,
    name: "Measurability",
    short: "Measurability",
    question: "At quarter's end, can you show it worked with a number?",
    detail:
      "Not whether measurement is possible in principle — cloud tooling has largely closed that gap — but whether this option produces evidence of its own effect.",
    low: "Only a feeling",
    high: "A defensible number",
  },
  {
    key: "longterm",
    n: 6,
    name: "Long-term Effect",
    short: "Long-term",
    question: "Does this stop the same class of problem recurring?",
    detail:
      "A high score means the underlying cause is addressed. A low score means one instance is fixed while the missing standard or missing metric stays missing.",
    low: "Fixes one instance",
    high: "Stops the class recurring",
  },
  {
    key: "risk",
    n: 7,
    name: "Risk",
    short: "Risk",
    question: "How much can go wrong — by acting, or by not acting?",
    detail:
      "Two axes at once: execution risk (touching live systems, breaking something) and inaction risk (a quarter with nothing visible while cost accumulates). Higher means more risk.",
    low: "Contained",
    high: "Substantial",
    inverted: true,
  },
];

/** Axis set for the radar chart. */
export const RADAR_AXES: RadarAxis[] = DIMENSIONS.map((d) => ({
  key: d.key,
  label: d.short,
  full: d.name,
}));

export const dimensionByKey = (key: DimensionKey): Dimension =>
  DIMENSIONS.find((d) => d.key === key)!;

// ---------------------------------------------------------------------------
// The three options. Ground-truth profiles are graded content — fixed by the
// curriculum spec and deliberately built so no option dominates.
// ---------------------------------------------------------------------------
export type OptionId = "A" | "B" | "C";

export type SituationalOption = { id: string; text: string };

export type MeasureOption = {
  id: OptionId;
  name: string;
  shortName: string;
  stage: string;
  stageNote: string;
  summary: string;
  detail: string;
  /** Ground truth, 1–5 per dimension. */
  profile: Record<DimensionKey, number>;
  /**
   * The specific reason each number is what it is, not one point higher or
   * lower — shown per dimension at reveal, so the ground truth is something a
   * learner can argue with on its own terms rather than take on faith.
   */
  dimensionWhy: Record<DimensionKey, string>;
  /** What the profile is saying, once revealed. */
  readout: string;
  riskKind: string;
  situational: {
    prompt: string;
    options: SituationalOption[];
    answerKey: AnswerKeyBlock;
  };
};

export const OPTIONS: MeasureOption[] = [
  {
    id: "A",
    name: "Binding Green Coding Guidelines",
    shortName: "Guidelines",
    stage: "Requirements stage",
    stageNote: "Sets constraints before code is written",
    summary:
      "Write and mandate efficiency criteria that all new work must meet — data-loading standards, response-shape rules, retention limits — enforced through code review.",
    detail:
      "The cheapest possible stage at which to change behaviour, because nothing has been built yet. Also the slowest to show a number, because it governs only work that has not started. Its weak point is not the content of the rules; it is that a rule with no change to what sprint reviews reward is competing with an incentive that has not moved.",
    profile: {
      leverage: 5,
      efficiency: 2,
      feasibility: 3,
      acceptance: 2,
      measurability: 2,
      longterm: 5,
      risk: 2,
    },
    dimensionWhy: {
      leverage:
        "Sets the default for every line of code written from now on — every future decision inherits this standard automatically. Nothing scores higher than changing the default itself.",
      efficiency:
        "Only governs work not yet started. Nothing already running gets faster or cheaper this quarter, which is why it sits near the bottom rather than at 1 — it isn't zero, because review starts catching new offenders immediately.",
      feasibility:
        "Cheap to author — a first draft is days of work — but adoption depends on developers actually following a rule with no enforcement mechanism yet. That gap keeps it at a middling 3, not higher.",
      acceptance:
        "A rule with no change to what sprint reviews reward competes with an incentive nobody has touched — Section A's split-incentive problem, restated as a scoring dimension.",
      measurability:
        "There's no number to point to until enough new code has shipped under the rule to compare against the old baseline — that takes months, not a quarter. Not a 1, because a compliance rate can be tracked immediately.",
      longterm:
        "Addresses the cause, not an instance: every future feature is built under the standard, not just the ones fixed this quarter. This is the same reasoning as Leverage, from a different angle — which is why the two scores match.",
      risk: "The main risk is paper-policy risk — the guideline exists, gets nodded at in a review, and nothing changes. Real, but quiet: nothing breaks, which keeps the score low rather than at 1.",
    },
    readout:
      "The strongest leverage and long-term profile of the three, and the weakest on immediate impact and team acceptance. This is what a Requirements-stage measure looks like: it changes the default for everything written from now on, and shows almost nothing this quarter.",
    riskKind: "Paper-policy risk — the guideline exists and nothing changes",
    situational: {
      prompt:
        "You're about to propose binding guidelines with no new tooling and no change to how sprints are measured. What's the biggest risk to this actually changing behavior?",
      options: [
        { id: "a1", text: "Developers won't know the guidelines exist" },
        {
          id: "a2",
          text: "Nothing in the sprint review changes what gets rewarded, so the guideline competes with an unchanged incentive",
        },
        { id: "a3", text: "The guidelines will be too technical for management to approve" },
        { id: "a4", text: "Guidelines take too long to write" },
      ],
      answerKey: {
        prompt: "Option A — situational question",
        items: [
          {
            option: "Nothing in the sprint review changes what gets rewarded",
            verdict: "pick",
            why: "The strongest read, and the one Section D's Team Acceptance dimension is built on. A guideline is a rule without a consequence until something the team is measured on changes. This is the Management Logic failure from Route 1, arriving as a prediction rather than a diagnosis.",
          },
          {
            option: "Developers won't know the guidelines exist",
            verdict: "avoid",
            why: "Real but solvable by announcement, onboarding, or a linter. It is a communication problem, not a structural one — and a participant who picks it is usually underestimating how much incentives outrank information.",
          },
          {
            option: "Too technical for management to approve",
            verdict: "avoid",
            why: "Inverts where the resistance actually comes from. Management has already asked for this; the friction is downstream, with teams whose measured output it competes against.",
          },
          {
            option: "Guidelines take too long to write",
            verdict: "avoid",
            why: "Authoring is the cheap part — a first version is days of work. Mistaking authoring cost for adoption cost is exactly the error that makes Requirements-stage measures look easier than they are.",
          },
        ],
        teachingNote:
          "This question is not graded and the reveal unlocks on any answer — it is there to make the learner commit to a prediction before seeing Option A's low Acceptance score. If a participant picked something else and then sees Acceptance at 2, that gap is the teaching moment; let them find it rather than correcting them first.",
      },
    },
  },
  {
    id: "B",
    name: "Technical Rework of the Worst Offenders",
    shortName: "Technical Rework",
    stage: "Development stage",
    stageNote: "Edits existing code and architecture directly",
    summary:
      "Commit real developer time this quarter to rewriting the most expensive applications — collapsing query storms, narrowing API contracts, removing duplicate writes.",
    detail:
      "The fastest route to a genuine before-and-after number, because it changes running code. It is also the option that touches live customer systems and takes its capacity directly out of the feature roadmap. Its weak point is durability: the three systems you fix are fixed, and nothing stops a fourth appearing next quarter.",
    profile: {
      leverage: 2,
      efficiency: 5,
      feasibility: 3,
      acceptance: 3,
      measurability: 4,
      longterm: 2,
      risk: 4,
    },
    dimensionWhy: {
      leverage:
        "Fixes three specific applications. Nothing about the fix changes what produces the next inefficient one — the small non-zero score is for the pattern the team learns doing the work, not for anything structural it leaves behind.",
      efficiency:
        "Directly rewrites the code doing the wasteful work — the only option that moves this quarter's actual resource consumption. Nothing scores higher than a real, measured before-and-after on live traffic.",
      feasibility:
        "The work itself is well-understood engineering, but it competes directly with committed roadmap capacity — that competition, not the coding difficulty, is what holds this at a middling 3.",
      acceptance:
        "Engineers generally like fixing known-broken things — but it's still unplanned work landing on top of what they're already measured on shipping, which caps it below a clear majority-positive score.",
      measurability:
        "Before-and-after numbers on the same three systems are about as clean a comparison as a single quarter can produce. Short of Option C's 5 only because it measures three systems, not the whole portfolio.",
      longterm:
        "Solves the instance, not the cause. A fourth expensive application can appear next quarter with nothing in place to catch it — this is the mirror image of its Efficiency score, and the two are deliberately far apart.",
      risk: "Live customer systems, under active use, being rewritten under time pressure — real execution risk, not a hypothetical one. The highest risk score of the three for exactly that reason.",
    },
    readout:
      "The only option that moves the number materially this quarter, and the one that carries real execution risk. Notice how low it sits on leverage and long-term effect — it solves today's three worst instances without changing what produces them.",
    riskKind: "Execution risk — live systems, real customers, real breakage",
    situational: {
      prompt:
        "You're about to commit real developer time to reworking today's worst offenders. What's the most likely trade-off management will ask you to justify?",
      options: [
        { id: "b1", text: "Which specific systems were chosen, and why those over others" },
        { id: "b2", text: "Whether this delays a committed feature roadmap this quarter" },
        { id: "b3", text: "Whether the fixed systems simply become inefficient again in six months" },
        {
          id: "b4",
          text: "All of the above — this is why it's the hardest option to sell with incomplete data",
        },
      ],
      answerKey: {
        prompt: "Option B — situational question",
        items: [
          {
            option: "All of the above",
            verdict: "pick",
            why: "The honest answer. Each of the other three is a real question management will ask, and without SCI telemetry the first one — why those systems — cannot be answered with evidence at all. That is precisely what makes B hard to sell in AppNexa's actual position.",
          },
          {
            option: "Which specific systems were chosen, and why those over others",
            verdict: "avoid",
            why: "Correct and the sharpest of the three on its own, because AppNexa cannot currently answer it. But picking it alone misses that the roadmap and durability questions arrive in the same meeting.",
          },
          {
            option: "Whether this delays a committed feature roadmap",
            verdict: "avoid",
            why: "The most immediate objection, and the one product management raises first. Incomplete on its own — it is the cost question, not the whole justification.",
          },
          {
            option: "Whether the fixed systems become inefficient again in six months",
            verdict: "avoid",
            why: "The most strategically interesting of the three, and what B's low Long-term score encodes. Still incomplete alone.",
          },
        ],
        teachingNote:
          "Where a cohort splits between \"all of the above\" and the specific-systems answer, that is a good discussion rather than an error. The point worth landing: B is the option whose justification depends most on evidence AppNexa does not yet have — which is the argument for C, and the reason this is a genuine trade-off.",
      },
    },
  },
  {
    id: "C",
    name: "Development Controlling & Observability",
    shortName: "Observability",
    stage: "Operations stage",
    stageNote: "Builds the measurement layer, changes no behaviour yet",
    summary:
      "Spend the quarter instrumenting: per-workload resource and cost telemetry, a per-release efficiency number, and the reporting that puts it in front of the people who decide.",
    detail:
      "Changes nothing a customer can see, and produces the one thing AppNexa is missing — the evidence to say which application actually costs the most and which fix would matter. Its weak point is entirely about framing: a quarter that ends with a dashboard and no shipped improvement is easy to read as a quarter wasted.",
    profile: {
      leverage: 4,
      efficiency: 1,
      feasibility: 5,
      acceptance: 3,
      measurability: 5,
      longterm: 4,
      risk: 2,
    },
    dimensionWhy: {
      leverage:
        "Doesn't fix anything itself, but makes every future fix — a guideline's rule or a rework's target list — a decision based on evidence instead of a guess. Just short of a guideline's 5 because it enables leverage rather than setting the standard directly.",
      efficiency:
        "Changes no code and no infrastructure — by design, this is the one dimension it was never meant to move. The lowest possible honest score, not a flaw in the option.",
      feasibility:
        "No live system is touched. Instrumentation runs alongside the roadmap instead of inside it, which is about as deliverable as a measure can be within one quarter — the highest score on the chart.",
      acceptance:
        "Doesn't compete with anyone's sprint for capacity — but doesn't visibly help them either, which is a milder version of the same incentive problem a guideline has, just without the friction of a new rule to follow.",
      measurability:
        "Its entire output is a number. This is the one option whose success or failure is inherently measurable, which is exactly why it scores at the top.",
      longterm:
        "Prevents the class of problem — 'we don't know where to look' — from recurring, without itself fixing what it finds. Scores below a guideline's 5 because it enables the fix rather than being one.",
      risk: "The risk here isn't execution, it's optics: a quarter that ends with a dashboard and nothing shipped is easy to misread as wasted. Real, but nothing breaks — the same low-risk territory as a guideline, for a different reason.",
    },
    readout:
      "The most deliverable option and the one that produces the best evidence — with the lowest immediate impact on the chart, by construction. It is the only option that makes the next decision an informed one rather than another guess.",
    riskKind: "Inaction and optics risk — a quarter with nothing visible to show",
    situational: {
      prompt:
        "You're about to spend a quarter building measurement infrastructure with no code changes yet. What will leadership most likely ask when they want to know what they got this quarter?",
      options: [
        { id: "c1", text: "“We now know exactly where to spend next quarter's budget”" },
        { id: "c2", text: "“We spent money and nothing changed for the user”" },
        { id: "c3", text: "“Why didn't we just fix the obvious problems instead?”" },
        {
          id: "c4",
          text: "It could be any of these — the answer depends entirely on how you frame the deliverable",
        },
      ],
      answerKey: {
        prompt: "Option C — situational question",
        items: [
          {
            option: "It could be any of these — depends on how you frame the deliverable",
            verdict: "pick",
            why: "The intended answer, and the whole lesson of Option C. Identical work lands as a triumph or a wasted quarter depending on whether the deliverable was framed up front as “a dashboard” or as “the evidence base for next quarter's budget decision”. Framing is not spin here — it is naming what was actually bought.",
          },
          {
            option: "“We now know exactly where to spend next quarter's budget”",
            verdict: "avoid",
            why: "The best case, and it only happens if the framing work was done at the start. Picking it assumes the outcome rather than the decision that produces it.",
          },
          {
            option: "“We spent money and nothing changed for the user”",
            verdict: "avoid",
            why: "The worst case, and a realistic one — this is the inaction/optics risk in C's Risk score. But treating it as inevitable is what makes teams avoid necessary measurement work entirely.",
          },
          {
            option: "“Why didn't we just fix the obvious problems instead?”",
            verdict: "avoid",
            why: "The counter-argument for Option B, voiced after the fact. Worth raising with a cohort: the answer is that without C nobody can show the “obvious” problems were the expensive ones.",
          },
        ],
        teachingNote:
          "Use this to introduce the Cynefin point from Section E: C is the safe-to-fail probe — small, reversible, and chosen precisely because the domain is one where cause and effect only become clear in hindsight. A participant who picks C in the commit step and frames it this way has written the strongest available memo, even though C scores lowest on immediate impact.",
      },
    },
  },
];

export const optionById = (id: OptionId): MeasureOption => OPTIONS.find((o) => o.id === id)!;

// ---------------------------------------------------------------------------
// Section C visual — the GSF Patterns lifecycle, with the three options pinned.
// Rendered through the shared FlowDiagram (the same component Route 1 uses).
// ---------------------------------------------------------------------------
export const LIFECYCLE_STAGES: FlowGraph = {
  id: "gsf-lifecycle-stages",
  title: "Green Software Patterns lifecycle stages, with AppNexa's three options",
  caption:
    "The catalog organises patterns by lifecycle stage. Each of the three options acts at a different one — and the stage predicts how fast it shows a result and how long the result lasts.",
  viewBox: "0 0 900 230",
  nodes: [
    { id: "req", label: "Requirements", sub: "before code exists", x: 16, y: 74, w: 196, h: 72, tone: "solid" },
    { id: "arch", label: "Architecture", sub: "shape decisions", x: 240, y: 74, w: 196, h: 72, tone: "outline" },
    { id: "dev", label: "Development", sub: "the code itself", x: 464, y: 74, w: 196, h: 72, tone: "solid" },
    { id: "ops", label: "Operations", sub: "running and measuring", x: 688, y: 74, w: 196, h: 72, tone: "solid" },
  ],
  edges: [
    { id: "l1", d: "M212 110 H240", flow: true },
    { id: "l2", d: "M436 110 H464", flow: true },
    { id: "l3", d: "M660 110 H688", flow: true },
  ],
};

export const LIFECYCLE_PINS: FlowPin[] = [
  { id: "A", n: "A", x: 34, y: 92, label: "Binding Green Coding Guidelines" },
  { id: "B", n: "B", x: 482, y: 92, label: "Technical Rework of the Worst Offenders" },
  { id: "C", n: "C", x: 706, y: 92, label: "Development Controlling & Observability" },
];

// ---------------------------------------------------------------------------
// Task 2 framing, commit fields and export contract.
// ---------------------------------------------------------------------------
export const TASK2 = {
  id: "task2",
  tag: "TASK 2",
  title: "AppNexa Prioritization Room",
  framing:
    "Management can fund exactly one line of measures this quarter: A) Binding Green Coding Guidelines, B) Technical Rework of the Worst Offenders, or C) Development Controlling & Observability. For each option, answer the situational question, predict its profile across 7 decision dimensions, then reveal the real one. Compare all three as many times as you want. Then commit to one and defend it — including the two risks of the road not taken.",
  company: "AppNexa Solutions",
  companyBrief:
    "Same company as Route 1. The diagnosis is done and management believes it. Development capacity is limited, product management still wants speed, SCI telemetry does not exist yet, and exactly one line of measures gets funded this quarter.",
  nameField: {
    label: "Your name",
    instruction: "Used to label the exported memo — it becomes e.g. \"1-jane-day10-l2task1\".",
    placeholder: "e.g. Jane Muller",
  },
  predictInstruction:
    "Set all seven before you reveal — the overlay only means something if there is a guess to compare it against.",
  commit: {
    pick: {
      label: "Which line of measures do you recommend?",
      instruction:
        "There is no single correct letter. You are scored on the completeness of the reasoning below, not on which option you choose.",
    },
    rationale: {
      label: "Strategic rationale (2–3 sentences)",
      instruction: "Reference at least one dimension score in your reasoning.",
      placeholder: "e.g. Option C scores 5 on Measurability and 1 on Impact, and that trade is the point…",
      sample:
        "Option C scores 5 on Feasibility and 5 on Measurability against a 1 on Impact on Efficiency, and that trade is deliberate: AppNexa cannot currently name its most expensive workload, so any rework we fund this quarter is a guess we would be unable to defend. Building the measurement layer converts next quarter's decision from an argument into an evidence review. Its 4 on Strategic Leverage is the real return — it is the only option that makes both A and B better bets afterwards.",
    },
    feasibility: {
      label: "Feasibility argument (1–2 sentences)",
      instruction:
        "Given the actual constraint — limited developer capacity and continued speed pressure — why does this hold up?",
      placeholder: "e.g. Instrumentation runs alongside the roadmap rather than competing with it…",
      sample:
        "Instrumentation is additive rather than invasive: it runs alongside the feature roadmap instead of taking sprints out of it, which is why it scores 5 on Feasibility where rework scores 3. No live customer path is modified, so the speed commitment product management has already made stands.",
    },
    followUp: {
      label: (n: number) => `Follow-up decision ${n}`,
      instruction:
        "What does management have to decide next, specifically because of this choice?",
      placeholder: "e.g. Whether the month-three findings get their own funded sprint…",
      samples: [
        "By month three, management has to decide whether the telemetry findings get a funded rework sprint next quarter, or whether they become a standing input to roadmap planning instead.",
        "Someone has to own the efficiency number once it exists — management has to decide whether that sits with the architecture guild or with each product team lead, before the first report lands.",
      ],
    },
    risk: {
      label: (n: number) => `Risk of the road not taken ${n}`,
      instruction:
        "What could go wrong specifically because you did NOT pick the other two options?",
      placeholder: "e.g. Without guidelines, every new service written this quarter repeats the pattern…",
      samples: [
        "By not funding Option A, every service written during this measurement quarter is built under the same unchanged conventions — so we will be measuring a problem we are still actively adding to.",
        "By not funding Option B, the infrastructure bill keeps climbing for a full quarter with nothing shipped against it, and we hand the board a dashboard instead of a saving — which is exactly how a measurement quarter gets read as a wasted one.",
      ],
    },
  },
  export: {
    filenameLevel: 2,
    filenameTask: 1,
    docHeading: "Prioritization Memo",
    buttonLabel: "Export Prioritization Memo",
  },
} as const;
