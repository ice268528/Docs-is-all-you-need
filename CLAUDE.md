# Claude Code Entry File

This is the Claude Code landing page for the same Docs-is-all-you-need workflow described in `AGENTS.md`.

Use this file as a short index only. Do not copy the full protocol into this file.

## Read First

- General entry rules: `AGENTS.md`
- Multi-session protocol: `docs/meta/multi_session_collaboration_protocol.md`
- Role authority: `docs/meta/session_roles.md`
- Document permissions: `docs/meta/agent_doc_permissions.md`
- Execution workflows: `docs/meta/agent_execution_workflows.md`
- Status model: `docs/meta/status_model.md`
- `/diayn` command reference: `docs/meta/diayn_command_reference.md`
- Session identity guard: `docs/meta/session_identity_protocol.md`
- Worktree lane startup: `docs/meta/diayn_worktree_workflow.md`
- Owner decision UX: `docs/meta/owner_decision_ux_protocol.md`
- Owner acceptance UX: `docs/meta/owner_acceptance_protocol.md`
- Progressive disclosure: `docs/meta/progressive_disclosure_rules.md`

## Claude-Specific Reminder

Before acting as a Controller, Backend, Frontend, Review, Integration, or Owner Acceptance support session, confirm the intended role and lane from repository documents. For `/diayn ...` workflows, perform the Session Identity Guard in `docs/meta/session_identity_protocol.md`.

If identity, task scope, permissions, or verification expectations are unclear, stop and ask the Controller or Owner.

## Hard Constraints

- Repository documents are the system of record for durable facts.
- Worker sessions may mark at most `candidate_done`.
- Review sessions decide `done` or `rejected`.
- Owner Acceptance decides `owner_accepted`.
- Do not modify global summaries, shared contracts, other lane documents, stage boundaries, or project constraints unless the active role and task explicitly allow it.
- Do not commit, publish, delete, migrate, call real external services, read secrets, or perform irreversible actions without explicit authorization.
