# Owner Acceptance Example

This is an example only. Use
`docs/templates/owner_experience_acceptance_template.md` for real Owner-facing
acceptance records.

## Owner-Facing Acceptance Question

From a user's point of view, can `<target_user>` complete
`<intended_user_action>` in `<expected_context>`?

The Owner does not need to inspect unit tests, mocks, coverage, or internal
test implementation.

## Acceptance Checklist

| User-facing check | Expected result | Owner result |
| --- | --- | --- |
| Start the flow | `<what the user should see first>` | `<pass/fail/unsure>` |
| Complete the main action | `<what successful completion looks like>` | `<pass/fail/unsure>` |
| See the correct result | `<confirmation, page state, or saved record>` | `<pass/fail/unsure>` |
| Handle a common mistake | `<friendly error or recovery path>` | `<pass/fail/unsure>` |

## Quick Feedback To Paste Back

```text
Owner acceptance result:
- Decision: accept / request rework / need explanation
- What I tried: <short description>
- What worked: <short description>
- What failed or felt wrong: <short description>
- Priority: blocking / important / minor
```

## Status Rule

Only record `owner_accepted` after the Owner has accepted the business or
experience result. Review `done` is necessary evidence, but it is not the same
as Owner acceptance.
