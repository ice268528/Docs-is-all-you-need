#!/usr/bin/env python3
"""Generate Owner-facing DIAYN HTML aids from explicit structured input.

This helper formats provided facts. It does not infer decisions, summarize
reports, or replace the required Markdown decision/acceptance record.
"""

from __future__ import annotations

import argparse
import html
import json
from pathlib import Path
from typing import Any


BASE_CSS = """
:root {
  color-scheme: light;
  --bg: #f7f7f5;
  --panel: #ffffff;
  --text: #1d2329;
  --muted: #5b6670;
  --line: #d8ddd8;
  --accent: #1f6f64;
  --accent-soft: #e4f1ee;
  --warn: #8a5a16;
  --warn-soft: #fff2d8;
  --next: #255a8a;
  --next-soft: #e6f0fa;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.55;
}
main { max-width: 1080px; margin: 0 auto; padding: 32px 20px 48px; }
h1 { margin: 0 0 8px; font-size: 32px; line-height: 1.15; letter-spacing: 0; }
h2 { margin: 26px 0 12px; font-size: 21px; letter-spacing: 0; }
h3 { margin: 0 0 8px; font-size: 17px; letter-spacing: 0; }
p { margin: 0 0 12px; }
ul { margin: 0; padding-left: 20px; }
li { margin: 6px 0; }
table { width: 100%; border-collapse: collapse; background: var(--panel); border: 1px solid var(--line); }
th, td { padding: 10px 12px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
th { background: #eef1ee; }
code, pre { font-family: Consolas, Monaco, monospace; }
pre { white-space: pre-wrap; background: #172026; color: #f4f7f5; padding: 14px; border-radius: 8px; overflow: auto; }
.muted { color: var(--muted); }
.label { display: inline-block; margin-bottom: 8px; padding: 3px 8px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-size: 13px; font-weight: 700; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin: 20px 0; }
.panel, .option { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 16px; }
.recommended { border-color: var(--accent); background: var(--accent-soft); }
.warning { background: var(--warn-soft); border-color: #edc46d; color: var(--warn); }
.next { background: var(--next-soft); border-color: #aac8e6; }
"""


def esc(value: Any) -> str:
    return html.escape(str(value if value is not None else ""), quote=True)


def item_list(values: Any, fallback: str) -> str:
    if isinstance(values, list) and values:
        return "\n".join(f"<li>{esc(value)}</li>" for value in values)
    if isinstance(values, str) and values.strip():
        return f"<li>{esc(values.strip())}</li>"
    return f"<li>{esc(fallback)}</li>"


def load_data(path: str | None) -> dict[str, Any]:
    if not path:
        return {}
    data_path = Path(path)
    with data_path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, dict):
        raise ValueError("--data must point to a JSON object")
    return data


def read_text(path: str | None, direct_text: str | None) -> str:
    if direct_text:
        return direct_text
    if not path:
        return ""
    return Path(path).read_text(encoding="utf-8")


def render_shell(title: str, label: str, body: str) -> str:
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(title)}</title>
  <style>{BASE_CSS}</style>
</head>
<body>
  <main>
    <p class="label">{esc(label)}</p>
    {body}
  </main>
</body>
</html>
"""


def render_decision(data: dict[str, Any], args: argparse.Namespace) -> str:
    decision_id = data.get("decision_id") or args.item_id or "decision-id"
    question = data.get("question") or args.title or "Decision question"
    reason = data.get("reason") or args.summary or "Explain why this decision is needed now."
    recommended = data.get("recommended") or "A"
    options = data.get("options") or [
        {
            "id": "A",
            "title": "Recommended option",
            "owner_impact": "Describe the business or user-facing impact.",
            "delivery_impact": "Describe delivery impact.",
            "risk": "Describe main risk.",
            "future_impact": "Describe future maintenance or extension impact.",
        }
    ]

    option_cards = []
    comparison_rows = []
    for option in options:
        if not isinstance(option, dict):
            continue
        option_id = str(option.get("id") or "").strip() or "?"
        rec_class = " option recommended" if option_id == recommended else " option"
        label = f"{option_id} Recommended" if option_id == recommended else option_id
        option_cards.append(
            f"""<article class="{rec_class.strip()}">
  <span class="label">{esc(label)}</span>
  <h3>{esc(option.get("title") or "Option")}</h3>
  <p><strong>Owner impact:</strong> {esc(option.get("owner_impact") or "Not provided")}</p>
  <p><strong>Delivery impact:</strong> {esc(option.get("delivery_impact") or "Not provided")}</p>
  <p><strong>Risk:</strong> {esc(option.get("risk") or "Not provided")}</p>
  <p><strong>Future impact:</strong> {esc(option.get("future_impact") or "Not provided")}</p>
</article>"""
        )
        comparison_rows.append(
            f"""<tr>
  <td>{esc(option_id)}</td>
  <td>{esc(option.get("best_for") or option.get("owner_impact") or "Not provided")}</td>
  <td>{esc(option.get("tradeoff") or option.get("risk") or "Not provided")}</td>
  <td>{esc(option.get("next_step") or "Record Owner choice in Markdown")}</td>
</tr>"""
        )

    body = f"""
<header>
  <h1>{esc(question)}</h1>
  <p class="muted">{esc(reason)}</p>
</header>
<section class="grid">
  <div class="panel recommended">
    <h2>Recommended</h2>
    <p>{esc(recommended)} because {esc(data.get("recommendation_reason") or "this is the currently recommended option from the provided input")}.</p>
  </div>
  <div class="panel">
    <h2>What Changes</h2>
    <p>{esc(data.get("what_changes") or "Describe what the Owner or users will notice.")}</p>
  </div>
  <div class="panel warning">
    <h2>Main Risk</h2>
    <p>{esc(data.get("main_risk") or "Describe the biggest risk or tradeoff.")}</p>
  </div>
</section>
<section>
  <h2>Options</h2>
  <div class="grid">
    {''.join(option_cards)}
  </div>
</section>
<section>
  <h2>Comparison</h2>
  <table>
    <thead><tr><th>Choice</th><th>Best for</th><th>Tradeoff</th><th>Next step</th></tr></thead>
    <tbody>{''.join(comparison_rows)}</tbody>
  </table>
</section>
<section class="panel">
  <h2>Copy Back To The Agent</h2>
  <pre>Owner decision feedback
Decision ID: {esc(decision_id)}
Selected option: &lt;A/B/C&gt;
Notes: &lt;short Owner note&gt;</pre>
</section>
<section class="panel">
  <h2>Record Keeping</h2>
  <p>This HTML page is an aid. The final decision must be recorded in <code>decision.md</code> or the appropriate project document.</p>
  <p>Commit this HTML only when it documents long-term product, architecture, process, cost, risk, contract, security, deployment, or maintenance value.</p>
</section>
"""
    return render_shell(question, "DIAYN Owner Decision Aid", body)


def render_report(data: dict[str, Any], args: argparse.Namespace, source_text: str) -> str:
    report_id = data.get("report_id") or args.item_id or "report-source"
    title = data.get("title") or args.title or "Agent report explanation"
    why = data.get("why_it_matters") or args.summary or "Explain why this report matters to the Owner."
    checks = data.get("checks")
    if not isinstance(checks, list) or not checks:
        checks = [{"area": "Provided source", "summary": "No structured checks were provided.", "evidence": args.source or "n/a"}]

    check_rows = []
    for check in checks:
        if not isinstance(check, dict):
            continue
        check_rows.append(
            f"""<tr>
  <td>{esc(check.get("area") or "Area")}</td>
  <td>{esc(check.get("summary") or "Not provided")}</td>
  <td>{esc(check.get("evidence") or "n/a")}</td>
</tr>"""
        )

    source_section = ""
    if source_text:
        source_section = f"""
<section class="panel">
  <h2>Provided Source</h2>
  <p class="muted">This helper formats provided content; it does not infer missing facts from the report.</p>
  <pre>{esc(source_text[:8000])}</pre>
</section>
"""

    body = f"""
<header>
  <h1>{esc(title)}</h1>
  <p>{esc(why)}</p>
</header>
<section class="grid">
  <article class="panel recommended">
    <h2>Completed</h2>
    <ul>{item_list(data.get("completed"), "Not provided")}</ul>
  </article>
  <article class="panel">
    <h2>Not Completed</h2>
    <ul>{item_list(data.get("not_completed"), "Not provided")}</ul>
  </article>
  <article class="panel warning">
    <h2>Risks</h2>
    <ul>{item_list(data.get("risks"), "Not provided")}</ul>
  </article>
  <article class="panel next">
    <h2>Next Step</h2>
    <p>{esc(data.get("next_step") or "Ask the agent for the next safe DIAYN command or missing evidence.")}</p>
  </article>
</section>
<section class="panel">
  <h2>What The Agent Checked</h2>
  <table>
    <thead><tr><th>Area</th><th>Owner-readable summary</th><th>Evidence source</th></tr></thead>
    <tbody>{''.join(check_rows)}</tbody>
  </table>
</section>
<section class="panel">
  <h2>What The Owner Should Review</h2>
  <ul>{item_list(data.get("owner_review"), "Review the business-visible behavior or ask a follow-up question.")}</ul>
</section>
{source_section}
<section class="panel">
  <h2>Copy Back To The Agent</h2>
  <pre>Owner report feedback
Report: {esc(report_id)}
Decision: understood | request_rework | ask_question | accept_for_e2e
Notes: &lt;short Owner note&gt;
Observed issue, if any: &lt;user-visible issue&gt;</pre>
  <p class="muted">If business acceptance failed, use <code>/diayn-bug</code>. If this is new scope, use <code>/diayn-new</code>.</p>
</section>
<section class="panel">
  <h2>Record Keeping</h2>
  <p>This page explains an agent report. Keep it temporary for one-time explanations. Commit it only when it documents a long-lived decision, major risk, acceptance outcome, or process explanation that future sessions should read.</p>
  <p>Any final decision or acceptance result must still be recorded in Markdown or a formal project document.</p>
</section>
"""
    return render_shell(title, "DIAYN Agent Report Explanation", body)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Generate DIAYN Owner-facing HTML aids.")
    parser.add_argument("--mode", choices=["decision", "report"], required=True)
    parser.add_argument("--output", required=True, help="Local HTML output path.")
    parser.add_argument("--data", help="Optional UTF-8 JSON file with structured decision/report facts.")
    parser.add_argument("--source", help="Optional UTF-8 text or Markdown source file for report mode.")
    parser.add_argument("--source-text", help="Optional inline source text for report mode.")
    parser.add_argument("--title", help="Fallback page title.")
    parser.add_argument("--summary", help="Fallback short explanation.")
    parser.add_argument("--item-id", help="Decision ID or report ID for quick feedback.")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    data = load_data(args.data)
    source_text = read_text(args.source, args.source_text)
    if args.mode == "decision":
        output = render_decision(data, args)
    else:
        output = render_report(data, args, source_text)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(output, encoding="utf-8", newline="\n")
    print(
        json.dumps(
            {
                "result": "pass",
                "mode": args.mode,
                "output": str(output_path),
                "record_keeping": "Final decisions or acceptance outcomes must be recorded in Markdown or formal project docs.",
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
