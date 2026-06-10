---
name: diayn-integration
description: Runs the DIAYN /diayn-integration workflow. Use when Controller must integrate reviewed lane code, check contracts/build/smoke/E2E evidence, classify failures, and prepare Owner acceptance.
---

# DIAYN Integration

## Use When

Use this skill when the user invokes `/diayn-integration` after applicable backend/frontend lane reviews have passed.

## Command Arguments

```text
$ARGUMENTS
```

## Owner-Confirmed Command Facts

Treat explicit facts in the current command arguments or current user message as Owner-confirmed for this run unless they conflict with existing project evidence. For example, if project identity, stage id, lane applicability, language, or approval boundaries are stated in the command, use those values directly and record them in the generated docs instead of asking the same question again.

The literal phrase `Owner-confirmed project_slug = <value>` is a direct Owner answer. Use `<value>` as the project slug and do not ask for it again unless repository evidence contradicts it.

If the command arguments say scaffold creation is approved, or explicitly resolve all OwnerGate choices needed for this run, and the audit reports only missing DIAYN baseline files with no overwrite conflicts, create the missing baseline scaffold files in the same run instead of asking for another confirmation.

Ask only when the fact is absent, ambiguous, contradicted by repository evidence, or would cause existing user content to be overwritten without a preservation decision.

## Validation Probe Mode

If the command arguments above or current user message contain `Validation command sequence probe only`, Validation Probe Mode has priority over Progressive Startup, Identity Guard, helper scripts, project inspection, dependency-skill routing, and all normal workflow steps.

In this mode, do not use tools, read files, inspect project state, invoke helper scripts, invoke dependency skills, or write files. Answer exactly:

```text
COMMAND: /diayn-integration
FIRST_STOP: Any applicable lane review is missing or rejected.
```

Then stop. This mode only validates package command routing; it does not prove the full workflow.

## Explicit Owner-Confirmed Execution Mode

If the command arguments or current user message include explicit Owner-confirmed project facts, use them when they match repository evidence and do not ask for already supplied project identity, stage, lane, or approval facts.

In this mode, run from the Controller root after `/diayn-sync`. Confirm backend/frontend review logs are `done`, read the synced lane documents and shared contract note, and run the target project's agreed build, lint, smoke, E2E, or project-specific verification checks. Record the exact commands, evidence locations, merge status, contract consistency, failure classification, and next action in `docs/stages/<stage-id>/integration_summary.md`. If no business-code merge is needed, record a no-op or already-aligned merge status instead of inventing a merge. Do not mark Owner acceptance, create closeout, or start a new stage.

## Progressive Startup

1. Confirm the requested command is `/diayn-integration`.
2. Run the Identity Guard contract for Controller-owned integration.
3. Read only reviewed lane summaries, stage detail files when needed, review logs, shared contracts, integration issues, manifests, and current stage acceptance criteria.
4. Read `docs/meta/diayn_command_reference.md` and `docs/meta/diayn_commands/integration.md` when available.
5. Route to DIAYN-managed review, API, CI, security, performance, or shipping dependency skills only when needed.
   When routing is needed, read the installed routing map from `.diayn/dependency-routing/upstream-routing-map.md` if present; otherwise use `internal-role-skills/diayn-skill-router/references/upstream-routing-map.md` in the active DIAYN package. Resolve the platform-visible skill id before native Skill invocation.

## Workflow

1. Confirm applicable lane reviews are `done`.
2. Check merge status and integrate reviewed code according to project rules and authorization.
3. Check shared contract consistency.
4. Run or request build, lint, smoke, E2E, and other relevant checks.
5. Classify failures as implementation failure, blocked, environment missing, external service unavailable, flaky/timeout, or inconclusive evidence.
6. Write integration summary and route issues back to lane or shared issue records.
7. Record `partial_attempt` when integration stops mid-command; preserve completed steps, evidence, and a safe recovery path for a fresh session.
8. Route shared contract, schema, API, or cross-lane conflicts through Controller-owned shared issue records. Lane workers do not silently change shared contracts for another lane.
9. For secrets, environment variables, databases, external services, dependency installation, dev servers, containers, or long-running background processes, stop for OwnerGate or platform authorization when required. Generate copyable commands with explicit working directory and shell/platform assumptions when execution is denied or unavailable.
10. Mark `ready_for_e2e` only with evidence; Owner acceptance remains the Owner's decision.
11. After Owner acceptance, record stage closeout, accepted baseline, evidence links, follow-ups, and next-stage baseline refresh.

## Allowed Writes

May write integration summaries, shared integration issues, TODO integration readiness, accepted-baseline preparation, and authorized integration changes.

When the project uses stage-scoped records, write the detailed integration summary, closeout, and acceptance records under `docs/stages/<stage-id>/` and keep lane root indexes short.

Do not integrate unreviewed lane work, silently resolve requirement conflicts, or claim `owner_accepted`.

## Bundled Resources

- `assets/integration/integration_summary.md`: reviewed-code integration summary template.
- `assets/integration/stage_closeout.md`: Owner acceptance and accepted-baseline closeout template.
- `assets/integration/failure_classification.md`: failure classes for review and integration routing.
- `assets/integration/partial_attempt.md`: interrupted-command recovery template.
- `assets/integration/shared_issue.md`: Controller-owned shared contract/integration issue template.
- `assets/integration/authorized_command_record.md`: cross-platform command, authorization, background-process, and cleanup record.

## Stop Conditions

- Any applicable lane review is missing or rejected.
- Integration would overwrite dirty or unapproved changes.
- Merge conflict or integration conflict ownership is unclear.
- Contract conflict needs Controller/Owner decision.
- Required checks cannot run and no acceptable fallback evidence exists.

## Output

Report reviewed lanes, merge/integration actions, checks run, failure classifications, issue routing, status authority, and whether the next step is Owner acceptance or lane rework.
