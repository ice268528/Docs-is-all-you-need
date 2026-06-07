# DIAYN Public Workflow Source

This `skills/` directory contains workflow source for DIAYN V1.
It intentionally contains exactly 12 DIAYN workflow skills:

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

In the Claude plugin surface, these workflow skills are background-callable and
hidden from direct user invocation with `user-invocable: false`; the user-facing
plugin commands are `/diayn:*`. Project-local fallback packages keep bare
`/diayn-*` user-visible entries by installing generated copies under the target
project's skills root.

Internal role/reference source lives in `maintainers/internal-skills/`. It is
used by maintainers and package builders as shared implementation material, but
it is not installable and must not be exposed as extra public DIAYN skills.
