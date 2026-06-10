# DIAYN Cleanup Delete Plan

Cleanup ID: `<cleanup_id>`
Status: `draft`

## Boundary

Cleanup is a separate authorized action. Do not silently delete scaffold files, worktrees, branches, logs, evidence, or Owner decision records.

## Proposed Actions

| Path or resource | Action | Preserve content? | Reason | Owner approval |
| --- | --- | --- | --- | --- |
| `<path/worktree/branch>` | `<delete/archive/keep>` | `<yes/no>` | `<reason>` | `<pending/approved/denied>` |

## Safety

- Keep `AGENTS.md` and `TODO.md` by default when they contain project-owned content.
- List worktree and branch cleanup separately.
- Delete only explicitly approved resources.
- Report what was actually removed; do not claim cleanup from a draft plan.
