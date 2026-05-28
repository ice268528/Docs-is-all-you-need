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

## Owner Acceptance

Ask about business-visible outcomes: whether the user can complete the intended action, whether the result looks correct, whether messages make sense, and whether expected records or side effects are visible. Do not ask the Owner to inspect test code, mocks, coverage, or implementation details.
