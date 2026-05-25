---
diayn_sync_log_version: 0.1
project_slug: "<project_slug>"
current_stage: "<stage_id>"
---

# Sync Log Template

> Copy this template to `.diayn/sync_log.md` or another Controller-owned sync record.

## Sync Events

| Time | Actor | Event type | Source docs | Summary | Follow-up |
| --- | --- | --- | --- | --- | --- |
| `<timestamp>` | `Controller` | `sync` | `<paths>` | `<summary>` | `<next action>` |

Event types:

- `sync`
- `lane_status_update`
- `review_result_import`
- `integration_review`
- `todo_cleanup`
- `owner_gate`

## Lane Snapshot

| Lane | Board | Current status | Candidate done | Review result | Blockers |
| --- | --- | --- | --- | --- | --- |
| `<lane>` | `docs/lanes/<lane>/board.md` | `<status>` | `<yes/no>` | `<done/rejected/n/a>` | `<links>` |

## Integration Snapshot

| Check | Result | Evidence | Issues |
| --- | --- | --- | --- |
| Shared contract consistency | `<pass/fail/not-run>` | `<links>` | `<issue links>` |
| Build / lint / typecheck | `<pass/fail/not-run>` | `<links>` | `<issue links>` |
| Smoke / E2E | `<pass/fail/not-run>` | `<links>` | `<issue links>` |

