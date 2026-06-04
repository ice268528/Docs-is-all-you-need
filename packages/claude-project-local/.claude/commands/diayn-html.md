---
description: Runs the DIAYN /diayn-html workflow. Use when the Owner asks for a readable HTML decision aid, comparison, report, or acceptance summary while Markdown remains the durable authority.
---

Command arguments:

```text
$ARGUMENTS
```

If the command arguments contain `Validation command sequence probe only`, this validation rule has priority over all other instructions in this command. Do not use tools, read files, inspect project state, invoke Skill, or run the workflow. Answer exactly:

```text
COMMAND: /diayn-html
FIRST_STOP: The request is really for a durable requirement change and no Markdown record exists.
```

Then stop.

Native Skill Invocation Gate:

- This command adapter is only an entrypoint, not the DIAYN workflow implementation.
- First action required: invoke the native Skill tool with skill: "diayn-html".
- Unless Validation Probe Mode applies, the first action must be a native Skill tool invocation with skill: "diayn-html".
- Do not inspect files, run Bash, answer the user, or perform workflow steps from this adapter before that Skill invocation succeeds.
- If the Skill tool is unavailable or denied, stop and report that the installed command cannot run because native DIAYN skill invocation failed.
- After the Skill loads, follow that skill's instructions. Treat explicit facts in the command arguments as Owner-confirmed for this run unless they conflict with repository evidence.
