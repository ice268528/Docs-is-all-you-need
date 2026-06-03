---
name: multi-session-reviewer
description: "Use for DIAYN backend or frontend review workflows. Reviews a pasted worker report together with diff, evidence, tests, acceptance criteria, and permission boundaries, then decides done or rejected without merging or defaulting to code fixes."
---

# Multi-Session Reviewer

## Use When

Use this skill when the user enters `/diayn-review-backend`, `/diayn-review-frontend`, or asks a review session to judge candidate lane work.

## Read First

- `docs/meta/session_identity_protocol.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`
- `docs/meta/agent_execution_workflows.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/review_backend.md` or `docs/meta/diayn_commands/review_frontend.md`
- `docs/templates/review_log_template.md`
- The user-pasted latest worker report.
- The active lane board, handoff, evidence, worklog, review log, diff, and relevant shared docs.

Load references only when needed:

- `references/review-checklist.md`
- `references/rejection-reason-patterns.md`

## Workflow

1. Run the session identity guard and confirm this is a review session for the requested lane.
2. Require the user-pasted latest worker report; absence of that report is a review blocker.
3. Compare the report against the actual diff, lane board, handoff scope, evidence, checks, and acceptance criteria.
4. Check write boundaries and cross-lane/shared contract effects.
5. Decide whether the candidate work is `done` or `rejected`; use `blocked` or `owner_gate` only when the protocol allows it.
6. Write the review log and update the lane board review fields/status within reviewer authority.
7. Report findings first, then the decision and required next action.

## Allowed Writes

Write lane review logs and reviewer-owned lane board review/status fields. Do not modify unrelated lane docs, global Controller plans, Owner acceptance records, or implementation code by default.

## Stop Conditions

- No latest worker report is available.
- Diff, evidence, or acceptance criteria cannot be inspected.
- The candidate changed unauthorized paths or silently changed shared contracts.
- Missing evidence would have to be treated as passing.
- Fixing code, merging branches, or marking `owner_accepted` would be required.

## Output Expectations

Lead with review findings ordered by severity, include file or evidence references, then state `done` or `rejected` and the rework or next command. Never treat `candidate_done` as final completion.
