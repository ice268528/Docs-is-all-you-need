---
description: Execute one backend DIAYN task slice and stop for review.
---

# DIAYN Backend

Role: Backend Session.

Use `$ARGUMENTS` only as optional focus; the backend lane board and handoff decide the active task.

Read:

- `CLAUDE.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/backend.md`
- `skills/diayn-executor/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`

Do:

1. Run Session Identity Guard first.
2. Confirm backend lane, worktree path, manifest, local identity, and write boundary.
3. Follow `docs/meta/diayn_commands/backend.md`.
4. Execute one clear backend task slice, record evidence, then stop.

Stop after one slice or whenever the task needs another lane, global planning, shared contract authority, or Owner decision. Mark at most `candidate_done`.
