# Shared Contracts

This directory is for contracts that more than one lane must follow.

Examples of contract categories:

- API contracts.
- Event contracts.
- Data shape contracts.
- Integration boundary contracts.

Contract files should use project-neutral placeholders until a real project instantiates them, such as `<contract_path>`, `<request_shape>`, `<response_shape>`, and `<verification_command>`.

Worker sessions must stop before changing confirmed contracts unless the Controller or Owner explicitly authorizes the change.

