# DIAYN V1 Release Candidate Notes

Status: beta-only after D6-11 final truth audit. This file does not publish a
release, push a tag, create a plugin release, or claim general availability.

D6-11 did not accept the package as release-candidate ready. The D6-10 evidence
remains useful, but Claude Code/OpenCode adapter documents under
`integrations/**` still contain stale support wording that conflicts with the
D6-04 and D6-05 smoke evidence. Align those files before requesting a new
release-candidate gate.

## What Is Evidence-Backed

| Area | Current claim | Evidence |
| --- | --- | --- |
| Manual document workflow | `manual_fallback` | README, AGENTS, command docs, lane docs, templates, and D5/D6 workflow simulations. |
| Codex Skills | `manual_fallback` | D6-03 copied the eight canonical DIAYN skills into a real local Codex skills directory; Codex discovery/execution was not observed. |
| Codex plugin candidate | `manual_fallback` | D6-09 created `plugins/docs-is-all-you-need/` with `.codex-plugin/plugin.json` and the eight DIAYN skills; static fallback validation passed; Codex discovery was blocked. |
| Claude Code adapter | `working` | D6-04 observed project-level command discovery and `/diayn-init` execution with Claude Code `2.1.145`. |
| OpenCode adapter | `working` | D6-05 observed project-level DIAYN command and skill-wrapper discovery with OpenCode `1.14.28` using workspace-local XDG paths. |
| Controlled fixture | `working` | D5-11 validated a small full-stack register/login fixture. |
| Owner-approved validation project | `manual_fallback` | D6-06 through D6-08 created and exercised `personal-site` through sequential workflow, review, integration, and OwnerGate preparation. |
| Upstream `agent-skills` freshness | not current | D6-10 network check found remote HEAD `6ce029897d2b794940325fc7148774a6ec51111c`; vendor lock records `250ffaa`. |

## What Is Not Claimed

- DIAYN is not a shell CLI or custom runtime.
- DIAYN does not provide native slash-command execution in Codex.
- The Codex plugin candidate is not published, marketplace-backed, or verified
  as discoverable by Codex.
- Claude Code support is not global/package/plugin installation.
- OpenCode support is not full model-backed DIAYN workflow execution and not
  OpenCode agent support.
- The personal-site validation is not true concurrent multi-session execution,
  real worktree execution, browser-level acceptance evidence, production
  validation, or explicit Owner `owner_accepted`.
- The vendored `agent-skills` snapshot is not fresh relative to upstream
  remote HEAD.
- Cursor and Copilot remain out of V1 active support scope.

## Release Candidate Contents

Core entry and protocol:

- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `docs/meta/**`
- `docs/templates/**`
- `.diayn/**`

DIAYN-owned skills:

- `skills/diayn-controller/`
- `skills/diayn-executor/`
- `skills/diayn-reviewer/`
- `skills/diayn-integrator/`
- `skills/diayn-skill-router/`
- `skills/diayn-identity-guard/`
- `skills/diayn-owner-ux/`
- `skills/update-diayn-scaffold/`

Tool adapters and local package candidates:

- `integrations/claude-code/commands/`
- `integrations/opencode/.opencode/`
- `plugins/docs-is-all-you-need/`

Maintainer-only vendor reference:

- `third_party/agent-skills/`
- `vendor.lock.md`
- `maintainers/upstream-agent-skills/**`

## Required Before Release-Candidate Gate Or Publishing

1. D6-10 review must pass. Current result: passed with risk.
2. D6-11 final truth audit must decide the release gate. Current result:
   `beta_only`, not release-candidate ready.
3. `git diff --check` must pass immediately before release packaging.
4. Upstream `agent-skills` freshness must be either updated through a reviewed
   vendor sync or explicitly accepted as stale.
5. Codex plugin support must remain `manual_fallback` unless local validator and
   Codex plugin discovery evidence pass.
6. Publishing, tag creation, marketplace submission, and push require separate
   Owner or maintainer authorization.
7. Claude Code and OpenCode adapter docs must be aligned with D6-04/D6-05
   support evidence before release-candidate readiness can be claimed.
