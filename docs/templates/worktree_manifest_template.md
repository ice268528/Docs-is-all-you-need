---
diayn_manifest_version: 0.1
project_slug: "<project_slug>"
worktree_root: "../worktrees/<project_slug>"
current_stage: "<stage_id>"
controller_baseline: "<commit-or-branch>"
---

# Worktree Manifest Template

> Copy this template to `.diayn/worktree_manifest.md`. It records intended worktrees; it does not create them.

## Rules

- Default path pattern: `../worktrees/<project_slug>/<lane>`.
- Do not include stage identifiers in long-lived worktree directory names.
- Put stage information in branch names, this manifest, stage docs, and lane boards.
- `.diayn/` shared control files may enter git.
- `.diayn/local/` is local-only and must not enter git.

## Worktrees

| Lane | Expected path | Branch | Baseline | Current stage | Status | Startup instruction |
| --- | --- | --- | --- | --- | --- | --- |
| `<lane>` | `../worktrees/<project_slug>/<lane>` | `<branch>` | `<commit-or-branch>` | `<stage_id>` | `planned` | `cd ../worktrees/<project_slug>/<lane>; start the selected agent; run <allowed_command>` |

## Required Docs By Lane

| Lane | Required docs | Visibility checked? |
| --- | --- | --- |
| `<lane>` | `<paths>` | `<yes/no>` |

## Controller Notes

| Time | Note | Actor |
| --- | --- | --- |
| `<timestamp>` | `<note>` | `Controller` |
