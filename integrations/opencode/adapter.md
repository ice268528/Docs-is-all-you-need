# OpenCode Adapter Boundary

DDDV8 OpenCode support is deferred.

Earlier D6 work explored a local `.opencode` command/skill-wrapper bundle, but
that bundle used role-oriented wrappers and does not satisfy the current DIAYN
V1 requirement: installed workflow skills must be directly triggerable through
`/diayn-*`.

The old adapter files have been removed from the public repository. Do not use
this directory as an installation path. A future OpenCode adapter must be
designed only after direct `/diayn-*` workflow-skill invocation is proven.
