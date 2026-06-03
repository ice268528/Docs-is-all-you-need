---
name: context-compact-reminder
description: "Use near the end of a complete subtask, before starting an independent subtask, or when a DIAYN conversation is getting long. Provides best-effort reminders to preserve handoff summaries or use platform-supported compaction without promising exact cross-tool context percentages, automatic compaction APIs, or silent compression."
---

# Context Compact Reminder

## Use When

Use this skill after a complete subtask, before starting a new independent subtask, or when the conversation has become long enough that future context loss is plausible.

## Read First

- `docs/meta/progressive_disclosure_rules.md`
- `docs/meta/multi_session_collaboration_protocol.md`
- `docs/templates/handoff_packet_template.md`
- `docs/templates/diayn_command_output_template.md`

Load references only when needed:

- `references/context-compact-reminder-patterns.md`
- `references/session-handoff-summary-patterns.md`

## Workflow

1. Check whether the current work has reached a natural handoff boundary.
2. If a durable record is missing, suggest writing or updating a concise handoff summary, worklog, sync log, or command output.
3. If the platform exposes real context usage data, use that data plainly.
4. If the platform does not expose real context usage data, make only a best-effort reminder based on task boundary and conversation length.
5. Mention platform-supported compression actions only when they are known to exist for the active tool.
6. Never silently compact, summarize, or discard context without user awareness.

## Allowed Writes

Write only authorized handoff summaries, worklogs, sync logs, or command output records when the active workflow already allows those files. This skill does not create runtime state or platform adapters.

## Stop Conditions

- The reminder would claim an exact context percentage without tool-provided data.
- The reminder would promise automatic compaction across tools.
- The next step would silently execute compression or alter local identity/manifest state.
- The active tool capability has not been confirmed.

## Output Expectations

Keep reminders short. Prefer a practical handoff prompt such as: "Before starting the next independent task, consider saving a short summary of decisions, changed files, evidence, blockers, and next command."
