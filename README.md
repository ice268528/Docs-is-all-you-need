# Docs-is-all-you-need

Docs-is-all-you-need, or DIAYN, is a document-driven multi-session coding-agent collaboration control plane.

DIAYN is for users who want multiple coding-agent sessions to work on one project without losing role boundaries, task state, evidence, review authority, or Owner acceptance. It is not a custom coding agent, not a shell CLI, and not a published plugin.

## Start With Codex Skills First

The current first supported path is Codex Skills with a manual copy install. Install the eight DIAYN skill folders from `skills/` into your Codex skills directory, then use the `/diayn-*` text as workflow triggers inside Codex chat.

Install guide: `docs/install/codex_skills.md`.

Shortest current path:

```text
Install Codex Skills from docs/install/codex_skills.md
/diayn-init
/diayn-plan
/diayn-worktrees
cd ../worktrees/<project_slug>/backend
/diayn-backend
cd ../worktrees/<project_slug>/frontend
/diayn-frontend
/diayn-review-backend
/diayn-review-frontend
/diayn-sync
/diayn-integration
```

First-run notes:

- `/diayn-init` must ask the Owner to confirm `project_slug`; do not silently use the repository folder name as final truth.
- `/diayn-worktrees` uses `../worktrees/<project_slug>/<lane>` as the default path pattern.
- The default lanes are `backend` and `frontend`; project documents may introduce later lane names.
- A worker session does one clear task slice, reports, and stops for review.
- A review session needs the latest worker report pasted by the user, then checks diff, evidence, tests, and acceptance criteria.
- The Controller does not silently launch hidden interactive agent subprocesses.
- If Codex does not auto-select a DIAYN skill, explicitly ask it to use the matching skill, such as `diayn-controller`, `diayn-executor`, or `diayn-reviewer`.

## Support Levels

| Surface | Current support level | Truthful meaning |
| --- | --- | --- |
| Manual document workflow | `manual_fallback` | Usable today by asking an existing coding agent to read this repo and follow `/diayn-*` workflow triggers. |
| Codex Skills | `manual_fallback` | The canonical DIAYN skill folders are usable by copying them into the Codex skills directory. There is no installer or marketplace package yet. |
| Codex plugin | `manual_fallback` | A local plugin candidate exists under `plugins/docs-is-all-you-need/` and statically validates against the available local convention. Codex discovery/execution was blocked by environment access denial, so it is not `working`, published, or marketplace-backed. |
| Claude Code CLI | `working` | Project-level manual copy install of `integrations/claude-code/commands/` was smoke-tested in D6-04 with Claude Code `2.1.145`; `/diayn-init` execution was observed. This is not a packaged or global install. |
| OpenCode CLI | `working` | Project-level manual copy install of `integrations/opencode/.opencode/` was smoke-tested in D6-05 with OpenCode `1.14.28`; command and skill-wrapper discovery were observed. Full model-backed workflow execution is not yet proven. |
| Cursor / Copilot | out of V1 scope | Existing notes are future planning only unless DDDV5 is revised. |

See `docs/install/README.md` for the support matrix and first-use guidance.

## Validation Status

D5-11 adds a controlled full-stack fixture under `validation/minimal-fullstack-fixture/`. The fixture validates a small register/login flow with frontend HTML, backend API, and SQLite persistence.

DDDV6 adds stronger release-candidate evidence without turning DIAYN into a native runtime:

- Claude Code project-level command discovery/execution is locally smoke-tested.
- OpenCode project-level command and skill-wrapper discovery is locally smoke-tested.
- The Owner-approved `personal-site` validation project reached sequential review/integration simulation with backend and frontend slices reviewed as `done` and integration at `ready_for_e2e`.
- Owner business acceptance remains `owner_gate`; no explicit `owner_accepted`, browser-level evidence, true concurrent sessions, or real worktree execution has been claimed.
- A local Codex plugin candidate exists, but Codex plugin discovery remains unverified and support stays `manual_fallback`.
- D6-10 found the upstream `agent-skills` remote HEAD has moved beyond the vendored `250ffaa` snapshot; no vendor copy update was performed in D6-10.
- D6-11 blocker repair aligned Claude Code and OpenCode adapter docs with the D6-04 and D6-05 scoped smoke evidence; this repair still does not publish, tag, or claim full release.

See `docs/meta/release_validation.md` and `RELEASE_NOTES.md` for the current validation boundary.

## What `/diayn-*` Is

`/diayn-*` commands are workflow triggers for existing coding agents. They are prompts to read DIAYN documents, confirm session identity, and execute the relevant role workflow.

They are not:

- shell commands provided by this repository;
- a built-in slash-command runtime;
- a working, published, or marketplace-backed Codex plugin;
- automatically installed Claude Code or OpenCode native command files;
- hidden launchers for backend, frontend, or reviewer agents.

Older two-segment forms such as `/diayn init` may appear in historical notes or migration records. Current canonical usage is the one-segment `/diayn-*` form.

## Roles At A Glance

| Role | Main responsibility |
| --- | --- |
| Owner | Provides goals, decisions, acceptance feedback, and business experience judgment. |
| Controller Session | Handles initialization, planning, worktree setup, sync, integration, bug triage, and new-requirement triage. |
| Worker Session | Handles lane work such as backend or frontend; completes one task slice and stops. |
| Review Session | Reviews backend or frontend lane work; decides whether reviewed work is `done` or `rejected`. |
| Integration Session | Checks cross-lane readiness and only marks integrated work ready when evidence supports it. |

Every `/diayn-*` workflow should start with the Session Identity Guard so the current command, role, lane, path, manifest, registry, and write boundary match.

## Status Model

DIAYN separates worker progress, review authority, integration readiness, and Owner acceptance.

Use these statuses in the multi-session flow:

- `candidate_done`: a worker believes one task slice is complete and has evidence.
- `reviewing`: a reviewer is checking worker output.
- `done`: a reviewer approved the lane task slice.
- `rejected`: a reviewer rejected the lane task slice and recorded why.
- `ready_for_e2e`: Controller integration found enough evidence for Owner business acceptance.
- `owner_accepted`: the Owner confirmed the business or user experience.

Worker sessions may mark at most `candidate_done`. Review sessions decide `done` or `rejected`. Owner acceptance decides `owner_accepted`.

## Owner Acceptance

Owner acceptance is about business experience, not test implementation.

The Owner should be asked things like:

- Can a user complete the intended action?
- Does the result look correct from the user's point of view?
- Does the system show understandable messages for important success, empty, or error states?
- Is there simple evidence that the expected record, side effect, or saved state exists?

The Owner does not need to understand test code, mock setup, coverage, internal test architecture, or internal test commands. Agents provide engineering verification evidence; reviewers check credibility; the Owner judges whether the experience works.

## Extra User Commands

These commands are short entry points. See `docs/meta/diayn_command_reference.md` for details.

- `/diayn-bug`: use when Owner business experience acceptance fails. The Controller decides whether the issue belongs in the current scope or a later backlog.
- `/diayn-new`: use when the Owner introduces a new requirement, dependency change, or direction change. The Controller decides whether it enters the current plan or a future preparation record.
- `/diayn-html`: use only when the user asks for an HTML aid. It can help compare a complex decision or explain the previous agent report in Owner-friendly language.

## Skills And Adapters

The current D5 Codex install set is:

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

These are Codex Skill folders with concise `SKILL.md` entry points and deeper `references/` files. Install them by following `docs/install/codex_skills.md`. They are skills, not a plugin, shell CLI, or custom runtime.

Use `update-diayn-scaffold` when you want to retrofit an existing project into DIAYN. It starts with a dry-run audit, conflict report, migration plan, and patch proposal; it does not silently overwrite README, AGENTS.md, CLAUDE.md, docs, `.diayn/`, or user project content.

`third_party/agent-skills/**` is an upstream method-library vendor copy for maintainers. It is not the DIAYN adapter layer and should not replace DIAYN's own multi-session harness.

Tool adapter material lives in `integrations/**` as documentation-level planning:

- Codex adapter docs remain documentation-level guidance. A local plugin candidate exists under `plugins/docs-is-all-you-need/`, but D6-09 could not verify Codex plugin discovery in this environment, so it remains `manual_fallback`. See `docs/install/codex_plugin_local_candidate.md`.
- Claude Code command files exist under `integrations/claude-code/commands/` for manual copy/link install; D6-04 verified project-level discovery/execution in the local Claude Code environment. See `docs/install/claude-code.md`.
- OpenCode command and skill-wrapper files exist under `integrations/opencode/.opencode/` for manual copy/link install; D6-05 verified project-level discovery in the local OpenCode environment. See `docs/install/opencode.md`.
- Cursor and Copilot notes are future-only and out of DDDV5 V1 active scope.

Adapters point back to core DIAYN documents. They do not change command semantics or turn the core workflow into a tool-specific protocol.

## Read Next

README is only the front door. Read the smallest document set needed for your session:

| Need | Read |
| --- | --- |
| General agent entry | `AGENTS.md` |
| Claude Code entry | `CLAUDE.md` |
| Install and support truth | `docs/install/README.md` |
| Release candidate notes | `RELEASE_NOTES.md` |
| OpenCode adapter install | `docs/install/opencode.md` |
| `/diayn-*` command details | `docs/meta/diayn_command_reference.md` |
| Worktree lane startup | `docs/meta/diayn_worktree_workflow.md` |
| Session identity guard | `docs/meta/session_identity_protocol.md` |
| Role authority | `docs/meta/session_roles.md` |
| Status meanings | `docs/meta/status_model.md` |
| Document permissions | `docs/meta/agent_doc_permissions.md` |
| Owner decision UX | `docs/meta/owner_decision_ux_protocol.md` |
| Owner acceptance UX | `docs/meta/owner_acceptance_protocol.md` |
| Cross-tool adapter policy | `docs/meta/cross_tool_adapter_policy.md` |

Keep durable project facts in repository documents. Keep chat for immediate coordination, clarification, and user feedback.
