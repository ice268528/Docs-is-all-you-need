# Controller Sync And Integration Protocol

> This document defines how the Controller imports lane state, handles integration, triages Owner feedback, and keeps future work separate from current scope.

## 1. Controller Responsibilities

The Controller owns:

- Planning lane work.
- Preparing worktree instructions.
- Synchronizing lane state.
- Running integration review after lane review.
- Triage for `/diayn bug` and `/diayn new`.
- Owner-facing summaries and decision prompts.

The Controller should not directly implement lane code by default.

## 2. Sync Inputs

For `/diayn sync`, read:

- Backend lane board, worklog, evidence, handoff, and review log.
- Frontend lane board, worklog, evidence, handoff, and review log.
- Shared contracts.
- `docs/shared/integration_issues.md`
- `.diayn/worktree_manifest.md`
- `.diayn/session_registry.md`
- `.diayn/sync_log.md`
- Global controller summary, if present.

## 3. Sync Rules

- Do not convert `candidate_done` to `done` without review evidence.
- Do not convert `done` to `owner_accepted` without Owner acceptance.
- Do not erase `blocked`, `rejected`, or `owner_gate` work.
- Keep lane details in lane boards.
- Keep global summaries short.
- Record factual evidence and source documents.

Sync result categories:

| Result | Meaning |
| --- | --- |
| `blocked` | Work cannot continue without missing information, evidence, permission, or dependency. |
| `owner_gate` | Human decision or authorization is required. |
| `ready_for_e2e` | Reviewed and integrated work is ready for Owner-level acceptance. |
| `not_ready` | More lane work, review, or integration is required. |

## 4. Integration Inputs

For `/diayn integration`, read:

- Lane review logs for affected work.
- Lane evidence.
- Shared contracts and shared types.
- Integration issue records.
- Build, lint, typecheck, smoke, or E2E evidence defined by the project.
- Relevant diff, branch, or merge-state information.

## 5. Integration Rules

- Integration review happens after lane review has accepted enough work.
- Missing evidence is a finding, not a pass.
- Shared contract mismatches become shared integration issues or lane rework.
- Cross-lane issues must be written where the responsible lane can see them.
- Integration readiness can become `ready_for_e2e`; it does not become `owner_accepted`.

If integration finds a lane issue:

1. Write the issue to `docs/shared/integration_issues.md` if it crosses lanes.
2. Write a rework item to the responsible lane board or handoff.
3. Set the affected status to `todo`, `blocked`, or `rejected`.
4. Summarize the issue in `.diayn/sync_log.md`.

## 6. `/diayn bug` Triage

Use `/diayn bug` when Owner end-to-end business acceptance does not pass.

Triage steps:

1. Restate the expected behavior and actual behavior.
2. Compare the feedback to current scope and acceptance criteria.
3. Decide whether the bug belongs to current scope.
4. If current scope, update Controller docs and synchronize the responsible lane board or handoff.
5. If outside current scope, write it to `<backlog_path>` or `<future_stage_preparation_doc>` and explain why it is not current work.
6. Output the next command the user should run.

Do not hide a current-scope failure as future work.

## 7. `/diayn new` Triage

Use `/diayn new` when the Owner adds a requirement, dependency change, direction change, or priority change.

Triage steps:

1. Restate the new request.
2. Compare it to current goals, constraints, and lane state.
3. Decide whether it should enter current scope or be deferred.
4. If current scope, update Controller docs and synchronize relevant lane boards or handoffs.
5. If deferred, write it to `<backlog_path>` or `<future_stage_preparation_doc>`.
6. Explain the decision and output the next command.

Do not silently expand current scope.

## 8. `/diayn html` Controller Boundary

`/diayn html` is user-triggered.

Use it for:

- Helping the Owner understand a decision.
- Explaining the previous agent report.
- Summarizing what changed, what risks remain, and what feedback the Owner can give.

Do not use it as an automatic destination for long decisions.

Generated HTML is not authority. If it leads to a decision, record the Owner decision in the active Owner question, acceptance record, controller summary, or lane document.

## 9. Required Records

Controller sync and integration commands should write:

- `.diayn/sync_log.md` for sync and integration events.
- `docs/shared/integration_issues.md` for cross-lane issues.
- Responsible lane boards or handoffs for lane-specific rework.
- Owner question or backlog records for unresolved decisions.
- Controller summary for short global state.

## 10. Stop Conditions

Stop and ask the Owner or Controller when:

- Scope ownership is unclear.
- A bug or new request would change project goals, acceptance criteria, shared contracts, dependencies, or architecture.
- Evidence required for a readiness claim is missing.
- Lane documents conflict.
- The next step would require credentials, real external services, destructive actions, release actions, or a merge not already authorized.

