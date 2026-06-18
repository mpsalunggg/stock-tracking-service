# Lab 2 — Konfigurasi Claude Code untuk Tim

Panduan ini memandu kamu memahami setiap konsep Domain 3 melalui konfigurasi nyata di project ini.

---

## 1. CLAUDE.md: Project-Level vs User-Level

### Konsep Dasar

| Aspek | Project-level (`./CLAUDE.md`) | User-level (`~/.claude/CLAUDE.md`) |
|-------|-------------------------------|-------------------------------------|
| Lokasi | Di dalam repo | Di home directory |
| Version control | Ya — shared ke semua tim | Tidak — personal only |
| Scope | Setiap teammate dapat di-clone | Hanya untuk kamu |
| Load | Selalu loaded saat masuk project | Selalu loaded di semua project |

### Perbedaan Kritis

**CLAUDE.md project-level** = standar tim yang harus diikuti semua orang. Contoh di project ini:

```markdown
## Always
- Run `npm run typecheck` and `npm test` before declaring a change done.
- Prefer editing existing modules over adding new ones.
```

**~/.claude/CLAUDE.md** = preferensi personal yang TIDAK di-commit. Contoh: theme favorit, model preference, dll.

### Bug Umum di Exam

> ❌ **SALAH**: Menaruh standar tim di `~/.claude/CLAUDE.md`
> 
> ✅ **BENAR**: Standar tim di `./CLAUDE.md` (project-level)

### Modular dengan @import

CLAUDE.md project-level menggunakan `@import` agar tetap kecil dan modular:

```markdown
@import ./docs/standards/security.md
@import ./docs/standards/logging.md
```

Ini mencegah CLAUDE.md menjadi monolith dan memudahkan maintenance.

---

## 2. Path-Scoped Rules (.claude/rules/)

### Konsep: YAML Frontmatter dengan Glob Patterns

File di `.claude/rules/` hanya di-load saat mengedit file yang matching dengan glob pattern-nya.

### Contoh Struktur

```
.claude/
  rules/
    tests.md       # frontmatter: paths: ["**/*.test.*", "**/*.spec.*"]
    api-handler.md # frontmatter: paths: ["src/api/**/*.ts"]
    react.md       # frontmatter: paths: ["src/**/*.tsx", "src/**/*.ts"]
```

### Frontmatter Example

```yaml
---
name: test-conventions
description: Standards for test files
paths:
  - "**/*.test.*"
  - "**/*.spec.*"
---
```

### Kapan Pakai Rules vs Directory-level CLAUDE.md?

| Skenario | Solusi |
|----------|--------|
| Konvensi untuk file test yang tersebar di banyak directory | **Path-scoped rules** ✅ |
| Standar untuk semua file di satu directory | Directory-level CLAUDE.md |
| Standar universal untuk semua file | CLAUDE.md project-level |

**Keuntungan path-scoped rules**: Rule hanya muncul saat relevant → lebih sedikit noise, lebih sedikit token.

---

## 3. Project-Scoped Slash Commands (.claude/commands/)

### Konsep

Slash command yang di-commit ke repo akan tersedia untuk seluruh tim.

### Lokasi

| Type | Lokasi |
|------|--------|
| Project-scoped | `.claude/commands/` ✅ (dalam repo) |
| User-level | `~/.claude/commands/` ❌ (personal) |

### Contoh di Project Ini

File `.claude/commands/review.md` mendefinisikan command `/review` yang menjalankan checklist review standar tim.

### Struktur Slash Command

```markdown
# /review

<systemaddin>
description: Run team standard code review checklist
examples:
  - description: Review current changes
    arguments: ""
```

---

## 4. Skills (.claude/skills/)

### Konsep: On-Demand, Task-Specific

Berbeda dengan CLAUDE.md yang selalu loaded, skills dipanggil saat needed.

### Konfigurasi Penting

#### context: fork

```yaml
context: fork
```

Menjalankan skill di sub-agent terisolasi → output verbose tidak pollute conversation utama.

#### allowed-tools

```yaml
allowed-tools:
  - Read
  - glob
  - grep
```

Membatasi tool access selama skill berjalan. Di contoh ini: read-only, tidak ada destructive operations.

#### argument-hint

```yaml
argument-hint: <subsystem>
```

Meminta developer untuk input saat skill dipanggil tanpa argument.

### Perbandingan

| Aspek | CLAUDE.md | Skills |
|-------|-----------|--------|
| Load time | Selalu loaded | On-demand |
| Scope | Universal standards | Task-specific |
| Context isolation | Main conversation | Forked sub-agent |
| Tool restrictions | Tidak ada | allowed-tools |

---

## 5. MCP Server Configuration (.mcp.json)

### Konsep: Project-Level MCP Servers

File `.mcp.json` mendefinisikan MCP servers yang di-share ke seluruh tim via VCS.

### Struktur

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${DATABASE_URL}"]
    }
  }
}
```

### Env-Var Credential Expansion

```json
"env": {
  "GITHUB_TOKEN": "${GITHUB_TOKEN}"
}
```

`${GITHUB_TOKEN}` di-expand dari environment variable saat runtime → tidak ada secrets di-commit.

### Lokasi MCP Servers

| Type | Lokasi | Credential |
|------|--------|------------|
| Project-level | `.mcp.json` | ${ENV_VAR} expansion ✅ |
| User-level | `~/.claude.json` | Personal/experimental |

### Tools dari Semua Server

Semua tools dari semua configured servers tersedia bersamaan saat connection time — tidak perlu pilih satu server.

---

## 6. Plan Mode vs Direct Execution

### Decision Framework

| Task | Mode | Alasan |
|------|------|--------|
| Bug fix single file dengan stack trace jelas | **Direct** ✅ | Langsung bisa kerjakan |
| Migrasi library ke 45 files | **Plan** dulu, lalu direct | Perlu investigasi, banyak file |
| Feature baru dengan multiple architectures | **Plan** ✅ | Architectural decision |

### Cara Coba

1. **Direct execution**: Fix typo atau bug kecil → langsung eksekusi
2. **Plan mode**: `/plan` untuk investigasi → approve plan → execute
3. **Plan mode**: `/plan` untuk architectural decision → compare options

---

## Checklist Pemahaman

- [ ] CLAUDE.md di project-level, version-controlled, selalu loaded untuk semua teammate
- [ ] Path-scoped rules dengan glob patterns hanya load saat relevant
- [ ] Slash command di `.claude/commands/` di-share via VCS
- [ ] Skills menggunakan `context: fork`, `allowed-tools`, `argument-hint`
- [ ] `.mcp.json` menggunakan `${ENV_VAR}` expansion untuk credentials
- [ ] Plan mode untuk investigation/architectural decisions, direct untuk well-scoped fixes

---

## Referensi File di Project Ini

| File | Fungsi |
|------|--------|
| `./CLAUDE.md` | Project-level universal standards |
| `./.claude/rules/` | Path-scoped rules |
| `./.claude/commands/` | Project-scoped slash commands |
| `./.claude/skills/` | On-demand skills |
| `./.mcp.json` | Project-level MCP servers |
| `./docs/standards/` | Modular imports untuk CLAUDE.md |
