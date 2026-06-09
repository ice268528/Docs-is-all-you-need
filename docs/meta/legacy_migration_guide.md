# Legacy Migration Guide

This guide explains how to migrate older single-session DIAYN scaffold content
into the multi-session model without deleting useful history or confusing old
state names with the current protocol.

## What Counts As Legacy

Legacy content includes older files or project records that assume:

- A single coding agent owns the whole implementation flow.
- Global `TODO.md` carries all task details.
- `auto_verified` means agent-side completion.
- `accepted` means Owner acceptance.
- Stage or batch handoff files are the main execution dispatch mechanism.
- Work happens in one working tree instead of lane-specific sessions.

These files can remain as historical or compatibility material, but new active
multi-session work should use the canonical lane, review, and Owner acceptance
documents.

## Status Mapping

| Legacy state or phrase | Migrate to | Use when |
| --- | --- | --- |
| `auto_verified` | `candidate_done` | A worker has completed and verified a slice, but independent review has not accepted it. |
| `auto_verified` | `done` | A separate review session accepted the work and evidence is recorded. |
| `accepted` | `owner_accepted` | The Owner accepted the business or experience result. |
| `ready_for_e2e` | `ready_for_e2e` | Controller integration has evidence that reviewed work is ready for Owner-level acceptance. |
| `waiting_verify` | `reviewing`, `blocked`, or `candidate_done` | Choose based on whether review is active, missing dependencies block review, or worker work is ready for review. |
| `waiting_Owner_test` | `ready_for_e2e` or `owner_gate` | Use `ready_for_e2e` when evidence is enough for Owner acceptance; use `owner_gate` when a decision is needed first. |
| global task `doing` | lane `doing` | The task belongs to a specific lane and is actively in progress. |
| Global WIP=1 | lane-level WIP=1 | Preserve focus within each lane while allowing backend/frontend or other lanes to proceed in parallel. |

Do not map `auto_verified` directly to `done` unless independent review
evidence exists.

## Directory Migration

| Legacy location | Current location | Migration rule |
| --- | --- | --- |
| `TODO.md` detailed task board | `docs/lanes/<lane>/board.md` plus `docs/lanes/<lane>/stages/<stage-id>/**` | Keep `TODO.md` as a Controller summary; move active lane detail to lane indexes and stage-scoped lane records. |
| `docs/templates/task_board_template.md` | `docs/templates/lane_board_template.md` | Use the lane board template for new active multi-session work. |
| `docs/handoffs/stage_summary_template.md` | `docs/templates/handoff_packet_template.md` and lane handoffs | Preserve old summaries as history; dispatch new lane work through handoff packets. |
| `docs/testing/manual_test_template.md` | `docs/templates/owner_experience_acceptance_template.md` | Owner acceptance should be business-facing. Engineering verification remains evidence for agents. |
| `docs/reports/codex_prompt_handoffs/**` | historical archive or example-only material | Do not make historical prompt handoffs required active protocol. |
| local identity notes | `.diayn/local/session_identity.md` | Keep local-only; do not commit `.diayn/local/**`. |

## Migration Steps

1. Inventory active tasks and separate active work from history.
2. Choose lanes such as `backend`, `frontend`, or another project-specific lane.
3. Move current lane summary and task index into `docs/lanes/<lane>/board.md`.
4. Move dispatch context into `docs/lanes/<lane>/handoff.md`.
5. Move reproducible evidence into `docs/lanes/<lane>/evidence.md` and detailed stage evidence into `docs/lanes/<lane>/stages/<stage-id>/evidence.md`.
6. Create or refresh review entries in `docs/lanes/<lane>/review_log.md` and stage-scoped review notes in `docs/lanes/<lane>/stages/<stage-id>/review_log.md`.
7. Map legacy statuses using the table above.
8. Preserve old task IDs or record a mapping when IDs change.
9. Summarize cross-lane readiness in `.diayn/sync_log.md` or the Controller
   summary.
10. Ask the Owner for business acceptance only through Owner-facing acceptance
    records.

## Stop Conditions

Stop and ask the Owner or Controller before migration if:

- A legacy item cannot be assigned to a lane.
- Evidence is missing but the item was previously described as complete.
- A status would need to jump from worker self-verification to `done`.
- Owner acceptance is claimed but no Owner-facing acceptance record exists.
- Migration would delete history rather than mark it superseded or archived.

## Completion Criteria

Migration is complete when every active item has:

- A lane or Controller owner.
- A current canonical status.
- A visible source document.
- Evidence or an explicit missing-evidence note.
- A review decision when claiming `done`.
- Owner-facing acceptance when claiming `owner_accepted`.
