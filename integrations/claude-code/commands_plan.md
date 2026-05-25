# Claude Code Commands Plan

## Purpose

This plan describes possible future `.claude/commands/` entries for DIAYN. Stage 08 does not create those command files.

## Command Mapping

| DIAYN command | Future Claude Code command file | Canonical skill | Notes |
| --- | --- | --- | --- |
| `/diayn init` | `.claude/commands/diayn-init.md` | `multi-session-controller` | Must ask for `project_slug`; no code writing. |
| `/diayn plan` | `.claude/commands/diayn-plan.md` | `multi-session-controller` | Plans lanes and handoffs only. |
| `/diayn worktrees` | `.claude/commands/diayn-worktrees.md` | `multi-session-controller` | Outputs launch guidance; worktree creation needs explicit authorization. |
| `/diayn backend` | `.claude/commands/diayn-backend.md` | `multi-session-executor` | One task slice only; at most `candidate_done`. |
| `/diayn frontend` | `.claude/commands/diayn-frontend.md` | `multi-session-executor` | One task slice only; at most `candidate_done`. |
| `/diayn review backend` | `.claude/commands/diayn-review-backend.md` | `multi-session-reviewer` | Requires pasted worker report. |
| `/diayn review frontend` | `.claude/commands/diayn-review-frontend.md` | `multi-session-reviewer` | Requires pasted worker report. |
| `/diayn sync` | `.claude/commands/diayn-sync.md` | `multi-session-integrator` | Controller-owned status summary. |
| `/diayn integration` | `.claude/commands/diayn-integration.md` | `multi-session-integrator` | Evidence-backed integration review. |
| `/diayn bug` | `.claude/commands/diayn-bug.md` | `multi-session-controller` | Owner acceptance failure triage. |
| `/diayn new` | `.claude/commands/diayn-new.md` | `multi-session-controller` | Current-scope versus future-scope triage. |
| `/diayn html` | `.claude/commands/diayn-html.md` | `owner-decision-ux` | User-triggered only. |

## Command File Shape

Future command files should contain only:

- The canonical command name.
- Read-first links.
- Required skill.
- Session identity guard preflight.
- A warning not to redefine command behavior.

They should not copy full protocol text.

## Deferred Validation

- Confirm Claude Code command file format: `Unknown / To be confirmed`.
- Confirm how Claude Code discovers project-local skills: `Unknown / To be confirmed`.
- Confirm whether `/compact` guidance is available for context management before using it in adapter prompts.
