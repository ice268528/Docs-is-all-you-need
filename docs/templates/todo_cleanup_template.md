# TODO Cleanup Template

> Use this template when the Controller reconciles global `TODO.md` with lane boards. It is not a worker task board.

## Cleanup Metadata

| Field | Value |
| --- | --- |
| Cleanup ID | `<cleanup_id>` |
| Stage | `<stage_id>` |
| Controller | `<controller_session_id>` |
| Source lane boards | `<paths>` |
| Source review logs | `<paths>` |
| Sync log | `.diayn/sync_log.md` |

## Global TODO Summary Update

| Item | Source | Current status | Global summary action |
| --- | --- | --- | --- |
| `<item>` | `<lane board or review log>` | `<status>` | `<keep/update/archive/drop>` |

## Cleanup Rules

- Do not erase unresolved `blocked`, `owner_gate`, or `rejected` work.
- Do not convert `candidate_done` to `done` without review evidence.
- Do not convert `done` to `owner_accepted` without Owner acceptance.
- Keep lane details in lane boards; keep only Controller summary in global `TODO.md`.
- Archive only after the required review, acceptance, or Owner authorization exists.

## Result

| Check | Result |
| --- | --- |
| Lane boards checked | `<yes/no>` |
| Review logs checked | `<yes/no>` |
| Integration issues checked | `<yes/no>` |
| Global TODO updated | `<yes/no>` |
| Remaining blockers | `<none or links>` |

