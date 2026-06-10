---
name: diayn-review-frontend
description: Runs the DIAYN /diayn-review-frontend workflow. Use when a frontend reviewer session must independently verify frontend lane work, write review evidence, approve done, or reject and uncheck TODO items.
---

# DIAYN Review Frontend

## Use When

Use this skill when the user invokes `/diayn-review-frontend` after frontend worker activity has stopped and a frontend worker report is available.

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

If command arguments contain `DIAYN_PHASE11_INSTALLED_FLOW_FIXTURE`, this is an automated validation fixture. Use explicit Owner-confirmed command facts as final for this run when they match repository evidence. Do not ask again for project slug, Owner name, stage id, lane applicability, authorization facts, or a pasted worker report when frontend lane board, worklog, evidence, and `candidate_done` task state are present in the current frontend worktree.

When this marker is present, review only the next frontend `candidate_done` task slice. Compare the board, current stage worklog, current stage evidence, E2E artifact, UI/API-contract facts, and relevant frontend diff. Run or inspect local verification as needed. Write `docs/lanes/frontend/stages/<stage-id>/review_log.md`, decide `done` or `rejected`, update only frontend review/board fields, and stop. Do not fix implementation, merge code, edit backend work, start hidden sessions, or mark Owner acceptance.

## Validation Probe Mode

If the command arguments above or current user message contain `Validation command sequence probe only`, Validation Probe Mode has priority over Progressive Startup, Identity Guard, helper scripts, project inspection, dependency-skill routing, and all normal workflow steps.

In this mode, do not use tools, read files, inspect project state, invoke helper scripts, invoke dependency skills, or write files. Answer exactly:

```text
COMMAND: /diayn-review-frontend
FIRST_STOP: Worker activity is still ongoing in the same lane.
```

Then stop. This mode only validates package command routing; it does not prove the full workflow.

## Progressive Startup

1. Confirm the requested command is `/diayn-review-frontend`.
2. Run the Identity Guard contract for frontend review identity, path, manifest entry, and write boundary.
3. Read the worker report, frontend lane board, frontend evidence index, frontend handoff, current stage worklog/evidence/review detail, and relevant diff.
4. Read `docs/meta/diayn_command_reference.md` and `docs/meta/diayn_commands/review_frontend.md` when available.
5. Route to DIAYN-managed review/UI/browser-testing/accessibility/debugging dependency skills only when needed.
   When routing is needed, read the installed routing map from `.diayn/dependency-routing/upstream-routing-map.md` if present; otherwise use `internal-role-skills/diayn-skill-router/references/upstream-routing-map.md` in the active DIAYN package. Resolve the platform-visible skill id before native Skill invocation.

## Workflow

1. Compare the worker report against actual diff and lane permissions.
2. Verify acceptance criteria, UI behavior, tests, evidence, and shared contract behavior.
3. Write or run additional tests in detected test locations or `tests/diayn/` when useful.
4. Decide `done` or `rejected` with reasons.
5. If rejected, uncheck the relevant TODO or lane item and record what must change.
6. Do not fix implementation unless the Owner explicitly authorizes temporary role switching.

## Allowed Writes

May write the stage-scoped frontend review log, frontend lane board review fields, review evidence, test files in approved test locations, and TODO uncheck/rejection notes when review fails.

The lane root review log is the current-stage index. Write the detailed review decision in `docs/lanes/frontend/stages/<stage-id>/review_log.md` and summarize back to the lane root only when needed.

Do not merge code, approve Owner acceptance, or perform implementation fixes by default.

## Bundled Resources

- `assets/review/review_log.md`: frontend review log template with failure classification, TODO effect, and next-command routing.

## Stop Conditions

- Worker activity is still ongoing in the same lane.
- Worker report, diff, or evidence is missing.
- The requested action is actually implementation, not review, and no Owner-authorized role switch exists.

## Output

Report review scope, files/diff checked, tests/checks run, evidence credibility, decision `done` or `rejected`, TODO effects, and next command.
