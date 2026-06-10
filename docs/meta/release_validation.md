# Release Validation

This document records historical D5/D6 validation evidence. After the DDDV8
requirements reset, these entries are implementation inputs only. They do not
prove the new 12-workflow-skill install model, native `/diayn-*` invocation, or
DIAYN-managed third-party dependency-skill routing.

Current DDDV8 evidence lives in `validation/phase9_release_gate.json`,
`validation/dddv8_requirement_completion_audit.json`, and
`docs/meta/diayn_v1_completion_audit.md`. As of the DDDV8 audit, the supported
alpha surfaces are `claude_code_cli_project_local` and `codex_package_install`.
The Claude project-local package has a complete installed-flow fixture, focused
side scenarios, and Claude skill-creator alignment record. Codex project-local
`.codex/skills` package shape plus project-local and Codex-home install fixtures
are validated through install commands and directory inspection. Per Owner
instruction, Codex Desktop app-session runtime discovery/invocation is not
attempted and not claimed. The new isolated Codex plugin candidate under
`plugins/codex/marketplace.json` and `plugins/codex/plugins/diayn/` is packaging material
only until Desktop runtime evidence exists. The external evidence validator
remains available as optional future Desktop runtime evidence tooling.
The Claude skill-creator alignment record prepares trigger eval seed sets and
documents the future with-skill vs baseline benchmark path, but it deliberately
does not claim that a benchmark or broad automatic-trigger optimization has
already been run.

## Historical D5/D6 Validation Status

| Validation area | Status | Evidence | Boundary |
| --- | --- | --- | --- |
| Claude skill-creator alignment | `scoped_project_local_alignment` | `docs/meta/claude_skill_creator_eval_alignment.md`; `validation/claude_skill_creator_trigger_eval_sets.json`; `validation/phase9_claude_skill_creator_alignment.json` | Aligns DIAYN's Claude project-local package with the local Claude `skill-creator` structure, progressive disclosure, runtime evidence, and prepared trigger evals. It does not claim a completed with-skill vs baseline benchmark or marketplace/plugin bare-command proof. |
| Controlled full-stack fixture | `working` | `validation/minimal-fullstack-fixture/`; `DDDV5/stage_outputs/d5_11/d5_11_end_to_end_validation_log.md` | Validates a toy register/login flow with frontend HTML, backend API, and SQLite persistence. |
| `/diayn-*` workflow over controlled fixture | `manual_fallback` | `DDDV5/stage_outputs/d5_11/d5_11_end_to_end_validation_log.md` | Workflow was exercised as documented/manual role simulation plus helper scripts, not as native platform slash-command execution. |
| Codex Skills package/install | `package_install_validated_app_session_runtime_not_attempted` | `docs/install/codex_skills.md`; `validation/phase9_codex_project_local_package.json`; `validation/phase9_codex_project_local_install_fixture.json`; `validation/phase9_codex_home_install_fixture.json` | Current DDDV8 supersedes historical D6 install evidence with `packages/codex-project-local/` and validated package/install fixtures. Desktop app-session discovery/execution is intentionally outside the current scope and must not be claimed. |
| Codex plugin local candidate | `candidate_runtime_not_verified` | `plugins/codex/marketplace.json`; `plugins/codex/plugins/diayn/`; `docs/install/codex_plugin_local_candidate.md`; `docs/qa/codex-plugin-runtime-acceptance.md` | The isolated Codex candidate uses `skills: ./skills/` and packages 12 public workflow skills plus 23 DIAYN-managed dependency skills. This does not upgrade Codex support beyond package/install until Codex Desktop marketplace install, discovery, invocation, and dependency routing evidence exists. |
| Claude Code command discovery | `working` | `docs/install/claude-code.md`; `DDDV6/stage_outputs/d6_04/d6_04_claude_discovery_evidence.md` | D6-04 copied the 12 command files into a temporary project's `.claude/commands/`, Claude Code debug output reported `legacy commands: 12`, and `/diayn-init` execution was observed. This proves project-level manual copy install in the local Claude Code environment, not package/global installation. |
| OpenCode command and skill discovery | `working` | `docs/install/opencode.md`; `DDDV6/stage_outputs/d6_05/d6_05_opencode_discovery_evidence.md` | D6-05 copied the OpenCode adapter into a temporary project's `.opencode/`, verified command/skill wrapper files, observed project skill-wrapper paths in `opencode agent list` output, and observed the 12 DIAYN commands plus 8 wrappers in OpenCode's available command list. This proves project-level discovery, not full model-backed workflow execution. |
| approved personal-site validation project review/integration simulation | `manual_fallback` | `DDDV6/validation_projects/personal-site/`; `DDDV6/stage_outputs/d6_06/d6_06_validation_project_inventory.md`; `DDDV6/stage_outputs/d6_07/d6_07_lane_execution_evidence.md`; `DDDV6/stage_outputs/d6_08/d6_08_review_evidence.md`; `DDDV6/stage_outputs/d6_08/d6_08_integration_evidence.md`; `DDDV6/stage_outputs/d6_08/d6_08_owner_acceptance_evidence.md` | D6-08 reviewed the D6-07 backend/frontend candidate slices as `done`, ran Controller sync/integration to `ready_for_e2e`, and prepared Owner-facing acceptance material. This is still sequential validation, not true concurrent multi-session execution, real worktree execution, browser evidence, production validation, or explicit Owner `owner_accepted`. |
| Release candidate packaging notes | `documented_only` | `RELEASE_NOTES.md`; `DDDV6/stage_outputs/d6_10/d6_10_release_candidate_notes.md` | D6-10 generated release-candidate notes from existing evidence. It did not publish, push, create a commit, or upgrade unsupported capabilities. |
| D6-11 final truth audit and blocker repair | `documented_only` | `DDDV6/stage_outputs/d6_11/d6_11_truth_audit.md`; `DDDV6/stage_outputs/d6_11/d6_11_release_decision.md`; `DDDV6/stage_outputs/d6_11/d6_11_blocker_repair_summary.md` | Initial D6-11 kept the release gate at `beta_only` because Claude Code/OpenCode adapter docs conflicted with D6-04/D6-05 evidence. The D6-11 blocker repair aligned those adapter docs with scoped `working` evidence. It did not publish, tag, claim full release, or upgrade Codex Skills/Codex plugin beyond `manual_fallback`. |
| Real-project validation | `missing` | None | No Owner-approved real project was used in D5-11. |

## Controlled Fixture

The controlled fixture lives at:

```text
validation/minimal-fullstack-fixture/
```

It contains:

- `backend/app.py`: Python standard-library HTTP API with SQLite persistence.
- `frontend/index.html`: static HTML form that calls register/login APIs.
- `shared/api_contract.md`: backend/frontend contract used for validation.
- `validation/run_e2e.py`: stdlib validation runner.

The D5-11 run verified:

- backend health endpoint;
- frontend HTML served and wired to `/api/register` and `/api/login`;
- successful user registration;
- successful user login;
- duplicate registration rejection;
- bad-login rejection;
- SQLite record persistence.

## Not Yet Validated

D5-11 does not prove:

- real-project readiness;
- production security or deployment readiness;
- native slash-command execution in Codex;
- full model-backed OpenCode DIAYN workflow execution;
- packaged or globally installed Claude Code command support;
- marketplace or package installation;
- working Codex plugin discovery/execution;
- real git worktree creation;
- true concurrent DIAYN execution over the personal-site validation project;
- explicit Owner `owner_accepted` feedback for the personal-site validation project;
- browser-level evidence for the personal-site validation project;
- true concurrent multi-session execution over the personal-site validation project;
- real worktree execution for the personal-site validation project;
- Cursor or Copilot support.
- upstream `agent-skills` freshness in the vendored copy beyond commit `250ffaa`.
- release-candidate readiness unless a separate release-candidate gate accepts
  the remaining beta boundaries and publishing authorization exists.

Do not upgrade support claims beyond the evidence above until a later validation pass records stronger proof.

## DDDV6 Pre-Smoke Claim Baseline

D6-01 checked the local environment before live smoke tests. These checks do
not upgrade support levels; they only define the baseline for DDDV6 validation.

| Capability | Pre-smoke claim | D6-01 environment note | Upgrade condition |
| --- | --- | --- | --- |
| Codex Skills package/install | `package_install_validated_app_session_runtime_not_attempted` | Current DDDV8 has rebuilt the package around the 12 public workflow skills and 23 dependency skills, with committed project-local and Codex-home install fixtures. | Do not upgrade this to Desktop runtime support without separate app-session evidence. |
| Codex plugin local candidate | `candidate_runtime_not_verified` | Current DDDV8 has an isolated marketplace candidate at `plugins/codex/marketplace.json` and `plugins/codex/plugins/diayn/`. Historical root `.codex-plugin/` and `plugins/docs-is-all-you-need/.codex-plugin/` material is legacy candidate material, not runtime proof. | Do not claim Desktop app-session discovery/execution without separate runtime evidence. |
| Claude Code command discovery | `working` | D6-04 copied 12 DIAYN command files into `DDDV6/stage_outputs/d6_04/claude_smoke_project/.claude/commands`, verified hashes against source files, and observed `claude --print "/diayn-init ..."` execute DIAYN Init content. | Keep the claim scoped to project-level manual copy install; do not claim package/global installation. |
| OpenCode command and skill discovery | `working` | D6-05 used temporary `XDG_CONFIG_HOME`, `XDG_DATA_HOME`, and `XDG_STATE_HOME` paths to avoid the default user config/state blocker, copied adapter files into `DDDV6/stage_outputs/d6_05/opencode_smoke_project/.opencode/`, and observed DIAYN command/skill-wrapper discovery. | Keep the claim scoped to project-level discovery; do not claim full model-backed execution or global installation. |
| approved validation project | `manual_fallback` | D6-07 sequentially simulated `/diayn-init`, `/diayn-plan`, `/diayn-worktrees`, `/diayn-backend`, and `/diayn-frontend`; D6-08 sequentially simulated `/diayn-review-backend`, `/diayn-review-frontend`, `/diayn-sync`, `/diayn-integration`, and `/diayn-html`; backend/frontend slices reached review `done`; integration reached `ready_for_e2e`; Owner acceptance remains `owner_gate`. | Keep claim scoped to sequential workflow simulation until separate sessions, real worktrees or browser evidence, and explicit Owner `owner_accepted` feedback are recorded. |

## D6-10 Upstream Freshness Check

| Item | Result |
| --- | --- |
| Vendor lock source URL | `git@github.com:addyosmani/agent-skills.git` |
| Vendor lock source commit | `250ffaa` |
| Local outer `agent-skills/` source commit | `250ffaa` |
| Local source/vendor dry-run | No material skill diff; 23 source skills and 23 vendored skills; watched skills unchanged. |
| Network freshness command | `git ls-remote https://github.com/addyosmani/agent-skills.git HEAD` |
| Network freshness result | Remote HEAD `6ce029897d2b794940325fc7148774a6ec51111c` |
| Freshness decision | Vendored snapshot is not current relative to remote HEAD. |
| D6-10 vendor copy action | None. `third_party/agent-skills/**` was not modified. |

D6-10 records that upstream has moved beyond the vendored snapshot. It does not
claim the vendor copy is fresh and does not update `vendor.lock.md` because no
reviewed vendor copy update was performed.
