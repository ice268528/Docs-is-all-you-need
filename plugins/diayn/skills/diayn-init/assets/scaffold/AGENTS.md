# AGENTS

## 1. What This Repository Is

- Project slug: `<project_slug>`
- Product goal: `<owner_confirmed_goal_or_Unknown>`
- Current stage: `<stage_id_or_Unknown>`
- Primary Owner: `<owner_name_or_Unknown>`

## 2. How To Use DIAYN Here

This is the entry file for Codex, OpenCode, and generic coding-agent sessions in this project.

This project uses DIAYN as a document-driven workflow. Use DIAYN through platform-specific DIAYN entrypoints: Claude Code plugin uses `/diayn:*`, Claude project-local fallback uses `/diayn-*`, and Codex/OpenCode adapters use their own adapter-defined DIAYN entrypoints. This file is the Codex/OpenCode/generic peer entry file. `CLAUDE.md` is the Claude Code peer entry file. Neither one is a wrapper or mandatory first read for the other.

## 3. Cold-Start Questions

1. What project is this?
2. How do I run or inspect it?
3. How do I verify a change?
4. What hard constraints must I not violate?
5. What is the next DIAYN command or Owner decision?

## 4. Current Pointers

- Current summary: `TODO.md`
- Project brief: `docs/project/project_brief.md`
- File index: `docs/project/file_index.md`
- Install and support truth: `docs/install/README.md`
- Multi-session protocol: `docs/meta/multi_session_collaboration_protocol.md`
- Role authority: `docs/meta/session_roles.md`
- Document permissions: `docs/meta/agent_doc_permissions.md`
- Execution workflows: `docs/meta/agent_execution_workflows.md`
- Status model: `docs/meta/status_model.md`
- DIAYN command reference index: `docs/meta/diayn_command_reference.md`
- Platform-specific DIAYN command details: `docs/meta/diayn_commands/`
- Session identity guard: `docs/meta/session_identity_protocol.md`
- Worktree lane startup: `docs/meta/diayn_worktree_workflow.md`
- Owner decision UX: `docs/meta/owner_decision_ux_protocol.md`
- Owner acceptance UX: `docs/meta/owner_acceptance_protocol.md`
- Progressive disclosure: `docs/meta/progressive_disclosure_rules.md`

## 5. Safety Rules

- Do not change Owner requirements silently.
- Do not overwrite existing project docs without an Owner-approved conflict report.
- Do not put secrets, private logs, raw prompts, or credentials into DIAYN docs.
- Do not merge business code during `/diayn-sync`.
- Worker sessions stop at `candidate_done`; reviewers decide `done` or `rejected`; only the Owner confirms `owner_accepted`.
