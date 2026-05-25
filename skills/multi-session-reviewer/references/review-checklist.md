# Review Checklist

Use this to judge one lane candidate.

## Inputs

- User-pasted latest worker report.
- Active lane board and handoff.
- Diff for the candidate work.
- Evidence and worklog.
- Relevant shared contracts.
- Acceptance criteria.
- Permission and status rules.

## Findings

Check for:

- Missing worker report.
- Diff not matching the report.
- Missing or weak evidence.
- Failed or absent tests/checks without explanation.
- Unauthorized path changes.
- Silent shared contract changes.
- Work outside the task slice.
- Acceptance criteria not met.

## Decision

- Use `done` only when evidence, scope, diff, and acceptance criteria support it.
- Use `rejected` when rework is required.
- Use `blocked` or `owner_gate` only when the protocol and lane board support that status.

Do not mark `owner_accepted`.
