# DIAYN-Managed `agent-skills` Routing Map

DIAYN is the multi-session control plane. Third-party `agent-skills` are DIAYN-managed engineering dependencies, not public DIAYN commands and not a replacement for DIAYN role, lane, state, review, integration, evidence, or Owner authority.

## Invocation Contract

Normal composition:

1. A public `/diayn-*` workflow takes control.
2. DIAYN confirms command identity, role concept, lane, worktree, write boundary, and stop conditions.
3. The router selects the smallest relevant dependency skill set.
4. The platform invokes the DIAYN-managed locked dependency skill through native nested skill invocation or an equivalent native skill tool call.
5. DIAYN records routing evidence only when it materially affects the result or package validation.

Fallback only:

- Directly reading `third_party/agent-skills/skills/<name>/SKILL.md` is fallback/reference behavior.
- A fallback read does not count as native third-party skill composition evidence.
- Do not silently substitute an uncontrolled user-installed `agent-skills` copy.

## Workflow Routing Matrix

| DIAYN workflow | Dependency skills to consider | Rationale | DIAYN override |
| --- | --- | --- | --- |
| `/diayn-init` fuzzy idea | `interview-me`, `idea-refine`, `spec-driven-development` | Clarify what the Owner actually wants before scaffold edits. | Owner decisions, `Unknown`, and `OwnerGate` remain explicit. |
| `/diayn-init` retrofit audit | `deprecation-and-migration`, `documentation-and-adrs`, `context-engineering`, `git-workflow-and-versioning` | Produce a dry-run-first scaffold retrofit without losing existing content. | No silent overwrite, no destructive Git action, no requirement mutation. |
| `/diayn-plan` | `planning-and-task-breakdown`, `context-engineering`, `documentation-and-adrs`, `api-and-interface-design` | Turn accepted requirements into stages, lane slices, contracts, and acceptance criteria. | Controller owns decomposition; workers receive one reviewable slice. |
| `/diayn-worktrees` | `git-workflow-and-versioning`, `context-engineering` | Prepare lane worktrees and fresh-session context safely. | DIAYN manifest, dirty-state preflight, authorization, and lane WIP rule win. |
| `/diayn-backend` | `incremental-implementation`, `test-driven-development`, `source-driven-development`, `api-and-interface-design`, `debugging-and-error-recovery`, `security-and-hardening` | Guide one backend slice with evidence and contract awareness. | Backend lane scope only; worker stops at `candidate_done`. |
| `/diayn-frontend` | `incremental-implementation`, `test-driven-development`, `source-driven-development`, `frontend-ui-engineering`, `browser-testing-with-devtools`, `performance-optimization` | Guide one frontend slice with UI/runtime evidence. | Frontend lane scope only; worker stops at `candidate_done`. |
| `/diayn-review-backend` | `code-review-and-quality`, `doubt-driven-development`, `test-driven-development`, `security-and-hardening`, `debugging-and-error-recovery` | Support independent QA/test-development review. | Reviewer decides `done` or `rejected`; implementation fixes require Owner-approved role switch. |
| `/diayn-review-frontend` | `code-review-and-quality`, `doubt-driven-development`, `test-driven-development`, `browser-testing-with-devtools`, `frontend-ui-engineering`, `security-and-hardening` | Support independent UI/runtime review. | Reviewer decides `done` or `rejected`; implementation fixes require Owner-approved role switch. |
| `/diayn-sync` | `context-engineering`, `documentation-and-adrs` | Synchronize durable lane state and handoff context. | `/diayn-sync` never merges business code. |
| `/diayn-integration` | `code-review-and-quality`, `api-and-interface-design`, `git-workflow-and-versioning`, `ci-cd-and-automation`, `debugging-and-error-recovery`, `shipping-and-launch`, `security-and-hardening`, `performance-optimization` | Check reviewed-code integration, contracts, quality gates, and readiness evidence. | Only reviewed work integrates; only Owner acceptance creates `owner_accepted`. |
| `/diayn-bug` | `debugging-and-error-recovery`, `doubt-driven-development`, `test-driven-development`, `security-and-hardening`, `deprecation-and-migration` | Classify defects, acceptance failures, and rollback impact before routing. | Controller triages; lane worker fixes after routing; destructive rollback needs OwnerGate. |
| `/diayn-new` | `interview-me`, `idea-refine`, `spec-driven-development`, `planning-and-task-breakdown`, `deprecation-and-migration`, `documentation-and-adrs` | Capture requirement changes and supersede old requirements visibly. | DIAYN never changes Owner requirements silently. |
| `/diayn-html` | `documentation-and-adrs`, `shipping-and-launch` | Prepare Owner-facing decision aids or acceptance summaries. | Markdown remains durable authority; do not expose secrets or private logs. |

## Full Vendored Skill Coverage

Every vendored upstream skill has an explicit routing rationale:

| Dependency skill | Primary DIAYN workflow use | Rationale |
| --- | --- | --- |
| `api-and-interface-design` | `/diayn-plan`, `/diayn-backend`, `/diayn-integration` | Shared contract and interface consistency. |
| `browser-testing-with-devtools` | `/diayn-frontend`, `/diayn-review-frontend` | Browser/runtime evidence for user-facing work. |
| `ci-cd-and-automation` | `/diayn-integration` | Build and pipeline readiness checks. |
| `code-review-and-quality` | review commands, `/diayn-integration` | Structured quality review before acceptance. |
| `code-simplification` | backend/frontend workers after correctness | Optional simplification after verified behavior; never replaces required checks. |
| `context-engineering` | `/diayn-init`, `/diayn-plan`, `/diayn-worktrees`, `/diayn-sync` | Progressive disclosure and fresh-session context packing. |
| `debugging-and-error-recovery` | worker commands, review commands, `/diayn-integration`, `/diayn-bug` | Failure triage and recovery. |
| `deprecation-and-migration` | retrofit init, `/diayn-bug`, `/diayn-new` | Scaffold migration, superseded requirements, rollback impact. |
| `documentation-and-adrs` | init, plan, sync, new, html | Durable repository docs and decision records. |
| `doubt-driven-development` | review commands, `/diayn-bug` | Adversarial verification when claims are cheap to doubt now. |
| `frontend-ui-engineering` | `/diayn-frontend`, `/diayn-review-frontend` | UI architecture, accessibility, and interaction quality. |
| `git-workflow-and-versioning` | init retrofit, worktrees, integration | Git/worktree safety and reviewed integration. |
| `idea-refine` | `/diayn-init`, `/diayn-new` | Convert rough Owner ideas into concrete choices. |
| `incremental-implementation` | backend/frontend workers | Keep implementation to one reviewable lane slice. |
| `interview-me` | `/diayn-init`, `/diayn-new` | Ask focused questions when requirements are vague. |
| `performance-optimization` | frontend worker, integration | Measure performance only when requirements or evidence justify it. |
| `planning-and-task-breakdown` | `/diayn-plan`, `/diayn-new` | Split confirmed work into bounded stages and slices. |
| `security-and-hardening` | workers, reviewers, integration, bug triage | Sensitive data, auth, input, and dependency checks. |
| `shipping-and-launch` | `/diayn-integration`, `/diayn-html` | Release/acceptance readiness and rollback communication. |
| `source-driven-development` | backend/frontend workers | Use authoritative sources for framework/library decisions. |
| `spec-driven-development` | `/diayn-init`, `/diayn-new` | Produce explicit specs before coding. |
| `test-driven-development` | workers and reviewers | Tests as implementation and review evidence. |
| `using-agent-skills` | router/package validation | Dependency-pack discovery and shared upstream operating guidance; do not let it override DIAYN. |

## Dependency Selection Rules

- Start with the smallest relevant dependency skill set.
- Add another dependency skill only when the task needs its process.
- Use the DIAYN-managed locked dependency copy by default.
- Gate or reject an uncontrolled user-installed copy whose provenance, version, names, or routing compatibility do not match DIAYN metadata.
- Keep normal user output low-noise.
- Record invocation mode as `native`, `equivalent-native-tool`, or `fallback-read-only` when evidence matters.

## Reporting Pattern

Use this only when routing evidence materially matters:

```text
DIAYN dependency routing:
- skill: <agent-skills:name>
- reason: <why this process applies>
- invocation mode: <native/equivalent-native-tool/fallback-read-only>
- lock source: <DIAYN-managed source commit>
- DIAYN authority retained: <role/lane/state/permission/review/Owner constraints>
```
