---
document_role: "Legacy manual test compatibility note"
template_status: "Compatibility pointer"
primary_writer: "Controller Session"
audience:
  - "Owner"
  - "Controller Session"
permission: "Controller write"
---

# Manual Test Template Compatibility Note

For new DIAYN multi-session projects, use:

```text
docs/templates/owner_experience_acceptance_template.md
```

This file remains only as a compatibility pointer for older projects that still
look for `docs/testing/manual_test_template.md`.

## Recommended Replacement

Owner-facing acceptance should ask whether a user can complete the intended
business or experience outcome. It should not ask the Owner to inspect test
code, mocks, coverage, or implementation internals.

## Minimal Owner Acceptance Record

| Field | Value |
| --- | --- |
| Acceptance item | `<user-visible behavior or business outcome>` |
| Current status | `<ready_for_e2e / owner_gate / blocked / owner_accepted / n/a>` |
| Reviewed work | `<review log links>` |
| Integration evidence | `<sync or integration evidence links>` |
| Owner feedback | `<accept / request_rework / ask_question / n/a>` |
| Follow-up action | `<none / route through /diayn-bug / Controller-managed rework>` |
| Notes | `<Owner-facing notes>` |

## Failure Feedback

```text
Acceptance item:
Failed step:
Actual result:
Expected result:
Evidence:
Can it be reproduced:
Does this block owner_accepted:
Additional notes:
```

If the Owner reports an end-to-end failure, the Controller triages it through
the `/diayn-bug` workflow described in the command reference.
