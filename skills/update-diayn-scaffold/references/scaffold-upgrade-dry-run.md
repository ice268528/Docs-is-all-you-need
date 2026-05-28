# Scaffold Upgrade Dry Run

Use this reference before modifying an existing project.

## Inventory

- Entry files: `README.md`, `AGENTS.md`, `CLAUDE.md`, and other tool instruction files.
- Project docs: `docs/project/**`, `docs/stages/**`, `docs/testing/**`.
- Lane docs: `docs/lanes/**`.
- Shared docs: `docs/shared/**`.
- Meta docs: `docs/meta/**`.
- Templates: `docs/templates/**`.
- DIAYN control files: `.diayn/**`, excluding ignored local identity files.
- Existing command names and status names.

## Classification

| Classification | Meaning |
| --- | --- |
| create | Missing and safe to add. |
| update | Present but stale; can be patched without overwriting user content. |
| preserve | Existing content is valuable and should stay. |
| conflict | Existing content contradicts DIAYN and needs Owner decision or careful merge. |
| owner_decision | Product, scope, tool, or acceptance choice needed before editing. |

## Patch Proposal Rules

- Propose patches before applying them.
- Preserve user content unless the Owner explicitly approves replacement.
- Keep command names canonical as `/diayn-*`.
- Keep status names canonical.
- Do not create plugin, runtime, adapter, helper scripts, real worktrees, commits, or vendor changes as part of this skill.
