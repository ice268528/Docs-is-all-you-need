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

## Alpha Surfaces

| Surface | DDDV8 target | Current DDDV8 status |
| --- | --- | --- |
| Codex Desktop | Alpha target if installed workflow skills can be invoked through `/diayn-*` and can route to DIAYN-managed dependency skills. | Plugin artifact exists, and `packages/codex-project-local/` statically validates the `.codex/skills` package shape with 12 workflow skills plus 23 DIAYN-managed dependency skills. Executed install fixtures prove both project-local `.codex/skills` + `.diayn` shape and Codex-home `$CODEX_HOME/skills` shape without relying on a maintainer's private Codex Home. Direct `/diayn-*` invocation and native dependency-skill invocation still need proof from the current or reloaded Codex app session before Codex alpha can be claimed. |
| Claude Code CLI | Alpha target if installed workflow skills can be invoked through `/diayn-*` and can route to DIAYN-managed dependency skills. | Plugin artifact exists and `claude plugin validate` passes, but plugin-dir commands are namespaced. A separate project-local package at `packages/claude-project-local/` proves bare `/diayn-init` command-to-`Skill` invocation, all 12 bare command/skill entries are visible and enter workflow context, direct native loading of the DIAYN-managed `idea-refine` dependency skill, routed `/diayn-init -> idea-refine` dependency invocation, and a complete installed-flow fixture for all 12 public commands. |
| OpenCode CLI | Deferred unless installed workflow skills can be directly triggered through `/diayn-*`. | Deferred for DDDV8. Earlier D6 discovery notes are historical only. |
| Cursor / Copilot | Out of V1 scope. | No active V1 support claim. |

## Third-Party Skill Dependency Rule

DIAYN should carry a locked third-party `agent-skills` baseline and install or register those skills as DIAYN-managed dependency skills when a platform requires platform-visible skills for native nested invocation.

Rules:

- Reading a vendored upstream `SKILL.md` directly is only fallback/reference behavior; it does not count as real third-party skill invocation.
- A real third-party skill call means platform-native nested skill invocation or an equivalent native skill tool call against the DIAYN-managed dependency copy.
- User-installed third-party `agent-skills` copies are not selected silently unless they match DIAYN lock metadata or an Owner/maintainer explicitly approves the substitution.
- DIAYN keeps authority over role, lane, state, review, integration, evidence, and Owner acceptance.

## Historical Artifacts

Alpha package artifact notes:

- Codex package candidate: `docs/install/codex-alpha.md`
- Claude Code package candidate: `docs/install/claude-code-alpha.md`

This repository now contains DDDV8 public workflow skills, progressively disclosed workflow assets, deterministic helpers, alpha package artifacts, and a locked dependency payload plus useful D5/D6 artifacts:

- 12 public workflow skills under `skills/diayn-init/` through `skills/diayn-html/`;
- Controller scaffold audit/planning, worktree planning, lane/review/sync/integration, Owner UX, privacy/network, migration, and cleanup dry-run assets;
- locked DIAYN-managed dependency skills under `plugins/docs-is-all-you-need/dependency-skills/`;
- internal role/reference skills under `plugins/docs-is-all-you-need/internal-role-skills/`;
- a local Codex plugin candidate under `plugins/docs-is-all-you-need/`;
- Claude Code and OpenCode adapter notes under `integrations/`;
- a controlled fixture under `validation/minimal-fullstack-fixture/`;
- vendored upstream `agent-skills` under `third_party/agent-skills/`.

The repository root `skills/` directory is implementation source material, not
the install surface. The install surface is determined by the package being
installed: the Codex plugin candidate exposes only
`plugins/docs-is-all-you-need/skills/diayn-*`, and the Codex project-local/Home
package installs 12 public `diayn-*` workflow skills plus 23 DIAYN-managed
third-party dependency skills. Older root folders such as `multi-session-*`,
`owner-decision-ux`, `session-identity-guard`, or role-only `diayn-controller`
copies are historical/internal source material. They are not extra V1 public
commands and should not be treated as proof of a correct DIAYN install.
The root source layout is documented in `skills/README.md` and validated by
`validation/phase2_public_skill_surface.json`.
Real target installs report pre-existing non-package skills separately from the
DIAYN V1 package and preserve them unless a separate cleanup action is
explicitly authorized.

These artifacts are implementation inputs. They are not final DDDV8 release evidence until each relevant phase in `docs/meta/diayn_v1_implementation_plan.md` marks the artifact validated.

## Claims To Avoid

Do not claim that the current repository already provides:

- a published marketplace/plugin install;
- a working all-platform V1;
- OpenCode DDDV8 support;
- exhaustive routed use of every vendored third-party skill from an active DIAYN workflow;
- automatic hidden agent/session launching;
- a shell CLI or custom agent runtime;
- release readiness.

Those claims require installed-flow validation on the controlled fixture.
Surface support is evaluated independently: a proven surface may be described
as an alpha-supported surface, but a blocked surface still blocks any Codex or
all-surface release claim.

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

Current surface-specific result: the Claude project-local package has completed
the installed flow and focused side scenarios, so it is the only supported alpha
surface recorded by the gate. Codex package shape and install fixtures pass, but
Codex runtime discovery/invocation is still blocked by `P9-CODEX-001`.

Current installed-flow audit:

```text
docs/meta/diayn_v1_phase9_installed_flow_audit.md
validation/phase9_capability_matrix.json
validation/phase9_release_gate.json
validation/phase9_codex_runtime_external_evidence_selftest.json
```

The current installed-flow audit uses `phase9_*` artifact names from the earlier implementation split, but now corresponds to the Phase 12 installed-flow release gate in the refined DDDV8 plan. It is an honest blocker record, not release readiness.

Codex Desktop runtime evidence must be collected from Codex Desktop itself,
not from a shell-launched Codex process. Use
`docs/install/codex_runtime_external_evidence_template.json` to record a
structured app-session `skill_discovery_snapshot` before claiming direct
`/diayn-*` invocation. Maintainers may keep local manual runbooks while testing,
but those files are not tracked as remote release evidence.
