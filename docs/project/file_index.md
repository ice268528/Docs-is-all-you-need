---
document_role: "Project file index"
primary_writer: "Controller Session"
audience:
  - "Controller Session"
  - "Worker Session"
  - "Review Session"
  - "Owner"
permission: "Controller write"
---

# File Index

This file is a navigation index. It does not carry task status, review
decisions, or Owner acceptance by itself.

## 1. Entry And Global Summary

| Path | Purpose | Authority note |
| --- | --- | --- |
| `AGENTS.md` | Codex/OpenCode/generic peer entry file. | Owner controlled; keep concise and parity-aligned with `CLAUDE.md`. |
| `CLAUDE.md` | Claude Code peer entry file. | Owner controlled; keep concise and parity-aligned with `AGENTS.md`. |
| `README.md` | Public DIAYN scaffold orientation and truthful user entry. | Owner controlled; keep as an entry point, not a full protocol manual. |
| `TODO.md` | Controller-owned global summary. | Controller write; worker sessions do not update it by default. |

## 2. Core Protocol

| Path | Authority |
| --- | --- |
| `docs/meta/status_model.md` | Canonical status names and transitions. |
| `docs/meta/session_roles.md` | Role responsibilities and status authority. |
| `docs/meta/agent_doc_permissions.md` | Document write boundaries. |
| `docs/meta/multi_session_collaboration_protocol.md` | Multi-session collaboration protocol. |
| `docs/meta/session_identity_protocol.md` | Session Identity Guard protocol. |
| `docs/meta/diayn_command_reference.md` | DIAYN workflow and platform-specific command reference. |
| `docs/meta/controller_sync_integration_protocol.md` | Sync and integration rules. |

## 3. Project And Shared Docs

| Path | Purpose | Permission |
| --- | --- | --- |
| `docs/project/project_brief.md` | Project goals, scope, and non-goals. | Owner controlled. |
| `docs/project/implementation_constraints.md` | Long-term implementation constraints. | Owner controlled. |
| `docs/project/architecture_overview.md` | Architecture overview. | Owner controlled. |
| `docs/project/file_index.md` | Navigation index. | Controller write. |
| `docs/shared/**` | Shared contracts, types, and integration issues. | Controller write or Owner controlled depending on impact. |

## 4. Lane Docs

| Path | Purpose | Permission |
| --- | --- | --- |
| `docs/lanes/<lane>/board.md` | Lane-local task board. | Role-local write; reviewer may write review status. |
| `docs/lanes/<lane>/handoff.md` | Visible dispatch and continuation context. | Controller write and role-local append. |
| `docs/lanes/<lane>/evidence.md` | Verification evidence. | Role-local write. |
| `docs/lanes/<lane>/worklog.md` | Worker process notes. | Role-local write. |
| `docs/lanes/<lane>/review_log.md` | Review decisions. | Review write. |

## 5. Templates And Testing

| Path | Purpose | Note |
| --- | --- | --- |
| `docs/templates/lane_board_template.md` | Default lane board template for multi-session work. | Preferred for new lane work. |
| `docs/templates/task_board_template.md` | Generic compatibility task board template. | Not active state. |
| `docs/templates/owner_experience_acceptance_template.md` | Owner-facing acceptance template. | Use for business acceptance. |
| `docs/testing/test_strategy.md` | Verification and acceptance strategy. | Distinguishes worker verification, review, integration, and Owner acceptance. |
| `docs/testing/manual_test_template.md` | Compatibility pointer to Owner experience acceptance. | Not the default active acceptance template. |
| `docs/handoffs/stage_summary_template.md` | Stage or batch summary template. | Controller-owned summary; not lane dispatch authority. |

## 6. Status Authority Quick Reference

| Status | Authority |
| --- | --- |
| `candidate_done` | Responsible worker session. |
| `done` | Review session. |
| `rejected` | Review session. |
| `ready_for_e2e` | Controller Integration Review. |
| `owner_accepted` | Owner Acceptance, recorded by Controller or authorized session. |

For complete rules, read `docs/meta/status_model.md`.
