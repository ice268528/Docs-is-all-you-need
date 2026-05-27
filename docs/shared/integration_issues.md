# Integration Issues

> Controller-owned record for cross-lane issues found during sync or integration review.

## Usage

- Add issues only when they affect more than one lane or shared contract.
- Link each issue back to the responsible lane board or contract.
- Do not use this file to bypass lane review.

## Issue Table

| ID | Status | Affected lane(s) | Source | Summary | Owner | Next action | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<issue_id>` | `todo` | `<lane>` | `<review_log_or_sync_log>` | `<short summary>` | `Controller` | `<next action>` | `<evidence path>` |

Allowed issue statuses: `todo`, `doing`, `blocked`, `reviewing`, `done`, `rejected`, `owner_gate`, `ready_for_e2e`, `archived`, `dropped`.

Do not use shared integration issues as a place for worker `candidate_done` claims or Owner `owner_accepted` records. Worker evidence belongs in lane evidence; Owner acceptance belongs in Owner-facing acceptance records.
