import { DIMENSIONS, OPTIONS, TASK2 } from "@/lib/route2";
import type { Route2State } from "./useRoute2";

/**
 * Raw structured answers for grading and QA. Includes the learner's prediction
 * against ground truth per dimension — the prediction gap is the interesting
 * signal in this task, more than which letter was chosen.
 */
export function buildMemoJson(r2: Route2State, filename: string): string {
  const payload = {
    meta: {
      day: 10,
      route: 2,
      level: TASK2.export.filenameLevel,
      task: TASK2.export.filenameTask,
      filename,
      name: r2.name,
      case: TASK2.company,
      exportedAt: new Date().toISOString(),
    },
    options: r2.optionStates.map((s) => ({
      id: s.option.id,
      name: s.option.name,
      stage: s.option.stage,
      situationalAnswer: s.situational,
      situationalText:
        s.option.situational.options.find((x) => x.id === s.situational)?.text ?? null,
      revealed: s.revealed,
      dimensions: DIMENSIONS.map((d) => ({
        key: d.key,
        name: d.name,
        predicted: s.prediction[d.key] ?? null,
        actual: s.option.profile[d.key],
        actualWhy: s.option.dimensionWhy[d.key],
        gap: s.prediction[d.key] ? s.option.profile[d.key] - s.prediction[d.key]! : null,
        higherIsWorse: !!d.inverted,
      })),
      meanAbsoluteGap: (() => {
        const gaps = DIMENSIONS.map((d) =>
          s.prediction[d.key] ? Math.abs(s.option.profile[d.key] - s.prediction[d.key]!) : null,
        ).filter((g): g is number => g !== null);
        return gaps.length ? Number((gaps.reduce((a, b) => a + b, 0) / gaps.length).toFixed(2)) : null;
      })(),
    })),
    recommendation: {
      pick: r2.pick,
      option: r2.pickedOption ? r2.pickedOption.name : null,
      rationale: r2.rationale,
      feasibility: r2.feasibility,
      followUpDecisions: r2.followUp.filter(Boolean),
      risksOfRoadNotTaken: r2.risks.filter(Boolean),
    },
  };
  return JSON.stringify(payload, null, 2);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Standalone, print-ready HTML memo — no external stylesheet. */
export function buildMemoHtml(r2: Route2State): string {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const radarRows = DIMENSIONS.map(
    (d) => `<tr>
      <td>${esc(d.name)}${d.inverted ? ' <span class="warn" title="higher is worse">&#9650;</span>' : ""}</td>
      ${OPTIONS.map(
        (o) =>
          `<td class="num${r2.pick === o.id ? " picked" : ""}">${o.profile[d.key]}</td>`,
      ).join("")}
    </tr>`,
  ).join("");

  const bullets = (items: string[], empty: string) =>
    items.filter(Boolean).length
      ? `<ul>${items.filter(Boolean).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`
      : `<p class="muted">${esc(empty)}</p>`;

  const justification = [r2.rationale, r2.feasibility].filter(Boolean).join(" ");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(TASK2.export.docHeading)} — ${esc(r2.name.trim() || "learner")}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 40px 24px; background: #F5F6F7; color: #16191D;
         font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; font-size: 15px; line-height: 1.6; }
  .sheet { max-width: 860px; margin: 0 auto; background: #fff; border: 1px solid #E2E5E9;
           border-radius: 16px; padding: 40px; }
  .kicker { margin: 0 0 4px; font-size: 11px; letter-spacing: .06em; text-transform: uppercase;
            font-weight: 700; color: #0E7A5A; }
  h1 { margin: 0 0 4px; font-size: 27px; line-height: 1.2; }
  h2 { margin: 32px 0 10px; font-size: 13px; letter-spacing: .06em; text-transform: uppercase;
       color: #5E6670; border-top: 1px solid #E2E5E9; padding-top: 16px; }
  .meta { margin: 0; color: #5E6670; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th { text-align: left; font-size: 11px; letter-spacing: .05em; text-transform: uppercase;
       color: #5E6670; border-bottom: 1px solid #E2E5E9; padding: 8px 10px 8px 0; font-weight: 700; }
  th.num, td.num { text-align: center; width: 56px; padding-right: 0; }
  td { padding: 8px 10px 8px 0; border-bottom: 1px solid #EEF1F3; }
  td.picked { font-weight: 700; color: #0E7A5A; background: #E7F2EC; }
  .warn { color: #B87514; }
  .muted { color: #5E6670; font-size: 12px; }
  .pick { margin-top: 10px; padding: 14px 16px; border: 1px solid #E2E5E9;
          border-left: 3px solid #0E7A5A; border-radius: 10px; background: #E7F2EC; }
  .pick strong { display: block; font-size: 16px; margin-bottom: 4px; }
  ul { margin: 8px 0 0; padding-left: 20px; }
  li { margin-bottom: 6px; }
  footer { margin-top: 32px; border-top: 1px solid #E2E5E9; padding-top: 14px;
           color: #5E6670; font-size: 11px; }
  @media print {
    body { background: #fff; padding: 0; }
    .sheet { border: 0; border-radius: 0; padding: 0; max-width: none; }
    @page { margin: 16mm; }
  }
</style>
</head>
<body>
<div class="sheet">
  <p class="kicker">AION Green IT · Day 10 · Route 2 · Level 2</p>
  <h1>${esc(TASK2.export.docHeading)}</h1>
  <p class="meta">${esc(r2.name.trim() || "learner")} · ${esc(date)} · Case: ${esc(TASK2.company)}</p>

  <h2>Radar summary</h2>
  <table>
    <thead>
      <tr>
        <th>Criterion</th>
        ${OPTIONS.map((o) => `<th class="num">${o.id}</th>`).join("")}
      </tr>
    </thead>
    <tbody>${radarRows}</tbody>
  </table>
  <p class="muted"><span class="warn">&#9650;</span> Higher is worse on this axis. A = ${esc(
    OPTIONS[0].shortName,
  )}, B = ${esc(OPTIONS[1].shortName)}, C = ${esc(OPTIONS[2].shortName)}. All three are shown regardless of which was chosen.</p>

  <h2>Recommendation &amp; justification</h2>
  <div class="pick">
    <strong>${
      r2.pickedOption
        ? `Option ${esc(r2.pickedOption.id)} — ${esc(r2.pickedOption.name)}`
        : "No option committed to."
    }</strong>
    ${justification ? esc(justification) : '<span class="muted">No justification written.</span>'}
  </div>

  <h2>Follow-up decisions</h2>
  ${bullets(r2.followUp, "Not written.")}

  <h2>Risk register</h2>
  <p class="muted">What the roads not taken would have prevented.</p>
  ${bullets(r2.risks, "Not written.")}

  <footer>
    AION Green IT — Day 10, Route 2 (Application). AppNexa Solutions is a fictional case for training use.
    Prepared by the learner named above.
  </footer>
</div>
</body>
</html>`;
}
