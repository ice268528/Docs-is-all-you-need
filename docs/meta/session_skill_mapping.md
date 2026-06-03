# DIAYN Skill And Dependency Mapping

> DDDV8 changes DIAYN from a public role-skill install set into a public workflow-skill install set. Roles remain real execution concepts, but they are internal/shared references rather than the user's main installed command surface.

## 1. Public Workflow Skill Surface

The V1 public surface is exactly 12 workflow skills. Each supported platform should expose them through the matching `/diayn-*` trigger.

| Public command | Owning role concept | Lane | Primary internal references |
| --- | --- | --- | --- |
| `/diayn-init` | Controller, Owner UX, Identity Guard | none | command `init`, scaffold upgrade, skill router |
| `/diayn-plan` | Controller, Identity Guard | none or applicable lanes | command `plan`, planning references, skill router |
| `/diayn-worktrees` | Controller, Identity Guard | backend/frontend when applicable | command `worktrees`, worktree helper |
| `/diayn-backend` | Executor, Identity Guard | backend | command `backend`, lane execution references, skill router |
| `/diayn-frontend` | Executor, Identity Guard | frontend | command `frontend`, lane execution references, skill router |
| `/diayn-review-backend` | Reviewer, Identity Guard | backend | command `review_backend`, review references, skill router |
| `/diayn-review-frontend` | Reviewer, Identity Guard | frontend | command `review_frontend`, review references, skill router |
| `/diayn-sync` | Controller, Integrator, Identity Guard | none | command `sync`, sync/integration protocol |
| `/diayn-integration` | Controller, Integrator, Identity Guard | none | command `integration`, integration references, skill router |
| `/diayn-bug` | Controller, Owner UX, Identity Guard | routed after triage | command `bug`, bug intake references |
| `/diayn-new` | Controller, Owner UX, Identity Guard | routed after triage | command `new`, change intake references |
| `/diayn-html` | Owner UX, Controller, Identity Guard | none | command `html`, HTML generator |

Implementation note: role/router/scaffold source such as `diayn-controller`,
`diayn-executor`, `diayn-reviewer`, `diayn-integrator`,
`diayn-identity-guard`, `diayn-owner-ux`, and `diayn-skill-router` lives under
`maintainers/internal-skills/` and may be packaged as
`.diayn/internal-role-skills` metadata. It is not the user-installed DIAYN
skill surface.

The repository root `skills/` directory is not the install contract by itself.
It contains only the 12 public workflow sources. The public V1 install surface
is the package surface: 12 `diayn-*` workflow skills exposed to the user, plus
DIAYN-managed third-party dependency skills when the platform needs those
dependency skills to be platform-visible. Historical legacy role-skill source
is not part of the public repository.

## 2. Internal Role References

Internal role references preserve responsibility boundaries:

- Controller: requirements clarification, planning, worktree setup, sync, integration, bug/new triage, stage closeout.
- Executor: one lane-local task slice at a time, evidence, worklog, candidate handoff.
- Reviewer: independent lane review, tests/verification, rejection reasons, TODO uncheck when needed.
- Integrator: reviewed-code integration checks, shared contract consistency, ready-for-e2e evidence.
- Identity Guard: command, role, lane, path, manifest, and write-boundary preflight.
- Owner UX: OwnerGate prompts, Owner-readable acceptance and HTML aids.
- Skill Router: explicit routing to DIAYN-managed third-party skills while DIAYN authority remains in control.

These references should be loaded progressively by the workflow skill that needs them.

## 3. DIAYN-Managed Third-Party Dependency Skills

DIAYN vendors the full third-party `agent-skills` baseline and locks source, version or commit, license, update time, maintainer review, and local modifications.

The DIAYN install should provide those upstream skills as DIAYN-managed dependency skills when the platform requires platform-visible skills for native nested invocation.

Rules:

- Use DIAYN-managed dependency copies by default.
- Do not silently route to arbitrary user-installed `agent-skills` copies.
- Treat direct reading of vendored `SKILL.md` files as fallback/reference behavior, not true third-party skill invocation.
- Keep routing low-noise for normal users; record routing evidence only when it affects the workflow result or validation.
- DIAYN authority wins over upstream guidance for role, lane, status, permissions, review, integration, and Owner acceptance.

## 4. Routing Reference

The routing map lives at:

```text
maintainers/internal-skills/diayn-skill-router/references/upstream-routing-map.md
```

That map should state, for every vendored upstream skill:

- when DIAYN may route to it;
- which DIAYN workflows may use it;
- why the mapping exists;
- what DIAYN rule overrides it;
- whether the skill is unused in V1 and why.

## 5. Read-First Pattern

Every public workflow skill should start small:

1. Confirm command, role, lane, directory, manifest, and write boundary through the Identity Guard contract.
2. Read `AGENTS.md` or the platform entry file only as needed for target-project cold start.
3. Read `docs/meta/diayn_command_reference.md`.
4. Read only the matching command detail under `docs/meta/diayn_commands/`.
5. Read lane, stage, shared contract, TODO, or third-party dependency guidance only when the current task needs it.

This preserves progressive disclosure and avoids loading all DIAYN rules into every command context.
