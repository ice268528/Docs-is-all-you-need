# Vendor Lock

## agent-skills

- Vendor name: `agent-skills`
- Source URL: `git@github.com:addyosmani/agent-skills.git`
- Source commit: `250ffaa`
- Source worktree state at sync: clean
- Source license: MIT
- Synced at: 2026-05-25 Asia/Shanghai
- Synced by: DIAYN maintainer workflow

## Public Packaged Copies

The raw upstream source snapshot is maintainer-local and is not part of the
public remote surface. Public users receive the DIAYN-managed dependency skills
through the install payloads:

- `plugins/diayn/skills/<dependency-skill-name>/`
- `packages/claude-project-local/.claude/skills/<dependency-skill-name>/`
- `packages/codex-project-local/.codex/skills/<dependency-skill-name>/`

Public packaged references and licenses are kept with the corresponding plugin
or package payload. Maintainer machines may keep the raw upstream source
snapshot under `docs/local-maintainer/third_party/agent-skills/`, but that
ignored archive is not part of the public install surface.

## DIAYN Managed Dependency Model

- Normal DIAYN users install DIAYN once. They should not separately install
  third-party `agent-skills` one by one.
- Platforms that require dependency skills to be visible for nested invocation
  install or register the DIAYN-managed dependency payload.
- A real third-party dependency call means platform-native nested skill
  invocation or an equivalent native skill tool call against the DIAYN-managed
  locked copy.
- Directly reading dependency `SKILL.md` files is fallback/reference behavior
  only. It does not count as native third-party composition evidence.
- Do not silently select uncontrolled user-installed `agent-skills` copies
  unless provenance, version, skill names, and routing compatibility match this
  lock or an Owner/maintainer explicitly approves the substitution.

## Protected DIAYN Paths

Upstream sync must not overwrite DIAYN-owned skills, protocol files, or package
metadata.

Protected public workflow skill paths:

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

Protected packaged internal-role metadata:

- `plugins/diayn/internal-role-skills/`
- `packages/claude-project-local/.diayn/internal-role-skills/`
- `packages/codex-project-local/.diayn/internal-role-skills/`

Protected protocol paths:

- `docs/meta/multi_session_collaboration_protocol.md`
- `docs/meta/session_roles.md`
- `docs/meta/status_model.md`
- `docs/meta/diayn_command_reference.md`
