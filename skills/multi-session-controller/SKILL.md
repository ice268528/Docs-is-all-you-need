---
name: multi-session-controller
description: "Use for DIAYN Controller Session planning, worktree setup, sync, integration, bug triage, and new-requirement workflows. Coordinates requirements, lane planning, worktree metadata, handoffs, state summaries, integration triage, and owner-facing scope decisions without defaulting to business-code implementation."
---

# Multi-Session Controller

## Use When

Use this skill when the current session is acting as the Controller for DIAYN multi-session collaboration, or when the user enters `/diayn init`, `/diayn plan`, `/diayn worktrees`, `/diayn sync`, `/diayn integration`, `/diayn bug`, or `/diayn new`.

## Read First

- `docs/meta/multi_session_collaboration_protocol.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/init.md`
- `docs/meta/diayn_commands/plan.md`
- `docs/meta/diayn_commands/worktrees.md`
- `docs/meta/diayn_commands/sync.md`
- `docs/meta/diayn_commands/integration.md`
- `docs/meta/diayn_commands/bug.md`
- `docs/meta/diayn_commands/new.md`
- `docs/meta/diayn_worktree_workflow.md`
- `docs/meta/controller_sync_integration_protocol.md`
- `docs/meta/session_identity_protocol.md`
- `docs/templates/diayn_command_output_template.md`

Load references only when needed:

- `references/controller-command-map.md`
- `references/worktree-launch-examples.md`
- `references/integration-review-checklist.md`

## Workflow

1. Run the session identity guard before acting on any `/diayn ...` command.
2. Confirm the command belongs to a Controller-owned workflow.
3. For `/diayn init`, actively ask the Owner to confirm `project_slug`; do not silently derive the final value from the repository folder name.
4. Inspect the project facts, requirement source, existing docs, manifest, lane boards, handoffs, and shared docs relevant to the command.
5. Clarify requirements, scope, owner decisions, missing facts, and lane boundaries before planning or dispatching work.
6. Create or update controller-owned docs, lane boards, handoffs, worktree manifest entries, session registry entries, sync logs, and owner decision records only within the authorized workflow.
7. For `/diayn bug` and `/diayn new`, decide whether the item belongs in the current scope or future/backlog records, then sync only the affected lane or shared docs.
8. Report what was read, what changed, status effects, blockers, and the exact next command or review path.

## Allowed Writes

Write only Controller-authorized project docs, planning docs, lane board dispatch fields, handoff packets, shared issue records, `.diayn` shared control docs, Owner questions, Owner decision records, sync logs, and Controller summaries.

## Stop Conditions

- The command does not match the current session identity, lane, path, or manifest.
- `project_slug` is needed but not confirmed by the Owner.
- Required source facts are missing, contradictory, or invisible to receiving sessions.
- Continuing would require implementing business code by default.
- Continuing would require treating `candidate_done` as `done`.
- Continuing would require creating plugins, runtime code, vendor content, or unmanaged worktrees beyond the command authorization.

## Output Expectations

Controller outputs should be concise and durable: list documents read, changes made, status updates, lane sync effects, owner gates, evidence gaps, and the next safe command. Do not rely on chat memory as the only handoff.
