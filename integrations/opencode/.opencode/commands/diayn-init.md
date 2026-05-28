---
description: Start DIAYN Controller initialization from requirements or a fuzzy idea.
---

# /diayn-init

Treat `/diayn-init` as a DIAYN workflow trigger, not a shell command.

Read first:

- `AGENTS.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/init.md`
- `skills/diayn-controller/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`

Run Session Identity Guard before acting. Confirm this is a Controller session and ask the Owner to confirm `project_slug`.

Follow the canonical command detail file. Do not implement business code, create hidden agents, change status semantics, or treat historical `/diayn init` wording as canonical.
