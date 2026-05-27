# `/diayn-backend`
## Role

Backend Session.

## User Input Scenario

The user has opened the backend worktree and started a new coding-agent session.

```text
/diayn-backend
```

## Preconditions

- Current directory matches `../worktrees/<project_slug>/backend` or the manifest's backend path.
- Local identity, if present, allows `/diayn-backend`.
- Backend board and handoff are visible.

## Required Reading

- Entry file.
- `.diayn/local/session_identity.md`, if present.
- `.diayn/worktree_manifest.md`, if visible.
- `docs/lanes/backend/board.md`
- `docs/lanes/backend/handoff.md`
- `docs/shared/**` relevant to the task.
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`

## Allowed Writes

- Backend implementation and tests authorized by the active task.
- `docs/lanes/backend/board.md`
- `docs/lanes/backend/evidence.md`
- `docs/lanes/backend/worklog.md`
- Backend handoff notes when needed.

## Forbidden

- Do not modify global `TODO.md`.
- Do not modify frontend lane documents or frontend code.
- Do not silently modify shared contracts.
- Do not merge branches.
- Do not mark `done`, `ready_for_e2e`, or `owner_accepted`.
- Do not continue through the whole lane automatically.

## Status Changes

- One backend task may move `todo -> doing -> candidate_done`.
- If not feasible, use `blocked` or `owner_gate` with a reason.
- Never convert `candidate_done` to `done`.

## Required Records

- Backend evidence.
- Backend worklog.
- Backend board status.
- Handoff note if the reviewer or Controller needs context.

## Stop Conditions

- Identity or lane mismatch.
- Required documents are invisible.
- The selected task is unreasonable, infeasible, too large, or missing dependencies.
- The task needs frontend, global, shared contract, architecture, scope, or Owner decision changes.
- One task slice is complete.

## Success Output

Report:

- Identity confirmed.
- Task slice selected and why it was reasonable.
- Files changed.
- Verification run or not run.
- Evidence and worklog written.
- Status, at most `candidate_done`.
- Ask the user to send the report to `/diayn-review-backend`.

Identity mismatch output: `../diayn_command_reference.md#2-common-identity-mismatch-output`.

## Identity Mismatch Behavior

Use the common Session Identity Guard behavior and mismatch output defined in `../diayn_command_reference.md#2-common-identity-mismatch-output`. Stop rather than continuing whenever role, lane, path, manifest, local identity, requested command, or write boundary do not match this command.
