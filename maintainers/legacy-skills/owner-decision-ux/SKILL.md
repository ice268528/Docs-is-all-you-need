---
name: owner-decision-ux
description: "Use for DIAYN Owner decisions, OwnerGate prompts, business-facing acceptance, and user-triggered HTML decision or report aids. Handles short decisions with popup or concise Markdown fallback, long decisions with user-triggered HTML only, report-explanation HTML, archive decisions, and Owner acceptance that avoids requiring test-code knowledge."
---

# Owner Decision UX

## Use When

Use this skill when an Owner decision, OwnerGate, Owner business acceptance, or `/diayn-html` flow is needed.

## Read First

- `docs/meta/owner_decision_ux_protocol.md`
- `docs/meta/owner_acceptance_protocol.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/html.md`
- `docs/meta/status_model.md`
- `docs/templates/owner_decision_record_template.md`
- `docs/templates/owner_decision_html_template.html`
- `docs/templates/owner_experience_acceptance_template.md`
- `docs/templates/agent_report_html_explanation_template.html`

Load references only when needed:

- `references/short-decision-patterns.md`
- `references/html-decision-page-patterns.md`
- `references/html-report-explanation-patterns.md`
- `references/owner-acceptance-patterns.md`

## Workflow

1. Decide whether the Owner needs no question, a short decision, a long decision, report explanation, or business acceptance.
2. For short decisions, use a popup when the tool supports it; otherwise use a concise Markdown choice with short, concrete options.
3. For long decisions, first present a short recommendation and options, plus a visible note that the Owner may run `/diayn-html`.
4. Generate HTML only after the user actively runs `/diayn-html`.
5. For `/diayn-html`, choose either decision aid or previous agent report explanation, then include copyable quick feedback.
6. Decide whether generated HTML should be committed or treated as temporary using the protocol; do not push that burden to the Owner.
7. Record final decisions in `decision.md` or the appropriate formal project document regardless of HTML handling.
8. For Owner acceptance, describe business-visible actions and expected outcomes, not internal test code.

## Allowed Writes

Write Owner decision records, OwnerGate records, Owner experience acceptance records, generated HTML pages when explicitly requested, and the formal docs that must preserve the final decision. Do not write implementation code or substitute Owner acceptance for engineering review.

## Stop Conditions

- The user has not requested `/diayn-html` but HTML generation would be the next step.
- The decision cannot be explained without inventing project facts.
- The Owner would need to understand unit tests, integration tests, mocks, coverage, or internal verification details to answer.
- The final decision has not been recorded in Markdown or a formal project doc.

## Output Expectations

Keep Owner-facing prompts brief, concrete, and selectable. HTML outputs must help a non-technical Owner understand options, effects, risks, recommendation, and quick feedback. Acceptance outputs must ask whether the business experience works from the user's point of view.
