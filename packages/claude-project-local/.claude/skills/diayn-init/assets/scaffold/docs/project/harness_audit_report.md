# DIAYN Harness Audit Report

Status: `draft`

## Summary

- Project root: `<path>`
- Platform: `<claude-code/codex/opencode/generic>`
- Entry file this run: `<CLAUDE.md/AGENTS.md>`
- Peer entry file: `<existing_only/not_created_by_default>`
- Git repository: `<yes/no>`
- Dirty working tree: `<yes/no/Unknown>`
- Existing DIAYN scaffold: `<yes/no/partial>`
- Recommended action: `<create/merge/owner_review/block>`

## Expected Files

| Path | Exists | Proposed action | Owner preservation note |
| --- | --- | --- | --- |
| `<CLAUDE.md_or_AGENTS.md>` | `<yes/no>` | `<create/merge/review>` | `<platform entry file for this run>` |
| `TODO.md` | `<yes/no>` | `<create/merge/review>` | `<note>` |
| `.diayn/worktree_manifest.md` | `<yes/no>` | `<create/merge/review>` | `<note>` |
| `.diayn/scaffold_version.md` | `<yes/no>` | `<create/merge/review>` | `<note>` |
| `docs/project/project_brief.md` | `<yes/no>` | `<create/merge/review>` | `<note>` |

## Conflicts

List files where applying DIAYN templates would modify existing content. Ask the Owner what must be preserved before editing.

If the peer platform entry file already exists, record it as existing only. Do not treat it as the default read source or an upstream wrapper.

## Boundaries

- Large/generated directories skipped: `<list_or_none>`
- Nested repositories/submodules: `<list_or_none>`
- Secrets/private data found: `<do_not_record_values>`

## Owner Decision Needed

`<OwnerGate questions or none>`
