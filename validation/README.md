# Validation Evidence

This directory contains committed, sanitized validation evidence for DIAYN V1.
It is part of the repository because the release/support claims are evidence
driven, not chat driven.

Committed files may include:

- machine-readable release gates and phase validation JSON;
- controlled fixtures used by validators;
- static Owner-facing validation artifacts that contain no local machine paths,
  secrets, or private runtime state.

Do not commit:

- local scratch output under `validation/tmp/`;
- real Codex Desktop runtime captures under `validation/codex-runtime-evidence/`;
- unsanitized files containing local absolute paths, secrets, tokens, API keys,
  database credentials, or private project data;
- one-off debug logs that are not referenced by a validator, audit, or release
  gate.

When a new validation artifact is promoted into this directory, it should be
reproducible from a maintainer script or clearly referenced by a release audit.
