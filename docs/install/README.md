# DIAYN Install And Support Truth

This file states what the DDDV8 implementation may truthfully claim. It replaces earlier D5/D6 wording where that wording conflicts with the DDDV8 V1 requirement baseline.

## Active Target

DIAYN V1 is a skill pack with exactly 12 public workflow skills:

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

The target user experience is one DIAYN install that makes these commands available as real workflow skills. The user should not need to clone the DIAYN source repository into every target project and then run unrelated setup commands before skills can be used.

In Claude Code, the standard plugin path exposes these workflows as short
plugin-namespaced commands such as `/diayn:init`. Bare `/diayn-*` is the
project-local fallback command surface.

Claude Code init surfaces use `CLAUDE.md` as the platform entry file. Codex,
OpenCode, and generic AGENTS.md-based adapters use `AGENTS.md`. DIAYN must not
default-generate both entry files in one init run.
`CLAUDE.md` and `AGENTS.md` are peer platform entry files. Do not implement one
as a wrapper, upstream entry, or mandatory reader of the other.

## Alpha Surfaces

| Surface | DDDV8 target | Current DDDV8 status |
| --- | --- | --- |
| Codex package/install | Alpha target for the current Codex package/install scope: installed workflow skills, DIAYN-managed dependency skills, and routing metadata must be copied into the expected Codex skills shape. | Repository-root `.codex-plugin/plugin.json` now points to `packages/codex-project-local/.codex/skills/`, which contains 12 workflow skills plus 23 DIAYN-managed dependency skills. The inner plugin artifact also exists. Static validation plus executed project-local and Codex-home install fixtures prove package shape, install commands, and installed directory inspection. Codex Desktop app-session runtime discovery/invocation is intentionally not attempted and must not be claimed. |
| Claude Code CLI | Standard install target is plugin/marketplace install with plugin-namespaced commands. Project-local fallback is kept separately for bare `/diayn-*` short commands. | Repository-root `.claude-plugin/plugin.json` now uses `name: "diayn"`, points short commands such as `init.md` to root `.claude/commands`, and explicitly registers only bundled dependency skills from `plugins/docs-is-all-you-need/dependency-skills/agent-skills/skills/`. Claude Code discovers the 12 workflow skills from root `skills/`; those workflow skills are marked `user-invocable: false` for plugin mode, so commands can call them natively while the user-facing DIAYN workflow surface remains `/diayn:*`. The expected plugin command shape is `/diayn:init`, not bare `/diayn-init`. A separate project-local fallback at `packages/claude-project-local/` proves bare `/diayn-init` command-to-`Skill` invocation, all 12 bare command/skill entries, routed `/diayn-init -> idea-refine`, and a complete installed-flow fixture. This fallback is not plugin/marketplace proof. |
| OpenCode CLI | Deferred unless installed workflow skills can be directly triggered through `/diayn-*`. | Deferred for DDDV8. Earlier D6 discovery notes are historical only. |
| Cursor / Copilot | Out of V1 scope. | No active V1 support claim. |

## Third-Party Skill Dependency Rule

DIAYN should carry a locked third-party `agent-skills` baseline and install or register those skills as DIAYN-managed dependency skills when a platform requires platform-visible skills for native nested invocation.

Rules:

- Reading a vendored upstream `SKILL.md` directly is only fallback/reference behavior; it does not count as real third-party skill invocation.
- A real third-party skill call means platform-native nested skill invocation or an equivalent native skill tool call against the DIAYN-managed dependency copy.
- Claude Code plugin install registers DIAYN workflow skills and dependency skills; it is not a command-only plugin and does not require Owner to separately install `agent-skills`.
- User-installed third-party `agent-skills` copies are not selected silently unless they match DIAYN lock metadata or an Owner/maintainer explicitly approves the substitution.
- DIAYN keeps authority over role, lane, state, review, integration, evidence, and Owner acceptance.

## Historical Artifacts

Alpha package artifact notes:

- Codex package candidate: `docs/install/codex-alpha.md`
- Claude Code package candidate and fallback boundary: `docs/install/claude-code-alpha.md`

This repository now contains DDDV8 public workflow skills, progressively disclosed workflow assets, deterministic helpers, alpha package artifacts, and a locked dependency payload plus useful D5/D6 artifacts:

- 12 workflow skills under `skills/diayn-init/` through `skills/diayn-html/`, hidden from direct user invocation in Claude plugin mode while remaining native-callable;
- Controller scaffold audit/planning, worktree planning, lane/review/sync/integration, Owner UX, privacy/network, migration, and cleanup dry-run assets;
- locked DIAYN-managed dependency skills under `plugins/docs-is-all-you-need/dependency-skills/`;
- internal role/reference skills under `plugins/docs-is-all-you-need/internal-role-skills/`;
- repository-root Claude/Codex plugin entrypoints under `.claude-plugin/` and `.codex-plugin/`;
- a local Codex plugin candidate under `plugins/docs-is-all-you-need/`;
- Claude Code and OpenCode adapter notes under `integrations/`;
- vendored upstream `agent-skills` under `third_party/agent-skills/`.

The repository root `skills/` directory now contains only the 12 public
workflow skill sources. Internal role/router/scaffold sources live under
`maintainers/internal-skills/` and are copied into package metadata where
needed. The install surface is determined by the package being installed:
the Codex plugin candidate exposes only
`plugins/docs-is-all-you-need/skills/diayn-*`, and the Codex project-local/Home
package installs 12 public `diayn-*` workflow skills plus 23 DIAYN-managed
third-party dependency skills. Role-only folders such as `diayn-controller`
are not extra V1 public commands and should not be treated as proof of a
correct DIAYN install.
The root source layout is documented in `skills/README.md`.
Maintainer validation outputs are local-only under `validation/` and ignored by
Git; they are not uploaded as public repository content.
Real target installs report pre-existing non-package skills separately from the
DIAYN V1 package and preserve them unless a separate cleanup action is
explicitly authorized.

These artifacts are implementation inputs. They are not final DDDV8 release evidence until each relevant phase in `docs/meta/diayn_v1_implementation_plan.md` marks the artifact validated.

## Claims To Avoid

Do not claim that the current repository already provides:

- a published marketplace/plugin install;
- a final Claude Code marketplace install that proves bare `/diayn-*`;
- a working all-platform V1;
- OpenCode DDDV8 support;
- exhaustive routed use of every vendored third-party skill from an active DIAYN workflow;
- automatic hidden agent/session launching;
- a shell CLI or custom agent runtime;
- Codex Desktop app-session runtime support.

Those claims require surface-appropriate validation. Surface support is
evaluated independently: Claude Code project-local requires installed-flow
validation, while the current Codex claim is limited to package/install
validation through install commands and directory inspection.

## Validation Gate

No alpha claim for a surface until that surface's installed package completes:

```text
install -> /diayn-init -> /diayn-plan -> /diayn-worktrees
-> /diayn-backend and /diayn-frontend
-> /diayn-review-backend and /diayn-review-frontend
-> /diayn-sync -> /diayn-integration
-> Owner acceptance -> closeout -> next-stage baseline refresh
```

No exhaustive third-party composition release claim until routed `agent-skills` coverage is broadened beyond the representative `/diayn-init -> idea-refine` smoke test.

Current surface-specific result: the Claude project-local fallback has
completed the installed flow and focused side scenarios for bare `/diayn-*`.
The standard Claude plugin/marketplace path now targets the short namespace
`/diayn:*`, with expected commands such as `/diayn:init`; that namespace still
needs Owner runtime verification. Codex package/install scope is also
validated: the package shape, install commands, and installed directory
inspection pass. Codex Desktop app-session runtime is outside the current
validation scope and is not claimed.

Current installed-flow audit documents:

```text
docs/meta/diayn_v1_phase9_installed_flow_audit.md
```

The current installed-flow audit uses `phase9_*` artifact names from the
earlier implementation split, but now corresponds to the Phase 12 installed-flow
release gate in the refined DDDV8 plan. It is release-ready for the stated
surfaces: Claude project-local plus Codex package/install.

Do not treat shell-launched Codex or install-fixture output as Codex Desktop
app-session runtime proof. A future Desktop runtime claim would need evidence
from Codex Desktop itself, but that validation is intentionally not attempted
in the current scope.
