# DIAYN Failure Classification

Use these classes before routing review or integration failures:

| Class | Meaning | Default routing |
| --- | --- | --- |
| `implementation_failure` | Confirmed violation of requirements, scope, contract, or expected behavior | Reject to responsible lane |
| `blocked` | Work cannot continue without a decision or dependency | Controller or OwnerGate |
| `environment_missing` | Required local dependency, runtime, secret placeholder, database, or service is absent | Environment setup or OwnerGate |
| `external_service_unavailable` | External system is unavailable or unreliable | Retry, mock strategy, or OwnerGate |
| `flaky_or_timeout` | Evidence is unstable or timed out | Rerun or gather stronger evidence |
| `inconclusive_evidence` | Current evidence cannot prove pass/fail | Request more evidence |

Do not reject implementation solely because the environment is missing or evidence is inconclusive.
