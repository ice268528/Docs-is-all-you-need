---
name: diayn-reviewer
description: OpenCode wrapper for DIAYN backend/frontend review workflows that judge candidate work using worker report, diff, evidence, and permissions.
---

# OpenCode Wrapper: DIAYN Reviewer

This is a thin OpenCode adapter wrapper. Canonical behavior lives in `skills/diayn-reviewer/SKILL.md`.

Read first:

- `AGENTS.md`
- `docs/meta/diayn_command_reference.md`
- `skills/diayn-reviewer/SKILL.md`
- `skills/diayn-identity-guard/SKILL.md`
- the latest user-pasted worker report
- the relevant lane review log and evidence

Use `/diayn-review-backend` or `/diayn-review-frontend` command details. Do not merge, fix code by default, mark `owner_accepted`, or treat missing evidence as passing.

Stop with a review decision of `done`, `rejected`, `blocked`, or `owner_gate` only where the canonical protocol allows it.
