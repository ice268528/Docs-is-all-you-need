# DIAYN Stage Closeout

Stage: `<stage_id>`
Owner decision: `<accepted/rejected/pending>`

## Accepted Baseline

- Branch: `<branch>`
- Commit: `<commit>`
- Integration summary: `<path>`
- Owner acceptance record: `<path>`

## Final Artifacts

- TODO summary updated: `<yes/no>`
- Evidence archived or linked: `<paths>`
- Review logs linked: `<paths>`
- Follow-up items: `<none_or_list>`

## Next Stage Baseline Refresh

Before `/diayn-new`, `/diayn-plan`, or `/diayn-worktrees` starts the next stage, Controller checks that controller and applicable lane worktrees are clean and aligned to the accepted baseline.

Do not silently delete worktrees, branches, logs, or evidence.
