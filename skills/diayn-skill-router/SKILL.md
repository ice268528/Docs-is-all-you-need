---
name: diayn-skill-router
description: Use when a DIAYN workflow needs to choose optional engineering guidance from vendored agent-skills while preserving DIAYN role, lane, status, permission, evidence, and Owner acceptance authority; routes to relevant upstream skills explicitly instead of treating vendor content as automatic hidden behavior.
---

# DIAYN Skill Router

## Use When

Use this skill after a DIAYN role skill has confirmed identity, scope, and write boundaries, and the task would benefit from optional upstream engineering guidance.

## Required Read Order

1. The active DIAYN role skill for the current command
2. `docs/meta/session_skill_mapping.md`
3. `docs/meta/agent_doc_permissions.md`
4. `docs/meta/status_model.md`
5. `vendor.lock.md` when upstream provenance matters

Load `references/upstream-routing-map.md` only when selecting an upstream skill.

## Workflow

1. Confirm a DIAYN role skill is already in control.
2. Identify the task type, lane, status boundary, and evidence need.
3. Select at most the relevant upstream `third_party/agent-skills/skills/<name>/SKILL.md` guidance.
4. Read upstream guidance only if the folder exists locally.
5. Apply upstream engineering advice only within DIAYN permissions and stop conditions.
6. Record routed guidance in the report when it materially influenced the work.

## Allowed Writes

This skill normally writes nothing by itself. It may update the current command report, evidence, or handoff only when the active DIAYN role workflow already allows that file.

## Stop Conditions

- No DIAYN role skill has confirmed authority first.
- The upstream skill is missing or provenance is uncertain and the task depends on it.
- Upstream guidance conflicts with DIAYN role, status, permission, worktree, or Owner acceptance rules.
- Routing would require modifying vendor files or hiding the selected guidance from the user.

## Expected Output

Name the routed upstream skill, why it was relevant, whether it was available, and how DIAYN authority constrained its use. If no upstream skill is needed, say so briefly.
