---
paths: ["**/*.test.ts", "**/*.test.tsx"]
---

# Testing conventions

These conventions load ONLY when editing a test file, regardless of which directory it lives in.
Test files sit next to the code they test (`Button.test.tsx` beside `Button.tsx`), spread throughout
the codebase — a glob path-rule applies them everywhere; a directory-level CLAUDE.md could not.

- Use Vitest with `describe`/`it`.
- One behavior per `it`; name it "should ... when ...".
- Cover the happy path, at least one edge case, and one failure case.
- Use the shared fixtures in `test/fixtures/`; do not hand-roll mock data.
- No snapshot tests for logic — assert on concrete values.