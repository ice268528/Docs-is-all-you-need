---
name: diayn-skill-router
description: OpenCode wrapper for explicit DIAYN routing to vendored agent-skills guidance while DIAYN authority remains in control.
---

# OpenCode Wrapper: DIAYN Skill Router

This is a thin OpenCode adapter wrapper. Canonical behavior lives in `skills/diayn-skill-router/SKILL.md`.

Read first:

- the active DIAYN role skill
- `skills/diayn-skill-router/SKILL.md`
- `skills/diayn-skill-router/references/upstream-routing-map.md`
- `docs/meta/session_skill_mapping.md`

Route only to locally vendored upstream skills that are relevant to the active DIAYN task. Do not modify `third_party/agent-skills/**`, hide routed guidance from the user, or let upstream generic guidance override DIAYN role, lane, status, permission, evidence, or Owner acceptance rules.
