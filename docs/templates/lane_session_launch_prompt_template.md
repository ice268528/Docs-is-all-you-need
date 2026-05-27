# Lane Session Launch Prompt Template

> Use this template when `/diayn-worktrees` prepares instructions for a worker lane session. It does not launch an agent.

## Launch Metadata

| Field | Value |
| --- | --- |
| Project slug | `<project_slug>` |
| Lane | `<backend-or-frontend-or-other-lane>` |
| Expected worktree | `../worktrees/<project_slug>/<lane>` |
| Expected role | `<Backend Session / Frontend Session>` |
| Allowed command | `/diayn-<lane>` |
| Controller | `<controller_session_id>` |
| Handoff | `docs/lanes/<lane>/handoff.md` |
| Lane board | `docs/lanes/<lane>/board.md` |

## User Startup Commands

Use placeholders until instantiated by the Controller:

```text
cd ../worktrees/<project_slug>/<lane>
codex
/diayn-<lane>
```

## Prompt To Paste Into The Worker Session

```text
You are the <lane> worker session for this DIAYN project.

Current worktree:
../worktrees/<project_slug>/<lane>

Run:
/diayn-<lane>

Before implementation:
- Perform the Session Identity Guard.
- Read AGENTS.md or the relevant entry file.
- Read docs/meta/diayn_command_reference.md.
- Read docs/meta/session_identity_protocol.md.
- Read docs/meta/session_roles.md.
- Read docs/meta/status_model.md.
- Read docs/meta/agent_doc_permissions.md.
- Read docs/lanes/<lane>/board.md.
- Read docs/lanes/<lane>/handoff.md.
- Read relevant docs/shared/**.

Then evaluate whether the next lane task is reasonable, feasible, and sufficiently specified.

Execute only one clear task slice. After that slice, update same-lane evidence, worklog, board, and handoff notes as needed. Mark at most candidate_done. Stop and report so the user can send the work to review.
```

## Required Visibility Check

| Document | Visible? | Notes |
| --- | --- | --- |
| `AGENTS.md` or equivalent entry file | `<yes/no>` | `<notes>` |
| `docs/meta/diayn_command_reference.md` | `<yes/no>` | `<notes>` |
| `docs/meta/session_identity_protocol.md` | `<yes/no>` | `<notes>` |
| `docs/lanes/<lane>/board.md` | `<yes/no>` | `<notes>` |
| `docs/lanes/<lane>/handoff.md` | `<yes/no>` | `<notes>` |
| `docs/shared/**` relevant to the task | `<yes/no/not-applicable>` | `<notes>` |

## Stop Reminder

The worker does not continue through the full lane automatically. It stops after one task slice and waits for review.
