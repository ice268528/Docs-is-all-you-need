# Collaboration Workflow Guide

This guide explains the default DIAYN multi-session workflow. It does not
replace the authoritative status, role, or permission documents.

Authoritative references:

- `docs/meta/status_model.md`
- `docs/meta/session_roles.md`
- `docs/meta/agent_doc_permissions.md`
- `docs/meta/session_identity_protocol.md`
- `docs/meta/controller_sync_integration_protocol.md`

## 1. Roles

| Role | Main responsibility | Normal status authority |
| --- | --- | --- |
| Controller Session | Clarify scope, plan lanes, maintain global summary, dispatch work, sync lanes, and run integration review. | `ready_for_e2e` after evidence-backed integration review |
| Worker Session | Execute one lane-local task slice and record evidence. | `candidate_done` |
| Review Session | Review candidate lane work against evidence, diff, criteria, and permissions. | `done` or `rejected` |
| Controller Integration Review | Check reviewed lanes together and write integration issues. | `ready_for_e2e` or issue statuses |
| Owner Acceptance | Confirm business or experience acceptance. | `owner_accepted` |

## 2. Normal Flow

1. Controller clarifies requirements, scope, missing decisions, and
   `project_slug`.
2. Controller plans lanes and writes visible lane boards and handoffs.
3. Controller prepares worktree metadata and session launch guidance.
4. Worker Session runs the Session Identity Guard.
5. Worker reads lane board, handoff, shared docs, evidence, and worklog.
6. Worker executes one clear task slice.
7. Worker records verification evidence and stops at `candidate_done`,
   `blocked`, or `owner_gate`.
8. Review Session reviews the pasted worker report, diff, evidence, tests, and
   permissions.
9. Review Session marks `done` or `rejected`.
10. Controller syncs lane state.
11. Controller Integration Review checks cross-lane readiness and records
    issues or marks `ready_for_e2e`.
12. Owner performs business-facing acceptance and may authorize
    `owner_accepted`.

## 3. TODO.md And Lane Boards

`TODO.md` is a Controller-owned global summary. It is not a worker task board.

Worker sessions use:

- `docs/lanes/<lane>/board.md`;
- `docs/lanes/<lane>/handoff.md`;
- `docs/lanes/<lane>/evidence.md`;
- `docs/lanes/<lane>/worklog.md`;
- `docs/lanes/<lane>/review_log.md` after review.

## 4. OwnerGate And New Information

Use `owner_gate` when human judgement is needed before continuing. Examples:

- scope or requirement ambiguity;
- shared contract or architecture change;
- cost, provider, security, release, or deployment decision;
- business acceptance judgement.

New requirements and bug reports are triaged by the Controller. The Controller
decides whether they enter current scope or become later backlog, then syncs the
relevant lane board or handoff.

## 5. Worktree And Visibility Rule

The default long-lived path shape is:

```text
../worktrees/<project_slug>/<lane>
```

Documents that a worker or reviewer must read must be visible from the
corresponding worktree. Invisible documents cannot be used as dispatch
authority.

## 6. Stopping Rule

A session should stop and report when:

- it completes one authorized task slice;
- identity, lane, or path does not match the requested command;
- evidence is missing for the requested status;
- it would need to change another lane, global scope, or shared contract;
- it would need to mark a status outside its authority;
- Owner judgement is needed.
