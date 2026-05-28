---
name: diayn-owner-ux
description: Use for DIAYN Owner decisions, OwnerGate prompts, business-facing acceptance, and user-triggered /diayn-html decision or report aids; keeps short choices compact, generates HTML only when requested, records final decisions in Markdown, and avoids asking the Owner to understand test code, mocks, coverage, or implementation internals.
---

# DIAYN Owner UX

## Use When

Use this skill when an Owner decision, OwnerGate, Owner business acceptance, or `/diayn-html` flow is needed.

## Required Read Order

1. `docs/meta/owner_decision_ux_protocol.md`
2. `docs/meta/owner_acceptance_protocol.md`
3. `docs/meta/diayn_command_reference.md`
4. `docs/meta/diayn_commands/html.md`
5. `docs/meta/status_model.md`
6. `docs/templates/owner_decision_record_template.md`
7. `docs/templates/owner_decision_html_template.html`
8. `docs/templates/owner_experience_acceptance_template.md`
9. `docs/templates/agent_report_html_explanation_template.html`

Load `references/owner-ux-patterns.md` only when detailed patterns are needed.

## Workflow

1. Decide whether the Owner needs no question, a short decision, long decision, report explanation, or business acceptance.
2. For short decisions, use a popup when available; otherwise use a concise Markdown choice.
3. For long decisions, first present short options and mention `/diayn-html`.
4. Generate HTML only after the user actively requests `/diayn-html`.
5. For `/diayn-html`, choose decision aid or previous report explanation and include copyable quick feedback.
6. Decide whether generated HTML should be committed or temporary by protocol rules; do not push that burden to the Owner.
7. Record final decisions in `decision.md` or formal project docs.
8. For Owner acceptance, describe business-visible actions and outcomes, not internal test implementation.

## Allowed Writes

Write Owner decision records, OwnerGate records, Owner experience acceptance records, generated HTML pages when explicitly requested, and formal docs that preserve final decisions. Do not write implementation code or substitute Owner acceptance for engineering review.

## Stop Conditions

- HTML generation would be next but the user has not requested `/diayn-html`.
- Explaining the decision would require inventing project facts.
- The Owner would need to understand unit tests, integration tests, mocks, coverage, or internal verification details to answer.
- The final decision has not been recorded in Markdown or a formal project doc.

## Expected Output

Keep Owner-facing prompts brief, concrete, and selectable. HTML outputs must explain options, effects, risks, recommendation, and quick feedback. Acceptance outputs must ask whether the business experience works from the user's point of view.
