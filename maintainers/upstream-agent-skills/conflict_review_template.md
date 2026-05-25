# Upstream Conflict Review Template

Use this when an upstream `agent-skills` change may conflict with DIAYN multi-session protocol or protected harness behavior.

## Conflict Metadata

- Upstream source:
- Upstream commit:
- Upstream path:
- DIAYN protected path or protocol:
- Reviewer:
- Review date:

## Conflict Description

- Upstream behavior:
- DIAYN behavior:
- Why they conflict:

## Risk Assessment

- Could this weaken role separation?
- Could this treat executor self-verification as final completion?
- Could this bypass review session authority?
- Could this bypass OwnerGate?
- Could this mix maintainer sync into ordinary `/diayn` user workflow?
- Could this require terminal users to understand vendor mechanics?

## Required Decision

- Keep upstream only in `third_party/agent-skills/`.
- Adapt with DIAYN-specific wording.
- Reject from DIAYN core.
- Escalate to OwnerGate.

## OwnerGate Prompt, If Needed

Short question:

```text

```

Options:

1. 
2. 
3. 

## Resolution Record

- Decision:
- Decision source:
- Files changed:
- Follow-up validation:
