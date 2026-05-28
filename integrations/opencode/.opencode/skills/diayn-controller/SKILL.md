---
name: diayn-controller
description: OpenCode wrapper for DIAYN Controller workflows such as /diayn-init, /diayn-plan, /diayn-worktrees, /diayn-sync, /diayn-integration, /diayn-bug, and /diayn-new.
---

# OpenCode Wrapper: DIAYN Controller

This is a thin OpenCode adapter wrapper. Canonical behavior lives in `skills/diayn-controller/SKILL.md`.

Read first:

- `AGENTS.md`
- `docs/meta/diayn_command_reference.md`
- `skills/diayn-controller/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`

Use the matching `docs/meta/diayn_commands/*.md` command file. Do not copy protocol text into this wrapper or change Controller authority, status transitions, worktree paths, OwnerGate, or lane WIP rules.

Stop if the canonical DIAYN skill folder is not visible in the current project; fall back to the manual document workflow instead of inventing behavior.
