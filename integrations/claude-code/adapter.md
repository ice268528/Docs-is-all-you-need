# Claude Code Adapter

## Status

Claude Code support is plugin-first.

The current implementation no longer keeps a separate legacy command bundle
under `integrations/claude-code/commands/`. That old D5/D6 bundle pointed at
pre-DDDV8 role skill paths and is not a supported install surface.

Current Claude Code surfaces are:

```text
.claude-plugin/plugin.json
.claude-plugin/marketplace.json
.claude/commands/diayn-*.md
packages/claude-project-local/
plugins/docs-is-all-you-need/
```

Primary install documentation lives in:

```text
docs/install/claude-code.md
docs/install/claude-code-alpha.md
```

## Intended Final Model

The intended final Claude Code model is marketplace/plugin installation, matching
the plugin-first direction used by the reference projects:

```text
/plugin marketplace add <diayn-marketplace-or-repo>
/plugin install diayn@<marketplace-name>
```

In a Claude plugin, commands and skills are plugin-scoped. DIAYN now uses
`name: "diayn"` in the Claude plugin manifests, so the expected namespaced
entries are:

```text
/diayn:diayn-init
```

This must be confirmed by runtime verification after the namespace rename. Even
when verified, it proves namespaced plugin loading, not the project-local bare
`/diayn-*` command surface.

## Bare Command Fallback

`packages/claude-project-local/` is the current proven fallback for bare
`/diayn-*` in Claude Code. It installs this project-local shape:

```text
.claude/commands/diayn-*.md
.claude/skills/diayn-*/
.claude/skills/<agent-skills-name>/
.diayn/dependency-routing/upstream-routing-map.md
.diayn/internal-role-skills/
.diayn/dependency-skills-manifest.json
```

This fallback has fixture evidence for the 12 bare `/diayn-*` workflow commands
and representative native dependency-skill routing. It is useful for alpha
testing, but it is not the final marketplace/plugin distribution model.

## Third-Party Dependency Skills

DIAYN-managed `agent-skills` dependencies must be exposed through the active
Claude surface when native skill invocation is required:

- project-local fallback exposes dependency skills under
  `.claude/skills/<agent-skills-name>/`;
- plugin candidates package dependency skills under
  `plugins/docs-is-all-you-need/dependency-skills/`;
- DIAYN routing reads
  `maintainers/internal-skills/diayn-skill-router/references/upstream-routing-map.md`
  and selects the smallest relevant dependency skill set for the active
  workflow.

Directly reading vendored upstream `SKILL.md` files is reference fallback only.
It is not evidence of native third-party skill invocation.

## Boundary

Do not reintroduce a separate `integrations/claude-code/commands/` command
bundle. If Claude support changes, update the plugin manifests, generated root
`.claude/commands`, `packages/claude-project-local/`, and install docs instead.

Historical D6 evidence remains useful only as local project-level command
discovery history. It should not be used to claim final Claude plugin,
marketplace, global, or user-ready installation support.
