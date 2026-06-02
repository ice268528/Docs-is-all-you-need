# DDDV8 Phase 1 Platform Mechanics And Fixture Audit

This file records the Phase 1 evidence for implementing DIAYN V1 as a real 12-workflow-skill pack.

## 1. Local Reference Projects Inspected

| Reference | Relevant files | Finding |
| --- | --- | --- |
| `../superpowers` | `.codex-plugin/plugin.json`, `.claude-plugin/plugin.json`, `.opencode/plugins/superpowers.js`, `README.md` | Uses platform-specific packaging. Codex plugin declares `skills`. Claude plugin has a plugin manifest/marketplace shape. OpenCode support uses a JavaScript plugin that injects bootstrap context and registers a skills path. |
| `../agent-skills` | `.claude-plugin/plugin.json`, `.claude/commands/*.md`, `skills/*/SKILL.md`, `docs/opencode-setup.md`, `README.md` | Claude plugin declares both `commands` and `skills`. Command files are short and explicitly invoke named skills. OpenCode docs say OpenCode does not support the same slash-command model and relies on `AGENTS.md` plus the `skill` tool. |

## 2. Platform Commands Observed

| Surface | Local observation | DDDV8 implication |
| --- | --- | --- |
| Codex Desktop / Codex executable | Codex package shape can be inspected statically, but this environment cannot prove Codex app-session discovery or `/diayn-*` invocation. | Codex package shape can follow the `superpowers` `.codex-plugin/plugin.json` pattern, but app-session runtime proof remains a Phase 4 validation blocker. |
| Claude Code CLI | `claude --version` returned `2.1.149 (Claude Code)`. `claude --help` shows `--plugin-dir`, plugin management, and skill resolution. `claude plugin validate ../agent-skills` and `claude plugin validate ../superpowers` passed. | Claude is the strongest alpha surface candidate. DIAYN should use a `.claude-plugin/plugin.json` that declares both short `/diayn-*` command files and real workflow skills. |
| OpenCode CLI | `opencode --version` returned `1.14.28` only after using isolated XDG dirs. `../agent-skills/docs/opencode-setup.md` states OpenCode uses `AGENTS.md` plus the `skill` tool rather than native slash commands. | OpenCode remains deferred for DDDV8 unless later evidence proves installed workflow skills can be directly triggered through `/diayn-*`. Do not build an OpenCode-first adapter to bypass the requirement. |

## 3. Reference Pattern Conclusions

### Claude Code

`agent-skills` is the closest fit for DIAYN's target model:

- `.claude-plugin/plugin.json` can declare `commands`, `skills`, and optional `agents`.
- `.claude/commands/*.md` files can be small command adapters.
- A command can explicitly say `Invoke the agent-skills:<skill-name> skill`.
- For DIAYN, each `.claude/commands/diayn-*.md` should invoke the matching public DIAYN workflow skill, not an internal role skill.
- DIAYN-managed third-party dependency skills can be packaged in the same plugin or dependency structure if native nested skill invocation requires platform-visible skills.

### Codex Desktop

`superpowers` is the closest local Codex reference:

- `.codex-plugin/plugin.json` declares a `skills` path and UI metadata.
- It does not show a separate `commands` field.
- DIAYN therefore needs public workflow skill names/descriptions that clearly mention `/diayn-*` triggers.
- Direct `/diayn-*` behavior must be validated in the Codex App after Phase 2 creates the 12 public workflow skills and Phase 4 packages them.

### OpenCode

The local references do not satisfy the DDDV8 OpenCode rule:

- `agent-skills` says OpenCode does not support slash commands like `/spec` or `/plan` in the same way.
- `superpowers` uses an OpenCode plugin to inject bootstrap context and skills paths, not a proven `/diayn-*` workflow-skill trigger.
- DDDV8 should keep OpenCode out of alpha until direct installed workflow-skill invocation is proven.

## 4. Current DIAYN Package Gap

The current DIAYN repository still has an older public role-skill shape:

```text
skills/diayn-controller/
skills/diayn-executor/
skills/diayn-reviewer/
skills/diayn-integrator/
skills/diayn-skill-router/
skills/diayn-identity-guard/
skills/diayn-owner-ux/
skills/update-diayn-scaffold/
```

DDDV8 requires a public workflow-skill shape:

```text
skills/diayn-init/
skills/diayn-plan/
skills/diayn-worktrees/
skills/diayn-backend/
skills/diayn-frontend/
skills/diayn-review-backend/
skills/diayn-review-frontend/
skills/diayn-sync/
skills/diayn-integration/
skills/diayn-bug/
skills/diayn-new/
skills/diayn-html/
```

The older role skills can be reused as internal/shared references, but they are not the final public install surface.

## 5. Phase 1 Decisions For Implementation

- Build Claude Code alpha around the `agent-skills` pattern: plugin manifest plus command files plus real workflow skills.
- Build Codex alpha around the `superpowers` pattern: `.codex-plugin/plugin.json` plus real workflow skills, then validate direct `/diayn-*` behavior in the app.
- Keep OpenCode deferred until direct `/diayn-*` workflow-skill invocation is proven.
- Do not claim third-party composition until DIAYN-managed dependency skills can be invoked natively or through an equivalent native skill tool call.
- Treat direct reading of vendored upstream `SKILL.md` as fallback/reference behavior only.

## 6. Evidence Commands

Commands run during this phase:

```text
where.exe codex
codex --version
where.exe claude
claude --version
claude --help
claude plugin --help
claude plugin validate ..\agent-skills
claude plugin validate ..\superpowers
where.exe opencode
opencode --version
python validation\minimal-fullstack-fixture\validation\run_e2e.py --output validation\minimal-fullstack-fixture\validation\phase1_e2e_result.json
```

Important results:

- Codex executable exists but `codex --version` is blocked by access denial in this environment.
- Claude Code is available as `2.1.149`.
- Claude validates both local reference plugins.
- OpenCode is available as `1.14.28` when isolated XDG state paths are used.
- The current minimal fixture E2E runner passes; see `validation/minimal-fullstack-fixture/validation/phase1_e2e_result.json`.
