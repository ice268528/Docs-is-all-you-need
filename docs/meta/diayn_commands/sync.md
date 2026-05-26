# `/diayn sync`
## Role

Controller Session.

## User Input Scenario

The Controller needs to summarize lane state after worker or review activity.

```text
/diayn sync
```

## Preconditions

- Lane boards and review logs exist or their absence is itself the sync finding.

## Required Reading

- Backend and frontend boards.
- Backend and frontend review logs.
- Shared integration issues.
- Global controller summary.
- `.diayn/sync_log.md`
- `docs/meta/controller_sync_integration_protocol.md`

## Allowed Writes

- `.diayn/sync_log.md`
- Global controller summary.
- Lane board sync fields when Controller authority applies.
- Owner question or blocker records.

## Forbidden

- Do not convert `blocked`, `rejected`, or `candidate_done` into `done`.
- Do not modify implementation code.
- Do not bypass review.
- Do not mark `owner_accepted`.

## Status Changes

- Controller may mark aggregate readiness as `blocked`, `owner_gate`, or `ready_for_e2e` only when supporting evidence exists.
- Lane statuses remain governed by lane and review authority.

## Required Records

- Sync event.
- Lane status snapshot.
- Open blockers and OwnerGate items.
- Next recommended command.

## Stop Conditions

- Lane documents conflict and the Controller cannot reconcile without guessing.
- Evidence needed for a readiness claim is missing.
- A lane review has not happened.

## Success Output

Report:

- Lane statuses.
- Review outcomes.
- Blockers and OwnerGate items.
- Whether the project is ready for `/diayn integration`.

Identity mismatch output: `../diayn_command_reference.md#2-common-identity-mismatch-output`.

## Identity Mismatch Behavior

Use the common Session Identity Guard behavior and mismatch output defined in `../diayn_command_reference.md#2-common-identity-mismatch-output`. Stop rather than continuing whenever role, lane, path, manifest, local identity, requested command, or write boundary do not match this command.
