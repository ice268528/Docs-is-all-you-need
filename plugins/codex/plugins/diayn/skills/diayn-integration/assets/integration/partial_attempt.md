# DIAYN Partial Attempt Record

Attempt ID: `<attempt_id>`
Command: `<current /diayn-* command>`
Stage: `<stage_id>`
Status: `partial_attempt`

## Completed Before Failure

- `<completed_step>`

## Failure

- Class: `<implementation_failure/blocked/environment_missing/external_service_unavailable/flaky_or_timeout/inconclusive_evidence>`
- Reason: `<reason>`
- Evidence: `<path_or_summary>`

## Recovery

- Safe to rerun: `<yes/no/after_owner_gate>`
- Cleanup needed: `<none_or_explicit_authorized_action>`
- Next command: `<same command or routed workflow>`

Do not claim completion after a partial attempt. Preserve visible evidence so a fresh session can resume safely.
