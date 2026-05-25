# Review Session Launch Prompt Template

> Use this template when `/diayn worktrees` or the Controller prepares instructions for a lane review session. It does not launch an agent.

## Launch Metadata

| Field | Value |
| --- | --- |
| Project slug | `<project_slug>` |
| Reviewed lane | `<backend-or-frontend-or-other-lane>` |
| Expected role | `<Backend Review Session / Frontend Review Session>` |
| Expected path | `../worktrees/<project_slug>/<lane>` or `<authorized_review_path>` |
| Allowed command | `/diayn review <lane>` |
| Worker report required | `yes` |
| Review log | `docs/lanes/<lane>/review_log.md` |

## User Startup Command

The user must paste the worker session's latest report below the command:

```text
/diayn review <lane>
"<paste latest <lane> session report here>"
```

Concrete lane examples still use placeholders:

```text
/diayn review backend
"<paste latest backend session report here>"
```

```text
/diayn review frontend
"<paste latest frontend session report here>"
```

## Prompt To Paste Into The Review Session

```text
You are the <lane> review session for this DIAYN project.

The user will paste the latest worker report under:
/diayn review <lane>

Before review:
- Perform the Session Identity Guard.
- Read the pasted worker report.
- Read docs/meta/diayn_command_reference.md.
- Read docs/meta/session_identity_protocol.md.
- Read docs/meta/session_roles.md.
- Read docs/meta/status_model.md.
- Read docs/meta/agent_doc_permissions.md.
- Read docs/lanes/<lane>/board.md.
- Read docs/lanes/<lane>/evidence.md.
- Read docs/lanes/<lane>/worklog.md.
- Read docs/lanes/<lane>/handoff.md.
- Inspect the relevant diff, tests, and acceptance criteria.

Do not merge and do not implement fixes by default.

Decide whether the candidate work becomes done or rejected. Write docs/lanes/<lane>/review_log.md and update only the target lane review status allowed by the permissions document.
```

## Review Checklist

| Check | Result | Notes |
| --- | --- | --- |
| Worker report was pasted | `<yes/no>` | `<notes>` |
| Candidate work is actually `candidate_done` | `<yes/no>` | `<notes>` |
| Diff stays inside authorized paths | `<yes/no>` | `<notes>` |
| Evidence supports the claim | `<yes/no>` | `<notes>` |
| Verification matches acceptance criteria | `<yes/no>` | `<notes>` |
| Shared contracts were not silently changed | `<yes/no/not-applicable>` | `<notes>` |
| Other lane docs or global summary were not modified by worker | `<yes/no>` | `<notes>` |

## Review Output

The review output must state:

- Decision: `done` or `rejected`.
- Evidence checked.
- Findings and rework.
- Whether the lane may start the next task slice.

