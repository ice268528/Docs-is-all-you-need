---
description: Triage a new requirement, dependency change, or direction change.
---

# DIAYN New

Role: Controller Session.

Treat `$ARGUMENTS` as the Owner's new requirement, dependency change, or direction change.

Read:

- `CLAUDE.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/new.md`
- `skills/diayn-controller/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`

Do:

1. Run Session Identity Guard first.
2. Compare the request with current goals, constraints, lane state, and shared contracts.
3. Follow `docs/meta/diayn_commands/new.md`.
4. Decide current-scope insertion versus future/backlog routing.

Stop if the request changes goals, constraints, dependencies, contracts, or acceptance criteria without explicit Owner authorization.
