# Logging Standards

## Log Levels
- **ERROR**: Failures that need immediate attention
- **WARN**: Potential issues, degraded functionality
- **INFO**: Significant events (server start, successful operations)
- **DEBUG**: Detailed troubleshooting info (development only)

## Structured Logging
Use JSON format for production logs:
```typescript
console.log(JSON.stringify({
  level: 'info',
  message: 'Request processed',
  timestamp: new Date().toISOString(),
  requestId: req.id,
}));
```

## What to Log
- Server startup/shutdown
- API request/response (without sensitive data)
- Database operations (queries, errors)
- Authentication events

## What NOT to Log
- Passwords or tokens
- Full request bodies with PII
- Stack traces in production (use error tracking service)
