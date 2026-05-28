---
name: update-diayn-scaffold
description: Use to audit and safely upgrade an existing project into a DIAYN scaffold; performs a dry-run-first inventory, classifies conflicts, proposes patches, preserves existing user content, and asks for confirmation before modifying project files.
---

# Update DIAYN Scaffold

## Use When

Use this skill when the user asks to add DIAYN to an existing project or upgrade an older DIAYN scaffold.

## Required Read Order

1. `README.md`
2. `AGENTS.md` if present
3. `CLAUDE.md` if present
4. Existing `docs/**` and `.diayn/**` inventory
5. `docs/meta/docs_framework_overview.md` when present
6. `docs/meta/diayn_command_reference.md` when present
7. `docs/templates/**` relevant to the requested upgrade

Load `references/scaffold-upgrade-dry-run.md` before proposing changes.

## Workflow

1. Run a read-only inventory of current entry files, docs, lanes, shared docs, templates, `.diayn/`, and existing agent instructions.
2. Classify each missing or stale DIAYN artifact as create, update, preserve, conflict, or Owner decision.
3. Produce a dry-run migration plan before editing.
4. Ask for explicit confirmation before applying patches.
5. Preserve existing user content and merge around it.
6. Keep generated docs project-neutral unless active project facts are already confirmed.
7. Report changed files, preserved content, conflicts, and follow-up Owner decisions.

## Allowed Writes

Before confirmation, write only the dry-run report requested by the user. After confirmation, modify only the files listed in the approved migration plan.

## Stop Conditions

- The upgrade would overwrite existing user content without a merge plan.
- Current project facts, command names, status model, or tool support are contradictory.
- The next step would create plugin, runtime, adapter, helper scripts, real worktrees, or commits without separate authorization.
- The Owner has not approved the dry-run plan.

## Expected Output

Return a dry-run inventory, conflict list, proposed patch set, required Owner decisions, and a clear apply-or-stop recommendation. Never claim a scaffold was upgraded just because a plan was written.
