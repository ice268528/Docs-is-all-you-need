# Evidence Writing Guide

Evidence should let a reviewer decide whether the worker report is trustworthy.

## Include

- Task ID or lane board item.
- Files changed.
- Checks run, with exact command when available.
- Relevant output summary.
- Manual verification steps when automated checks are unavailable.
- Known risks, skipped checks, or environmental blockers.

## Do Not Include

- Claims that cannot be traced to a file, command, or observation.
- Broad "all good" statements without evidence.
- Hidden assumptions about another lane.
- Owner acceptance claims.

## Evidence Record Shape

```text
Task: <task-id>
Slice: <short slice description>
Changed files:
- <path>

Checks:
- <command or manual check>: <result>

Evidence:
- <path or output summary>

Risks / gaps:
- <known limitation or none>
```
