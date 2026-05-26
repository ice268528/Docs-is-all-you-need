---
document_role: "Stage or batch handoff summary template"
template_status: "Generic template"
primary_writer: "Controller Session"
audience:
  - "Owner"
  - "Controller Session"
  - "Worker Session"
  - "Review Session"
permission: "Controller write"
---

# Stage Or Batch Summary

This template summarizes a stage, batch, or milestone. It does not replace
lane handoff packets or review logs.

## 1. Summary

- Summary type: `<stage / batch / milestone>`
- Related stage or milestone: `<stage_id or n/a>`
- Related global summary snapshot: `<TODO snapshot path or n/a>`
- Related lane boards:
  - `docs/lanes/<lane>/board.md`
- Related review logs:
  - `docs/lanes/<lane>/review_log.md`
- Related integration record: `<.diayn/sync_log.md or n/a>`
- One sentence summary: `<what changed or what was decided>`

## 2. Reviewed Work

| ID | Lane | Review decision | Evidence | Notes |
| --- | --- | --- | --- | --- |
| `<task_id>` | `<lane>` | `<done / rejected / n/a>` | `<review/evidence path>` | `<short note>` |

## 3. Candidate Work Still Awaiting Review

| ID | Lane | Candidate evidence | Next review action |
| --- | --- | --- | --- |
| `<task_id>` | `<lane>` | `<evidence path>` | `<review command or reviewer>` |

## 4. Integration And Owner Acceptance

| ID | Topic | Status | Owner feedback | Evidence | Next action |
| --- | --- | --- | --- | --- | --- |
| `INT-001` | `<cross-lane topic>` | `<ready_for_e2e / blocked / owner_gate / n/a>` | `<n/a>` | `<path>` | `<next action>` |
| `OA-001` | `<Owner acceptance topic>` | `<owner_accepted / owner_gate / blocked / n/a>` | `<accept / request_rework / ask_question / n/a>` | `<acceptance path>` | `<route request_rework through /diayn bug or Controller-managed rework>` |

## 5. Open Owner Gates

| ID | Question | Impact | Recommended default | Next action |
| --- | --- | --- | --- | --- |
| `Q-001` | `<question>` | `<scope/lane/contract/UX>` | `<option>` | `<wait / ask / record decision>` |

## 6. Risks And Follow-Up

- Remaining risks: `<none or short list>`
- Blockers: `<none or short list>`
- Next recommended command or workflow: `<next action>`

## 7. Handoff Checklist

- [ ] Global summary updated or snapshot path recorded.
- [ ] Lane boards are linked.
- [ ] Evidence and review logs are linked.
- [ ] Integration issues are linked.
- [ ] OwnerGate and Owner acceptance items are linked.
- [ ] The summary does not copy the full TODO or full worklog body.
