# Copilot Rules Export Plan

## Status

Conservative export strategy. Copilot may help with code and summaries, but DIAYN status, role, and evidence authority remain in repository documents.

## Export Goal

Provide only compact guidance that points to canonical DIAYN files.

## Minimal Export Content

Recommended concise rules:

```text
This repository uses DIAYN document-driven multi-session collaboration.

Use repository docs as the system of record.
Read AGENTS.md and docs/meta/diayn_command_reference.md before /diayn workflows.
Do not treat worker self-verification as done.
Keep worker, reviewer, controller, and Owner roles separate.
Do not copy full protocol into Copilot rules.
```

## What Not To Export

- Full protocol documents.
- Full command reference.
- Full skills.
- Maintainer vendor sync docs.
- Tool-specific upstream `agent-skills` setup files.

## Limitations

- Copilot project rule location and command support are `Unknown / To be confirmed`.
- If no stable skill mechanism exists, use lightweight rules plus explicit manual prompts.
- Core DIAYN usage must remain possible without Copilot-specific integration.
