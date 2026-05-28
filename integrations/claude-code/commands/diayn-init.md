---
description: Start or refresh DIAYN Controller initialization for a project.
---

# DIAYN Init

Role: Controller Session.

Use `$ARGUMENTS` as the user-provided requirements path, fuzzy idea, or empty init request.

Read:

- `CLAUDE.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/init.md`
- `skills/diayn-controller/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`

Do:

1. Run Session Identity Guard first.
2. Confirm repository root and ask the Owner to confirm `project_slug`.
3. Follow `docs/meta/diayn_commands/init.md`.
4. Keep durable facts in repository documents.

Stop if identity, path, scope, source quality, or `project_slug` is unclear. Do not write business code or create real worktrees.
