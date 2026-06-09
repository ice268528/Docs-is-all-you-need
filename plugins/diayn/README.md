# DIAYN Codex Plugin Candidate

This directory is the isolated Codex plugin candidate for DIAYN.

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

Status: `candidate`.

This directory follows the Codex plugin manifest shape with:

```json
"skills": "./skills/"
```

It has not yet proven Codex Desktop app-session runtime discovery, direct
`/diayn-*` slash behavior, or dependency-skill native invocation after plugin
install. Those claims require separate runtime acceptance evidence.
