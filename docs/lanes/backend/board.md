# Backend Lane Board

> Active board for backend lane work. Backend workers may update this board within authorized scope; reviewers and the Controller may update review and sync fields.

## Lane Metadata

| Field | Value |
| --- | --- |
| Lane | `backend` |
| Current stage | `<stage_id>` |
| Current batch | `<batch_id>` |
| WIP limit | 1 active `doing` item in this lane |
| Handoff | `docs/lanes/backend/handoff.md` |
| Evidence index | `docs/lanes/backend/evidence.md` |
| Stage worklog | `docs/lanes/backend/stages/<stage-id>/worklog.md` |
| Stage review log | `docs/lanes/backend/stages/<stage-id>/review_log.md` |
| Review summary index | `docs/lanes/backend/review_log.md` |

## Authorized Scope

| Area | Allowed? | Notes |
| --- | --- | --- |
| Backend lane documents | Yes | Board, handoff updates, evidence index, stage-scoped worklog/evidence |
| Backend implementation and tests | When authorized | Stay inside the task handoff |
| Shared contracts | Stop first | Requires Controller or Owner authorization |
| Frontend lane documents or code | No | Ask Controller |
| Global `TODO.md` | No by default | Controller-owned summary |

## Required Reading

| Path | Purpose | Visible to lane? |
| --- | --- | --- |
| `AGENTS.md` or `CLAUDE.md` | Entry rules | `<yes/no>` |
| `docs/meta/session_roles.md` | Role authority | `<yes/no>` |
| `docs/meta/status_model.md` | Status authority | `<yes/no>` |
| `docs/lanes/backend/handoff.md` | Task dispatch | `<yes/no>` |
| `<contract_path>` | Shared contract | `<yes/no>` |

## Tasks

| ID | Status | Task | Authorized paths | Verification | Evidence | Review |
| --- | --- | --- | --- | --- | --- | --- |
| `<task_id>` | `todo` | `<task summary>` | `<paths>` | `<verification_command>` | `<evidence anchor>` | `<review log anchor>` |

Status authority:

- Backend workers may mark at most `candidate_done`, `blocked`, or `owner_gate` for same-lane tasks.
- Backend Review Sessions decide `done` or `rejected`.
- Controller Integration Review records `ready_for_e2e` in Controller or sync records, not as worker completion.
- Owner Acceptance records `owner_accepted` only through Owner-facing acceptance records.

## Blockers

| ID | Status | Blocking reason | Needed decision or action | Owner |
| --- | --- | --- | --- | --- |
| `<blocker_id>` | `blocked` | `<reason>` | `<next action>` | `<Controller or Owner>` |

## Candidate Done Records

| Task ID | Candidate done time | Worker evidence | Remaining risk | Reviewer |
| --- | --- | --- | --- | --- |
| `<task_id>` | `<timestamp>` | `<evidence link>` | `<risk or none>` | `<review session>` |
