# Docs Framework Overview

This overview describes the DIAYN document control plane for multi-session
agent collaboration. It complements the authoritative protocol files:

- `docs/meta/status_model.md`
- `docs/meta/session_roles.md`
- `docs/meta/agent_doc_permissions.md`
- `docs/meta/multi_session_collaboration_protocol.md`

## 1. Default Collaboration Model

DIAYN uses these default roles:

- Controller Session
- Worker Session, such as backend, frontend, or another lane
- Review Session
- Controller Integration Review
- Owner Acceptance

Single-agent project workflows can be migrated into this model, but they are
not the default authority for new work.

## 2. Repository As System Of Record

Durable project facts, scope, status, evidence, decisions, and handoffs must
be recorded in repository documents. Chat summaries help the current session,
but they do not replace repository state.

## 3. Cold Start And DIAYN Preflight

Use the original five cold-start questions to understand the project:

1. What system is this?
2. How is it organized?
3. How do I run it?
4. How do I verify it?
5. Where is the work now?

Then use DIAYN execution preflight to confirm role, lane, worktree, document
permissions, stop conditions, and reporting requirements before acting. Keep
these layers separate so entry files remain readable.

## 4. Document Layers

| Layer | Purpose | Examples |
| --- | --- | --- |
| Entry files | Lightweight starting point and index | `AGENTS.md`, `CLAUDE.md` |
| Controller summary | Global status and next-action summary | `TODO.md` |
| Project facts | Goals, constraints, architecture, file index | `docs/project/**` |
| Shared facts | Contracts, shared types, integration issues | `docs/shared/**` |
| Lane entry indexes | Stable current-stage summary and dispatch surface | `docs/lanes/<lane>/board.md`, `handoff.md`, `evidence.md`, `review_log.md` |
| Lane stage details | Stage-scoped worklog, evidence, and review records | `docs/lanes/<lane>/stages/<stage-id>/**` |
| Stage results | Stage plans, integration results, acceptance, and closeout | `docs/stages/<stage-id>/**` |
| Protocol | Roles, permissions, status, command semantics | `docs/meta/**` |
| Templates | Copyable structures, not active state | `docs/templates/**` |
| Examples | Optional non-core examples | keep outside the public release surface unless they are explicitly maintained |

## 5. TODO.md Authority

`TODO.md` is a Controller-owned global summary. It should show:

- current focus;
- lane status snapshot;
- global blockers;
- Owner gates;
- integration readiness;
- next recommended action.

Worker sessions do not update global `TODO.md` by default. Detailed execution
belongs in lane entry indexes, lane stage detail files, and review logs.

## 6. Status Authority

Use the canonical states from `docs/meta/status_model.md`.

- Workers may claim at most `candidate_done`, `blocked`, or `owner_gate`.
- Review sessions decide `done` or `rejected`.
- Controller Integration Review may mark `ready_for_e2e` with evidence.
- Owner Acceptance authorizes `owner_accepted`.

Legacy state names are migration inputs only and are documented in
`docs/meta/legacy_migration_guide.md`.

## 7. Permission Levels

Use the permission model from `docs/meta/agent_doc_permissions.md`:

- Read only
- Role-local write
- Controller write
- Review write
- Owner controlled
- Archive only

When permissions conflict, stop and ask the Controller or Owner before editing.

## 8. Template And Active Instance Boundary

`docs/templates/**` stores reusable structures. Templates are not active
project state and do not directly authorize work. Copy a template into the
authorized project, lane, handoff, review, or acceptance location before using
it as an active record.

## 9. Minimum Useful Scaffold

A new DIAYN project should have at least:

- `AGENTS.md` or the tool-specific entry file;
- `TODO.md` as Controller summary;
- `docs/project/project_brief.md`;
- `docs/project/implementation_constraints.md`;
- `docs/meta/status_model.md`;
- `docs/meta/session_roles.md`;
- `docs/meta/agent_doc_permissions.md`;
- lane entry indexes under `docs/lanes/<lane>/` and stage-scoped lane details under `docs/lanes/<lane>/stages/<stage-id>/` when worker sessions are used.
