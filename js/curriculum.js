// ===========================================================================
// CURRICULUM — mirrors the "SQL with Baraa" course structure.
// The app builds its left-nav from this: each module becomes a section,
// each topic a sub-group that problems in js/problems.js attach to via `topic`.
//
// engine        : "sqlite"  -> practiceable & auto-gradable in this browser app
//                 "tsql"    -> SQL Server-specific; study in SSMS, not gradable here
//                 "concept" -> mostly theory / no query practice
// Use the `engine` flag to decide where to invest in writing problems first.
// ===========================================================================
const CURRICULUM = [
  { id:'intro', module:'Introduction to SQL', engine:'concept',
    topics:['What is SQL','Databases & DBMS','SQL command families'] },

  { id:'select', module:'SELECT Queries', engine:'sqlite',
    topics:['SELECT & FROM','WHERE','ORDER BY','GROUP BY','HAVING','DISTINCT','TOP / LIMIT','Execution order'] },

  { id:'ddl', module:'Data Definition (DDL)', engine:'sqlite',
    topics:['CREATE','ALTER','DROP'],
    note:'Jalan di SQLite, tapi hasilnya ngubah struktur — bukan result-set, jadi grader-nya beda pola (cek skema, bukan baris).' },

  { id:'dml', module:'Data Manipulation (DML)', engine:'sqlite',
    topics:['INSERT','UPDATE','DELETE'],
    note:'Grade dengan cara: jalankan query user, lalu SELECT ulang tabel & bandingkan state-nya.' },

  { id:'filter', module:'Filtering Data', engine:'sqlite',
    topics:['Comparison Operators','AND','OR','NOT','BETWEEN','IN','LIKE'] },

  { id:'joins', module:'SQL Joins', engine:'sqlite',
    topics:['INNER JOIN','LEFT JOIN','RIGHT JOIN','FULL JOIN','LEFT ANTI','RIGHT ANTI','CROSS JOIN','Multiple joins'],
    note:'Butuh tabel kedua. Tambahkan tabel (mis. exhibitors / sessions) di js/data.js dulu.' },

  { id:'setops', module:'SET Operators', engine:'sqlite',
    topics:['UNION','UNION ALL','EXCEPT','INTERSECT'] },

  { id:'strings', module:'String Functions', engine:'sqlite',
    topics:['CONCAT','UPPER & LOWER','TRIM','REPLACE','LENGTH','SUBSTR / LEFT & RIGHT'],
    note:'Nama fungsi beda dari T-SQL: SQLite pakai LENGTH() bukan LEN(), SUBSTR() bukan SUBSTRING(), || untuk concat.' },

  { id:'numbers', module:'Number Functions', engine:'sqlite',
    topics:['Rounding Functions','Absolute Value Function'] },

  { id:'datetime', module:'Date & Time Functions', engine:'sqlite',
    topics:['strftime (DAY/MONTH/YEAR)','date() arithmetic','Date diff','Formatting'],
    note:'T-SQL DATEPART/DATENAME/DATEADD/EOMONTH tidak ada di SQLite. Padanannya: strftime() & date(). Materi Baraa versi SQL Server dipraktikkan di SSMS.' },

  { id:'nulls', module:'NULL Functions', engine:'sqlite',
    topics:['COALESCE','NULLIF','IS NULL / IS NOT NULL','IFNULL'],
    note:'ISNULL() (T-SQL) = IFNULL() di SQLite. COALESCE & NULLIF sama.' },

  { id:'case', module:'CASE WHEN', engine:'sqlite',
    topics:['Categorizing data','Mapping values','Handling NULLs'] },

  { id:'win_basics', module:'Window Functions — Basics', engine:'sqlite',
    topics:['OVER()','PARTITION BY','ORDER BY in window','Frame clause'] },

  { id:'win_agg', module:'Window Aggregate Functions', engine:'sqlite',
    topics:['COUNT/SUM/AVG OVER','MIN/MAX OVER','Running total','Moving average'] },

  { id:'win_rank', module:'Window Ranking Functions', engine:'sqlite',
    topics:['ROW_NUMBER','RANK','DENSE_RANK','NTILE','CUME_DIST','PERCENT_RANK','Find duplicates'] },

  { id:'win_val', module:'Window Value Functions', engine:'sqlite',
    topics:['LAG','LEAD','FIRST_VALUE','LAST_VALUE','Month-over-month'] },

  { id:'subquery', module:'Subqueries', engine:'sqlite',
    topics:['Subquery in FROM','Subquery in SELECT','Subquery in WHERE','IN','ANY / ALL','Correlated','EXISTS'] },

  { id:'cte', module:'Common Table Expressions (CTE)', engine:'sqlite',
    topics:['Standalone CTE','Multiple CTE','Nested CTE','Recursive CTE'] },

  { id:'views', module:'Views', engine:'sqlite',
    topics:['CREATE / DROP VIEW','Hide complexity','Central logic'] },

  { id:'ctas', module:'CTAS & TEMP Tables', engine:'sqlite',
    topics:['CREATE TABLE AS','TEMP tables','Snapshots'],
    note:'SQLite: CREATE TABLE ... AS SELECT, dan CREATE TEMP TABLE.' },

  { id:'procs', module:'Stored Procedures & Triggers', engine:'tsql',
    topics:['Parameters','Variables','IF/ELSE','TRY/CATCH','Triggers'],
    note:'Fitur SQL Server. Tidak ada di SQLite in-browser — praktik di SSMS. Simpan sebagai catatan/kode saja di app.' },

  { id:'indexes', module:'Indexes', engine:'tsql',
    topics:['Clustered','Non-clustered','Composite','Columnstore','Execution plan'],
    note:'Konsep + spesifik SQL Server. Praktik & baca execution plan di SSMS.' },

  { id:'partitions', module:'Partitions', engine:'tsql',
    topics:['Partitioned tables','Partition performance'],
    note:'SQL Server feature — study only di app.' },

  { id:'perf', module:'Performance Best Practices', engine:'concept',
    topics:['Fetching','Filtering','Joining','Aggregation','Indexing'] },

  { id:'ai_sql', module:'AI & SQL', engine:'concept',
    topics:['Solve a Task','Improve Readability','Optimize Performance','Debugging','Explain a Result','Styling & Formatting','Documentation'],
    note:'Materi terbaru dari course Baraa: prompt-prompt buat manfaatin AI (ChatGPT/Copilot/dll) bantu nulis, rapiin, optimasi, dan debug query SQL. Konsep/checklist, bukan soal gradable.' },

  // ---- Capstone projects (checklists, not auto-graded queries) ----
  { id:'proj_dwh', module:'Project — Data Warehouse', engine:'concept',
    topics:['Bronze / Silver / Gold','ETL','Naming conventions','Documentation'] },
  { id:'proj_eda', module:'Project — EDA', engine:'sqlite',
    topics:['Database exploration','Dimensions vs measures','Date range exploration','Magnitude analysis','Ranking analysis'] },
  { id:'proj_adv', module:'Project — Advanced Analytics', engine:'sqlite',
    topics:['Change over time','Cumulative analysis','Performance analysis','Part-to-whole','Segmentation','Customer & product reports'] },
  { id:'proj_fhtb2024', module:'Project — FHTB 2024 Report Analysis', engine:'sqlite',
    topics:['Attendee demographics','Exhibitor breakdown','Satisfaction metrics','Business matching funnel','Interest vs supply matching'],
    note:'Dataset baru: fhtb_attendees / fhtb_exhibitors / fhtb_meetings, dikalibrasi dari angka asli di FHTB-2024-Post-Show-Report.pdf (breakdown negara, job function, tingkat kepuasan, funnel business matching 564→429). Nama orang/perusahaan dummy, tapi persentase & totalnya real. Soal ditambah bertahap.' },
];
