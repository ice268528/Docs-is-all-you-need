# Session Skill Mapping

> This document maps multi-session roles to DIAYN-owned skills and optional upstream engineering skill references. DIAYN-owned skills and the upstream vendor snapshot already exist in this repository; ordinary `/diayn-*` users do not need to understand vendor sync details.

## 1. Current Boundary

This file defines the mapping layer only. It does not install, invoke, overwrite, or replace any skill, adapter, or vendor content.

Current facts:

- D5 canonical DIAYN Codex Skills live under `skills/diayn-*` plus `skills/update-diayn-scaffold/`.
- Older pre-D5 skill folders may exist for historical source compatibility; do not use them as the D5 install set.
- The upstream `agent-skills` snapshot lives under `third_party/agent-skills/**` for maintainer reference.
- Tool adapters and plugin preparation notes live under `integrations/**`.
- If a listed skill is missing in a downstream scaffold, treat the row as a mapping expectation, not as an executable capability.

## 2. Local DIAYN Skill Mapping

| Role | DIAYN-owned skill | Purpose |
| --- | --- | --- |
| Controller Session | `diayn-controller` | Planning, lane dispatch, sync, integration readiness, global summaries |
| Backend Session | `diayn-executor` | Lane-local execution and evidence writing |
| Frontend Session | `diayn-executor` | Lane-local execution and evidence writing |
| Backend Review Session | `diayn-reviewer` | Lane diff, evidence, permission, and acceptance review |
| Frontend Review Session | `diayn-reviewer` | Lane diff, evidence, permission, and acceptance review |
| Controller Integration Review | `diayn-integrator` | Cross-lane contract and integration checks |
| All `/diayn-*` sessions | `diayn-identity-guard` | Soft preflight against role, lane, directory, and manifest mismatch |
| Owner Acceptance and OwnerGate support | `diayn-owner-ux` | Human-readable decision and acceptance support |
| Any DIAYN session needing optional engineering guidance | `diayn-skill-router` | Explicitly routes to vendored upstream `agent-skills` guidance while DIAYN authority remains in control |
| Existing project upgrade | `update-diayn-scaffold` | Dry-run-first scaffold migration and patch proposal |

## 3. Upstream Skill Mapping

The upstream `agent-skills` project is a method library for single-session engineering behavior. DIAYN remains the multi-session control plane. When upstream guidance conflicts with DIAYN role, status, or document authority, DIAYN protocol wins.

The upstream snapshot is vendored under `third_party/agent-skills/` for maintainer reference. Ordinary `/diayn-*` users do not need to understand vendor sync details. Maintainers must review upstream changes through `maintainers/upstream-agent-skills/` before adapting them into DIAYN docs or skills.

D5-05 audited the actual vendor snapshot and found 23 upstream skills under `third_party/agent-skills/skills/**/SKILL.md`. Do not assume a different count in downstream copies. Route only to upstream skills that exist locally.

Audited upstream skills:

```text
api-and-interface-design
browser-testing-with-devtools
ci-cd-and-automation
code-review-and-quality
code-simplification
context-engineering
debugging-and-error-recovery
deprecation-and-migration
documentation-and-adrs
doubt-driven-development
frontend-ui-engineering
git-workflow-and-versioning
idea-refine
incremental-implementation
interview-me
performance-optimization
planning-and-task-breakdown
security-and-hardening
shipping-and-launch
source-driven-development
spec-driven-development
test-driven-development
using-agent-skills
```

Watched upstream areas:

- Direct tracking: `test-driven-development`, `incremental-implementation`, `code-review-and-quality`, `git-workflow-and-versioning`.
- Needs DIAYN adaptation: `planning-and-task-breakdown`, `context-engineering`, `documentation-and-adrs`, `api-and-interface-design`.
- Reference only: orchestration patterns, tool-specific setup docs, and slash command implementations.

| Role | Useful upstream skill categories | Routing reference |
| --- | --- | --- |
| Controller Session | `interview-me`, `idea-refine`, `spec-driven-development`, `planning-and-task-breakdown`, `context-engineering`, `documentation-and-adrs`, `git-workflow-and-versioning` | `skills/diayn-skill-router/references/upstream-routing-map.md` |
| Backend Session | `incremental-implementation`, `test-driven-development`, `source-driven-development`, `api-and-interface-design`, `debugging-and-error-recovery`, `security-and-hardening` | `skills/diayn-skill-router/references/upstream-routing-map.md` |
| Frontend Session | `incremental-implementation`, `test-driven-development`, `source-driven-development`, `frontend-ui-engineering`, `browser-testing-with-devtools`, `performance-optimization` | `skills/diayn-skill-router/references/upstream-routing-map.md` |
| Backend Review Session | `code-review-and-quality`, `doubt-driven-development`, `security-and-hardening`, `debugging-and-error-recovery` | `skills/diayn-skill-router/references/upstream-routing-map.md` |
| Frontend Review Session | `code-review-and-quality`, `doubt-driven-development`, `browser-testing-with-devtools`, `frontend-ui-engineering`, `security-and-hardening` | `skills/diayn-skill-router/references/upstream-routing-map.md` |
| Controller Integration Review | `code-review-and-quality`, `api-and-interface-design`, `git-workflow-and-versioning`, `ci-cd-and-automation`, `shipping-and-launch` | `skills/diayn-skill-router/references/upstream-routing-map.md` |
| Owner Acceptance support | `idea-refine`, `interview-me`, `documentation-and-adrs`, `shipping-and-launch` | `skills/diayn-skill-router/references/upstream-routing-map.md` |
| Existing project upgrade | `deprecation-and-migration`, `documentation-and-adrs`, `context-engineering`, `git-workflow-and-versioning` | `skills/diayn-skill-router/references/upstream-routing-map.md` |

## 4. Read-First Mapping

| Role | Read first |
| --- | --- |
| Controller Session | `AGENTS.md` or `CLAUDE.md`, `docs/meta/multi_session_collaboration_protocol.md`, `docs/meta/session_roles.md`, `docs/meta/status_model.md`, current stage and project docs |
| Backend Session | Entry file, `docs/meta/session_roles.md`, `docs/meta/status_model.md`, backend lane board and handoff, relevant shared contracts |
| Frontend Session | Entry file, `docs/meta/session_roles.md`, `docs/meta/status_model.md`, frontend lane board and handoff, relevant shared contracts |
| Review Session | Entry file, `docs/meta/session_roles.md`, `docs/meta/status_model.md`, target lane board, evidence, worklog, handoff, diff, and review criteria |
| Controller Integration Review | Entry file, `docs/meta/multi_session_collaboration_protocol.md`, `docs/meta/status_model.md`, reviewed lane logs, shared contracts, integration evidence |
| Owner Acceptance support | Owner acceptance path, engineering evidence summary, OwnerGate or decision record, stage acceptance criteria |

## 5. Skill Design Rules

`SKILL.md` files should be short workflow entry points. They should include:

- Use When.
- Read First.
- Workflow.
- Allowed Writes.
- Stop Conditions.
- Output Expectations.

Long protocol explanations should link back to `docs/meta/**` or skill `references/**`. Do not copy the full protocol into every skill.

## 6. Conflict Rules

- Role authority in `docs/meta/session_roles.md` overrides any generic engineering skill.
- Status authority in `docs/meta/status_model.md` overrides generic completion language.
- Document permissions in `docs/meta/agent_doc_permissions.md` override tool-specific convenience.
- Session Identity Guard remains a soft preflight and must not be described as a security boundary.
