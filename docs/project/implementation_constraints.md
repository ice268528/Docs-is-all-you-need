---
document_role: "Project implementation constraints"
primary_writer: "Owner or Controller during authorized initialization"
audience:
  - "Owner"
  - "Controller Session"
  - "Worker Session"
  - "Review Session"
permission: "Owner controlled"
---

# Implementation Constraints

This file records long-lived implementation constraints. It should not contain
lane task breakdown, worker notes, or temporary TODO items.

## 1. Constraint Summary

| Constraint area | Rule | Strength | Notes |
| --- | --- | --- | --- |
| `<area>` | `<constraint>` | `<hard / preferred / forbidden>` | `<notes>` |

## 2. Runtime And Tooling

| Concern | Decision or allowed range | Unknowns |
| --- | --- | --- |
| Frontend stack | `<framework/version or Unknown>` | `<notes>` |
| Backend stack | `<framework/version or Unknown>` | `<notes>` |
| Runtime | `<Node / Python / other / Unknown>` | `<notes>` |
| Package manager | `<tool or Unknown>` | `<notes>` |
| Database or storage | `<choice or Unknown>` | `<notes>` |
| Third-party services | `<allowed / forbidden / Unknown>` | `<notes>` |

## 3. Architecture And Module Boundaries

- Module boundaries: `<rules or Unknown>`
- Data flow constraints: `<rules or Unknown>`
- API or contract constraints: `<rules or Unknown>`
- Directory or layering constraints: `<rules or Unknown>`
- Forbidden implementation approaches: `<rules or Unknown>`

## 4. Dependency And License Policy

- New dependency rule: `<rule or Unknown>`
- Approved dependency scope: `<scope or Unknown>`
- Forbidden dependencies: `<items or none>`
- License or attribution requirements: `<requirements or Unknown>`

## 5. Security, Privacy, And Operations

| Concern | Constraint | OwnerGate trigger |
| --- | --- | --- |
| Credentials and secrets | `<rule>` | `<when to stop>` |
| Data handling | `<rule>` | `<when to stop>` |
| External services | `<rule>` | `<when to stop>` |
| Migrations or destructive actions | `<rule>` | `<when to stop>` |
| Release or deployment | `<rule>` | `<when to stop>` |

## 6. Verification Constraints

- Required technical checks: `<test/build/lint/typecheck/manual checks or Unknown>`
- Required Owner-facing checks: `<business or experience acceptance focus>`
- Known unverified areas: `<items or none>`

## 7. Approved Exceptions

| Date | Exception | Reason | Approved by | Expiration or revisit condition |
| --- | --- | --- | --- | --- |
| `<date>` | `<exception>` | `<reason>` | `<Owner or authority>` | `<condition>` |
