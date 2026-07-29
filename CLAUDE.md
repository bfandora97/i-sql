# CLAUDE.md — build context

Guidance for Claude Code when working in this repo.

## What this is

A static, in-browser SQL practice app (HackerRank-style) for the **SQL with
Baraa** course, using an FHI/FHTB exhibition-registration dataset. SQLite runs
client-side via sql.js (WASM). No backend, no bundler, no framework — plain
HTML/CSS/JS served as static files.

## Golden rules

- **No build tooling / no frameworks.** Keep it vanilla. Files load as classic
  `<script>` tags in `index.html` in this order: sql.js → `data.js` →
  `curriculum.js` → `problems.js` → `app.js`. Top-level `const`s are shared
  across these scripts; don't convert to ES modules (must work over `file://`
  and GitHub Pages).
- **Don't fake results.** All grading runs real SQL through sql.js.
- **Match the existing visual style.** Palette, fonts, and component classes are
  defined in `css/styles.css` (dark indigo, gold accent, IBM Plex Mono / Space
  Grotesk). Reuse existing classes rather than inventing new patterns.
- **Engine is SQLite**, not SQL Server. Use `LIMIT`, `LENGTH`, `SUBSTR`, `||`,
  `strftime()`. When a course topic is T-SQL-only, surface it as a note, not a
  gradable problem (see `engine` flags in `curriculum.js`).

## File map

| File | State | Notes |
|------|-------|-------|
| `index.html` | done | container hooks with ids; nav is injected by JS |
| `css/styles.css` | done | full design system; classes: `.badge .card .chip .level .verdict .res` etc. |
| `js/data.js` | done | `DATA_SQL` (one `registrations` table, 30 rows) |
| `js/curriculum.js` | done | `CURRICULUM` array = course modules → topics + `engine` flag |
| `js/problems.js` | partial | `SCHEMA` + `PROBLEM_BANK` (keyed by module id). SELECT & filter seeded; rest are `[]` stubs |
| `js/app.js` | partial | boot, grader, result render, verdict, progress = done. `buildNav`, `selectProblem`, `runQuery`, `refreshProgress` = `// TODO` |

## Build order (do these first)

1. **`buildNav()`** in `app.js`: iterate `CURRICULUM`; per module render a header
   from `module.module`; for `PROBLEM_BANK[module.id]` render one `.chip` per
   problem (call `selectProblem(problem)` on click). For `engine:'tsql'|'concept'`
   modules show `module.note` as a muted "study only" line. Apply `.solved` to
   chips whose id is in `solved`.
2. **`selectProblem(problem)`**: set `current`, populate `#lvl` (class = level),
   `#ptitle` (`Q… title`), `#task`, `#hint`, `#keyq` (solution + `;`), reset
   editor/verdict/result, refresh chip active state.
3. **`runQuery()`**: follow the numbered spec already written in the function's
   comment. Reuse `gridOf`, `judge`, `renderResult`, `showVerdict`.
4. **`refreshProgress()`**: update `#solvedN`, fill `#strip` with a `.dot`
   (`.on` when solved) per problem, sync chip `.solved` classes.

## Then: content

- Fill the empty `PROBLEM_BANK` modules, 3–6 problems each, one+ per topic listed
  in `curriculum.js`. Copy the shape of the seeded `select`/`filter` entries.
- Good dataset hooks to exploit: duplicate registration (`Budi Santoso` appears
  twice) → window `ROW_NUMBER` dedup; NULL `company`/`job_title` → NULL module;
  mixed phone formats → string module; `reg_date` spread May–Jul → date module.
- Joins module needs a second table — add e.g. `exhibitors` or `sessions` to
  `data.js` before writing join problems, and extend the schema panel.

## Manual test checklist

- App loads (loader disappears, `#app` shows).
- Every seeded problem: correct solution → green verdict + counter increments;
  wrong column count / row count / order → the matching specific message.
- Reload persists solved state; "Reset progress" clears it.
- Works opened via `python3 -m http.server` and on GitHub Pages.
