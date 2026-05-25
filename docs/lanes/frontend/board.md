# Frontend Lane Board

> Active board for frontend lane work. Frontend workers may update this board within authorized scope; reviewers and the Controller may update review and sync fields.

## Lane Metadata

| Field | Value |
| --- | --- |
| Lane | `frontend` |
| Current stage | `<stage_id>` |
| Current batch | `<batch_id>` |
| WIP limit | 1 active `doing` item in this lane |
| Handoff | `docs/lanes/frontend/handoff.md` |
| Evidence | `docs/lanes/frontend/evidence.md` |
| Worklog | `docs/lanes/frontend/worklog.md` |
| Review log | `docs/lanes/frontend/review_log.md` |

## Authorized Scope

| Area | Allowed? | Notes |
| --- | --- | --- |
| Frontend lane documents | Yes | Board, handoff updates, evidence, worklog |
| Frontend implementation and tests | When authorized | Stay inside the task handoff |
| Shared contracts | Stop first | Requires Controller or Owner authorization |
| Backend lane documents or code | No | Ask Controller |
| Global `TODO.md` | No by default | Controller-owned summary |

## Required Reading

| Path | Purpose | Visible to lane? |
| --- | --- | --- |
| `AGENTS.md` or `CLAUDE.md` | Entry rules | `<yes/no>` |
| `docs/meta/session_roles.md` | Role authority | `<yes/no>` |
| `docs/meta/status_model.md` | Status authority | `<yes/no>` |
| `docs/lanes/frontend/handoff.md` | Task dispatch | `<yes/no>` |
| `<contract_path>` | Shared contract | `<yes/no>` |

## Tasks

| ID | Status | Task | Authorized paths | Verification | Evidence | Review |
| --- | --- | --- | --- | --- | --- | --- |
| `<task_id>` | `todo` | `<task summary>` | `<paths>` | `<verification_command>` | `<evidence anchor>` | `<review log anchor>` |

## Blockers

| ID | Status | Blocking reason | Needed decision or action | Owner |
| --- | --- | --- | --- | --- |
| `<blocker_id>` | `blocked` | `<reason>` | `<next action>` | `<Controller or Owner>` |

## Candidate Done Records

| Task ID | Candidate done time | Worker evidence | Remaining risk | Reviewer |
| --- | --- | --- | --- | --- |
| `<task_id>` | `<timestamp>` | `<evidence link>` | `<risk or none>` | `<review session>` |

