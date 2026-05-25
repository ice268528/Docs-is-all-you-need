# Owner Decision UX Protocol

> This document defines how agents ask the Owner for decisions without turning every question into a long technical essay.

Use this with:

- `docs/meta/agent_execution_workflows.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/controller_sync_integration_protocol.md`
- `docs/meta/owner_acceptance_protocol.md`
- `docs/templates/owner_decision_record_template.md`
- `docs/templates/owner_decision_html_template.html`

## 1. Purpose

OwnerGate decides when the agent must stop and ask the Owner.

Owner Decision UX decides how to ask:

- Short decisions should be quick.
- Long decisions should start short.
- HTML decision aids are user-triggered through `/diayn html`.
- Final decisions must be recorded in Markdown or formal project documents.

## 2. Decision Categories

| Category | Meaning | Default handling |
| --- | --- | --- |
| No question needed | Small implementation detail inside confirmed scope and permissions. | Agent proceeds and records evidence if relevant. |
| Short decision | 2-3 clear options; each option can be understood in one sentence. | Use a decision popup when available; otherwise use a short Markdown choice. |
| Long decision | A choice affects architecture, cost, risk, schedule, maintenance, shared contracts, user experience, or long-term direction. | Start with short options and offer `/diayn html`; generate HTML only after the user asks. |

Do not use long explanations as the default OwnerGate format.

## 3. Short Decision Rule

If the current tool supports a decision popup, use it first.

If no popup is available, use a short Markdown choice:

```md
## Owner Decision Needed

Question: <one sentence>

Options:
- A (recommended): <short concrete outcome and tradeoff>
- B: <short concrete outcome and tradeoff>
- C: <short concrete outcome and tradeoff, optional>

Reply with: A, B, or C.
```

Rules:

- Use 2-3 mutually exclusive options.
- Put the recommended option first.
- Each option must be short, concrete, and selectable.
- Do not ask the Owner to evaluate test internals, implementation details, or raw logs.
- If more context would help, include this option or note:

```text
You can run /diayn html to generate a visual decision aid.
```

After the Owner chooses, record the result in a decision record or the appropriate formal project document.

## 4. Long Decision Rule

Long decisions still start with a short prompt.

Use this shape:

```md
## Owner Decision Needed

Question: <one sentence>

Recommended: A, because <one short reason>.

Options:
- A (recommended): <short outcome>
- B: <short outcome>
- C: <short outcome, optional>

For a visual explanation, run:
/diayn html
```

The agent must not generate HTML just because the topic feels long or complex. HTML is generated only after the user explicitly runs `/diayn html` or otherwise asks for the HTML decision aid.

## 5. `/diayn html` Decision Aid

When the user triggers `/diayn html` for a decision, the HTML page should be written for a non-technical Owner.

It should explain:

- What must be decided.
- Why the decision is needed now.
- Options A / B / C.
- Business or user experience impact.
- Development effort impact.
- Risks.
- Future maintenance or extension impact.
- Recommended option.
- What happens next if the recommendation is chosen.
- A quick feedback format the Owner can copy back into the agent.

The HTML should not become the decision authority. It is an explanation aid.

## 6. `/diayn html` Report Explanation

The user may also provide the previous agent report to `/diayn html`.

In that case, the HTML should explain:

- What was completed.
- What was not completed.
- What is waiting for review.
- What risks remain.
- What the Owner should decide or test.
- What command or feedback to give next.

Avoid dumping:

- Raw test output.
- Internal implementation details.
- Long code explanations.
- Unit test, integration test, mock, coverage, or framework details that the Owner did not ask for.

## 7. HTML Repository Rule

The agent decides whether the HTML file should be committed or kept temporary. Do not make the Owner carry that judgement.

Prefer committing the HTML when it explains a long-lived decision:

- Architecture.
- Product direction.
- Shared contract or API.
- Data model.
- Security or permission behavior.
- Cost, deployment, provider, or operational behavior.
- Long-term process or maintenance policy.
- Major OwnerGate decision.

Prefer not committing the HTML when it is temporary:

- Small copy or label choice.
- Minor visual preference.
- One-time explanation of a small report.
- A preference that does not affect later implementation or maintenance.

Regardless of whether HTML is committed, the final choice and rationale must be written to `decision.md` or the appropriate formal project document.

If the agent cannot decide whether the HTML should be preserved, ask one short question:

```text
Will this decision affect later stages or long-term maintenance, and should the visual explanation be preserved?
```

## 8. Decision Record Requirements

Use `docs/templates/owner_decision_record_template.md`.

The record should include:

- Decision question.
- Options.
- Owner selection.
- Rationale.
- Whether an HTML aid was generated.
- Whether the HTML aid is committed or temporary.
- Files or docs updated after the decision.
- Follow-up tasks, lane updates, or OwnerGate resolution.

## 9. Boundaries

Do not:

- Create real project-specific decision pages in the generic scaffold.
- Assume the Owner can judge implementation internals.
- Treat HTML as a substitute for formal Markdown records.
- Auto-generate HTML for every long OwnerGate.
- Use a concrete project name, technology stack, feature, provider, or business workflow in core templates.
