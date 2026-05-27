---
diayn_session_registry_version: 0.1
project_slug: "<project_slug>"
current_stage: "<stage_id>"
---

# DIAYN Session Registry

> Controller-owned registry of planned or active collaboration sessions.

This file records intended session roles and lanes. It does not launch agents. Command semantics live in `docs/meta/diayn_command_reference.md`.

## Sessions

| Session ID | Role | Lane | Expected path | Session state | Started by | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `<session_id>` | `Controller Session` | `<none>` | `<controller_repo_path>` | `planned` | `<Owner or Controller>` | `<notes>` |
| `<session_id>` | `Backend Session` | `backend` | `../worktrees/<project_slug>/backend` | `planned` | `Controller` | `<notes>` |
| `<session_id>` | `Frontend Session` | `frontend` | `../worktrees/<project_slug>/frontend` | `planned` | `Controller` | `<notes>` |
| `<session_id>` | `Backend Review Session` | `backend` | `../worktrees/<project_slug>/backend` | `planned` | `Controller` | `<notes>` |
| `<session_id>` | `Frontend Review Session` | `frontend` | `../worktrees/<project_slug>/frontend` | `planned` | `Controller` | `<notes>` |

## Identity Expectations

Each role-specific session should confirm:

- Declared role.
- Current lane.
- Expected worktree path.
- Allowed workflow.
- Last verified time.

Local identity notes belong under `.diayn/local/` and must not be committed.
