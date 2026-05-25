# Integration Checklist

Use this for `/diayn sync` and `/diayn integration`.

## Sync

- Read each active lane board.
- Read review logs for candidate or completed tasks.
- Read lane evidence summaries.
- Read shared integration issues.
- Record a lane snapshot without stealing lane status authority.

## Integration

- Confirm relevant lane work is reviewed `done`.
- Confirm shared contracts match lane assumptions.
- Confirm build, smoke, typecheck, integration, or manual checks have evidence when applicable.
- Record missing evidence as not ready.
- Route each integration issue to shared issues or the responsible lane.

## Ready For E2E

Use `ready_for_e2e` only when:

- Required lane reviews are complete.
- Integration evidence exists.
- No unresolved shared contract blockers remain.
- Owner-facing acceptance criteria can be checked.
