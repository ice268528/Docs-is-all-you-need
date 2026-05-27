# Scaffold Acceptance Checklist

Use this checklist to decide whether a new project scaffold is understandable
and usable by an Owner and multiple agent sessions.

## Owner Entry

- [ ] `AGENTS.md` exists and points agents to the multi-session protocol.
- [ ] `CLAUDE.md` exists for Claude-style entry where relevant.
- [ ] The Owner can start with `/diayn-init`.
- [ ] `/diayn-init` supports both an existing requirements document and a fuzzy
      idea.
- [ ] The Owner is asked to confirm `project_slug`.
- [ ] Long decisions offer `/diayn-html` but do not auto-generate HTML.

## Controller Flow

- [ ] `/diayn-plan` creates lane-level work rather than one global task pile.
- [ ] `/diayn-worktrees` records planned worktree metadata and launch prompts.
- [ ] Worktree paths use `../worktrees/<project_slug>/<lane>`.
- [ ] The Controller verifies that required docs are visible to target sessions.
- [ ] `/diayn-sync` aggregates lane state without hiding missing evidence.
- [ ] `/diayn-integration` marks `ready_for_e2e` only with evidence.

## Worker Flow

- [ ] Worker commands start with Session Identity Guard.
- [ ] Worker sessions read their lane board, handoff, evidence, worklog, and
      shared docs as needed.
- [ ] Worker sessions assess feasibility and dependencies before editing.
- [ ] Each worker run handles one clear task slice.
- [ ] Workers stop after reporting and mark at most `candidate_done`.

## Review Flow

- [ ] Review commands require the user-pasted worker report.
- [ ] Review checks diff, evidence, tests or verification records, acceptance
      criteria, and write boundaries.
- [ ] Review sessions decide `done` or `rejected`.
- [ ] Review sessions do not merge, default to code fixes, or mark
      `owner_accepted`.

## Owner Acceptance

- [ ] Owner acceptance is written from the business or user experience point of
      view.
- [ ] The Owner is not asked to understand mocks, coverage, unit tests, or
      internal test implementation.
- [ ] Owner feedback can be copied back into the agent conversation.
- [ ] `owner_accepted` is separate from review `done`.

## Packaging And Adapters

- [ ] DIAYN-owned skills exist under `skills/**`.
- [ ] `third_party/agent-skills/**` is vendor reference material only.
- [ ] Tool adapters live under `integrations/**`.
- [ ] Core protocol remains usable without plugin installation.
- [ ] Codex plugin documents are draft preparation only until validated.

## Examples And Migration

- [ ] Examples are isolated under `docs/examples/**`.
- [ ] Legacy state migration rules are available.
- [ ] Old single-session records are preserved or marked superseded instead of
      silently deleted.
