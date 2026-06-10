# Docs-is-all-you-need

[中文](README.zh-CN.md)

Docs-is-all-you-need, or DIAYN, is a document-driven workflow pack for
multi-session coding-agent work. It helps you turn a vague idea or requirement
into a project that can be planned, split into lanes, reviewed, synchronized,
and accepted without losing the project truth.

## Who It Is For

- Owners who want an idea turned into a clear project plan.
- Teams that work across multiple agent sessions and want one source of truth.
- Claude Code users who want a plugin-first workflow.
- Codex users who want the current skills-package path or want to test the
  Codex Desktop plugin candidate.

## Quick Start

### Claude Code Plugin Install

Copy these commands into Claude Code:

```text
/plugin marketplace add ice268528/Docs-is-all-you-need
/plugin install diayn@diayn-local-alpha
```

Then start with:

```text
/diayn:init
```

DIAYN will ask clarifying questions when needed, then create the project docs
and starter files it needs.

### Codex Desktop Plugin Candidate

Codex Desktop currently uses the app UI for marketplace installation; this
repository does not require a Codex CLI for the plugin candidate.

In Codex Desktop, open **Add plugin marketplace** and use:

```text
Source: git@github.com:ice268528/Docs-is-all-you-need.git
Git ref: main
Sparse path: plugins/codex
```

Then switch the plugin list filter away from "Built by OpenAI" if needed and
look for `diayn`. This path is still a candidate until a fresh Codex Desktop
install, discovery, and invocation run is recorded.

## Core Workflow

```mermaid
flowchart TD
  A["Idea / requirement"] --> B["/diayn:init"]
  B --> C["Project brief + starter docs"]
  C --> D["/diayn:plan"]
  D --> E["Worktrees"]
  E --> F["Backend lane"]
  E --> G["Frontend lane"]
  F --> H["Review"]
  G --> H
  H --> I["/diayn:sync"]
  I --> J["/diayn:integration"]
  J --> K["Owner acceptance"]
```

The review step can send work back to a lane when something needs more work.

## Common Commands

This table shows the Claude Code plugin command and the Claude project-local
fallback form. Codex currently has a verified skills-package path; direct
Codex slash behavior still needs Desktop runtime evidence.

| Workflow | Command | When to use |
| --- | --- | --- |
| Init / retrofit | `/diayn:init` (`/diayn-init` in fallback) | Start from an idea, or set up DIAYN in an existing project. |
| Plan | `/diayn:plan` (`/diayn-plan`) | Turn the current goal into stages, tasks, and ownership. |
| Worktrees | `/diayn:worktrees` (`/diayn-worktrees`) | Prepare lane workspaces before implementation starts. |
| Backend lane | `/diayn:backend` (`/diayn-backend`) | Work on backend tasks for the current stage. |
| Frontend lane | `/diayn:frontend` (`/diayn-frontend`) | Work on frontend tasks for the current stage. |
| Backend review | `/diayn:review-backend` (`/diayn-review-backend`) | Review backend work before merge or handoff. |
| Frontend review | `/diayn:review-frontend` (`/diayn-review-frontend`) | Review frontend work before merge or handoff. |
| Sync docs/state | `/diayn:sync` (`/diayn-sync`) | Sync lane state, docs, and shared project truth. |
| Integration | `/diayn:integration` (`/diayn-integration`) | Check the combined result before closing a stage. |
| Bug triage | `/diayn:bug` (`/diayn-bug`) | Route a new bug or a surprising failure. |
| New stage | `/diayn:new` (`/diayn-new`) | Start the next stage or capture a new chunk of work. |
| HTML report | `/diayn:html` (`/diayn-html`) | Generate or refresh the HTML view of DIAYN docs. |

## What DIAYN Adds To Your Project

```mermaid
flowchart LR
  P["Your project"] --> A["CLAUDE.md or AGENTS.md"]
  P --> B["TODO.md"]
  P --> C[".diayn/"]
  P --> D["docs/project/"]
  P --> E["docs/stages/"]
  P --> F["lane / review / acceptance docs"]
```

Typical generated or maintained files include:

- a platform entry file: `CLAUDE.md` or `AGENTS.md`
- `TODO.md` for the current project summary
- `.diayn/` for DIAYN control files and metadata
- `docs/project/` for the project brief and file index
- `docs/stages/` for stage-level docs
- lane, review, and acceptance docs for active work

## Other Installation Paths

- Claude project-local fallback: use this when you want bare `/diayn-*`
  commands inside a target project. See
  [docs/install/claude-code.md](docs/install/claude-code.md).
- Codex: the verified path today is the skills package install into
  `.codex/skills/` or Codex Home skills. The Codex Desktop plugin marketplace
  candidate uses `Sparse path: plugins/codex` and still needs runtime evidence.
  See
  [docs/install/codex_skills.md](docs/install/codex_skills.md) and
  [docs/install/codex_plugin_local_candidate.md](docs/install/codex_plugin_local_candidate.md).
- OpenCode / generic: see [docs/install/README.md](docs/install/README.md)
  for the supported paths and setup notes.

## More Docs

If you want the details behind the user-facing quick start, read:

- [docs/install/README.md](docs/install/README.md)
- [docs/install/claude-code.md](docs/install/claude-code.md)
- [docs/install/codex_skills.md](docs/install/codex_skills.md)
- [docs/install/codex_plugin_local_candidate.md](docs/install/codex_plugin_local_candidate.md)
- [docs/install/codex_desktop_marketplace_fix_report.md](docs/install/codex_desktop_marketplace_fix_report.md)
- [docs/qa/claude-plugin-runtime-acceptance.md](docs/qa/claude-plugin-runtime-acceptance.md)
- [docs/meta/diayn_command_reference.md](docs/meta/diayn_command_reference.md)
- [docs/meta/diayn_commands/](docs/meta/diayn_commands/)
- [docs/meta/diayn_v1_implementation_plan.md](docs/meta/diayn_v1_implementation_plan.md)
- [docs/project/file_index.md](docs/project/file_index.md)
