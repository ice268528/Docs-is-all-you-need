# Upstream Routing Map

DIAYN is the multi-session control plane. `third_party/agent-skills` is an optional engineering method library. DIAYN authority wins on role, lane, status, permissions, worktree boundaries, evidence, and Owner acceptance.

Routing is explicit:

1. A DIAYN role skill takes control first.
2. The session confirms identity, lane, command, allowed writes, and stop condition.
3. The router selects only locally vendored upstream `SKILL.md` files that match the task.
4. The session reads those upstream files directly and names them in the report when they materially influenced the work.

Routing is not hidden automatic invocation. Do not claim that Codex, DIAYN, or a DIAYN skill silently calls another third-party skill.

## Audited Vendor Snapshot

D5-05 audited `third_party/agent-skills/skills/**/SKILL.md` and found 23 upstream skills:

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

This set matches the DDDV5 expected baseline. If a downstream copy differs, route only to skills that exist locally and record the difference.

## Route Matrix

| DIAYN context | Owning role/session | Upstream skills to consider | When to read them | DIAYN rules that override | Stop condition |
| --- | --- | --- | --- | --- | --- |
| Fuzzy idea during `/diayn-init` | Controller Session | `interview-me`, `idea-refine`, `spec-driven-development` | After Controller confirms this is intake, before writing lane plans or active tasks. | Owner-confirmed `project_slug`, scope decisions, OwnerGate, repository docs as system of record. | Stop if the idea is still too vague to split into bounded lanes or if Owner decisions are required. |
| Controller planning | Controller Session | `planning-and-task-breakdown`, `context-engineering`, `documentation-and-adrs` | After requirements are good enough to plan and before dispatch handoffs are finalized. | Controller owns global decomposition; lane WIP=1; workers receive one reviewable slice, not a whole stage. | Stop if planning would dispatch vague cross-lane work or modify business code by default. |
| Backend lane execution | Backend Session | `incremental-implementation`, `test-driven-development`, `source-driven-development`, `api-and-interface-design`, `debugging-and-error-recovery`, `security-and-hardening` | After identity and backend handoff pass, before or during one bounded backend slice. | Backend lane permissions, shared-contract authority, worker may mark at most `candidate_done`, no merge or `done`. | Stop after one slice or when dependencies, shared contracts, credentials, or OwnerGate are missing. |
| Frontend lane execution | Frontend Session | `incremental-implementation`, `frontend-ui-engineering`, `browser-testing-with-devtools`, `test-driven-development`, `source-driven-development`, `performance-optimization` | After identity and frontend handoff pass, before or during one bounded frontend slice. | Frontend lane permissions, shared-contract authority, worker may mark at most `candidate_done`, no merge or `done`. | Stop after one slice or when UI behavior cannot be verified honestly. |
| Backend/frontend review | Backend Review Session or Frontend Review Session | `code-review-and-quality`, `doubt-driven-development`, `security-and-hardening`, `browser-testing-with-devtools` for browser-facing work | After the user provides the latest worker report and the reviewer can inspect diff, evidence, and acceptance criteria. | Reviewer decides `done` or `rejected`; missing evidence is not success; reviewer does not mark `owner_accepted`. | Stop if worker report, diff, evidence, or permission boundaries cannot be inspected. |
| Controller integration review | Controller Integration Review | `code-review-and-quality`, `api-and-interface-design`, `ci-cd-and-automation`, `git-workflow-and-versioning`, `debugging-and-error-recovery` | After lane review says `done` and before `ready_for_e2e`. | Controller owns cross-lane readiness; no missing evidence as pass; no merge or release claim outside protocol. | Stop if shared contracts, build/smoke evidence, or lane review records are incomplete. |
| Scaffold upgrade | `update-diayn-scaffold` | `deprecation-and-migration`, `documentation-and-adrs`, `context-engineering`, `git-workflow-and-versioning` | During dry-run inventory and patch proposal for an existing project. | Preserve user content; no silent overwrite; no real worktree, plugin, runtime, or commit from the skill. | Stop for destructive changes, ambiguous existing docs, or Owner decisions. |
| Release readiness | Controller Session or Controller Integration Review | `shipping-and-launch`, `ci-cd-and-automation`, `security-and-hardening`, `performance-optimization`, `code-review-and-quality` | After integration evidence exists and before any release/readiness claim. | Release preparation requires DIAYN evidence, Owner acceptance path, and documented residual risks. | Stop if readiness depends on unverified adapters, missing tests, unresolved OwnerGate, or draft-only support. |

## Conflict Examples

| Upstream guidance pressure | DIAYN authority response |
| --- | --- |
| `planning-and-task-breakdown` suggests global task decomposition in a worker session. | Worker may not own global planning. Route to Controller or stop with `owner_gate` / `blocked` as appropriate. |
| `git-workflow-and-versioning` suggests committing, merging, or resolving cross-branch conflicts. | A lane worker cannot merge or perform integration; checkpoint commits require review/Owner authorization. |
| `test-driven-development` emphasizes technical tests. | Technical tests can be evidence, but Owner acceptance stays business-experience focused. |
| `context-engineering` suggests changing `AGENTS.md`, `CLAUDE.md`, or global rules. | Only sessions with explicit permission may edit global entry or protocol files. |
| `code-review-and-quality` says the code looks good. | DIAYN review still requires evidence, lane scope, permission, status transition, and handoff checks. |
| `browser-testing-with-devtools` requires a Chrome DevTools MCP server. | If the tool is unavailable, record missing browser evidence instead of claiming verification. |

## Reporting Pattern

When routed upstream guidance mattered, include this in the active DIAYN report:

```text
Upstream guidance used:
- <skill-name>: <why it was read>
DIAYN authority applied:
- <role/lane/status/permission/OwnerGate constraint>
Unavailable or skipped:
- <skill-name or none>: <reason>
```

Do not copy upstream instructions into DIAYN protocol files. Route explicitly, read narrowly, and cite the routing decision in the active workflow report when relevant.
