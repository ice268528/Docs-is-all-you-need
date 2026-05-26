---
diayn_manifest_version: 0.1
project_slug: "<project_slug>"
worktree_root: "../worktrees/<project_slug>"
current_stage: "<stage_id>"
controller_baseline: "<commit-or-branch>"
---

# DIAYN Worktree Manifest

> Shared Controller-owned control metadata. This file records intended worktree layout; it does not create worktrees.

## Rules

- Default worktree path: `../worktrees/<project_slug>/<lane>`.
- Do not put a stage identifier in the long-lived worktree directory name.
- Stage information belongs in branch names, this manifest, stage docs, and lane boards.
- `.diayn/` shared control files may enter git.
- `.diayn/local/` is local-only and must not enter git.

## Worktrees

| Lane | Expected path | Branch | Baseline | Current stage | Status | Startup instruction |
| --- | --- | --- | --- | --- | --- | --- |
| `backend` | `../worktrees/<project_slug>/backend` | `<branch>` | `<commit-or-branch>` | `<stage_id>` | `planned` | `cd ../worktrees/<project_slug>/backend; start the selected agent; run /diayn backend` |
| `frontend` | `../worktrees/<project_slug>/frontend` | `<branch>` | `<commit-or-branch>` | `<stage_id>` | `planned` | `cd ../worktrees/<project_slug>/frontend; start the selected agent; run /diayn frontend` |

## Required Shared Documents

| Path | Purpose | Must be visible to |
| --- | --- | --- |
| `docs/meta/multi_session_collaboration_protocol.md` | Protocol | All sessions |
| `docs/meta/session_roles.md` | Role authority | All sessions |
| `docs/meta/status_model.md` | Status authority | All sessions |
| `docs/shared/contracts/` | Shared contracts | Affected lanes |
| `docs/lanes/<lane>/handoff.md` | Lane dispatch | Target lane |
