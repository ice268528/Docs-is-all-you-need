# Claude Code Entry File

This file is the entry file for Claude Code sessions. It is a peer entry file with `AGENTS.md`, not an upstream wrapper or mandatory reader.

Keep this entry file concise, but maintain parity with `AGENTS.md` on core cold-start rules, constraints, read-first index, and stop conditions.

This project uses DIAYN as a document-driven workflow. Repository documents are the long-lived collaboration control plane. Chat can clarify immediate intent, but durable rules, project facts, task state, evidence, and acceptance records should live in the repository.

## 1. Project Orientation

- Project name: `<project name>`
- Project goal: `docs/project/project_brief.md`
- Current stage: `docs/stages/stage_XX_goal.md`
- Controller summary: `TODO.md`
- Long-term constraints: `docs/project/implementation_constraints.md`
- Multi-session protocol: `docs/meta/multi_session_collaboration_protocol.md`

If required documents are missing or contradict each other, state the gap. Stop when the gap affects scope, authorization, verification, session identity, or acceptance.

## 2. Fast Cold Start

Before DIAYN role preflight, answer the five project-level cold-start questions:

| Question | Primary source |
| --- | --- |
| What system is this? | `README.md`, `docs/project/project_brief.md` |
| How is it organized? | This file, `docs/project/file_index.md`, `docs/lanes/**`, `docs/shared/**` |
| How do I run it? | This file, project tool files, project docs |
| How do I verify it? | `docs/testing/test_strategy.md`, lane evidence, Owner acceptance docs |
| Where is the work now? | `TODO.md`, lane boards, handoffs, review logs |

These questions are for understanding the project. The DIAYN execution preflight is a second layer for role, lane, worktree, permission, stop condition, and reporting checks.

Codex, OpenCode, and generic coding agents use `AGENTS.md`; this file does not depend on `AGENTS.md` to cold start, though both files may point at the same durable docs.

## 3. Install, Run, Verify

Fill these commands during project initialization. Do not infer them from chat history.

```bash
# install
<install command>

# run
<run command>

# test
<test command>

# lint / typecheck
<lint or typecheck command>
```

Verification policy: `docs/testing/test_strategy.md`.

## 4. Multi-Session Rules

When using multi-session collaboration, read:

- `docs/meta/multi_session_collaboration_protocol.md`
- `docs/meta/session_roles.md`
- `docs/meta/agent_doc_permissions.md`
- `docs/meta/agent_execution_workflows.md`
- `docs/meta/status_model.md`
- `docs/meta/diayn_command_reference.md`
- `docs/meta/diayn_commands/`
- `docs/meta/session_identity_protocol.md`
- `docs/meta/owner_decision_ux_protocol.md`
- `docs/meta/owner_acceptance_protocol.md`
- `docs/install/README.md`

For worktree-based lane startup, also read `docs/meta/diayn_worktree_workflow.md`.

Before any role-specific DIAYN workflow or platform-specific DIAYN command, perform the Session Identity Guard in `docs/meta/session_identity_protocol.md`. Claude Code plugin uses `/diayn:*`; Claude project-local fallback uses `/diayn-*`; Codex, OpenCode, and generic adapters use their own adapter-defined DIAYN entrypoints. If the requested role, lane, directory, or manifest identity does not match, stop and ask the Controller or Owner.

## 5. Hard Constraints

- Follow the Owner's latest explicit instruction for the current session.
- Treat repository documents as the system of record for durable facts.
- Make the smallest change that satisfies the current authorized task.
- Do not silently change project goals, stage scope, shared contracts, architecture, dependencies, or acceptance criteria.
- Do not modify read-only or out-of-role documents.
- Do not commit, publish, delete, migrate, call real external services, read secrets, or perform irreversible actions without explicit authorization.
- Worker sessions may mark at most `candidate_done`; review sessions decide `done` or `rejected`; Owner Acceptance decides `owner_accepted`.
- If required evidence is missing, say what was and was not verified.

## 6. Read-First Index

Read the smallest set needed for the current task.

| Situation | Read |
| --- | --- |
| Any cold start | This file, `TODO.md`, `docs/project/project_brief.md`, `docs/project/file_index.md`, and directly relevant task documents |
| Install and support truth | `docs/install/README.md`; for Claude Code, `docs/install/claude-code.md` |
| Multi-session protocol | `docs/meta/multi_session_collaboration_protocol.md` |
| Role authority | `docs/meta/session_roles.md` |
| Execution workflow | `docs/meta/agent_execution_workflows.md` |
| Document write permission | `docs/meta/agent_doc_permissions.md` |
| Status meaning | `docs/meta/status_model.md` |
| DIAYN workflows / platform-specific DIAYN commands | `docs/meta/diayn_command_reference.md` and the relevant file under `docs/meta/diayn_commands/` |
| Session identity guard | `docs/meta/session_identity_protocol.md` |
| Worktree lane startup | `docs/meta/diayn_worktree_workflow.md` |
| Owner decisions | `docs/meta/owner_decision_ux_protocol.md` |
| Owner acceptance | `docs/meta/owner_acceptance_protocol.md` |
| Testing and acceptance | `docs/testing/test_strategy.md` and active acceptance docs |
| Code style and edit boundary | `docs/meta/agent_code_style_guide.md` |
| Reporting and clean state | `docs/meta/agent_reporting_guide.md` |
| Progressive disclosure | `docs/meta/progressive_disclosure_rules.md` |

`docs/templates/**` contains reusable templates only. A template does not become current project fact until copied or instantiated into an active project, stage, lane, handoff, or acceptance document.

## 7. Stop Conditions

Stop and ask when:

- The task would cross role, lane, or document permission boundaries.
- Session identity cannot be confirmed for a role-specific workflow.
- A required document is invisible from the current worktree or session.
- The next step depends on a product, architecture, scope, provider, cost, safety, or acceptance decision.
- Existing documents conflict and continuing would silently choose one interpretation.
- Verification cannot be run and the missing verification affects completion claims.

Keep this entry file concise. Put durable rules in `docs/meta/**`, long examples in examples or references, and active task state in the appropriate project or lane documents.
