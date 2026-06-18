---
description: Run the team's standard code-review checklist on the current diff.
argument-hint: "[base-branch] (defaults to main)"
---

Review the diff against `${1:-main}` using our checklist. Report findings as
`file:line — severity — issue — suggested fix`.

Check for:
1. Correctness bugs (logic errors, off-by-one, null handling, async race conditions).
2. API handlers: missing `withErrorHandling()` wrap or missing Zod validation.
3. Tests: are happy path, an edge case, and a failure case all covered?
4. Repository pattern violations (raw queries outside `src/db/repositories/`).

Report ONLY bugs and security issues. Skip minor style — the linter owns that. Use explicit criteria,
not "be conservative". If unsure whether something is a real issue, state your uncertainty rather
than flagging it as definite.

> This command lives in `.claude/commands/` (project-scoped) so it's shared via version control and
> available to every developer. A personal variant would go in `~/.claude/commands/`.