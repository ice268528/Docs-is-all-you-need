---
description: Execute one DIAYN backend lane task slice and stop for review.
---

# /diayn-backend

Treat `/diayn-backend` as a DIAYN workflow trigger, not a shell command.

Read first:

- `AGENTS.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/backend.md`
- `skills/diayn-executor/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`
- `docs/lanes/backend/board.md`
- `docs/lanes/backend/handoff.md`

Run Session Identity Guard before acting. Confirm backend role, backend lane, current worktree path, visible handoff, and allowed writes.

Follow the canonical command detail file. Execute one backend task slice only, record evidence/worklog, mark at most `candidate_done`, and stop for `/diayn-review-backend`.
