# Owner Acceptance Record

Stage: `<stage_id>`
Integration summary: `<path>`
Owner: `<name_or_Unknown>`

## Business-Facing Checks

| Check | Owner result | Notes |
| --- | --- | --- |
| `<user-visible workflow>` | `<accepted/rejected/not_checked>` | `<note>` |

## Decision

`<accepted/rejected/pending>`

## Routing

- Accepted: Controller performs stage closeout and next-stage baseline refresh.
- Rejected: use `/diayn-bug` with the Owner-visible issue.
- New scope: use `/diayn-new`.

The Owner does not need to judge test code, mocks, coverage, or implementation internals.
