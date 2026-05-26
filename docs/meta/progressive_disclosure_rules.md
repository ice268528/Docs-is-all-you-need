# Progressive Disclosure Rules

> This document keeps the scaffold readable by defining where short entry rules, long protocol details, examples, and skill references belong.

## 1. Core Rule

Every rule should live at the smallest useful level of detail:

- Entry files orient the agent.
- `docs/meta/**` defines protocol.
- Project docs define project facts.
- Lane docs define active lane work.
- Templates define reusable structure.
- Examples demonstrate usage but do not create authority.
- `SKILL.md` files describe workflows and link to references.

Do not copy the same long explanation into multiple places.

## 2. Entry Files

`AGENTS.md` and `CLAUDE.md` are landing pages and indexes. They should contain:

- A short project orientation.
- Install, run, test, and verification placeholders or links.
- Hard constraints and stop conditions.
- A small read-first index.
- Links to the multi-session protocol, workflow, permissions, and `docs/meta/diayn_command_reference.md`.

They should not contain:

- The full role protocol.
- The full status model.
- Long examples.
- Full `/diayn` command semantics.
- Tool-specific implementation details beyond the entry file's own tool context.

## 3. Meta Documents

Use `docs/meta/**` for durable, project-neutral protocol:

| File | Owns |
| --- | --- |
| `multi_session_collaboration_protocol.md` | Overall protocol and navigation |
| `session_roles.md` | Role responsibilities, write boundaries, stop conditions |
| `agent_doc_permissions.md` | Document permissions by role and document class |
| `agent_execution_workflows.md` | Execution workflow boundaries |
| `status_model.md` | Status names, transitions, role authority, migration |
| `session_skill_mapping.md` | Skill mapping and skill/vendor boundary |
| `progressive_disclosure_rules.md` | Placement rules for entry files, skills, examples, and references |

If a concept belongs to one of these files, link to it instead of restating it elsewhere.

## 4. Skill Files

`SKILL.md` files should be workflow triggers, not encyclopedias. They should stay short and link to:

- `docs/meta/**` for protocol.
- `references/**` for long explanations.
- `examples/**` for concrete walkthroughs.
- `scripts/**` only when the scaffold intentionally includes helper scripts.

A good `SKILL.md` answers:

- When to use this skill.
- What to read first.
- What steps to follow.
- What files may be written.
- When to stop.
- What output to produce.

## 5. Examples And Guides

Examples should be clearly labeled as examples. They must not become hidden project facts.

Use examples for:

- Sample lane handoff packets.
- Sample review logs.
- Sample Owner acceptance records.
- Sample controller sync summaries.

Use guides or references for:

- Long explanations.
- Tool-specific setup details.
- Migration walkthroughs.
- Command output examples.

## 6. Single Authority Rules

| Concept | Single authority |
| --- | --- |
| Status definitions | `docs/meta/status_model.md` |
| Role write boundaries | `docs/meta/session_roles.md` and `docs/meta/agent_doc_permissions.md` |
| Workflow shape | `docs/meta/agent_execution_workflows.md` |
| Identity guard concept | `docs/meta/session_identity_protocol.md` |
| Entry file size and content | `docs/meta/progressive_disclosure_rules.md` |
| `/diayn` command semantics | `docs/meta/diayn_command_reference.md` |

When editing one authority file, update only the short links in other files unless a real contradiction must be fixed.

## 7. Project-Neutral Core

Core protocol files must not hard-code:

- A specific project name.
- A specific stage number.
- A specific product feature.
- A specific technology stack.
- A specific model, provider, service, host, or vendor.

Use variables such as `<project_slug>`, `<stage_id>`, `<lane>`, `<worktree_root>`, `<contract_path>`, `<verification_command>`, and `<owner_acceptance_path>`.

## 8. Review Checklist

Before adding a long rule to an entry file or `SKILL.md`, ask:

- Is this needed before the agent knows which protocol file to open?
- Is this rule already owned by a meta document?
- Would a link be clearer than copying the text?
- Will this text become outdated if a later stage changes templates or commands?
- Is this an example rather than a rule?

If the answer points to a deeper document, link instead of duplicating.
