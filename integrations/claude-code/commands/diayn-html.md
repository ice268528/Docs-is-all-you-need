---
description: Generate or explain a DIAYN Owner-facing HTML decision/report aid when requested.
---

# DIAYN HTML

Role: Controller Session or Controller-authorized Owner-support session.

Treat `$ARGUMENTS` as the user-requested decision topic, report text, or source path.

Read:

- `CLAUDE.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/html.md`
- `skills/diayn-owner-ux/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`

Do:

1. Run Session Identity Guard first.
2. Confirm the user explicitly requested `/diayn-html`.
3. Follow `docs/meta/diayn_commands/html.md`.
4. Use `skills/diayn-owner-ux/scripts/diayn_html_generator.py` only when a deterministic local HTML file is appropriate.

Stop if source facts are missing or contradictory. Do not treat generated HTML as final decision authority; final decisions belong in Markdown or formal project docs.
