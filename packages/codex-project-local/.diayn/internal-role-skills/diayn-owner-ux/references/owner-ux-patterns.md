# Owner UX Patterns

## Short Decision

Use a popup if the tool supports it. Otherwise present a compact Markdown choice with two or three concrete options and a short recommendation.

## Long Decision

Do not auto-generate HTML because the decision feels long. Present short options first and tell the Owner they may request `/diayn-html` for a visual aid.

## `/diayn-html`

Support two cases:

- Decision aid: explain choices, effects, risks, recommendation, and copyable quick feedback.
- Report explanation: explain what the agent completed, what remains, risks, what feedback is needed, and next recommendation.

Final decisions must be preserved in Markdown or formal project docs whether HTML is temporary or committed.

Optional deterministic helper:

```text
python .diayn/internal-role-skills/diayn-owner-ux/scripts/diayn_html_generator.py --mode decision --output <path.html> --data <decision.json>
python .diayn/internal-role-skills/diayn-owner-ux/scripts/diayn_html_generator.py --mode report --output <path.html> --data <report.json>
```

The helper formats provided facts only. It does not infer missing decisions or summarize a report by itself. If only raw report text is provided, the page must say which facts still need human or agent interpretation.

## Owner Acceptance

Ask about business-visible outcomes: whether the user can complete the intended action, whether the result looks correct, whether messages make sense, and whether expected records or side effects are visible. Do not ask the Owner to inspect test code, mocks, coverage, or implementation details.

## Optional Upstream Routing

Use `diayn-skill-router` only when Owner-facing wording or decision framing benefits from an upstream method.

| Owner UX context | Consider upstream skills | DIAYN override |
| --- | --- | --- |
| Fuzzy requirement explanation | `idea-refine`, `interview-me`, `spec-driven-development` | The final decision must be recorded in DIAYN Markdown or project docs. |
| Long-lived product or architecture decision | `documentation-and-adrs`, `idea-refine` | `/diayn-html` is user-triggered; do not auto-generate HTML. |
| Release or acceptance summary | `shipping-and-launch`, `documentation-and-adrs` | Owner acceptance remains business-experience focused, not test-implementation focused. |
