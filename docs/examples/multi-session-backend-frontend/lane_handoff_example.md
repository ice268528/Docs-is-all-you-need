# Lane Handoff Example

This is an example only. Use `docs/templates/handoff_packet_template.md` for
real handoff packets.

## Backend Lane Handoff

| Field | Example value |
| --- | --- |
| Lane | backend |
| Expected worktree | `../worktrees/<project_slug>/backend` |
| Allowed command | `/diayn-backend` |
| Task slice | `<backend_task_id>: <one_backend_slice>` |
| Required shared doc | `<shared_contract_path>` |
| Stop condition | Stop after `candidate_done`, `blocked`, or `owner_gate` |

Required reads:

- `docs/lanes/backend/board.md`
- `docs/lanes/backend/handoff.md`
- `docs/lanes/backend/evidence.md` as the lane evidence index
- `docs/lanes/backend/stages/<stage-id>/worklog.md`
- `docs/lanes/backend/stages/<stage-id>/evidence.md`
- `docs/shared/**` relevant to the task

Worker report shape:

```text
Status: candidate_done | blocked | owner_gate
Task slice: <task_id>
Changed paths: <paths>
Evidence: <commands or manual checks>
Risks: <remaining_risks>
Next review command: /diayn-review-backend
```

## Frontend Lane Handoff

| Field | Example value |
| --- | --- |
| Lane | frontend |
| Expected worktree | `../worktrees/<project_slug>/frontend` |
| Allowed command | `/diayn-frontend` |
| Task slice | `<frontend_task_id>: <one_frontend_slice>` |
| Required shared doc | `<shared_contract_path>` |
| Stop condition | Stop after `candidate_done`, `blocked`, or `owner_gate` |

Frontend worker sessions follow the same boundaries as backend worker sessions:
one clear task slice, lane-local writes, evidence, and stop for review.
