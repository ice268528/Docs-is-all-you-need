---
name: diayn-integrator
description: OpenCode wrapper for DIAYN sync and integration workflows that check reviewed lane state, shared contracts, and evidence.
---

# OpenCode Wrapper: DIAYN Integrator

This is a thin OpenCode adapter wrapper. Canonical behavior lives in `skills/diayn-integrator/SKILL.md`.

Read first:

- `AGENTS.md`
- `docs/meta/diayn_command_reference.md`
- `skills/diayn-integrator/SKILL.md`
- `skills/diayn-controller/SKILL.md` when Controller context is needed
- `skills/diayn-identity-guard/SKILL.md`
- lane review logs, evidence, shared contracts, and integration issues

Use `/diayn-sync` or `/diayn-integration` command details. Do not perform lane implementation or mark `ready_for_e2e` without evidence.

Stop and record missing lane review, contract conflict, or missing evidence instead of assuming integration passed.
