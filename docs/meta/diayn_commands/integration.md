# `/diayn-integration`
## Role

Controller Integration Review.

## User Input Scenario

The Controller checks cross-lane integration after lane review has accepted enough work.

```text
/diayn-integration
```

## Preconditions

- Relevant lane work is `done` by review, or the command explicitly records that it is not ready.
- Integration criteria are defined.

## Required Reading

- Lane review logs.
- Lane evidence.
- Shared contracts.
- Shared integration issues.
- Build, lint, typecheck, smoke, or E2E evidence.
- `.diayn/sync_log.md`
- `docs/meta/controller_sync_integration_protocol.md`

## Allowed Writes

- `.diayn/sync_log.md`
- `docs/shared/integration_issues.md`
- Responsible lane boards or handoffs when writing back integration issues.
- Controller summary.

## Forbidden

- Do not bypass lane review.
- Do not treat missing evidence as pass.
- Do not silently change shared contracts.
- Do not mark `owner_accepted`.
- Do not merge by default unless explicitly authorized by the project workflow.

## Status Changes

- Integrated work may become `ready_for_e2e` when evidence supports it.
- Integration problems become lane `todo`, `blocked`, or `rejected`, or shared integration issues.

## Required Records

- Integration event in sync log.
- Evidence checked.
- Issues written back.
- Readiness decision.

## Stop Conditions

- Lane review is missing.
- Shared contract consistency cannot be checked.
- Required build, smoke, or E2E evidence is missing and affects readiness.
- The next action requires Owner acceptance.

## Success Output

Report:

- Integration checks run or not run.
- Issues found and where written.
- Whether the result is `ready_for_e2e`, `blocked`, or `owner_gate`.
- Next Owner acceptance step, if ready.

Identity mismatch output: `../diayn_command_reference.md#2-common-identity-mismatch-output`.

## Identity Mismatch Behavior

Use the common Session Identity Guard behavior and mismatch output defined in `../diayn_command_reference.md#2-common-identity-mismatch-output`. Stop rather than continuing whenever role, lane, path, manifest, local identity, requested command, or write boundary do not match this command.
