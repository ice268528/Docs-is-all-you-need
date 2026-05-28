---
description: Prepare DIAYN worktree metadata and launch guidance.
---

# DIAYN Worktrees

Role: Controller Session.

Use `$ARGUMENTS` only as optional context; `project_slug` must already be Owner-confirmed.

Read:

- `CLAUDE.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/worktrees.md`
- `docs/meta/diayn_worktree_workflow.md`
- `skills/diayn-controller/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`

Do:

1. Run Session Identity Guard first.
2. Check lane docs, manifest, registry, and visibility.
3. Follow `docs/meta/diayn_commands/worktrees.md`.
4. Use `skills/diayn-controller/scripts/worktree_dry_run.py` only for dry-run planning when useful.

Stop if paths conflict, required docs are invisible, or real `git worktree` operations lack explicit authorization.
