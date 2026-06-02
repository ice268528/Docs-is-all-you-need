# `/diayn-init`
## Role

Controller Session.

If no DIAYN identity exists yet, this command may establish the Controller identity after confirming the repository root and asking the Owner for `project_slug`. If an identity already exists and is not Controller-compatible, stop with the common identity mismatch output.

## User Input Scenario

Existing requirement document:

```text
/diayn-init "<requirements_doc_path>"
```

Fuzzy idea or fuzzy requirement:

```text
/diayn-init
"<short idea, rough goal, or incomplete requirement>"
```

## Preconditions

- The user wants to initialize or refresh project documentation.
- The session is at the intended controller repository path.
- The Owner confirms `project_slug`; do not silently derive it from a directory name.
- The session can inspect existing `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/`, requirement docs, architecture docs, TODO, and similar sources when they exist.

## Required Reading

- Entry file, if present.
- `README.md`, if present.
- Existing requirement, architecture, TODO, project, stage, or report documents that are relevant.
- `docs/meta/agent_doc_permissions.md`
- `docs/meta/status_model.md`
- `docs/meta/progressive_disclosure_rules.md`

## Required Behavior

Run a dry-run scaffold audit before editing project files. The implementation may use the bundled helper:

```text
skills/diayn-init/scripts/harness_audit.py
```

The audit should report Git/non-Git status, dirty working tree, missing baseline files, existing-file conflicts, generated or large-file scan boundaries, nested repositories, possible secret-bearing file names without secret values, document language inference, and OwnerGate items.

For an existing requirement document, do not assume it is complete. First assess:

- Source and intended authority.
- Completeness of goals, non-goals, users, workflows, acceptance criteria, risks, constraints, and dependencies.
- Contradictions or ambiguous terms.
- Missing decisions.
- Whether it can be split into later lane tasks.
- Whether shared contracts or cross-lane boundaries are implied.

For a fuzzy idea, first turn it into Owner-readable material:

- Functional points.
- Boundaries and non-goals.
- Known risks.
- Assumptions.
- Questions that need confirmation.
- Possible lane split only when there is enough information.

Use short decision options by default. When a decision would benefit from a visual explanation, offer this option without executing it automatically:

```text
Run /diayn-html to generate a visual HTML decision aid.
```

Use the bundled `skills/diayn-init/assets/scaffold/` templates as the starting point for target-project files after Owner approval:

- `AGENTS.md`
- `TODO.md`
- `.diayn/worktree_manifest.md`
- `.diayn/scaffold_version.md`
- `.diayn/network_policy.md`
- `docs/project/project_brief.md`
- optional `docs/project/harness_audit_report.md`
- optional `docs/project/owner_questions.md`

These templates must be adapted to the target project. They are not DIAYN product documentation.

## Allowed Writes

- Draft project documents.
- Draft stage, batch, or lane planning documents.
- Owner question records.
- `.diayn/session_registry.md` and `.diayn/worktree_manifest.md` when initializing shared control metadata.
- Controller summaries such as `TODO.md`, when the repository uses one.

Project document lifecycle:

```text
draft -> owner_confirmed -> controlled_changes_only
```

## Forbidden

- Do not write business code.
- Do not invent requirements, architecture facts, test commands, or dependencies.
- Do not mark draft requirements as confirmed without Owner confirmation.
- Do not create real worktrees or launch worker sessions.

## Status Changes

- New scope starts as `todo` or `owner_gate`.
- Confirmed project facts may move from `draft` to `owner_confirmed`.
- Nothing becomes `candidate_done`, `done`, `ready_for_e2e`, or `owner_accepted`.

## Required Records

- Owner questions or decision gaps.
- Planning summary.
- Draft evidence for discovered facts, such as source paths.

## Stop Conditions

- Required source documents are missing or contradictory and the contradiction affects scope.
- The Owner has not confirmed `project_slug`.
- A dry-run audit found dirty state, existing-file conflicts, non-Git worktree assumptions, nested repository ambiguity, or possible secret-bearing files that need Owner review.
- The session would need to invent project facts.
- The next step would require implementation.

## Success Output

Report:

- Whether the input was an existing document or fuzzy idea.
- Quality and completeness findings.
- Draft documents created or updated.
- Open Owner decisions.
- Whether `/diayn-plan` is ready.
- If not ready, the minimum questions needed.

Identity mismatch output: `../diayn_command_reference.md#2-common-identity-mismatch-output`.

## Identity Mismatch Behavior

Use the common Session Identity Guard behavior and mismatch output defined in `../diayn_command_reference.md#2-common-identity-mismatch-output`. Stop rather than continuing whenever role, lane, path, manifest, local identity, requested command, or write boundary do not match this command.
