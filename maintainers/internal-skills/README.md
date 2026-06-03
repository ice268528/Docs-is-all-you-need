# DIAYN Internal Skill Source

This directory contains internal role/reference source for DIAYN maintainers.
It is not installable and is not the public DIAYN V1 skill surface.

The public workflow source is `skills/`, and the installable package surfaces
expose only the 12 public `/diayn-*` workflow skills plus DIAYN-managed
third-party dependency skills.

Internal folders here describe Controller, Executor, Reviewer, Integrator,
Identity Guard, Owner UX, Skill Router, and scaffold-upgrade behavior. Public
workflow skills may use this material through packaged `.diayn/internal-role-skills`
references, but users should not install or call these folders directly.
They are not public DIAYN V1 skills.
