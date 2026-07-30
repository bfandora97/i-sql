# CLAUDE.md — build context

Guidance for Claude Code when working in this repo.

## What this is

A static, in-browser SQL practice app (HackerRank-style), branded "SQL
Practice Console" (by **bobbifndr**), built on the "SQL with Baraa" course
curriculum, using an FHI/FHTB exhibition-registration dataset. SQLite runs
client-side via sql.js (WASM). No build tooling, no framework — plain
HTML/CSS/JS served as static files, deployed on GitHub Pages
(**https://bfandora97.github.io/i-sql/**). Login is backed by Supabase (see
"Auth" below) — the one deliberate exception to "no backend," since that's
not achievable from a pure static site. Everything else stays vanilla.

The GitHub repo (`bfandora97/i-sql`) is public but the app itself sits
behind a login wall (see Auth section) — treat the two as separate: public
source code, gated usage.

## Golden rules

- **No build tooling / no frameworks.** Keep it vanilla. Files load as classic
  `<script>` tags in `index.html`, in this order: sql.js (CDN) → supabase-js
  (CDN) → `supabase-config.js` → `auth.js` → `data.js` → `curriculum.js` →
  `problems.js` → `utils.js` → `ui.js` → `grader.js` → `progress.js` →
  `app.js`. Top-level `const`s/functions are shared globals across these
  scripts (no bundler, no modules); `app.js` loads last since it's the only
  one that calls functions defined in the others and kicks off `boot()`.
- **Don't fake results.** All grading runs real SQL through sql.js.
- **Match the existing visual style.** Palette, fonts, and component classes
  are defined in `css/styles.css` (dark indigo, gold accent, IBM Plex Mono /
  Space Grotesk). Reuse existing classes rather than inventing new patterns.
- **Engine is SQLite**, not SQL Server. Use `LIMIT`, `LENGTH`, `SUBSTR`, `||`,
  `strftime()`. When a course topic is T-SQL-only, surface it as a note, not a
  gradable problem (see `engine` flags in `curriculum.js`). SQLite also lacks
  `ANY`/`ALL` — see `subquery-05` in `problems.js` for the `MIN`/`MAX`
  workaround pattern.
- **DDL/DML/Views/CTAS grading pattern:** these don't return a result set on
  their own, so their `solution` (and the expected user submission) is two
  statements separated by `;` — the mutation, then a verifying `SELECT` as the
  *last* statement. `gridOf()` in `app.js` picks up only the final statement's
  result set, so this needed no engine changes.
- **Before pushing any UI/JS change:** actually load the page locally
  (`python -m http.server` + Playwright, or ask the user to check) and take a
  screenshot. This session has repeatedly shipped CSS changes that looked
  right in theory but broke in practice (phantom heights, clipped dropdowns,
  un-stretched flex children) — always verify with real measurements
  (`getBoundingClientRect()`, `scrollHeight` vs `innerHeight`) before telling
  the user it's fixed.

## File map

| File | Purpose |
|------|---------|
| `index.html` | container hooks with ids; nav/schema/results injected by JS |
| `css/styles.css` | full design system |
| `js/supabase-config.js` | `SUPABASE_URL` + publishable key (safe to be public — RLS-gated) |
| `js/auth.js` | Supabase client, email/password login/signup/logout UI (avatar + dropdown), `initAuth()`, `window.onAuthChange` hook |
| `js/data.js` | `DATA_SQL` — `registrations` (30 rows) + `exhibitors` (12 rows, for the joins module) |
| `js/curriculum.js` | `CURRICULUM` array = course modules → topics + `engine` flag (order matches the "SQL with Baraa" course) |
| `js/problems.js` | `SCHEMA` + `PROBLEM_BANK` — 93 problems across all 20 practiceable modules |
| `js/utils.js` | `$` / `esc` — shared by every script below, must load first |
| `js/ui.js` | schema table, nav accordion, `selectProblem`, `syncSidebarHeight`, result/verdict rendering, editor auto-uppercase + column suggestions |
| `js/grader.js` | `runQuery`, `gridOf`, `judge` |
| `js/progress.js` | `loadProgress`/`saveProgress`/`resetProgress`/`refreshProgress` (Supabase + localStorage) |
| `js/app.js` | shared state vars (`db`, `current`, `solved`, `displayNum`), `boot()`, toolbar/editor event wiring — entry point, loads last |
| `data/supabase_setup.sql` | one-time SQL to run in the Supabase SQL Editor (creates `solved_problems` + RLS policies) |
| `data/registrations.csv` / `.sql` | source dump the dummy dataset in `data.js` was built from |

## Layout architecture (this changed a lot — read before touching CSS)

- **Badge header** (`.badge`): title + subtitle only. The auth bar
  (`#authbar`, avatar + dropdown) is a **sibling** of `.badge`, absolutely
  positioned in its top-right corner — it must NOT be nested inside `.badge`,
  because `.badge{overflow:hidden}` clips the dropdown if it's a descendant.
- **Materi bar** (`.materibar` / `#navToggleBtn.materibtn`): a single button,
  same width as the sidebar (340px), containing "☰ Materi" + the "N/93 Soal
  Lolos" stat stacked inside it. Sits above `.layout`, spanning neither
  column — it's its own row.
- **`.layout`** (`#app`): flex row, two children:
  - **`.sidebar`** (`#sidebar`): width animates `0 → 340px` via `.open`
    class. **Must also cap `max-height` (0 when closed, `none` when open)** —
    without it, the child `.fullnav`'s own height still gets measured by the
    flex layout even at `width:0`, silently inflating the whole row and
    pushing the footer off-screen. This bit twice already; don't remove the
    `max-height:0` default.
  - **`.maincol`**: the current-question + editor card. Sizes to its own
    content (deliberately *not* stretched to fill the viewport — that was
    tried and reverted because it left a huge dead-space gap under short
    questions).
  - `syncSidebarHeight()` in `app.js` measures `.maincol .card`'s real
    rendered height and sets `.fullnav`'s `max-height` to match exactly, so
    the two columns always end at the same line, with the nav scrolling
    internally (gold, 14px-wide scrollbar — was widened after the default
    thin one was hard to grab) if its content is taller. Called after
    `selectProblem()`, after `runQuery()`, on toggle click, and on window
    resize — if you add anything that changes the card's height, call it
    again there too.
  - Sidebar **opens by default** on load (`boot()` in `app.js` adds `.open`
    before the first `buildNav()`).
- **Nav chips** (`buildNav()`): grouped by topic (sub-bab) under each
  module's `<details>` (bab), one module open at a time (accordion via a
  `toggle` listener that closes siblings). Chip label is `Q<n> — <title>`,
  where `<n>` is **display order** (topic order), not the problem's array
  index — both the chip and the question title (`selectProblem()`) read from
  a shared `displayNum` map built in `buildNav()` so the numbers always
  agree. A green circle + checkmark (`.chip.solved`) marks completed
  problems, Coursera-style.
- **Schema** is a popup modal (`#schemaModal`), opened via the "📋 Skema
  Tabel" button in the editor toolbar — not inline in the sidebar anymore
  (it made the sidebar too long).
- **Editor** (`#ed`, plain `<textarea>` — deliberately not contenteditable,
  see below): has SQL-keyword auto-uppercase and column/table name
  suggestions (chips below the textarea, click to insert). "Soal Berikutnya
  →" button advances to the next problem in the same display order as the
  nav (`getOrderedProblems()`/`goToNextProblem()`).
- **Bold/colored keyword highlighting was explicitly rejected** by the user
  — a `<textarea>` can't render rich text, and switching to `contenteditable`
  was judged too risky (cursor-position bugs) for the payoff. Don't
  reintroduce this without checking first.

## Auth (Supabase) — now **mandatory**, not optional

- The app is gated: `boot()` shows `#authgate` ("Silakan masuk atau daftar
  dulu…") instead of loading the SQL engine until a Supabase session exists.
  This was a deliberate change from an earlier "guest mode" design — don't
  reintroduce a skip-login path without being asked.
- Any sign-in/sign-out triggers `window.onAuthChange = () => location.reload()`
  — simplest way to keep gate/app state correct, at the cost of a full
  reload on auth changes.
- Progress (`solved_problems` table, RLS-scoped by `auth.uid()`) is the only
  persistence now that guests can't reach the app; `data/supabase_setup.sql`
  must be run once per Supabase project.
- Supabase free-tier gotchas hit repeatedly this session: the default email
  sender has a **very low rate limit** (expect "email rate limit exceeded"
  during testing), and new signups require email confirmation by default —
  the user turned this off (Authentication → Sign In / Providers → **Confirm
  email** toggle) so signup logs straight in. If testing auth, prefer that
  toggle stays off, and avoid creating many throwaway signups in a short
  window (hits the rate limit fast).
- The publishable key in `supabase-config.js` is meant to be public; it only
  grants what RLS allows. Never put the `service_role` key or DB password
  anywhere in this repo.

## Manual test checklist

- App loads → shows the login gate (not the console) if signed out.
- Sign up / log in → gate disappears, loader runs, sidebar open by default,
  first problem auto-selected.
- Every problem: correct solution → green verdict + counter increments;
  wrong column count / row count / order → the matching specific message.
- Sidebar toggle: closing/reopening keeps heights in sync with the question
  card; scrollbar (gold, wide) works via wheel and drag.
- Editor: typing a lowercase keyword + space/comma auto-uppercases it; typing
  2+ chars of a column name shows suggestion chips.
- "Soal Berikutnya" advances in the same order shown in the nav.
- Reload persists solved state via Supabase; "Reset progress" clears it.
- Works opened via `python -m http.server` and on GitHub Pages (build status
  can be checked/forced via `gh api repos/bfandora97/i-sql/pages/builds/latest`
  and `gh api -X POST repos/bfandora97/i-sql/pages/builds` — the auto-trigger
  on push has silently failed to fire at least once this session).
