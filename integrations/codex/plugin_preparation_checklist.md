# Codex Plugin Preparation Checklist

Stage 08 prepares a future Codex plugin. It does not publish or install one.

## Draft Identity

- Draft plugin name: `docs-is-all-you-need`
- Draft display name: `Docs is all you need`
- Draft purpose: expose DIAYN docs, skills, templates, and command guidance as a convenient Codex package.
- Draft status: `Draft only. Not installable or publishable until validated in a later stage.`

## Candidate Contents

Candidate skills:

- `skills/multi-session-controller/`
- `skills/multi-session-executor/`
- `skills/multi-session-reviewer/`
- `skills/multi-session-integrator/`
- `skills/session-identity-guard/`
- `skills/owner-decision-ux/`
- `skills/context-compact-reminder/`

Candidate scaffold assets:

- `AGENTS.md`
- `CLAUDE.md` as a cross-tool reference asset, not a Codex requirement
- `docs/meta/**`
- `docs/templates/**`
- `.diayn/**` shared templates and control docs
- `integrations/codex/adapter.md`

Reference only:

- `third_party/agent-skills/**`
- `maintainers/upstream-agent-skills/**`

## Excluded From Plugin Package By Default

- `.git/`
- `.diayn/local/**`
- project-specific active worktrees
- generated stage output records under `DDDV3/**`
- maintainer-only vendor sync reports unless explicitly needed
- any unconfirmed plugin runtime code

## Manifest Checks

- Confirm current Codex plugin manifest schema: `Unknown / To be confirmed`.
- Confirm whether skills can be packaged directly: `Unknown / To be confirmed`.
- Confirm whether scaffold assets can be installed without overwriting user files: `Unknown / To be confirmed`.
- Confirm how plugin updates are versioned and reviewed: `Unknown / To be confirmed`.

## Validation Before Any Real Plugin

1. Verify the official plugin schema.
2. Validate that DIAYN skills remain short and self-contained.
3. Validate that scaffold assets install as templates, not project facts.
4. Validate that the plugin does not overwrite user project docs.
5. Validate that `/diayn` remains document-driven, not plugin-dependent.
6. Validate that Owner decision UX still works without plugin UI.
7. Validate that vendor `agent-skills` remains reference material.
8. Run final Stage 09 consistency checks.

## Release Risks

- Accidentally turning a draft manifest into an installable claim.
- Overwriting project-specific documents during scaffold installation.
- Making Codex-specific assumptions inside DIAYN core protocol.
- Packaging maintainer-only vendor sync as user workflow.
- Claiming exact platform capabilities that are not verified.
