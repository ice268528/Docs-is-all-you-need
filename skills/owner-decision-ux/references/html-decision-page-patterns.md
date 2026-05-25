# HTML Decision Page Patterns

Generate a decision aid only after the user runs `/diayn html`.

## Page Must Explain

- The decision in plain language.
- Options and what changes for the Owner or future work.
- Benefits, risks, cost, schedule, or maintenance impact when relevant.
- The recommended option and why.
- Known unknowns.
- A quick feedback block the Owner can copy back.

## Quick Feedback Shape

```text
Decision feedback:
- Choice: <A/B/C or custom>
- Reason: <optional>
- Changes requested: <optional>
- Questions: <optional>
```

## Archive Rule

The agent decides whether HTML is committed:

- Commit when the decision has long-lived architectural, product, process, cost, contract, security, or acceptance value.
- Treat as temporary when it only explains a small short-lived choice.

Either way, the final decision must be recorded in Markdown or a formal project document.
