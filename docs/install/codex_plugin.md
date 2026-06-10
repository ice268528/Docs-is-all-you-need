# Codex Desktop Plugin Install

Use the Codex Desktop "Add plugin marketplace" dialog.

## Marketplace Fields

```text
Source: git@github.com:ice268528/Docs-is-all-you-need.git
Git ref: main
Sparse path:
.agents/plugins
plugins/diayn
```

HTTPS source is also acceptable if SSH is not available:

```text
Source: https://github.com/ice268528/Docs-is-all-you-need.git
Git ref: main
Sparse path:
.agents/plugins
plugins/diayn
```

The sparse path intentionally has two lines in the same field:

- `.agents/plugins` contains the Codex marketplace manifest.
- `plugins/diayn` contains the DIAYN plugin payload.

## Plugin Identity

Expected marketplace/plugin identity:

```text
diayn@diayn
```

The plugin payload is:

```text
plugins/diayn/.codex-plugin/plugin.json
plugins/diayn/skills/
plugins/diayn/dependency-routing/
plugins/diayn/dependency-references/
plugins/diayn/internal-role-skills/
plugins/diayn/licenses/
plugins/diayn/dependency-skills-manifest.json
```

The `skills/` directory contains the 12 DIAYN workflow skills plus the
DIAYN-managed dependency skills.

## If Codex Says The Marketplace Already Exists

Remove any old DIAYN marketplace entry from Codex Desktop first, then
add it again with the fields above. A stale marketplace source can make Codex
reuse an older checkout.

## First Use

After installation, search for DIAYN in Codex skills and start with:

```text
$diayn-init initialize this project with DIAYN
```

Then continue with:

```text
$diayn-plan
$diayn-worktrees
$diayn-backend
$diayn-frontend
$diayn-review-backend
$diayn-review-frontend
$diayn-sync
$diayn-integration
```
