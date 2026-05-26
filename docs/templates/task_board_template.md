---
document_role: "Generic task board template"
template_status: "Compatibility template"
primary_use:
  - "Prefer docs/templates/lane_board_template.md for new multi-session lane work."
  - "Use this template only when a project needs a generic non-lane task board."
permission: "Owner controlled template"
---

# Task Board Template

This template is not active project state. Copy it into an authorized project
location before use.

For DIAYN multi-session work, the default task board is the lane board:

```text
docs/lanes/<lane>/board.md
```

## 1. Source

- Project or stage: `<project_or_stage>`
- Lane or owner: `<lane / Controller / n/a>`
- Related global summary: `TODO.md`
- Related handoff: `<path or n/a>`
- Evidence log: `<path or n/a>`
- Review log: `<path or n/a>`

## 2. WIP Rule

- Keep lane-level WIP=1.
- A lane should have at most one `doing` item.
- Backend, frontend, and other lanes may proceed in parallel when their boards
  and shared contracts allow it.

## 3. Task Summary

| ID | Status | Title | Expected outcome | Verification | Evidence | Review | Next |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `T-001` | `<todo>` | `<title>` | `<observable result>` | `<command/check/manual observation>` | `<path or note>` | `<review log or n/a>` | `<next action>` |

## 4. Task Detail

### T-001 `<title>`

- ID: `T-001`
- Status: `<todo / doing / candidate_done / reviewing / done / rejected / owner_gate / ready_for_e2e / owner_accepted / blocked / archived / dropped>`
- Scope: `<in-scope items>`
- Out of scope: `<explicit non-goals>`
- Expected outcome: `<observable behavior or document result>`
- Verification plan: `<how this will be checked>`
- Evidence: `<path, command output summary, screenshot, or missing-evidence note>`
- Review decision: `<done / rejected / n/a>`
- Owner acceptance: `<owner_accepted / n/a>`
- Notes: `<short note; put long process detail in worklog>`

## 5. Status Rules

- No task moves to `doing` without a verification plan or a clear reason why
  verification is not applicable.
- Worker sessions may mark at most `candidate_done`, `blocked`, or
  `owner_gate`.
- Review sessions decide `done` or `rejected`.
- Controller Integration Review decides whether reviewed work can become
  `ready_for_e2e`.
- Owner Acceptance is required for `owner_accepted`.
- Legacy state names are migration inputs only; see
  `docs/meta/legacy_migration_guide.md`.
