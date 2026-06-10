---
document_role: "Public release status"
primary_writer: "Maintainer"
audience:
  - "Owner"
  - "Maintainers"
  - "Release reviewers"
permission: "Maintainer write"
notes:
  - "This file tracks current public release status only."
  - "Historical phase evidence and validation logs are maintainer-local artifacts, not part of the public remote surface."
---

# TODO

## Current Release Status

- Project: `Docs-is-all-you-need` / DIAYN
- Release posture: ready to publish for Claude Code and Codex Desktop users
- Primary user workflow: install DIAYN, run the 12 DIAYN commands, and let the workflow scaffold project docs, lane work, review, sync, integration, and owner acceptance.
- Public source of truth for installation: `README.md`, `README.zh-CN.md`, and `docs/install/README.md`

## Platform Support

| Status | Platform | Current user-facing surface | Notes |
| --- | --- | --- | --- |
| [x] | Claude Code plugin | `/diayn:*` commands | Marketplace/plugin install is the recommended Claude Code path. |
| [x] | Claude project-local fallback | `/diayn-*` commands | Use when the plugin marketplace path is unavailable or a project-local install is preferred. |
| [x] | Codex Desktop plugin | DIAYN plugin skills | Codex plugin adaptation is available through the Codex marketplace path. |
| [x] | Codex project-local skills | `$diayn-*` skill invocation | Use when plugin install is unavailable or project-local skill files are preferred. |
| [ ] | OpenCode adapter | TBD | OpenCode support is the remaining platform TODO. Do not claim OpenCode release support until its adapter is implemented and validated. |

## Active TODO

| Done | Item | Owner-facing outcome |
| --- | --- | --- |
| [ ] | Implement and validate OpenCode adaptation | OpenCode users can install DIAYN and run the supported DIAYN entrypoints without manual repo cloning or ad-hoc setup. |
| [ ] | Add OpenCode install documentation after validation | `docs/install/opencode.md` becomes a real user guide instead of a deferred-support note. |

## Public Repository Hygiene

The public repository should stay focused on files users need:

- install and usage docs;
- platform plugin/package payloads;
- DIAYN workflow skills;
- dependency skills packaged for supported runtimes;
- stable protocol docs and templates used by the workflow.

Maintainer-only surveys, validation logs, historical phase notes, scratch work, and local runtime evidence belong under the ignored local archive `docs/local-maintainer/`.
