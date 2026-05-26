# Owner Experience Acceptance Template

> Copy this template to an active Owner acceptance location when reviewed and integrated work is ready for business or user experience acceptance.

This document is for the Owner. It should not require the Owner to read test code, understand mocks, inspect coverage, inspect implementation internals, or know how internal verification was implemented.

## Acceptance Metadata

| Field | Value |
| --- | --- |
| Acceptance ID | `<owner_acceptance_id>` |
| Status | `<ready_for_e2e / owner_accepted / owner_gate / blocked>` |
| Prepared by | `<Controller or acceptance support session>` |
| Related lane(s) | `<lane or n/a>` |
| Related review logs | `<paths>` |
| Engineering evidence summary | `<paths or short summary>` |
| Related decision record | `<path or n/a>` |

## What The Owner Is Checking

Describe the expected business or user-visible outcome in plain language:

```text
<business or experience outcome>
```

The central question is:

```text
From a user's point of view, can the intended thing be done reliably enough?
```

## Preconditions

Write these in user terms:

| Precondition | How the Owner can know it is ready |
| --- | --- |
| `<precondition>` | `<visible setup or simple note>` |

## Acceptance Steps

| Step | Owner action | Expected visible result | Simple supporting evidence |
| --- | --- | --- | --- |
| 1 | `<open or start the relevant workflow>` | `<what should be visible>` | `<screenshot, record summary, or n/a>` |
| 2 | `<perform a user action>` | `<expected result>` | `<simple evidence>` |
| 3 | `<check the resulting state>` | `<expected state>` | `<simple evidence>` |

Use project-specific steps only when this template is copied into an active project document.

Generic example patterns only:

- A user can complete `<primary user action>`.
- A user can see `<resulting state>`.
- The system can show simple evidence that `<persistent record or side effect>` exists.
- Error or empty states are understandable for `<relevant scenario>`.

For an account-style workflow, the Owner may check whether a user can create an account, sign in, see the correct post-sign-in state, and confirm a corresponding saved record exists.

This is an example pattern only. It must not become a required feature for every project.

## Known Limits

| Limit | Owner-visible impact | Recommended feedback |
| --- | --- | --- |
| `<limit>` | `<impact>` | `<accept / request_rework / ask_question>` |

## What The Owner Does Not Need To Review

The Owner does not need to review:

- Unit test code.
- Integration test code.
- Mock setup.
- Coverage reports.
- Internal logs unless explicitly requested.
- Framework-specific test details.
- Raw implementation internals.

Those belong in engineering evidence, lane review logs, and Controller integration records.

## Owner Feedback

Copy one of these back to the agent:

```text
Owner acceptance feedback
Decision: accept
Acceptance ID: <owner_acceptance_id>
Notes: <short Owner note>
```

```text
/diayn bug
"<what failed from the user point of view; expected result; actual result; where it happened>"
```

```text
/diayn new
"<new requirement, dependency change, direction change, or priority change>"
```

## Result Record

| Owner decision | Status to record | Meaning | Owner note | Recorded by | Follow-up |
| --- | --- | --- | --- | --- | --- |
| `accept` | `owner_accepted` | Owner accepts the business or experience result. | `<note>` | `<session>` | `<next action or n/a>` |
| `request_rework` | `blocked / owner_gate` | Owner requests changes before acceptance; this is feedback, not a status. | `<note>` | `<session>` | `<route through /diayn bug or Controller-managed rework>` |
| `ask_question` | `owner_gate` | Owner needs more information or a decision record before accepting. | `<note>` | `<session>` | `<decision or question path>` |
