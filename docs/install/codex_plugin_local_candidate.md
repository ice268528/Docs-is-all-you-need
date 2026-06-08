# Codex Plugin Local Candidate

DIAYN has a local Codex plugin candidate at:

```text
.codex-plugin/plugin.json
plugins/docs-is-all-you-need/
```

This is not a published plugin and not marketplace support. The repository-root
manifest points at `packages/codex-project-local/.codex/skills/`, which is the
platform-visible package shape containing 12 DIAYN workflow skills plus
23 DIAYN-managed dependency skills. The 12 workflow skills in that
generated Codex package also carry Codex-specific `agents/openai.yaml`
metadata for UI/harness discovery. The inner candidate under
`plugins/docs-is-all-you-need/` remains available for local packaging
experiments and packages only the 12 DIAYN workflow skill sources. Both Codex
manifests include product metadata similar to the `superpowers` Codex manifest
without referencing fake icon or logo assets.

## Candidate Contents

```text
.codex-plugin/plugin.json
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

Support level: `package_install_validated_app_session_runtime_not_attempted`.

The local plugin candidate and the project-local `.codex/skills` package pass
static validation. The project-local install fixture proves the copy shape into
a temporary `.codex/skills` plus `.diayn` target, and the Codex-home install
fixture proves the copy shape into temporary `skills/` plus
`diayn/docs-is-all-you-need/` targets. The external runtime evidence validator
and selftest remain as optional future app-session evidence tooling. Per Owner
instruction, this validation does not launch Codex Desktop and does not claim
app-session runtime discovery or direct `/diayn-*` execution.

This means the packages can be inspected and used as local candidates, but
DIAYN can truthfully claim the Codex package/install surface, but cannot claim
Codex Desktop app-session discovery or `/diayn-*` execution as `working`.

## Manual Use Boundary

Prefer `docs/install/codex_skills.md` for the current Codex package shape. Use
this plugin candidate only for local plugin packaging experiments or later
smoke tests.

Do not publish, push, or install this candidate into a marketplace until a later
validation pass proves local plugin discovery and records the exact command and
environment evidence.
