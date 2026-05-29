# Docs is all you need Codex Plugin Candidate

This directory is a local Codex plugin candidate for DIAYN.

It packages the DIAYN-owned skills from `../../skills/` so Codex plugin
packaging can be tested without copying the full DIAYN protocol into each skill.
The core `/diayn-*` workflow still reads project documents from the target
project and remains usable through manual Codex Skill installation.

Current status: `manual_fallback`.

D6-09 static validation passed with a fallback validator. Direct Codex plugin
discovery was not verified because the local `codex` executable returned access
denied for harmless discovery commands in this environment.

Do not publish this candidate or claim marketplace support until a later smoke
test verifies Codex plugin discovery.

