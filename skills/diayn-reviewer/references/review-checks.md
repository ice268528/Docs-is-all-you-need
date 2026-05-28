# Review Checks

Use this reference to judge one lane candidate.

## Required Inputs

- User-pasted latest worker report.
- Active lane board and handoff.
- Diff for candidate work.
- Evidence and worklog.
- Relevant shared contracts.
- Acceptance criteria.
- Permission and status rules.

## Findings To Check

- Missing worker report.
- Diff does not match the report.
- Evidence is missing, weak, or not reproducible.
- Tests/checks failed or were skipped without explanation.
- Unauthorized paths changed.
- Shared contracts changed silently.
- Work exceeds the task slice.
- Acceptance criteria are not met.

## Decision Rules

- Use `done` only when evidence, scope, diff, and acceptance criteria support it.
- Use `rejected` when rework is required.
- Use `blocked` or `owner_gate` only when the protocol and lane board support that status.
- Never mark `owner_accepted`.
