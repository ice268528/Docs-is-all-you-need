# DIAYN Install And Support Truth

This file describes what a new user can actually use today. It does not claim native command, plugin, or adapter support before a verified artifact exists.

## Current Best Path

Use DIAYN in Codex first by manually installing the canonical DIAYN skill folders, then run the `/diayn-*` workflows in Codex chat:

```text
1. Install the eight DIAYN Codex Skills from `skills/`.
2. Open the target project in Codex.
3. Type `/diayn-init` or explicitly ask Codex to use `diayn-controller` for `/diayn-init`.
4. Continue with `/diayn-plan`, `/diayn-worktrees`, lane work, review, sync, and integration as the skills and documents instruct.
```

`/diayn-*` entries are workflow triggers, not shell commands. If Codex does not auto-select the intended skill, name it explicitly in chat. If a non-Codex tool does not support skills, use the manual document workflow fallback.

Codex install details: `docs/install/codex_skills.md`.

Codex plugin candidate note: `docs/install/codex_plugin_local_candidate.md`.
The plugin candidate is not verified as working plugin discovery.

Other manual adapters:

- Claude Code command adapter: `docs/install/claude-code.md`
- OpenCode command and skill-wrapper adapter: `docs/install/opencode.md`

## Support Matrix

| Surface | Support level | What exists | What does not exist yet |
| --- | --- | --- | --- |
| Codex Skills | `manual_fallback` | Eight canonical Codex Skill folders, concise `SKILL.md` files, references, and manual copy install instructions. | Automatic installer, marketplace package, or custom runtime enforcement. |
| Manual document workflow | `manual_fallback` | README, AGENTS, command docs, lane docs, and templates for tools without installed DIAYN skills. | Native automation, guaranteed platform command parsing, or runtime enforcement. |
| Codex plugin | `manual_fallback` | Local candidate under `plugins/docs-is-all-you-need/` with `.codex-plugin/plugin.json` and the eight DIAYN skills; D6-09 static fallback validation passed. | Published plugin, marketplace package, or verified Codex plugin discovery/execution. |
| Claude Code CLI | `working` | Project-level manual copy install of the 12 command files was smoke-tested in D6-04 with Claude Code `2.1.145`; `/diayn-init` execution was observed from `.claude/commands/`. | Packaged installer, global auto-install, or guaranteed discovery in every environment. |
| OpenCode CLI | `working` | Project-level manual copy install was smoke-tested in D6-05 with OpenCode `1.14.28`; DIAYN command and skill-wrapper discovery were observed. | Full model-backed workflow execution, package installer, custom runtime, global auto-install, or guaranteed behavior in every environment. |
| Cursor | out of V1 scope | Future planning notes may exist. | Active V1 support claim. |
| Copilot | out of V1 scope | Future planning notes may exist. | Active V1 support claim. |

## D6-10 Release Candidate Snapshot

D6-10 does not upgrade support levels. It packages the existing evidence into
release-candidate notes and records the current freshness boundary:

- Claude Code remains `working` only for local project-level manual copy
  command discovery/execution.
- OpenCode remains `working` only for local project-level command and
  skill-wrapper discovery.
- Codex Skills and the Codex plugin candidate remain `manual_fallback` because
  Codex discovery/execution is not verified.
- The Owner-approved `personal-site` validation remains `manual_fallback`
  sequential workflow simulation, not production or true concurrent validation.
- Upstream `agent-skills` freshness is not current: D6-10 observed remote HEAD
  `6ce029897d2b794940325fc7148774a6ec51111c` while `vendor.lock.md` records
  `250ffaa`. No vendor copy update was performed.

Release candidate notes: `RELEASE_NOTES.md`.

## D6-11 Final Truth Audit Snapshot

The initial D6-11 final truth audit kept the release gate at `beta_only`
because Claude Code and OpenCode adapter docs still contained stale support
wording. The D6-11 blocker repair aligns those adapter docs with the D6-04 and
D6-05 evidence:

- Claude Code is scoped `working` for local project-level `.claude/commands/`
  manual copy install, not global/package/plugin support.
- OpenCode is scoped `working` for local project-level `.opencode/commands`
  and skill-wrapper discovery, not full model-backed workflow execution or
  global/package/plugin support.

This repair does not upgrade Codex Skills or Codex plugin support. Codex Skills
remain `manual_fallback`, and the Codex plugin remains a local candidate at
`manual_fallback` until real Codex discovery/execution evidence exists.

## Canonical Commands

Use the one-segment command names:

```text
/diayn-init
/diayn-plan
/diayn-worktrees
/diayn-backend
/diayn-frontend
/diayn-review-backend
/diayn-review-frontend
/diayn-sync
/diayn-integration
/diayn-bug
/diayn-new
/diayn-html
```

Older two-segment names are migration or historical wording only.

## What To Avoid Claiming

Do not claim that this repository currently provides:

- a shell CLI;
- a native slash-command runtime;
- a working, published, or marketplace-backed Codex plugin;
- automatically installed or globally guaranteed Claude Code command support;
- full OpenCode model-backed DIAYN workflow execution before it is smoke-tested;
- Cursor or Copilot V1 support;
- hidden child-agent auto-launch;
- global shell commands for the deterministic helper scripts. The helpers exist only as local skill support scripts.

Those claims require later implementation and validation stages.
