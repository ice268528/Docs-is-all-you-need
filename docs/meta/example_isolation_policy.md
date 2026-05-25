# Example Isolation Policy

Examples help users understand DIAYN, but examples are not protocol authority.
This policy keeps examples useful without letting sample material pollute the
core scaffold.

## Rules

- Put examples under `docs/examples/**`.
- Every example directory must contain a `README_NOT_CORE.md` file.
- Examples may show realistic flow shape, but they must use placeholders such
  as `<project_slug>`, `<lane>`, `<task_id>`, and `<owner_feedback>`.
- Examples must not define new statuses, roles, permissions, command semantics,
  worktree paths, or adapter behavior.
- Examples must link back to canonical `docs/meta/**` and `docs/templates/**`
  files instead of copying full protocols.
- Examples must not be required reading for ordinary `/diayn` command execution.
- Examples may be copied into a real project only after replacing placeholders
  and checking against current protocol documents.

## What Examples May Contain

- A small Controller flow.
- A lane handoff sample.
- A review flow sample.
- An Owner acceptance sample.
- A diagram or table that explains sequence.
- Notes about what to replace before use.

## What Examples Must Not Contain

- A real product name or private project fact.
- A technology stack mandate.
- A real worktree path tied to this repository.
- A claim that a plugin is installable.
- A claim that vendored upstream material overrides DIAYN-owned skills.
- A shortcut that lets a worker mark `done`.

## Review Checklist

Before shipping an example:

- [ ] The directory has `README_NOT_CORE.md`.
- [ ] The example says it is not core protocol.
- [ ] Placeholders are used for project-specific facts.
- [ ] Any status shown exists in `docs/meta/status_model.md`.
- [ ] Any `/diayn` command behavior matches `docs/meta/diayn_command_reference.md`.
- [ ] Worktree paths use `../worktrees/<project_slug>/<lane>`.
- [ ] The example does not modify or quote full adapter/plugin drafts.
