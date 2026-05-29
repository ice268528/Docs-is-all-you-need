# Integration Readiness

Use for `/diayn-sync` and `/diayn-integration`.

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

Use `ready_for_e2e` only when required lane reviews are complete, integration evidence exists, no unresolved shared contract blockers remain, and Owner-facing acceptance criteria can be checked.

## Optional Upstream Routing

Use `diayn-skill-router` after lane reviews are inspectable.

| Integration context | Consider upstream skills | DIAYN override |
| --- | --- | --- |
| Cross-lane contract consistency | `api-and-interface-design`, `code-review-and-quality` | Reviewed `done` lane records and shared contracts are required before readiness. |
| Build, CI, or automation readiness | `ci-cd-and-automation`, `debugging-and-error-recovery` | Missing or failed evidence blocks `ready_for_e2e`. |
| Release readiness review | `shipping-and-launch`, `security-and-hardening`, `performance-optimization` | Draft adapters, unverified support claims, or unresolved OwnerGate cannot be treated as launch-ready. |
| Git or branch coordination | `git-workflow-and-versioning` | Integrator does not merge or commit unless the active workflow and Owner/review authorization allow it. |

Record any routed upstream guidance in sync or integration notes when it changes the risk assessment.
