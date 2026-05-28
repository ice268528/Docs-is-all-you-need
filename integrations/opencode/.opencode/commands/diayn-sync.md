---
description: Summarize reviewed DIAYN lane state without bypassing review authority.
---

# /diayn-sync

Treat `/diayn-sync` as a DIAYN workflow trigger, not a shell command.

Read first:

- `AGENTS.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/sync.md`
- `skills/diayn-integrator/SKILL.md`
- `skills/diayn-controller/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`

Run Session Identity Guard before acting. Confirm Controller authority and read lane boards, review logs, evidence, shared issues, and `.diayn/sync_log.md` when present.

Follow the canonical command detail file. Do not turn `candidate_done` into `done` or treat missing evidence as passing.
