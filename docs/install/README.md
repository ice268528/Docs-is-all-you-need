# DIAYN Installation Guide

This directory documents the user-facing DIAYN install paths.

## Supported Public Surfaces

| Surface | User entrypoint | Status | Where to read |
| --- | --- | --- | --- |
| Claude Code plugin | `/diayn:init`, `/diayn:plan`, `/diayn:backend`, etc. | Supported | [claude-code.md](claude-code.md) |
| Claude project-local fallback | `/diayn-init`, `/diayn-plan`, `/diayn-backend`, etc. | Supported fallback | [claude-code.md](claude-code.md) |
| Codex Desktop plugin | DIAYN skills shown by Codex after plugin install | Supported release path | [codex_plugin.md](codex_plugin.md) |
| Codex skills package | `$diayn-init`, `$diayn-plan`, etc. | Supported fallback/package path | [codex_skills.md](codex_skills.md) |
| OpenCode | TBD | TODO | [opencode.md](opencode.md) |

## Public Repository Shape

The public repository is intentionally kept user-facing:

- `.claude-plugin/` and `.claude/commands/` provide the Claude Code plugin.
- `.agents/plugins/marketplace.json` and `plugins/diayn/` provide the Codex plugin.
- `skills/` contains the 12 authoritative DIAYN workflow skills.
- `packages/claude-project-local/` and `packages/codex-project-local/` provide fallback package shapes and the Claude plugin-visible combined skills root.
- DIAYN-managed dependency skills are packaged into the public runtime payloads:
  `plugins/diayn/skills/`, `packages/claude-project-local/.claude/skills/`,
  and `packages/codex-project-local/.codex/skills/`.
- `docs/meta/` and `docs/templates/` provide the durable workflow protocol and copyable templates.

Maintainer-only source snapshots, validation evidence, adapter experiments,
old candidate payloads, and local runtime scratch output are kept out of the
public remote surface. On a maintainer machine they may live under the ignored
local archive:

```text
docs/local-maintainer/
```

That archive is not an install path. Users should install from the plugin or
package paths listed above.

## Third-Party Skill Dependency Rule

DIAYN bundles a locked `agent-skills` baseline as DIAYN-managed dependency
skills. Users do not need to install `agent-skills` separately for the supported
DIAYN plugin/package paths.

Rules:

- Dependency skills are installed as platform-visible skills where the platform supports that model.
- Dependency skills are implementation dependencies, not extra DIAYN workflow commands.
- The public DIAYN workflow surface remains exactly the 12 DIAYN workflows.
- DIAYN keeps authority over role, lane, state, review, integration, evidence, and Owner acceptance.

## Claim Boundary

Do not claim OpenCode support until the OpenCode adapter is implemented.

Do not claim Anthropic or OpenAI official marketplace publication. The current
repository supports install from the repository source and local marketplace
configuration described in the install guides.
