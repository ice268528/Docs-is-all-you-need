# Multi-Session Collaboration Protocol

> This document is the top-level protocol for using Docs-is-all-you-need as a multi-session, document-driven collaboration control plane.

## 1. Scope

Docs-is-all-you-need coordinates multiple coding-agent sessions through repository documents. It does not replace the coding agent, create a custom runtime, or make tool-specific assumptions.

The protocol must remain project-neutral. Core rules should use variables such as:

- `<project_slug>`
- `<stage_id>`
- `<lane>`
- `<worktree_root>`
- `<contract_path>`
- `<verification_command>`
- `<owner_acceptance_path>`

Do not write concrete project names, business features, providers, or technology stacks into the core protocol.

## 2. Authority Order

When documents conflict, use this order:

1. Owner's latest explicit instruction in the current session.
2. Confirmed project facts in `docs/project/**`, `docs/shared/**`, and current stage documents.
3. This protocol and other `docs/meta/**` rules.
4. Lane documents and active task documents.
5. Reports, examples, templates, and chat summaries.

Reports, examples, and templates can inform work, but they do not directly authorize execution.

## 3. Canonical Protocol Files

| Concern | Canonical file |
| --- | --- |
| Overall multi-session flow | `docs/meta/multi_session_collaboration_protocol.md` |
| Roles and role-specific authority | `docs/meta/session_roles.md` |
| Document write permissions | `docs/meta/agent_doc_permissions.md` |
| Execution workflow boundaries | `docs/meta/agent_execution_workflows.md` |
| Status names and transitions | `docs/meta/status_model.md` |
| Skill mapping and skill/vendor boundary | `docs/meta/session_skill_mapping.md` |
| Progressive disclosure | `docs/meta/progressive_disclosure_rules.md` |
| `/diayn-*` command semantics | `docs/meta/diayn_command_reference.md` |
| Document architecture and repository authority | `docs/meta/docs_framework_overview.md` |

Command-level semantics are defined in `docs/meta/diayn_command_reference.md`. This protocol keeps only cross-cutting role, status, identity, and document-control boundaries.

## 4. Standard Roles

The standard multi-session model contains these roles:

- Controller Session
- Backend Session
- Frontend Session
- Backend Review Session
- Frontend Review Session
- Controller Integration Review
- Owner Acceptance

Detailed responsibilities, writable documents, forbidden actions, state authority, and stop conditions are defined in `docs/meta/session_roles.md`.

## 5. Standard Flow

### 5.1 Controller Planning

The Controller Session reads current project facts, clarifies missing information, plans stage / batch / lane work, and ensures every worker or reviewer can see the documents it must read.

The key visibility rule is:

```text
Invisible documents cannot be used as task dispatch authority.
```

If a worker worktree or review session cannot access a required contract, handoff, lane board, stage goal, or verification instruction, the controller must stop and make the required document visible before dispatching work.

### 5.2 Lane Execution

Backend and Frontend Sessions execute only the tasks authorized for their own lane. They may update same-lane board, evidence, worklog, and handoff documents, and may modify code only inside the lane's authorized implementation scope.

Worker sessions may advance their own tasks at most to `candidate_done`. They cannot mark `done`, `owner_accepted`, or integration readiness.

### 5.3 Lane Review

Backend Review and Frontend Review Sessions inspect the corresponding lane diff, tests, evidence, acceptance criteria, and permission boundaries. They write review logs and mark candidate work as `done` or `rejected`.

Review sessions do not implement fixes by default.

### 5.4 Controller Integration Review

After lane review passes, the Controller performs integration review. The Controller checks shared contracts, merge readiness, end-to-end or smoke coverage, and consistency between global summary and lane boards.

Integration problems are written back to the corresponding lane board or shared integration issue. The Controller does not silently repair lane implementation by default.

### 5.5 Owner Acceptance

Owner Acceptance is the business and experience-level acceptance step. The Owner should not be required to read test internals or implementation details. Engineering verification must be summarized into evidence and acceptance notes that support a clear human decision.

Only Owner Acceptance can set `owner_accepted`.

## 6. Session Identity Guard

Session Identity Guard is a soft safety mechanism above ordinary coding agents. It is not a security sandbox, agent runtime, permission system, or replacement for human review.

Identity checks may use these sources when present:

- The user-entered `/diayn-*` command.
- The current working directory.
- `.diayn/local/session_identity.md`.
- `.diayn/worktree_manifest.md`.

Before any `/diayn-*` workflow runs, the active session should compare the intended role, lane, worktree, and project identity against the available sources.

If identity is inconsistent, the session must stop and explain the mismatch plus the corrective action, such as moving to the correct worktree or starting the matching session role. If identity cannot be confirmed, the session must ask the Owner or Controller instead of continuing a role-specific task.

This protocol defines the guard concept. The actual `.diayn/` files and command workflow are introduced by the scaffold setup and command workflow docs.

## 7. Document Control Principles

- Controller maintains global summaries, shared docs, stage docs, and lane handoff.
- Worker sessions maintain only their own lane board, worklog, evidence, and handoff updates.
- Worker sessions do not modify global `TODO.md` by default.
- Worker sessions do not modify other lane documents by default.
- Review sessions write review logs and status decisions for the lane they review.
- Integration issues are written by the Controller into the relevant lane board or shared issue.

Full document permissions are defined in `docs/meta/agent_doc_permissions.md`.

## 8. Status Principles

Use the multi-session status model in `docs/meta/status_model.md`.

Important rules:

- Worker sessions may only claim `candidate_done`, not `done`.
- Review sessions decide `done` or `rejected`.
- Controller Integration Review may move reviewed work toward `ready_for_e2e`.
- Owner Acceptance decides `owner_accepted`.
- `auto_verified` is a legacy compatibility state, not a multi-session final state.
- Global WIP=1 migrates to lane-level WIP=1.

## 9. Progressive Disclosure

Entry files such as `AGENTS.md` and `CLAUDE.md` are landing pages and indexes. They must not contain the full protocol.

Long rules belong in `docs/meta/**`. Long examples belong in examples or references. `SKILL.md` files should describe workflows and link to references rather than duplicate the full manual.

The detailed rule set is in `docs/meta/progressive_disclosure_rules.md`.

## 10. Stop Conditions

Stop and ask the Controller or Owner when:

- Required documents are missing or invisible to the target session.
- The current session identity does not match the requested role or lane.
- A worker would need to modify global `TODO.md`, another lane, shared contract, stage boundary, or project constraints.
- A reviewer would need to implement fixes instead of reviewing.
- A controller would need to mark Owner acceptance or silently change business scope.
- A command or workflow detail is not defined in the current canonical documents.
- Existing documents conflict in a way that would force a product, architecture, or acceptance decision.
