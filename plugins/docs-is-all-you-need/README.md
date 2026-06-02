# Docs is all you need Plugin Candidate

This directory is the local plugin candidate for DIAYN. It contains Claude Code
and Codex plugin metadata plus the installable public workflow skills.

The repository root now also contains platform entrypoints:

```text
.claude-plugin/plugin.json
.codex-plugin/plugin.json
```

Those root manifests are closer to the publishable reference-project shape.
They point at generated platform-visible package skills under
`packages/claude-project-local/.claude/skills/` and
`packages/codex-project-local/.codex/skills/`, so the 23 DIAYN-managed
dependency skills are visible beside the 12 DIAYN workflow skills. This inner
directory remains the local plugin candidate and source for the 12 public
workflow adapters.

DDDV8 status: Phase 12 alpha package candidate. The active `skills/` directory
contains the 12 public workflow skills plus progressively disclosed workflow
assets and deterministic helpers. Older role-oriented material is retained
under `internal-role-skills/` as implementation reference material and is not
the plugin's public skill surface.

For Claude Code, this is the standard target shape, matching the plugin-first
model used by `superpowers` and `agent-skills`:

```text
.claude-plugin/plugin.json
.claude/commands/diayn-*.md
skills/diayn-*/
dependency-skills/
```

For local Claude development, load this directory with:

```powershell
claude --plugin-dir <path-to-this-directory>
```

Current local plugin-dir validation observed namespaced commands. The
project-local fallback under `packages/claude-project-local/` proves bare
`/diayn-*` behavior, but it is not the final install model.

For Codex, this directory remains a plugin candidate. Codex app-session runtime
validation is still blocked.

The locked third-party `agent-skills` dependency payload lives under
`dependency-skills/`. Those dependency skills are not extra public DIAYN
commands. Claude project-local installed-flow validation proves representative
native dependency invocation. Codex project-local static validation proves the
`.codex/skills` package shape, and an authorized real Codex Home file install
has copied the V1 package files into place. Codex app-session runtime validation
is still blocked.

Current status: `real_home_file_install_validated_runtime_blocked`.

Direct Codex plugin or skills discovery is still not verified from the current
or reloaded Codex app session. File presence alone is not runtime proof.

Do not publish this candidate or claim marketplace support until later smoke
tests verify the relevant marketplace/runtime behavior for each target surface,
including bare `/diayn-*` where required.
