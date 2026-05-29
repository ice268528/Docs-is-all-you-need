# Release Validation

This document records what has actually been validated for DIAYN V1.

## Current Validation Status

| Validation area | Status | Evidence | Boundary |
| --- | --- | --- | --- |
| Controlled full-stack fixture | `working` | `validation/minimal-fullstack-fixture/`; `DDDV5/stage_outputs/d5_11/d5_11_end_to_end_validation_log.md` | Validates a toy register/login flow with frontend HTML, backend API, and SQLite persistence. |
| `/diayn-*` workflow over controlled fixture | `manual_fallback` | `DDDV5/stage_outputs/d5_11/d5_11_end_to_end_validation_log.md` | Workflow was exercised as documented/manual role simulation plus helper scripts, not as native platform slash-command execution. |
| Codex Skills live install/discovery | `manual_fallback` | `docs/install/codex_skills.md`; `DDDV6/stage_outputs/d6_03/d6_03_codex_install_log.md`; D6-03 discovery evidence | D6-03 copied the eight canonical DIAYN skills into a real local Codex skills directory. Codex discovery or execution was not verified, so support remains `manual_fallback`. |
| Claude Code command discovery | `working` | `docs/install/claude-code.md`; `DDDV6/stage_outputs/d6_04/d6_04_claude_discovery_evidence.md` | D6-04 copied the 12 command files into a temporary project's `.claude/commands/`, Claude Code debug output reported `legacy commands: 12`, and `/diayn-init` execution was observed. This proves project-level manual copy install in the local Claude Code environment, not package/global installation. |
| OpenCode command and skill discovery | `working` | `docs/install/opencode.md`; `DDDV6/stage_outputs/d6_05/d6_05_opencode_discovery_evidence.md` | D6-05 copied the OpenCode adapter into a temporary project's `.opencode/`, verified command/skill wrapper files, observed project skill-wrapper paths in `opencode agent list` output, and observed the 12 DIAYN commands plus 8 wrappers in OpenCode's available command list. This proves project-level discovery, not full model-backed workflow execution. |
| Owner-approved personal-site validation project scaffold | `documented_only` | `DDDV6/validation_projects/personal-site/`; `DDDV6/stage_outputs/d6_06/d6_06_validation_project_inventory.md` | D6-06 creates a runnable front-end/back-end scaffold and DIAYN-style project documents. It does not yet prove the DIAYN workflow, full end-to-end behavior, or Owner acceptance. |
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
- real git worktree creation;
- full DIAYN execution over the D6-06 personal-site validation project;
- Owner acceptance for the D6-06 personal-site validation project;
- Cursor or Copilot support.

Do not upgrade support claims beyond the evidence above until a later validation pass records stronger proof.

## DDDV6 Pre-Smoke Claim Baseline

D6-01 checked the local environment before live smoke tests. These checks do
not upgrade support levels; they only define the baseline for DDDV6 validation.

| Capability | Pre-smoke claim | D6-01 environment note | Upgrade condition |
| --- | --- | --- | --- |
| Codex Skills live discovery | `manual_fallback` | D6-03 copied the eight canonical DIAYN skills into `C:\Users\yiyi_gzhu\.codex\skills`; `codex --version` still failed with access denied and no user-assisted discovery evidence was recorded. | Record live Codex discovery/execution evidence before upgrading to `working`; installation alone is not enough. |
| Claude Code command discovery | `working` | D6-04 copied 12 DIAYN command files into `DDDV6/stage_outputs/d6_04/claude_smoke_project/.claude/commands`, verified hashes against source files, and observed `claude --print "/diayn-init ..."` execute DIAYN Init content. | Keep the claim scoped to project-level manual copy install; do not claim package/global installation. |
| OpenCode command and skill discovery | `working` | D6-05 used temporary `XDG_CONFIG_HOME`, `XDG_DATA_HOME`, and `XDG_STATE_HOME` paths to avoid the default user config/state blocker, copied adapter files into `DDDV6/stage_outputs/d6_05/opencode_smoke_project/.opencode/`, and observed DIAYN command/skill-wrapper discovery. | Keep the claim scoped to project-level discovery; do not claim full model-backed execution or global installation. |
| Owner-approved validation project | `documented_only` | D6-06 created `DDDV6/validation_projects/personal-site` with `backend/`, `frontend/`, `docs/`, `.diayn/`, run commands, verification commands, lane docs, and shared contracts. | Exercise the validation project in later stages with end-to-end evidence before upgrading workflow validation claims. |
