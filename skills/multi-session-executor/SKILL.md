---
name: multi-session-executor
description: "Use for DIAYN lane executor commands such as /diayn backend, /diayn frontend, and future /diayn lane <name>. Guides a worker session to verify identity, read lane board and handoff docs, evaluate one task slice, implement only within lane boundaries, write evidence, and stop at candidate_done for review."
---

# Multi-Session Executor

## Use When

Use this skill when the user asks a worker session to run `/diayn backend`, `/diayn frontend`, or a future `/diayn lane <name>` command.

## Read First

- `docs/meta/session_identity_protocol.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`
- `docs/meta/agent_execution_workflows.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/backend.md` or `docs/meta/diayn_commands/frontend.md`
- `docs/templates/handoff_packet_template.md`
- `docs/templates/lane_board_template.md`
- The active lane board, handoff, evidence, worklog, and relevant shared docs.

Load references only when needed:

- `references/lane-execution-checklist.md`
- `references/evidence-writing-guide.md`
- `references/candidate-done-examples.md`

## Workflow

1. Run the session identity guard before reading or writing lane work.
2. Confirm the requested command, role, lane, worktree path, manifest, local identity, and write boundary all match.
3. Read the active lane board, handoff packet, shared contracts, and required project docs visible from this worktree.
4. Before editing, evaluate whether the assigned task slice is reasonable, feasible, bounded, and free of missing dependencies.
5. Execute one clear task slice only.
6. Write evidence, worklog entries, and lane board updates for the performed slice.
7. Mark at most `candidate_done`, `blocked`, or `owner_gate`; never mark `done`.
8. Stop after the slice and report for user-driven review.

## Allowed Writes

Write only lane-authorized implementation files, lane-local docs, evidence, worklog, board fields, and handoff notes. Shared docs may be edited only when the handoff explicitly authorizes that exact change; otherwise record a shared issue or blocker.

## Stop Conditions

- Identity, path, lane, manifest, or command mismatch.
- Required lane board, handoff, or shared docs are missing or invisible.
- The task is too large, unclear, infeasible, or missing dependencies.
- The next step would affect another lane, global TODO, Controller plan, Owner decision, merge state, or review authority.
- One task slice has been completed and is ready for review.

## Output Expectations

Report the slice executed, files changed, evidence produced, tests or checks run, status proposed, known risks, and exact review command. Do not continue into another slice without user direction.
