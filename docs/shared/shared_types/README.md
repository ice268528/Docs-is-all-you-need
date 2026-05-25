# Shared Types

This directory is for shared type definitions, schemas, or data model notes that must be visible to multiple lanes.

Use this directory only when the type or schema affects more than one lane. Lane-local implementation details belong in the relevant lane or code-adjacent documentation.

When a shared type changes, the Controller should ensure all affected lane boards and handoff packets reference the updated source.

