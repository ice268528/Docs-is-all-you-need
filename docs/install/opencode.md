# OpenCode Status

DIAYN V1 status: deferred.

OpenCode is not a current DIAYN V1 install surface. Do not claim OpenCode
support unless a later phase proves that installed workflow skills can be
directly triggered through `/diayn-*` and can use the required DIAYN-managed
dependency-skill model.

If OpenCode support is implemented later, its init adapter must use
`platform = opencode`, create or update `AGENTS.md`, and not default-create
`CLAUDE.md`.

Earlier D6 discovery used a local `.opencode` adapter with command files and
role-oriented wrappers. That adapter has been removed from the public
repository because it does not satisfy the current DIAYN V1 requirement. Keeping it
would make the repository look like it supports an old role-wrapper model, which
is explicitly not the DIAYN V1 target.

Historical notes may still be useful to maintainers, but they are not an
installation guide and should not be presented to users as a supported path.
