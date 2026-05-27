# Session Identity Protocol

> Session identity is a soft safety guard for document-driven multi-session work. It prevents a session from acting as the wrong role, lane, or worktree.

## 1. Scope

Every `/diayn-*` command must run the Session Identity Guard before performing role-specific work.

The guard is not a security sandbox. It is a protocol check that helps the agent stop before it edits the wrong documents or code.

## 2. Identity Sources

Use the best available evidence from:

- Requested command.
- Current working directory.
- `.diayn/local/session_identity.md`, if present.
- `.diayn/worktree_manifest.md`, if present.
- `.diayn/session_registry.md`, if present.
- Current branch, if available.
- Lane board and handoff metadata.
- Allowed read and write paths from permissions documents.

Do not silently rewrite `.diayn/local/session_identity.md` or shared manifest files to make a mismatch pass.

## 3. Expected Command Identity

| Command | Expected role | Expected lane | Expected location |
| --- | --- | --- | --- |
| `/diayn-init` | Controller Session | none | Controller repository path |
| `/diayn-plan` | Controller Session | none | Controller repository path |
| `/diayn-worktrees` | Controller Session | none | Controller repository path |
| `/diayn-backend` | Backend Session | `backend` | `../worktrees/<project_slug>/backend` |
| `/diayn-frontend` | Frontend Session | `frontend` | `../worktrees/<project_slug>/frontend` |
| `/diayn-review-backend` | Backend Review Session | `backend` | backend worktree or authorized review path |
| `/diayn-review-frontend` | Frontend Review Session | `frontend` | frontend worktree or authorized review path |
| `/diayn-sync` | Controller Session | none | Controller repository path |
| `/diayn-integration` | Controller Integration Review | none or affected lanes | Controller repository path |
| `/diayn-bug` | Controller Session | none or affected lanes after triage | Controller repository path |
| `/diayn-new` | Controller Session | none or affected lanes after triage | Controller repository path |
| `/diayn-html` | Controller Session or Owner-support session | none unless explaining a lane report | Controller-approved path |

## 4. Guard Steps

1. Parse the requested command and expected role.
2. Determine the current path and, if available, current branch.
3. Read local identity if present.
4. Read shared manifest and session registry if present.
5. Compare role, lane, command, expected path, and writable scope.
6. If all critical fields match, continue.
7. If a non-critical field is unknown, state the assumption and proceed only when the command can remain inside safe write boundaries.
8. If a critical field conflicts, stop with the mismatch output.

Critical fields:

- Requested command.
- Role.
- Lane for lane-specific commands.
- Worktree path for worker and review sessions.
- Write boundary.

## 5. First Initialization

`/diayn-init` may be the first command in a repository with no `.diayn/` files.

In that case:

- Treat the requested command as a Controller intent.
- Confirm the repository root.
- Ask the Owner for `project_slug`.
- Create or update shared control metadata only when authorized by the initialization workflow.
- Do not infer a confirmed identity from an unconfirmed directory name.

If `.diayn/` already exists and indicates a non-Controller role, stop and ask the Owner or Controller to correct the session.

## 6. Local Identity File

Local identity belongs at:

```text
.diayn/local/session_identity.md
```

Use `docs/templates/session_identity_template.md`.

The file should record:

- `project_slug`
- Declared role.
- Current lane.
- Expected worktree path.
- Allowed command.
- Allowed workflow.
- Last verified time.

`.diayn/local/**` must remain local-only.

## 7. Mismatch Output

Use this exact shape, filling placeholders:

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

If the correct action is not clear, replace the final command with:

```text
Ask the Controller or Owner to confirm the intended session identity.
```

## 8. Unknown Identity

Unknown identity is not always a blocker.

Allowed:

- `/diayn-init` in a repository that has not been initialized.
- `/diayn-html` when the user only asks for an explanation and no project state will be changed.
- A read-only investigation that stops before state changes.

Blocked:

- Lane work without a matching lane identity.
- Review decisions without a matching review role.
- Controller state changes from a worker path.
- Any write when writable scope is unknown.

## 9. Reporting

Every command output should include:

- Identity checked: pass, mismatch, or unknown read-only.
- Sources used for identity.
- Role and lane used for the command.
- Any mismatch or assumption.
