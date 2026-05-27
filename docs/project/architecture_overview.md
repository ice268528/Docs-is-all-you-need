---
document_role: "Project architecture overview"
primary_writer: "Owner or Controller with authorization"
audience:
  - "Owner"
  - "Controller Session"
  - "Worker Session"
  - "Review Session"
permission: "Owner controlled"
---

# Architecture Overview

This file answers the cold-start question: "How is it organized?" at the
system-architecture level. It records durable architecture facts and boundaries.
It is not a stage plan, lane board, or implementation worklog.

## 1. Scope And Reading Order

| Field | Value |
| --- | --- |
| Covered system or module | `<system_or_module>` |
| Current baseline | `<branch / commit / version / Unknown>` |
| Read first | `docs/project/project_brief.md`, `docs/project/implementation_constraints.md` |
| Not defined here | Stage tasks, lane task slices, bug fixes, temporary TODO items |

## 2. System Context

| Actor or external system | Type | Role | Boundary |
| --- | --- | --- | --- |
| `<actor_or_system>` | `<user / service / system>` | `<role>` | `<interaction boundary>` |

Optional diagram placeholder:

```text
<ASCII or Mermaid context diagram>
```

## 3. Core Modules

| Module or subsystem | Responsibility | Inputs | Outputs | Dependencies |
| --- | --- | --- | --- | --- |
| `<module>` | `<responsibility>` | `<inputs>` | `<outputs>` | `<dependencies>` |

## 4. Key Flows

| Flow ID | Start | Steps | End state | Failure or fallback |
| --- | --- | --- | --- | --- |
| `FLOW-001` | `<start>` | `<summary>` | `<end state>` | `<fallback>` |

## 5. Lane Boundaries

| Lane | Owns | Must not change silently | Shared dependencies |
| --- | --- | --- | --- |
| `backend` | `<backend responsibilities>` | `<frontend/shared/project constraints>` | `<contracts/types/issues>` |
| `frontend` | `<frontend responsibilities>` | `<backend/shared/project constraints>` | `<contracts/types/issues>` |

## 6. Shared Contracts And Data

| Contract or type | Path | Owner | Affected lanes |
| --- | --- | --- | --- |
| `<contract>` | `<docs/shared/...>` | `<Controller / Owner>` | `<lanes>` |

## 7. Architecture Decisions

| Decision | Rationale | Tradeoff | Related docs |
| --- | --- | --- | --- |
| `<decision>` | `<why>` | `<cost or constraint>` | `<paths>` |

## 8. Risks And Open Questions

| Item | Impact | OwnerGate needed? | Target document |
| --- | --- | --- | --- |
| `<risk_or_question>` | `<impact>` | `<yes/no>` | `<path>` |
