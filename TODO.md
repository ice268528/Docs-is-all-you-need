---
document_role: "Controller-owned global summary"
primary_writer: "Controller Session"
audience:
  - "Owner"
  - "Controller Session"
  - "Review Session"
permission: "Controller write"
notes:
  - "Worker sessions do not update this file by default."
  - "Lane details belong in docs/lanes/<lane>/board.md, evidence.md, worklog.md, and review_log.md."
---

# TODO

This file is the Controller-owned global summary for the current project.
It is not the detailed workspace for backend, frontend, or other worker
sessions.

## 1. Current Execution Context

- Project slug: `<project_slug>`
- Current stage or milestone: `<stage_id or n/a>`
- Current focus: `<short summary>`
- Last updated: `<YYYY-MM-DD HH:mm>`
- Maintainer: `Controller Session`

## 2. Canonical Statuses

Use only the multi-session status model from
`docs/meta/status_model.md`:

```text
todo
doing
candidate_done
reviewing
done
rejected
owner_gate
ready_for_e2e
owner_accepted
blocked
archived
dropped
```

Summary rules:

- Workers may move same-lane work at most to `candidate_done`, `blocked`, or
  `owner_gate`.
- Review sessions decide `done` or `rejected`.
- Controller Integration Review may mark `ready_for_e2e` only with evidence.
- Owner Acceptance authorizes `owner_accepted`.
- Legacy state names are migration inputs only; see
  `docs/meta/legacy_migration_guide.md`.

## 3. Global Summary Board

| ID | Lane | Status | Source | Title | Evidence or review summary | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| `G-001` | `<controller/backend/frontend/<lane>>` | `<todo>` | `<plan/REQ/BUG/review/integration>` | `<short title>` | `<path or summary>` | `<next command or decision>` |

## 4. Lane Snapshot

| Lane | Board | Current focus | Highest reviewed status | Blockers |
| --- | --- | --- | --- | --- |
| `backend` | `docs/lanes/backend/board.md` | `<summary>` | `<done/rejected/n/a>` | `<none or links>` |
| `frontend` | `docs/lanes/frontend/board.md` | `<summary>` | `<done/rejected/n/a>` | `<none or links>` |

## 5. Owner Gates

| ID | Status | Owner response state | Question | Impact | Owner response needed |
| --- | --- | --- | --- | --- | --- |
| `Q-001` | `<owner_gate/blocked/archived>` | `<open/answered/n/a>` | `<question>` | `<scope/lane/contract/UX>` | `<copyable answer format>` |

## 6. Ready For Owner Experience Acceptance

| ID | User path or acceptance topic | Reviewed lane work | Integration evidence | Owner acceptance entry |
| --- | --- | --- | --- | --- |
| `E2E-001` | `<user-visible path>` | `<lane review links>` | `<sync/integration evidence>` | `docs/templates/owner_experience_acceptance_template.md` |

## 7. Responsibility Boundary

`TODO.md` keeps:

- current Controller summary;
- lane status snapshot;
- global blockers and Owner gates;
- integration readiness summary;
- next recommended command or decision.

`TODO.md` does not keep:

- full lane task details;
- worker process logs;
- raw command output;
- review evidence details;
- complete Owner decision discussions;
- historical archived task bodies.

Those belong in lane boards, evidence, worklogs, review logs, Owner decision
records, handoff packets, or archived snapshots.
