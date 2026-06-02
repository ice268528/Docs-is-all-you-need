---
name: diayn-reviewer
description: Use for DIAYN lane review triggered by /diayn-review-backend or /diayn-review-frontend; checks the user-pasted worker report against diff, evidence, tests or acceptance checks, lane permissions, and task scope, then decides done or rejected without merging or defaulting to code fixes.
---

# DIAYN Reviewer

## Use When

Use this skill when the user asks a review session to judge candidate backend or frontend lane work.

## Required Read Order

1. `AGENTS.md`
2. `docs/meta/session_identity_protocol.md`
3. `docs/meta/session_roles.md`
4. `docs/meta/status_model.md`
5. `docs/meta/agent_doc_permissions.md`
6. `docs/meta/agent_execution_workflows.md`
7. `docs/meta/diayn_command_reference.md`
8. `docs/meta/diayn_commands/review_backend.md` or `docs/meta/diayn_commands/review_frontend.md`
9. User-pasted latest worker report
10. Active lane board, handoff, evidence, worklog, review log, diff, and relevant shared docs

Load `references/review-checks.md` only when detailed review criteria are needed.

## Workflow

1. Run DIAYN Identity Guard first.
2. Confirm this is a review session for the requested lane.
3. Require the latest worker report pasted by the user; absence is a blocker.
4. Compare the report with actual diff, lane scope, evidence, checks, and acceptance criteria.
5. Check write boundaries and shared-contract effects.
6. Decide `done` or `rejected`; use `blocked` or `owner_gate` only when protocol allows.
7. Write reviewer-owned review log and lane board review fields.
8. Report findings first, then the decision and next action.

## Allowed Writes

Write lane review logs and reviewer-owned lane board review/status fields. Do not edit implementation code, unrelated lane docs, global Controller plans, merge state, or Owner acceptance records by default.

## Stop Conditions

- Latest worker report is missing.
- Diff, evidence, tests/checks, or acceptance criteria cannot be inspected.
- Candidate work changed unauthorized paths or silently changed shared contracts.
- Missing evidence would have to be treated as passing.
- The next step would fix code, merge, or mark `owner_accepted`.

## Expected Output

Lead with findings ordered by severity and supported by file/evidence references. Then state `done` or `rejected`, rework routing if needed, and the next safe command.
