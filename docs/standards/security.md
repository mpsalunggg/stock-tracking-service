# Security Standards

## Input Validation
- Validate all user inputs at API boundary
- Sanitize data before storage
- Use parameterized queries (prepared statements) in production

## API Security
- Never expose sensitive data in error messages
- Log security events (auth failures, suspicious activity)
- Rate limit endpoints where appropriate

## Secrets Management
- Never commit secrets to version control
- Use environment variables for sensitive configuration
- MCP servers use `${ENV_VAR}` expansion pattern
