# DIAYN Public Workflow Source

This `skills/` directory contains public workflow source for DIAYN V1.
It intentionally contains exactly 12 public workflow skills:

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

Internal role/reference source lives in `maintainers/internal-skills/`. It is
used by maintainers and package builders as shared implementation material, but
it is not installable and must not be exposed as extra public DIAYN skills.
