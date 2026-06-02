# DIAYN Integration Summary

Stage: `<stage_id>`
Status: `<ready_for_e2e/blocked/rejected_to_lane>`

## Reviewed Lane Inputs

| Lane | Review decision | Evidence |
| --- | --- | --- |
| backend | `<done/not_applicable>` | `<review_log>` |
| frontend | `<done/not_applicable>` | `<review_log>` |

## Integration Checks

| Check | Result | Evidence |
| --- | --- | --- |
| merge status | `<pass/fail/blocked>` | `<path_or_summary>` |
| contract consistency | `<pass/fail/blocked>` | `<path_or_summary>` |
| build | `<pass/fail/blocked>` | `<path_or_summary>` |
| lint | `<pass/fail/blocked>` | `<path_or_summary>` |
| smoke/E2E | `<pass/fail/blocked>` | `<path_or_summary>` |

## Issue Routing

- `<lane_or_shared_issue>`: `<problem_or_none>`

Owner acceptance remains an Owner decision; integration can only mark `ready_for_e2e`.
