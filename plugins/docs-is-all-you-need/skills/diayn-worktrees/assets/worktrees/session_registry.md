# DIAYN Session Registry

Project slug: `<project_slug>`
Controller path: `<controller_path>`
Current stage: `<stage_id_or_Unknown>`

| Session | Role | Lane | Expected path | Allowed command | State | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| controller | Controller | none | `<controller_path>` | `/diayn-worktrees` | active | Owns planning, worktree manifest, sync, integration, closeout. |
| backend-worker | Backend Session | backend | `<backend_worktree_or_n/a>` | `/diayn-backend` | `<planned/ready/not_applicable>` | One active backend worker/reviewer activity at a time. |
| backend-reviewer | Backend Review Session | backend | `<backend_worktree_or_n/a>` | `/diayn-review-backend` | `<planned/ready/not_applicable>` | Uses the same backend worktree after worker stops. |
| frontend-worker | Frontend Session | frontend | `<frontend_worktree_or_n/a>` | `/diayn-frontend` | `<planned/ready/not_applicable>` | One active frontend worker/reviewer activity at a time. |
| frontend-reviewer | Frontend Review Session | frontend | `<frontend_worktree_or_n/a>` | `/diayn-review-frontend` | `<planned/ready/not_applicable>` | Uses the same frontend worktree after worker stops. |

Rules:

- Do not run worker and reviewer activity in the same lane at the same time.
- Do not launch hidden interactive agents from the Controller.
- If a fresh session is opened, run the matching `/diayn-*` command again so it reloads only the required context.
