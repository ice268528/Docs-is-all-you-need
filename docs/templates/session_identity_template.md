---
diayn_session_identity_version: 0.1
project_slug: "<project_slug>"
declared_role: "<role>"
current_lane: "<lane-or-none>"
expected_worktree_path: "../worktrees/<project_slug>/<lane>"
allowed_command: "<allowed_command>"
allowed_workflow: "<allowed_workflow>"
last_verified_time: "<timestamp>"
---

# Session Identity Template

> Copy this template to `.diayn/local/session_identity.md` inside a local worktree or session directory. Do not commit local identity files.

## Identity

| Field | Value |
| --- | --- |
| Declared role | `<Controller Session / Backend Session / Frontend Session / Review Session>` |
| Current lane | `<lane-or-none>` |
| Expected worktree path | `../worktrees/<project_slug>/<lane>` |
| Current working directory | `<absolute-or-relative-path>` |
| Allowed command | `<allowed_command>` |
| Allowed workflow | `<allowed_workflow>` |
| Last verified time | `<timestamp>` |

## Allowed Command Or Workflow

| Command or workflow | Allowed? | Notes |
| --- | --- | --- |
| `<allowed_command>` | `<yes/no>` | `<notes>` |
| `<allowed_workflow>` | `<yes/no>` | `<notes>` |

## Mismatch Handling

If any identity source conflicts:

1. Stop before making changes.
2. State the declared role, detected lane, current directory, and expected path.
3. Ask the Controller or Owner for correction.
4. Do not proceed with role-specific work until identity is confirmed.

This is a soft safety guard, not a security sandbox.
