---
name: analyze-codebase
description: Map a subsystem's structure, dependencies, and entry points, returning a concise summary.
context: fork
allowed-tools: [Read, Grep, Glob]
argument-hint: "<subsystem path, e.g. src/api>"
---

# Analyze codebase

Explore the subsystem at `$1` and produce a SUMMARY (not a file dump):
- entry points and public exports
- internal dependency graph (who imports whom)
- external dependencies
- the 3–5 highest-impact files

## Why this frontmatter

- **`context: fork`** — this skill produces verbose discovery output. Forking runs it in an isolated
  sub-agent context so only the summary returns to the main conversation; the raw exploration doesn't
  pollute the main context window.
- **`allowed-tools: [Read, Grep, Glob]`** — read-only. The skill cannot Write/Edit/Bash, so it can't
  make destructive changes during analysis. This is tool restriction for safety.
- **`argument-hint`** — if a developer runs the skill without a path, they're prompted for the
  required `<subsystem path>` argument.

## Skill vs CLAUDE.md (exam distinction)

This is a **skill**: on-demand, task-specific, invoked when you need it. Universal standards that
should *always* apply belong in **CLAUDE.md** instead.