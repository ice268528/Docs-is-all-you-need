# Minimal Full-Stack Fixture

This fixture is for D5-11 controlled DIAYN validation.

It is not a real-project validation target and is not core DIAYN protocol.

## Purpose

Exercise a small backend/frontend/shared flow with durable evidence:

- backend API for register/login;
- frontend HTML that calls the API;
- SQLite persistence checked by the validation runner;
- DIAYN workflow records that can map `/diayn-init` through Owner acceptance.

## Run

From the repository root:

```powershell
python validation/minimal-fullstack-fixture/validation/run_e2e.py
```

The runner starts the backend on a local ephemeral port, requests the frontend
HTML, performs register/login API calls, checks duplicate and bad-login errors,
and verifies the saved SQLite record. It uses only the Python standard library.

## Support Boundary

This validates a controlled fixture only. It does not prove:

- real-project readiness;
- native slash-command execution in Codex, Claude Code, or OpenCode;
- package installation or marketplace behavior;
- production security of the toy auth flow.
