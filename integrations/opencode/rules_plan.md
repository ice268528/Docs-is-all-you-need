# OpenCode Rules Plan

## Purpose

This plan records the minimum rules OpenCode should receive if a future adapter exports tool-specific rules.

## Minimal Rules

1. Read `AGENTS.md` first.
2. Treat `/diayn ...` as a document-driven workflow command, not a shell command.
3. Run `session-identity-guard` before every `/diayn ...` workflow.
4. Use `docs/meta/diayn_command_reference.md` for command semantics.
5. Use `skills/**` for DIAYN workflow behavior when available.
6. Worker sessions may mark at most `candidate_done`.
7. Reviewer sessions decide `done` or `rejected`.
8. Controller integration may mark `ready_for_e2e` only with evidence.
9. Owner acceptance is business-facing and does not require reading test internals.
10. Do not copy full DIAYN protocol into OpenCode rules.

## Deferred Confirmation

- OpenCode project rule file path: `Unknown / To be confirmed`.
- OpenCode skill discovery behavior: `Unknown / To be confirmed`.
- OpenCode context compaction behavior: `Unknown / To be confirmed`.

## Non-Goals

- Do not import upstream `.opencode/` vendor content as DIAYN rules.
- Do not implement OpenCode commands in Stage 08.
- Do not change core DIAYN documents for OpenCode-specific convenience.
