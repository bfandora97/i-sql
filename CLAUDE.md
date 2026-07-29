# CLAUDE.md — build context

Guidance for Claude Code when working in this repo.

## What this is

A static, in-browser SQL practice app (HackerRank-style) for the **SQL with
Baraa** course, using an FHI/FHTB exhibition-registration dataset. SQLite runs
client-side via sql.js (WASM). No build tooling, no framework — plain
HTML/CSS/JS served as static files, deployed on GitHub Pages
(https://bfandora97.github.io/i-sql/). Login + cross-device progress sync is
backed by Supabase (see "Auth / progress sync" below) — the one deliberate
exception to "no backend," since that's not achievable from a pure static
site. Everything else stays vanilla.

## Golden rules

- **No build tooling / no frameworks.** Keep it vanilla. Files load as classic
  `<script>` tags in `index.html` in this order: sql.js → supabase-js →
  `supabase-config.js` → `auth.js` → `data.js` → `curriculum.js` →
  `problems.js` → `app.js`. Top-level `const`s are shared across these
  scripts; don't convert to ES modules (must work over `file://` and GitHub
  Pages).
- **Don't fake results.** All grading runs real SQL through sql.js.
- **Match the existing visual style.** Palette, fonts, and component classes are
  defined in `css/styles.css` (dark indigo, gold accent, IBM Plex Mono / Space
  Grotesk). Reuse existing classes rather than inventing new patterns.
- **Engine is SQLite**, not SQL Server. Use `LIMIT`, `LENGTH`, `SUBSTR`, `||`,
  `strftime()`. When a course topic is T-SQL-only, surface it as a note, not a
  gradable problem (see `engine` flags in `curriculum.js`). SQLite also lacks
  `ANY`/`ALL` — see `subquery-05` in `problems.js` for the `MIN`/`MAX`
  workaround pattern.
- **DDL/DML/Views/CTAS grading pattern:** these don't return a result set on
  their own, so their `solution` (and the expected user submission) is two
  statements separated by `;` — the mutation, then a verifying `SELECT` as the
  *last* statement. `gridOf()` in `app.js` already picks up only the final
  statement's result set, so this needed no engine changes.

## File map

| File | State | Notes |
|------|-------|-------|
| `index.html` | done | container hooks with ids; nav is injected by JS |
| `css/styles.css` | done | full design system; classes: `.badge .card .chip .level .verdict .res .authbar` etc. |
| `js/supabase-config.js` | done | `SUPABASE_URL` + publishable key (safe to be public — RLS-gated) |
| `js/auth.js` | done | Supabase client, email/password login/signup/logout UI, `initAuth()`, `window.onAuthChange` hook |
| `js/data.js` | done | `DATA_SQL` — `registrations` (30 rows) + `exhibitors` (12 rows, for the joins module) |
| `js/curriculum.js` | done | `CURRICULUM` array = course modules → topics + `engine` flag |
| `js/problems.js` | done | `SCHEMA` + `PROBLEM_BANK` — 93 problems across all 20 practiceable modules |
| `js/app.js` | done | boot (awaits auth then SQL engine), grader, nav, progress (Supabase when signed in, localStorage fallback for guests) |

## Auth / progress sync (Supabase)

- Login is **optional** — guests still get full localStorage-backed progress
  tracking exactly as before. Signing in switches `loadProgress`/
  `saveProgress`/`resetProgress` (`app.js`) to read/write the
  `solved_problems` table instead, scoped by `auth.uid()` via Row Level
  Security policies (defined in `data/supabase_setup.sql` — run once in the
  Supabase SQL Editor for any new project).
- On first login, any local guest progress is uploaded and merged into the
  cloud rows rather than discarded (`loadProgress()` in `app.js`).
- The publishable key in `supabase-config.js` is meant to be public; it only
  grants what RLS allows. Never put the `service_role` key or DB password
  anywhere in this repo.

## Manual test checklist

- App loads (loader disappears, `#app` shows), auth bar renders top-right.
- Every problem: correct solution → green verdict + counter increments; wrong
  column count / row count / order → the matching specific message.
- Guest (logged out): reload persists solved state via localStorage; "Reset
  progress" clears it.
- Signed in: solving a problem persists to Supabase (check the
  `solved_problems` table); logging in on a second browser/device shows the
  same solved set; "Reset progress" clears the cloud rows too.
- Works opened via `python3 -m http.server` and on GitHub Pages.
