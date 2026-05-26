# DIAYN Command Reference

> `/diayn ...` commands are document-driven workflow triggers for existing coding agents. They are not a built-in CLI, plugin, shell command, or runtime.

Use this reference with:

- `docs/meta/session_identity_protocol.md`
- `docs/meta/diayn_worktree_workflow.md`
- `docs/meta/controller_sync_integration_protocol.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`

## 1. Command Rules

Every command must start with the Session Identity Guard.

The active session must confirm:

- The command that was requested.
- The intended role.
- The intended lane, if any.
- The current directory or worktree.
- The matching entry in `.diayn/worktree_manifest.md`, if present.
- The matching local identity file under `.diayn/local/`, if present.
- The documents the role may read and write.

If identity does not match, stop before reading task state deeply or editing files. Do not rewrite identity files to bypass the guard.

All commands must use repository documents as the system of record. Chat can clarify the immediate request, but durable facts, task state, evidence, review decisions, and Owner decisions must be written to the appropriate documents.

Worker commands execute one clear task slice at a time. After finishing one slice, the worker stops, reports, and waits for the user to send the work to review.

## 2. Common Identity Mismatch Output

Use this format when a command does not match the detected role, lane, path, or manifest.

```text
Detected a session identity mismatch.

Requested command: <requested_command>
Expected role: <expected_role>
Expected lane: <expected_lane_or_none>
Detected role: <detected_role_or_unknown>
Detected lane: <detected_lane_or_unknown>
Current path: <current_path>
Expected path: <expected_path>

I will not execute <requested_command> from this session.

To continue, open the expected location:
cd <expected_path>

Then run:
<correct_command>
```

Lane-specific example:

```text
Detected a session identity mismatch.

Requested command: /diayn backend
But the current directory is registered as: frontend lane
Current path: ../worktrees/<project_slug>/frontend

I will not execute the backend workflow.

To start the backend session, open:
cd ../worktrees/<project_slug>/backend

Then run:
/diayn backend
```

## 3. Common Success Output

Use `docs/templates/diayn_command_output_template.md` for the final response of each command.

The response must include:

- Command executed.
- Role and lane confirmed.
- Documents read.
- Files changed or explicitly not changed.
- Status changes.
- Evidence, worklog, review log, or sync log written.
- Blockers, OwnerGate items, or next command.
- Whether the session stayed inside its role and write boundary.

## 4. Required Record Mapping

| Command | Evidence | Worklog | Review log | Sync log or Controller record |
| --- | --- | --- | --- | --- |
| `/diayn init` | Source paths and quality findings when useful | Not required unless the project has a Controller worklog | Not applicable | Controller summary, Owner questions, draft project docs |
| `/diayn plan` | Planning rationale and acceptance criteria sources | Not required unless the project has a Controller worklog | Not applicable | Controller summary, lane boards, lane handoffs |
| `/diayn worktrees` | Visibility check results | Not required unless the project has a Controller worklog | Not applicable | `.diayn/worktree_manifest.md`, `.diayn/session_registry.md` |
| `/diayn backend` | `docs/lanes/backend/evidence.md` | `docs/lanes/backend/worklog.md` | Not written by worker | Backend board and handoff notes |
| `/diayn frontend` | `docs/lanes/frontend/evidence.md` | `docs/lanes/frontend/worklog.md` | Not written by worker | Frontend board and handoff notes |
| `/diayn review backend` | Evidence checked, recorded in review entry | Not required | `docs/lanes/backend/review_log.md` | Backend board review status |
| `/diayn review frontend` | Evidence checked, recorded in review entry | Not required | `docs/lanes/frontend/review_log.md` | Frontend board review status |
| `/diayn sync` | Source lane states and review records | Not required | Not written by Controller sync | `.diayn/sync_log.md`, Controller summary |
| `/diayn integration` | Build, lint, typecheck, smoke, E2E, contract, and lane evidence checked | Not required | Lane review logs are read, not overwritten | `.diayn/sync_log.md`, `docs/shared/integration_issues.md`, Controller summary |
| `/diayn bug` | Owner feedback and acceptance failure details | Not required unless routed to a lane | Not applicable | Controller triage record, lane board/handoff, backlog or future preparation |
| `/diayn new` | Owner request and scope impact details | Not required unless routed to a lane | Not applicable | Controller triage record, lane board/handoff, backlog or future preparation |
| `/diayn html` | Source report or decision docs used | Not required | Not applicable | HTML output pointer and any later Owner decision record |

## 5. Command Detail Index

Read the command detail file for the requested workflow after applying the global rules above. The split preserves the original command roles, permissions, status changes, stop conditions, required records, and success output requirements.

| Command | Detail file |
| --- | --- |
| `/diayn init` | `docs/meta/diayn_commands/init.md` |
| `/diayn plan` | `docs/meta/diayn_commands/plan.md` |
| `/diayn worktrees` | `docs/meta/diayn_commands/worktrees.md` |
| `/diayn backend` | `docs/meta/diayn_commands/backend.md` |
| `/diayn frontend` | `docs/meta/diayn_commands/frontend.md` |
| `/diayn review backend` | `docs/meta/diayn_commands/review_backend.md` |
| `/diayn review frontend` | `docs/meta/diayn_commands/review_frontend.md` |
| `/diayn sync` | `docs/meta/diayn_commands/sync.md` |
| `/diayn integration` | `docs/meta/diayn_commands/integration.md` |
| `/diayn bug` | `docs/meta/diayn_commands/bug.md` |
| `/diayn new` | `docs/meta/diayn_commands/new.md` |
| `/diayn html` | `docs/meta/diayn_commands/html.md` |

Detailed command behavior lives in the files above so agents can load only the command they are executing. Keep shared rules in this index instead of copying them into every command file.
