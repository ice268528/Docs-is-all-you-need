---
description: Triage an Owner business acceptance failure through DIAYN Controller.
---

# DIAYN Bug

Role: Controller Session.

Treat `$ARGUMENTS` as the Owner's acceptance failure report.

Read:

- `CLAUDE.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/bug.md`
- `skills/diayn-controller/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`

Do:

1. Run Session Identity Guard first.
2. Compare the failure report with current scope, lane state, review records, and acceptance criteria.
3. Follow `docs/meta/diayn_commands/bug.md`.
4. Route current-scope issues to the responsible lane or record out-of-scope issues for later.

Stop if expected behavior, actual behavior, scope ownership, or acceptance criteria are unclear.
