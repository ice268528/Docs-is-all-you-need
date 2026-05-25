# HTML Report Explanation Patterns

Use this only after the user runs `/diayn html` with a previous agent report or asks for an HTML explanation of that report.

## Page Must Explain

- What was completed.
- What was not completed.
- What evidence supports the report.
- What risks remain.
- What the Owner needs to decide or test.
- Recommended next step.
- A quick feedback block.

## Quick Feedback Shape

```text
Report feedback:
- I understand the report: yes/no
- Business acceptance: pass/fail/not ready
- Problems observed: <optional>
- Please do next: <short instruction>
```

## Do Not

- Turn engineering test details into Owner homework.
- Claim acceptance when only engineering verification exists.
- Generate HTML without the user's explicit `/diayn html` request.
