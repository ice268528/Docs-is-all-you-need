# DIAYN Command Output Template

> Use this template for the final response of a `/diayn-*` workflow. It is a response structure, not an active project fact until copied into a report or log.

## Command Result

| Field | Value |
| --- | --- |
| Command | `<requested_command>` |
| Role | `<confirmed_role>` |
| Lane | `<lane-or-none>` |
| Identity check | `<pass / mismatch / read-only unknown>` |
| Command outcome | `<completed / blocked / owner_gate / rejected / not_ready>` |

## Documents Read

| Path | Purpose |
| --- | --- |
| `<path>` | `<why it was read>` |

## Changes

| File or area | Change | Permission basis |
| --- | --- | --- |
| `<path>` | `<created / updated / not changed>` | `<role permission or explicit authorization>` |

## Status Updates

| Item | Previous status | New status | Evidence |
| --- | --- | --- | --- |
| `<task_or_issue_id>` | `<status>` | `<status>` | `<evidence link>` |

## Evidence And Logs

| Record type | Path | Summary |
| --- | --- | --- |
| Evidence | `<path or n/a>` | `<summary>` |
| Worklog | `<path or n/a>` | `<summary>` |
| Review log | `<path or n/a>` | `<summary>` |
| Sync log | `<path or n/a>` | `<summary>` |

## Stop Or Next Step

- Stop reason: `<none / reason>`
- OwnerGate: `<none / question>`
- Next recommended command: `<command or none>`
- User action needed: `<short action>`

## Boundary Check

| Check | Result |
| --- | --- |
| Stayed inside role | `<yes/no>` |
| Stayed inside lane | `<yes/no/not-applicable>` |
| Avoided unauthorized shared contract changes | `<yes/no/not-applicable>` |
| Avoided direct merge or release actions | `<yes/no/not-applicable>` |
| Verification evidence recorded | `<yes/no/not-applicable>` |

## Identity Mismatch Response

If identity does not match, do not fill the normal result sections. Use:

```text
Detected a session identity mismatch.

Requested command: <requested_command>
Expected role: <expected_role>
Expected lane: <expected_lane_or_none>
Detected role: <detected_role_or_unknown>
Detected lane: <detected_lane_or_unknown>
Current path: <current_path>
Expected path: <expected_path>

I will not execute <requested_command> from this session.

To continue, open the expected location:
cd <expected_path>

Then run:
<correct_command>
```
