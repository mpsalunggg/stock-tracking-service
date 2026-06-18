---
name: api-handler-standards
description: Standards for Express API handlers
paths:
  - "src/api/**/*.ts"
---

## API Handler Standards

### Structure
- Use `asyncHandler` wrapper for all async routes
- Return consistent `{ success, data, error }` response shape
- Handle errors at the route level with appropriate HTTP status codes

### HTTP Status Codes
- `200` - Successful GET, PATCH
- `201` - Successful POST (created)
- `204` - Successful DELETE (no content)
- `400` - Bad request (validation error)
- `404` - Resource not found
- `409` - Conflict (duplicate, etc.)
- `500` - Internal server error

### Validation
- Validate required fields before processing
- Return specific error messages for 400 errors
