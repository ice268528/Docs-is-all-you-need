# Candidate Done Examples

Use `candidate_done` only for worker-completed slices that still need independent review.

## Good `candidate_done`

```text
Status: candidate_done
Reason: The assigned slice is implemented within the lane boundary, evidence is recorded, and review can inspect the diff and checks.
Review command: /diayn review <lane>
```

## Use `blocked` Instead

```text
Status: blocked
Reason: The handoff requires a shared contract that does not exist or conflicts with another lane.
Needed from Controller: clarify <contract or dependency>.
```

## Use `owner_gate` Instead

```text
Status: owner_gate
Reason: The next implementation step depends on an Owner-visible product or scope decision.
Needed from Owner: choose <short option set>.
```

## Never Use

```text
Status: done
```

Executor sessions do not mark `done`; reviewers decide `done` or `rejected`.
