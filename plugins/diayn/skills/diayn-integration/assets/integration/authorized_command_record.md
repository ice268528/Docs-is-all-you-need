# Authorized Command Record

Stage: `<stage_id>`
Purpose: `<dependency_install/dev_server/background_process/database/external_service/integration_check>`

| Field | Value |
| --- | --- |
| Working directory | `<path>` |
| Shell/platform | `<PowerShell/Bash/cmd/other>` |
| Command | `<copyable_command>` |
| Authorization required | `<yes/no>` |
| Authorization result | `<approved/denied/not_requested>` |
| Background process | `<yes/no>` |
| Cleanup or stop command | `<command_or_none>` |

Do not claim the command ran when authorization was denied or the environment did not execute it.
