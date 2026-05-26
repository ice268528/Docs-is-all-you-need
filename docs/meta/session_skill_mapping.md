# Session Skill Mapping

> This document maps multi-session roles to DIAYN-owned skills and optional upstream engineering skill references. DIAYN-owned skills and the upstream vendor snapshot already exist in this repository; ordinary `/diayn` users do not need to understand vendor sync details.

## 1. Current Boundary

This file defines the mapping layer only. It does not install, invoke, overwrite, or replace any skill, adapter, or vendor content.

Current facts:

- DIAYN-owned skills live under `skills/**`.
- The upstream `agent-skills` snapshot lives under `third_party/agent-skills/**` for maintainer reference.
- Tool adapters and plugin preparation notes live under `integrations/**`.
- If a listed skill is missing in a downstream scaffold, treat the row as a mapping expectation, not as an executable capability.

## 2. Local DIAYN Skill Mapping

| Role | DIAYN-owned skill | Purpose |
| --- | --- | --- |
| Controller Session | `multi-session-controller` | Planning, lane dispatch, sync, integration readiness, global summaries |
| Backend Session | `multi-session-executor` | Lane-local execution and evidence writing |
| Frontend Session | `multi-session-executor` | Lane-local execution and evidence writing |
| Backend Review Session | `multi-session-reviewer` | Lane diff, evidence, permission, and acceptance review |
| Frontend Review Session | `multi-session-reviewer` | Lane diff, evidence, permission, and acceptance review |
| Controller Integration Review | `multi-session-integrator` | Cross-lane contract and integration checks |
| All `/diayn ...` sessions | `session-identity-guard` | Soft preflight against role, lane, directory, and manifest mismatch |
| Owner Acceptance and OwnerGate support | `owner-decision-ux` | Human-readable decision and acceptance support |

## 3. Upstream Skill Mapping

The upstream `agent-skills` project is a method library for single-session engineering behavior. DIAYN remains the multi-session control plane. When upstream guidance conflicts with DIAYN role, status, or document authority, DIAYN protocol wins.

Stage 07 vendors the upstream snapshot under `third_party/agent-skills/` for maintainer reference. Ordinary `/diayn` users do not need to understand vendor sync details. Maintainers must review upstream changes through `maintainers/upstream-agent-skills/` before adapting them into DIAYN docs or skills.

Watched upstream areas:

- Direct tracking: `test-driven-development`, `incremental-implementation`, `code-review-and-quality`, `git-workflow-and-versioning`.
- Needs DIAYN adaptation: `planning-and-task-breakdown`, `context-engineering`, `documentation-and-adrs`, `api-and-interface-design`.
- Reference only: orchestration patterns, tool-specific setup docs, and slash command implementations.

| Role | Useful upstream skill categories |
| --- | --- |
| Controller Session | `planning-and-task-breakdown`, `context-engineering`, `documentation-and-adrs`, `git-workflow-and-versioning` |
| Backend Session | `incremental-implementation`, `test-driven-development`, `source-driven-development`, `api-and-interface-design` |
| Frontend Session | `incremental-implementation`, `test-driven-development`, `source-driven-development`, `frontend-ui-engineering` |
| Backend Review Session | `code-review-and-quality`, `security-and-hardening`, `debugging-and-error-recovery` |
| Frontend Review Session | `code-review-and-quality`, `browser-testing-with-devtools`, `frontend-ui-engineering` |
| Controller Integration Review | `code-review-and-quality`, `api-and-interface-design`, `git-workflow-and-versioning`, `ci-cd-and-automation` |
| Owner Acceptance support | `idea-refine`, `documentation-and-adrs`, `shipping-and-launch` |

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
