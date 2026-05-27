# Owner Decision Record Template

> Copy this template to an active decision location, such as `docs/owner_decisions/<decision_id>/decision.md`, when an Owner decision affects scope, acceptance, architecture, cost, risk, shared contracts, or future maintenance.

## Decision Metadata

| Field | Value |
| --- | --- |
| Decision ID | `<decision_id>` |
| Record state | `<draft / owner_selected / superseded / archived>` |
| Owner | `<Owner or decision authority>` |
| Prepared by | `<Controller or Owner-support session>` |
| Related command | `<command, such as /diayn-plan or /diayn-html>` |
| Related OwnerGate | `<owner_gate_id or n/a>` |
| Related lane(s) | `<lane or n/a>` |
| Related docs | `<paths>` |
| HTML aid | `<path / temporary / not generated>` |

## Question

```text
<one clear decision question>
```

## Options

| Option | Summary | Impact | Risk | Recommendation |
| --- | --- | --- | --- | --- |
| A | `<short selectable option>` | `<business or workflow impact>` | `<risk>` | `<recommended / not recommended>` |
| B | `<short selectable option>` | `<business or workflow impact>` | `<risk>` | `<recommended / not recommended>` |
| C | `<optional short selectable option>` | `<business or workflow impact>` | `<risk>` | `<recommended / not recommended>` |

## Owner Selection

```text
Selected option: <A/B/C>
Owner rationale: <short reason or Owner quote>
Decision time: <timestamp>
```

## HTML Archive Decision

| Question | Answer |
| --- | --- |
| Was `/diayn-html` used? | `<yes/no>` |
| Should the HTML be committed? | `<yes/no>` |
| Reason | `<long-lived decision / temporary explanation / other>` |
| HTML path | `<path or n/a>` |

Rules:

- Commit HTML for long-lived architecture, product, process, shared contract, risk, cost, security, deployment, provider, or major OwnerGate decisions.
- Keep HTML temporary for small one-time explanations or minor preferences.
- Always keep this Markdown decision record or an equivalent formal project document.

## Resulting Updates

| Target | Required update | Completed? |
| --- | --- | --- |
| `<project doc>` | `<decision impact>` | `<yes/no>` |
| `<lane board or handoff>` | `<task or scope update>` | `<yes/no/not-applicable>` |
| `<shared contract>` | `<authorized contract update>` | `<yes/no/not-applicable>` |
| `<Owner acceptance doc>` | `<acceptance update>` | `<yes/no/not-applicable>` |

## Follow-Up

| Item | Owner | Follow-up status | Notes |
| --- | --- | --- | --- |
| `<follow_up_id>` | `<Controller / lane / Owner>` | `<todo / blocked / done>` | `<notes>` |

## Copyable Owner Reply

```text
Owner decision feedback
Decision ID: <decision_id>
Selected option: <A/B/C>
Notes: <short Owner note>
```
