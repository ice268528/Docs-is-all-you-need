---
name: diayn-new
description: Runs the DIAYN /diayn-new workflow. Use when the Owner introduces a new requirement, scope change, dependency change, or direction change that must be routed without silently overwriting prior requirements.
user-invocable: false
---

# DIAYN New

## Use When

Use this skill when the user invokes `/diayn-new` or introduces a new requirement, dependency, direction change, or scope change.

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
COMMAND: /diayn-new
FIRST_STOP: The change conflicts with accepted requirements and no Owner decision exists.
```

Then stop. This mode only validates package command routing; it does not prove the full workflow.

## Phase 11 Installed-Flow Fixture Mode

If the command arguments or current user message contain `DIAYN_PHASE11_INSTALLED_FLOW_FIXTURE`, use the provided Owner-confirmed facts for the controlled fixture and do not ask for already supplied project identity, stage, acceptance, closeout, or next-stage facts.

In this mode, run from the Controller root after Owner acceptance has been recorded. Treat the supplied next-stage request as future preparation only. Write `docs/stages/stage-1-auth-fixture/stage_closeout.md` with accepted baseline, integration summary, Owner acceptance record, final evidence links, follow-ups, and worktree/branch retention notes. Write `docs/stages/stage-2-follow-up/baseline_refresh.md` to show the next stage starts from the accepted baseline. Update `TODO.md` only for closeout and next-stage pointers. Do not implement code, re-plan lanes, delete worktrees, or alter accepted requirements.

## Progressive Startup

1. Confirm the requested command is `/diayn-new`.
2. Run the Identity Guard contract for Controller change intake.
3. Read the new Owner request, current stage, accepted requirements, TODO, and relevant OwnerGate records only as needed.
4. Read `docs/meta/diayn_command_reference.md` and `docs/meta/diayn_commands/new.md` when available.
5. Route to DIAYN-managed interview, idea refinement, specification, planning, or migration dependency skills only when needed.
   When routing is needed, read the installed routing map from `.diayn/dependency-routing/upstream-routing-map.md` if present; otherwise use `internal-role-skills/diayn-skill-router/references/upstream-routing-map.md` in the active DIAYN package. Resolve the platform-visible skill id before native Skill invocation.

## Workflow

1. Restate the new request and compare it with accepted or in-flight requirements.
2. Decide whether this is current-scope work, future backlog, superseding requirement, or an OwnerGate conflict.
3. If it supersedes old requirements, mark the old requirement as superseded with reason and date.
4. Ask clarifying questions when the change is ambiguous.
5. Update planning records and route to `/diayn-plan`, a lane command, or a future preparation record.
6. Do not silently alter prior requirements.

## Allowed Writes

May write change records, superseded requirement records, TODO entries, OwnerGate questions, lane handoff updates, backlog/future preparation, and Controller summaries.

Do not implement code or re-plan the whole project without Owner-visible impact analysis.

## Bundled Resources

- `assets/intake/change_record.md`: new requirement or scope-change intake record.
- `assets/intake/superseded_requirement.md`: visible record for old requirements replaced by an Owner-approved change.

## Stop Conditions

- The change conflicts with accepted requirements and no Owner decision exists.
- The change would invalidate reviewed work without a visible impact report.
- The next step belongs to a worker or reviewer workflow.

## Output

Report change classification, affected requirements, superseded items, OwnerGate questions, records updated, and next command.
