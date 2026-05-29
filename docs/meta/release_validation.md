# Release Validation

This document records what has actually been validated for DIAYN V1.

## Current Validation Status

| Validation area | Status | Evidence | Boundary |
| --- | --- | --- | --- |
| Controlled full-stack fixture | `working` | `validation/minimal-fullstack-fixture/`; `DDDV5/stage_outputs/d5_11/d5_11_end_to_end_validation_log.md` | Validates a toy register/login flow with frontend HTML, backend API, and SQLite persistence. |
| `/diayn-*` workflow over controlled fixture | `manual_fallback` | `DDDV5/stage_outputs/d5_11/d5_11_end_to_end_validation_log.md` | Workflow was exercised as documented/manual role simulation plus helper scripts, not as native platform slash-command execution. |
| Codex Skills live install/discovery | `manual_fallback` | `docs/install/codex_skills.md`; `DDDV6/stage_outputs/d6_03/d6_03_codex_install_log.md`; D6-03 discovery evidence | D6-03 copied the eight canonical DIAYN skills into a real local Codex skills directory. Codex discovery or execution was not verified, so support remains `manual_fallback`. |
| Codex plugin local candidate | `manual_fallback` | `plugins/docs-is-all-you-need/`; `docs/install/codex_plugin_local_candidate.md`; `DDDV6/stage_outputs/d6_09/d6_09_plugin_smoke_evidence.md` | D6-09 created a local plugin candidate with `.codex-plugin/plugin.json` and the eight DIAYN-owned skills. Static fallback validation passed, but `codex --version`, `codex --help`, and `codex plugin --help` returned access denied, so Codex plugin discovery/execution is not verified and must not be claimed as `working`. |
| Claude Code command discovery | `working` | `docs/install/claude-code.md`; `DDDV6/stage_outputs/d6_04/d6_04_claude_discovery_evidence.md` | D6-04 copied the 12 command files into a temporary project's `.claude/commands/`, Claude Code debug output reported `legacy commands: 12`, and `/diayn-init` execution was observed. This proves project-level manual copy install in the local Claude Code environment, not package/global installation. |
| OpenCode command and skill discovery | `working` | `docs/install/opencode.md`; `DDDV6/stage_outputs/d6_05/d6_05_opencode_discovery_evidence.md` | D6-05 copied the OpenCode adapter into a temporary project's `.opencode/`, verified command/skill wrapper files, observed project skill-wrapper paths in `opencode agent list` output, and observed the 12 DIAYN commands plus 8 wrappers in OpenCode's available command list. This proves project-level discovery, not full model-backed workflow execution. |
| Owner-approved personal-site validation project review/integration simulation | `manual_fallback` | `DDDV6/validation_projects/personal-site/`; `DDDV6/stage_outputs/d6_06/d6_06_validation_project_inventory.md`; `DDDV6/stage_outputs/d6_07/d6_07_lane_execution_evidence.md`; `DDDV6/stage_outputs/d6_08/d6_08_review_evidence.md`; `DDDV6/stage_outputs/d6_08/d6_08_integration_evidence.md`; `DDDV6/stage_outputs/d6_08/d6_08_owner_acceptance_evidence.md` | D6-08 reviewed the D6-07 backend/frontend candidate slices as `done`, ran Controller sync/integration to `ready_for_e2e`, and prepared Owner-facing acceptance material. This is still sequential validation, not true concurrent multi-session execution, real worktree execution, browser evidence, production validation, or explicit Owner `owner_accepted`. |
| Release candidate packaging notes | `documented_only` | `RELEASE_NOTES.md`; `DDDV6/stage_outputs/d6_10/d6_10_release_candidate_notes.md` | D6-10 generated release-candidate notes from existing evidence. It did not publish, push, create a commit, or upgrade unsupported capabilities. |
| D6-11 final truth audit | `documented_only` | `DDDV6/stage_outputs/d6_11/d6_11_truth_audit.md`; `DDDV6/stage_outputs/d6_11/d6_11_release_decision.md` | D6-11 found the core README/install/release claims conservative, but kept the release gate at `beta_only` because Claude Code/OpenCode adapter docs under `integrations/**` still contain stale `manual_fallback` and "smoke test not run" wording that conflicts with D6-04/D6-05 evidence. |
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
- release-candidate readiness while `integrations/claude-code/adapter.md`,
  `integrations/claude-code/commands_plan.md`,
  `integrations/opencode/adapter.md`, and
  `integrations/opencode/rules_plan.md` still conflict with D6-04/D6-05 support
  evidence.

Do not upgrade support claims beyond the evidence above until a later validation pass records stronger proof.

## DDDV6 Pre-Smoke Claim Baseline

D6-01 checked the local environment before live smoke tests. These checks do
not upgrade support levels; they only define the baseline for DDDV6 validation.

| Capability | Pre-smoke claim | D6-01 environment note | Upgrade condition |
| --- | --- | --- | --- |
| Codex Skills live discovery | `manual_fallback` | D6-03 copied the eight canonical DIAYN skills into `C:\Users\yiyi_gzhu\.codex\skills`; `codex --version` still failed with access denied and no user-assisted discovery evidence was recorded. | Record live Codex discovery/execution evidence before upgrading to `working`; installation alone is not enough. |
| Codex plugin local candidate | `manual_fallback` | D6-09 created `plugins/docs-is-all-you-need/` with a local `.codex-plugin/plugin.json` and copied the eight DIAYN-owned skills into the candidate. The plugin-creator validator could not run under the available Python environments because `yaml` was missing, so a fallback static validator checked manifest shape and skill frontmatter. `codex` CLI discovery commands still failed with access denied. | Keep as `manual_fallback` until the official/local validator runs cleanly and Codex plugin discovery or execution is observed. |
| Claude Code command discovery | `working` | D6-04 copied 12 DIAYN command files into `DDDV6/stage_outputs/d6_04/claude_smoke_project/.claude/commands`, verified hashes against source files, and observed `claude --print "/diayn-init ..."` execute DIAYN Init content. | Keep the claim scoped to project-level manual copy install; do not claim package/global installation. |
| OpenCode command and skill discovery | `working` | D6-05 used temporary `XDG_CONFIG_HOME`, `XDG_DATA_HOME`, and `XDG_STATE_HOME` paths to avoid the default user config/state blocker, copied adapter files into `DDDV6/stage_outputs/d6_05/opencode_smoke_project/.opencode/`, and observed DIAYN command/skill-wrapper discovery. | Keep the claim scoped to project-level discovery; do not claim full model-backed execution or global installation. |
| Owner-approved validation project | `manual_fallback` | D6-07 sequentially simulated `/diayn-init`, `/diayn-plan`, `/diayn-worktrees`, `/diayn-backend`, and `/diayn-frontend`; D6-08 sequentially simulated `/diayn-review-backend`, `/diayn-review-frontend`, `/diayn-sync`, `/diayn-integration`, and `/diayn-html`; backend/frontend slices reached review `done`; integration reached `ready_for_e2e`; Owner acceptance remains `owner_gate`. | Keep claim scoped to sequential workflow simulation until separate sessions, real worktrees or browser evidence, and explicit Owner `owner_accepted` feedback are recorded. |

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
