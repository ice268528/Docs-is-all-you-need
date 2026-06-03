---
name: diayn-executor
description: Use for DIAYN lane worker execution triggered by /diayn-backend, /diayn-frontend, or future explicitly defined lane worker workflows; verifies identity, reads lane board and handoff docs, evaluates one task slice, edits only within lane boundaries, records evidence, and stops at candidate_done for review.
---

# DIAYN Executor

## Use When

Use this skill when a backend, frontend, or future lane worker session is asked to execute one DIAYN task slice.

## Required Read Order

1. `AGENTS.md`
2. `docs/meta/session_identity_protocol.md`
3. `docs/meta/session_roles.md`
4. `docs/meta/status_model.md`
5. `docs/meta/agent_doc_permissions.md`
6. `docs/meta/agent_execution_workflows.md`
7. `docs/meta/diayn_command_reference.md`
8. `docs/meta/diayn_commands/backend.md` or `docs/meta/diayn_commands/frontend.md`
9. Active lane board, handoff, evidence, worklog, and relevant shared docs

Load `references/lane-execution.md` only when detailed execution checks are needed.

## Workflow

1. Run DIAYN Identity Guard first.
2. Confirm requested command, role, lane, worktree path, manifest, local identity, and write boundary.
3. Read active lane board, handoff packet, shared contracts, and required project docs.
4. Before editing, decide whether the task slice is reasonable, feasible, bounded, and dependency-complete.
5. Execute one clear task slice only.
6. Record evidence and worklog facts as you work.
7. Mark at most `candidate_done`, `blocked`, or `owner_gate`; never mark `done`.
8. Stop and report for user-driven review.

## Allowed Writes

Write lane-authorized implementation files, lane-local docs, lane evidence, lane worklog, lane board fields, and lane handoff notes. Edit shared docs only when the handoff explicitly authorizes that exact change.

## Stop Conditions

- Identity, command, path, lane, manifest, or write boundary mismatch.
- Required lane board, handoff, or shared docs are missing or invisible.
- The task is too large, unclear, infeasible, or missing dependencies.
- The next step would affect another lane, root `TODO.md`, Controller plan, Owner decision, merge state, or review authority.
- One task slice is complete and ready for review.

## Expected Output

Report the slice executed, changed files, evidence, checks run, proposed status, known risks, and exact review command. Do not continue into a second slice without user direction.
