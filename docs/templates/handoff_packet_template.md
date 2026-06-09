# Handoff Packet Template

> Copy this template to the receiving lane or handoff location before dispatch. The copied file becomes an active handoff packet.

## Visibility Rule

Invisible documents cannot be used as task dispatch authority.

Every required document listed in this packet must be visible from the receiving session's working directory or worktree before work starts.

## Receiving Session

| Field | Value |
| --- | --- |
| Role | `<Controller Session / Backend Session / Frontend Session / Review Session>` |
| Lane | `<lane>` |
| Expected worktree path | `../worktrees/<project_slug>/<lane>` |
| Current stage | `<stage_id>` |
| Current batch | `<batch_id>` |
| Dispatching Controller | `<controller_session_id>` |

## Required Documents

| Path | Why required | Visibility checked? |
| --- | --- | --- |
| `AGENTS.md` or `CLAUDE.md` | Entry rules | `<yes/no>` |
| `docs/meta/session_roles.md` | Role boundary | `<yes/no>` |
| `docs/meta/status_model.md` | Status authority | `<yes/no>` |
| `docs/lanes/<lane>/board.md` | Lane task state | `<yes/no>` |
| `<contract_path>` | Shared contract | `<yes/no/not-applicable>` |

## Task Scope

- Objective: `<objective>`
- In scope: `<in-scope items>`
- Out of scope: `<out-of-scope items>`
- Allowed paths: `<authorized paths>`
- Forbidden paths: `<forbidden paths>`
- Acceptance criteria: `<criteria>`
- Current stage detail dir: `docs/lanes/<lane>/stages/<stage-id>/`

## Evidence Requirements

| Evidence | Required? | Destination |
| --- | --- | --- |
| Verification command output | `<yes/no>` | `docs/lanes/<lane>/stages/<stage-id>/evidence.md` |
| Manual verification notes | `<yes/no>` | `<path>` |
| Screenshots or artifacts | `<yes/no>` | `<path>` |
| Known limitation notes | `<yes/no>` | `docs/lanes/<lane>/handoff.md` or the current stage detail dir |

## Stop Conditions

Stop and ask Controller or Owner if:

- Any required document is not visible.
- The task requires another lane's files or documents.
- The task requires shared contract, schema, API, architecture, stage scope, or acceptance criteria changes.
- Verification requires credentials, real external calls, destructive actions, release actions, or Owner judgement.
- Session identity does not match the declared role, lane, or worktree.

## Completion Expectation

Worker sessions may mark at most `candidate_done`. Review sessions decide `done` or `rejected`. Owner Acceptance decides `owner_accepted`.
