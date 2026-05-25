# Lane Board Template

> Copy this template to `docs/lanes/<lane>/board.md`. The copied file becomes an active lane board.

## Lane Metadata

| Field | Value |
| --- | --- |
| Lane | `<lane>` |
| Current stage | `<stage_id>` |
| Current batch | `<batch_id>` |
| WIP limit | 1 active `doing` item in this lane |
| Handoff | `docs/lanes/<lane>/handoff.md` |
| Evidence | `docs/lanes/<lane>/evidence.md` |
| Worklog | `docs/lanes/<lane>/worklog.md` |
| Review log | `docs/lanes/<lane>/review_log.md` |

## Authorized Modification Scope

| Area | Permission | Notes |
| --- | --- | --- |
| Lane documents | Role-local write | Board, worklog, evidence, handoff notes |
| Lane implementation | Authorized only by task | Stay inside task paths |
| Shared contracts | Stop first | Requires Controller or Owner authorization |
| Other lanes | Forbidden by default | Ask Controller |
| Global `TODO.md` | Controller-only by default | Worker should not update |

## Required Reading

| Path | Purpose | Visible to session? |
| --- | --- | --- |
| `AGENTS.md` or `CLAUDE.md` | Entry rules | `<yes/no>` |
| `docs/meta/session_roles.md` | Role authority | `<yes/no>` |
| `docs/meta/status_model.md` | Status authority | `<yes/no>` |
| `docs/lanes/<lane>/handoff.md` | Task dispatch | `<yes/no>` |
| `<contract_path>` | Shared contract | `<yes/no/not-applicable>` |

## Tasks

| ID | Status | Task | Authorized paths | Acceptance criteria | Verification | Evidence | Review |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<task_id>` | `todo` | `<task summary>` | `<paths>` | `<criteria>` | `<verification_command>` | `<evidence link>` | `<review link>` |

Allowed statuses: `todo`, `doing`, `candidate_done`, `reviewing`, `done`, `rejected`, `owner_gate`, `ready_for_e2e`, `owner_accepted`, `blocked`, `archived`, `dropped`.

## Blockers

| ID | Status | Blocking reason | Needed decision or action | Owner |
| --- | --- | --- | --- | --- |
| `<blocker_id>` | `blocked` | `<reason>` | `<next action>` | `<Controller or Owner>` |

## Candidate Done Records

| Task ID | Candidate done time | Worker evidence | Remaining risk | Reviewer |
| --- | --- | --- | --- | --- |
| `<task_id>` | `<timestamp>` | `<evidence link>` | `<risk or none>` | `<review session>` |

## Review Results

| Task ID | Review status | Review log | Rework required |
| --- | --- | --- | --- |
| `<task_id>` | `done` / `rejected` | `<review log link>` | `<yes/no>` |

