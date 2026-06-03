# Owner Acceptance Patterns

Owner acceptance checks business experience, not internal test implementation.

## Good Acceptance Language

- "Can the user complete <business action>?"
- "After the action, does the visible result match expectations?"
- "Is the expected record, notification, or state visible through the product or agreed admin surface?"
- "If it fails, what did the Owner expect and what happened instead?"

## Avoid

- Asking the Owner to read unit tests.
- Asking the Owner to understand integration tests, mocks, fixtures, or coverage.
- Treating raw logs as the primary Owner experience.
- Substituting engineering verification for Owner acceptance.

## Feedback Shape

```text
Owner acceptance feedback:
- Result: pass/fail/not ready
- Scenario checked: <user-visible scenario>
- Expected: <expected user-visible result>
- Actual: <actual result>
- Notes: <optional>
```
