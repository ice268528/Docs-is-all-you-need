# Status Model

> This document defines the canonical multi-session status names, transitions, role authority, and legacy migration rules.

## 1. Canonical Statuses

| Status | Meaning | Typical writer |
| --- | --- | --- |
| `todo` | Confirmed work exists and is not started. | Controller or lane owner |
| `doing` | One lane-local task is actively being worked. | The responsible worker session |
| `candidate_done` | Worker believes implementation and lane-local verification are complete and ready for independent review. | Backend or Frontend Session |
| `reviewing` | A review session is actively checking candidate work. | Review Session |
| `done` | Independent review accepted the work for that lane or unit. | Review Session |
| `rejected` | Independent review found required rework. | Review Session |
| `owner_gate` | Human decision or authorization is required before continuing. | Any session, with explanation |
| `ready_for_e2e` | Reviewed work is integrated enough for Owner-level or end-to-end acceptance. | Controller Integration Review |
| `owner_accepted` | Owner accepted the result at business or experience level. | Owner, recorded by Controller or authorized session |
| `blocked` | Progress is blocked by dependency, environment, permission, missing facts, or unresolved decision. | Any session, within its scope |
| `archived` | Item has been moved out of active work after proper summary or snapshot. | Controller |
| `dropped` | Item is explicitly removed, replaced, or not planned. | Controller with Owner authority when scope is affected |

## 2. Normal Transitions

```text
todo -> doing -> candidate_done -> reviewing -> done
```

Review failure:

```text
candidate_done -> reviewing -> rejected -> todo
candidate_done -> reviewing -> rejected -> blocked
```

Owner acceptance:

```text
done -> ready_for_e2e -> owner_accepted
```

General interruption:

```text
todo | doing | candidate_done | reviewing -> owner_gate
todo | doing | candidate_done | reviewing -> blocked
```

Cleanup:

```text
done | owner_accepted | dropped -> archived
```

## 3. Role Authority Rules

- Backend and Frontend Sessions may move their own lane work to `candidate_done`, `blocked`, or `owner_gate`.
- Worker sessions cannot mark `done`, `rejected`, `ready_for_e2e`, or `owner_accepted`.
- Backend and Frontend Review Sessions may mark the reviewed lane `done` or `rejected`.
- Review sessions cannot mark `owner_accepted`.
- Controller Integration Review may mark integration readiness as `ready_for_e2e`, or write issues back as `todo`, `blocked`, or `rejected` in the relevant lane context.
- Only Owner Acceptance may authorize `owner_accepted`.
- Controller may archive or drop items only when the required review, acceptance, or Owner authorization exists.

## 4. WIP Rule

The legacy global WIP=1 rule becomes lane-level WIP=1.

Rules:

- Each lane should have at most one active `doing` item.
- Backend and frontend lanes may progress in parallel when their lane boards and shared contracts allow it.
- A worker may not start a second lane item while its current item is still `doing`.
- If multiple items in one lane are `doing`, the lane session should stop implementation and reconcile status first.
- The global `TODO.md` is a Controller summary and should not force all lanes into a single global active task.
- Lane root indexes summarize the current stage; detailed execution history belongs in `docs/lanes/<lane>/stages/<stage-id>/`.

## 5. Evidence Requirements

Status changes must be backed by evidence:

- `candidate_done` requires worker evidence and verification notes.
- `done` requires independent review evidence.
- `rejected` requires a review reason and rework direction.
- `ready_for_e2e` requires integration evidence or a clearly documented limitation.
- `owner_accepted` requires Owner confirmation or an acceptance record.
- `blocked` and `owner_gate` require the blocking reason and the next required decision or action.

## 6. Legacy Migration Rules

| Legacy concept or state | New status or concept | Migration rule |
| --- | --- | --- |
| `auto_verified` | `candidate_done` | Use when the implementing session self-tested but no independent review has accepted the work. |
| `auto_verified` | `done` | Use only when independent review evidence already exists. |
| `accepted` | `owner_accepted` | Use for Owner-level business or experience acceptance. |
| `waiting_verify` | `reviewing` or `candidate_done` | Use `candidate_done` before review starts; use `reviewing` while review is active. |
| `waiting_Owner_test` | `ready_for_e2e` or `owner_gate` | Use `ready_for_e2e` for prepared acceptance; use `owner_gate` when a decision is required. |
| Global WIP=1 | Lane-level WIP=1 | Preserve focus within each lane while allowing independent lanes to run in parallel. |
| Global `TODO.md` as all details | Controller summary plus lane boards plus stage-scoped lane details | Keep high-level status in `TODO.md`; put detailed execution in lane root indexes and `docs/lanes/<lane>/stages/<stage-id>/`. |

## 7. Naming Rules

- Do not introduce project-specific status names in core docs.
- Do not use technology-specific states such as `frontend_built` or `api_deployed` in core status lists.
- Put implementation-specific detail in evidence, review logs, or lane notes.
- If a project needs additional local tags, keep them separate from canonical status.
