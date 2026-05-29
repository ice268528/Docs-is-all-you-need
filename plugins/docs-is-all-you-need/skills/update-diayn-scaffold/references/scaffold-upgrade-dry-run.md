# Scaffold Upgrade Dry Run

Use this reference before modifying an existing project.

## Default Tool

Run the bundled dry-run helper when the project is available locally:

```powershell
python skills/update-diayn-scaffold/scripts/scaffold_upgrade_audit.py --project-root <project>
```

Optional report file:

```powershell
python skills/update-diayn-scaffold/scripts/scaffold_upgrade_audit.py --project-root <project> --output diayn_scaffold_upgrade_report.md
```

The helper is read-only. It has no apply mode, does not create worktrees, does
not overwrite files, and does not commit. If the user approves a migration, the
agent applies only the approved patch list through normal file edits and reports
the exact changed paths.

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

## Conflict Report Requirements

Every dry-run report must include:

- path and line when a stale command, legacy status, or support overclaim is detected;
- why the item is risky;
- the recommended route, such as status mapping, command migration, or support-level downgrade;
- whether an Owner or Controller decision is required before editing.

Treat `.diayn/local/**` as local-only. If it appears in a project tree, report it
as a conflict or caution; do not copy it into a scaffold patch.

## Patch Proposal Rules

- Propose patches before applying them.
- Preserve user content unless the Owner explicitly approves replacement.
- Keep command names canonical as `/diayn-*`.
- Keep status names canonical.
- Do not create plugin, runtime, adapter, helper scripts, real worktrees, commits, or vendor changes as part of this skill.
- Do not claim the project was upgraded after producing only an audit report.
- Keep README, AGENTS.md, and CLAUDE.md lightweight; link to detailed DIAYN docs instead of copying the protocol.
- If patching existing content, prefer small inserted sections or targeted replacements over whole-file rewrites.

## Apply Boundary

There is no automatic apply mode in the D5-09 helper. If a future implementation
adds one, it must require explicit Owner confirmation such as an
`--apply --confirm "<project_slug>"` shape and must still preserve existing user
content by default.

## Optional Upstream Routing

Use `diayn-skill-router` after the dry-run inventory identifies the type of migration problem.

| Upgrade context | Consider upstream skills | DIAYN override |
| --- | --- | --- |
| Existing docs need migration | `deprecation-and-migration`, `documentation-and-adrs` | Preserve user content and propose patches before editing. |
| Existing agent context/rules are inconsistent | `context-engineering`, `using-agent-skills` | DIAYN entry files stay lightweight; do not install upstream skills as DIAYN skills. |
| Branch or checkpoint planning | `git-workflow-and-versioning` | This skill remains dry-run-first and does not create commits by itself. |
