# Controller Integration Review Checklist

Use this before marking anything `ready_for_e2e`.

## Lane Review Gate

- Backend or equivalent lane task is reviewed `done`, not merely `candidate_done`.
- Frontend or equivalent lane task is reviewed `done`, not merely `candidate_done`.
- Any skipped lane has an explicit not-applicable reason.

## Evidence Gate

- Lane evidence exists and matches the claimed task.
- Review log explains why the evidence is sufficient.
- Missing evidence is recorded as a blocker, not treated as passing.

## Shared Contract Gate

- Shared contract or API expectations are consistent across lane docs.
- Any disagreement is written to shared integration issues or the responsible lane board.
- No lane silently changed a shared contract outside authorization.

## Owner Gate

- Business-facing acceptance criteria exist.
- Owner decisions that affect integration are resolved or explicitly blocked.
- `ready_for_e2e` is not used when Owner acceptance is still undefined.
