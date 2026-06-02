# DIAYN-Managed Dependency Skills

This directory carries the locked third-party `agent-skills` dependency payload for DIAYN packaging, including upstream skill folders, referenced checklist files, and license attribution.

The dependency skills are implementation dependencies. They are not additional public DIAYN commands. The public DIAYN surface remains exactly the 12 `/diayn-*` workflow skills under `../skills/`.

Normal routing should use platform-native nested skill invocation or an equivalent native skill tool call against the DIAYN-managed locked dependency copy after installation/registration. Reading these `SKILL.md` files directly is fallback/reference behavior only and does not count as native third-party composition evidence.

Provenance and selection rules live in:

```text
manifest.json
../../../vendor.lock.md
```
