# OpenCode Command And Skill Bundle Notes

## Purpose

This file records the D5-08 OpenCode adapter bundle. The concrete files live under `integrations/opencode/.opencode/` and are intended to be copied into a target project's `.opencode/` directory.

Support level: `manual_fallback`, not `working`.

## Command Mapping

| DIAYN command | OpenCode command file | Canonical skill | Notes |
| --- | --- | --- | --- |
| `/diayn-init` | `.opencode/commands/diayn-init.md` | `diayn-controller` | Ask for `project_slug`; no business-code implementation. |
| `/diayn-plan` | `.opencode/commands/diayn-plan.md` | `diayn-controller` | Plan lanes, handoffs, and acceptance criteria. |
| `/diayn-worktrees` | `.opencode/commands/diayn-worktrees.md` | `diayn-controller` | Prepare manifest/launch guidance; real worktree creation needs separate authorization. |
| `/diayn-backend` | `.opencode/commands/diayn-backend.md` | `diayn-executor` | One backend task slice only; at most `candidate_done`. |
| `/diayn-frontend` | `.opencode/commands/diayn-frontend.md` | `diayn-executor` | One frontend task slice only; at most `candidate_done`. |
| `/diayn-review-backend` | `.opencode/commands/diayn-review-backend.md` | `diayn-reviewer` | Requires pasted backend worker report. |
| `/diayn-review-frontend` | `.opencode/commands/diayn-review-frontend.md` | `diayn-reviewer` | Requires pasted frontend worker report. |
| `/diayn-sync` | `.opencode/commands/diayn-sync.md` | `diayn-integrator`, `diayn-controller` | Controller-owned lane-state summary. |
| `/diayn-integration` | `.opencode/commands/diayn-integration.md` | `diayn-integrator` | Evidence-backed integration review. |
| `/diayn-bug` | `.opencode/commands/diayn-bug.md` | `diayn-controller` | Owner business acceptance failure triage. |
| `/diayn-new` | `.opencode/commands/diayn-new.md` | `diayn-controller` | Current-scope versus later-scope triage. |
| `/diayn-html` | `.opencode/commands/diayn-html.md` | `diayn-owner-ux` | User-triggered decision/report HTML aid. |

## Skill Wrapper Mapping

| OpenCode wrapper | Canonical DIAYN source |
| --- | --- |
| `.opencode/skills/diayn-controller/SKILL.md` | `skills/diayn-controller/SKILL.md` |
| `.opencode/skills/diayn-executor/SKILL.md` | `skills/diayn-executor/SKILL.md` |
| `.opencode/skills/diayn-reviewer/SKILL.md` | `skills/diayn-reviewer/SKILL.md` |
| `.opencode/skills/diayn-integrator/SKILL.md` | `skills/diayn-integrator/SKILL.md` |
| `.opencode/skills/diayn-skill-router/SKILL.md` | `skills/diayn-skill-router/SKILL.md` |
| `.opencode/skills/diayn-identity-guard/SKILL.md` | `skills/diayn-identity-guard/SKILL.md` |
| `.opencode/skills/diayn-owner-ux/SKILL.md` | `skills/diayn-owner-ux/SKILL.md` |
| `.opencode/skills/update-diayn-scaffold/SKILL.md` | `skills/update-diayn-scaffold/SKILL.md` |

## Minimal Rules

1. Read `AGENTS.md` first.
2. Treat `/diayn-*` as document-driven workflow triggers, not shell commands.
3. Run `diayn-identity-guard` before every `/diayn-*` workflow.
4. Use `docs/meta/diayn_command_reference.md` and the matching `docs/meta/diayn_commands/*.md` file for command semantics.
5. Use DIAYN-owned `skills/**` as canonical workflow behavior; OpenCode wrappers are only route points.
6. Worker sessions may mark at most `candidate_done`.
7. Reviewer sessions decide `done` or `rejected`.
8. Controller integration may mark `ready_for_e2e` only with evidence.
9. Owner acceptance is business-facing and does not require reading test internals.
10. Do not copy the full DIAYN protocol into OpenCode adapter files.

## Validation Status

- OpenCode command and skill paths: checked against available OpenCode docs for `.opencode/commands/` and `.opencode/skills/<name>/SKILL.md`.
- Local OpenCode discovery/execution smoke test: not run.
- Support level: `manual_fallback`.

## Non-Goals

- Do not import upstream `.opencode/` vendor content as DIAYN rules.
- Do not change core DIAYN documents for OpenCode-specific convenience.
