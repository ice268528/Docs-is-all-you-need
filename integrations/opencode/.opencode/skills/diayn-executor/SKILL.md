---
name: diayn-executor
description: OpenCode wrapper for DIAYN backend/frontend lane execution, one task slice at a time, stopping at candidate_done for review.
---

# OpenCode Wrapper: DIAYN Executor

This is a thin OpenCode adapter wrapper. Canonical behavior lives in `skills/diayn-executor/SKILL.md`.

Read first:

- `AGENTS.md`
- `docs/meta/diayn_command_reference.md`
- `skills/diayn-executor/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`
- the active lane board and handoff

Use only `/diayn-backend` or `/diayn-frontend` command details unless the project has defined another lane command. Do not edit other lanes, root Controller summaries, review logs, or Owner acceptance records by default.

Stop after one task slice with evidence and a review route.
