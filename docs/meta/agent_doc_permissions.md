# Agent Document Permissions

> This document defines document write boundaries for multi-session collaboration. It complements `docs/meta/session_roles.md`.

## 1. Permission Levels

- **Read only**: The session may read, quote, summarize, or propose changes, but must not edit the document.
- **Role-local write**: The session may update the document only for its own role, lane, or current authorized task.
- **Controller write**: The Controller may update the document as part of planning, dispatch, synchronization, or integration.
- **Review write**: A review session may update review results and review status for its target lane.
- **Owner controlled**: Changes require Owner authorization or must be recorded through an OwnerGate / decision flow.
- **Archive only**: The session may create snapshots or move records only when explicitly authorized.

## 2. General Rules

- Global `TODO.md` is a Controller-owned summary. Worker sessions do not update it by default.
- Lane documents are lane-local. A backend session does not write frontend lane documents, and a frontend session does not write backend lane documents.
- Shared contracts and project constraints are controlled documents. Worker sessions may propose changes but must stop before changing them unless explicitly authorized.
- Review sessions write review logs and lane status decisions; they do not implement fixes by default.
- Integration issues are written by the Controller to the responsible lane board or shared issue document.
- `.diayn/local/**` is local identity information and should not be treated as shared project state.

## 3. Document Permission Table

| Document or area | Default permission | Primary writers | Notes |
| --- | --- | --- | --- |
| `AGENTS.md`, `CLAUDE.md` | Owner controlled | Owner, Controller with authorization | Entry files stay short and link to deeper docs. |
| `TODO.md` | Controller write | Controller | Global summary only; lane details belong in lane boards. |
| `docs/meta/**` | Owner controlled | Owner, Controller with authorization | Protocol layer. Changes affect all sessions. |
| `docs/project/project_brief.md` | Owner controlled | Owner, Planning / Controller during authorized initialization | Confirmed project goals are not silently changed. |
| `docs/project/implementation_constraints.md` | Owner controlled | Owner, Planning / Controller during authorized initialization | Long-term constraints require OwnerGate to change. |
| `docs/project/architecture_overview.md` | Owner controlled | Owner, Planning / Controller with authorization | Architecture changes require explicit approval. |
| `docs/project/file_index.md` | Controller write | Controller | Should reflect structure without becoming execution authority. |
| `docs/stages/stage_XX_goal.md` | Owner controlled | Owner, Controller with authorization | Stage scope and acceptance criteria are controlled. |
| `docs/shared/contracts/**` | Owner controlled | Controller with Owner authorization | Worker sessions may propose changes but must not silently edit. |
| `docs/shared/shared_types/**` | Controller write or Owner controlled | Controller; workers only when explicitly authorized | Treat as shared contract when it affects multiple lanes. |
| `docs/shared/integration_issues.md` | Controller write | Controller Integration Review | Used for cross-lane or contract issues. |
| `docs/lanes/<lane>/board.md` | Role-local write | Same-lane worker, same-lane reviewer, Controller | Worker may mark up to `candidate_done`; reviewer may mark `done` / `rejected`. |
| `docs/lanes/<lane>/evidence.md` | Role-local write | Same-lane worker; reviewer may append review evidence | Evidence must be factual and reproducible. |
| `docs/lanes/<lane>/worklog.md` | Role-local write | Same-lane worker | Process record for lane work. |
| `docs/lanes/<lane>/handoff.md` | Controller write and role-local append | Controller, same-lane worker | Controller dispatches; worker appends implementation handoff notes. |
| `docs/lanes/<lane>/review_log.md` | Review write | Same-lane review session | Review decision and rationale. |
| `docs/testing/test_strategy.md` | Owner controlled | Owner, Controller with authorization | Testing policy and minimum gates. |
| Active manual test or acceptance docs | Role-local or Controller write | Controller, worker, or acceptance support as authorized | Owner-facing acceptance remains separate from test internals. |
| `docs/templates/**` | Owner controlled | Owner, Controller with authorization | Templates are not active project facts. |
| `docs/handoffs/**` | Controller write | Controller; worker may append only when authorized | Handoffs must be visible to the receiving session. |
| `docs/reports/**` | Read only unless authorized | Planning, Controller, or assigned session | Reports inform decisions but do not directly authorize work. |
| `docs/changes/REQ_*.md` | Read only | Owner or Planning | Requirement input; not automatic execution scope. |
| `docs/bugs/open/BUG_*.md` | Read only | Owner or bug triage role | Bug input and acceptance source. |
| `docs/bugs/closed/BUG_*.md` | Archive only | Controller with explicit trigger | Historical record. |
| `docs/TODO_backup/**` | Archive only | Controller with explicit trigger | Snapshots, not active state. |
| `.diayn/worktree_manifest.md` | Controller write | Controller | Shared control metadata when present. |
| `.diayn/session_registry.md` | Controller write | Controller | Shared session registry when present. |
| `.diayn/sync_log.md` | Controller write | Controller | Sync history when present. |
| `.diayn/local/session_identity.md` | Local only | Current local session setup | Should not be committed or used as shared authority. |

## 4. Status Write Authority

| Status | Default authority |
| --- | --- |
| `todo` | Controller or lane owner |
| `doing` | Responsible lane worker |
| `candidate_done` | Responsible lane worker |
| `reviewing` | Review session |
| `done` | Review session |
| `rejected` | Review session |
| `owner_gate` | Any session, with a clear question or decision need |
| `ready_for_e2e` | Controller Integration Review |
| `owner_accepted` | Owner Acceptance, recorded by Controller or authorized session |
| `blocked` | Any session, within its scope |
| `archived` | Controller |
| `dropped` | Controller with Owner authority when scope is affected |

See `docs/meta/status_model.md` for definitions and transitions.

## 5. Forbidden Silent Modifications

All sessions must stop before silently changing:

- Project goals, non-goals, stage scope, acceptance criteria, or long-term constraints.
- Shared contracts, schemas, APIs, security posture, deployment behavior, provider choices, or cost-bearing services.
- Another lane's board, worklog, evidence, handoff, or review log.
- Global `TODO.md`, unless the active role is Controller.
- Review results, unless the active role is the corresponding Review Session.
- Owner acceptance state, unless the Owner has explicitly accepted the result.

## 6. Conflict Handling

If document permissions conflict with a task request:

1. Stop before editing.
2. Identify the target file and the conflicting permission rule.
3. Ask the Controller or Owner for explicit authorization.
4. Record the decision in the appropriate document if it has durable impact.
