# Rejection Reason Patterns

Use short, actionable rejection reasons.

## Missing Evidence

```text
Rejected: The worker report claims completion, but there is no evidence for <check or acceptance criterion>. Add evidence or explain why it cannot be produced.
```

## Unauthorized Changes

```text
Rejected: The candidate changed <path>, which is outside the <lane> write boundary. Revert or move this change through Controller/shared workflow.
```

## Acceptance Gap

```text
Rejected: The candidate does not satisfy <acceptance criterion>. Expected <expected behavior>; observed <actual behavior or missing proof>.
```

## Scope Creep

```text
Rejected: The candidate includes work beyond the authorized task slice. Split the extra work into a Controller-approved task.
```

## Shared Contract Conflict

```text
Rejected or blocked: The candidate changes shared expectations without corresponding shared contract update and lane sync.
```
