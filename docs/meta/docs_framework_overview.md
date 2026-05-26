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

## 3. Document Layers

| Layer | Purpose | Examples |
| --- | --- | --- |
| Entry files | Lightweight starting point and index | `AGENTS.md`, `CLAUDE.md` |
| Controller summary | Global status and next-action summary | `TODO.md` |
| Project facts | Goals, constraints, architecture, file index | `docs/project/**` |
| Shared facts | Contracts, shared types, integration issues | `docs/shared/**` |
| Lane work | Lane board, handoff, evidence, worklog, review log | `docs/lanes/<lane>/**` |
| Protocol | Roles, permissions, status, command semantics | `docs/meta/**` |
| Templates | Copyable structures, not active state | `docs/templates/**` |
| Examples | Non-core examples | `docs/examples/**` |

## 4. TODO.md Authority

`TODO.md` is a Controller-owned global summary. It should show:

- current focus;
- lane status snapshot;
- global blockers;
- Owner gates;
- integration readiness;
- next recommended action.

Worker sessions do not update global `TODO.md` by default. Detailed execution
belongs in lane boards, evidence, worklogs, and review logs.

## 5. Status Authority

Use the canonical states from `docs/meta/status_model.md`.

- Workers may claim at most `candidate_done`, `blocked`, or `owner_gate`.
- Review sessions decide `done` or `rejected`.
- Controller Integration Review may mark `ready_for_e2e` with evidence.
- Owner Acceptance authorizes `owner_accepted`.

Legacy state names are migration inputs only and are documented in
`docs/meta/legacy_migration_guide.md`.

## 6. Permission Levels

Use the permission model from `docs/meta/agent_doc_permissions.md`:

- Read only
- Role-local write
- Controller write
- Review write
- Owner controlled
- Archive only

When permissions conflict, stop and ask the Controller or Owner before editing.

## 7. Template And Active Instance Boundary

`docs/templates/**` stores reusable structures. Templates are not active
project state and do not directly authorize work. Copy a template into the
authorized project, lane, handoff, review, or acceptance location before using
it as an active record.

## 8. Minimum Useful Scaffold

A new DIAYN project should have at least:

- `AGENTS.md` or the tool-specific entry file;
- `TODO.md` as Controller summary;
- `docs/project/project_brief.md`;
- `docs/project/implementation_constraints.md`;
- `docs/meta/status_model.md`;
- `docs/meta/session_roles.md`;
- `docs/meta/agent_doc_permissions.md`;
- lane docs under `docs/lanes/<lane>/` when worker sessions are used.
