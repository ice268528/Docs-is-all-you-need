# `/diayn-plan`
## Role

Controller Session.

## User Input Scenario

The Owner has confirmed enough project facts to plan work.

```text
/diayn-plan
```

## Preconditions

- Project goals, constraints, and current scope are confirmed enough to plan.
- Open OwnerGate items that affect scope are resolved or explicitly deferred.

## Required Reading

- Confirmed project brief and constraints.
- Current controller summary.
- Relevant stage or batch goals.
- Shared contracts, if any.
- Existing backend and frontend lane docs, including current lane indexes and current stage detail files when present.
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`

## Allowed Writes

- Stage or batch planning documents.
- Backend and frontend lane boards.
- Lane handoff documents.
- Shared contract placeholders or issue notes when authorized.
- Controller summary and Owner question records.
- Lane root summary/index files when the plan establishes or updates the current stage.
- Stage-scoped lane detail files under `docs/lanes/<lane>/stages/<stage-id>/`.

Use the bundled `skills/diayn-plan/assets/plan/` templates as the default structures:

- `stage_plan.md` for Controller-owned stage planning.
- `lane_board.md` for backend/frontend task slices and limited internal status.
- `lane_handoff.md` for one-slice worker handoff.
- `shared_contract_placeholder.md` for Controller-owned API/schema/event/interface contracts.

Create only artifacts justified by the project analysis. Record `not_applicable` lanes instead of creating fake backend or frontend work.

## Forbidden

- Do not write code.
- Do not silently change confirmed requirements.
- Do not assign work based on documents the worker cannot see.
- Do not create worktrees or launch agents.

## Status Changes

- Planned tasks may be `todo`, `blocked`, or `owner_gate`.
- Do not mark worker progress statuses.

## Required Records

- Lane split rationale.
- Acceptance criteria.
- OwnerGate decisions or remaining questions.
- Shared contract and dependency notes.

## Stop Conditions

- Scope is not confirmed enough to create lane tasks.
- A lane task would depend on an undefined shared contract.
- The plan requires a project, architecture, provider, cost, or acceptance decision.

## Success Output

Report:

- Planned lanes and task slices.
- Shared contracts or dependencies.
- OwnerGate items.
- Whether `/diayn-worktrees` is ready.

Identity mismatch output: `../diayn_command_reference.md#2-common-identity-mismatch-output`.

## Identity Mismatch Behavior

Use the common Session Identity Guard behavior and mismatch output defined in `../diayn_command_reference.md#2-common-identity-mismatch-output`. Stop rather than continuing whenever role, lane, path, manifest, local identity, requested command, or write boundary do not match this command.
