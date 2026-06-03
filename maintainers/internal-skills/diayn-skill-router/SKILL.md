---
name: diayn-skill-router
description: Routes DIAYN workflows to DIAYN-managed third-party agent-skills through platform-native nested skill invocation or an equivalent native skill tool call while preserving DIAYN role, lane, status, permission, review, integration, evidence, and Owner authority. Use when a /diayn-* workflow needs optional engineering guidance.
---

# DIAYN Skill Router

## Use When

Use this internal/shared skill after a public `/diayn-*` workflow has confirmed command identity, role concept, lane, worktree, and write boundaries, and the current task would benefit from third-party engineering guidance.

## Read First

1. The active public `/diayn-*` workflow skill.
2. `docs/meta/session_skill_mapping.md`.
3. `vendor.lock.md` when provenance matters.
4. `references/upstream-routing-map.md` when selecting a dependency skill.

## Invocation Rule

The normal DIAYN composition path is a real dependency-skill call:

1. Select a DIAYN-managed locked dependency skill from the routing map.
2. Resolve the platform-visible skill name for the active surface.
3. Invoke it through platform-native nested skill invocation or an equivalent native skill tool call.
4. Keep the active public DIAYN workflow in control of role, lane, state, permissions, evidence, review, integration, and Owner acceptance.

Skill name resolution:

- Project-local bare-command installs use the dependency skill name directly, such as `idea-refine`.
- Claude plugin namespace installs use the plugin namespace, such as `docs-is-all-you-need:idea-refine`, when the native Skill tool requires namespaced skill ids.
- Codex installed package surfaces use the discovered Codex skill id. In the current package shape, dependency skill folders are installed beside DIAYN workflow skills under the selected skills root.

Reading `third_party/agent-skills/skills/<name>/SKILL.md` directly is fallback/reference behavior only. It may help a maintainer diagnose or adapt a platform, but it does not count as real third-party skill invocation and must not be reported as native composition evidence.

## Workflow

1. Confirm a public `/diayn-*` workflow is already in control.
2. Identify the task type, lane, status boundary, and evidence need.
3. Select only the smallest relevant DIAYN-managed dependency skill set from `references/upstream-routing-map.md`.
4. Confirm dependency provenance against DIAYN lock metadata.
5. Use native nested skill invocation or equivalent native skill tooling where the surface supports it.
6. If the platform cannot perform a real dependency-skill call, state the capability limitation and use direct reading only as an explicit fallback when the Owner accepts the reduced evidence.
7. Record routing evidence when it materially influences the result or when validating the package.

## Allowed Writes

This internal/shared skill normally writes nothing by itself. It may add routing evidence to the active workflow report, lane evidence, integration summary, or maintainer validation report only when the owning public workflow allows that file.

## Stop Conditions

- No public `/diayn-*` workflow has confirmed authority first.
- The selected dependency skill is missing from the DIAYN-managed locked copy.
- The available dependency copy is uncontrolled, mismatched, or has uncertain provenance.
- Upstream guidance conflicts with DIAYN role, lane, status, permission, review, integration, evidence, or Owner rules.
- The platform cannot perform a native/equivalent dependency-skill call and the current claim requires native composition evidence.

## Output

Keep normal user output low-noise. When routing evidence matters, report the selected dependency skill, why it applied, the invocation mode (`native`, `equivalent-native-tool`, or `fallback-read-only`), the locked dependency source, and the DIAYN authority constraints that remained active.
