# Controller Flow Example

This is an example only. It does not replace the command reference.

## `/diayn-init`

Controller input:

```text
/diayn-init
Requirement source: <existing_doc_path or fuzzy_idea_summary>
```

Controller checks:

- Is the repository root correct?
- Did the Owner confirm `project_slug`?
- Are requirements understandable enough to plan lanes?
- What decisions are missing?
- Can the work be split into lane tasks?

Controller output:

| Item | Example value |
| --- | --- |
| Project slug | `<project_slug>` |
| Requirement source | `<requirements_doc_or_fuzzy_idea>` |
| Backend lane | `<backend_task_summary>` |
| Frontend lane | `<frontend_task_summary>` |
| Shared contract | `<shared_contract_path>` |
| Owner questions | `<short_list_or_none>` |

## `/diayn-plan`

Controller writes or updates:

- `docs/lanes/backend/board.md`
- `docs/lanes/backend/handoff.md`
- `docs/lanes/frontend/board.md`
- `docs/lanes/frontend/handoff.md`
- `docs/shared/**` as needed

The Controller does not implement business code by default.

## `/diayn-worktrees`

Controller confirms:

- `project_slug` is confirmed.
- Planned paths follow `../worktrees/<project_slug>/<lane>`.
- Lane boards and handoffs are visible to target sessions.
- Shared docs are visible.
- Launch prompts are clear.

Example launch summary:

| Lane | Expected path | Allowed command | Required docs |
| --- | --- | --- | --- |
| backend | `../worktrees/<project_slug>/backend` | `/diayn-backend` | lane board, handoff, shared docs |
| frontend | `../worktrees/<project_slug>/frontend` | `/diayn-frontend` | lane board, handoff, shared docs |

## `/diayn-sync` And `/diayn-integration`

Controller reads lane boards, evidence, worklogs, review logs, and shared
contract notes.

The Controller may mark `ready_for_e2e` only when reviewed lane work is
integrated enough and evidence exists.
