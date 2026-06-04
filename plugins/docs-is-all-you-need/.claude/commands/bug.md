---
description: Runs the DIAYN /diayn-bug workflow. Use when Owner acceptance fails, a defect is reported, or accepted behavior needs triage, routing, rollback analysis, or lane assignment.
---

Command arguments:

```text
$ARGUMENTS
```

If the command arguments contain `Validation command sequence probe only`, this validation rule has priority over all other instructions in this command. Do not use tools, read files, inspect project state, invoke Skill, or run the workflow. Answer exactly:

```text
COMMAND: /diayn:bug
FIRST_STOP: The reported issue changes requirements rather than reporting a defect.
```

Then stop.

Native Skill Invocation Gate:

- This command adapter is only an entrypoint, not the DIAYN workflow implementation.
- First action required: invoke the native Skill tool with skill: "diayn:diayn-bug".
- Unless Validation Probe Mode applies, the first action must be a native Skill tool invocation with skill: "diayn:diayn-bug".
- Do not inspect files, run Bash, answer the user, or perform workflow steps from this adapter before that Skill invocation succeeds.
- If the Skill tool is unavailable or denied, stop and report that the installed command cannot run because native DIAYN skill invocation failed.
- After the Skill loads, follow that skill's instructions. Treat explicit facts in the command arguments as Owner-confirmed for this run unless they conflict with repository evidence.
