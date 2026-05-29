# Codex Plugin Local Candidate

DIAYN has a local Codex plugin candidate at:

```text
plugins/docs-is-all-you-need/
```

This is not a published plugin, not marketplace support, and not a replacement
for the manual Codex Skills path. The plugin candidate packages the eight
DIAYN-owned skills and keeps the core workflow document-driven.

## Candidate Contents

```text
plugins/docs-is-all-you-need/.codex-plugin/plugin.json
plugins/docs-is-all-you-need/skills/diayn-controller/
plugins/docs-is-all-you-need/skills/diayn-executor/
plugins/docs-is-all-you-need/skills/diayn-reviewer/
plugins/docs-is-all-you-need/skills/diayn-integrator/
plugins/docs-is-all-you-need/skills/diayn-skill-router/
plugins/docs-is-all-you-need/skills/diayn-identity-guard/
plugins/docs-is-all-you-need/skills/diayn-owner-ux/
plugins/docs-is-all-you-need/skills/update-diayn-scaffold/
```

The plugin candidate does not copy `docs/meta/**` into each skill and does not
vendor `third_party/agent-skills/**` as DIAYN skills.

## Current Support Level

Support level: `manual_fallback`.

D6-09 created a local plugin candidate and performed static validation against
the available local plugin convention. Codex CLI discovery could not be verified
because `codex --version`, `codex --help`, and `codex plugin --help` returned
access denied in the current environment.

This means the package can be inspected and used as a local candidate, but DIAYN
cannot truthfully claim Codex plugin discovery or execution as `working`.

## Manual Use Boundary

Prefer `docs/install/codex_skills.md` for current Codex usage. Use this plugin
candidate only for local plugin packaging experiments or later smoke tests.

Do not publish, push, or install this candidate into a marketplace until a later
validation pass proves local plugin discovery and records the exact command and
environment evidence.

