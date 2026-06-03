# OpenCode Rules Plan Boundary

This file keeps the OpenCode work explicitly deferred for DDDV8.

Do not recreate the historical `.opencode/skills/diayn-controller` style
wrappers. They expose internal roles as installable-looking skills and conflict
with the current 12-command workflow-skill surface.

If OpenCode support is revisited later, the first requirement is evidence that
OpenCode can trigger installed DIAYN workflow skills through `/diayn-*` without
falling back to a role-wrapper model.
