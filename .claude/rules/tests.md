---
name: test-standards
description: Testing conventions for this project
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "__tests__/**/*.ts"
---

## Test Standards

### Naming
- Test files: `*.test.ts` or `*.spec.ts`
- Location: next to source file OR in `__tests__/` directory
- Use descriptive test names: `it('should return 404 when stock not found')`

### Structure
```typescript
describe('UnitName', () => {
  beforeEach(() => { /* setup */ });
  
  describe('methodName', () => {
    it('should do X when Y', () => { /* test */ });
    it('should throw error when Z', () => { /* test */ });
  });
});
```

### Best Practices
- One assertion concept per test
- Use `beforeEach` for common setup
- Clean up state between tests
- Mock external dependencies
