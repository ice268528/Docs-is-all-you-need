---
name: diayn-frontend
description: Runs the DIAYN /diayn-frontend workflow. Use when a frontend lane worker session must execute one planned frontend task slice, update lane evidence, and stop at candidate_done for review.
---

# DIAYN Frontend

## Use When

Use this skill when the user invokes `/diayn-frontend` from the frontend lane worktree or asks a frontend worker session to execute its next DIAYN task slice.

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

If command arguments contain `DIAYN_PHASE11_INSTALLED_FLOW_FIXTURE`, this is an automated validation fixture. Use explicit Owner-confirmed command facts as final for this run when they match repository evidence. Do not ask again for project slug, Owner name, stage id, lane applicability, authorization facts, or the next task slice if the frontend lane board already contains one `todo` frontend task.

When this marker is present, execute only the next frontend `todo` task slice in the current frontend lane worktree. For baseline-evidence tasks, do not invent new product behavior; run the local fixture verification requested by the lane board, create or update frontend worklog/evidence files, mark only the executed frontend slice as `candidate_done`, and stop for `/diayn-review-frontend`. Do not self-review, integrate, edit backend work, or start hidden sessions.

## Validation Probe Mode

If the command arguments above or current user message contain `Validation command sequence probe only`, Validation Probe Mode has priority over Progressive Startup, Identity Guard, helper scripts, project inspection, dependency-skill routing, and all normal workflow steps.

In this mode, do not use tools, read files, inspect project state, invoke helper scripts, invoke dependency skills, or write files. Answer exactly:

```text
COMMAND: /diayn-frontend
FIRST_STOP: Current path is not the registered frontend lane worktree.
```

Then stop. This mode only validates package command routing; it does not prove the full workflow.

## Progressive Startup

1. Confirm the requested command is `/diayn-frontend`.
2. Run the Identity Guard contract for frontend lane worker identity, path, manifest entry, and write boundary.
3. Read only the frontend lane board, frontend handoff, relevant shared contracts, and current task slice.
4. Read `docs/meta/diayn_command_reference.md` and `docs/meta/diayn_commands/frontend.md` when available.
5. Route to DIAYN-managed engineering dependency skills only when UI, browser testing, TDD, debugging, accessibility, or performance guidance is needed.

## Workflow

1. Select one frontend task slice assigned to this lane.
2. Inspect existing frontend code, UI patterns, and tests relevant to that slice.
3. Implement the smallest correct user-facing change inside lane boundaries.
4. Add or update tests or browser checks where appropriate.
5. Run targeted verification and broader checks when risk requires them.
6. Record evidence, worklog, changed files, and handoff notes. Use `assets/lane/` as the default frontend worklog/evidence structure when the target project has no stronger local template.
7. Stop at `candidate_done`; do not self-approve.

## Allowed Writes

May edit frontend lane implementation files, frontend tests, frontend lane board, frontend evidence, frontend worklog, and frontend handoff.

Do not edit backend lane work, global planning docs, integration records, or Owner acceptance records unless the active task explicitly authorizes it.

## Bundled Resources

- `assets/lane/worklog.md`: stage-scoped frontend worklog template.
- `assets/lane/evidence.md`: frontend evidence table template.

## Stop Conditions

- Current path is not the registered frontend lane worktree.
- Required handoff, acceptance criteria, or shared contract is missing.
- The task crosses lane boundaries without Controller approval.
- Verification cannot produce credible evidence.

## Output

Report role/lane, task slice, files changed, tests/checks run, evidence paths, remaining risks, status `candidate_done` or `blocked`, and the exact review command `/diayn-review-frontend`.
