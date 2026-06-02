# Codex Plugin Preparation Checklist

This checklist records Codex plugin preparation and the D6-09 local candidate.
It does not publish or marketplace-install a plugin.

## Draft Identity

- Draft plugin name: `docs-is-all-you-need`
- Draft display name: `Docs is all you need`
- Draft purpose: expose DIAYN docs, skills, templates, and command guidance as a convenient Codex package.
- Current status: `static_package_validated_runtime_blocked`. The local plugin
  candidate and project-local `.codex/skills` package are statically validated,
  but Codex discovery/execution is not verified because the local Codex
  app-session discovery remains unproven.

## Candidate Contents

Candidate skills:

- `skills/diayn-init/`
- `skills/diayn-plan/`
- `skills/diayn-worktrees/`
- `skills/diayn-backend/`
- `skills/diayn-frontend/`
- `skills/diayn-review-backend/`
- `skills/diayn-review-frontend/`
- `skills/diayn-sync/`
- `skills/diayn-integration/`
- `skills/diayn-bug/`
- `skills/diayn-new/`
- `skills/diayn-html/`

Project-local Codex package:

- `packages/codex-project-local/.codex/skills/diayn-*`
- `packages/codex-project-local/.codex/skills/<agent-skills-name>`
- `packages/codex-project-local/.diayn/dependency-routing/upstream-routing-map.md`

Candidate scaffold assets:

- `AGENTS.md`
- `CLAUDE.md` as a cross-tool reference asset, not a Codex requirement
- `docs/meta/**`
- `docs/templates/**`
- `.diayn/**` shared templates and control docs
- `integrations/codex/adapter.md`

Reference only:

- `plugins/docs-is-all-you-need/internal-role-skills/**`
- `maintainers/upstream-agent-skills/**`

## Excluded From Plugin Package By Default

- `.git/`
- `.diayn/local/**`
- project-specific active worktrees
- generated stage output records under `DDDV*/**`
- maintainer-only vendor sync reports unless explicitly needed
- any unconfirmed plugin runtime code

## Manifest Checks

- Local candidate manifest path: `plugins/docs-is-all-you-need/.codex-plugin/plugin.json`.
- Available local convention: `.codex-plugin/plugin.json` plus `skills: "./skills/"`.
- Skills package shape: the 12 DIAYN workflow skills are included under
  `plugins/docs-is-all-you-need/skills/`.
- Project-local shape: the 12 workflow skills and 23 DIAYN-managed dependency
  skills are included under `packages/codex-project-local/.codex/skills/`.
- Static validation: current DDDV8 validators pass.
- Official/local validator blocker: the plugin-creator Python validator could
  not run in the available Python environments because `yaml` was missing.
- Codex discovery blocker: `codex --version`, `codex --help`, and
  Codex plugin discovery remains unproven in the current environment.
- Scaffold asset installer behavior: `Unknown / To be confirmed`.
- Plugin updates and marketplace review behavior: `Unknown / To be confirmed`.

## Validation Before Any Real Plugin

1. Re-run the local plugin validator in an environment with the required Python
   dependencies.
2. Validate that DIAYN skills remain short and self-contained.
3. Validate that scaffold assets install as templates, not project facts.
4. Validate that the plugin does not overwrite user project docs.
5. Validate that `/diayn-*` remains document-driven, not plugin-dependent.
6. Validate that Owner decision UX still works without plugin UI.
7. Validate that vendor `agent-skills` remains reference material.
8. Verify Codex plugin discovery/execution before any `working` claim.
9. Run final release truth audit and link-checking before any publishable claim.

## Release Risks

- Accidentally turning a draft manifest into an installable claim.
- Overwriting project-specific documents during scaffold installation.
- Making Codex-specific assumptions inside DIAYN core protocol.
- Packaging maintainer-only vendor sync as user workflow.
- Claiming exact platform capabilities that are not verified.
