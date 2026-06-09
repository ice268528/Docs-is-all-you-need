# Agent Execution Workflows

> This document defines execution workflow boundaries for Docs-is-all-you-need. It preserves Stage / Batch / Task, OwnerGate, evidence, worklog, handoff, and clean-state discipline while adding multi-session lane and review flow.

## 1. Two-Layer Start Model

Every session starts with two separate layers:

| Layer | Purpose | Output |
| --- | --- | --- |
| Cold start | Understand the project and current work. | Short answers to the five project-level questions. |
| DIAYN execution preflight | Confirm whether this session is allowed to act. | Role, lane, worktree, permission, stop condition, and reporting check. |

Do not merge these into one large checklist. Cold start answers what the system is; execution preflight decides whether the current `/diayn-*` workflow may proceed.

## 2. Cold Start Questions

A fresh session should first answer:

1. What system is this?
2. How is it organized?
3. How do I run it?
4. How do I verify it?
5. Where is the work now?

Primary sources:

| Question | Typical source |
| --- | --- |
| What system is this? | `README.md`, `docs/project/project_brief.md` |
| How is it organized? | `AGENTS.md`, `docs/project/file_index.md`, `docs/lanes/**`, `docs/shared/**` |
| How do I run it? | Entry files, project tool files, project docs |
| How do I verify it? | `docs/testing/test_strategy.md`, lane evidence, Owner acceptance docs |
| Where is the work now? | `TODO.md`, lane boards, handoffs, review logs |

Cold start is lightweight. Do not print a long checklist unless useful. If missing information affects scope, authorization, verification, identity, or acceptance, stop and ask.

## 3. DIAYN Execution Preflight

Before implementation, review, integration, testing, or document maintenance, the active session should:

- Read the current entry file, such as `AGENTS.md` or `CLAUDE.md`.
- Read the smallest necessary set of project, stage, lane, permission, and workflow documents.
- Confirm its session role and lane when working in a role-specific flow.
- Confirm the current task, success criteria, verification method, and writable files.
- Confirm the task does not cross role, lane, or OwnerGate boundaries.
- Record factual evidence rather than relying on completion claims.

If a `/diayn-*` workflow is used, perform the Session Identity Guard check described in `docs/meta/session_identity_protocol.md` before role-specific work begins.

## 4. Work Units

- **Stage**: A project phase with scope, non-scope, deliverables, and acceptance criteria.
- **Batch**: A group of tasks explicitly authorized for continuous work.
- **Lane**: A parallel work stream such as `<lane> = backend` or `<lane> = frontend`.
- **Task**: A concrete unit of work with a verification method and evidence expectation.
- **OwnerGate**: A required stop for human decision, authorization, or clarification.

Templates are not active work units until they are instantiated into project, stage, lane, handoff, or acceptance documents.

## 5. Lane-Level WIP

WIP=1 applies inside each lane.

- A lane should have at most one `doing` item.
- Backend and frontend lanes may progress in parallel when contracts and handoffs allow it.
- A worker may not start another lane item while its current item remains `doing`.
- If a lane has multiple `doing` items, reconcile the lane board before implementing more work.
- The global `TODO.md` summarizes controller state; it is not every lane's detailed workspace.
- `docs/lanes/<lane>/board.md`, `handoff.md`, `evidence.md`, and `review_log.md` are stable lane-entry indexes.
- Detailed worklogs, detailed evidence, and detailed review notes live under `docs/lanes/<lane>/stages/<stage-id>/`.
- Stage-level outcomes and closeout artifacts live under `docs/stages/<stage-id>/`.

## 6. Controller Workflow

The Controller Session:

1. Reads project facts, stage goals, global TODO, shared contracts, and lane state.
2. Clarifies missing facts or OwnerGate decisions.
3. Plans stage / batch / lane work.
4. Ensures required documents are visible to the target sessions.
5. Dispatches lane work through lane boards and handoff documents.
6. Synchronizes lane status back to global summaries.
7. Performs integration review only after lane review has produced sufficient evidence.

The Controller should not directly implement lane code by default. It should not mark `owner_accepted`.

## 7. Worker Lane Workflow

Backend and Frontend Sessions:

1. Confirm role and lane identity.
2. Read their own lane board, handoff, current stage detail files, relevant shared contracts, stage goal, and verification requirements.
3. Implement only authorized lane tasks.
4. Update same-lane evidence, worklog, handoff notes, and board state. Keep detailed worklog and evidence in the current stage subdirectory, not in a single unbounded lane root file.
5. Run or document verification.
6. Mark completed lane work at most as `candidate_done`.
7. Stop if the task requires another lane, global summary, shared contract, architecture, scope, or Owner decision changes.

Worker sessions do not mark `done`, `rejected`, `ready_for_e2e`, or `owner_accepted`.

## 8. Review Workflow

Backend and Frontend Review Sessions:

1. Confirm review role and target lane.
2. Read the target lane board, current stage evidence, current stage worklog, handoff, diff, tests, and acceptance criteria.
3. Check functional outcome, verification evidence, permission boundaries, and unauthorized changes.
4. Write review log.
5. Mark candidate work as `done` or `rejected`.

Review sessions do not implement fixes by default. If a fix is needed, write a rejection reason or rework item and stop.

## 9. Integration Workflow

Controller Integration Review:

1. Reads lane review logs and reviewed lane state.
2. Checks shared contract consistency and merge readiness.
3. Checks defined build, lint, typecheck, smoke, or E2E evidence.
4. Writes cross-lane issues to the responsible lane board or shared integration issue document.
5. Writes stage-scoped integration summaries and closeout notes when the project uses them.
6. Marks `ready_for_e2e` only when reviewed work is integrated enough for Owner-level acceptance.

Integration review must not bypass lane review or treat missing evidence as passing.

## 10. Owner Acceptance Workflow

Owner Acceptance:

1. Receives a business-facing summary of what changed.
2. Receives engineering verification and known limitation summaries.
3. Reviews the experience, outcome, or decision options at the appropriate level of detail.
4. Confirms acceptance or requests changes.

`owner_accepted` is distinct from `done`. `done` is a review result; `owner_accepted` is a human acceptance result.

## 11. Single-Session Compatibility

A single coding-agent session may still use this scaffold. In that case:

- Treat the session as a combined Controller plus lane worker only when the Owner explicitly authorizes that scope.
- Preserve lane-level WIP and evidence discipline.
- Use `candidate_done` for self-verified work unless an independent review step exists.
- Do not collapse Owner Acceptance into self-verification.

## 12. OwnerGate

Stop and ask the Owner when the next step would:

1. Change project goals, non-goals, stage scope, acceptance criteria, or long-term constraints.
2. Change shared contracts, schemas, APIs, architecture, security posture, provider choice, deployment behavior, or cost-bearing services.
3. Cross role or lane write boundaries.
4. Use credentials, secrets, real external services, destructive actions, release actions, migrations, or irreversible operations.
5. Resolve conflicting documents by silently choosing one interpretation.
6. Require a product, user experience, legal, compliance, privacy, or business judgement.
7. Treat missing verification as success.
8. Decide whether a requirement, bug, or report enters the active stage.

Suggested OwnerGate format:

```md
## OwnerGate Request

- Trigger:
- Affected scope:
- Why the session cannot continue safely:
- Options:
  - A:
  - B:
  - C:
- Recommended default:
- Explicit reply needed:
```

## 13. Automatic Follow-On Actions

Only continue automatically when the current role and authorized task allow it.

Examples:

- Controller may update global summaries after reading lane state.
- Worker may update same-lane evidence, worklog, handoff notes, and board status for the active task.
- Review session may update review log and target lane review status.
- Controller Integration Review may write integration issues after reviewed lane work is available.

If the follow-on action would cross role boundaries, stop.

## 14. Completion Claims

Do not claim a stronger status than the evidence supports.

- Use `candidate_done` for worker self-verified work.
- Use `done` only after independent review accepts the work.
- Use `ready_for_e2e` only after integration readiness is established.
- Use `owner_accepted` only after Owner acceptance.
- Use `blocked` or `owner_gate` when progress depends on a missing fact, permission, environment, or human decision.

## 15. Clean State

At the end of meaningful work, report or record:

- What changed.
- Which files were touched.
- Which verification was run or not run.
- Which evidence was updated.
- Which board or status was updated.
- Whether any OwnerGate, blocker, or review item remains.
- Whether the session stayed inside its role and lane permissions.
