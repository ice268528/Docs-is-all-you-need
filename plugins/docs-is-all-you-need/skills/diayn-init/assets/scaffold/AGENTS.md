# AGENTS

## 1. What This Repository Is

- Project slug: `<project_slug>`
- Product goal: `<owner_confirmed_goal_or_Unknown>`
- Current stage: `<stage_id_or_Unknown>`
- Primary Owner: `<owner_name_or_Unknown>`

## 2. How To Use DIAYN Here

Use DIAYN through the public `/diayn-*` workflow commands. Repository documents are the system of record; chat is for coordination and clarification.

## 3. Cold-Start Questions

1. What project is this?
2. How do I run or inspect it?
3. How do I verify a change?
4. What hard constraints must I not violate?
5. What is the next DIAYN command or Owner decision?

## 4. Current Pointers

- Current summary: `TODO.md`
- Project brief: `docs/project/project_brief.md`
- Worktree manifest: `.diayn/worktree_manifest.md`
- Scaffold version: `.diayn/scaffold_version.md`

## 5. Safety Rules

- Do not change Owner requirements silently.
- Do not overwrite existing project docs without an Owner-approved conflict report.
- Do not put secrets, private logs, raw prompts, or credentials into DIAYN docs.
- Do not merge business code during `/diayn-sync`.
- Worker sessions stop at `candidate_done`; reviewers decide `done` or `rejected`; only the Owner confirms `owner_accepted`.
