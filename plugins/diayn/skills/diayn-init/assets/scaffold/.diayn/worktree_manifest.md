# DIAYN Worktree Manifest

Project slug: `<project_slug>`
Controller root: `<absolute_or_relative_controller_path>`
Accepted baseline branch: `<branch_or_Unknown>`
Accepted baseline commit: `<commit_or_Unknown>`

| Lane | Applicable | Worktree path | Branch | Status | Current stage | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| controller | yes | `<controller_path>` | `<branch>` | active | `<stage_id_or_Unknown>` | Controller owns planning, sync, integration, closeout. |
| backend | `<yes/no/not_applicable>` | `<path_or_n/a>` | `<branch_or_n/a>` | `<planned/active/n/a>` | `<stage_id_or_Unknown>` | One active backend worker/reviewer activity at a time. |
| frontend | `<yes/no/not_applicable>` | `<path_or_n/a>` | `<branch_or_n/a>` | `<planned/active/n/a>` | `<stage_id_or_Unknown>` | One active frontend worker/reviewer activity at a time. |

Notes:

- `/diayn-sync` synchronizes state and documents only.
- `/diayn-integration` handles reviewed-code integration.
- Do not silently reset, delete, or overwrite worktrees.
