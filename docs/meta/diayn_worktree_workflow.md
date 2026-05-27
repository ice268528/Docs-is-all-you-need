# DIAYN Worktree Workflow

> This document defines the worktree collaboration workflow for `/diayn-worktrees`. It records protocol and launch guidance; it does not implement a CLI or create worktrees by itself.

## 1. Purpose

Worktrees let separate lane sessions work in separate directories while sharing the same repository facts.

The Controller owns:

- Worktree planning.
- Manifest updates.
- Required document visibility checks.
- Session launch prompts.
- Lane handoff readiness.

The user owns which terminal or agent session is currently active.

## 2. Default Layout

Default path pattern:

```text
../worktrees/<project_slug>/<lane>
```

Default lane paths:

```text
../worktrees/<project_slug>/backend
../worktrees/<project_slug>/frontend
```

Do not put a stage identifier in the long-lived worktree directory name. Put stage or batch information in branch names, lane boards, handoffs, and `.diayn/worktree_manifest.md`.

## 3. Controller Preflight

Before `/diayn-worktrees` outputs launch instructions, the Controller checks:

- `project_slug` is confirmed by the Owner.
- Backend and frontend lane boards exist or are intentionally omitted.
- Lane handoffs list required documents.
- Shared contracts needed by each lane are visible.
- `.diayn/worktree_manifest.md` records expected paths and branches.
- `.diayn/session_registry.md` records expected session roles.
- `.diayn/local/**` is not used as shared project authority.

Invisible documents cannot be used as task dispatch authority.

## 4. Worktree Manifest Fields

Each lane entry should record:

- Lane name.
- Expected path.
- Branch.
- Baseline commit or branch.
- Current stage or batch placeholder.
- Worktree state: `planned`, `ready`, `blocked`, or `archived`.
- Startup instruction.
- Required documents and visibility result.

Use `docs/templates/worktree_manifest_template.md` when creating or refreshing the manifest.

## 5. Worktree Creation Boundary

`/diayn-worktrees` may explain or propose worktree creation commands for a real project, but actual execution requires explicit user authorization in the active environment.

The default output is guidance, not hidden execution.

Do not default to launching interactive agent subprocesses from the Controller.

Reasons:

- Interactive input and output are difficult for the Controller to manage reliably.
- The user may not see which session is currently active.
- Session boundaries become easy to confuse.
- Permissions, authentication, and terminal lifetime are environment-specific.

## 6. Required Document Visibility

Before a lane session starts, the Controller must ensure the lane can see:

- Entry file: `AGENTS.md` or tool-specific equivalent.
- `docs/meta/diayn_command_reference.md`
- `docs/meta/session_identity_protocol.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/agent_doc_permissions.md`
- Its own `docs/lanes/<lane>/board.md`
- Its own `docs/lanes/<lane>/handoff.md`
- Relevant `docs/shared/**`
- Relevant project constraints and acceptance criteria.

If documents are not visible, mark the worktree or lane dispatch as `blocked` and report what must be synchronized.

## 7. Local Session Identity

Each lane worktree may have local-only identity:

```text
.diayn/local/session_identity.md
```

This file should be copied from `docs/templates/session_identity_template.md` and must not be committed. It is a soft guard for the local session, not a security sandbox.

## 8. Launch Prompt Output

For each ready worker lane, output a command sequence with placeholders:

```text
cd ../worktrees/<project_slug>/backend
codex
/diayn-backend
```

```text
cd ../worktrees/<project_slug>/frontend
codex
/diayn-frontend
```

For review sessions, include the user-pasted report requirement:

```text
/diayn-review-backend
"<paste latest backend session report here>"
```

```text
/diayn-review-frontend
"<paste latest frontend session report here>"
```

## 9. Worker Startup

The worker session must:

1. Run the Session Identity Guard.
2. Read the lane board, handoff, and relevant shared docs.
3. Evaluate whether the next task slice is reasonable, feasible, and sufficiently specified.
4. Execute only one task slice.
5. Update lane evidence, worklog, board, and handoff notes as needed.
6. Stop and report after the slice.

Worker sessions may mark at most `candidate_done`.

## 10. Review Startup

The review session must:

1. Run the Session Identity Guard.
2. Read the user-pasted worker report.
3. Check diff, tests, evidence, acceptance criteria, and permissions.
4. Write the lane review log.
5. Mark `done` or `rejected`.

Review sessions do not merge or implement fixes by default.

## 11. Sync Back

After worker or review activity, the Controller uses `/diayn-sync` to import lane state and `/diayn-integration` to check cross-lane readiness.

Do not treat unreviewed lane work as integrated.
