# Contract Consistency Checks

Use these checks when multiple lanes depend on shared assumptions.

## Shared Contract Sources

- `docs/shared/contracts/**`
- lane handoffs
- lane boards
- review logs
- integration issues
- project constraints

## Check For

- Same endpoint, schema, event, type, permission, or behavior described differently across lanes.
- One lane implementing a contract the other lane has not accepted.
- A contract changed in code without shared docs.
- Review passing a lane while shared dependencies remain undefined.

## Recording Issues

Write each issue with:

- Short title.
- Affected lanes.
- Conflicting sources.
- Required decision or implementation owner.
- Suggested next command.

Do not silently choose one lane's version when both are plausible.
