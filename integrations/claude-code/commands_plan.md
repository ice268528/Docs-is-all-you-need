# Claude Code Command Bundle Notes

## Purpose

This file records the D5-07 Claude Code command-file bundle. The actual short command files live in `integrations/claude-code/commands/` and are intended to be copied or linked into a target project's `.claude/commands/` directory.

## Command Mapping

| DIAYN command | Command file | Canonical skill | Notes |
| --- | --- | --- | --- |
| `/diayn-init` | `commands/diayn-init.md` | `diayn-controller` | Must ask for `project_slug`; no code writing. |
| `/diayn-plan` | `commands/diayn-plan.md` | `diayn-controller` | Plans lanes and handoffs only. |
| `/diayn-worktrees` | `commands/diayn-worktrees.md` | `diayn-controller` | Outputs launch guidance; real worktree creation needs explicit authorization. |
| `/diayn-backend` | `commands/diayn-backend.md` | `diayn-executor` | One backend task slice only; at most `candidate_done`. |
| `/diayn-frontend` | `commands/diayn-frontend.md` | `diayn-executor` | One frontend task slice only; at most `candidate_done`. |
| `/diayn-review-backend` | `commands/diayn-review-backend.md` | `diayn-reviewer` | Requires pasted backend worker report. |
| `/diayn-review-frontend` | `commands/diayn-review-frontend.md` | `diayn-reviewer` | Requires pasted frontend worker report. |
| `/diayn-sync` | `commands/diayn-sync.md` | `diayn-controller`, `diayn-integrator` | Controller-owned status summary. |
| `/diayn-integration` | `commands/diayn-integration.md` | `diayn-integrator` | Evidence-backed integration review. |
| `/diayn-bug` | `commands/diayn-bug.md` | `diayn-controller` | Owner acceptance failure triage. |
| `/diayn-new` | `commands/diayn-new.md` | `diayn-controller` | Current-scope versus future-scope triage. |
| `/diayn-html` | `commands/diayn-html.md` | `diayn-owner-ux` | User-triggered only. |

## Command File Shape

Command files contain only:

- The canonical command name.
- Read-first links.
- Required skill.
- Session identity guard preflight.
- A warning not to redefine command behavior.

They should not copy full protocol text.

## Validation Status

- Claude Code command file format: checked against available official slash-command documentation, including the current legacy support note for existing `.claude/commands/` files.
- Local Claude Code discovery/execution smoke test: not run.
- Support level: `manual_fallback`, not `working`.
- Confirm whether `/compact` guidance is available for context management before using it in adapter prompts.
