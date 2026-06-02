# Codex Plugin Local Candidate

DIAYN has a local Codex plugin candidate at:

```text
plugins/docs-is-all-you-need/
```

This is not a published plugin, not marketplace support, and not a replacement
for the project-local Codex Skills path. The plugin candidate packages the 12
public DIAYN workflow skills and keeps the core workflow document-driven.

## Candidate Contents

```text
plugins/docs-is-all-you-need/.codex-plugin/plugin.json
plugins/docs-is-all-you-need/skills/diayn-init/
plugins/docs-is-all-you-need/skills/diayn-plan/
plugins/docs-is-all-you-need/skills/diayn-worktrees/
plugins/docs-is-all-you-need/skills/diayn-backend/
plugins/docs-is-all-you-need/skills/diayn-frontend/
plugins/docs-is-all-you-need/skills/diayn-review-backend/
plugins/docs-is-all-you-need/skills/diayn-review-frontend/
plugins/docs-is-all-you-need/skills/diayn-sync/
plugins/docs-is-all-you-need/skills/diayn-integration/
plugins/docs-is-all-you-need/skills/diayn-bug/
plugins/docs-is-all-you-need/skills/diayn-new/
plugins/docs-is-all-you-need/skills/diayn-html/
```

The plugin candidate keeps internal role skills outside the public workflow
surface. DIAYN-managed `agent-skills` dependencies are packaged separately
under `plugins/docs-is-all-you-need/dependency-skills/`.

The project-local Codex package candidate is:

```text
packages/codex-project-local/.codex/skills/
```

It contains the same 12 workflow skills plus the 23 locked DIAYN-managed
dependency skills.

## Current Support Level

Support level: `static_package_and_install_fixture_validated_runtime_blocked`.

The local plugin candidate and the project-local `.codex/skills` package pass
static validation. The project-local install fixture proves the copy shape into
a temporary `.codex/skills` plus `.diayn` target, and the Codex-home install
fixture proves the copy shape into temporary `skills/` plus
`diayn/docs-is-all-you-need/` targets. The external runtime evidence validator
and selftest prove that a complete concrete evidence file would clear the
Codex blocker while placeholder, missing, or nonexistent evidence references
remain blocked. Codex CLI/Desktop discovery could not be verified in this
environment, so app-session runtime proof must come from a current or reloaded
Codex Desktop session before this surface can be called working.

This means the packages can be inspected and used as local candidates, but
DIAYN cannot truthfully claim Codex plugin discovery, `.codex/skills` discovery,
or `/diayn-*` execution as `working`.

## Manual Use Boundary

Prefer `docs/install/codex_skills.md` for the current Codex package shape. Use
this plugin candidate only for local plugin packaging experiments or later
smoke tests.

Do not publish, push, or install this candidate into a marketplace until a later
validation pass proves local plugin discovery and records the exact command and
environment evidence.
