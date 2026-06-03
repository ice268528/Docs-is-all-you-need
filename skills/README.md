# DIAYN Root Skills Source Workspace

This `skills/` directory is a source workspace for DIAYN implementation work.
It is not the install surface and must not be counted as the public V1 command
surface.

## Public Workflow Skills

The V1 public workflow surface is exactly 12 public workflow skills:

```text
diayn-init
diayn-plan
diayn-worktrees
diayn-backend
diayn-frontend
diayn-review-backend
diayn-review-frontend
diayn-sync
diayn-integration
diayn-bug
diayn-new
diayn-html
```

These are the only DIAYN V1 public `/diayn-*` workflow commands.

## Internal Reference Source

Some folders are internal role/reference source material used to build,
document, or validate the public workflow skills:

```text
diayn-controller
diayn-executor
diayn-identity-guard
diayn-integrator
diayn-owner-ux
diayn-reviewer
diayn-skill-router
update-diayn-scaffold
```

These are not extra public V1 commands. They are implementation references for
Controller, Executor, Reviewer, Integrator, Owner UX, Identity Guard, Skill
Router, and scaffold-upgrade behavior.

## Install Surfaces

Installable DIAYN surfaces are separate from this source workspace:

- Codex plugin public skills: `plugins/docs-is-all-you-need/skills/`
- Codex project-local package: `packages/codex-project-local/.codex/skills/`
- Claude project-local package: `packages/claude-project-local/.claude/skills/`

Those package surfaces are the places to check for installable public commands.
The root `skills/` directory is where implementation source lives.

## Legacy Source

Historical D5/D6 skill sources live outside this directory:

```text
maintainers/legacy-skills/
```

Do not move legacy `multi-session-*`, `owner-decision-ux`,
`session-identity-guard`, or `context-compact-reminder` folders back into
`skills/`. They are retained only for maintainer reference and must not be
treated as installable DIAYN V1 skills.
