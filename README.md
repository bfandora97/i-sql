# SQL Query Pass — FHI · FHTB

An interactive, browser-based SQL practice console. Write a query, hit **Run &
Cek**, and get graded instantly against a real exhibition-registration dataset.
Problems are organised to follow the **SQL with Baraa** course, module by module.

No backend, no build step — SQLite runs entirely in the browser via
[sql.js](https://github.com/sql-js/sql.js) (WebAssembly), so it deploys to
GitHub Pages as-is.

> **Status: scaffold.** The dataset, styling, grader, and the SELECT + Filtering
> problem sets are done. Navigation rendering, problem display, and the run
> handler are stubbed with `// TODO` markers in `js/app.js` — built out in VS Code.

## Features

- **In-browser SQLite** — every query runs for real; results aren't faked.
- **Auto-grading** — your result set is compared against a reference solution
  (order-sensitive when the task calls for it).
- **Course-aligned** — the problem bank mirrors the SQL with Baraa modules.
- **Domain data** — 30 realistic FHI 2026 / FHTB 2026 visitor registrations,
  complete with duplicate emails, mixed phone formats, and NULLs for later
  cleaning-focused topics.
- **Progress persistence** — solved problems are remembered via `localStorage`.

## Tech stack

Vanilla HTML / CSS / JS · sql.js (SQLite WASM) · zero dependencies · GitHub Pages.

## Project structure

```
sql-query-pass/
├── index.html          # markup + script includes (load order matters)
├── css/
│   └── styles.css       # all styling
├── js/
│   ├── data.js          # DATA_SQL — the dataset as CREATE + INSERTs
│   ├── curriculum.js    # course map (modules → topics) — drives the nav
│   ├── problems.js      # SCHEMA + PROBLEM_BANK keyed by module id
│   └── app.js           # engine: boot, nav, grader, run handler (has TODOs)
├── data/
│   ├── registrations.sql  # same dataset for SSMS / other engines
│   └── registrations.csv  # for BigQuery / Excel import
├── README.md
└── LICENSE
```

## Run locally

It's fully static. Either open `index.html` directly, or serve it (recommended,
avoids any file:// quirks):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit: SQL Query Pass scaffold"
git branch -M main
git remote add origin git@github.com:<your-username>/sql-query-pass.git
git push -u origin main
```

Then: repo **Settings → Pages → Build and deployment → Source: Deploy from a
branch → `main` / `root` → Save.** Live at
`https://<your-username>.github.io/sql-query-pass/`.

## How the problem bank maps to the course

`js/curriculum.js` lists every module with an `engine` flag:

- `sqlite` — practiceable and auto-gradable here (SELECT, filtering, joins,
  set ops, strings, dates, NULLs, CASE, window functions, subqueries, CTEs…).
- `tsql` — SQL Server-specific (stored procedures, indexes, partitions); study
  in SSMS, render as notes here.
- `concept` — theory only.

Add problems in `js/problems.js` under the matching module id. Each entry needs
`id, topic, level, title, task, hint, ordered, solution`. The grader executes
your `solution` and compares — so the answer key can't drift from the data.

Some function names differ from the course's T-SQL: SQLite uses `LIMIT` (not
`TOP`), `LENGTH` (not `LEN`), `SUBSTR` (not `SUBSTRING`), `||` for concatenation,
and `strftime()` for date parts. These are noted per module in `curriculum.js`.

## Roadmap

- [x] Dataset + schema
- [x] Grader + result rendering
- [x] SELECT & Filtering problems
- [ ] Build `buildNav()`, `selectProblem()`, `runQuery()` in `js/app.js`
- [ ] Problems for the remaining `sqlite` modules
- [ ] Second table (exhibitors / sessions) to unlock the Joins module
- [ ] Capstone project checklists (DWH / EDA / Advanced Analytics)

## License

MIT — see [LICENSE](LICENSE).
