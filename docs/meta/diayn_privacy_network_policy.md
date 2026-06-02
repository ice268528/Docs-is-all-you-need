# DIAYN Privacy And Network Policy

DIAYN is document-driven and local-first. Project code, documents, logs, prompts, evidence, telemetry, identifiers, credentials, and private user data are not uploaded by default.

## Default Rules

- Do not upload project content or telemetry unless the Owner explicitly approves the destination, purpose, and scope.
- Do not write secrets, tokens, credentials, private keys, `.env` values, or private user data into DIAYN docs, evidence, HTML, prompts, or logs.
- Record environment variable names and placeholders only.
- Treat paid external-service calls, remote logging, telemetry, uploads, production-like databases, destructive storage changes, and real user data as OwnerGate actions.
- When an action needs platform permission or network access, request authorization at the moment of impact.
- If authorization is denied or unavailable, provide a copyable command or report the limitation. Do not claim completion.

## Project Policy

`/diayn-init` creates or refreshes `.diayn/network_policy.md` so target projects can record approved exceptions without storing secret values.

## HTML Boundary

`/diayn-html` excludes secrets, private logs, raw prompts, and unnecessary implementation internals. HTML is an Owner-facing explanation aid, not a data-export mechanism.
