---
document_role: "Stage-scoped worklog template"
template_status: "Generic template"
permission: "Owner controlled template"
---

# Worklog

> Copy this template to `docs/lanes/<lane>/stages/<stage-id>/worklog.md`. The lane root `docs/lanes/<lane>/board.md` remains the current index; do not let one worklog grow forever.

## 1. Source

- Stage: `<stage_id>`
- Lane: `<lane>`
- Current lane index: `docs/lanes/<lane>/board.md`
- Current handoff: `docs/lanes/<lane>/handoff.md`
- Current lane evidence index: `docs/lanes/<lane>/evidence.md`
- Current lane review index: `docs/lanes/<lane>/review_log.md`
- Maintainer: `<Coding Agent / Owner / Controller>`

## 2. Timeline

| Time | Actor | Event | Task | Summary |
| --- | --- | --- | --- | --- |
| `<YYYY-MM-DD HH:mm>` | `<Coding Agent>` | `<start / modify / verify / block / recover / closeout>` | `<T-001>` | `<short summary>` |

## 3. Task Notes

### T-001 `<task title>`

- Goal: `<behavior or expected outcome>`
- What changed: `<implementation or document detail>`
- Verification: `<command, check, or inspection>`
- Follow-up: `<anything the next session must know>`

## 4. Verification

| Time | Task | Command or check | Result | Evidence |
| --- | --- | --- | --- | --- |
| `<YYYY-MM-DD HH:mm>` | `<T-001>` | `<command or check>` | `<pass / fail / skipped>` | `<log summary, screenshot, path, or missing-evidence note>` |

## 5. External Calls

| Time | Target | Authorization source | Result | Notes |
| --- | --- | --- | --- | --- |
| `<YYYY-MM-DD HH:mm>` | `<real API / provider / service>` | `<Owner decision or n/a>` | `<result summary>` | `<cost, risk, rollback note>` |

If there were no real external calls, write `none`.

## 6. Risks

- `<risks, limits, or follow-up verification suggestions>`

## 7. Archive Or Migration Notes

- `<what was synced to TODO, handoff, owner questions, archive, or stage closeout>`

## 8. Use Rules

- The worklog may record detailed commands, outputs, failure attempts, and recovery steps.
- `TODO.md` should keep only a short status summary.
- Move stage-specific detail into a new stage file instead of expanding one forever-growing root worklog.
