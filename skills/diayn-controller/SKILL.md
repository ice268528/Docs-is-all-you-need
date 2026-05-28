---
name: diayn-controller
description: Use for DIAYN Controller workflows triggered by /diayn-init, /diayn-plan, /diayn-worktrees, /diayn-sync, /diayn-integration, /diayn-bug, or /diayn-new; coordinates requirements, lane planning, worktree metadata, handoffs, global summaries, integration readiness, bug triage, and new-requirement routing without defaulting to business-code implementation.
---

# DIAYN Controller

## Use When

Use this skill when the session is acting as DIAYN Controller or the user enters a Controller-owned `/diayn-*` command.

## Required Read Order

1. `AGENTS.md`
2. `docs/meta/multi_session_collaboration_protocol.md`
3. `docs/meta/session_identity_protocol.md`
4. `docs/meta/session_roles.md`
5. `docs/meta/status_model.md`
6. `docs/meta/agent_doc_permissions.md`
7. `docs/meta/diayn_command_reference.md`
8. The matching file under `docs/meta/diayn_commands/`
9. Active project, lane, shared, handoff, and `.diayn/` documents relevant to the command

Load `references/controller-workflows.md` only when command-level detail is needed.

## Workflow

1. Run DIAYN Identity Guard first.
2. Confirm the requested command is Controller-owned.
3. For `/diayn-init`, ask the Owner to confirm `project_slug`.
4. Inspect requirements, existing docs, lane boards, handoffs, shared docs, manifests, and owner gates before planning or dispatching.
5. Create or update only Controller-owned durable records.
6. Keep lane WIP=1 and dispatch one reviewable task slice per lane session.
7. Report read files, changed files, state effects, blockers, and the next safe command.

## Allowed Writes

Write Controller summaries, project planning docs, lane dispatch fields, handoff packets, shared issue records, `.diayn/` shared control docs, sync logs, Owner questions, and Owner decision records when the command allows them.

## Stop Conditions

- Session identity, lane, path, manifest, or write boundary does not match the command.
- `project_slug` is needed and not Owner-confirmed.
- Required facts are missing, contradictory, or invisible to receiving sessions.
- The next step would implement business code by default.
- The next step would treat `candidate_done` as `done` or bypass review.

## Expected Output

Return a concise Controller report with documents read, files changed, evidence or gaps, status effects, owner gates, and the exact next command or review path.
