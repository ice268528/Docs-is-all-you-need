# DIAYN Dependency Routing Map

This project map lets DIAYN workflow skills route to the DIAYN-managed third-party `agent-skills` dependency skills installed with DIAYN. These dependency skills are native-callable implementation dependencies, not extra public DIAYN commands and not text-only references.

## Invocation Contract

1. A `/diayn-*` or `/diayn:*` workflow takes control first.
2. DIAYN keeps role, lane, document authority, write boundary, review, integration, and OwnerGate rules in force.
3. The workflow selects the smallest relevant dependency skill set.
4. The active platform invokes the selected DIAYN-managed dependency skill natively when relevant.
5. Directly reading a vendored `SKILL.md` is fallback/reference behavior only and does not count as native third-party composition evidence.

## Skill Id Resolution

- Claude Code project-local fallback: use dependency skill ids such as `idea-refine`.
- Claude Code plugin namespace: use `diayn:<dependency-skill>` when the native Skill tool requires namespaced ids.
- Codex/OpenCode/generic project-local: use the dependency skill id discovered from the installed skills root.

## Workflow Routing

| DIAYN workflow | Dependency skills to consider |
| --- | --- |
| `/diayn-init` fuzzy idea | `interview-me`, `idea-refine`, `spec-driven-development` |
| `/diayn-init` retrofit audit | `deprecation-and-migration`, `documentation-and-adrs`, `context-engineering`, `git-workflow-and-versioning` |
| `/diayn-plan` | `planning-and-task-breakdown`, `context-engineering`, `documentation-and-adrs`, `api-and-interface-design` |
| `/diayn-worktrees` | `git-workflow-and-versioning`, `context-engineering` |
| `/diayn-backend` | `incremental-implementation`, `test-driven-development`, `source-driven-development`, `api-and-interface-design`, `debugging-and-error-recovery`, `security-and-hardening` |
| `/diayn-frontend` | `incremental-implementation`, `test-driven-development`, `source-driven-development`, `frontend-ui-engineering`, `browser-testing-with-devtools`, `performance-optimization` |
| `/diayn-review-backend` | `code-review-and-quality`, `doubt-driven-development`, `test-driven-development`, `security-and-hardening`, `debugging-and-error-recovery` |
| `/diayn-review-frontend` | `code-review-and-quality`, `doubt-driven-development`, `test-driven-development`, `browser-testing-with-devtools`, `frontend-ui-engineering`, `security-and-hardening` |
| `/diayn-sync` | `context-engineering`, `documentation-and-adrs` |
| `/diayn-integration` | `code-review-and-quality`, `api-and-interface-design`, `git-workflow-and-versioning`, `ci-cd-and-automation`, `debugging-and-error-recovery`, `shipping-and-launch`, `security-and-hardening`, `performance-optimization` |
| `/diayn-bug` | `debugging-and-error-recovery`, `doubt-driven-development`, `test-driven-development`, `security-and-hardening`, `deprecation-and-migration` |
| `/diayn-new` | `interview-me`, `idea-refine`, `spec-driven-development`, `planning-and-task-breakdown`, `deprecation-and-migration`, `documentation-and-adrs` |
| `/diayn-html` | `documentation-and-adrs`, `shipping-and-launch` |

## Full Dependency Coverage

| Dependency skill | Primary DIAYN use |
| --- | --- |
| `api-and-interface-design` | shared API/interface contracts |
| `browser-testing-with-devtools` | frontend runtime and UI review evidence |
| `ci-cd-and-automation` | integration build and pipeline readiness |
| `code-review-and-quality` | reviewer and integration quality checks |
| `code-simplification` | optional simplification after correctness is proven |
| `context-engineering` | progressive disclosure and fresh-session context |
| `debugging-and-error-recovery` | failure triage and recovery |
| `deprecation-and-migration` | retrofit, superseded requirements, rollback impact |
| `documentation-and-adrs` | durable docs, ADRs, reports |
| `doubt-driven-development` | adversarial review and bug triage |
| `frontend-ui-engineering` | frontend implementation and review quality |
| `git-workflow-and-versioning` | worktree, branch, merge, and integration safety |
| `idea-refine` | rough idea refinement |
| `incremental-implementation` | bounded worker implementation slices |
| `interview-me` | focused Owner clarification |
| `performance-optimization` | measured performance work |
| `planning-and-task-breakdown` | stage and task decomposition |
| `security-and-hardening` | auth, data, input, dependency, and secret safety |
| `shipping-and-launch` | release and acceptance readiness |
| `source-driven-development` | source-backed framework/library decisions |
| `spec-driven-development` | explicit specs from confirmed intent |
| `test-driven-development` | tests as implementation and review evidence |
| `using-agent-skills` | dependency-pack discovery guidance only; DIAYN authority still wins |

