# Release Validation

This document records what has actually been validated for DIAYN V1.

## Current Validation Status

| Validation area | Status | Evidence | Boundary |
| --- | --- | --- | --- |
| Controlled full-stack fixture | `working` | `validation/minimal-fullstack-fixture/`; `DDDV5/stage_outputs/d5_11/d5_11_end_to_end_validation_log.md` | Validates a toy register/login flow with frontend HTML, backend API, and SQLite persistence. |
| `/diayn-*` workflow over controlled fixture | `manual_fallback` | `DDDV5/stage_outputs/d5_11/d5_11_end_to_end_validation_log.md` | Workflow was exercised as documented/manual role simulation plus helper scripts, not as native platform slash-command execution. |
| Codex Skills live install/discovery | `manual_fallback` | `docs/install/codex_skills.md`; D5-04 review result | Manual copy path exists; live Codex discovery was not smoke-tested in this validation. |
| Claude Code command discovery | `manual_fallback` | `docs/install/claude-code.md`; D5-07 review result | Command files exist; local Claude Code discovery/execution was not smoke-tested. |
| OpenCode command and skill discovery | `manual_fallback` | `docs/install/opencode.md`; D5-08 review result | Adapter files exist; local OpenCode discovery/execution was not smoke-tested. |
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
- native slash-command execution in Codex, Claude Code, or OpenCode;
- marketplace or package installation;
- real git worktree creation;
- Cursor or Copilot support.

Do not upgrade support claims beyond the evidence above until a later validation pass records stronger proof.
