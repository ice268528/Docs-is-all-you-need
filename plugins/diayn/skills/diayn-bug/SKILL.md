---
name: diayn-bug
description: Runs the DIAYN /diayn-bug workflow. Use when Owner acceptance fails, a defect is reported, or accepted behavior needs triage, routing, rollback analysis, or lane assignment.
---

# DIAYN Bug

## Use When

Use this skill when the user invokes `/diayn-bug` or reports that Owner acceptance failed, behavior is wrong, or an accepted feature may need rollback.

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

If command arguments contain `DIAYN_PHASE11_INSTALLED_FLOW_FIXTURE`, this is an automated validation side scenario. Use explicit Owner-confirmed command facts as final for this run when they match repository evidence.

In this mode, run from the Controller root after Owner acceptance has been recorded. If the command states that no active defect is being filed, write `docs/stages/stage-1-auth-fixture/bug_triage_noop.md` with classification `no_active_bug`, affected scope `none`, responsible owner `none`, no rollback, no lane reassignment, and next action `proceed_to_closeout`. Do not edit implementation code, rewrite requirements, uncheck accepted TODO items, close the stage, delete worktrees, or start the next stage.

## Validation Probe Mode

If the command arguments above or current user message contain `Validation command sequence probe only`, Validation Probe Mode has priority over Progressive Startup, Identity Guard, helper scripts, project inspection, dependency-skill routing, and all normal workflow steps.

In this mode, do not use tools, read files, inspect project state, invoke helper scripts, invoke dependency skills, or write files. Answer exactly:

```text
COMMAND: /diayn-bug
FIRST_STOP: The reported issue changes requirements rather than reporting a defect.
```

Then stop. This mode only validates package command routing; it does not prove the full workflow.

## Progressive Startup

1. Confirm the requested command is `/diayn-bug`.
2. Run the Identity Guard contract for Controller bug triage.
3. Read the Owner feedback, current stage, TODO, integration summary, and relevant lane evidence only as needed.
4. Read `docs/meta/diayn_command_reference.md` and `docs/meta/diayn_commands/bug.md` when available.
5. Route to DIAYN-managed debugging, review, testing, security, or migration dependency skills only when needed.
   When routing is needed, read the installed routing map from `.diayn/dependency-routing/upstream-routing-map.md` if present; otherwise use `internal-role-skills/diayn-skill-router/references/upstream-routing-map.md` in the active DIAYN package. Resolve the platform-visible skill id before native Skill invocation.

## Workflow

1. Capture the bug or acceptance failure in Owner language.
2. Classify whether it belongs to current scope, a reviewed lane, integration, environment, external dependency, or future backlog.
3. Decide the responsible lane or shared issue owner.
4. For accepted-feature rollback or destructive changes, require OwnerGate.
5. Update TODO, bug records, lane handoff, or future preparation records.
6. Do not fix code directly unless the triage explicitly routes to a worker command.

## Allowed Writes

May write bug records, TODO triage entries, OwnerGate questions, lane handoff updates, shared issue records, and Controller routing summaries.

Do not implement fixes, merge code, or change accepted requirements silently.

## Bundled Resources

- `assets/intake/bug_record.md`: Owner-facing defect or acceptance-failure triage record.

## Stop Conditions

- The reported issue changes requirements rather than reporting a defect.
- The responsible lane or scope cannot be identified without Owner input.
- The next step would perform rollback or destructive action without OwnerGate.

## Output

Report bug classification, affected scope, responsible lane or shared owner, records updated, OwnerGate items, and the next command.
