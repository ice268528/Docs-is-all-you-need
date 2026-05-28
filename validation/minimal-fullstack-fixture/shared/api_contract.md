# Minimal Fixture API Contract

This contract is controlled fixture material, not core DIAYN protocol.

## Register

`POST /api/register`

Request:

```json
{"email":"owner@example.test","password":"secret123"}
```

Success:

- Status: `201`
- Body: `{"ok":true,"user":{"id":1,"email":"owner@example.test"}}`

Errors:

- `400 invalid_input`
- `409 email_exists`

## Login

`POST /api/login`

Request:

```json
{"email":"owner@example.test","password":"secret123"}
```

Success:

- Status: `200`
- Body: `{"ok":true,"user":{"id":1,"email":"owner@example.test"}}`

Errors:

- `401 invalid_credentials`

## Frontend Contract

The frontend must:

- render a visible email field;
- render a visible password field;
- provide Register and Log in actions;
- show success or error status text from the API result.
