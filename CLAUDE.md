# Stock Tracking Service

Universal standards for everyone working in this repo. This file is **project-level** and
version-controlled, so every teammate gets it on clone/pull. (Personal preferences belong in your
own `~/.claude/CLAUDE.md`, which is NOT shared.)

## Coding standards
- React components: functional style with hooks.
- API handlers: async/await with the shared error-handling middleware in `src/api/_middleware.ts`.
- Database models: repository pattern (no raw queries outside `src/db/repositories/`).

## Always
- Run `npm run typecheck` and `npm test` before declaring a change done.
- Prefer editing existing modules over adding new ones.

## Modular imports
Detailed, domain-specific standards are imported so this file stays small:

@import ./docs/standards/security.md
@import ./docs/standards/logging.md

> Path-specific conventions (testing, API) are NOT imported here — they live in `.claude/rules/`
> with glob `paths:` so they load only when you edit matching files.

## Available Commands
- `/review` - Run team code review checklist on changes