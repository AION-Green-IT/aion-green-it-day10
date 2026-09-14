/**
 * Route 1 — Foundations (L1). All learner-facing copy and pure data live here
 * so components stay presentational. Case used throughout Task 1: AppNexa
 * Solutions (fictional).
 *
 * Curriculum source: Module 7 (Day 1 of 2) — "Achieving Energy Efficiency in
 * Programming: Energy-Efficient Software and Green Coding Principles."
 */

import type { IconKey } from "@/lib/routes";
import type { AnswerKeyBlock } from "@/lib/answerKey";
import type { FlowGraph, FlowPin } from "@/lib/flowDiagram";
import type { GlossaryEntry } from "@/lib/glossary";

export const LEARNER_NAME_KEY = "learner:name";

// ---------------------------------------------------------------------------
// Store key map — every key this route writes to the shared progress store.
// ---------------------------------------------------------------------------
export const R1 = {
  name: LEARNER_NAME_KEY,
  /** markSeen bucket for hotspot pins the learner has opened on the trace. */
  inspected: "r1:inspected",
  /**
   * markSeen bucket recording the order hotspots were first sorted into a bin.
   * markSeen appends unique ids in insertion order and persists, so the
   * Diagnosis Report can list findings "in the order completed" without a
   * second source of truth for ordering.
   */
  order: "r1:order",
  category: (hotspotId: string) => `r1:cat:${hotspotId}`,
  lever: (hotspotId: string) => `r1:lever:${hotspotId}`,
  justification: (hotspotId: string) => `r1:why:${hotspotId}`,
  fixType: (hotspotId: string) => `r1:fix:${hotspotId}`,
  reflection: "r1:reflection",
} as const;

/** Prefixes resetSection() must sweep to clear every compound key this route writes. */
export const R1_KEY_PREFIXES = ["r1:cat:", "r1:lever:", "r1:why:", "r1:fix:", "r1:reflection"];

// ---------------------------------------------------------------------------
// Material — six sections (A–F).
// ---------------------------------------------------------------------------
export type MaterialSectionId =
  | "footprint"
  | "correctness"
  | "sci"
  | "principles"
  | "categories"
  | "profession";

export type MaterialSection = {
  id: MaterialSectionId;
  n: 1 | 2 | 3 | 4 | 5 | 6;
  letter: "A" | "B" | "C" | "D" | "E" | "F";
  icon: IconKey;
  kicker: string;
  title: string;
  definition: string;
  insight: string;
  takeaway: string;
  /**
   * Standard #11a — the decision rules this block hands the task, phrased the
   * way the task will need them, including the rule that rules out the
   * plausible wrong answer. Rendered as "How to decide when this comes up in
   * the task".
   */
  reasoning: string[];
  callout: { label: string; text: string };
  references: { label: string; url?: string }[];
};

/** DOM anchor a task step's MaterialRefs chip scrolls to. */
export function materialAnchorId(id: MaterialSectionId): string {
  return `r1-material-${id}`;
}

const MATERIAL_LABELS: Record<MaterialSectionId, string> = {
  footprint: "A · Why software has a footprint",
  correctness: "B · Correct vs. efficient",
  sci: "C · Measuring it (SCI)",
  principles: "D · Three GSF principles",
  categories: "E · The six categories",
  profession: "F · Not just a developer's problem",
};

/** Chips for a task step: which material sections it draws on. */
export function materialRefs(ids: MaterialSectionId[]) {
  return ids.map((id) => ({ anchorId: materialAnchorId(id), label: MATERIAL_LABELS[id] }));
}

export const PAGE_INTRO = {
  tag: "ROUTE 1 — FOUNDATIONS",
  title: "Reading the System",
  body: "You are joining AppNexa Solutions as a Software Sustainability Analyst. Before you can fix anything, you need to see it. This route gives you the vocabulary and mental model to recognize where software wastes energy — even without reading a single line of code.",
} as const;

export const MATERIAL: MaterialSection[] = [
  {
    id: "footprint",
    n: 1,
    letter: "A",
    icon: "factory",
    kicker: "A · The physical layer under the abstraction",
    title: "Why Software Has a Carbon Footprint",
    definition:
      "Software feels weightless, and that is an illusion produced by good abstraction. Every instruction your program executes is a state change in a physical transistor. Every byte you store holds a charge on a physical disk or memory cell that must be maintained. Every byte you transmit is driven down a physical cable or radio link through a chain of switches and routers, each drawing current, each generating heat that then has to be removed by cooling equipment drawing more current. \"The cloud\" is not a metaphorical elsewhere — it is a set of buildings on a map, filled with racks, connected to a grid. When an application does more work than it needs to, that surplus does not vanish into an abstraction. It is paid for, in watts, in a specific building, on a specific grid, at a specific moment.",
    insight:
      "The scale is now large enough that it registers at national-grid level. According to the International Energy Agency's Energy and AI report, data centres accounted for around 1.5% of global electricity consumption in 2024 — roughly 415 terawatt-hours. More importantly than the level is the slope: that consumption has been growing at approximately 12% per year, several times faster than overall electricity demand. A share that grows faster than the system it sits inside does not stay a rounding error for long. And unlike most industrial loads, a large fraction of this one is discretionary — it is work that software asked for and did not need.",
    takeaway:
      "The reason this waste persists is not incompetence, it is a split incentive. The engineer who writes an [[api-call|over-fetching API call]] or an [[n-plus-one|N+1 query]] never sees an electricity bill. The consequence surfaces three or four steps removed: as a compute-hours line on a cloud invoice, owned by a different team, in a different budget, aggregated across hundreds of services, with no mechanism to trace the number back to the line of code that caused it. Nobody is hiding the cost — the organisation simply has no wiring that connects cause to effect. That disconnect is precisely why energy-efficient software became a named engineering discipline with its own measurement standard, which the next sections introduce.",
    reasoning: [
      "Treat every behaviour you observe as a question about physical work: how many instructions, how many stored bytes, how many transmitted bytes does this cause? A behaviour that increases any of the three costs energy, whatever it looks like in the code.",
      "When a cost has no visible owner, expect it to grow. A finding that nobody currently measures is a stronger candidate for a structural fix than one that already shows up on somebody's dashboard.",
      "Rules out the tempting wrong answer: \"the cloud provider runs on renewables\" does not make surplus work free. It changes the carbon per unit of energy, not the amount of energy your software demanded — and those are two separate variables, as Section C makes explicit.",
    ],
    callout: {
      label: "Why this matters for the case ahead",
      text: "AppNexa Solutions runs internal and external digital applications that work correctly and have never been reviewed for efficiency. Its infrastructure bill has been climbing for two years and nobody on the team can attribute the increase to anything specific. That is the split incentive, seen from the inside.",
    },
    references: [
      { label: "IEA — Energy and AI (2025): data centres ≈415 TWh, ~1.5% of global electricity in 2024", url: "https://www.iea.org/reports/energy-and-ai" },
      { label: "Green Software Foundation — Green Software Practitioner", url: "https://learn.greensoftware.foundation/" },
    ],
  },
  {
    id: "correctness",
    n: 2,
    letter: "B",
    icon: "target",
    kicker: "B · Two independent questions",
    title: "Functionally Correct vs. Energy-Efficient",
    definition:
      "\"Functionally correct\" answers exactly one question: does this produce the right output for the given input? It is the question tests are written against, the question code review usually settles, and the question a product owner signs off on. \"Energy-efficient\" is a second, entirely independent question: does it produce that same correct output using the least energy, compute, memory and data movement it reasonably can? Nothing about passing the first question tells you anything about the second. A function can be correct, well-named, well-tested, readable, idiomatic — and still perform ten times more work than the result requires.",
    insight:
      "Because the two properties are orthogonal, they form a 2×2 rather than a spectrum. Correct and efficient is the goal. Correct and inefficient is the default state of nearly every system that has never been audited for efficiency — it is not a failure state, it is simply what you get when only one of the two questions was ever asked. This is AppNexa today. Incorrect and efficient is fast, cheap and useless; efficiency never buys you a pass on correctness. Incorrect and inefficient is the worst case, and rarest, because incorrectness gets caught and inefficiency does not. Notice which quadrant is dangerous: the quiet one, where everything works, nobody complains, and the bill goes up every quarter.",
    takeaway:
      "Efficiency is a deliberate design dimension, in the same family as security and accessibility. Those two are instructive precedents: neither appears on its own because code is \"clean\", both require someone to ask the question explicitly, and both degrade silently the moment nobody does. Efficiency behaves identically. It does not emerge from fast code, tidy code, or a good test suite — it emerges from a system where somebody is responsible for asking the second question, and has a number to answer it with.",
    reasoning: [
      "Never let \"it works\" or \"users aren't complaining\" close the question. Every behaviour in the task is functionally correct — that is the premise, not a defence.",
      "Ask what the output actually requires, then compare it to what the system does. The gap between those two is the finding, and it is where the lever belongs.",
      "Rules out the tempting wrong answer: a lever that improves how fast or how smoothly the same surplus work is delivered leaves the system in the correct-but-inefficient quadrant. Only a lever that reduces the work moves it.",
    ],
    callout: {
      label: "Where AppNexa sits",
      text: "Every one of the six behaviours you will inspect in Task 1 is functionally correct. Nothing is broken, no user is blocked, no test is failing. That is exactly what makes them hard to see — and why a classification framework beats an incident report.",
    },
    references: [
      { label: "ISO/IEC 25010 — Systems and software quality models: functional suitability and performance efficiency are separate characteristics" },
      { label: "Green Software Foundation — Green Software Practitioner", url: "https://learn.greensoftware.foundation/" },
    ],
  },
  {
    id: "sci",
    n: 3,
    letter: "C",
    icon: "gauge",
    kicker: "C · The measurement standard",
    title: "Measuring It: Software Carbon Intensity (SCI)",
    definition:
      "You cannot manage what you do not measure, and until recently there was no agreed way to measure the carbon cost of a piece of software. The Green Software Foundation's Software Carbon Intensity specification closed that gap, and in March 2024 it was published as the international standard ISO/IEC 21031:2024 — the first ISO standard written specifically for software carbon emissions. Its formula is deliberately small enough to hold in your head: C = ((E × I) + M) per R. Four variables, and every one of them is a place a design decision can land.",
    insight:
      "E is the energy the software system consumes to do its work — the variable an engineering team moves by making the code do less. I is the carbon intensity of the electricity at the location where that energy is consumed; grids are not uniformly clean, and the same E drawn on a coal-heavy grid versus a wind- or hydro-heavy one can differ by a factor of ten or more. M is the embodied emissions of the hardware the system requires, amortised over that hardware's useful life — the carbon spent manufacturing the servers, not running them. R is a functional unit: per API call, per user, per transaction. R is the \"per what\", and it is the variable that makes the number mean anything, because it is what lets you compare one release to the next.",
    takeaway:
      "The key structural insight is that SCI is a rate, not a total. A yearly total tells a CFO what already happened and is useless for engineering: ship a much more wasteful release during a quiet quarter and the total may still fall. A rate tells an engineer whether last week's deploy made things better or worse per transaction, independent of how much traffic the application happened to handle. You will not hand-calculate a full SCI score in this task — doing that properly needs infrastructure telemetry most teams take months to build. What matters here is the model as a lens: every design decision in Task 1 moves E, M or R in some direction, and naming which one is what turns an opinion into an argument.",
    reasoning: [
      "For each finding, name which SCI variable the lever actually moves. A lever that reduces work done per request lowers E. A lever that reduces how much hardware must exist lowers M. A lever that increases useful output for the same work raises R. A lever that moves none of the three is not an efficiency lever.",
      "Adding capacity — more replicas, more CPU, more provisioned throughput — absorbs a symptom by raising M, while leaving E per transaction untouched. That is the opposite direction of travel, and it is why those options appear as distractors in the task.",
      "Rules out the tempting wrong answer: caching or compressing an unnecessary response makes the waste cheaper to move, not smaller. E falls a little, the underlying work does not change, and the finding survives the fix.",
    ],
    callout: {
      label: "Read the formula as a diagnostic",
      text: "When a proposed fix sounds plausible but you cannot say which of E, I, M or R it moves, that is usually the signal that it addresses how the waste is experienced rather than whether the waste exists.",
    },
    references: [
      { label: "ISO/IEC 21031:2024 — Software Carbon Intensity (SCI) specification", url: "https://sci.greensoftware.foundation/" },
      { label: "Green Software Foundation — SCI specification project", url: "https://sci.greensoftware.foundation/" },
    ],
  },
  {
    id: "principles",
    n: 4,
    letter: "D",
    icon: "recycleLoop",
    kicker: "D · The working vocabulary",
    title: "Three Working Principles",
    definition:
      "The Green Software Foundation's Green Software Practitioner curriculum reduces the field to a handful of principles. Three of them carry almost all of the practical weight. Carbon Efficiency: emit the least carbon possible for the value delivered — the outcome all of the others serve. Energy Efficiency: use the least energy possible to do the same work, regardless of where that energy comes from — in practice, make the code do less. Carbon Awareness: react to the fact that the same amount of energy causes different amounts of carbon depending on when and where it is drawn, because grids are not uniformly clean at all hours; the practical move is to shift non-urgent work, such as nightly batch jobs, into cleaner grid-mix windows.",
    insight:
      "Map them onto Section C's formula and they stop being slogans. Energy Efficiency targets E — it reduces the energy demanded in the first place. Carbon Awareness targets I — it leaves the energy unchanged and moves it to a moment or a region where each kilowatt-hour carries less carbon. Carbon Efficiency is the composite these two serve. A fourth GSF area, Hardware Efficiency, targets M by extending hardware life and raising utilisation; it is out of scope for this route, which stays inside decisions a software team makes about its own code.",
    takeaway:
      "Task 1 trains almost entirely on Energy Efficiency, and that is a deliberate choice rather than an oversight. A software team can act on E this sprint: it needs no renegotiated cloud contract, no new region, no hardware refresh cycle, and no permission from procurement. Carbon Awareness is real and often significant, but acting on it means scheduling and placement decisions that usually sit with platform or infrastructure owners. Start where your own hands are on the controls.",
    reasoning: [
      "Default to Energy Efficiency when reading a finding: ask what work could stop happening. Reach for Carbon Awareness only when the work genuinely must happen and only its timing or location is in question.",
      "\"Make the code do less\" is the test to apply to every candidate lever. If the lever leaves the same work happening at the same frequency, it is not an Energy Efficiency lever, however sensible it sounds.",
      "Rules out the tempting wrong answer: rescheduling a job to a different hour is a Carbon Awareness move. It does nothing for a job whose real problem is that nobody can name a consumer of its output — there, the work itself is the question, not its timing.",
    ],
    callout: {
      label: "One principle, one variable",
      text: "Energy Efficiency → E. Carbon Awareness → I. Hardware Efficiency → M (out of scope here). If you can name the variable, you can defend the lever to someone who owns the budget.",
    },
    references: [
      { label: "Green Software Foundation — Green Software Practitioner: principles of green software", url: "https://learn.greensoftware.foundation/" },
      { label: "ISO/IEC 21031:2024 — Software Carbon Intensity (SCI) specification", url: "https://sci.greensoftware.foundation/" },
    ],
  },
  {
    id: "categories",
    n: 5,
    letter: "E",
    icon: "layers",
    kicker: "E · The classification framework",
    title: "Where Inefficiency Hides: Six Categories",
    definition:
      "Inefficiency is not randomly distributed. In practice it collects in six recognisable places, and naming which one a finding belongs to is what turns a list of complaints into a diagnosis. The six are Architecture, Data Processing, Storage, Network Load, Background Processes and Management Logic. Five of them are technical; the sixth is not, and is the one most often missed. Read each definition below with its example — in Task 1 these same six are the bins you will sort AppNexa's behaviours into, under exactly these names.",
    insight:
      "The reason to classify rather than simply list is that the category determines the lever. Two findings can look identical from a monitoring dashboard — both show as elevated database load — while one is a Data Processing problem solved by batching queries and the other is a Storage problem solved by not writing the data twice. Get the category wrong and you will reach for a plausible, expensive, ineffective fix. The discipline is to ask what would have to change for the finding to disappear, not where the symptom happened to become visible.",
    takeaway:
      "These six map onto the Green Software Foundation's Green Software Patterns catalog, an open, peer-reviewed collection of vendor-neutral engineering patterns organised by lifecycle stage: Requirements, Architecture, Development and Operations. Categories 1–2 correspond to Architecture- and Development-stage patterns; 3–4 to Development and Operations; 5 to Operations. Category 6 sits above the catalog entirely, at the governance layer — which is precisely why no pattern will fix it, and why it is the one most likely to regenerate the other five after they have been cleaned up.",
    reasoning: [
      "Ask what would have to change for the finding to disappear. That names the category — not the component where the symptom showed up on a graph.",
      "Separate the three that are easily confused. Data Processing is about how many times work is requested. Network Load is about how much data moves and how often. Storage is about what gets written and kept. The same elevated-load symptom can come from any of the three.",
      "Architecture is upstream of Network Load: if the waste was decided when someone specified what an endpoint returns, it is Architecture, even though you observe it as traffic on a wire.",
      "Rules out the tempting wrong answer: Management Logic is never the category for something currently executing and consuming compute. A running job is a Background Process, however badly it was governed into existence. Management Logic covers what the organisation measures and rewards — not code.",
    ],
    callout: {
      label: "Use the names exactly",
      text: "These six category names are used verbatim as Task 1's drop-bins, in this order. The grid below is the legend you will see again on the bins themselves.",
    },
    references: [
      { label: "Green Software Foundation — Green Software Patterns catalog", url: "https://patterns.greensoftware.foundation/" },
      { label: "Green Software Foundation — Green Software Practitioner", url: "https://learn.greensoftware.foundation/" },
    ],
  },
  {
    id: "profession",
    n: 6,
    letter: "F",
    icon: "certificate",
    kicker: "F · Where this sits professionally",
    title: "Why This Is Not Just a Developer's Problem",
    definition:
      "Categories 1 to 5 look like engineering problems and are not, at least not only. An N+1 query pattern survives because the team has no data-loading convention and no review step that would catch one. An endpoint that over-fetches survives because no standard says who decides what a response contains. A nightly job nobody can justify survives because nothing owns the question of retirement. These are conventions, review standards and ownership structures, and they outlive any individual engineer. That is why asking people to \"be more careful\" reliably fails: careful people working inside a structure that never asks the efficiency question produce the same result as careless ones, just more politely.",
    insight:
      "Green coding is not a fringe concern in European professional practice — it has a formal place in architecture certification. The iSAQB (International Software Architecture Qualification Board), the body behind the CPSA (Certified Professional for Software Architecture) credential, offers an Advanced Level module titled \"GREEN — Development of Resource-Efficient Applications\". Its scope is exactly the territory of this route: applying Green Software Foundation patterns, quantifying the energy efficiency of data centres and hardware, and evaluating cloud providers against ecological criteria. A competency that appears at Advanced Level in a professional architecture certification is, by construction, not a soft topic.",
    takeaway:
      "Read that as a statement about where the responsibility sits. If the lever for most of these findings is a standard, a review criterion or an owner, then the person who can pull it is whoever sets standards — an architect, a lead, a head of engineering — not the developer who happened to write the query. This module is not a soft-skills detour from \"real\" engineering: it trains a competency European software architecture already treats as core at its most rigorous professional level.",
    reasoning: [
      "Ask who could actually pull the lever. If the answer is \"whoever sets the standard\", the finding needs a structural fix, regardless of how small the code change itself would be.",
      "A fix is a Quick Fix when one team can make it inside its own code this sprint without a new rule, a new owner or a new contract. It is Structural when it needs a rule, a review criterion or an owner that outlives the change.",
      "Rules out the tempting wrong answer: a cheap first step does not make a finding a Quick Fix if the cheap step only tells you what to do next — but measuring before deciding is genuinely quick, and should be classified on what the first move costs, not on what it might eventually trigger.",
    ],
    callout: {
      label: "The organisational read",
      text: "If five of your six findings need a standard rather than a patch, that is not a pessimistic conclusion. It is the finding — and it is the one a manager can actually act on.",
    },
    references: [
      { label: "iSAQB — CPSA Advanced Level, Module GREEN: Development of Resource-Efficient Applications", url: "https://www.isaqb.org/" },
      { label: "Green Software Foundation — Green Software Patterns catalog", url: "https://patterns.greensoftware.foundation/" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Plain-language explainers for jargon in the material prose. A term is marked
// inline as [[id|label]] (see lib/glossary.ts); the diagram each one draws is
// chosen in components/route1/Material.tsx.
// ---------------------------------------------------------------------------
export const GLOSSARY: Record<string, GlossaryEntry> = {
  "api-call": {
    id: "api-call",
    kicker: "Plain-language explainer",
    question: "What is an API call — and what makes one “over-fetching”?",
    plain: [
      "API stands for Application Programming Interface: an agreed way for one piece of software to ask another piece of software for something. An API call is one of those requests, together with the answer that comes back.",
      "When someone opens a dashboard, the app in their browser doesn't have the data yet. It sends an API call to the company's server — in effect, “send me the details for customer 42” — and the server looks the data up and sends it back. Nearly every screen in a modern application is assembled this way, often from dozens of API calls.",
    ],
    secondary: {
      heading: "So what is over-fetching?",
      text: "Over-fetching is when the answer contains far more than the screen actually uses. The screen needs three fields, but the API returns the entire customer record — because that is what the endpoint was built to send, and nobody ever narrowed it down.",
    },
    analogy: {
      label: "Think of it like a restaurant",
      text: "The app is the guest, the server is the kitchen, and an API call is the order the waiter carries in plus the plate that comes back out. Over-fetching is a kitchen that cooks the whole menu no matter what you ordered. The waiter carries every dish to your table, you eat the soup you asked for — and everything else was cooked, plated and carried for nothing.",
    },
    visual: {
      key: "api-call",
      title: "One dashboard request, two ways",
      states: [
        {
          id: "over",
          label: "Over-fetching",
          caption:
            "The dashboard shows three things: a name, a status and an owner. But the server sends back the whole customer record — 24 fields. All 24 are looked up, packaged, sent across the network and unpacked by the app, and 21 of them land in the unused pile without ever appearing on screen. Then it happens again for every customer on the page, every time anyone opens it.",
        },
        {
          id: "right",
          label: "Right-sized",
          caption:
            "Same screen, same three fields, same experience for the person using it. The only difference is the answer: it carries just the 3 fields the screen displays instead of 24. Nothing visible changed — the work behind the screen simply got smaller.",
        },
      ],
    },
    whyEnergy: {
      heading: "Why this costs energy",
      text: "Every field in an answer is real work: the server reads it from storage, converts it into data that can travel, and pushes it across the network — where every switch and router along the path draws power — before the app receives and unpacks it. Over-fetching pays that full price for data nobody sees, on every call, for every user. Nothing breaks and nothing looks wrong, which is exactly why it goes unnoticed.",
    },
    seeAlso: { anchorId: "r1-category-architecture", label: "Read more in Section E" },
  },
  "n-plus-one": {
    id: "n-plus-one",
    kicker: "Plain-language explainer",
    question: "What is an N+1 query?",
    plain: [
      "Applications keep their data in a database, and they get it out by asking questions called queries — for example, “give me all the open orders for this customer.” Every query is a round-trip: the application sends the question, the database works out the answer, and the answer travels back.",
      "An N+1 query is a wasteful way of asking those questions. The application first runs one query to fetch a list. Then, instead of asking for the details of everything in that list at once, it goes back to the database separately for every single item — N more trips, where N is the number of items. One query plus N queries: that is where the name comes from.",
    ],
    analogy: {
      label: "Think of it like a supermarket run",
      text: "You need 50 things from the supermarket. The N+1 way: one trip to see what's on the shelves, then a separate trip there and back for each of the 50 items. The batched way: one trip, one trolley, everything at once. Your kitchen ends up with exactly the same shopping — after 51 trips instead of one.",
    },
    visual: {
      key: "n-plus-one",
      title: "Loading one page that shows a list",
      states: [
        {
          id: "nplus1",
          label: "N+1 — a trip per item",
          caption:
            "First the application asks the database for the list — that's trip 1. Then, for each of the {n} items in the list, it sends another separate query for that item's details: one more trip each. That's {trips} round-trips to load a single page, and the person looking at the screen sees none of them.",
        },
        {
          id: "batched",
          label: "Batched — one trip",
          caption:
            "The application asks for the list and every item's details together, in one combined query — usually a join, or a small fixed number of queries using a batch loader. With {n} items it is still a single round-trip (or a small fixed handful), and that number doesn't grow whether the list holds 10 items or 10,000.",
        },
      ],
    },
    whyEnergy: {
      heading: "Why this costs energy",
      text: "Every round-trip carries a fixed overhead that has nothing to do with how much data comes back: the application builds and sends the query, the network carries it both ways, and the database has to receive it, work out how to answer it, run it and reply. Batching pays that overhead once. N+1 pays it once per item — so the page gets slower and more expensive exactly as the business grows and the lists get longer, with no error anywhere to warn anyone.",
    },
    seeAlso: { anchorId: "r1-category-dataProcessing", label: "Read more in Section E" },
  },
};

// ---------------------------------------------------------------------------
// Section B — the correctness × efficiency 2×2.
// ---------------------------------------------------------------------------
export type QuadrantCell = {
  id: string;
  correct: boolean;
  efficient: boolean;
  label: string;
  verdict: string;
  detail: string;
  tone: "goal" | "focus" | "reject" | "worst";
};

export const CORRECTNESS_GRID: QuadrantCell[] = [
  {
    id: "ce",
    correct: true,
    efficient: true,
    label: "Correct + Efficient",
    verdict: "The goal",
    detail:
      "Right output, least work. Reached deliberately — someone asked the efficiency question and had a number to answer it with.",
    tone: "goal",
  },
  {
    id: "ci",
    correct: true,
    efficient: false,
    label: "Correct + Inefficient",
    verdict: "AppNexa today",
    detail:
      "The default state of almost every unaudited legacy system. Nothing is broken, nobody complains, and the bill rises every quarter. The quiet, dangerous quadrant.",
    tone: "focus",
  },
  {
    id: "ie",
    correct: false,
    efficient: true,
    label: "Incorrect + Efficient",
    verdict: "Not acceptable",
    detail:
      "Fast and cheap, but wrong. Efficiency never buys a pass on correctness — this quadrant is a failure regardless of its energy profile.",
    tone: "reject",
  },
  {
    id: "ii",
    correct: false,
    efficient: false,
    label: "Incorrect + Inefficient",
    verdict: "Worst case",
    detail:
      "Wrong and wasteful. Rarest of the four, because incorrectness gets caught quickly and inefficiency does not get caught at all.",
    tone: "worst",
  },
];


// ---------------------------------------------------------------------------
// Section B's "Deep example" links. One running scenario across all four cards
// — a parcel-tracking page at a logistics company — so the four are directly
// comparable: same feature, same two questions, different answers.
// ---------------------------------------------------------------------------
/** The shared sequence all four Deep examples repeat, so the breadcrumb in each dialog is identical. */
const QUADRANT_TIMELINE = [
  { id: "quadrant-ce", label: "The goal" },
  { id: "quadrant-ci", label: "AppNexa today" },
  { id: "quadrant-ie", label: "Not acceptable" },
  { id: "quadrant-ii", label: "Worst case" },
];

export const QUADRANT_EXAMPLES: Record<string, GlossaryEntry> = {
  "quadrant-ce": {
    id: "quadrant-ce",
    kicker: "Deep example · The goal",
    question: "How does a team actually confirm a feature is Correct + Efficient?",
    plain: [
      "Take a parcel-tracking page: a customer enters a tracking number and sees the current status. Two separate questions get answered before it ships, each by different people and different evidence — the steps below are tagged Correct? or Efficient?, so you can see which one each finding settles.",
    ],
    visual: { key: "quadrant-example", title: "One feature, two questions, two answers", states: [] },
    timeline: { sequence: QUADRANT_TIMELINE },
    steps: {
      heading: "Who does what, and what it produces",
      items: [
        {
          who: "QA / the customer",
          does: "Runs the automated test suite against known tracking numbers, then real customers use the page for a week.",
          yields: "0 wrong statuses shown, 0 support tickets about incorrect tracking",
          tracks: ["Correct?"],
        },
        {
          who: "The platform team",
          does: "Reads the page's server logs and measures energy per load using their cloud provider's per-service metering.",
          yields: "E = 0.006 kWh per 1,000 page loads",
          tracks: ["Efficient?"],
        },
        {
          who: "The sustainability lead",
          does: "Looks up the carbon intensity of the electricity grid the servers run on that day, from the grid operator's published figure.",
          yields: "I = 380 g CO₂e per kWh that day",
          tracks: ["Efficient?"],
        },
        {
          who: "IT asset management",
          does: "Divides the servers' manufacturing footprint by their expected lifetime, then allocates a share to this page by its share of total traffic.",
          yields: "M ≈ 0.0004 kWh-equivalent per 1,000 loads",
          tracks: ["Efficient?"],
        },
        {
          who: "The engineering lead",
          does: "Combines E, I and M into one SCI number and compares it against last quarter's release of the same page.",
          yields: "C ≈ 0.9 g CO₂e per page load — 12% lower than last quarter",
          tracks: ["Efficient?"],
        },
      ],
    },
    verdict: {
      heading: "Why this lands here",
      text: "Correct, because the evidence is behavioural: real customers get the right status, every time, for a week straight. Efficient, because the evidence is a number that fell from a known baseline. Both questions were asked on purpose, by named owners, with a number attached — which is the actual definition of “the goal”, not a feeling that the page seems fine.",
    },
    news: {
      heading: "In the world",
      text: "A growing number of public-sector teams — UK government digital services among them — publish a carbon estimate for each page alongside their existing speed and accessibility checks, using tools such as the Website Carbon Calculator, and treat lowering that number as a real release criterion rather than a one-off audit.",
      source: "UK Government Digital Service blogs on sustainable design practice",
    },
    seeAlso: { anchorId: "r1-material-correctness", label: "Back to the 2×2" },
  },
  "quadrant-ci": {
    id: "quadrant-ci",
    kicker: "Deep example · AppNexa today",
    question: "How does a team discover it has been Correct + Inefficient all along?",
    plain: [
      "Same parcel-tracking page, eighteen months later. It has never returned a wrong status. It has also never been looked at from the efficiency side — until a rising cloud bill forces the question.",
    ],
    visual: { key: "quadrant-example", title: "Working fine, quietly getting more expensive", states: [] },
    timeline: { sequence: QUADRANT_TIMELINE },
    steps: {
      heading: "Who does what, and what it produces",
      items: [
        {
          who: "Finance",
          does: "Notices the monthly cloud invoice for this service has grown 40% over two quarters, with no matching growth in customers.",
          yields: "Cost per 1,000 page loads up from $0.80 to $1.12",
          tracks: ["Efficient?"],
        },
        {
          who: "The platform team",
          does: "Instruments the page for the first time and finds it re-queries the full shipment history on every refresh, instead of just the latest status.",
          yields: "18 database round-trips per page load, most of them unused",
          tracks: ["Efficient?"],
        },
        {
          who: "The sustainability lead",
          does: "Runs the same E × I + M calculation as before, now that E is finally being measured.",
          yields: "C ≈ 6.4 g CO₂e per page load — over 7× the efficient version",
          tracks: ["Efficient?"],
        },
        {
          who: "The engineering lead",
          does: "Confirms the page's correctness has never been in question — the fix is entirely on the efficiency side, and can ship without changing what the customer sees.",
          yields: "Fix scoped: same output, a fraction of the queries",
          tracks: ["Correct?", "Efficient?"],
        },
      ],
    },
    verdict: {
      heading: "Why this lands here",
      text: "Correct, because nothing about what the customer sees was ever wrong — that is exactly why nobody looked. Inefficient, because the second question was never asked until a cloud bill forced it. This is the quiet quadrant: everything about it looks fine from the outside, which is precisely the mechanism that lets the cost climb for a year and a half unnoticed.",
    },
    news: {
      heading: "In the world",
      text: "Amazon's own Prime Video engineering team publicly described exactly this pattern in 2023: a video-monitoring service was functioning correctly, but its distributed, serverless architecture was far more expensive to run at scale than needed. Rebuilding it as a single monolithic process — same correct output — cut its infrastructure cost by roughly 90%.",
      source: "Amazon Prime Video engineering blog, 2023",
    },
    seeAlso: { anchorId: "r1-material-correctness", label: "Back to the 2×2" },
  },
  "quadrant-ie": {
    id: "quadrant-ie",
    kicker: "Deep example · Not acceptable",
    question: "What does Incorrect + Efficient actually look like in practice?",
    plain: [
      "Same page again — the team's response to the inefficiency found in “AppNexa today”: cache each tracking number's result for six hours, to cut the database load that was driving the cost up. It works beautifully — for the wrong reason.",
    ],
    visual: { key: "quadrant-example", title: "Fast and cheap, and wrong", states: [] },
    timeline: { sequence: QUADRANT_TIMELINE },
    steps: {
      heading: "Who does what, and what it produces",
      items: [
        {
          who: "The platform team",
          does: "Ships the six-hour cache. Database load drops immediately, and the efficiency dashboard turns green the same day.",
          yields: "C down to 0.7 g CO₂e per page load — the best number yet",
          tracks: ["Efficient?"],
        },
        {
          who: "A customer",
          does: "Refreshes the page an hour after their parcel is marked delivered, and still sees “out for delivery”.",
          yields: "1 confused customer, 1 support ticket",
          tracks: ["Correct?"],
        },
        {
          who: "Support",
          does: "Escalates a pattern: every ticket this week involves a status that changed less than six hours ago.",
          yields: "14 tickets in 5 days, all the same root cause",
          tracks: ["Correct?"],
        },
        {
          who: "QA",
          does: "Reproduces it in an hour: the cache serves the same answer regardless of what actually changed underneath it.",
          yields: "Confirmed: correctness regression, not a support fluke",
          tracks: ["Correct?"],
        },
      ],
    },
    verdict: {
      heading: "Why this lands here",
      text: "Efficient, unambiguously — the number the team was chasing genuinely improved. Incorrect, because the page now tells customers something false for up to six hours at a time. The efficiency dashboard cannot see this failure; only the people checking the actual output can. That gap is exactly why efficiency is never allowed to stand in for correctness.",
    },
    news: {
      heading: "In the world",
      text: "This is common enough to have a name in operations literature: caching a result before confirming it still reflects reality is one of the most frequently cited causes of an outage or a wrong answer that looks, from a systems-health dashboard, like nothing went wrong at all.",
      source: "Google — Site Reliability Engineering, “Postmortem Culture” (O'Reilly, 2016)",
    },
    seeAlso: { anchorId: "r1-material-correctness", label: "Back to the 2×2" },
  },
  "quadrant-ii": {
    id: "quadrant-ii",
    kicker: "Deep example · Worst case",
    question: "How does a system end up Incorrect + Inefficient at the same time?",
    plain: [
      "The rarest quadrant, and the one that takes the longest to reach: the correctness bug from “Not acceptable” gets fixed, but the inefficiency from “AppNexa today” was never actually dealt with — two separate failures landing on top of each other, unnoticed, at different times.",
    ],
    visual: { key: "quadrant-example", title: "Two failures, stacked", states: [] },
    timeline: { sequence: QUADRANT_TIMELINE },
    steps: {
      heading: "Who does what, and what it produces",
      items: [
        {
          who: "The platform team",
          does: "Ships a fix for last quarter's cache bug — but forgets to remove the now-redundant full-history re-query underneath it.",
          yields: "The correctness bug is gone, and the N+1 pattern is left in place",
          tracks: ["Correct?", "Efficient?"],
        },
        {
          who: "A customer",
          does: "Hits a rare edge case: a parcel with two delivery attempts, which the un-reviewed fix handles by showing the older attempt.",
          yields: "1 wrong status shown, in a case nobody tested",
          tracks: ["Correct?"],
        },
        {
          who: "The sustainability lead",
          does: "Runs the routine quarterly efficiency check and finds the query count never actually improved.",
          yields: "C ≈ 6.1 g CO₂e per page load — still roughly 7× the efficient baseline",
          tracks: ["Efficient?"],
        },
        {
          who: "The engineering lead",
          does: "Reviews both findings together and realises they were never connected: two different bugs, from two different quarters, sitting in the same file.",
          yields: "Two tickets opened, one root-cause review scheduled",
          tracks: ["Correct?", "Efficient?"],
        },
      ],
    },
    verdict: {
      heading: "Why this lands here",
      text: "Wrong, on a real edge case a test suite happened to miss. Wasteful, on a pattern nobody had gone back to check since the correctness fix shipped. Neither failure caused the other — they simply coexisted, because nobody was looking at both questions at once. That is why this quadrant is rare: it takes two separate lapses in the same place to reach it, not one.",
    },
    news: {
      heading: "In the world",
      text: "Software engineering research on defect clustering consistently finds that files changed most frequently, and reviewed least carefully after the first fix ships, accumulate a disproportionate share of a codebase's remaining bugs — the exact mechanism by which a correctness patch and a lingering inefficiency end up living in the same few lines.",
      source: "Nagappan & Ball, “Use of Relative Code Churn Measures to Predict System Defect Density” (ICSE, 2005)",
    },
    seeAlso: { anchorId: "r1-material-correctness", label: "Back to the 2×2" },
  },
};

// ---------------------------------------------------------------------------
// The figures QuadrantExampleVisual draws for each Deep example above.
// ---------------------------------------------------------------------------
export type ExampleFigure = {
  correct: boolean;
  efficient: boolean;
  correctEvidence: string;
  number: string;
  numberDetail: string;
};

export const EXAMPLE_FIGURES: Record<string, ExampleFigure> = {
  "quadrant-ce": {
    correct: true,
    efficient: true,
    correctEvidence: "A week of real customer use, 0 wrong statuses shown.",
    number: "0.9 g",
    numberDetail: "SCI per 1,000 page loads — 12% below last quarter.",
  },
  "quadrant-ci": {
    correct: true,
    efficient: false,
    correctEvidence: "Never returned a wrong status in 18 months.",
    number: "6.4 g",
    numberDetail: "SCI per 1,000 page loads — over 7× the efficient version.",
  },
  "quadrant-ie": {
    correct: false,
    efficient: true,
    correctEvidence: "Served a stale status for up to 6 hours after delivery.",
    number: "0.7 g",
    numberDetail: "SCI per 1,000 page loads — the best number the team ever saw.",
  },
  "quadrant-ii": {
    correct: false,
    efficient: false,
    correctEvidence: "Wrong status on a rare two-attempt delivery edge case.",
    number: "6.1 g",
    numberDetail: "SCI per 1,000 page loads — the query pattern was never actually fixed.",
  },
};

// ---------------------------------------------------------------------------
// Section C — the SCI variables, as rendered by the formula visual.
// ---------------------------------------------------------------------------
export const SCI_VARIABLES = [
  {
    symbol: "E",
    name: "Energy",
    caption: "How much electricity the software draws to do its work.",
    lever: "Lowered by making the code do less.",
  },
  {
    symbol: "I",
    name: "Carbon intensity",
    caption: "How much carbon each unit of that electricity carries, where and when it is drawn.",
    lever: "Lowered by shifting work to a cleaner grid or hour.",
  },
  {
    symbol: "M",
    name: "Embodied emissions",
    caption: "The carbon spent manufacturing the hardware, amortised over its useful life.",
    lever: "Raised by provisioning more machines to absorb a symptom.",
  },
  {
    symbol: "R",
    name: "Functional unit",
    caption: "The \"per what\" — per API call, per user, per transaction.",
    lever: "Makes the number comparable release over release.",
  },
] as const;

// ---------------------------------------------------------------------------
// Section C's "try it yourself" calculator — a worked scenario with real
// numbers, entered by hand, so the formula stops being four letters and
// becomes something the learner has actually computed once.
// ---------------------------------------------------------------------------
export type SciCalcVarKey = "E" | "I" | "M" | "R";

export type SciCalcVariable = {
  key: SciCalcVarKey;
  label: string;
  unit: string;
  /** The value this scenario's story actually supports. */
  value: number;
  placeholder: string;
  /** Why this particular figure from the story is this variable, not one of the other three. */
  reason: string;
};

export type SciCalculatorContent = {
  heading: string;
  intro: string;
  /** The scenario, one paragraph per string — each one carries exactly one variable's figure. */
  story: string[];
  instruction: string;
  variables: SciCalcVariable[];
  resultLabel: string;
  resultUnit: string;
  /** The same scenario a month later, after a fix — makes the "rate, not total" point concrete. */
  followUp: { intro: string; newE: number; result: string };
};

export const SCI_CALCULATOR: SciCalculatorContent = {
  heading: "Try it: AppNexa's own SCI number",
  intro:
    "AppNexa's platform team wants a real measurement, not a guess, for the order-confirmation service. Four people handed them four numbers. Read where each one came from, then work the formula yourself.",
  story: [
    "AppNexa's cloud provider meters usage per service. For the order-confirmation service, last month's billing dashboard showed 40 kilowatt-hours drawn — a direct meter reading, not an estimate.",
    "That service runs in a data-centre region whose grid operator publishes a monthly average carbon intensity. Last month it was 350 grams of CO₂-equivalent per kilowatt-hour.",
    "The three physical servers dedicated to this service together cost about 96,000 grams of CO₂e to manufacture. IT asset management amortises that over the servers' expected four-year life and allocates it by usage share — one month's slice for this service comes to 2,000 grams of CO₂e.",
    "Application logs show the service actually sent 100,000 confirmation messages in that same 30-day window — the functional unit the team is measuring a rate per.",
  ],
  instruction:
    "Match each paragraph above to the box it belongs in below, type the number, and watch C calculate itself. Stuck on which figure goes where? Reveal shows the numbers and explains the match.",
  variables: [
    {
      key: "E",
      label: "E — Energy",
      unit: "kWh",
      value: 40,
      placeholder: "e.g. 40",
      reason:
        "The only figure described as an amount of electricity drawn — a direct meter reading. That is exactly what E measures: energy the software actually consumed.",
    },
    {
      key: "I",
      label: "I — Carbon intensity",
      unit: "g CO₂e / kWh",
      value: 350,
      placeholder: "e.g. 350",
      reason:
        "The only figure expressed as carbon per unit of electricity, published by the grid operator. That is I — how dirty the electricity your energy figure drew actually was.",
    },
    {
      key: "M",
      label: "M — Embodied emissions",
      unit: "g CO₂e",
      value: 2000,
      placeholder: "e.g. 2000",
      reason:
        "The one figure that has nothing to do with this month's usage — it's a manufacturing cost spread over years and allocated to this reporting period. That allocation is exactly what makes it M rather than E.",
    },
    {
      key: "R",
      label: "R — Functional unit",
      unit: "confirmations sent",
      value: 100000,
      placeholder: "e.g. 100000",
      reason:
        "The count of times the software actually did its job in the same window. That is R — the \"per what\" the rate is measured against.",
    },
  ],
  resultLabel: "C — the SCI rate",
  resultUnit: "g CO₂e per confirmation sent",
  followUp: {
    intro:
      "One month later, the team ships a fix that cuts energy use to 22 kWh. Nothing else about the service changes — same grid, same servers, same volume.",
    newE: 22,
    result:
      "C now works out to about 0.097 — roughly 40% lower, expressed as a number instead of a guess. That is the whole point of a rate: it can say the deploy helped before a full year of billing data ever arrives.",
  },
};

// ---------------------------------------------------------------------------
// Section D — the three principles triad.
// ---------------------------------------------------------------------------
export const PRINCIPLES = [
  {
    id: "carbon-efficiency",
    n: 1,
    name: "Carbon Efficiency",
    variable: "the composite",
    summary: "Emit the least carbon possible for the value delivered.",
    detail:
      "The outcome the other principles serve. Stated alone it is a goal, not a method — it becomes actionable only once you say which variable you intend to move.",
  },
  {
    id: "energy-efficiency",
    n: 2,
    name: "Energy Efficiency",
    variable: "E",
    summary: "Use the least energy possible to do the same work — make the code do less.",
    detail:
      "Independent of where the energy comes from. This is the principle Task 1 trains on, because a software team can act on it this sprint without renegotiating anything.",
  },
  {
    id: "carbon-awareness",
    n: 3,
    name: "Carbon Awareness",
    variable: "I",
    summary: "The same energy causes different carbon depending on when and where it is drawn.",
    detail:
      "Grids are not uniformly clean at all hours. The practical move is to shift non-urgent work — nightly batch jobs, bulk re-indexing — into cleaner grid-mix windows.",
  },
] as const;

// ---------------------------------------------------------------------------
// Section E — the six categories. Also Task 1's six drop-bins, verbatim.
// ---------------------------------------------------------------------------
export type CategoryId =
  | "architecture"
  | "dataProcessing"
  | "storage"
  | "networkLoad"
  | "backgroundProcesses"
  | "managementLogic";

export type Category = {
  id: CategoryId;
  n: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  icon: IconKey;
  /** One-line bin label — short enough to sit under an icon on a drop target. */
  short: string;
  /** The full Section E paragraph: definition plus one concrete example. */
  body: string;
  /** Where this category sits in the GSF Green Software Patterns lifecycle stages. */
  stage: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "architecture",
    n: 1,
    name: "Architecture",
    icon: "blueprint",
    short: "What components return and how they talk",
    body: "Architecture covers the shape decisions — what each component returns, what it asks for, and how components communicate with one another. These choices are made early, written down rarely, and then inherited by everyone who touches the system afterwards. Their cost is structural rather than incidental: an endpoint that returns a full customer record when the screen displays three fields from it will over-fetch on every single call, forever, no matter how efficiently the surrounding code is written. The defining characteristic of an architecture finding is that the waste was decided before any data moved — someone specified a contract that asks for more than the use case needs, and every consumer of that contract now pays for the decision.",
    stage: "GSF patterns: Architecture / Development stage",
  },
  {
    id: "dataProcessing",
    n: 2,
    name: "Data Processing",
    icon: "database",
    short: "How much computation one user action triggers",
    body: "Data Processing is about how much computation a single user action sets off. The canonical failure here is the N+1 query problem: the application fetches a list, then issues one additional query per item in that list to fill in its details, instead of one combined query that retrieves everything at once. A fifty-row screen silently becomes fifty-one round-trips to the database. It is a particularly treacherous category because it is invisible at small scale — with three rows in a development database, nobody notices — and grows linearly with real data, so the system degrades exactly as it becomes successful. The signature of a Data Processing finding is repetition: the same kind of work, performed many more times than the result requires.",
    stage: "GSF patterns: Architecture / Development stage",
  },
  {
    id: "storage",
    n: 3,
    name: "Storage",
    icon: "drive",
    short: "What gets written, how often, and in how many places",
    body: "Storage concerns what gets written, how frequently, and whether it genuinely needs to exist in more than one place. Three patterns dominate: redundant copies of the same data maintained in parallel systems, unbounded retention where nothing is ever deleted because nobody decided it should be, and over-frequent writes that persist state far more often than anyone reads it. A typical example is customer data written to a primary database and simultaneously copied in full to a separate analytics store on every update, when the analytics store is queried once a month. Storage costs are continuous rather than per-request — the data sits on powered hardware whether anyone touches it or not — which is what makes unbounded retention so expensive and so easy to overlook.",
    stage: "GSF patterns: Development / Operations stage",
  },
  {
    id: "networkLoad",
    n: 4,
    name: "Network Load",
    icon: "network",
    short: "How much data moves, and how many times",
    body: "Network Load is about data in motion: how much of it moves, and how many times the same information crosses the wire. Redundant transmission is the clearest case — the same event pushed to a client through several channels at once because each was added by a different team at a different time and none was ever removed. Oversized or unpaginated payloads belong here too, as do chatty protocols that exchange many small messages where one would do. Transmission is expensive out of proportion to its visibility, because each byte traverses a chain of switches, routers and radio links, each drawing power. A Network Load finding is identified by following one piece of information and counting how many times it travels.",
    stage: "GSF patterns: Development / Operations stage",
  },
  {
    id: "backgroundProcesses",
    n: 5,
    name: "Background Processes",
    icon: "cycle",
    short: "Work that runs whether or not anyone benefits",
    body: "Background Processes are scheduled jobs, polling loops and synchronisation tasks that run independently of any user action — nightly batch jobs, five-second polls, hourly re-indexing. They are uniquely dangerous for one reason: they run at their full configured frequency whether or not anyone benefits that day. A user-triggered inefficiency at least scales down when usage does; a background job consumes identically on a public holiday. They also accumulate, because adding one is easy, and retiring one requires somebody to prove a negative — that nothing downstream depends on its output. The classic example is the nightly job whose original consumer was decommissioned years ago, still processing the full user base every night because nobody could confirm it was safe to switch off.",
    stage: "GSF patterns: Operations stage",
  },
  {
    id: "managementLogic",
    n: 6,
    name: "Management Logic",
    icon: "gauge",
    short: "What the organisation measures and rewards",
    body: "Management Logic is not a technical pattern at all. It is what an organisation chooses to measure, report and reward — and it is the category most often missed, because it never appears in a codebase. A team assessed purely on features shipped and release velocity has no structural reason to notice categories 1 to 5, however capable its engineers are: the work of finding and fixing inefficiency is invisible to every number the team is judged on. This category explains persistence. It is why technical cleanups regenerate within a year, why an efficiency initiative fades once its champion moves on, and why the lever is never a code change but a change to what leadership counts as success.",
    stage: "Above the GSF catalog entirely — the governance layer",
  },
];

export const categoryById = (id: CategoryId): Category =>
  CATEGORIES.find((c) => c.id === id)!;

// ---------------------------------------------------------------------------
// Further reading — rendered as a card, not inline links.
// ---------------------------------------------------------------------------
export const FURTHER_READING = {
  heading: "Further reading",
  intro: "The three primary sources behind this route, in the order you would consult them.",
  items: [
    {
      body: "Green Software Foundation",
      title: "Software Carbon Intensity specification (ISO/IEC 21031:2024)",
      host: "sci.greensoftware.foundation",
      url: "https://sci.greensoftware.foundation/",
    },
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
  ],
} as const;

// ---------------------------------------------------------------------------
// Flow diagrams — one reusable component, two graphs.
// `FlowDiagram` renders any of these; Section A passes ENERGY_CHAIN with no
// pins, Task 1 passes APPNEXA_TRACE with six.
// ---------------------------------------------------------------------------
/** Section A — `energy-flow-diagram`. Code → compute → facility → grid → CO2e, plus the network branch. */
export const ENERGY_CHAIN: FlowGraph = {
  id: "energy-flow-diagram",
  title: "From an executed instruction to emitted CO₂e",
  caption:
    "The main chain is compute. The lower branch is everything that moves: transmitted bytes draw their own power across the network path before rejoining the same grid.",
  viewBox: "0 0 900 300",
  nodes: [
    { id: "code", label: "Code executes", sub: "instructions", x: 16, y: 60, w: 152, h: 68, tone: "solid" },
    { id: "compute", label: "Compute", sub: "CPU / GPU", x: 196, y: 60, w: 152, h: 68, tone: "solid" },
    { id: "facility", label: "Data centre", sub: "servers + cooling", x: 376, y: 60, w: 152, h: 68, tone: "solid" },
    { id: "grid", label: "Electricity grid", sub: "generation mix", x: 556, y: 60, w: 152, h: 68, tone: "solid" },
    { id: "co2", label: "CO₂e emitted", sub: "the measured output", x: 736, y: 60, w: 152, h: 68, tone: "outline" },
    { id: "tx", label: "Data transmitted", sub: "bytes on the wire", x: 196, y: 200, w: 152, h: 60, tone: "outline" },
    { id: "net", label: "Network path", sub: "switches + links", x: 376, y: 200, w: 152, h: 60, tone: "outline" },
    { id: "draw", label: "Additional draw", sub: "power, again", x: 556, y: 200, w: 152, h: 60, tone: "outline" },
  ],
  edges: [
    { id: "e1", d: "M168 94 H196", flow: true },
    { id: "e2", d: "M348 94 H376", flow: true },
    { id: "e3", d: "M528 94 H556", flow: true },
    { id: "e4", d: "M708 94 H736", flow: true },
    { id: "b1", d: "M272 128 V200", flow: true },
    { id: "b2", d: "M348 230 H376", flow: true },
    { id: "b3", d: "M528 230 H556", flow: true },
    { id: "b4", d: "M632 200 V128", flow: true },
  ],
};

/** Task 1 — the same component, AppNexa's simplified system trace. */
export const APPNEXA_TRACE: FlowGraph = {
  id: "appnexa-system-trace",
  title: "AppNexa Solutions — live system trace",
  caption:
    "Six components are flagged. The Engineering KPIs panel sits deliberately outside the system boundary — it is not part of the running platform.",
  viewBox: "0 0 920 470",
  nodes: [
    { id: "frontend", label: "Front-end", sub: "browser dashboard", x: 24, y: 190, w: 170, h: 68, tone: "solid" },
    { id: "gateway", label: "API Gateway", sub: "public entry point", x: 300, y: 190, w: 160, h: 68, tone: "solid" },
    { id: "appserver", label: "App Server", sub: "business logic", x: 540, y: 190, w: 160, h: 68, tone: "solid" },
    { id: "cache", label: "Cache", sub: "in-memory", x: 760, y: 26, w: 150, h: 56, tone: "outline" },
    { id: "worker", label: "Background Worker", sub: "scheduled jobs", x: 760, y: 116, w: 150, h: 56, tone: "outline" },
    { id: "database", label: "Database", sub: "primary store", x: 760, y: 225, w: 150, h: 56, tone: "outline" },
    { id: "reporting", label: "Reporting Store", sub: "monthly export", x: 760, y: 345, w: 150, h: 56, tone: "outline" },
    {
      id: "kpis",
      label: "Engineering KPIs",
      sub: "features shipped · release velocity",
      x: 24,
      y: 330,
      w: 250,
      h: 96,
      tone: "aside",
    },
  ],
  edges: [
    // Front-end ↔ API Gateway, drawn as three parallel lanes (the triple send).
    { id: "t-fe-gw", d: "M194 224 H300", lanes: 3, laneGap: 14, flow: true },
    { id: "t-gw-app", d: "M460 224 H540", flow: true },
    { id: "t-app-cache", d: "M700 208 C 730 208, 730 54, 760 54", flow: true },
    { id: "t-app-worker", d: "M700 216 C 730 216, 730 144, 760 144", flow: true },
    { id: "t-app-db", d: "M700 232 C 730 232, 730 253, 760 253", flow: true },
    { id: "t-app-report", d: "M700 244 C 726 244, 726 373, 760 373", flow: true },
    // The duplicate write: primary database to reporting store, on every update.
    { id: "t-db-report", d: "M835 281 V345", flow: true },
  ],
};

// ---------------------------------------------------------------------------
// Task 1 — the six hotspots. Graded content: categories, levers and fix types
// are fixed by the curriculum spec.
// ---------------------------------------------------------------------------
export type FixType = "quick" | "structural";

export const FIX_TYPES: { id: FixType; label: string; hint: string }[] = [
  {
    id: "quick",
    label: "Quick Fix",
    hint: "One team can do it inside its own code this sprint — no new rule, owner or contract needed.",
  },
  {
    id: "structural",
    label: "Structural Fix",
    hint: "Needs a standard, a review criterion or an owner that outlives the change itself.",
  },
];

export type Lever = { id: string; text: string };

export type Hotspot = {
  id: string;
  n: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  /** Where the pin sits on the trace, in plain words — shown on the symptom card. */
  location: string;
  symptom: string;
  correctCategory: CategoryId;
  levers: Lever[];
  correctLever: string;
  /** Directional clue on a wrong category placement — never names the right bin. */
  clue: string;
  correctFixType: FixType;
  material: MaterialSectionId[];
  /** Mentor-only demo justification, used by the auto-fill tool. */
  sampleJustification: string;
  answerKeys: {
    category: AnswerKeyBlock;
    lever: AnswerKeyBlock;
    fixType: AnswerKeyBlock;
  };
};

export const HOTSPOTS: Hotspot[] = [
  {
    id: "h1",
    n: 1,
    title: "Checkout & Dashboard Query Storm",
    location: "App Server ↔ Database",
    symptom:
      "Every time a user opens their dashboard, the application independently queries the database once per item shown — once for the list, then once more per row for its details, status, and owner. A dashboard with 40 items can trigger over 120 separate queries for a single page load.",
    correctCategory: "dataProcessing",
    levers: [
      { id: "h1-a", text: "Batch related lookups into a single query (or a small fixed number of queries) using joins or a data-loader pattern" },
      { id: "h1-b", text: "Add more database read replicas to absorb the load" },
      { id: "h1-c", text: "Cache the dashboard page at the CDN for 24 hours" },
      { id: "h1-d", text: "Move background processing to a queue" },
    ],
    correctLever: "h1-a",
    clue: "This is about how many times the database gets asked, not what's kept in it — look at request pattern, not data at rest.",
    correctFixType: "structural",
    material: ["categories", "sci", "principles"],
    sampleJustification:
      "Collapsing the per-row lookups into one joined query removes roughly 120 round-trips from a single dashboard load, which is the behaviour flagged on the App Server ↔ Database edge.",
    answerKeys: {
      category: {
        prompt: "Hotspot 1 — which category?",
        items: [
          { option: "Data Processing", verdict: "pick", why: "The signature is repetition: the same kind of work performed many more times than the result requires. This is the textbook N+1 pattern named in Section E." },
          { option: "Storage", verdict: "avoid", why: "Nothing here is about what is written or kept. The data already exists and is correct; only the number of requests for it is wrong." },
          { option: "Network Load", verdict: "avoid", why: "Traffic does rise, but between app server and database, as a consequence of the query count. Fix the query pattern and the traffic disappears — so the request pattern is the finding." },
          { option: "Architecture", verdict: "avoid", why: "Defensible if a participant argues the ORM contract caused it — see the teaching note — but nothing here specifies an over-broad response shape. The rows fetched are the right rows, fetched too many times." },
        ],
        teachingNote:
          "A participant may argue Architecture, on the grounds that a data-access convention is an architectural decision. Accept the reasoning but redirect: Section E's test is what would have to change for the finding to disappear. Here it is the loading strategy for an existing, correctly-shaped query — Data Processing. Hotspot 5 is the case where the contract itself is the defect.",
      },
      lever: {
        prompt: "Hotspot 1 — which lever?",
        items: [
          { option: "Batch related lookups into a single query using joins or a data-loader", verdict: "pick", why: "The only option that reduces the work. 121 queries become one or a handful: E falls per transaction, R is unchanged." },
          { option: "Add more database read replicas", verdict: "avoid", why: "Absorbs the symptom by adding hardware — raises M, leaves E per transaction identical. Section C's direction-of-travel rule rules this out." },
          { option: "Cache the dashboard page at the CDN for 24 hours", verdict: "avoid", why: "A per-user, live dashboard is not cacheable at a shared CDN edge, and a 24-hour cache would serve stale data. It also hides the query storm rather than removing it." },
          { option: "Move background processing to a queue", verdict: "avoid", why: "Addresses a different category entirely. Nothing in this finding is a background process — this is synchronous work on a user's page load." },
        ],
      },
      fixType: {
        prompt: "Hotspot 1 — Quick Fix or Structural?",
        items: [
          { option: "Structural Fix", verdict: "pick", why: "Patching this one dashboard leaves every other screen free to repeat the pattern. What is missing is a data-loading standard plus a review criterion that catches N+1 before merge — a rule and an owner, per Section F." },
          { option: "Quick Fix", verdict: "avoid", why: "The single query is genuinely quick to write, which is why participants pick this. But the finding is the pattern, not the one screen: with no standard, it regenerates on the next feature." },
        ],
        teachingNote:
          "This is the most contested fix-type call in the task. The honest answer to \"but I could fix it Friday\" is: yes, for this screen. Ask what stops the same pattern appearing in next quarter's screen — the absence of an answer is what makes it structural.",
      },
    },
  },
  {
    id: "h2",
    n: 2,
    title: "The Nightly Job Nobody Remembers",
    location: "Background Worker",
    symptom:
      "A background job runs across the full user base every night. Nobody currently on the team can say which downstream feature consumes its output, and disabling it in a staging test caused no visible failures.",
    correctCategory: "backgroundProcesses",
    levers: [
      { id: "h2-a", text: "Instrument the job's output consumers before deciding whether to keep, reduce scope, or retire it" },
      { id: "h2-b", text: "Increase the server's CPU allocation so the job finishes faster" },
      { id: "h2-c", text: "Run it twice daily instead of nightly" },
      { id: "h2-d", text: "Rewrite it in a faster language" },
    ],
    correctLever: "h2-a",
    clue: "This is a process actually executing right now, consuming compute — not a policy question. Look at what's running.",
    correctFixType: "quick",
    material: ["categories", "principles", "profession"],
    sampleJustification:
      "Instrumenting who reads the job's output answers the actual open question — whether the nightly full-user-base run has any consumer at all — before any compute is spent on making it faster.",
    answerKeys: {
      category: {
        prompt: "Hotspot 2 — which category?",
        items: [
          { option: "Background Processes", verdict: "pick", why: "A scheduled job running independently of user action, at full frequency whether or not anyone benefits — Section E's definition, exactly." },
          { option: "Management Logic", verdict: "avoid", why: "The most common wrong answer, and a tempting one: poor governance is why it still exists. But Section E's rule is explicit — Management Logic is never the category for something currently executing and consuming compute." },
          { option: "Data Processing", verdict: "avoid", why: "The job's internal efficiency is not the finding. Even a perfectly optimised job is pure waste if nothing consumes its output." },
          { option: "Storage", verdict: "avoid", why: "Nothing in the symptom describes what is written or retained — only that a process runs and nobody can name its consumer." },
        ],
        teachingNote:
          "Use this hotspot to draw the Background Processes / Management Logic line sharply, because Hotspot 6 is the mirror case. Here: something is running. There: nothing is running, a measurement is missing. Both are governance failures in origin; only one is code executing tonight.",
      },
      lever: {
        prompt: "Hotspot 2 — which lever?",
        items: [
          { option: "Instrument the job's output consumers before deciding", verdict: "pick", why: "The open question is whether the work should happen at all. Every other option optimises a job that may not need to exist — you cannot choose between keep, reduce and retire without this evidence." },
          { option: "Increase the server's CPU allocation so it finishes faster", verdict: "avoid", why: "Raises M to make possibly-useless work complete sooner. Faster is not less." },
          { option: "Run it twice daily instead of nightly", verdict: "avoid", why: "Doubles the frequency of work whose value is unproven. If a participant read this as Carbon Awareness scheduling, note that shifting the hour does nothing when the work itself is in question (Section D)." },
          { option: "Rewrite it in a faster language", verdict: "avoid", why: "Large effort, optimises the runtime of a job that may be retired. Classic Section B error: making the same surplus work cheaper rather than removing it." },
        ],
      },
      fixType: {
        prompt: "Hotspot 2 — Quick Fix or Structural?",
        items: [
          { option: "Quick Fix", verdict: "pick", why: "Instrumentation is fast and cheap — logging or tracing who reads the output is days, not quarters. Section F's rule says classify on what the first move costs, and full resolution follows from what the evidence reveals." },
          { option: "Structural Fix", verdict: "avoid", why: "Defensible if you argue the real gap is a job-retirement policy. But the lever chosen here is measurement, and measurement is genuinely quick — which is why it is the right first move." },
        ],
        teachingNote:
          "This is the one hotspot where a cheap first step is the whole recommendation. Contrast it explicitly with Hotspot 1, where the cheap step fixes one instance and leaves the pattern intact. The distinction: here the cheap step produces the decision; there it substitutes for one.",
      },
    },
  },
  {
    id: "h3",
    n: 3,
    title: "The Triple-Send Notification",
    location: "API Gateway ↔ Front-end",
    symptom:
      "When a user completes an action, the same confirmation payload is sent to the client three times through three different channels — a REST response, a WebSocket push, and a polling endpoint the front-end still calls every 5 seconds — all carrying the same information.",
    correctCategory: "networkLoad",
    levers: [
      { id: "h3-a", text: "Pick one channel as the source of truth for this event and remove the redundant paths" },
      { id: "h3-b", text: "Compress the payload before sending" },
      { id: "h3-c", text: "Increase the polling interval to 30 seconds" },
      { id: "h3-d", text: "Add a CDN in front of the API" },
    ],
    correctLever: "h3-a",
    clue: "Nothing here is about what's saved to disk — follow the data as it moves between server and client.",
    correctFixType: "quick",
    material: ["categories", "correctness", "sci"],
    sampleJustification:
      "Keeping the WebSocket push and removing the REST duplicate and the 5-second poll cuts the confirmation payload from three deliveries to one, which is the redundancy flagged on the API Gateway ↔ Front-end edge.",
    answerKeys: {
      category: {
        prompt: "Hotspot 3 — which category?",
        items: [
          { option: "Network Load", verdict: "pick", why: "Follow one piece of information and count how many times it travels — Section E's identification test. The answer here is three." },
          { option: "Storage", verdict: "avoid", why: "Nothing is written to disk. The payload is transient; the redundancy is entirely in transit." },
          { option: "Background Processes", verdict: "avoid", why: "The 5-second poll tempts this read. But the poll is client-initiated in response to user activity and carries the same user-facing event — it is a transport channel, not an independent scheduled job." },
          { option: "Architecture", verdict: "avoid", why: "Arguable, since three channels accreted through unmanaged decisions. But no response shape is over-broad here — the payload itself is correct, it is simply delivered three times." },
        ],
        teachingNote:
          "If a participant argues Background Processes because of the polling endpoint, distinguish frequency from independence: Section E's Background Processes run whether or not anyone benefits. This poll exists to deliver a user's own confirmation — it is the wrong channel, not an orphaned job.",
      },
      lever: {
        prompt: "Hotspot 3 — which lever?",
        items: [
          { option: "Pick one channel as the source of truth and remove the redundant paths", verdict: "pick", why: "The only option that reduces the number of transmissions — three deliveries become one. Everything else leaves all three running." },
          { option: "Compress the payload before sending", verdict: "avoid", why: "Section C's explicit counter-example: compressing an unnecessary response makes the waste cheaper to move, not smaller. Three compressed copies are still three copies." },
          { option: "Increase the polling interval to 30 seconds", verdict: "avoid", why: "Reduces one redundant channel's frequency by a factor of six while leaving the redundancy itself in place. A partial mitigation of a path that should not exist." },
          { option: "Add a CDN in front of the API", verdict: "avoid", why: "A per-user confirmation event is not cacheable at a shared edge. Adds infrastructure — and M — without removing a single duplicate send." },
        ],
      },
      fixType: {
        prompt: "Hotspot 3 — Quick Fix or Structural?",
        items: [
          { option: "Quick Fix", verdict: "pick", why: "Choosing one channel and deleting two code paths is contained work inside one team's codebase, needing no new standard or owner — Section F's Quick Fix test." },
          { option: "Structural Fix", verdict: "avoid", why: "The accretion of three channels does suggest a missing convention. But unlike Hotspot 1's pattern, this is a single identified duplication with a bounded, one-off removal." },
        ],
      },
    },
  },
  {
    id: "h4",
    n: 4,
    title: "The Data That Lives Twice",
    location: "Database ↔ Reporting Store",
    symptom:
      "Customer profile data is written to the primary database and, independently, a full copy is written to a separate reporting store on every update — even though the reporting store is read only once a month for a summary export.",
    correctCategory: "storage",
    levers: [
      { id: "h4-a", text: "Replace the continuous full-copy write with a scheduled, on-demand extract that runs before the monthly export" },
      { id: "h4-b", text: "Add compression to the reporting store" },
      { id: "h4-c", text: "Shard the reporting database" },
      { id: "h4-d", text: "Increase write throughput provisioning" },
    ],
    correctLever: "h4-a",
    clue: "The redundancy here isn't in transit, it's in what gets written and kept — look at persistence, not the pipe.",
    correctFixType: "structural",
    material: ["categories", "sci", "profession"],
    sampleJustification:
      "Replacing the write-on-every-update copy with one extract before the monthly export removes a continuous duplicate write serving a store that is read twelve times a year, which is the behaviour flagged on the Database ↔ Reporting Store edge.",
    answerKeys: {
      category: {
        prompt: "Hotspot 4 — which category?",
        items: [
          { option: "Storage", verdict: "pick", why: "Redundant copies of the same data maintained in parallel systems — the first of Section E's three Storage patterns, with a write frequency wildly out of proportion to read frequency." },
          { option: "Network Load", verdict: "avoid", why: "The strongest wrong answer: the copy does travel between two stores. But the finding is that a second persisted copy exists and is maintained continuously — the transit is a consequence." },
          { option: "Data Processing", verdict: "avoid", why: "No user action triggers disproportionate computation here. The write is a single correct write, simply duplicated into a second system." },
          { option: "Background Processes", verdict: "avoid", why: "The duplicate write is triggered by an update, not by a schedule. Note the irony: the correct fix converts it into a scheduled job — the fix is a background process, the finding is not." },
        ],
        teachingNote:
          "The Storage / Network Load boundary is the one participants most often get wrong across the whole task. The test that settles it: if you stopped the transfer but still kept both copies current some other way, would the finding persist? Yes — so it is what is written and kept, not the pipe.",
      },
      lever: {
        prompt: "Hotspot 4 — which lever?",
        items: [
          { option: "Replace the continuous full-copy write with a scheduled on-demand extract", verdict: "pick", why: "Matches write frequency to read frequency: twelve extracts a year instead of one write per update. Lowers E and reduces storage churn." },
          { option: "Add compression to the reporting store", verdict: "avoid", why: "Makes the unnecessary copy smaller. The copy is still written on every update and still read once a month." },
          { option: "Shard the reporting database", verdict: "avoid", why: "Scales capacity for data that should not be continuously written. Raises M, adds operational complexity, removes nothing." },
          { option: "Increase write throughput provisioning", verdict: "avoid", why: "Pays more to sustain the exact behaviour identified as waste — the clearest instance in the task of absorbing a symptom." },
        ],
      },
      fixType: {
        prompt: "Hotspot 4 — Quick Fix or Structural?",
        items: [
          { option: "Structural Fix", verdict: "pick", why: "Changing when reporting data is materialised alters a data contract other consumers may quietly depend on. It needs an owner for the reporting pipeline and a retention rule — not a one-line change." },
          { option: "Quick Fix", verdict: "avoid", why: "The code change looks small, but anything reading the reporting store between extracts now sees stale data. Identifying and renegotiating those consumers is the actual work." },
        ],
      },
    },
  },
  {
    id: "h5",
    n: 5,
    title: "The Dashboard That Downloads Everything",
    location: "Front-end dashboard",
    symptom:
      "The main dashboard's initial load fetches the full customer record — including fields shown nowhere on that screen — for every customer in the account, before the user has scrolled or filtered anything.",
    correctCategory: "architecture",
    levers: [
      { id: "h5-a", text: "Redesign the API contract to return only the fields the dashboard view actually renders, and paginate/lazy-load the rest" },
      { id: "h5-b", text: "Minify and gzip the JSON response" },
      { id: "h5-c", text: "Increase the front-end's client-side cache duration" },
      { id: "h5-d", text: "Move the dashboard to server-side rendering" },
    ],
    correctLever: "h5-a",
    clue: "The waste starts before the data even leaves the server — look at what was asked for, not how it travels.",
    correctFixType: "structural",
    material: ["categories", "correctness", "sci"],
    sampleJustification:
      "Narrowing the endpoint to the fields the dashboard renders and paginating the rest stops the initial load from fetching every customer's full record before the user has filtered anything.",
    answerKeys: {
      category: {
        prompt: "Hotspot 5 — which category?",
        items: [
          { option: "Architecture", verdict: "pick", why: "The waste was decided before any data moved: someone specified a contract returning more than the use case needs. Section E's exact example — an endpoint returning a full record when the screen shows three fields." },
          { option: "Network Load", verdict: "avoid", why: "The most tempting wrong answer, and where the symptom is visible. But Section E states Architecture is upstream of Network Load: fix the contract and the traffic problem disappears; compress the traffic and the contract still over-fetches." },
          { option: "Data Processing", verdict: "avoid", why: "Closer than it looks — the server does assemble records nobody reads. But the cause is the specified response shape, not a repeated query pattern. Contrast Hotspot 1, where the shape is right and the repetition is wrong." },
          { option: "Storage", verdict: "avoid", why: "Nothing is written or retained. This is a read path only." },
        ],
        teachingNote:
          "Hotspots 1, 3 and 5 together are the whole discrimination exercise: Data Processing (right data, too many times), Network Load (right payload, too many sends), Architecture (wrong payload specified in the first place). If a cohort is struggling, teach these three as a set.",
      },
      lever: {
        prompt: "Hotspot 5 — which lever?",
        items: [
          { option: "Redesign the API contract to return only rendered fields, and paginate the rest", verdict: "pick", why: "Attacks what was asked for. Both halves matter: narrowing fields and bounding the row count. Lowers E on server, network and client at once." },
          { option: "Minify and gzip the JSON response", verdict: "avoid", why: "Section C's counter-example in its purest form: the server still assembles every record, the client still parses them. Transfer size falls, the work does not." },
          { option: "Increase the front-end's client-side cache duration", verdict: "avoid", why: "Caches an over-fetched payload. Cheaper on repeat visits, identical on first load, and now serving stale customer data." },
          { option: "Move the dashboard to server-side rendering", verdict: "avoid", why: "Relocates where the over-fetch happens. Perceived load time may improve while the same surplus records are still assembled — a Section B correct-but-inefficient move." },
        ],
      },
      fixType: {
        prompt: "Hotspot 5 — Quick Fix or Structural?",
        items: [
          { option: "Structural Fix", verdict: "pick", why: "Changing a public API contract affects every consumer and needs a versioning path. More importantly, the missing thing is a standard for who decides what a response contains — without it the next endpoint repeats the pattern." },
          { option: "Quick Fix", verdict: "avoid", why: "Trimming fields on one endpoint is small work, but leaves the contract convention unwritten and any other consumer of that endpoint unconsidered." },
        ],
      },
    },
  },
  {
    id: "h6",
    n: 6,
    title: "How the Team Is Actually Measured",
    location: "Engineering KPIs panel (outside the system)",
    symptom:
      "Sprint reviews at AppNexa track two numbers: features shipped and release velocity. No dashboard, retro template, or performance review currently asks about resource consumption, query counts, or infrastructure cost per feature.",
    correctCategory: "managementLogic",
    levers: [
      { id: "h6-a", text: "Add resource/efficiency indicators (e.g. a lightweight per-release SCI or cost-per-transaction number) as a visible metric alongside velocity — not a replacement for it" },
      { id: "h6-b", text: "Ask developers to informally 'keep efficiency in mind' during code review" },
      { id: "h6-c", text: "Hire a dedicated performance engineer" },
      { id: "h6-d", text: "Add an efficiency chapter to the onboarding handbook" },
    ],
    correctLever: "h6-a",
    clue: "This isn't about a specific query — it's about what leadership chooses to count as success. Look at incentives, not code.",
    correctFixType: "structural",
    material: ["categories", "profession", "sci"],
    sampleJustification:
      "Publishing a per-release cost-per-transaction number next to velocity gives sprint reviews a reason to notice the other five findings, none of which any current AppNexa metric would have surfaced.",
    answerKeys: {
      category: {
        prompt: "Hotspot 6 — which category?",
        items: [
          { option: "Management Logic", verdict: "pick", why: "What the organisation chooses to measure and reward. Nothing is executing — the finding is an absence, and it is why the other five persisted unnoticed." },
          { option: "Data Processing", verdict: "avoid", why: "No query, no computation, no user action. The pin sits deliberately outside the system boundary for this reason." },
          { option: "Architecture", verdict: "avoid", why: "Nothing about component shape or communication. Tempting only if \"architecture\" is stretched to mean organisational design — worth naming as a different discipline, not this category." },
          { option: "Background Processes", verdict: "avoid", why: "The exact inverse of Hotspot 2. There, something runs nightly with no owner. Here, nothing runs at all and no measurement exists." },
        ],
        teachingNote:
          "Ask the cohort which of the six findings would have been caught by AppNexa's existing metrics. The answer is none — that is the point of this hotspot, and the strongest argument for the Root-Cause Reflection that follows.",
      },
      lever: {
        prompt: "Hotspot 6 — which lever?",
        items: [
          { option: "Add efficiency indicators as a visible metric alongside velocity", verdict: "pick", why: "The only option that changes what is counted. Note the deliberate wording — alongside, not instead of: replacing velocity trades one blind spot for another." },
          { option: "Ask developers to informally 'keep efficiency in mind'", verdict: "avoid", why: "Section F's named failure mode: asking people to be more careful inside a structure that never asks the question. Nothing is measured, so nothing changes after the meeting." },
          { option: "Hire a dedicated performance engineer", verdict: "avoid", why: "Makes efficiency one person's job, which removes the incentive for everyone else. Expensive, and it leaves the team's own metrics untouched." },
          { option: "Add an efficiency chapter to the onboarding handbook", verdict: "avoid", why: "Documentation without measurement. Reaches only new joiners, and changes nothing a sprint review looks at." },
        ],
        teachingNote:
          "\"Alongside, not a replacement\" is worth dwelling on. A team measured only on efficiency ships nothing. The recommendation is a second number, not a substituted one — this usually settles the objection that this lever would slow delivery.",
      },
      fixType: {
        prompt: "Hotspot 6 — Quick Fix or Structural?",
        items: [
          { option: "Structural Fix", verdict: "pick", why: "By definition. Changing what a sprint review reports and what a performance conversation asks about requires an owner and a standing agreement — the governance layer, above the GSF catalog entirely." },
          { option: "Quick Fix", verdict: "avoid", why: "Adding a chart to a dashboard is quick; making a number count in a review is not. If nobody is accountable for the number, it is decoration." },
        ],
      },
    },
  },
];

export const hotspotById = (id: string): Hotspot => HOTSPOTS.find((h) => h.id === id)!;

/**
 * Where each hotspot's pin sits on APPNEXA_TRACE. Kept next to the hotspots
 * rather than inside the graph, because the graph is the reusable part and the
 * pins are what Task 1 adds to it.
 */
export const TRACE_PINS: FlowPin[] = [
  { id: "h1", n: 1, x: 730, y: 243, label: "Checkout & Dashboard Query Storm" },
  { id: "h2", n: 2, x: 774, y: 130, label: "The Nightly Job Nobody Remembers" },
  { id: "h3", n: 3, x: 247, y: 224, label: "The Triple-Send Notification" },
  { id: "h4", n: 4, x: 835, y: 313, label: "The Data That Lives Twice" },
  { id: "h5", n: 5, x: 180, y: 204, label: "The Dashboard That Downloads Everything" },
  { id: "h6", n: 6, x: 260, y: 344, label: "How the Team Is Actually Measured" },
];

/**
 * Deterministic shuffle of a hotspot's lever options.
 *
 * Randomised order is required so the correct lever is not always first, but a
 * per-render random shuffle would produce a server/client hydration mismatch in
 * a static export. Seeding on the hotspot id gives a different order per
 * hotspot, stable across renders and reloads — and stable is what lets a mentor
 * refer to "the third option" in front of a cohort.
 */
export function shuffledLevers(hotspot: Hotspot): Lever[] {
  let seed = 0;
  for (let i = 0; i < hotspot.id.length; i++) seed = (seed * 31 + hotspot.id.charCodeAt(i)) >>> 0;
  seed = (seed + hotspot.n * 7919) >>> 0;
  const out = [...hotspot.levers];
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ---------------------------------------------------------------------------
// Task 1 framing, reflection prompt and export contract.
// ---------------------------------------------------------------------------
export const TASK1 = {
  id: "task1",
  tag: "TASK 1",
  title: "AppNexa System Trace",
  framing:
    "AppNexa's platform is stable, but expensive to run — and nobody knows exactly why. Walk through the live system trace below. Click each flagged component to inspect what it's actually doing. For every flagged behavior: (1) sort it into the category it belongs to, (2) choose the improvement lever that best fits, (3) mark it Quick Fix or Structural Fix. Your Diagnosis Report builds itself on the right as you go. You don't need engineering background — every behavior here is observable from outside the code.",
  company: "AppNexa Solutions",
  companyBrief:
    "AppNexa Solutions builds and runs internal and external digital applications for business customers. The platform is functionally stable and users are not complaining. Infrastructure cost has risen steadily for two years, and no systematic efficiency review has ever been carried out.",
  nameField: {
    label: "Your name",
    instruction: "Used to label the exported report — it becomes e.g. \"1-jane-day10-l1task1\".",
    placeholder: "e.g. Jane Muller",
  },
  justificationField: {
    label: "Justification (1–2 sentences)",
    instruction:
      "Reference which of AppNexa's original behaviors this fixes — name the behaviour from the symptom card, not a general principle.",
    placeholder: "e.g. This removes the per-row lookups behind the 120-query dashboard load.",
  },
  reflection: {
    id: "r1-reflection",
    heading: "Root-cause reflection",
    label: "Looking at your six findings — are AppNexa's problems mostly individual code decisions, or structural development logic?",
    instruction: "Two to three sentences. Take a position and say what in your own six findings supports it.",
    placeholder:
      "e.g. Five of my six findings need a standard or an owner rather than a patch, which suggests…",
    sample:
      "Five of my six findings need a rule, a review criterion or an owner rather than a code change, and the sixth only looks cheap because measuring is cheap. That pattern points at development logic rather than individual decisions — no engineer at AppNexa is being careless, they are working inside a process that never asks the efficiency question. The Management Logic finding is the one that explains the other five.",
  },
  export: {
    filenameLevel: 1,
    filenameTask: 1,
    docHeading: "Diagnosis Report",
    buttonLabel: "Export Diagnosis Report",
  },
} as const;
