/**
 * Route 3 — Management Decision (L3). All learner-facing copy and pure data
 * live here so components stay presentational.
 *
 * Two companies on purpose: SoftPulse Digital Products GmbH is the read-only
 * worked example in the material, and CodeVista Digital Platforms is the case
 * the learner actually works. CodeVista has not appeared anywhere else in the
 * course, so the task tests transfer of the reasoning pattern rather than
 * recall of AppNexa's specifics.
 *
 * Curriculum source: Module 7 (Day 1 of 2) — "Achieving Energy Efficiency in
 * Programming: Energy-Efficient Software and Green Coding Principles."
 */

import type { IconKey } from "@/lib/routes";
import type { AnswerKeyBlock } from "@/lib/answerKey";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map — every key this route writes to the shared progress store.
// ---------------------------------------------------------------------------
export const R3 = {
  name: LEARNER_NAME_KEY,
  /** markSeen bucket holding the learner's top-3 guiding decisions, in rank order. */
  ranking: "r3:ranking",
  rankRationale: "r3:rank:why",
  /** cardId → quadrant id. */
  quadrant: (cardId: string) => `r3:quad:${cardId}`,
  /** roleId+letter → checked. */
  raci: (roleId: string, letter: RaciLetter) => `r3:raci:${roleId}:${letter}`,
  decideNow: "r3:decide",
  decideWhy: "r3:decide:why",
  /**
   * Single persisted flags, not per-card/per-role: once "Check placements" or
   * "Check the model" is clicked the first time, every card's or letter's
   * correct/valid state updates live from then on, same pattern as Route 1's
   * category check.
   */
  quadrantChecked: "r3:quadrant-checked",
  raciChecked: "r3:raci-checked",
} as const;

// ---------------------------------------------------------------------------
// Material — four sections (A–D).
// ---------------------------------------------------------------------------
export type MaterialSectionId = "board" | "governance" | "backdrop" | "worked";

export type MaterialSection = {
  id: MaterialSectionId;
  n: 1 | 2 | 3 | 4;
  letter: "A" | "B" | "C" | "D";
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
  return `r3-material-${id}`;
}

const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  board: "A · Why this reaches the board",
  governance: "B · RACI & deciding under uncertainty",
  backdrop: "C · Regulatory & professional backdrop",
  worked: "D · The SoftPulse worked example",
};

export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}

export const PAGE_INTRO = {
  tag: "ROUTE 3 — DECISION ARCHITECTURE",
  title: "Leading the Standard",
  body: "Read first how SoftPulse Digital Products solved this exact problem — a fully worked example, mistakes and all. Then it's your turn to lead. You're not fixing one company's code anymore. You're building the framework that makes green coding stick after you leave the room.",
} as const;

export const MATERIAL: MaterialSection[] = [
  {
    id: "board",
    n: 1,
    letter: "A",
    icon: "gavel",
    kicker: "A · From a fix to a structure",
    title: "Why This Becomes a Board Question",
    definition:
      "Two things are worth restating before anything else, and neither assumes you have done the earlier routes. First: software carries a real, measurable energy and carbon cost, expressible as a rate — the Software Carbon Intensity specification, published as ISO/IEC 21031:2024, divides energy used times the carbon intensity of the grid, plus the embodied emissions of the hardware, by a unit of useful work. Second: inefficiency tends to live in one of six places — architecture, data handling, storage, network, background processes, or, most often overlooked, in what an organisation chooses to measure and reward.",
    insight:
      "Once you are deciding for an entire company rather than for one application, the question changes shape. It stops being \"which fix is best\" and becomes \"which decision-making structure makes good fixes the default, without anyone at board level having to personally chase every instance.\" That is a different kind of answer. A list of the three worst systems is a deliverable one engineer can produce; a structure that reliably surfaces the next three, and the three after that, is the thing a board can actually fund and hold someone to.",
    takeaway:
      "The tension a CTO is holding is real and does not resolve neatly. On one side: high release pressure and a growing user base, both of which argue for spending every available hour on features. On the other: operating cost climbing quarter on quarter, with no current transparency on where that cost comes from. And running underneath both is the risk that matters most here — that \"green coding\" is adopted as a slogan, announced in an all-hands, printed in a values deck, with no binding mechanism behind it and nothing measurably different twelve months later.",
    reasoning: [
      "Judge a candidate decision by what it changes when you are not in the room. If it only works while someone senior is personally pushing it, it is a campaign, not a structure.",
      "Prefer the decision that makes the next decision easier over the one that solves the loudest current complaint — that is what \"leverage\" means at this level.",
      "Rules out the tempting wrong answer: announcing a commitment is not a mechanism. A policy with no owner, no metric and no gate changes nothing, however senior the person who announced it.",
    ],
    callout: {
      label: "What changes at this level",
      text: "Routes 1 and 2 asked what is wrong and what to fund. This route asks a different question: what structure makes the answer to those two questions repeatable after you leave.",
    },
    references: [
      { label: "ISO/IEC 21031:2024 — Software Carbon Intensity (SCI) specification", url: "https://sci.greensoftware.foundation/" },
      { label: "Green Software Foundation — Green Software Patterns catalog", url: "https://patterns.greensoftware.foundation/" },
    ],
  },
  {
    id: "governance",
    n: 2,
    letter: "B",
    icon: "supplier",
    kicker: "B · Two concepts you need before the task",
    title: "RACI and Deciding Under Uncertainty",
    definition:
      "RACI assigns four roles to any decision or standard. Responsible is who does the work. Accountable is who answers for the outcome — and RACI's core structural rule is that there must be exactly one Accountable per decision, never zero and never more than one. Consulted are those whose input is sought before the decision is made; this is two-way communication, and it takes time. Informed are those kept updated afterwards; this is one-way, and no input is expected from them. The four are not seniority levels. A junior engineer can be Responsible for work a CTO is Accountable for.",
    insight:
      "Most governance failures in the \"we have a green coding policy but nothing changed\" situation trace back to a missing or duplicated Accountable. Either nobody owns the outcome — the policy exists, everyone agrees with it, and no one's performance conversation ever mentions it — or two people quietly assume the other does, which fails in the same way but is harder to see, because on paper it looks covered. Both failure modes survive a well-attended kickoff meeting and a well-written document. Neither survives the question \"who answers for this at the next board review?\" being asked out loud.",
    takeaway:
      "The second concept is what a board-ready recommendation actually owes. It is not expected to be provably optimal — at this level the data to prove it rarely exists. It is expected to state its reasoning honestly: what is being traded off, what happens because of this choice (the follow-on decision it forces), and what happens if the call turns out wrong. A board told \"we need more data before deciding\" has not been given a recommendation, because waiting is itself a decision with a price, and someone has to have counted it.",
    reasoning: [
      "Check the Accountable count before anything else in a RACI. Zero and two are both failures, and two is the more dangerous because it reads as coverage.",
      "Accountability follows control, not topic ownership. Ask which role holds a budget line, a contract, or a release gate that would change the outcome — enthusiasm for the subject is not the qualification.",
      "Consulted is not free. Every role you add there adds a round of two-way communication before a decision can be made, which is exactly how a governance structure becomes the brake it was meant to prevent.",
      "Rules out the tempting wrong answer: \"we need more data first\" is only a real answer when you can say what the waiting costs. Otherwise it is a decision disguised as caution.",
    ],
    callout: {
      label: "The one rule the task checks",
      text: "Task 3's RACI check enforces the structural rule only — exactly one Accountable. It will not tell you which role should hold which letter, because that is the judgement the exercise is for.",
    },
    references: [
      { label: "iSAQB — CPSA Advanced Level, Module GREEN: Development of Resource-Efficient Applications", url: "https://www.isaqb.org/" },
      { label: "Cynefin framework — decision-making in complex domains (Snowden & Boone, HBR 2007)" },
    ],
  },
  {
    id: "backdrop",
    n: 3,
    letter: "C",
    icon: "certificate",
    kicker: "C · Why this is no longer optional",
    title: "The Regulatory and Professional Backdrop",
    definition:
      "As EU corporate sustainability reporting requirements mature under the CSRD and its ESRS standards, a growing share of a company's reported emissions footprint runs through Scope 3 categories — and those categories include purchased cloud services and the operational footprint of the software a company runs. ESRS E1, the climate change standard, is where that lands in a disclosure. The practical consequence is a change of audience: inefficient software stops being purely an IT cost problem and becomes, increasingly, a line item a board has to explain in a regulatory filing. A cost line can be absorbed quietly. A disclosure line cannot.",
    insight:
      "The professional side has moved in the same direction. iSAQB — the International Software Architecture Qualification Board, the body behind the CPSA credential and the reference certification in the German and wider European market — offers an Advanced Level module, GREEN, whose syllabus already treats applying Green Software Foundation patterns, quantifying the energy efficiency of data centres and hardware, and evaluating cloud providers against ecological criteria as core, examinable architect competencies. When a topic appears at Advanced Level in an architecture certification, it has stopped being a specialist detour and become table-stakes senior technical judgement.",
    takeaway:
      "There is a cautionary example worth carrying into the task. The SOFT framework — co-chaired by HSBC and Microsoft within cross-industry sustainability collaboration — exists precisely because of a recurring failure pattern: sustainability pilots that succeed technically but stay trapped inside IT, never scaling into procurement, operations or business-unit decisions, because no governance structure ever connected them to anything. The pilot works, the report is positive, and nothing downstream changes. That is the fate a CodeVista-style green coding initiative faces by default, and avoiding it is not a technical problem — it is the decision architecture you are about to design.",
    reasoning: [
      "A measure that lives only inside engineering has a ceiling, however good it is. Ask which non-engineering function — procurement, finance, product — has to be Consulted or Informed for it to scale past a pilot.",
      "Disclosure changes the incentive. A measure that produces a number a board can put in a report is structurally stronger than one that produces an internal improvement nobody outside can see.",
      "Rules out the tempting wrong answer: a successful pilot is not evidence that a structure exists. The SOFT framework's whole premise is that technically successful pilots routinely fail to scale for governance reasons.",
    ],
    callout: {
      label: "The failure this route prevents",
      text: "A pilot that works, a report that reads well, and nothing different in procurement, operations or planning twelve months later. Every step of Task 3 is aimed at that specific outcome.",
    },
    references: [
      { label: "EU CSRD / ESRS E1 — Climate change disclosure standard" },
      { label: "iSAQB — CPSA Advanced Level, Module GREEN", url: "https://www.isaqb.org/" },
      { label: "Green Software Foundation — cross-industry sustainability initiatives", url: "https://greensoftware.foundation/" },
    ],
  },
  {
    id: "worked",
    n: 4,
    letter: "D",
    icon: "blueprint",
    kicker: "D · A full worked example, reasoning and all",
    title: "How SoftPulse Solved This",
    definition:
      "What follows is a complete worked example rather than an answer key: the situation, the reasoning move that unlocked it, the four levers that fell out of that move, which one was prioritised, and — the part that matters most — why it was prioritised over the option that felt more immediately productive. Read it as a model of the reasoning, not a template to copy. Task 3 puts you in front of a company that has not appeared anywhere in this course, precisely so that copying the answer will not work and reproducing the reasoning will.",
    insight:
      "The single most important move in the SoftPulse analysis is the reframing in step one. Faced with rising infrastructure cost and several inefficient applications, the obvious question is \"which application is worst?\" — and that question, answered well, produces a fix and no structure. The question SoftPulse asked instead was \"what is missing that would let us reliably find and fix the worst application, this time and every time after?\" Everything else in the case follows from that substitution. Watch for it as you read, because it is the move Task 3 asks you to make for CodeVista.",
    takeaway:
      "Notice, at the end, that SoftPulse's conclusion and AppNexa's Option A and Option C reasoning from earlier in this curriculum point the same direction: governance and visibility, not the fastest visible technical fix, tend to win when the real constraint is \"we don't yet know where our biggest problem actually is.\" That convergence is not a coincidence, and it is not a rule that the structural answer always wins either — it is what happens specifically when the binding constraint is missing evidence rather than missing capacity.",
    reasoning: [
      "Before ranking anything, ask what is actually missing: a standard, the evidence, or the capacity. The decision that supplies the missing one outranks the decision that produces the most visible activity.",
      "Substitute \"which is worst?\" with \"what would let us reliably find the worst, every time?\" — that substitution is the whole reasoning move, and it is transferable to any company.",
      "Sort candidate measures by time horizon — short-term, medium-term, structural — rather than by size. A structural measure with no short-term component will not survive contact with a quarter.",
      "Rules out the tempting wrong answer: the measure that fixes today's three worst systems is not the strongest one when nothing about it changes what happens when a fourth appears next quarter.",
    ],
    callout: {
      label: "Read for the move, not the answer",
      text: "CodeVista's facts are different from SoftPulse's. The reasoning move — reframing \"which is worst\" into \"what would let us find the worst reliably\" — is what transfers.",
    },
    references: [
      { label: "Green Software Foundation — Green Software Patterns catalog", url: "https://patterns.greensoftware.foundation/" },
      { label: "iSAQB — CPSA Advanced Level, Module GREEN", url: "https://www.isaqb.org/" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Section D — the SoftPulse worked example, rendered as its own bordered block.
// ---------------------------------------------------------------------------
export const SOFTPULSE = {
  company: "SoftPulse Digital Products GmbH",
  situation:
    "SoftPulse Digital Products GmbH develops cloud-based applications for business customers. Recent years focused heavily on rapid growth, feature expansion, and speed to market. The applications are functionally successful, but cause rising infrastructure costs, high load peaks, and growing complexity. Management wants to examine how software efficiency can be improved systematically — without slowing the capacity for innovation and product development.",
  initialPosition: [
    "Applications generate high database and API loads.",
    "There are redundant processes and unnecessary background activities.",
    "Front end and back end were optimised for rapid implementation, not efficiency.",
    "There are no binding green coding or efficiency criteria in the development process.",
    "Product teams fear additional effort and delays.",
    "Management expects a practicable solution with a visible effect and no loss of quality for customers.",
  ],
  reframe: {
    heading: "The reasoning move",
    body: "The greatest leverage does not lie in selective individual optimisations — fixing the loudest complaint first — but in introducing a binding efficiency and green coding logic that systematically connects architecture, development, monitoring, and quality criteria. Notice the substitution: instead of asking \"which application is worst,\" the analysis asks \"what's missing that would let us reliably find and fix the worst application, this time and every time after?\"",
  },
  levers: [
    { n: 1, text: "Introduce binding green coding and efficiency guidelines." },
    { n: 2, text: "Make particularly inefficient workloads and applications visible — i.e. build the measurement layer." },
    { n: 3, text: "Prioritised optimisation of systems with the highest load and scaling effect." },
    { n: 4, text: "Anchor efficiency as a quality and management criterion inside the development process itself — so it survives past this quarter's initiative." },
  ],
  prioritised: {
    heading: "Prioritised first measure",
    body: "Introducing a binding green coding and efficiency framework, accompanied by transparency on load and resource behaviour, is recommended as the first step — not jumping straight to lever 3 (fixing the worst systems), even though that would feel more immediately productive.",
  },
  whyFirst: {
    heading: "Why first, and not lever 3",
    points: [
      "It creates a structural lever for every future decision, rather than one outcome.",
      "It improves the organisation's ability to decide, instead of only reacting to one problem at a time.",
      "It makes impact and inefficiencies visible in the first place — without which lever 3 is a guess.",
      "It connects architecture, development, and management responsibility inside one shared framework, instead of leaving efficiency as a side-conversation between whichever architect and whichever product owner happen to be talking that week.",
    ],
  },
  horizons: [
    {
      id: "short",
      label: "Short-term",
      items: [
        "Define initial green coding guidelines.",
        "Identify the most energy- and resource-intensive applications.",
        "Create transparency on load peaks and inefficient routines.",
      ],
    },
    {
      id: "medium",
      label: "Medium-term",
      items: [
        "Targeted revision of the particularly inefficient components identified.",
        "Integrate efficiency criteria into code reviews, planning, and quality management.",
        "Coordinate priorities and trade-offs between product management and development.",
      ],
    },
    {
      id: "structural",
      label: "Structural",
      items: [
        "Anchor green coding inside architecture standards, development governance, and management review cycles.",
        "Couple efficiency metrics to product and operating decisions going forward.",
      ],
    },
  ],
  closing:
    "SoftPulse's answer and AppNexa's Option A/C reasoning from earlier in this curriculum point the same direction — governance and visibility, not the fastest visible technical fix, tend to win when the real constraint is \"we don't yet know where our biggest problem actually is.\" Task 3 will ask you to build this same kind of reasoning for a company that has never appeared in this course before.",
} as const;

export const FURTHER_READING = {
  heading: "Further reading",
  intro: "The three primary sources behind this route's framing.",
  items: [
    {
      body: "Green Software Foundation",
      title: "Green Software Patterns catalog",
      host: "patterns.greensoftware.foundation",
      url: "https://patterns.greensoftware.foundation/",
    },
    {
      body: "iSAQB",
      title: "CPSA Advanced Level, Module GREEN",
      host: "isaqb.org",
      url: "https://www.isaqb.org/",
    },
    {
      body: "Green Software Foundation",
      title: "SOFT framework and cross-industry sustainability initiatives",
      host: "greensoftware.foundation",
      url: "https://greensoftware.foundation/",
    },
  ],
} as const;

// ---------------------------------------------------------------------------
// Task 3 — CodeVista Digital Platforms.
// ---------------------------------------------------------------------------
export const CODEVISTA = {
  company: "CodeVista Digital Platforms",
  role: "Head of Software Strategy",
  brief: [
    "High innovation and release pressure.",
    "Differing interests across product management, development, architecture, operations, and management.",
    "Incomplete transparency on the energy and resource effects of individual applications.",
    "Existing quality standards focus on function, stability, and speed — not efficiency.",
    "Budget and time restrictions limit larger re-architectures.",
    "Real risk that green coding gets treated as an extra topic with no binding follow-through.",
  ],
} as const;

// --- Step 1: the six candidate guiding decisions ---------------------------

export type GuidingDecision = {
  id: "A" | "B" | "C" | "D" | "E" | "F";
  text: string;
  /** Mentor-only: what this decision actually buys, and what it leaves open. */
  note: string;
};

export const GUIDING_DECISIONS: GuidingDecision[] = [
  {
    id: "A",
    text: "Introduce binding green coding & efficiency guidelines across all product teams",
    note: "SoftPulse's lever 1. Strong structural leverage, cheap to author, and weak on its own — a guideline with no metric behind it is the \"slogan\" failure Section A names.",
  },
  {
    id: "B",
    text: "Fund technical rework of the 3 highest-load applications immediately",
    note: "SoftPulse's lever 3, taken first. Produces the most visible result and changes nothing about what happens when a fourth high-load application appears. Also unjustifiable at CodeVista, which has incomplete transparency and so cannot currently show those three are the right three.",
  },
  {
    id: "C",
    text: "Establish a cross-functional Green Coding Review Board with veto power over major releases",
    note: "Genuinely binding, and the heaviest option on momentum cost. Defensible where release pressure is low; at CodeVista, where release pressure is explicitly high, it is the option most likely to be resented into irrelevance.",
  },
  {
    id: "D",
    text: "Build efficiency/SCI-style measurement into the CI/CD pipeline before any policy is written",
    note: "SoftPulse's lever 2. Directly addresses CodeVista's named gap — incomplete transparency — and makes both A and B defensible afterwards. The strongest single answer to \"what is missing?\"",
  },
  {
    id: "E",
    text: "Tie a portion of product-team OKRs to a resource-efficiency metric starting next quarter",
    note: "The Management Logic lever. Changes what teams are actually measured on, which is what makes A stick. Depends on a metric existing, so it is strongest sequenced after D rather than before it.",
  },
  {
    id: "F",
    text: "Commission an external audit of CodeVista's full application portfolio before deciding anything",
    note: "Buys a snapshot and no capability. When it is over, CodeVista still cannot see its own efficiency without commissioning another one — which is why it sits low on structural impact despite feeling thorough.",
  },
];

export const RANK_SLOTS = 3;

export const RANK_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Step 1 — ranking the guiding decisions",
  items: [
    {
      option: "D — build measurement into CI/CD first",
      verdict: "pick",
      why: "The strongest #1 for CodeVista specifically. Its named gap is incomplete transparency, and D is the only option that closes it. It mirrors SoftPulse's reasoning move: not \"which app is worst\" but \"what would let us find the worst, reliably, every time?\"",
    },
    {
      option: "A — binding guidelines across all product teams",
      verdict: "pick",
      why: "Equally defensible at #1, and it is what SoftPulse actually prioritised. Accept it readily — SoftPulse paired guidelines with transparency as one first step, so A-then-D and D-then-A are the same recommendation in different order.",
    },
    {
      option: "E — efficiency-linked OKRs",
      verdict: "pick",
      why: "A strong #2 or #3. It is the lever that makes A more than paper, because it changes what teams are measured on. Weak at #1 only because it needs a metric that does not exist yet.",
    },
    {
      option: "C — review board with release veto",
      verdict: "avoid",
      why: "Binding, which is its appeal, and the heaviest possible momentum cost at a company whose brief names high release pressure. Defensible if a learner argues CodeVista's risk of non-adoption outweighs the friction — hear that argument out.",
    },
    {
      option: "B — immediate rework of the 3 highest-load apps",
      verdict: "avoid",
      why: "The classic trap, and worth naming explicitly: CodeVista cannot currently prove which three are highest-load. Funding B first means spending the budget on a guess you would be unable to defend at the next review.",
    },
    {
      option: "F — external audit before deciding anything",
      verdict: "avoid",
      why: "Feels rigorous and buys a snapshot rather than a capability. When the audit ends, nothing inside CodeVista can see efficiency without commissioning another one. Contrast it directly with D, which builds the same visibility as a permanent capability.",
    },
  ],
  teachingNote:
    "There is no single correct ranking — A, D and E are all defensible at #1 and the rationale is what carries the answer. What to press on: a #1 of B or F should be met with \"what does this change about the fourth problem application?\" Both answer \"nothing\", which is the distinction between a fix and a structure that Section A is built on.",
};

// --- Step 2: the trade-off quadrant map ------------------------------------

export type QuadrantId = "lowHigh" | "highHigh" | "lowLow" | "highLow";

export type Quadrant = {
  id: QuadrantId;
  /** Grid position, so the map lays out without hard-coding order in the component. */
  col: 0 | 1;
  row: 0 | 1;
  momentum: "Low" | "High";
  structural: "Low" | "High";
  label: string;
  hint: string;
};

/** Row 0 is the top (high structural impact); column 0 is the left (low momentum cost). */
export const QUADRANTS: Quadrant[] = [
  {
    id: "lowHigh",
    col: 0,
    row: 0,
    momentum: "Low",
    structural: "High",
    label: "Quiet leverage",
    hint: "Changes what happens by default, without slowing releases.",
  },
  {
    id: "highHigh",
    col: 1,
    row: 0,
    momentum: "High",
    structural: "High",
    label: "Expensive leverage",
    hint: "Changes the default, and you pay for it in release speed.",
  },
  {
    id: "lowLow",
    col: 0,
    row: 1,
    momentum: "Low",
    structural: "Low",
    label: "Cheap and inert",
    hint: "Costs little momentum and changes little about next quarter.",
  },
  {
    id: "highLow",
    col: 1,
    row: 1,
    momentum: "High",
    structural: "Low",
    label: "Costly one-off",
    hint: "Slows things down to fix today's instance only.",
  },
];

export const quadrantById = (id: QuadrantId): Quadrant => QUADRANTS.find((q) => q.id === id)!;

export type QuadrantCard = {
  id: string;
  text: string;
  short: string;
  correct: QuadrantId;
  /** Shown when the placement is wrong — directional, never the answer. */
  clue: string;
  /** Sharper clue for specific wrong quadrants, where the spec calls for one. */
  clueByQuadrant?: Partial<Record<QuadrantId, string>>;
  /** Mentor-only reasoning for the reference placement. */
  why: string;
};

export const QUADRANT_CARDS: QuadrantCard[] = [
  {
    id: "dashboard",
    text: "Continuous SCI monitoring dashboard, no gating",
    short: "SCI monitoring dashboard",
    correct: "lowHigh",
    clue: "Nothing here blocks a release — ask what it costs a team in momentum before you place it on that axis.",
    clueByQuadrant: {
      highHigh: "Read the card again: \"no gating\". Nothing about this stops or delays a release, so reconsider what it actually costs in momentum.",
      lowLow: "Ask what a team can see next quarter that it cannot see today. Permanent visibility is not nothing — reconsider its structural weight.",
    },
    why: "Low momentum cost because it gates nothing; high structural impact because it makes efficiency permanently visible, which is the precondition for every other measure being justifiable.",
  },
  {
    id: "okrs",
    text: "Efficiency-linked OKRs for product teams",
    short: "Efficiency-linked OKRs",
    correct: "lowHigh",
    clue: "Changing what a team is measured on does not itself slow a release. Ask what it changes about the choices people make by default.",
    clueByQuadrant: {
      highHigh: "An OKR does not sit in the release path — nothing waits on it. Reconsider what it costs in near-term momentum.",
      lowLow: "This is the Management Logic lever: it changes what the organisation rewards. Ask whether that changes what happens by default next quarter.",
    },
    why: "Low momentum cost because no release waits on an OKR; high structural impact because it changes the incentive the whole team optimises against, which is what makes a guideline more than paper.",
  },
  {
    id: "gate",
    text: "Mandatory efficiency review gate before every release",
    short: "Mandatory review gate",
    correct: "highHigh",
    clue: "Something that sits in the path of every release has a cost, and a binding mechanism has weight. Consider both axes, not one.",
    clueByQuadrant: {
      lowLow: "A gate applied to every release is exactly the kind of binding mechanism the SoftPulse worked example pointed to — reconsider its structural weight.",
      lowHigh: "This one sits directly in the release path. Ask what every release now has to wait for.",
    },
    why: "High on both: it genuinely changes the default because nothing ships without passing it, and it is the most expensive option in momentum precisely because it is in the path of every release.",
  },
  {
    id: "rework",
    text: "Immediate rework of the 3 highest-load apps",
    short: "Rework the 3 worst apps",
    correct: "highLow",
    clue: "This fixes today's three worst offenders. Ask: does it change what happens when a fourth one appears next quarter?",
    clueByQuadrant: {
      lowHigh: "This fixes today's three worst offenders. Ask: does it change what happens when a fourth one appears next quarter?",
      highHigh: "This fixes today's three worst offenders. Ask: does it change what happens when a fourth one appears next quarter?",
      lowLow: "Real developer time comes out of the roadmap to do this. Reconsider what it costs in momentum.",
    },
    why: "High momentum cost because it takes capacity straight out of the feature roadmap; low structural impact because nothing about it changes what produces the next inefficient application.",
  },
  {
    id: "audit",
    text: "External audit of the full portfolio before deciding anything",
    short: "External portfolio audit",
    correct: "lowLow",
    clue: "Ask two things: whose time it actually takes, and what CodeVista can still see for itself once the auditors leave.",
    clueByQuadrant: {
      highHigh: "An audit itself doesn't touch a release pipeline — reconsider what it actually costs in momentum.",
      highLow: "An audit itself doesn't touch a release pipeline — reconsider what it actually costs in momentum.",
      lowHigh: "Ask what CodeVista can see for itself the day after the auditors leave. A snapshot is not a capability.",
    },
    why: "Low momentum cost because an external team does the work without touching the release pipeline; low structural impact because it produces a one-time snapshot rather than a capability the organisation keeps.",
  },
];

export const quadrantCardById = (id: string): QuadrantCard =>
  QUADRANT_CARDS.find((c) => c.id === id)!;

export const QUADRANT_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Step 2 — the trade-off map",
  items: QUADRANT_CARDS.map((c) => ({
    option: `${c.short} → ${quadrantById(c.correct).momentum} momentum / ${quadrantById(c.correct).structural} structural`,
    verdict: "pick" as const,
    why: c.why,
  })),
  teachingNote:
    "The two placements participants most often get wrong are the audit (placed high on momentum, because it feels like a big undertaking — but it consumes an external team's time, not the release pipeline) and the gate (placed low on structural impact, because it produces no artefact — but it is the only card here that nothing can ship without). Both errors come from scoring effort rather than effect; the axes ask what it costs the release pipeline and what it changes by default, not how much work it is.",
};

// --- Step 3: the RACI grid -------------------------------------------------

export type RaciLetter = "R" | "A" | "C" | "I";

export const RACI_LETTERS: { id: RaciLetter; name: string; meaning: string }[] = [
  { id: "R", name: "Responsible", meaning: "Does the work." },
  { id: "A", name: "Accountable", meaning: "Answers for the outcome. Exactly one — never zero, never more." },
  { id: "C", name: "Consulted", meaning: "Input sought before the decision. Two-way, and it costs time." },
  { id: "I", name: "Informed", meaning: "Kept updated afterwards. One-way, no input expected." },
];

export type RaciRole = { id: string; name: string; note: string };

export const RACI_ROLES: RaciRole[] = [
  { id: "cto", name: "CTO", note: "Holds the budget line and answers to the board." },
  { id: "vpeng", name: "VP Engineering", note: "Owns delivery capacity and the release calendar." },
  { id: "guild", name: "Central Architecture Guild", note: "Sets cross-team technical standards." },
  { id: "leads", name: "Individual Product Team Leads", note: "Control what their own teams actually build." },
  { id: "pm", name: "Product Management", note: "Owns the roadmap this competes with." },
  { id: "auditor", name: "External Auditor", note: "Independent, periodic, no internal authority." },
];

export const RACI_SUBJECT = "ownership of the green coding standard";

export const RACI_ANSWER_KEY: AnswerKeyBlock = {
  prompt: "Step 3 — the RACI model",
  items: [
    {
      option: "Exactly one Accountable",
      verdict: "pick",
      why: "The only thing the learner-facing check enforces, and the only thing that is structurally wrong rather than debatable. Zero means nobody answers for the outcome; two means both quietly assume the other does.",
    },
    {
      option: "Accountable on a role that holds budget or a release gate",
      verdict: "pick",
      why: "Defensible answers are CTO (budget and board exposure) or VP Engineering (delivery capacity). Both control something that would actually change the outcome.",
    },
    {
      option: "Accountable on the Architecture Guild",
      verdict: "avoid",
      why: "Arguable, and worth hearing out — the guild owns the standard's content. Press on whether it controls a budget line or a release gate; usually it advises rather than decides, which makes it a strong Responsible or Consulted.",
    },
    {
      option: "Accountable on the External Auditor",
      verdict: "avoid",
      why: "The clearest error available. An external party has no internal authority and no continuing presence — it can only ever be Informed, or Consulted at most.",
    },
    {
      option: "Everyone Consulted",
      verdict: "avoid",
      why: "The most common over-correction. Every role added to Consulted adds a round of two-way communication before a decision can be made — which is precisely how a governance structure becomes the brake it was designed to prevent.",
    },
  ],
  teachingNote:
    "Do not hand out a 'correct' grid — several are defensible and the reasoning is the exercise. The two questions that settle most disputes: which role holds a budget line, contract or release gate that would change the outcome (that is your Accountable), and what does each additional Consulted cost in decision latency. Product Management as Consulted is usually the interesting argument, since it owns the roadmap this competes with.",
};

// --- Step 4 and the memo ---------------------------------------------------

export const TASK3 = {
  id: "task3",
  tag: "TASK 3",
  title: "CodeVista Board Memo",
  framing:
    "You are Head of Software Strategy at CodeVista Digital Platforms — several digital products, a growing user base, high innovation and release pressure, and no current transparency on where operating cost and inefficiency actually come from. Build the decision architecture the board needs, not a list of coding tips.",
  nameField: {
    label: "Your name",
    instruction: "Used to label the exported memo — it becomes e.g. \"1-jane-day10-l3task1\".",
    placeholder: "e.g. Jane Muller",
  },
  rank: {
    heading: "Rank the guiding decisions",
    instruction:
      "Pick your top three in order. Click a card to add it; click a ranked card to remove it and free the slot.",
    rationale: {
      label: "Why this first? Name what it makes possible that the others don't.",
      instruction:
        "Two to three sentences about your #1 specifically — what it unlocks, not why it is generally good.",
      placeholder: "e.g. Measurement first because CodeVista cannot currently name its worst workload…",
      sample:
        "Measurement in the pipeline is the only option that closes CodeVista's named gap — incomplete transparency on the resource effects of individual applications. Until that exists, any rework we fund is a guess we could not defend at a board review, and any guideline we publish has no number behind it to show whether it is being followed. It makes both of the other two decisions defensible instead of merely plausible.",
    },
  },
  quadrant: {
    heading: "Place each measure on the trade-off map",
    instruction:
      "Drag a card into a quadrant, or click the card to select it and then click a quadrant. Use Check for a directional hint — it will never tell you the right square.",
    xAxis: { label: "Momentum Cost", note: "How much it slows near-term releases", low: "Low", high: "High" },
    yAxis: { label: "Structural Impact", note: "How much it changes what happens by default next quarter", low: "Low", high: "High" },
  },
  raci: {
    heading: "Governance model",
    instruction:
      "Assign RACI letters for ownership of the green coding standard. A role can hold more than one letter, and a letter can sit with more than one role — except Accountable, which must sit with exactly one.",
  },
  decideNow: {
    heading: "Decide now",
    now: {
      label: "Name one decision you must make now, despite incomplete data.",
      instruction: "Something specific and datable — not \"we should improve efficiency\".",
      placeholder: "e.g. Commit next quarter's platform capacity to pipeline instrumentation…",
      sample:
        "Commit the platform team's next-quarter capacity to building efficiency measurement into the CI/CD pipeline, before we know which applications it will implicate or what the numbers will show.",
    },
    why: {
      label: "Why would waiting for better data cost more than deciding wrong?",
      instruction:
        "Name the price of the delay — what accumulates, or what gets decided by default, while you wait.",
      placeholder: "e.g. Every quarter without a metric is another quarter of releases built under…",
      sample:
        "Every quarter we wait is another quarter of releases built under quality standards that never mention efficiency, so the problem we would be measuring keeps growing while we deliberate. Waiting is not a neutral hold — it is a decision to let the default continue, and it is the more expensive of the two.",
    },
  },
  export: {
    filenameLevel: 3,
    filenameTask: 1,
    docHeading: "Board Memo",
    buttonLabel: "Export Board Memo",
  },
} as const;

/**
 * Deterministic shuffle, seeded on a fixed string — the six guiding decisions
 * must not always appear in A–F order, but a per-render random shuffle would
 * produce a server/client hydration mismatch in a static export. Stable order
 * also lets a mentor refer to a card's position in front of a cohort.
 */
export function shuffledDecisions(): GuidingDecision[] {
  let seed = 0;
  const key = "codevista-guiding-decisions";
  for (let i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
  const out = [...GUIDING_DECISIONS];
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
