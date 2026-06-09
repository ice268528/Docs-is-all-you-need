---
name: diayn-worktrees
description: Runs the DIAYN /diayn-worktrees workflow. Use when Controller needs to prepare backend/frontend lane worktrees, branch guidance, manifests, and session launch instructions after planning.
user-invocable: false
---

# DIAYN Worktrees

## Use When

Use this skill when the user invokes `/diayn-worktrees` or asks DIAYN to prepare lane workspaces after planning.

## Command Arguments

```text
$ARGUMENTS
```

## Owner-Confirmed Command Facts

Treat explicit facts in the current command arguments or current user message as Owner-confirmed for this run unless they conflict with existing project evidence. For example, if project identity, stage id, lane applicability, language, or approval boundaries are stated in the command, use those values directly and record them in the generated docs instead of asking the same question again.

The literal phrase `Owner-confirmed project_slug = <value>` is a direct Owner answer. Use `<value>` as the project slug and do not ask for it again unless repository evidence contradicts it.

If the command arguments say scaffold creation is approved, or say all OwnerGate choices needed for the automated fixture are approved, and the audit reports only missing DIAYN baseline files with no overwrite conflicts, create the missing baseline scaffold files in the same run instead of asking for another confirmation.

Ask only when the fact is absent, ambiguous, contradicted by repository evidence, or would cause existing user content to be overwritten without a preservation decision.

## Phase 11 Installed-Flow Fixture Mode

If command arguments contain `DIAYN_PHASE11_INSTALLED_FLOW_FIXTURE`, this is an automated validation fixture, not a normal ambiguous Owner conversation. Use explicit Owner-confirmed command facts as final for this run. Do not ask again for project slug, Owner name, stage id, lane applicability, worktree root, or authorization facts that are present in the command arguments.

When this marker is present and command arguments say worktree creation is authorized, run `scripts/worktree_plan.py` with `--execute` after verifying the controller working tree is clean. Use the worktree root from command arguments when provided. Write `.diayn/worktree_plan.json`, update `.diayn/worktree_manifest.md`, write `.diayn/session_registry.md`, and create backend/frontend launch prompts. Do not implement business code or start hidden worker/reviewer sessions.

## Validation Probe Mode

If the command arguments above or current user message contain `Validation command sequence probe only`, Validation Probe Mode has priority over Progressive Startup, Identity Guard, helper scripts, project inspection, dependency-skill routing, and all normal workflow steps.

In this mode, do not use tools, read files, inspect project state, invoke helper scripts, invoke dependency skills, or write files. Answer exactly:

```text
COMMAND: /diayn-worktrees
FIRST_STOP: The repository is not Git-backed.
```

Then stop. This mode only validates package command routing; it does not prove the full workflow.

## Progressive Startup

1. Confirm the requested command is `/diayn-worktrees`.
2. Run the Identity Guard contract for a Controller workflow.
3. Read `TODO.md`, the active stage, lane plans, and `.diayn/worktree_manifest.md` if present.
4. Read `docs/meta/diayn_command_reference.md` and `docs/meta/diayn_commands/worktrees.md` when available.
5. Run or inspect `scripts/worktree_plan.py` when the workflow needs Git preflight, existing-worktree detection, copyable commands, launch prompts, or an authorized `git worktree add`.
6. Use `assets/worktrees/` only when writing or refreshing session registry, local identity guidance, launch prompts, or entry checklists.
7. Keep the lane root indexes and current stage detail files together in the launch guidance when a lane has an active stage.

## Workflow

1. Verify the project is a Git repository and inspect dirty state before worktree actions.
2. Determine applicable lanes; do not create fake worktrees for `not_applicable` lanes.
3. Let the agent choose safe branch names based on the project context.
4. Produce a dry-run worktree plan before execution, including baseline, suggested branch, path, and copyable command for each applicable lane.
5. If authorized, run `git worktree add`; if permission is missing or denied, provide copyable commands with explicit working directory and shell assumptions.
6. Update the worktree manifest, session registry, local identity guidance, and session launch instructions.
7. Remind the Owner that one lane should have only one active worker/reviewer activity at a time.
8. Make fresh-session recovery explicit: each worker or reviewer turn starts by running its matching `/diayn-*` command and loading only entry checklist, identity, lane board, handoff, and relevant shared docs.

## Allowed Writes

May write `.diayn/worktree_manifest.md`, `.diayn/worktree_plan.json`, `.diayn/session_registry.md`, local identity guidance, Controller worktree notes, lane launch prompts, and entry checklists.

Do not implement business code, merge code, or silently reset user changes.

## Bundled Resources

- `scripts/worktree_plan.py`: dry-run worktree planner with optional authorized `--execute`. It reports Git state, existing worktrees, lane applicability, copyable `git worktree add` commands, and worker/reviewer startup commands.
- `assets/worktrees/session_registry.md`: shared session registry template.
- `assets/worktrees/local_session_identity.md`: local-only identity template for worktrees.
- `assets/worktrees/lane_launch_prompt.md`: worker session launch prompt template.
- `assets/worktrees/review_launch_prompt.md`: reviewer session launch prompt template.
- `assets/worktrees/entry_checklist.md`: progressive entry checklist for new sessions and cleared context, including same lane worker/reviewer handoff checks.

Example dry run:

```bash
python skills/diayn-worktrees/scripts/worktree_plan.py --project-root <controller-root> --project-slug <project_slug> --stage-id <stage_id> --output <controller-root>/.diayn/worktree_plan.json
```

## Stop Conditions

- The repository is not Git-backed.
- The working tree is dirty and the next step could overwrite or hide user changes.
- Worktree creation needs authorization and none is granted.
- Existing worktrees conflict with the planned lane setup.
- The current session is not the Controller session for `/diayn-worktrees`.
- A lane handoff is missing for an applicable lane.
- A reviewer session would start before the same-lane worker has stopped and reported.

## Output

Report Git status, lane applicability, worktree paths, branch names, manifest updates, commands executed or copyable fallback commands, and the next lane command.
