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

## DDDV8 Managed Dependency Model

- Normal DIAYN users install DIAYN once. They should not separately install
  third-party `agent-skills` one by one.
- The DIAYN package carries the locked upstream dependency payload under
  `plugins/docs-is-all-you-need/dependency-skills/agent-skills/`.
- Platforms that require dependency skills to be visible for nested invocation
  must install or register that DIAYN-managed payload.
- A real third-party dependency call means platform-native nested skill
  invocation or an equivalent native skill tool call against the DIAYN-managed
  locked copy.
- Directly reading vendored upstream `SKILL.md` files is fallback/reference
  behavior only. It does not count as native third-party composition evidence.
- Do not silently select uncontrolled user-installed `agent-skills` copies
  unless provenance, version, skill names, and routing compatibility match this
  lock or an Owner/maintainer explicitly approves the substitution.

## DIAYN Protected Paths

Upstream sync must not overwrite DIAYN-owned skills, protocol files, or local
state templates. Current DDDV8 public workflow skill paths are protected:

- `skills/diayn-init/`
- `skills/diayn-plan/`
- `skills/diayn-worktrees/`
- `skills/diayn-backend/`
- `skills/diayn-frontend/`
- `skills/diayn-review-backend/`
- `skills/diayn-review-frontend/`
- `skills/diayn-sync/`
- `skills/diayn-integration/`
- `skills/diayn-bug/`
- `skills/diayn-new/`
- `skills/diayn-html/`

Internal/shared DIAYN role-reference paths are also protected:

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

Stage 07 vendored the local outer `agent-skills/` snapshot at commit `250ffaa`
into `third_party/agent-skills/` using vendor copy. DDDV8 Phase 3 revalidated
that local snapshot, added the DIAYN-managed packaged dependency payload, and
defined native dependency-skill invocation requirements. This remains a
maintainer-controlled vendor copy, not a runtime network fetch.
