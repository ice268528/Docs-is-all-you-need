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

## Optional Upstream Routing

Use `diayn-skill-router` only after the user-pasted worker report, diff, lane board, handoff, evidence, and acceptance criteria are available.

| Review context | Consider upstream skills | DIAYN override |
| --- | --- | --- |
| General code review | `code-review-and-quality`, `doubt-driven-development` | Reviewer must still check scope, status authority, lane permissions, and evidence. |
| Security-sensitive change | `security-and-hardening`, `doubt-driven-development` | Security approval cannot bypass missing evidence or OwnerGate. |
| Browser-facing frontend review | `browser-testing-with-devtools`, `frontend-ui-engineering` | If browser tooling is unavailable, record the evidence gap instead of passing. |
| Debug or regression review | `debugging-and-error-recovery`, `test-driven-development` | Reviewer decides `done` or `rejected`; reviewer does not silently fix code by default. |

Do not treat upstream "quality looks good" guidance as DIAYN completion unless all DIAYN review inputs support the decision.
