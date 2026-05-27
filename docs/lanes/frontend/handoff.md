# Frontend Handoff

> Controller-owned dispatch context for the frontend lane. Frontend workers may append implementation handoff notes after authorized work.

## Visibility Rule

Invisible documents cannot be used as task dispatch authority.

Every path listed below must be visible from the frontend session's worktree before work starts.

## Receiving Session

| Field | Value |
| --- | --- |
| Role | `Frontend Session` |
| Lane | `frontend` |
| Expected worktree | `../worktrees/<project_slug>/frontend` |
| Current stage | `<stage_id>` |
| Current batch | `<batch_id>` |

## Required Documents

| Path | Why required | Visible? |
| --- | --- | --- |
| `AGENTS.md` or tool-specific entry file | Entry and cold-start rules | `<yes/no>` |
| `docs/meta/diayn_command_reference.md` | `/diayn-*` command rules | `<yes/no>` |
| `docs/meta/session_identity_protocol.md` | Session Identity Guard | `<yes/no>` |
| `docs/lanes/frontend/board.md` | Lane task state | `<yes/no>` |
| `docs/shared/contracts/<contract_name>.md` | Shared contract | `<yes/no/not-applicable>` |
| `docs/project/implementation_constraints.md` | Constraints | `<yes/no>` |
| `docs/meta/session_roles.md` | Role authority | `<yes/no>` |
| `docs/meta/agent_doc_permissions.md` | Write boundary | `<yes/no>` |
| `docs/meta/status_model.md` | Status authority | `<yes/no>` |

## Task Scope

- Objective: `<lane objective>`
- Allowed paths: `<authorized paths>`
- Forbidden paths: `<forbidden paths>`
- Acceptance criteria: `<criteria>`
- Evidence required: `docs/lanes/frontend/evidence.md`

## Stop Conditions

Stop and ask Controller or Owner if:

- A required document is not visible.
- The task requires backend changes.
- The task requires changing a shared contract.
- Verification requires secrets, real external services, destructive actions, or Owner judgement.
- The lane identity does not match this handoff.
- The next action would require marking beyond `candidate_done`.

## Worker Handoff Notes

| Time | Note | Evidence |
| --- | --- | --- |
| `<timestamp>` | `<note>` | `<evidence link>` |
