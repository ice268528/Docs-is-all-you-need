---
description: Triage failed Owner business acceptance through DIAYN Controller.
---

# /diayn-bug

Treat `/diayn-bug` as a DIAYN workflow trigger, not a shell command.

Read first:

- `AGENTS.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/bug.md`
- `skills/diayn-controller/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`
- `docs/meta/owner_acceptance_protocol.md`

Run Session Identity Guard before acting. Confirm Controller authority and compare the Owner's business acceptance failure with current scope, lane records, and backlog/future-scope rules.

Follow the canonical command detail file. Route current-scope bugs to affected lanes; route out-of-scope items to backlog or future preparation records.
