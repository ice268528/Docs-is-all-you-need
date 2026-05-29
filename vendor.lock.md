# Vendor Lock

## agent-skills

- Vendor name: `agent-skills`
- Source type: local snapshot from outer workspace directory `../agent-skills/`
- Source URL: `git@github.com:addyosmani/agent-skills.git`
- Source commit: `250ffaa`
- Source worktree state at sync: clean
- Sync method: vendor copy
- Synced at: 2026-05-25 Asia/Shanghai
- Synced by: Stage 07 execution session
- Vendor path: `third_party/agent-skills/`
- Included scope: tracked files from local `agent-skills` HEAD, including upstream entry docs, setup docs, hooks, references, scripts, agents, tool metadata, and `skills/**`.
- Excluded paths: source `.git/`, untracked source files, local OS/editor metadata, and temporary archive files.
- License/attribution check: `LICENSE` is present in the vendor copy and identifies the upstream license as MIT with copyright attribution to Addy Osmani. No additional license file was found during this sync.
- Symlink handling: upstream `.opencode/skills` is a git symlink to `../skills/`; in this Windows vendor copy it is represented as a regular text file containing the same target.

## Watched Skills

Direct tracking:

- `skills/test-driven-development/`
- `skills/incremental-implementation/`
- `skills/code-review-and-quality/`
- `skills/git-workflow-and-versioning/`

Needs DIAYN adaptation:

- `skills/planning-and-task-breakdown/`
- `skills/context-engineering/`
- `skills/documentation-and-adrs/`
- `skills/api-and-interface-design/`

Reference only:

- `references/orchestration-patterns.md`
- Tool-specific setup and command material under `.claude/`, `.claude-plugin/`, `.gemini/`, `.opencode/`, and `docs/*-setup.md`
- Slash command implementations under upstream tool directories

## DIAYN Protected Paths

Upstream sync must not overwrite DIAYN-owned skills, protocol files, or local
state templates. Current canonical D5+ skill paths are protected:

- `skills/diayn-controller/`
- `skills/diayn-executor/`
- `skills/diayn-reviewer/`
- `skills/diayn-integrator/`
- `skills/diayn-skill-router/`
- `skills/diayn-identity-guard/`
- `skills/diayn-owner-ux/`
- `skills/update-diayn-scaffold/`

Legacy pre-D5 DIAYN skill paths are also protected while they remain in the
repository for compatibility or migration context:

- `skills/multi-session-controller/`
- `skills/multi-session-executor/`
- `skills/multi-session-reviewer/`
- `skills/multi-session-integrator/`
- `skills/session-identity-guard/`
- `skills/owner-decision-ux/`
- `skills/context-compact-reminder/`

Protocol and state paths protected from upstream vendor sync:

- `docs/meta/multi_session_collaboration_protocol.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `.diayn/`

## Latest Sync Summary

Stage 07 vendored the local outer `agent-skills/` snapshot at commit `250ffaa` into `third_party/agent-skills/` using vendor copy. This sync established maintainer-only update policy and review templates under `maintainers/upstream-agent-skills/`. It did not create a submodule, subtree, Codex plugin, adapter, CLI, runtime, or user-facing scaffold update workflow.
