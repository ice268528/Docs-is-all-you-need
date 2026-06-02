# `/diayn-worktrees`
## Role

Controller Session.

## User Input Scenario

Stage, batch, or lane planning is confirmed enough to prepare separate lane sessions.

```text
/diayn-worktrees
```

## Preconditions

- Lane boards and handoffs exist or can be generated.
- Required worker documents are visible or can be made visible.
- `project_slug` is confirmed.

## Required Reading

- `.diayn/worktree_manifest.md`
- `.diayn/session_registry.md`
- Backend and frontend lane boards and handoffs.
- Shared contracts and shared issue records.
- `docs/meta/diayn_worktree_workflow.md`
- `docs/meta/session_identity_protocol.md`

Use the bundled helper when deterministic worktree preflight or copyable command generation is needed:

```text
skills/diayn-worktrees/scripts/worktree_plan.py
```

Default behavior is dry-run. Actual `git worktree add` execution requires explicit authorization in the active environment.

## Allowed Writes

- `.diayn/worktree_manifest.md`
- `.diayn/session_registry.md`
- Lane handoff documents.
- Launch prompt drafts using `docs/templates/lane_session_launch_prompt_template.md`
- Review launch prompt drafts using `docs/templates/review_session_launch_prompt_template.md`
- Session entry checklists and local identity guidance from `skills/diayn-worktrees/assets/worktrees/`

## Forbidden

- Do not default to launching interactive agent subprocesses.
- Do not hide which session the user is controlling.
- Do not assume uncommitted controller-only files are visible in worker worktrees.
- Do not put stage identifiers into long-lived worktree directory names.
- Do not create worktrees for `not_applicable` lanes.
- Do not merge business code during `/diayn-worktrees`.

Actual `git worktree` commands require explicit user authorization in the active project environment. The default behavior is to output instructions and prompts.

If authorization is unavailable or denied, output copyable commands with the intended working directory and shell/platform assumptions. Do not claim worktrees were created.

## Status Changes

- Worktree entries may move among `planned`, `ready`, `blocked`, or `archived`.
- Lane task statuses do not become `doing` until a lane session starts.

## Required Records

- Worktree manifest updates.
- Session registry updates.
- Visibility check results.
- Startup commands and prompts.

## Stop Conditions

- Required documents are not visible to the worker worktree.
- A worktree path conflicts with another lane.
- The user expects the Controller to run hidden interactive agents.
- Worktree creation would require permission that has not been granted.
- The current session is not the Controller session.
- The same lane already has active worker or reviewer activity.
- A reviewer would start before the same-lane worker stopped and reported.
- Applicable lane handoff or board files are missing.

## Success Output

Use placeholder commands only:

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

Report which worktrees are planned, ready, or blocked.

Identity mismatch output: `../diayn_command_reference.md#2-common-identity-mismatch-output`.

## Identity Mismatch Behavior

Use the common Session Identity Guard behavior and mismatch output defined in `../diayn_command_reference.md#2-common-identity-mismatch-output`. Stop rather than continuing whenever role, lane, path, manifest, local identity, requested command, or write boundary do not match this command.
