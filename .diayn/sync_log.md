---
diayn_sync_log_version: 0.1
project_slug: "<project_slug>"
current_stage: "<stage_id>"
---

# DIAYN Sync Log

> Controller-owned timeline for lane synchronization and integration review.

Use this log to summarize synchronization events. Do not use it as a replacement for lane evidence, lane review logs, shared contracts, or global `TODO.md`.

## Sync Events

| Time | Actor | Event type | Source docs | Summary | Follow-up |
| --- | --- | --- | --- | --- | --- |
| `<timestamp>` | `Controller` | `sync` | `<paths>` | `<summary>` | `<next action>` |

## Integration Review Events

| Time | Reviewed lanes | Evidence | Result | Issues written |
| --- | --- | --- | --- | --- |
| `<timestamp>` | `<lanes>` | `<evidence links>` | `<ready_for_e2e / blocked / owner_gate>` | `<issue links>` |

