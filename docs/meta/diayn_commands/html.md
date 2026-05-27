# `/diayn-html`
## Role

Controller Session or Owner-support session authorized by the Controller.

## User Input Scenario

Decision aid:

```text
/diayn-html
"<decision topic or options to explain>"
```

Report explanation:

```text
/diayn-html
"<agent report to explain or source path>"
```

## Preconditions

- The user actively requested HTML.
- The source decision, report, or context is available.
- The output path or delivery format is clear enough.

## Required Reading

- User request.
- Source report, decision topic, Owner question, or relevant project docs.
- Current status and evidence documents needed to avoid misleading the Owner.

## Allowed Writes

- HTML aid or report explanation at an explicitly chosen path.
- A short pointer from the active Owner question or report record when appropriate.

## Forbidden

- Do not generate long decision HTML by default.
- Do not treat generated HTML as the decision authority.
- Do not replace Owner decisions with a visual artifact.
- Do not write project facts that were not in the source documents.

## Status Changes

- Usually none.
- If the HTML leads to an Owner decision, record that decision in the appropriate active document after the Owner replies.

## Required Records

- Source documents used.
- Output artifact path, if written.
- Follow-up choices or feedback prompt for the user.

## Stop Conditions

- The user did not request HTML.
- Source facts are missing or contradictory.
- The task would require designing the full Owner UX framework beyond command semantics.

## Success Output

Report:

- What the HTML explains.
- Source documents.
- Output path.
- Fast feedback options for the Owner.

Identity mismatch output: `../diayn_command_reference.md#2-common-identity-mismatch-output`.

## Identity Mismatch Behavior

Use the common Session Identity Guard behavior and mismatch output defined in `../diayn_command_reference.md#2-common-identity-mismatch-output`. Stop rather than continuing whenever role, lane, path, manifest, local identity, requested command, or write boundary do not match this command.
