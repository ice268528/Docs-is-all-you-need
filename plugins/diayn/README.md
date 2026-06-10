# DIAYN Codex Plugin

This directory is the isolated Codex plugin payload for DIAYN.

It is intentionally separate from the verified Claude Code plugin paths. Do not
use this directory to change Claude Code commands, Claude manifests, or Claude
project-local fallback behavior.

## Contents

```text
.codex-plugin/plugin.json
skills/
dependency-routing/
dependency-references/
internal-role-skills/
licenses/
dependency-skills-manifest.json
```

The `skills/` directory contains:

- the 12 public DIAYN workflow skills;
- the 23 DIAYN-managed dependency skills.

The dependency and internal-role directories are supporting material for DIAYN
workflow routing. They are not additional public DIAYN commands.

## Status

Status: `supported`.

This directory follows the Codex plugin manifest shape with:

```json
"skills": "./skills/"
```

Codex Desktop installs the skills from this payload through the repository
marketplace manifest. Keep this directory isolated from Claude Code plugin and
project-local fallback files.
