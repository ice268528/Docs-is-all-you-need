---
description: Prepare DIAYN worktree manifest and lane launch guidance.
---

# /diayn-worktrees

Treat `/diayn-worktrees` as a DIAYN workflow trigger, not a shell command.

Read first:

- `AGENTS.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/worktrees.md`
- `docs/meta/diayn_worktree_workflow.md`
- `skills/diayn-controller/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`

Run Session Identity Guard before acting. Confirm Controller authority, `project_slug`, lane names, document visibility, and default paths under `../worktrees/<project_slug>/<lane>`.

Follow the canonical command detail file. Do not create real worktrees unless the Owner separately authorizes that action.
