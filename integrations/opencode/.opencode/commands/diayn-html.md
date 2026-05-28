---
description: Generate a user-triggered DIAYN Owner decision or report explanation aid.
---

# /diayn-html

Treat `/diayn-html` as a DIAYN workflow trigger, not a shell command.

Read first:

- `AGENTS.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/html.md`
- `skills/diayn-owner-ux/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`
- `docs/meta/owner_decision_ux_protocol.md`

Run Session Identity Guard before acting. Confirm the user explicitly requested HTML and identify whether this is a decision aid or report explanation.

Follow the canonical command detail file. Do not auto-generate HTML just because a decision is long; final decisions still need Markdown or formal project records.
