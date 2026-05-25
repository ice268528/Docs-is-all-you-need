# Multi-Session Backend Frontend Example Overview

This example shows a generic DIAYN flow with a Controller Session, one backend
lane, one frontend lane, review sessions, and Owner acceptance.

This is not core protocol. See `README_NOT_CORE.md` in this directory.

## Scenario

The Owner wants a new feature slice for `<project_slug>`. The implementation can
be split into:

- backend lane: `<backend_task_summary>`
- frontend lane: `<frontend_task_summary>`
- shared contract: `<shared_contract_path>`

No real worktree is created by this example.

## Canonical Flow

1. Controller runs `/diayn init`.
2. Controller confirms `project_slug` with the Owner.
3. Controller runs `/diayn plan`.
4. Controller prepares lane boards, handoffs, and worktree metadata.
5. Backend worker runs `/diayn backend` for one task slice.
6. Backend review runs `/diayn review backend`.
7. Frontend worker runs `/diayn frontend` for one task slice.
8. Frontend review runs `/diayn review frontend`.
9. Controller runs `/diayn sync`.
10. Controller runs `/diayn integration`.
11. Owner performs business-facing acceptance.

## Status Boundaries

| Session | Maximum decision |
| --- | --- |
| Backend worker | `candidate_done` |
| Frontend worker | `candidate_done` |
| Backend review | `done` or `rejected` |
| Frontend review | `done` or `rejected` |
| Controller integration | `ready_for_e2e` when evidence exists |
| Owner acceptance | `owner_accepted` |

## Worktree Shape

```text
../worktrees/<project_slug>/backend
../worktrees/<project_slug>/frontend
```

The Controller must ensure required docs are committed, copied, or otherwise
visible before asking a lane session to act on them.
