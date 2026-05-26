# Docs-is-all-you-need

Docs-is-all-you-need, or DIAYN, is a document-driven multi-session coding agent collaboration scaffold.

It turns repository documents into the control plane for Controller, worker, reviewer, integration, and Owner acceptance sessions. The goal is not to replace a coding agent. The goal is to give existing agents stable project facts, role boundaries, task state, evidence, handoff records, and review gates.

## Start Here

Use DIAYN when you want more than one coding-agent session to work on the same project without losing scope, evidence, or review authority.

The shortest path is:

```text
/diayn init
/diayn plan
/diayn worktrees
cd ../worktrees/<project_slug>/backend
/diayn backend
cd ../worktrees/<project_slug>/frontend
/diayn frontend
/diayn review backend
/diayn review frontend
/diayn sync
/diayn integration
```

Important first-run notes:

- `/diayn init` must ask the Owner to confirm `project_slug`.
- `/diayn worktrees` uses `../worktrees/<project_slug>/<lane>` as the default path pattern.
- The default lanes are `backend` and `frontend`; other lane names can be introduced by project documents.
- A worker session does one clear task slice, reports, and stops for review.
- A review session needs the latest worker report pasted by the user, then checks diff, evidence, tests, and acceptance criteria.
- The Controller does not silently launch hidden interactive agent subprocesses.

## What `/diayn` Is

`/diayn ...` is a workflow trigger for an existing coding agent that reads this repository's documents and skills.

It is not:

- a shell CLI provided by this repository;
- a built-in slash-command runtime;
- a published or installable Codex plugin;
- a hidden launcher for backend, frontend, or reviewer agents.

The current repository has Codex plugin preparation and draft documents only. It does not provide an installable or publishable Codex plugin.

## Roles At A Glance

| Role | Main responsibility |
| --- | --- |
| Owner | Provides goals, decisions, acceptance feedback, and business experience judgment. |
| Controller Session | Handles initialization, planning, worktree setup, sync, integration, bug triage, and new-requirement triage. |
| Worker Session | Handles lane work such as backend or frontend; completes one task slice and stops. |
| Review Session | Reviews backend or frontend lane work; decides whether reviewed work is `done` or `rejected`. |
| Integration Session | Checks cross-lane readiness and only marks integrated work ready when evidence supports it. |

Every `/diayn ...` workflow should start with the Session Identity Guard so the current command, role, lane, path, manifest, registry, and write boundary match.

## Status Model

DIAYN separates worker progress, review authority, integration readiness, and Owner acceptance.

Use these statuses in the new multi-session flow:

- `candidate_done`: a worker believes one task slice is complete and has evidence.
- `reviewing`: a reviewer is checking worker output.
- `done`: a reviewer approved the lane task slice.
- `rejected`: a reviewer rejected the lane task slice and recorded why.
- `ready_for_e2e`: Controller integration found enough evidence for Owner business acceptance.
- `owner_accepted`: the Owner confirmed the business or user experience.

Worker sessions may mark at most `candidate_done`. Review sessions decide `done` or `rejected`. Owner acceptance decides `owner_accepted`.

## Owner Acceptance

Owner acceptance is about 业务体验 / business experience, not test implementation.

The Owner should be asked things like:

- Can a user complete the intended action?
- Does the result look correct from the user's point of view?
- Does the system show understandable messages for important success, empty, or error states?
- Is there simple evidence that the expected record, side effect, or saved state exists?

The Owner does not need to understand test code, mock setup, coverage, internal test architecture, or internal test commands. Agents provide engineering verification evidence; reviewers check credibility; the Owner judges whether the experience works.

## Extra User Commands

These commands are short entry points. See the command reference for full details.

- `/diayn bug`: use when Owner business experience acceptance fails. The Controller decides whether the issue belongs in the current scope or a later backlog.
- `/diayn new`: use when the Owner introduces a new requirement, dependency change, or direction change. The Controller decides whether it enters the current plan or a future preparation record.
- `/diayn html`: use only when the user asks for an HTML aid. It can help compare a complex decision or explain the previous agent report in Owner-friendly language.

## Skills And Adapters

DIAYN-owned skills live in `skills/**`. They package the core multi-session roles, identity guard, Owner decision UX, and context-compaction reminder.

`third_party/agent-skills/**` is an upstream method-library vendor copy for maintainers. It is not the DIAYN adapter layer and should not replace DIAYN's own multi-session harness.

Tool adapters live in `integrations/**`:

- Codex adapter and plugin preparation documents.
- Claude Code adapter and command planning notes.
- OpenCode adapter and rules planning notes.
- Cursor and Copilot lightweight rules export plans.

Adapters point back to core DIAYN documents. They do not change command semantics or turn the core workflow into a tool-specific protocol.

## Read Next

README is only the front door. Read the smallest document set needed for your session:

| Need | Read |
| --- | --- |
| General agent entry | `AGENTS.md` |
| Claude Code entry | `CLAUDE.md` |
| `/diayn` command details | `docs/meta/diayn_command_reference.md` |
| Worktree lane startup | `docs/meta/diayn_worktree_workflow.md` |
| Session identity guard | `docs/meta/session_identity_protocol.md` |
| Role authority | `docs/meta/session_roles.md` |
| Status meanings | `docs/meta/status_model.md` |
| Document permissions | `docs/meta/agent_doc_permissions.md` |
| Owner decision UX | `docs/meta/owner_decision_ux_protocol.md` |
| Owner acceptance UX | `docs/meta/owner_acceptance_protocol.md` |
| Cross-tool adapter policy | `docs/meta/cross_tool_adapter_policy.md` |

Keep durable project facts in repository documents. Keep chat for immediate coordination, clarification, and user feedback.
