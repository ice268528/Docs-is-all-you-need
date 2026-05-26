# `/diayn new`
## Role

Controller Session.

## User Input Scenario

The Owner adds a requirement, dependency, direction change, or priority change.

```text
/diayn new
"<new requirement, dependency change, or direction change>"
```

## Preconditions

- The request can be compared against current scope, constraints, and lane state.

## Required Reading

- User request.
- Current project goals and constraints.
- Current stage or batch scope.
- Lane boards and shared contracts.
- Controller summary.
- Owner question records.
- `docs/meta/controller_sync_integration_protocol.md`

## Allowed Writes

If inserted into current scope:

- Controller summary.
- Responsible lane boards and handoffs.
- Shared contracts or issue notes only when authorized.
- Owner questions when a decision is needed.

If deferred:

- Backlog or future preparation document such as `<backlog_path>` or `<future_stage_preparation_doc>`.
- Owner-facing explanation.

## Forbidden

- Do not silently expand current scope.
- Do not change dependencies, contracts, architecture, or acceptance criteria without Owner authorization.
- Do not write implementation code.
- Do not launch worker sessions.

## Status Changes

- Current-scope insertion becomes `todo`, `blocked`, or `owner_gate`.
- Deferred work is recorded as future preparation or backlog.

## Required Records

- Triage decision.
- Scope impact.
- Lane synchronization notes.
- Next command for the user.

## Stop Conditions

- The request changes goals, constraints, dependencies, or acceptance criteria without explicit authorization.
- The correct lane or timing is unclear.
- The change conflicts with confirmed documents.

## Success Output

Report:

- Insert current scope or defer.
- Why.
- Documents updated.
- Next command.

Identity mismatch output: `../diayn_command_reference.md#2-common-identity-mismatch-output`.

## Identity Mismatch Behavior

Use the common Session Identity Guard behavior and mismatch output defined in `../diayn_command_reference.md#2-common-identity-mismatch-output`. Stop rather than continuing whenever role, lane, path, manifest, local identity, requested command, or write boundary do not match this command.
