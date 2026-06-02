# Docs is all you need Codex Plugin Candidate

This directory is a local Codex plugin candidate for DIAYN.

DDDV8 status: Phase 12 alpha package candidate. The active `skills/` directory
contains the 12 public workflow skills plus progressively disclosed workflow
assets and deterministic helpers. Older role-oriented material is retained
under `internal-role-skills/` as implementation reference material and is not
the plugin's public skill surface.

It packages the DIAYN-owned workflow skills so Codex plugin packaging can be
tested without copying the full DIAYN protocol into each skill. The core
`/diayn-*` workflow still reads project documents from the target project and
uses progressive disclosure.

The locked third-party `agent-skills` dependency payload lives under
`dependency-skills/`. Those dependency skills are not extra public DIAYN
commands. Claude project-local installed-flow validation proves representative
native dependency invocation. Codex project-local static validation proves the
`.codex/skills` package shape, and an authorized real Codex Home file install
has copied the V1 package files into place. Codex app-session runtime validation
is still blocked.

Current status: `real_home_file_install_validated_runtime_blocked`.

Direct Codex plugin or skills discovery is still not verified from the current
or reloaded Codex app session. File presence alone is not runtime proof.

Do not publish this candidate or claim marketplace support until a later smoke
test verifies Codex plugin or `.codex/skills` discovery and direct `/diayn-*`
workflow-skill invocation.
