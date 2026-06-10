# DIAYN Release Notes

## Current Public Status

DIAYN V1 exposes 12 document-driven workflow capabilities for multi-session
coding-agent work.

Supported public surfaces:

- Claude Code plugin mode with `/diayn:*` commands.
- Claude project-local fallback with bare `/diayn-*` commands.
- Codex Desktop plugin install from this repository.
- Codex project-local/Home skills package.

OpenCode support remains TODO.

## Public Repository Shape

The public repository keeps user-facing install and runtime material:

- `README.md` and `README.zh-CN.md`
- `AGENTS.md` and `CLAUDE.md`
- `.claude-plugin/`, `.claude/commands/`
- `.agents/plugins/`, `plugins/diayn/`
- `skills/`
- `packages/claude-project-local/`
- `packages/codex-project-local/`
- `docs/install/`, `docs/meta/`, `docs/project/`, `docs/templates/`
- `vendor.lock.md`

Maintainer-only scripts, validation output, raw upstream snapshots, and
historical analysis are excluded from the public remote surface and may live in
the local ignored archive `docs/local-maintainer/`.

## Current Boundary

- DIAYN is not a shell CLI or custom runtime.
- DIAYN does not automatically launch hidden agent sessions.
- Dependency skills are bundled as DIAYN-managed dependencies, not as extra
  public DIAYN workflow commands.
- Official third-party marketplace publication is not claimed unless a future
  release explicitly says so.
