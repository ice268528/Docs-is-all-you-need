---
name: update-diayn-scaffold
description: Use to audit and safely upgrade an existing project into a DIAYN scaffold; performs a dry-run-first inventory, classifies conflicts, proposes patches, preserves existing user content, and asks for confirmation before modifying project files.
---

# Update DIAYN Scaffold

## Required Read Order

1. `README.md`
2. `AGENTS.md` if present
3. `CLAUDE.md` if present
4. Existing `docs/**` and `.diayn/**` inventory
5. `docs/meta/docs_framework_overview.md` when present
6. `docs/meta/diayn_command_reference.md` when present
7. `docs/templates/**` relevant to the requested upgrade

Load `references/scaffold-upgrade-dry-run.md` before proposing changes. Use
`scripts/scaffold_upgrade_audit.py` for deterministic dry-run inventory when a
local project path is available.

## Workflow

1. Run a read-only inventory of current entry files, docs, lanes, shared docs, templates, `.diayn/`, and existing agent instructions.
2. Classify each missing or stale DIAYN artifact as create, update, preserve, conflict, or Owner decision.
3. Produce a dry-run migration plan before editing.
4. Produce a patch proposal that preserves existing user content.
5. Ask for explicit Owner confirmation before applying any patch.
6. Keep generated docs project-neutral unless active project facts are already confirmed.
7. Report changed files, preserved content, conflicts, and follow-up Owner decisions.

## Helper

```powershell
python .diayn/internal-role-skills/update-diayn-scaffold/scripts/scaffold_upgrade_audit.py --project-root <project>
```

The helper is read-only by default, writes only an explicitly requested report
file, and has no apply mode. Applying a proposal is normal agent file editing
after the Owner approves a specific migration plan.

## Write Boundary

Before confirmation, write only the dry-run report requested by the user. After confirmation, modify only the files listed in the approved migration plan.

## Stop Conditions

- The upgrade would overwrite existing user content without a merge plan.
- Current project facts, command names, status model, or tool support are contradictory.
- The next step would create plugin, runtime, adapter, helper scripts, real worktrees, or commits without separate authorization.
- The Owner has not approved the dry-run plan.

## Expected Output

Return a dry-run inventory, conflict report, migration plan, proposed patch set, required Owner decisions, and a clear apply-or-stop recommendation. Never claim a scaffold was upgraded just because a plan was written.
