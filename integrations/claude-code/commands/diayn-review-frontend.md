---
description: Review one frontend candidate report and decide done or rejected.
---

# DIAYN Review Frontend

Role: Frontend Review Session.

Treat `$ARGUMENTS` as the user-pasted latest frontend worker report. If it is missing, stop.

Read:

- `CLAUDE.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/review_frontend.md`
- `skills/diayn-reviewer/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`

Do:

1. Run Session Identity Guard first.
2. Compare the pasted report with diff, evidence, tests/checks, acceptance criteria, and lane permissions.
3. Follow `docs/meta/diayn_commands/review_frontend.md`.
4. Write reviewer-owned review records when allowed.

Stop if the worker report, diff, evidence, or acceptance criteria cannot be inspected. Do not merge, fix code by default, or mark `owner_accepted`.
