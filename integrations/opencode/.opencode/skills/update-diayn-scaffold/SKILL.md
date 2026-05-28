---
name: update-diayn-scaffold
description: OpenCode wrapper for dry-run-first DIAYN scaffold upgrade audits and patch proposals.
---

# OpenCode Wrapper: Update DIAYN Scaffold

This is a thin OpenCode adapter wrapper. Canonical behavior lives in `skills/update-diayn-scaffold/SKILL.md`.

Read first:

- `README.md`
- `AGENTS.md` when present
- `CLAUDE.md` when present
- `skills/update-diayn-scaffold/SKILL.md`
- `skills/update-diayn-scaffold/references/scaffold-upgrade-dry-run.md`

Perform a read-only inventory first and produce a dry-run migration plan. Do not overwrite user content, create plugin/runtime/CLI artifacts, create real worktrees, or apply patches without explicit Owner confirmation.
