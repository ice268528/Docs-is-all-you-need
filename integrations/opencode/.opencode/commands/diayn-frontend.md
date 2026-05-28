---
description: Execute one DIAYN frontend lane task slice and stop for review.
---

# /diayn-frontend

Treat `/diayn-frontend` as a DIAYN workflow trigger, not a shell command.

Read first:

- `AGENTS.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/frontend.md`
- `skills/diayn-executor/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`
- `docs/lanes/frontend/board.md`
- `docs/lanes/frontend/handoff.md`

Run Session Identity Guard before acting. Confirm frontend role, frontend lane, current worktree path, visible handoff, and allowed writes.

Follow the canonical command detail file. Execute one frontend task slice only, record evidence/worklog, mark at most `candidate_done`, and stop for `/diayn-review-frontend`.
