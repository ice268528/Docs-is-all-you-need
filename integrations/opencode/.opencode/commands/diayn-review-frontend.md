---
description: Review a frontend worker report against diff, evidence, and scope.
---

# /diayn-review-frontend

Treat `/diayn-review-frontend` as a DIAYN workflow trigger, not a shell command.

Read first:

- `AGENTS.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/review_frontend.md`
- `skills/diayn-reviewer/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`
- `docs/lanes/frontend/review_log.md`

Run Session Identity Guard before acting. Require the latest frontend worker report pasted by the user, then inspect diff, evidence, checks, lane scope, and permissions.

Follow the canonical command detail file. Decide `done` or `rejected`; do not merge, fix code by default, or mark `owner_accepted`.
