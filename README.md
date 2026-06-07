# Docs-is-all-you-need

[中文](README.zh-CN.md)

Docs-is-all-you-need, or DIAYN, is a document-driven workflow skill pack for
multi-session coding-agent work. It helps an Owner and several coding-agent
sessions move through requirements, planning, lane work, review, sync,
integration, and final acceptance without losing the project truth.

## Quick Start

### Claude Code Plugin

This is the recommended Claude Code install path.

Copy these commands into Claude Code:

```text
/plugin marketplace add ice268528/Docs-is-all-you-need
/plugin install diayn@diayn-local-alpha
```

Start a project or clarify a vague idea:

```text
/diayn:init
```

Plugin commands use the `diayn` namespace, so the command shape is
`/diayn:<command>`.

This plugin install registers the 12 DIAYN workflow skills and the bundled
DIAYN-managed `agent-skills` dependency skills. The 12 `/diayn:*` commands are
the user entrypoints; the workflow skills remain native-callable in the
background and are not exposed as bare `/diayn-*` user entries in plugin mode.
In Claude Code, `/diayn:init` creates or updates `CLAUDE.md` and does not
create `AGENTS.md` by default.
`CLAUDE.md` and `AGENTS.md` are peer platform entry files; neither one is a
wrapper for the other.

### Claude Project-Local Fallback

Use this path only when you specifically need bare `/diayn-*` commands inside a
target project.

From a cloned DIAYN repository or release package, copy the fallback package into
the target project:

```powershell
$target = "E:\path\to\target-project"
Copy-Item -Path .\packages\claude-project-local\.claude -Destination $target -Recurse -Force
Copy-Item -Path .\packages\claude-project-local\.diayn -Destination $target -Recurse -Force
```

Then start with:

```text
/diayn-init
```

This fallback also runs as Claude Code, so `/diayn-init` creates or updates
`CLAUDE.md`. Do not use fallback success as evidence that the plugin path works.

The fallback package is generated at:

```text
packages/claude-project-local/
```

Detailed Claude installation notes are in
[docs/install/claude-code.md](docs/install/claude-code.md).

### Codex

Codex package/install validation is available, but Codex Desktop runtime command
discovery still needs separate manual evidence.

From this repository root, dry-run first:

```powershell
node maintainers\scripts\install_codex_project_local_package.js --target-codex-home $env:USERPROFILE\.codex
```

Then install:

```powershell
node maintainers\scripts\install_codex_project_local_package.js --target-codex-home $env:USERPROFILE\.codex --execute
```

Codex init uses `AGENTS.md` and does not create `CLAUDE.md` by default.
`AGENTS.md` is the Codex/OpenCode/generic entry file, not a wrapper around
`CLAUDE.md`.

## Commands

| Workflow | Claude plugin | Project-local fallback | Underlying skill |
| --- | --- | --- | --- |
| Init / retrofit | `/diayn:init` | `/diayn-init` | `diayn-init` |
| Plan | `/diayn:plan` | `/diayn-plan` | `diayn-plan` |
| Worktrees | `/diayn:worktrees` | `/diayn-worktrees` | `diayn-worktrees` |
| Backend lane | `/diayn:backend` | `/diayn-backend` | `diayn-backend` |
| Frontend lane | `/diayn:frontend` | `/diayn-frontend` | `diayn-frontend` |
| Backend review | `/diayn:review-backend` | `/diayn-review-backend` | `diayn-review-backend` |
| Frontend review | `/diayn:review-frontend` | `/diayn-review-frontend` | `diayn-review-frontend` |
| Sync docs/state | `/diayn:sync` | `/diayn-sync` | `diayn-sync` |
| Integration | `/diayn:integration` | `/diayn-integration` | `diayn-integration` |
| Bug triage | `/diayn:bug` | `/diayn-bug` | `diayn-bug` |
| New stage | `/diayn:new` | `/diayn-new` | `diayn-new` |
| HTML report | `/diayn:html` | `/diayn-html` | `diayn-html` |

## Workflow

```text
/diayn:init
  -> /diayn:plan
  -> /diayn:worktrees
  -> /diayn:backend and /diayn:frontend
  -> /diayn:review-backend and /diayn:review-frontend
  -> /diayn:sync
  -> /diayn:integration
  -> Owner acceptance
```

Project-local fallback uses the same sequence with bare commands such as
`/diayn-init` and `/diayn-plan`.

## What DIAYN Installs

DIAYN exposes exactly 12 public workflow skills. It also carries locked,
DIAYN-managed `agent-skills` dependency skills so the workflows can route to
the right specialist skill when relevant. Those dependency skills are bundled
native-callable skills, not text-only routing notes, and they are not extra
public DIAYN commands.

`/diayn:init` seeds `.diayn/dependency-routing/upstream-routing-map.md` in the
target project so later workflow commands can route to bundled dependency
skills without asking the Owner to install `agent-skills` separately.

## Status

| Surface | Status |
| --- | --- |
| Claude Code plugin | Primary install path. Expected command shape is `/diayn:<command>`. Static plugin validation is supported; runtime acceptance should be verified with the QA checklist. |
| Claude project-local fallback | Keeps bare `/diayn-*` commands for projects that need them. This path is separate from plugin install. |
| Codex package/install | Package shape and install script are available. Codex Desktop runtime command discovery is not claimed yet. |
| OpenCode | Deferred until direct DIAYN workflow skill invocation is proven. |

## Maintainer Docs

| Need | File |
| --- | --- |
| Install truth and support boundaries | [docs/install/README.md](docs/install/README.md) |
| Claude Code details | [docs/install/claude-code.md](docs/install/claude-code.md) |
| Runtime QA checklist | [docs/qa/claude-plugin-runtime-acceptance.md](docs/qa/claude-plugin-runtime-acceptance.md) |
| Command behavior | [docs/meta/diayn_command_reference.md](docs/meta/diayn_command_reference.md) |
| Implementation plan | [docs/meta/diayn_v1_implementation_plan.md](docs/meta/diayn_v1_implementation_plan.md) |
