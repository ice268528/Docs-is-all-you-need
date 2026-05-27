# `/diayn-frontend`
## Role

Frontend Session.

## User Input Scenario

The user has opened the frontend worktree and started a new coding-agent session.

```text
/diayn-frontend
```

## Preconditions

- Current directory matches `../worktrees/<project_slug>/frontend` or the manifest's frontend path.
- Local identity, if present, allows `/diayn-frontend`.
- Frontend board and handoff are visible.

## Required Reading

- Entry file.
- `.diayn/local/session_identity.md`, if present.
- `.diayn/worktree_manifest.md`, if visible.
- `docs/lanes/frontend/board.md`
- `docs/lanes/frontend/handoff.md`
- `docs/shared/**` relevant to the task.
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`

## Allowed Writes

- Frontend implementation and tests authorized by the active task.
- `docs/lanes/frontend/board.md`
- `docs/lanes/frontend/evidence.md`
- `docs/lanes/frontend/worklog.md`
- Frontend handoff notes when needed.

## Forbidden

- Do not modify global `TODO.md`.
- Do not modify backend lane documents or backend code.
- Do not silently modify shared contracts.
- Do not merge branches.
- Do not mark `done`, `ready_for_e2e`, or `owner_accepted`.
- Do not continue through the whole lane automatically.

## Status Changes

- One frontend task may move `todo -> doing -> candidate_done`.
- If not feasible, use `blocked` or `owner_gate` with a reason.
- Never convert `candidate_done` to `done`.

## Required Records

- Frontend evidence.
- Frontend worklog.
- Frontend board status.
- Handoff note if the reviewer or Controller needs context.

## Stop Conditions

- Identity or lane mismatch.
- Required documents are invisible.
- The selected task is unreasonable, infeasible, too large, or missing dependencies.
- The task needs backend, global, shared contract, architecture, scope, or Owner decision changes.
- One task slice is complete.

## Success Output

Report:

- Identity confirmed.
- Task slice selected and why it was reasonable.
- Files changed.
- Verification run or not run.
- Evidence and worklog written.
- Status, at most `candidate_done`.
- Ask the user to send the report to `/diayn-review-frontend`.

Identity mismatch output: `../diayn_command_reference.md#2-common-identity-mismatch-output`.

## Identity Mismatch Behavior

Use the common Session Identity Guard behavior and mismatch output defined in `../diayn_command_reference.md#2-common-identity-mismatch-output`. Stop rather than continuing whenever role, lane, path, manifest, local identity, requested command, or write boundary do not match this command.
