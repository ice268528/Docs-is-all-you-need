# `/diayn-bug`
## Role

Controller Session.

## User Input Scenario

The Owner reports that end-to-end business acceptance failed.

```text
/diayn-bug
"<what failed, expected behavior, actual behavior, context>"
```

## Preconditions

- The feedback is from Owner acceptance, E2E testing, or user-facing validation.
- The Controller can compare the feedback against current scope and acceptance criteria.

## Required Reading

- User feedback.
- Current stage or batch scope.
- Owner acceptance records.
- Lane boards and review logs.
- Shared integration issues.
- Controller summary.
- `docs/meta/controller_sync_integration_protocol.md`

## Allowed Writes

If the bug belongs to current scope:

- Controller summary.
- Responsible lane board and handoff.
- Shared integration issue, when cross-lane.
- Owner question or blocker record.

If the bug is outside current scope:

- Backlog or future preparation document such as `<backlog_path>` or `<future_stage_preparation_doc>`.
- Owner-facing explanation.

## Forbidden

- Do not hide current-scope bugs as future work.
- Do not force out-of-scope work into the current lane.
- Do not directly fix the bug from the Controller by default.
- Do not mark acceptance as passed.

## Status Changes

- Current-scope bug: affected item becomes `todo`, `blocked`, or `rejected`.
- Out-of-scope bug: record as backlog or future preparation; current accepted work is not silently invalidated unless scope says so.

## Required Records

- Triage decision and scope rationale.
- Lane synchronization notes.
- Next command for the user.

## Stop Conditions

- The report lacks enough detail to identify expected and actual behavior.
- Scope ownership is unclear.
- A fix would require changing project goals, contracts, or acceptance criteria.

## Success Output

Report:

- Whether the bug is current scope or future scope.
- Documents updated.
- Responsible lane.
- Next command, for example `/diayn-backend`, `/diayn-frontend`, or `/diayn-sync`.

Identity mismatch output: `../diayn_command_reference.md#2-common-identity-mismatch-output`.

## Identity Mismatch Behavior

Use the common Session Identity Guard behavior and mismatch output defined in `../diayn_command_reference.md#2-common-identity-mismatch-output`. Stop rather than continuing whenever role, lane, path, manifest, local identity, requested command, or write boundary do not match this command.
