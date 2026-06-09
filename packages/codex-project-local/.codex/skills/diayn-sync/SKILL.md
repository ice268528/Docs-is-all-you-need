---
name: diayn-sync
description: Runs the DIAYN /diayn-sync workflow. Use when Controller must synchronize lane state and documents across worktrees without merging business code.
---

# DIAYN Sync

## Use When

Use this skill when the user invokes `/diayn-sync` or asks Controller to synchronize DIAYN state after lane work or review.

## Command Arguments

```text
$ARGUMENTS
```

## Owner-Confirmed Command Facts

Treat explicit facts in the current command arguments or current user message as Owner-confirmed for this run unless they conflict with existing project evidence. For example, if project identity, stage id, lane applicability, language, or approval boundaries are stated in the command, use those values directly and record them in the generated docs instead of asking the same question again.

The literal phrase `Owner-confirmed project_slug = <value>` is a direct Owner answer. Use `<value>` as the project slug and do not ask for it again unless repository evidence contradicts it.

If the command arguments say scaffold creation is approved, or say all OwnerGate choices needed for the automated fixture are approved, and the audit reports only missing DIAYN baseline files with no overwrite conflicts, create the missing baseline scaffold files in the same run instead of asking for another confirmation.

Ask only when the fact is absent, ambiguous, contradicted by repository evidence, or would cause existing user content to be overwritten without a preservation decision.

## Validation Probe Mode

If the command arguments above or current user message contain `Validation command sequence probe only`, Validation Probe Mode has priority over Progressive Startup, Identity Guard, helper scripts, project inspection, dependency-skill routing, and all normal workflow steps.

In this mode, do not use tools, read files, inspect project state, invoke helper scripts, invoke dependency skills, or write files. Answer exactly:

```text
COMMAND: /diayn-sync
FIRST_STOP: Sync would overwrite unsaved user changes.
```

Then stop. This mode only validates package command routing; it does not prove the full workflow.

## Phase 11 Installed-Flow Fixture Mode

If the command arguments or current user message contain `DIAYN_PHASE11_INSTALLED_FLOW_FIXTURE`, use the provided Owner-confirmed facts for the controlled fixture and do not ask for already supplied project identity, stage, lane, or approval facts.

In this mode, run from the Controller root after backend/frontend review has stopped. Read `.diayn/worktree_plan.json`, the lane root indexes, current stage worklogs, evidence files, and review logs from the registered backend/frontend worktrees. Synchronize only DIAYN documents and state into the Controller root, then write `.diayn/sync_log.md`. Update `TODO.md` lane snapshots only if needed. Do not edit `backend/`, `frontend/`, `shared/`, or `validation/`; do not merge branches or business code; do not run integration; do not mark Owner acceptance.

## Progressive Startup

1. Confirm the requested command is `/diayn-sync`.
2. Run the Identity Guard contract for a Controller sync workflow.
3. Read lane boards, review logs, handoffs, manifest entries, current stage detail files when needed, and current Controller summary only as needed.
4. Read `docs/meta/diayn_command_reference.md` and `docs/meta/diayn_commands/sync.md` when available.

## Workflow

1. Collect reviewed lane state, blockers, handoff updates, and OwnerGate changes.
2. Synchronize state and documents between Controller and lane worktrees.
3. Do not merge business code or claim integration.
4. Record sync summary, conflicts, and next action using `assets/sync/sync_log.md` when no target-project template exists. Keep lane root indexes short when stage-scoped details exist.
5. If both applicable lanes are reviewed, prepare for `/diayn-integration`.

## Allowed Writes

May write sync logs, Controller summaries, TODO lane snapshots, handoff summaries, manifests, and shared issue summaries.

Do not merge implementation code, resolve product conflicts silently, or mark Owner acceptance.

## Bundled Resources

- `assets/sync/sync_log.md`: Controller sync log template that explicitly records document/state sync and no business-code merge.

## Stop Conditions

- Sync would overwrite unsaved user changes.
- Lane states conflict and need Controller/Owner decision.
- A requested operation is actually code integration rather than document/state sync.

## Output

Report source lane states, documents synchronized, conflicts, files changed, confirmation that no business-code merge occurred, and the next command.
