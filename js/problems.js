// ===========================================================================
// SCHEMA — shown in the "Tabel" panel. Keep in sync with js/data.js.
// ===========================================================================
const SCHEMA = [
  ["registrations", "reg_id",           "INT",  "ID unik pendaftar"],
  ["registrations", "full_name",        "TEXT", "Nama lengkap"],
  ["registrations", "email",            "TEXT", "Email (ada yg duplikat)"],
  ["registrations", "phone",            "TEXT", "No. HP (format campur)"],
  ["registrations", "company",          "TEXT", "Perusahaan (ada NULL)"],
  ["registrations", "job_title",        "TEXT", "Jabatan (ada NULL)"],
  ["registrations", "city",             "TEXT", "Kota asal"],
  ["registrations", "event",            "TEXT", "'FHI 2026' / 'FHTB 2026'"],
  ["registrations", "reg_date",         "TEXT", "Tgl daftar YYYY-MM-DD"],
  ["registrations", "ticket_type",      "TEXT", "Visitor / Trade Visitor / VIP"],
  ["registrations", "product_interest", "TEXT", "Minat produk"],
  ["registrations", "checked_in",       "INT",  "1 = hadir, 0 = belum"],
  ["exhibitors",     "exhibitor_id",    "INT",  "ID unik exhibitor"],
  ["exhibitors",     "company",         "TEXT", "Nama perusahaan exhibitor (sebagian cocok dgn registrations.company)"],
  ["exhibitors",     "category",        "TEXT", "Kategori booth"],
  ["exhibitors",     "booth_no",        "TEXT", "Nomor booth"],
  ["exhibitors",     "event",           "TEXT", "'FHI 2026' / 'FHTB 2026'"],
  ["exhibitors",     "country",         "TEXT", "Negara asal exhibitor"],
  ["fhtb_attendees", "attendee_id",       "INT",  "ID unik attendee"],
  ["fhtb_attendees", "full_name",         "TEXT", "Nama lengkap (dummy)"],
  ["fhtb_attendees", "country",           "TEXT", "Negara asal — breakdown sesuai laporan asli"],
  ["fhtb_attendees", "job_function",      "TEXT", "Fungsi jabatan — persentase sesuai laporan asli"],
  ["fhtb_attendees", "business_activity", "TEXT", "Bidang usaha — persentase sesuai laporan asli"],
  ["fhtb_attendees", "product_interest",  "TEXT", "Kategori produk yang diminati"],
  ["fhtb_attendees", "reg_date",          "TEXT", "Tgl daftar YYYY-MM-DD (sebelum show 4-6 Mar 2024)"],
  ["fhtb_attendees", "attended",          "INT",  "1 = hadir di venue, 0 = daftar tapi no-show"],
  ["fhtb_attendees", "satisfied",         "INT",  "1 = puas (target agregat 82%)"],
  ["fhtb_attendees", "will_return_2026",  "INT",  "1 = akan hadir lagi 2026 (target 84%)"],
  ["fhtb_attendees", "would_recommend",   "INT",  "1 = akan merekomendasikan (target 85%)"],
  ["fhtb_exhibitors", "exhibitor_id",      "INT",  "ID unik exhibitor"],
  ["fhtb_exhibitors", "company_name",      "TEXT", "Nama perusahaan (dummy)"],
  ["fhtb_exhibitors", "country",           "TEXT", "Negara asal — 23 negara sesuai laporan asli"],
  ["fhtb_exhibitors", "product_category",  "TEXT", "Top 5 kategori produk sesuai laporan asli"],
  ["fhtb_exhibitors", "exhibitor_type",    "TEXT", "Manufacturer / Importer / Retailer / Agent / Principal"],
  ["fhtb_exhibitors", "booth_sqm",         "INT",  "Luas booth (m²)"],
  ["fhtb_exhibitors", "satisfied",         "INT",  "1 = puas (target agregat 87%)"],
  ["fhtb_exhibitors", "will_return_2026",  "INT",  "1 = akan exhibit lagi 2026 (target 85%)"],
  ["fhtb_exhibitors", "would_recommend",   "INT",  "1 = akan merekomendasikan (target 88%)"],
  ["fhtb_meetings",   "meeting_id",        "INT",  "ID unik business meeting"],
  ["fhtb_meetings",   "exhibitor_id",      "INT",  "FK ke fhtb_exhibitors"],
  ["fhtb_meetings",   "attendee_id",       "INT",  "FK ke fhtb_attendees"],
  ["fhtb_meetings",   "meeting_date",      "TEXT", "Tgl meeting (4-6 Mar 2024)"],
  ["fhtb_meetings",   "successful",        "INT",  "1 = berhasil — total 564 meeting, 429 berhasil (angka asli laporan)"],
];

// ===========================================================================
// PROBLEM BANK — keyed by module id from js/curriculum.js.
//
// Each problem object:
//   id       : unique string, convention "<moduleId>-NN"
//   topic    : must match one of the module's topics in curriculum.js
//   level    : "Mudah" | "Sedang" | "Sulit"
//   title    : short challenge name
//   task     : HTML statement (use <code>, <b>, &amp;, &gt;, &lt;)
//   hint     : HTML hint
//   ordered  : true if row order matters (task says ORDER BY), else false
//   solution : a correct query; grader runs it and compares to your result
//
// Engine = SQLite. Use LIMIT (not TOP). Text compare is case-sensitive.
//
// >>> HOW TO BUILD THIS OUT (your job in VS Code / Claude Code CLI):
//   Walk the course module by module. For each `sqlite` module in
//   curriculum.js, add 3–6 problems here, one or more per topic.
//   Modules flagged `tsql` / `concept` don't need auto-graded problems —
//   render them as notes/checklists in the UI instead.
// ===========================================================================
const PROBLEM_BANK = {

  // ---- SELECT Queries (seeded — use these as your template) -------------
  select: [
    {id:'select-01', topic:'WHERE', level:'Mudah', title:'Pecinta Kopi',
     task:'Tampilkan <code>full_name</code>, <code>company</code>, <code>product_interest</code> dari pengunjung yang minatnya <b>Coffee &amp; Tea</b>.',
     hint:'WHERE <code>product_interest = \'Coffee &amp; Tea\'</code>. Perbandingan teks case-sensitive.',
     ordered:false,
     solution:"SELECT full_name, company, product_interest FROM registrations WHERE product_interest='Coffee & Tea'"},

    {id:'select-02', topic:'DISTINCT', level:'Mudah', title:'Jenis Tiket Unik',
     task:'Keluarkan <b>tipe tiket unik</b> dari <code>ticket_type</code>.',
     hint:'Kata kunci <code>DISTINCT</code>.',
     ordered:false,
     solution:"SELECT DISTINCT ticket_type FROM registrations"},

    {id:'select-03', topic:'ORDER BY', level:'Mudah', title:'Roster FHTB (A→Z)',
     task:'Tampilkan <code>full_name</code>, <code>city</code>, <code>event</code> untuk <b>FHTB 2026</b>, urut <code>full_name</code> A→Z.',
     hint:'WHERE untuk event, lalu <code>ORDER BY full_name ASC</code>.',
     ordered:true,
     solution:"SELECT full_name, city, event FROM registrations WHERE event='FHTB 2026' ORDER BY full_name ASC"},

    {id:'select-04', topic:'TOP / LIMIT', level:'Mudah', title:'3 Pendaftar Paling Awal',
     task:'Tampilkan <code>full_name</code>, <code>reg_date</code> dari <b>3 pendaftar paling awal</b>.',
     hint:'<code>ORDER BY reg_date ASC</code> + <code>LIMIT 3</code> (SQL Server: <code>SELECT TOP 3</code>).',
     ordered:true,
     solution:"SELECT full_name, reg_date FROM registrations ORDER BY reg_date ASC LIMIT 3"},

    {id:'select-05', topic:'GROUP BY', level:'Sedang', title:'Jumlah Pendaftar per Kota',
     task:'Tampilkan <code>city</code> dan jumlah pendaftar (<code>total</code>) per kota, urut dari yang <b>terbanyak</b>; kalau seri, urut <code>city</code> A→Z.',
     hint:'<code>GROUP BY city</code> + <code>COUNT(*)</code>, lalu <code>ORDER BY total DESC, city</code>.',
     ordered:true,
     solution:"SELECT city, COUNT(*) AS total FROM registrations GROUP BY city ORDER BY total DESC, city"},

    {id:'select-06', topic:'HAVING', level:'Sedang', title:'Kota dengan Lebih dari 1 Pendaftar',
     task:'Tampilkan <code>city</code> dan jumlahnya (<code>total</code>) untuk kota yang punya <b>lebih dari 1</b> pendaftar, urut <code>city</code> A→Z.',
     hint:'Filter setelah agregasi pakai <code>HAVING COUNT(*) > 1</code>, bukan <code>WHERE</code>.',
     ordered:true,
     solution:"SELECT city, COUNT(*) AS total FROM registrations GROUP BY city HAVING COUNT(*) > 1 ORDER BY city"},
  ],

  // ---- Filtering Data (seeded) ------------------------------------------
  filter: [
    {id:'filter-01', topic:'IN', level:'Sedang', title:'VIP dari Dua Kota',
     task:'Tampilkan <code>full_name</code>, <code>city</code>, <code>ticket_type</code> untuk <b>VIP</b> dari <b>Denpasar</b> atau <b>Jakarta Pusat</b>.',
     hint:'Gabung dengan <code>AND</code>; dua kota pakai <code>IN (\'Denpasar\',\'Jakarta Pusat\')</code>.',
     ordered:false,
     solution:"SELECT full_name, city, ticket_type FROM registrations WHERE ticket_type='VIP' AND city IN ('Denpasar','Jakarta Pusat')"},

    {id:'filter-02', topic:'Comparison Operators', level:'Sedang', title:'Belum Check-in',
     task:'Tampilkan <code>full_name</code>, <code>company</code>, <code>checked_in</code> untuk yang <b>belum check-in</b>, urut <code>full_name</code>.',
     hint:'<code>checked_in = 0</code>, lalu ORDER BY.',
     ordered:true,
     solution:"SELECT full_name, company, checked_in FROM registrations WHERE checked_in=0 ORDER BY full_name"},

    {id:'filter-03', topic:'BETWEEN', level:'Sedang', title:'Trade Visitor Bulan Juni',
     task:'Tampilkan <code>full_name</code>, <code>ticket_type</code>, <code>reg_date</code> untuk <b>Trade Visitor</b> sepanjang <b>Juni 2026</b>, urut tanggal.',
     hint:'<code>reg_date BETWEEN \'2026-06-01\' AND \'2026-06-30\'</code> + filter ticket_type. Tanggal teks YYYY-MM-DD bisa dibanding langsung.',
     ordered:true,
     solution:"SELECT full_name, ticket_type, reg_date FROM registrations WHERE ticket_type='Trade Visitor' AND reg_date BETWEEN '2026-06-01' AND '2026-06-30' ORDER BY reg_date"},

    {id:'filter-04', topic:'LIKE', level:'Sedang', title:'Perusahaan Bertipe Hotel',
     task:'Tampilkan <code>full_name</code>, <code>company</code> untuk pendaftar yang nama perusahaannya mengandung kata <b>Hotel</b>, urut <code>full_name</code>.',
     hint:'<code>company LIKE \'%Hotel%\'</code> — <code>%</code> mewakili teks bebas di depan/belakang.',
     ordered:true,
     solution:"SELECT full_name, company FROM registrations WHERE company LIKE '%Hotel%' ORDER BY full_name"},

    {id:'filter-05', topic:'NOT', level:'Sedang', title:'Bukan Visitor Biasa',
     task:'Tampilkan <code>full_name</code>, <code>ticket_type</code> untuk pendaftar yang tipe tiketnya <b>bukan</b> <code>Visitor</code> (jadi Trade Visitor atau VIP), urut <code>full_name</code>.',
     hint:'<code>WHERE NOT (ticket_type = \'Visitor\')</code>.',
     ordered:true,
     solution:"SELECT full_name, ticket_type FROM registrations WHERE NOT (ticket_type = 'Visitor') ORDER BY full_name"},

    {id:'filter-06', topic:'OR', level:'Mudah', title:'Dari Bandung atau Bekasi',
     task:'Tampilkan <code>full_name</code>, <code>city</code> untuk pendaftar dari <b>Bandung</b> atau <b>Bekasi</b>, urut <code>full_name</code>.',
     hint:'<code>city = \'Bandung\' OR city = \'Bekasi\'</code> (bisa juga pakai <code>IN</code>, tapi latihan ini fokus ke <code>OR</code>).',
     ordered:true,
     solution:"SELECT full_name, city FROM registrations WHERE city = 'Bandung' OR city = 'Bekasi' ORDER BY full_name"},
  ],

  // ---- SQL Joins (needs the `exhibitors` table added alongside registrations) --
  joins: [
    {id:'joins-01', topic:'INNER JOIN', level:'Mudah', title:'Registrant yang Juga Exhibitor',
     task:'Tampilkan <code>full_name</code>, <code>company</code>, dan <code>booth_no</code> untuk pendaftar yang perusahaannya (<code>company</code>) juga terdaftar di tabel <code>exhibitors</code>, urut <code>full_name</code>.',
     hint:'<code>JOIN exhibitors e ON r.company = e.company</code>.',
     ordered:true,
     solution:"SELECT r.full_name, r.company, e.booth_no FROM registrations r JOIN exhibitors e ON r.company = e.company ORDER BY r.full_name"},

    {id:'joins-02', topic:'LEFT JOIN', level:'Sedang', title:'Semua Pendaftar + Booth (Kalau Ada)',
     task:'Tampilkan <code>full_name</code>, <code>company</code>, dan <code>booth_no</code> untuk <b>semua</b> pendaftar — kalau company-nya bukan exhibitor, <code>booth_no</code> tampil <b>NULL</b>. Urut <code>full_name</code>.',
     hint:'<code>LEFT JOIN exhibitors e ON r.company = e.company</code>; semua baris <code>registrations</code> tetap muncul.',
     ordered:true,
     solution:"SELECT r.full_name, r.company, e.booth_no FROM registrations r LEFT JOIN exhibitors e ON r.company = e.company ORDER BY r.full_name"},

    {id:'joins-03', topic:'LEFT ANTI', level:'Sedang', title:'Pendaftar Non-Exhibitor',
     task:'Tampilkan <code>full_name</code>, <code>company</code> untuk pendaftar yang company-nya <b>tidak</b> ada di tabel <code>exhibitors</code> (dan company tidak NULL). Urut <code>full_name</code>.',
     hint:'LEFT JOIN lalu <code>WHERE e.exhibitor_id IS NULL</code> — pola LEFT ANTI JOIN.',
     ordered:true,
     solution:"SELECT r.full_name, r.company FROM registrations r LEFT JOIN exhibitors e ON r.company = e.company WHERE e.exhibitor_id IS NULL AND r.company IS NOT NULL ORDER BY r.full_name"},

    {id:'joins-04', topic:'RIGHT JOIN', level:'Sedang', title:'Semua Exhibitor + Registrant (Kalau Ada)',
     task:'Tampilkan <code>company</code>, <code>booth_no</code> tiap exhibitor beserta <code>full_name</code> registrant dari company yang sama (NULL kalau belum ada registrant). Urut <code>company</code>, lalu <code>full_name</code>.',
     hint:'<code>registrations r RIGHT JOIN exhibitors e ON r.company = e.company</code> — semua baris <code>exhibitors</code> tetap muncul.',
     ordered:true,
     solution:"SELECT e.company, e.booth_no, r.full_name FROM registrations r RIGHT JOIN exhibitors e ON r.company = e.company ORDER BY e.company, r.full_name"},

    {id:'joins-05', topic:'RIGHT ANTI', level:'Sedang', title:'Exhibitor Tanpa Registrant',
     task:'Tampilkan <code>company</code>, <code>booth_no</code> exhibitor yang <b>belum ada satupun</b> registrant dari perusahaan tersebut, urut <code>company</code>.',
     hint:'RIGHT JOIN lalu <code>WHERE r.reg_id IS NULL</code> — pola RIGHT ANTI JOIN.',
     ordered:true,
     solution:"SELECT e.company, e.booth_no FROM registrations r RIGHT JOIN exhibitors e ON r.company = e.company WHERE r.reg_id IS NULL ORDER BY e.company"},

    {id:'joins-06', topic:'FULL JOIN', level:'Sulit', title:'Gabungan Penuh Registrant & Exhibitor',
     task:'Tampilkan <code>full_name</code>, company registrant (alias <code>reg_company</code>), company exhibitor (alias <code>exh_company</code>), dan <code>booth_no</code> — untuk <b>semua</b> baris dari kedua tabel, baik yang match maupun tidak. Urut berdasarkan <code>COALESCE(r.company, e.company)</code>, lalu <code>full_name</code>.',
     hint:'<code>FULL JOIN exhibitors e ON r.company = e.company</code>.',
     ordered:true,
     solution:"SELECT r.full_name, r.company AS reg_company, e.company AS exh_company, e.booth_no FROM registrations r FULL JOIN exhibitors e ON r.company = e.company ORDER BY COALESCE(r.company, e.company), r.full_name"},

    {id:'joins-07', topic:'CROSS JOIN', level:'Sedang', title:'Matriks Tiket × Kategori Booth',
     task:'Buat daftar semua kombinasi <code>ticket_type</code> unik dengan <code>category</code> unik dari <code>exhibitors</code> (matriks penawaran tur booth per tipe tiket). Urut <code>ticket_type</code>, lalu <code>category</code>.',
     hint:'<code>CROSS JOIN</code> antara subquery <code>DISTINCT ticket_type</code> dan subquery <code>DISTINCT category</code>.',
     ordered:true,
     solution:"SELECT DISTINCT t.ticket_type, c.category FROM (SELECT DISTINCT ticket_type FROM registrations) t CROSS JOIN (SELECT DISTINCT category FROM exhibitors) c ORDER BY t.ticket_type, c.category"},

    {id:'joins-08', topic:'Multiple joins', level:'Sulit', title:'Registrant Pertama per Exhibitor',
     task:'Untuk tiap exhibitor yang company-nya juga muncul di <code>registrations</code>, tampilkan <code>company</code>, <code>booth_no</code>, dan nama + tanggal daftar registrant <b>paling awal</b> dari company itu. Urut <code>company</code>.',
     hint:'Gabungkan tiga sumber: <code>exhibitors</code> JOIN <code>registrations</code> ON company, JOIN lagi ke subquery <code>MIN(reg_date)</code> per company untuk menyaring baris paling awal.',
     ordered:true,
     solution:"SELECT e.company, e.booth_no, r.full_name, r.reg_date FROM exhibitors e JOIN registrations r ON r.company = e.company JOIN (SELECT company, MIN(reg_date) AS min_date FROM registrations GROUP BY company) fr ON fr.company = r.company AND fr.min_date = r.reg_date ORDER BY e.company"},
  ],

  // ---- Modules below: STUBS. Fill per curriculum.js topics. --------------
  // ---- Data Definition (DDL) ---------------------------------------------
  // Grading pattern: kirim >1 statement dipisah ';' — statement terakhir harus
  // berupa SELECT verifikasi (pragma_table_info / sqlite_master), karena itu
  // yang dibandingkan grader (statement DDL sendiri tidak menghasilkan baris).
  ddl: [
    {id:'ddl-01', topic:'CREATE', level:'Mudah', title:'Bikin Tabel Catatan Event',
     task:'Buat tabel baru <code>event_notes</code> dengan kolom <code>note_id</code> (INTEGER PRIMARY KEY) dan <code>note_text</code> (TEXT). Tulis <b>dua statement</b> dipisah titik koma — statement kedua untuk verifikasi: <code>SELECT name, type FROM pragma_table_info(\'event_notes\');</code>',
     hint:'Statement 1: <code>CREATE TABLE event_notes (note_id INTEGER PRIMARY KEY, note_text TEXT);</code>. Statement 2 (yang dinilai): query <code>pragma_table_info</code> di atas.',
     ordered:true,
     solution:"CREATE TABLE event_notes (note_id INTEGER PRIMARY KEY, note_text TEXT); SELECT name, type FROM pragma_table_info('event_notes')"},

    {id:'ddl-02', topic:'ALTER', level:'Sedang', title:'Tambah Kolom Loyalty Note',
     task:'Tambahkan kolom baru <code>loyalty_note</code> (TEXT) ke tabel <code>registrations</code> pakai <code>ALTER TABLE</code>. Verifikasi dengan menampilkan semua nama kolom tabel <code>registrations</code>: <code>SELECT name FROM pragma_table_info(\'registrations\');</code>',
     hint:'Statement 1: <code>ALTER TABLE registrations ADD COLUMN loyalty_note TEXT;</code>. Statement 2: query <code>pragma_table_info</code> di atas — <code>loyalty_note</code> harus muncul sebagai kolom terakhir.',
     ordered:true,
     solution:"ALTER TABLE registrations ADD COLUMN loyalty_note TEXT; SELECT name FROM pragma_table_info('registrations')"},

    {id:'ddl-03', topic:'DROP', level:'Sedang', title:'Hapus Tabel Exhibitors',
     task:'Hapus tabel <code>exhibitors</code> dari database ini pakai <code>DROP TABLE</code>. Verifikasi dengan menghitung baris di <code>sqlite_master</code> yang <code>type=\'table\' AND name=\'exhibitors\'</code> (hasilnya harus 0).',
     hint:'Statement 1: <code>DROP TABLE exhibitors;</code>. Statement 2: <code>SELECT COUNT(*) AS masih_ada FROM sqlite_master WHERE type=\'table\' AND name=\'exhibitors\';</code>',
     ordered:false,
     solution:"DROP TABLE exhibitors; SELECT COUNT(*) AS masih_ada FROM sqlite_master WHERE type='table' AND name='exhibitors'"},
  ],
  // ---- Data Manipulation (DML) -------------------------------------------
  // Sama seperti DDL: statement terakhir (dipisah ';') harus SELECT yang
  // membuktikan hasil INSERT/UPDATE/DELETE-nya.
  dml: [
    {id:'dml-01', topic:'INSERT', level:'Mudah', title:'Daftarkan Pendaftar Baru',
     task:'Tambahkan pendaftar baru: <code>reg_id=31</code>, <code>full_name=\'Wulan Sari\'</code>, <code>email=\'wulan.sari@gmail.com\'</code>, <code>phone=\'081234000000\'</code>, <code>company=\'Kafe Wulan\'</code>, <code>job_title=\'Owner\'</code>, <code>city=\'Malang\'</code>, <code>event=\'FHTB 2026\'</code>, <code>reg_date=\'2026-07-03\'</code>, <code>ticket_type=\'Visitor\'</code>, <code>product_interest=\'Coffee &amp; Tea\'</code>, <code>checked_in=0</code>. Verifikasi dengan <code>SELECT * FROM registrations WHERE reg_id=31;</code>',
     hint:'Statement 1: <code>INSERT INTO registrations VALUES (31, ...);</code> — urutan kolom ikuti skema. Statement 2: query verifikasi di atas.',
     ordered:false,
     solution:"INSERT INTO registrations VALUES (31,'Wulan Sari','wulan.sari@gmail.com','081234000000','Kafe Wulan','Owner','Malang','FHTB 2026','2026-07-03','Visitor','Coffee & Tea',0); SELECT * FROM registrations WHERE reg_id=31"},

    {id:'dml-02', topic:'UPDATE', level:'Sedang', title:'Tandai Sudah Check-in',
     task:'Ubah <code>checked_in</code> jadi <code>1</code> untuk pendaftar <code>reg_id=6</code> (Maya Putri). Verifikasi dengan <code>SELECT reg_id, full_name, checked_in FROM registrations WHERE reg_id=6;</code>',
     hint:'Statement 1: <code>UPDATE registrations SET checked_in=1 WHERE reg_id=6;</code>. Statement 2: query verifikasi di atas.',
     ordered:false,
     solution:"UPDATE registrations SET checked_in=1 WHERE reg_id=6; SELECT reg_id, full_name, checked_in FROM registrations WHERE reg_id=6"},

    {id:'dml-03', topic:'DELETE', level:'Sedang', title:'Batalkan Pendaftaran',
     task:'Hapus pendaftaran <code>reg_id=30</code> (Fahmi Idris) dari tabel <code>registrations</code>. Verifikasi dengan menghitung total baris yang tersisa: <code>SELECT COUNT(*) AS total FROM registrations;</code> (harusnya 29).',
     hint:'Statement 1: <code>DELETE FROM registrations WHERE reg_id=30;</code>. Statement 2: query verifikasi di atas.',
     ordered:false,
     solution:"DELETE FROM registrations WHERE reg_id=30; SELECT COUNT(*) AS total FROM registrations"},
  ],
  // ---- SET Operators (pakai registrations + exhibitors) ------------------
  setops: [
    {id:'setops-01', topic:'UNION', level:'Mudah', title:'Semua Nama Company (Unik)',
     task:'Tampilkan daftar <b>unik</b> semua nama <code>company</code> yang muncul di <code>registrations</code> maupun <code>exhibitors</code>, urut abjad.',
     hint:'<code>SELECT company FROM registrations ... UNION SELECT company FROM exhibitors</code> — <code>UNION</code> otomatis buang duplikat.',
     ordered:true,
     solution:"SELECT company FROM registrations WHERE company IS NOT NULL UNION SELECT company FROM exhibitors ORDER BY company"},

    {id:'setops-02', topic:'UNION ALL', level:'Sedang', title:'Semua Nama Company (Dengan Duplikat)',
     task:'Tampilkan daftar nama <code>company</code> dari <code>registrations</code> dan <code>exhibitors</code> <b>tanpa</b> menghilangkan duplikat, urut abjad.',
     hint:'<code>UNION ALL</code> menyimpan semua baris apa adanya, beda dari <code>UNION</code>.',
     ordered:true,
     solution:"SELECT company FROM registrations WHERE company IS NOT NULL UNION ALL SELECT company FROM exhibitors ORDER BY company"},

    {id:'setops-03', topic:'EXCEPT', level:'Sedang', title:'Registrant yang Bukan Exhibitor',
     task:'Tampilkan <code>company</code> yang ada di <code>registrations</code> tapi <b>tidak</b> ada di <code>exhibitors</code>, urut abjad.',
     hint:'<code>SELECT company FROM registrations ... EXCEPT SELECT company FROM exhibitors</code> — sisakan yang cuma ada di kiri.',
     ordered:true,
     solution:"SELECT company FROM registrations WHERE company IS NOT NULL EXCEPT SELECT company FROM exhibitors ORDER BY company"},

    {id:'setops-04', topic:'INTERSECT', level:'Sedang', title:'Company yang Juga Exhibitor',
     task:'Tampilkan <code>company</code> yang muncul <b>baik</b> di <code>registrations</code> <b>maupun</b> di <code>exhibitors</code> (irisan), urut abjad.',
     hint:'<code>INTERSECT</code> menyisakan baris yang ada di kedua hasil query.',
     ordered:true,
     solution:"SELECT company FROM registrations WHERE company IS NOT NULL INTERSECT SELECT company FROM exhibitors ORDER BY company"},
  ],
  // ---- String Functions ---------------------------------------------------
  strings: [
    {id:'strings-01', topic:'CONCAT', level:'Mudah', title:'Label Nama + Kota',
     task:'Buat kolom <code>label</code> berisi <code>full_name</code> digabung <code>city</code> dalam kurung, contoh <code>"Rudi Hartono (Jakarta Pusat)"</code>, khusus untuk tiket <b>VIP</b>. Urut <code>full_name</code>.',
     hint:'SQLite pakai <code>||</code> untuk concat (bukan <code>CONCAT()</code>): <code>full_name || \' (\' || city || \')\'</code>.',
     ordered:true,
     solution:"SELECT full_name || ' (' || city || ')' AS label FROM registrations WHERE ticket_type='VIP' ORDER BY full_name"},

    {id:'strings-02', topic:'UPPER & LOWER', level:'Mudah', title:'Nama Kapital, Kota Kecil',
     task:'Untuk pendaftar dari <b>Jakarta Selatan</b>, tampilkan <code>full_name</code> dalam huruf besar semua (alias <code>full_name_upper</code>) dan <code>city</code> dalam huruf kecil semua (alias <code>city_lower</code>). Urut <code>full_name</code>.',
     hint:'<code>UPPER(full_name)</code> dan <code>LOWER(city)</code>.',
     ordered:true,
     solution:"SELECT UPPER(full_name) AS full_name_upper, LOWER(city) AS city_lower FROM registrations WHERE city='Jakarta Selatan' ORDER BY full_name"},

    {id:'strings-03', topic:'TRIM', level:'Sedang', title:'Bersihkan Tanda + di Depan Nomor',
     task:'Untuk nomor <code>phone</code> yang diawali karakter <code>+</code>, tampilkan <code>full_name</code> dan <code>phone</code> yang sudah dibersihkan dari <code>+</code> di depan (alias <code>phone_clean</code>). Urut <code>full_name</code>.',
     hint:'<code>TRIM(phone, \'+\')</code> membuang karakter <code>+</code> di awal & akhir string. Filter dulu dengan <code>phone LIKE \'+%\'</code>.',
     ordered:true,
     solution:"SELECT full_name, TRIM(phone, '+') AS phone_clean FROM registrations WHERE phone LIKE '+%' ORDER BY full_name"},

    {id:'strings-04', topic:'REPLACE', level:'Sedang', title:'Normalkan Nomor dengan Strip',
     task:'Untuk nomor <code>phone</code> yang mengandung tanda <code>-</code>, tampilkan <code>full_name</code> dan <code>phone</code> dengan semua <code>-</code> dihapus (alias <code>phone_clean</code>). Urut <code>full_name</code>.',
     hint:'<code>REPLACE(phone, \'-\', \'\')</code>. Filter dengan <code>phone LIKE \'%-%\'</code>.',
     ordered:true,
     solution:"SELECT full_name, REPLACE(phone,'-','') AS phone_clean FROM registrations WHERE phone LIKE '%-%' ORDER BY full_name"},

    {id:'strings-05', topic:'LENGTH', level:'Mudah', title:'Nama Terpanjang',
     task:'Tampilkan <code>full_name</code> dan panjang namanya (alias <code>name_len</code>) untuk pendaftar dengan nama <b>lebih dari 15 karakter</b>, urut <code>name_len</code> menurun.',
     hint:'<code>LENGTH(full_name)</code> — SQL Server: <code>LEN()</code>.',
     ordered:true,
     solution:"SELECT full_name, LENGTH(full_name) AS name_len FROM registrations WHERE LENGTH(full_name) > 15 ORDER BY name_len DESC, full_name"},

    {id:'strings-06', topic:'SUBSTR / LEFT & RIGHT', level:'Sedang', title:'Kode 3 Huruf Kota Jakarta',
     task:'Untuk pendaftar dari kota yang mengandung kata <b>Jakarta</b>, tampilkan <code>full_name</code>, <code>city</code>, dan 3 huruf pertama <code>city</code> (alias <code>city_code</code>). Urut <code>full_name</code>.',
     hint:'<code>SUBSTR(city, 1, 3)</code> — SQLite tidak punya <code>LEFT()</code>/<code>RIGHT()</code> seperti T-SQL, semua pakai <code>SUBSTR()</code>.',
     ordered:true,
     solution:"SELECT full_name, city, SUBSTR(city,1,3) AS city_code FROM registrations WHERE city LIKE '%Jakarta%' ORDER BY full_name"},
  ],

  // ---- Number Functions -----------------------------------------------------
  numbers: [
    {id:'numbers-01', topic:'Rounding Functions', level:'Mudah', title:'Rata-rata Check-in Dibulatkan',
     task:'Tampilkan <code>ticket_type</code> dan rata-rata <code>checked_in</code> per tipe (alias <code>avg_checkin</code>), dibulatkan ke <b>1 desimal</b> pakai <code>ROUND()</code>. Urut <code>ticket_type</code>.',
     hint:'<code>ROUND(AVG(checked_in), 1)</code>.',
     ordered:true,
     solution:"SELECT ticket_type, ROUND(AVG(checked_in), 1) AS avg_checkin FROM registrations GROUP BY ticket_type ORDER BY ticket_type"},

    {id:'numbers-02', topic:'Absolute Value Function', level:'Sedang', title:'Jarak Hari dari Pertengahan Event',
     task:'Event dianggap "puncak" di tanggal <code>2026-06-15</code>. Tampilkan <code>full_name</code>, <code>reg_date</code>, dan selisih hari dari tanggal itu — <b>tanpa peduli sebelum/sesudah</b> (alias <code>days_from_mid</code>) pakai <code>ABS()</code>. Urut <code>days_from_mid</code> menaik, lalu <code>full_name</code>.',
     hint:'<code>ABS(CAST(julianday(reg_date) - julianday(\'2026-06-15\') AS INTEGER))</code> — <code>ABS()</code> bikin selisih negatif (tanggal sebelum) jadi positif juga.',
     ordered:true,
     solution:"SELECT full_name, reg_date, ABS(CAST(julianday(reg_date) - julianday('2026-06-15') AS INTEGER)) AS days_from_mid FROM registrations ORDER BY days_from_mid ASC, full_name"},
  ],

  // ---- Date & Time Functions -----------------------------------------------
  datetime: [
    {id:'datetime-01', topic:'strftime (DAY/MONTH/YEAR)', level:'Mudah', title:'Pendaftar Bulan Mei',
     task:'Tampilkan <code>full_name</code>, <code>reg_date</code>, tanggal (alias <code>reg_day</code>), dan bulan (alias <code>reg_month</code>) untuk pendaftar yang daftar di <b>bulan Mei</b>. Urut <code>reg_date</code>.',
     hint:'<code>strftime(\'%d\', reg_date)</code> untuk tanggal, <code>strftime(\'%m\', reg_date)</code> untuk bulan (string 2 digit).',
     ordered:true,
     solution:"SELECT full_name, reg_date, strftime('%d', reg_date) AS reg_day, strftime('%m', reg_date) AS reg_month FROM registrations WHERE strftime('%m', reg_date)='05' ORDER BY reg_date"},

    {id:'datetime-02', topic:'date() arithmetic', level:'Sedang', title:'Jadwal Follow-up VIP',
     task:'Untuk pendaftar <b>VIP</b>, tampilkan <code>full_name</code>, <code>reg_date</code>, dan tanggal follow-up <b>7 hari setelah</b> pendaftaran (alias <code>followup_date</code>). Urut <code>reg_date</code>.',
     hint:'<code>date(reg_date, \'+7 days\')</code> — T-SQL padanannya <code>DATEADD(day, 7, reg_date)</code>.',
     ordered:true,
     solution:"SELECT full_name, reg_date, date(reg_date, '+7 days') AS followup_date FROM registrations WHERE ticket_type='VIP' ORDER BY reg_date"},

    {id:'datetime-03', topic:'Date diff', level:'Sedang', title:'Hitung Mundur ke Penutupan',
     task:'Event ditutup <code>2026-07-05</code>. Tampilkan <code>full_name</code>, <code>reg_date</code>, dan selisih hari ke tanggal penutupan (alias <code>days_to_close</code>) untuk <b>semua</b> pendaftar, urut <code>days_to_close</code> menaik (lalu <code>full_name</code>).',
     hint:'<code>CAST(julianday(\'2026-07-05\') - julianday(reg_date) AS INTEGER)</code> — T-SQL padanannya <code>DATEDIFF(day, reg_date, \'2026-07-05\')</code>.',
     ordered:true,
     solution:"SELECT full_name, reg_date, CAST(julianday('2026-07-05') - julianday(reg_date) AS INTEGER) AS days_to_close FROM registrations ORDER BY days_to_close ASC, full_name"},

    {id:'datetime-04', topic:'Formatting', level:'Sedang', title:'Format Tanggal DD/MM/YYYY',
     task:'Untuk pendaftar <b>FHI 2026</b>, tampilkan <code>full_name</code>, <code>reg_date</code>, dan tanggal dalam format <code>DD/MM/YYYY</code> (alias <code>reg_date_fmt</code>). Urut <code>reg_date</code>.',
     hint:'<code>strftime(\'%d/%m/%Y\', reg_date)</code> menyusun ulang format tanggal.',
     ordered:true,
     solution:"SELECT full_name, reg_date, strftime('%d/%m/%Y', reg_date) AS reg_date_fmt FROM registrations WHERE event='FHI 2026' ORDER BY reg_date"},
  ],
  // ---- NULL Functions -------------------------------------------------------
  nulls: [
    {id:'nulls-01', topic:'COALESCE', level:'Mudah', title:'Ganti NULL Company',
     task:'Tampilkan <code>full_name</code> dan <code>company</code> untuk semua pendaftar — kalau <code>company</code> NULL, tampilkan <code>\'Tidak diisi\'</code> (alias <code>company_display</code>). Urut <code>full_name</code>.',
     hint:'<code>COALESCE(company, \'Tidak diisi\')</code> mengembalikan nilai pertama yang tidak NULL.',
     ordered:true,
     solution:"SELECT full_name, COALESCE(company, 'Tidak diisi') AS company_display FROM registrations ORDER BY full_name"},

    {id:'nulls-02', topic:'IFNULL', level:'Mudah', title:'Ganti NULL Jabatan',
     task:'Tampilkan <code>full_name</code> dan <code>job_title</code> untuk semua pendaftar — kalau <code>job_title</code> NULL, tampilkan <code>\'Belum diisi\'</code> (alias <code>job_display</code>). Urut <code>full_name</code>.',
     hint:'<code>IFNULL(job_title, \'Belum diisi\')</code> — di SQL Server namanya <code>ISNULL()</code>.',
     ordered:true,
     solution:"SELECT full_name, IFNULL(job_title, 'Belum diisi') AS job_display FROM registrations ORDER BY full_name"},

    {id:'nulls-03', topic:'IS NULL / IS NOT NULL', level:'Mudah', title:'Perusahaan Belum Diisi',
     task:'Tampilkan <code>full_name</code>, <code>company</code> untuk pendaftar yang <code>company</code>-nya <b>belum diisi</b> (NULL). Urut <code>full_name</code>.',
     hint:'<code>WHERE company IS NULL</code> — bukan <code>= NULL</code>.',
     ordered:true,
     solution:"SELECT full_name, company FROM registrations WHERE company IS NULL ORDER BY full_name"},

    {id:'nulls-04', topic:'NULLIF', level:'Sedang', title:'Tandai Kota yang Meragukan',
     task:'Tim data curiga entri kota <b>Bogor</b> salah input. Tampilkan <code>full_name</code>, <code>city</code>, dan hasil <code>NULLIF(city, \'Bogor\')</code> (alias <code>city_checked</code>) — baris dengan city Bogor akan tampil NULL di kolom itu. Urut <code>full_name</code>.',
     hint:'<code>NULLIF(a, b)</code> mengembalikan NULL kalau <code>a = b</code>, kalau tidak mengembalikan <code>a</code>.',
     ordered:true,
     solution:"SELECT full_name, city, NULLIF(city, 'Bogor') AS city_checked FROM registrations ORDER BY full_name"},
  ],
  // ---- CASE WHEN --------------------------------------------------------
  case: [
    {id:'case-01', topic:'Categorizing data', level:'Mudah', title:'Tier Prioritas Tiket',
     task:'Kategorikan tiap pendaftar jadi <code>tier</code>: <b>VIP</b> → <code>\'Prioritas Tinggi\'</code>, <b>Trade Visitor</b> → <code>\'Prioritas Sedang\'</code>, selainnya → <code>\'Reguler\'</code>. Tampilkan <code>full_name</code>, <code>ticket_type</code>, <code>tier</code>. Urut <code>full_name</code>.',
     hint:'<code>CASE ticket_type WHEN \'VIP\' THEN ... WHEN \'Trade Visitor\' THEN ... ELSE ... END</code>.',
     ordered:true,
     solution:"SELECT full_name, ticket_type, CASE ticket_type WHEN 'VIP' THEN 'Prioritas Tinggi' WHEN 'Trade Visitor' THEN 'Prioritas Sedang' ELSE 'Reguler' END AS tier FROM registrations ORDER BY full_name"},

    {id:'case-02', topic:'Mapping values', level:'Sedang', title:'Kelompok Wilayah Jabodetabek',
     task:'Petakan <code>city</code> ke <code>region</code>: kota mengandung <b>Jakarta</b> → <code>\'Jabodetabek Inti\'</code>; <b>Bogor/Depok/Tangerang/Bekasi</b> → <code>\'Jabodetabek Luar\'</code>; selainnya → <code>\'Luar Jabodetabek\'</code>. Tampilkan <code>full_name</code>, <code>city</code>, <code>region</code>. Urut <code>full_name</code>.',
     hint:'<code>CASE WHEN city LIKE \'%Jakarta%\' THEN ... WHEN city IN (...) THEN ... ELSE ... END</code>.',
     ordered:true,
     solution:"SELECT full_name, city, CASE WHEN city LIKE '%Jakarta%' THEN 'Jabodetabek Inti' WHEN city IN ('Bogor','Depok','Tangerang','Bekasi') THEN 'Jabodetabek Luar' ELSE 'Luar Jabodetabek' END AS region FROM registrations ORDER BY full_name"},

    {id:'case-03', topic:'Handling NULLs', level:'Sedang', title:'Status Perusahaan dengan CASE',
     task:'Tampilkan <code>full_name</code> dan <code>status_perusahaan</code>: kalau <code>company</code> NULL tampilkan <code>\'Tidak Bekerja/Belum Diisi\'</code>, selainnya tampilkan nilai <code>company</code> apa adanya. Urut <code>full_name</code>.',
     hint:'<code>CASE WHEN company IS NULL THEN \'...\' ELSE company END</code> — pola ini setara <code>COALESCE</code> tapi lebih fleksibel untuk logika kompleks.',
     ordered:true,
     solution:"SELECT full_name, CASE WHEN company IS NULL THEN 'Tidak Bekerja/Belum Diisi' ELSE company END AS status_perusahaan FROM registrations ORDER BY full_name"},
  ],
  // ---- Window Functions — Basics -----------------------------------------
  win_basics: [
    {id:'win_basics-01', topic:'OVER()', level:'Mudah', title:'Total VIP dengan OVER()',
     task:'Untuk tiap pendaftar <b>VIP</b>, tampilkan <code>full_name</code>, <code>ticket_type</code>, dan total baris VIP secara keseluruhan (alias <code>total_all</code>) pakai <code>COUNT(*) OVER()</code>. Urut <code>full_name</code>.',
     hint:'<code>COUNT(*) OVER()</code> tanpa <code>PARTITION BY</code> menghitung dari seluruh hasil (setelah WHERE), diulang di tiap baris.',
     ordered:true,
     solution:"SELECT full_name, ticket_type, COUNT(*) OVER() AS total_all FROM registrations WHERE ticket_type='VIP' ORDER BY full_name"},

    {id:'win_basics-02', topic:'PARTITION BY', level:'Sedang', title:'Jumlah per Tipe Tiket',
     task:'Tampilkan <code>full_name</code>, <code>ticket_type</code>, dan jumlah pendaftar per tipe tiket (alias <code>total_per_type</code>) pakai window function ber-<code>PARTITION BY</code>. Urut <code>ticket_type</code>, lalu <code>full_name</code>.',
     hint:'<code>COUNT(*) OVER(PARTITION BY ticket_type)</code> — hitungan di-reset per kelompok <code>ticket_type</code>.',
     ordered:true,
     solution:"SELECT full_name, ticket_type, COUNT(*) OVER(PARTITION BY ticket_type) AS total_per_type FROM registrations ORDER BY ticket_type, full_name"},

    {id:'win_basics-03', topic:'ORDER BY in window', level:'Sedang', title:'Hitungan Kumulatif Pendaftar',
     task:'Tampilkan <code>full_name</code>, <code>reg_date</code>, dan jumlah pendaftar yang sudah masuk <b>sampai dengan</b> tanggal itu (alias <code>cumulative_count</code>). Urut <code>reg_date</code>.',
     hint:'<code>COUNT(*) OVER(ORDER BY reg_date)</code> — menambahkan <code>ORDER BY</code> di dalam <code>OVER()</code> mengubah frame default jadi "dari awal sampai baris ini".',
     ordered:true,
     solution:"SELECT full_name, reg_date, COUNT(*) OVER(ORDER BY reg_date) AS cumulative_count FROM registrations ORDER BY reg_date"},

    {id:'win_basics-04', topic:'Frame clause', level:'Sulit', title:'Check-in 3 Hari ke Depan',
     task:'Tampilkan <code>full_name</code>, <code>reg_date</code>, <code>checked_in</code>, dan total <code>checked_in</code> dari baris ini <b>sampai 2 baris berikutnya</b> (alias <code>checkin_next3</code>), urut <code>reg_date</code>.',
     hint:'Frame custom: <code>SUM(checked_in) OVER(ORDER BY reg_date ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING)</code>.',
     ordered:true,
     solution:"SELECT full_name, reg_date, checked_in, SUM(checked_in) OVER(ORDER BY reg_date ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING) AS checkin_next3 FROM registrations ORDER BY reg_date"},
  ],
  // ---- Window Aggregate Functions ----------------------------------------
  win_agg: [
    {id:'win_agg-01', topic:'COUNT/SUM/AVG OVER', level:'Sedang', title:'Rata-rata Check-in per Tipe Tiket',
     task:'Tampilkan <code>full_name</code>, <code>ticket_type</code>, dan rata-rata <code>checked_in</code> dari semua pendaftar dengan tipe tiket yang sama (alias <code>avg_checkin_type</code>, dibulatkan 2 desimal). Urut <code>ticket_type</code>, lalu <code>full_name</code>.',
     hint:'<code>ROUND(AVG(checked_in) OVER(PARTITION BY ticket_type), 2)</code>.',
     ordered:true,
     solution:"SELECT full_name, ticket_type, ROUND(AVG(checked_in) OVER(PARTITION BY ticket_type), 2) AS avg_checkin_type FROM registrations ORDER BY ticket_type, full_name"},

    {id:'win_agg-02', topic:'MIN/MAX OVER', level:'Sedang', title:'Pendaftar Pertama per Kota',
     task:'Tampilkan <code>full_name</code>, <code>city</code>, <code>reg_date</code>, dan tanggal pendaftaran <b>paling awal</b> dari kota yang sama (alias <code>first_reg_in_city</code>). Urut <code>city</code>, lalu <code>reg_date</code>.',
     hint:'<code>MIN(reg_date) OVER(PARTITION BY city)</code>.',
     ordered:true,
     solution:"SELECT full_name, city, reg_date, MIN(reg_date) OVER(PARTITION BY city) AS first_reg_in_city FROM registrations ORDER BY city, reg_date"},

    {id:'win_agg-03', topic:'Running total', level:'Sedang', title:'Running Total Check-in',
     task:'Tampilkan <code>full_name</code>, <code>reg_date</code>, <code>checked_in</code>, dan total kumulatif <code>checked_in</code> dari awal sampai baris ini (alias <code>running_checkin</code>). Urut <code>reg_date</code>.',
     hint:'<code>SUM(checked_in) OVER(ORDER BY reg_date)</code> — tanpa frame eksplisit, defaultnya "dari awal sampai baris ini".',
     ordered:true,
     solution:"SELECT full_name, reg_date, checked_in, SUM(checked_in) OVER(ORDER BY reg_date) AS running_checkin FROM registrations ORDER BY reg_date"},

    {id:'win_agg-04', topic:'Moving average', level:'Sulit', title:'Rata-rata Bergerak 3 Hari',
     task:'Tampilkan <code>full_name</code>, <code>reg_date</code>, <code>checked_in</code>, dan rata-rata <code>checked_in</code> dari baris ini + 2 baris sebelumnya (moving average 3-baris, alias <code>moving_avg_checkin</code>, dibulatkan 2 desimal). Urut <code>reg_date</code>.',
     hint:'<code>ROUND(AVG(checked_in) OVER(ORDER BY reg_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2)</code>.',
     ordered:true,
     solution:"SELECT full_name, reg_date, checked_in, ROUND(AVG(checked_in) OVER(ORDER BY reg_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg_checkin FROM registrations ORDER BY reg_date"},
  ],
  // ---- Window Ranking Functions ------------------------------------------
  win_rank: [
    {id:'win_rank-01', topic:'ROW_NUMBER', level:'Mudah', title:'Nomor Urut Pendaftaran',
     task:'Tampilkan <code>full_name</code>, <code>reg_date</code>, dan nomor urut pendaftaran dari yang paling awal (alias <code>row_num</code>). Urut <code>reg_date</code>.',
     hint:'<code>ROW_NUMBER() OVER(ORDER BY reg_date)</code> — selalu unik, tidak ada nilai kembar walau ada seri.',
     ordered:true,
     solution:"SELECT full_name, reg_date, ROW_NUMBER() OVER(ORDER BY reg_date) AS row_num FROM registrations ORDER BY reg_date"},

    {id:'win_rank-02', topic:'RANK', level:'Sedang', title:'Ranking Status Check-in',
     task:'Beri <code>ranking</code> tiap pendaftar berdasarkan <code>checked_in</code> (1 = ranking tertinggi) pakai <code>RANK()</code>. Tampilkan <code>full_name</code>, <code>checked_in</code>, <code>ranking</code>. Urut <code>ranking</code>, lalu <code>full_name</code>.',
     hint:'<code>RANK() OVER(ORDER BY checked_in DESC)</code> — baris yang seri dapat ranking sama, lalu ranking berikutnya <b>meloncat</b> sejumlah baris yang seri.',
     ordered:true,
     solution:"SELECT full_name, checked_in, RANK() OVER(ORDER BY checked_in DESC) AS ranking FROM registrations ORDER BY ranking, full_name"},

    {id:'win_rank-03', topic:'DENSE_RANK', level:'Sedang', title:'Dense Ranking Status Check-in',
     task:'Sama seperti soal RANK sebelumnya, tapi pakai <code>DENSE_RANK()</code> — tampilkan <code>full_name</code>, <code>checked_in</code>, <code>dense_ranking</code>. Urut <code>dense_ranking</code>, lalu <code>full_name</code>.',
     hint:'<code>DENSE_RANK() OVER(ORDER BY checked_in DESC)</code> — beda dari <code>RANK()</code>, ranking berikutnya <b>tidak meloncat</b> (langsung +1).',
     ordered:true,
     solution:"SELECT full_name, checked_in, DENSE_RANK() OVER(ORDER BY checked_in DESC) AS dense_ranking FROM registrations ORDER BY dense_ranking, full_name"},

    {id:'win_rank-04', topic:'NTILE', level:'Sedang', title:'Bagi 4 Gelombang Pendaftaran',
     task:'Bagi seluruh pendaftar jadi <b>4 kelompok</b> (gelombang) berdasarkan urutan <code>reg_date</code> paling awal. Tampilkan <code>full_name</code>, <code>reg_date</code>, dan nomor gelombangnya (alias <code>quartile</code>). Urut <code>reg_date</code>.',
     hint:'<code>NTILE(4) OVER(ORDER BY reg_date)</code>.',
     ordered:true,
     solution:"SELECT full_name, reg_date, NTILE(4) OVER(ORDER BY reg_date) AS quartile FROM registrations ORDER BY reg_date"},

    {id:'win_rank-05', topic:'CUME_DIST', level:'Sulit', title:'Distribusi Kumulatif Pendaftaran',
     task:'Tampilkan <code>full_name</code>, <code>reg_date</code>, dan posisi distribusi kumulatifnya (alias <code>cume_dist_val</code>, dibulatkan 2 desimal) berdasarkan urutan <code>reg_date</code>. Urut <code>reg_date</code>.',
     hint:'<code>ROUND(CUME_DIST() OVER(ORDER BY reg_date), 2)</code> — proporsi baris yang urutannya ≤ baris ini.',
     ordered:true,
     solution:"SELECT full_name, reg_date, ROUND(CUME_DIST() OVER(ORDER BY reg_date), 2) AS cume_dist_val FROM registrations ORDER BY reg_date"},

    {id:'win_rank-06', topic:'PERCENT_RANK', level:'Sulit', title:'Percent Rank Pendaftaran',
     task:'Tampilkan <code>full_name</code>, <code>reg_date</code>, dan <code>percent_rank_val</code> (dibulatkan 2 desimal) berdasarkan urutan <code>reg_date</code>. Urut <code>reg_date</code>.',
     hint:'<code>ROUND(PERCENT_RANK() OVER(ORDER BY reg_date), 2)</code> — baris pertama selalu bernilai 0.',
     ordered:true,
     solution:"SELECT full_name, reg_date, ROUND(PERCENT_RANK() OVER(ORDER BY reg_date), 2) AS percent_rank_val FROM registrations ORDER BY reg_date"},

    {id:'win_rank-07', topic:'Find duplicates', level:'Sedang', title:'Cari Pendaftaran Duplikat',
     task:'Ada pendaftar yang keliru daftar dua kali dengan <code>full_name</code> & <code>email</code> yang sama. Tampilkan <code>full_name</code>, <code>email</code>, <code>reg_id</code>, dan nomor kemunculannya (alias <code>dup_num</code>) — <b>hanya</b> baris duplikat (kemunculan ke-2 dst).',
     hint:'Bungkus <code>ROW_NUMBER() OVER(PARTITION BY full_name, email ORDER BY reg_id)</code> dalam subquery, lalu filter <code>WHERE dup_num > 1</code> di query luar (window function tidak boleh langsung dipakai di WHERE).',
     ordered:false,
     solution:"SELECT full_name, email, reg_id, dup_num FROM (SELECT full_name, email, reg_id, ROW_NUMBER() OVER(PARTITION BY full_name, email ORDER BY reg_id) AS dup_num FROM registrations) t WHERE dup_num > 1"},
  ],
  // ---- Window Value Functions ---------------------------------------------
  win_val: [
    {id:'win_val-01', topic:'LAG', level:'Sedang', title:'Tanggal Daftar Sebelumnya',
     task:'Tampilkan <code>full_name</code>, <code>reg_date</code>, dan tanggal pendaftaran <b>sebelumnya</b> (alias <code>prev_reg_date</code>, NULL untuk baris pertama). Urut <code>reg_date</code>.',
     hint:'<code>LAG(reg_date) OVER(ORDER BY reg_date)</code>.',
     ordered:true,
     solution:"SELECT full_name, reg_date, LAG(reg_date) OVER(ORDER BY reg_date) AS prev_reg_date FROM registrations ORDER BY reg_date"},

    {id:'win_val-02', topic:'LEAD', level:'Sedang', title:'Tanggal Daftar Berikutnya',
     task:'Tampilkan <code>full_name</code>, <code>reg_date</code>, dan tanggal pendaftaran <b>berikutnya</b> (alias <code>next_reg_date</code>, NULL untuk baris terakhir). Urut <code>reg_date</code>.',
     hint:'<code>LEAD(reg_date) OVER(ORDER BY reg_date)</code>.',
     ordered:true,
     solution:"SELECT full_name, reg_date, LEAD(reg_date) OVER(ORDER BY reg_date) AS next_reg_date FROM registrations ORDER BY reg_date"},

    {id:'win_val-03', topic:'FIRST_VALUE', level:'Sedang', title:'Pendaftar Pertama per Kota',
     task:'Tampilkan <code>full_name</code>, <code>city</code>, <code>reg_date</code>, dan nama pendaftar <b>pertama</b> dari kota yang sama (alias <code>first_in_city</code>). Urut <code>city</code>, lalu <code>reg_date</code>.',
     hint:'<code>FIRST_VALUE(full_name) OVER(PARTITION BY city ORDER BY reg_date)</code>.',
     ordered:true,
     solution:"SELECT full_name, city, reg_date, FIRST_VALUE(full_name) OVER(PARTITION BY city ORDER BY reg_date) AS first_in_city FROM registrations ORDER BY city, reg_date"},

    {id:'win_val-04', topic:'LAST_VALUE', level:'Sulit', title:'Pendaftar Terakhir per Kota',
     task:'Tampilkan <code>full_name</code>, <code>city</code>, <code>reg_date</code>, dan nama pendaftar <b>terakhir</b> dari kota yang sama (alias <code>last_in_city</code>). Urut <code>city</code>, lalu <code>reg_date</code>.',
     hint:'<code>LAST_VALUE</code> butuh frame penuh: <code>LAST_VALUE(full_name) OVER(PARTITION BY city ORDER BY reg_date ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)</code>, kalau tidak nilainya sama dengan baris saat ini.',
     ordered:true,
     solution:"SELECT full_name, city, reg_date, LAST_VALUE(full_name) OVER(PARTITION BY city ORDER BY reg_date ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_in_city FROM registrations ORDER BY city, reg_date"},

    {id:'win_val-05', topic:'Month-over-month', level:'Sulit', title:'Pertumbuhan Pendaftar Bulanan',
     task:'Untuk tiap bulan (format <code>YYYY-MM</code>, alias <code>ym</code>), tampilkan jumlah pendaftar (<code>total</code>) dan selisihnya dari bulan sebelumnya (alias <code>mom_diff</code>). Urut <code>ym</code>.',
     hint:'Agregasi per bulan dulu di subquery (<code>strftime(\'%Y-%m\', reg_date)</code> + <code>GROUP BY</code>), baru pakai <code>LAG(total) OVER(ORDER BY ym)</code> di query luar.',
     ordered:true,
     solution:"SELECT ym, total, total - LAG(total) OVER(ORDER BY ym) AS mom_diff FROM (SELECT strftime('%Y-%m', reg_date) AS ym, COUNT(*) AS total FROM registrations GROUP BY ym) monthly ORDER BY ym"},
  ],
  // ---- Subqueries ---------------------------------------------------------
  subquery: [
    {id:'subquery-01', topic:'Subquery in FROM', level:'Sedang', title:'Kota Ramai (≥3 Pendaftar)',
     task:'Pakai subquery di <code>FROM</code> untuk hitung jumlah pendaftar per <code>city</code>, lalu tampilkan hanya kota dengan total <b>≥ 3</b> (alias <code>total</code>). Urut <code>total</code> menurun, lalu <code>city</code>.',
     hint:'<code>FROM (SELECT city, COUNT(*) AS total FROM registrations GROUP BY city) t WHERE total >= 3</code> — filter setelah agregasi dilakukan di subquery.',
     ordered:true,
     solution:"SELECT city, total FROM (SELECT city, COUNT(*) AS total FROM registrations GROUP BY city) t WHERE total >= 3 ORDER BY total DESC, city"},

    {id:'subquery-02', topic:'Subquery in SELECT', level:'Sedang', title:'Bandingkan dengan Total Keseluruhan',
     task:'Untuk pendaftar <b>VIP</b>, tampilkan <code>full_name</code>, <code>company</code>, dan total keseluruhan pendaftar di semua tiket (alias <code>total_all</code>) sebagai kolom tambahan. Urut <code>full_name</code>.',
     hint:'Scalar subquery di daftar SELECT: <code>(SELECT COUNT(*) FROM registrations) AS total_all</code>.',
     ordered:true,
     solution:"SELECT full_name, company, (SELECT COUNT(*) FROM registrations) AS total_all FROM registrations WHERE ticket_type='VIP' ORDER BY full_name"},

    {id:'subquery-03', topic:'Subquery in WHERE', level:'Sedang', title:'Pendaftar Sebelum Rata-rata',
     task:'Tampilkan <code>full_name</code>, <code>reg_date</code> untuk pendaftar yang mendaftar <b>sebelum</b> tanggal rata-rata pendaftaran seluruh peserta. Urut <code>reg_date</code>.',
     hint:'<code>WHERE julianday(reg_date) < (SELECT AVG(julianday(reg_date)) FROM registrations)</code>.',
     ordered:true,
     solution:"SELECT full_name, reg_date FROM registrations WHERE julianday(reg_date) < (SELECT AVG(julianday(reg_date)) FROM registrations) ORDER BY reg_date"},

    {id:'subquery-04', topic:'IN', level:'Mudah', title:'Registrant dari Company Exhibitor (via IN)',
     task:'Tampilkan <code>full_name</code>, <code>company</code> untuk pendaftar yang <code>company</code>-nya juga ada di tabel <code>exhibitors</code> — kali ini pakai <code>IN</code> + subquery, <b>bukan</b> JOIN. Urut <code>full_name</code>.',
     hint:'<code>WHERE company IN (SELECT company FROM exhibitors)</code>.',
     ordered:true,
     solution:"SELECT full_name, company FROM registrations WHERE company IN (SELECT company FROM exhibitors) ORDER BY full_name"},

    {id:'subquery-05', topic:'ANY / ALL', level:'Sulit', title:'Daftar Setelah Semua VIP',
     task:'SQLite tidak punya keyword <code>ANY</code>/<code>ALL</code> bawaan seperti T-SQL — padanannya pakai <code>MIN()</code>/<code>MAX()</code>. Tampilkan <code>full_name</code>, <code>reg_date</code> untuk pendaftar yang mendaftar <b>setelah SEMUA (ALL)</b> pendaftar VIP (yakni setelah tanggal VIP paling akhir). Urut <code>reg_date</code>.',
     hint:'<code>reg_date &gt; ALL (SELECT reg_date FROM ... WHERE ticket_type=\'VIP\')</code> secara standar SQL setara dengan <code>reg_date &gt; (SELECT MAX(reg_date) FROM ... WHERE ticket_type=\'VIP\')</code> di SQLite.',
     ordered:true,
     solution:"SELECT full_name, reg_date FROM registrations WHERE reg_date > (SELECT MAX(reg_date) FROM registrations WHERE ticket_type='VIP') ORDER BY reg_date"},

    {id:'subquery-06', topic:'Correlated', level:'Sulit', title:'Pendaftar Pertama per Kota (Correlated)',
     task:'Tanpa window function: tampilkan <code>full_name</code>, <code>city</code>, <code>reg_date</code> untuk pendaftar yang tanggalnya adalah yang <b>paling awal</b> di kotanya masing-masing, pakai <b>correlated subquery</b>. Urut <code>city</code>.',
     hint:'<code>WHERE reg_date = (SELECT MIN(reg_date) FROM registrations r2 WHERE r2.city = r.city)</code> — subquery merujuk ke tabel luar (<code>r.city</code>), makanya disebut "correlated".',
     ordered:true,
     solution:"SELECT full_name, city, reg_date FROM registrations r WHERE reg_date = (SELECT MIN(reg_date) FROM registrations r2 WHERE r2.city = r.city) ORDER BY city"},

    {id:'subquery-07', topic:'EXISTS', level:'Sedang', title:'Exhibitor yang Punya Registrant (via EXISTS)',
     task:'Tampilkan <code>company</code>, <code>booth_no</code> dari <code>exhibitors</code> yang punya <b>setidaknya satu</b> registrant dari company yang sama, pakai <code>EXISTS</code>. Urut <code>company</code>.',
     hint:'<code>WHERE EXISTS (SELECT 1 FROM registrations r WHERE r.company = e.company)</code>.',
     ordered:true,
     solution:"SELECT e.company, e.booth_no FROM exhibitors e WHERE EXISTS (SELECT 1 FROM registrations r WHERE r.company = e.company) ORDER BY e.company"},
  ],
  // ---- Common Table Expressions (CTE) -------------------------------------
  cte: [
    {id:'cte-01', topic:'Standalone CTE', level:'Mudah', title:'Kota Ramai (via CTE)',
     task:'Ulangi soal "Kota Ramai (≥3 Pendaftar)" — tapi kali ini pakai <code>WITH</code> (CTE), bukan subquery di FROM. Tampilkan <code>city</code>, <code>total</code> untuk kota dengan total ≥ 3. Urut <code>total</code> menurun, lalu <code>city</code>.',
     hint:'<code>WITH city_totals AS (SELECT city, COUNT(*) AS total FROM registrations GROUP BY city) SELECT ... FROM city_totals WHERE total &gt;= 3</code>.',
     ordered:true,
     solution:"WITH city_totals AS (SELECT city, COUNT(*) AS total FROM registrations GROUP BY city) SELECT city, total FROM city_totals WHERE total >= 3 ORDER BY total DESC, city"},

    {id:'cte-02', topic:'Multiple CTE', level:'Sedang', title:'Gabungkan Dua CTE',
     task:'Buat dua CTE terpisah: satu menghitung jumlah registrant per <code>company</code> (alias <code>total_registrant</code>), satu lagi daftar exhibitor. Gabungkan keduanya untuk tampilkan <code>company</code>, <code>total_registrant</code>, <code>booth_no</code> — hanya untuk company yang exhibitor <b>dan</b> punya registrant. Urut <code>company</code>.',
     hint:'<code>WITH reg_counts AS (...), exh AS (...) SELECT ... FROM exh JOIN reg_counts ON ...</code> — dua CTE dipisah koma setelah <code>WITH</code>.',
     ordered:true,
     solution:"WITH reg_counts AS (SELECT company, COUNT(*) AS total_registrant FROM registrations WHERE company IS NOT NULL GROUP BY company), exh AS (SELECT company, booth_no FROM exhibitors) SELECT exh.company, reg_counts.total_registrant, exh.booth_no FROM exh JOIN reg_counts ON reg_counts.company = exh.company ORDER BY exh.company"},

    {id:'cte-03', topic:'Nested CTE', level:'Sulit', title:'Selisih Check-in dari Rata-rata Kota',
     task:'Buat CTE pertama untuk total <code>checked_in</code> per <code>city</code>, lalu CTE kedua yang menghitung rata-rata dari CTE pertama. Tampilkan <code>city</code>, <code>total</code>, dan selisihnya dari rata-rata (alias <code>diff_from_avg</code>, dibulatkan 2 desimal). Urut <code>diff_from_avg</code> menurun, lalu <code>city</code>.',
     hint:'CTE kedua boleh mereferensikan CTE pertama: <code>WITH city_checkin AS (...), overall AS (SELECT AVG(total) AS avg_total FROM city_checkin) SELECT ...</code>.',
     ordered:true,
     solution:"WITH city_checkin AS (SELECT city, SUM(checked_in) AS total FROM registrations GROUP BY city), overall AS (SELECT AVG(total) AS avg_total FROM city_checkin) SELECT city_checkin.city, city_checkin.total, ROUND(city_checkin.total - overall.avg_total, 2) AS diff_from_avg FROM city_checkin, overall ORDER BY diff_from_avg DESC, city_checkin.city"},

    {id:'cte-04', topic:'Recursive CTE', level:'Sulit', title:'Date Spine Harian',
     task:'Buat deret tanggal harian (<b>date spine</b>) dari tanggal pendaftaran paling awal sampai paling akhir pakai <code>WITH RECURSIVE</code>, lalu <code>LEFT JOIN</code> ke <code>registrations</code> untuk hitung jumlah pendaftar per tanggal (0 kalau tidak ada). Tampilkan <code>cal_date</code>, <code>total</code>. Urut <code>cal_date</code>.',
     hint:'<code>WITH RECURSIVE date_spine(cal_date) AS (SELECT MIN(reg_date) FROM registrations UNION ALL SELECT date(cal_date,\'+1 day\') FROM date_spine WHERE cal_date &lt; (SELECT MAX(reg_date) FROM registrations)) SELECT ...</code>.',
     ordered:true,
     solution:"WITH RECURSIVE date_spine(cal_date) AS (SELECT MIN(reg_date) FROM registrations UNION ALL SELECT date(cal_date, '+1 day') FROM date_spine WHERE cal_date < (SELECT MAX(reg_date) FROM registrations)) SELECT ds.cal_date, COUNT(r.reg_id) AS total FROM date_spine ds LEFT JOIN registrations r ON r.reg_date = ds.cal_date GROUP BY ds.cal_date ORDER BY ds.cal_date"},
  ],
  // ---- Views ---------------------------------------------------------------
  // Sama seperti DDL: statement terakhir (dipisah ';') adalah SELECT verifikasi.
  views: [
    {id:'views-01', topic:'CREATE / DROP VIEW', level:'Mudah', title:'Buat lalu Hapus View',
     task:'Buat VIEW <code>vip_visitors</code> berisi <code>full_name</code>, <code>company</code>, <code>city</code> pendaftar VIP. Lalu <b>hapus lagi</b> VIEW tersebut. Verifikasi dengan <code>SELECT COUNT(*) AS masih_ada FROM sqlite_master WHERE type=\'view\' AND name=\'vip_visitors\';</code> (harus 0).',
     hint:'3 statement: <code>CREATE VIEW vip_visitors AS SELECT ...;</code> lalu <code>DROP VIEW vip_visitors;</code> lalu query verifikasi.',
     ordered:false,
     solution:"CREATE VIEW vip_visitors AS SELECT full_name, company, city FROM registrations WHERE ticket_type='VIP'; DROP VIEW vip_visitors; SELECT COUNT(*) AS masih_ada FROM sqlite_master WHERE type='view' AND name='vip_visitors'"},

    {id:'views-02', topic:'Hide complexity', level:'Sedang', title:'Sembunyikan Agregasi di Balik View',
     task:'Buat VIEW <code>city_summary</code> yang isinya <code>city</code> dan jumlah pendaftar per kota (<code>total</code>) — jadi siapapun bisa <code>SELECT * FROM city_summary</code> tanpa perlu tahu logic <code>GROUP BY</code> di baliknya. Verifikasi dengan <code>SELECT * FROM city_summary WHERE total >= 3 ORDER BY total DESC, city;</code>',
     hint:'Statement 1: <code>CREATE VIEW city_summary AS SELECT city, COUNT(*) AS total FROM registrations GROUP BY city;</code>. Statement 2: query verifikasi.',
     ordered:true,
     solution:"CREATE VIEW city_summary AS SELECT city, COUNT(*) AS total FROM registrations GROUP BY city; SELECT * FROM city_summary WHERE total >= 3 ORDER BY total DESC, city"},

    {id:'views-03', topic:'Central logic', level:'Sedang', title:'View sebagai Logic Terpusat',
     task:'Buat VIEW <code>exhibitor_registrants</code> yang menyimpan logic JOIN antara <code>exhibitors</code> dan <code>registrations</code> (company yang exhibitor sekaligus punya registrant): <code>company</code>, <code>booth_no</code>, <code>full_name</code>. Dengan begitu JOIN-nya tidak perlu ditulis ulang di tiap laporan. Verifikasi dengan <code>SELECT * FROM exhibitor_registrants ORDER BY company, full_name;</code>',
     hint:'Statement 1: <code>CREATE VIEW exhibitor_registrants AS SELECT e.company, e.booth_no, r.full_name FROM exhibitors e JOIN registrations r ON r.company = e.company;</code>. Statement 2: query verifikasi.',
     ordered:true,
     solution:"CREATE VIEW exhibitor_registrants AS SELECT e.company, e.booth_no, r.full_name FROM exhibitors e JOIN registrations r ON r.company = e.company; SELECT * FROM exhibitor_registrants ORDER BY company, full_name"},
  ],
  // ---- CTAS & TEMP Tables -------------------------------------------------
  // Sama seperti DDL: statement terakhir (dipisah ';') adalah SELECT verifikasi.
  ctas: [
    {id:'ctas-01', topic:'CREATE TABLE AS', level:'Mudah', title:'Snapshot Pendaftar VIP',
     task:'Buat tabel baru <code>vip_snapshot</code> berisi <code>full_name</code>, <code>company</code>, <code>city</code> dari pendaftar VIP, pakai <code>CREATE TABLE ... AS SELECT</code>. Verifikasi dengan <code>SELECT * FROM vip_snapshot ORDER BY full_name;</code>',
     hint:'Statement 1: <code>CREATE TABLE vip_snapshot AS SELECT full_name, company, city FROM registrations WHERE ticket_type=\'VIP\';</code>. Statement 2: query verifikasi.',
     ordered:true,
     solution:"CREATE TABLE vip_snapshot AS SELECT full_name, company, city FROM registrations WHERE ticket_type='VIP'; SELECT * FROM vip_snapshot ORDER BY full_name"},

    {id:'ctas-02', topic:'TEMP tables', level:'Sedang', title:'Tabel Sementara Sudah Check-in',
     task:'Buat <b>TEMP TABLE</b> <code>temp_checkedin</code> berisi <code>full_name</code>, <code>city</code> dari pendaftar yang sudah check-in. Verifikasi dengan <code>SELECT COUNT(*) AS total FROM temp_checkedin;</code>',
     hint:'Statement 1: <code>CREATE TEMP TABLE temp_checkedin AS SELECT full_name, city FROM registrations WHERE checked_in=1;</code>. Statement 2: query verifikasi.',
     ordered:false,
     solution:"CREATE TEMP TABLE temp_checkedin AS SELECT full_name, city FROM registrations WHERE checked_in=1; SELECT COUNT(*) AS total FROM temp_checkedin"},

    {id:'ctas-03', topic:'Snapshots', level:'Sedang', title:'Snapshot Jumlah Pendaftar per Event',
     task:'Untuk laporan harian, ambil snapshot jumlah pendaftar per <code>event</code> ke tabel baru <code>event_snapshot</code> (<code>event</code>, <code>total</code>). Verifikasi dengan <code>SELECT * FROM event_snapshot ORDER BY event;</code>',
     hint:'Statement 1: <code>CREATE TABLE event_snapshot AS SELECT event, COUNT(*) AS total FROM registrations GROUP BY event;</code>. Statement 2: query verifikasi.',
     ordered:true,
     solution:"CREATE TABLE event_snapshot AS SELECT event, COUNT(*) AS total FROM registrations GROUP BY event; SELECT * FROM event_snapshot ORDER BY event"},
  ],
  // ---- Project — EDA -------------------------------------------------------
  proj_eda: [
    {id:'proj_eda-01', topic:'Database exploration', level:'Mudah', title:'Tabel Apa Saja di Database Ini?',
     task:'Langkah pertama EDA: eksplorasi struktur database. Tampilkan nama semua tabel yang ada, urut abjad.',
     hint:'<code>SELECT name FROM sqlite_master WHERE type=\'table\' ORDER BY name;</code>',
     ordered:true,
     solution:"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"},

    {id:'proj_eda-02', topic:'Dimensions vs measures', level:'Sedang', title:'Pisahkan Dimensi & Measure',
     task:'<code>ticket_type</code> adalah <b>dimensi</b> (kategori); jumlah pendaftar & jumlah check-in adalah <b>measure</b> (angka). Tampilkan <code>ticket_type</code>, <code>total_pendaftar</code>, dan <code>total_checkin</code> per tipe tiket. Urut <code>ticket_type</code>.',
     hint:'<code>GROUP BY ticket_type</code> dengan dua measure: <code>COUNT(*)</code> dan <code>SUM(checked_in)</code>.',
     ordered:true,
     solution:"SELECT ticket_type, COUNT(*) AS total_pendaftar, SUM(checked_in) AS total_checkin FROM registrations GROUP BY ticket_type ORDER BY ticket_type"},

    {id:'proj_eda-03', topic:'Magnitude analysis', level:'Sedang', title:'Minat Produk Terbesar',
     task:'Analisis magnitude: tampilkan <code>product_interest</code> dan jumlah pendaftarnya (<code>total</code>), urut dari yang <b>paling diminati</b>.',
     hint:'<code>GROUP BY product_interest ORDER BY total DESC</code>.',
     ordered:true,
     solution:"SELECT product_interest, COUNT(*) AS total FROM registrations GROUP BY product_interest ORDER BY total DESC, product_interest"},

    {id:'proj_eda-04', topic:'Ranking analysis', level:'Sedang', title:'Top 5 Kota Asal Pendaftar',
     task:'Analisis ranking: tampilkan <b>5 kota</b> dengan jumlah pendaftar terbanyak (<code>city</code>, <code>total</code>), urut <code>total</code> menurun (kalau seri, urut <code>city</code>).',
     hint:'<code>GROUP BY city ORDER BY total DESC, city LIMIT 5</code>.',
     ordered:true,
     solution:"SELECT city, COUNT(*) AS total FROM registrations GROUP BY city ORDER BY total DESC, city LIMIT 5"},

    {id:'proj_eda-05', topic:'Date range exploration', level:'Mudah', title:'Rentang Tanggal Pendaftaran',
     task:'Analisis rentang tanggal: tampilkan tanggal pendaftaran paling awal (<code>earliest</code>), paling akhir (<code>latest</code>), dan rentang harinya (alias <code>days_span</code>) dari seluruh data.',
     hint:'<code>MIN(reg_date)</code>, <code>MAX(reg_date)</code>, dan <code>julianday(MAX(reg_date)) - julianday(MIN(reg_date))</code> buat selisih harinya.',
     ordered:false,
     solution:"SELECT MIN(reg_date) AS earliest, MAX(reg_date) AS latest, CAST(julianday(MAX(reg_date)) - julianday(MIN(reg_date)) AS INTEGER) AS days_span FROM registrations"},
  ],
  // ---- Project — Advanced Analytics ----------------------------------------
  proj_adv: [
    {id:'proj_adv-01', topic:'Change over time', level:'Sedang', title:'Tren Pendaftaran Mingguan',
     task:'Tampilkan jumlah pendaftar per minggu (format tahun-minggu <code>%Y-%W</code>, alias <code>week</code>) untuk melihat tren dari waktu ke waktu. Urut <code>week</code>.',
     hint:'<code>strftime(\'%Y-%W\', reg_date)</code> mengelompokkan tanggal ke nomor minggu dalam tahun.',
     ordered:true,
     solution:"SELECT strftime('%Y-%W', reg_date) AS week, COUNT(*) AS total FROM registrations GROUP BY week ORDER BY week"},

    {id:'proj_adv-02', topic:'Cumulative analysis', level:'Sedang', title:'Kumulatif Pendaftar per Event',
     task:'Tampilkan <code>event</code>, <code>reg_date</code>, dan jumlah kumulatif pendaftar <b>di dalam event tersebut</b> sampai tanggal itu (alias <code>cumulative_in_event</code>). Urut <code>event</code>, lalu <code>reg_date</code>.',
     hint:'<code>COUNT(*) OVER(PARTITION BY event ORDER BY reg_date)</code> — kumulatif di-reset per event.',
     ordered:true,
     solution:"SELECT event, reg_date, COUNT(*) OVER(PARTITION BY event ORDER BY reg_date) AS cumulative_in_event FROM registrations ORDER BY event, reg_date"},

    {id:'proj_adv-06', topic:'Performance analysis', level:'Sulit', title:'Bulan di Atas/Bawah Rata-rata',
     task:'Analisis performa: untuk tiap bulan (<code>ym</code>), tampilkan jumlah pendaftar (<code>total</code>) dan bandingkan dengan rata-rata bulanan keseluruhan (alias <code>vs_avg</code>: <code>\'Di Atas Rata-rata\'</code> / <code>\'Di Bawah Rata-rata\'</code> / <code>\'Rata-rata\'</code>). Urut <code>ym</code>.',
     hint:'CTE pertama hitung total per bulan, CTE kedua hitung rata-ratanya, lalu <code>CASE WHEN total > avgtotal THEN ... WHEN total &lt; avgtotal THEN ... ELSE ... END</code>.',
     ordered:true,
     solution:"WITH monthly AS (SELECT strftime('%Y-%m', reg_date) AS ym, COUNT(*) AS total FROM registrations GROUP BY ym), avgcalc AS (SELECT AVG(total) AS avgtotal FROM monthly) SELECT ym, total, CASE WHEN total > avgtotal THEN 'Di Atas Rata-rata' WHEN total < avgtotal THEN 'Di Bawah Rata-rata' ELSE 'Rata-rata' END AS vs_avg FROM monthly, avgcalc ORDER BY ym"},

    {id:'proj_adv-03', topic:'Part-to-whole', level:'Sedang', title:'Persentase per Tipe Tiket',
     task:'Tampilkan <code>ticket_type</code>, jumlahnya (<code>total</code>), dan persentase dari keseluruhan pendaftar (alias <code>pct_of_total</code>, dibulatkan 1 desimal). Urut <code>total</code> menurun.',
     hint:'<code>ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM registrations), 1)</code> — pakai <code>100.0</code> (bukan <code>100</code>) supaya pembagiannya tidak dibulatkan integer duluan.',
     ordered:true,
     solution:"SELECT ticket_type, COUNT(*) AS total, ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM registrations), 1) AS pct_of_total FROM registrations GROUP BY ticket_type ORDER BY total DESC"},

    {id:'proj_adv-04', topic:'Segmentation', level:'Sedang', title:'Segmentasi Status Check-in',
     task:'Segmentasikan pendaftar jadi <code>\'Checked-in\'</code> atau <code>\'Belum Check-in\'</code> (alias <code>segment</code>), lalu tampilkan tiap segmen dengan jumlahnya (<code>total</code>). Urut <code>total</code> menurun.',
     hint:'<code>CASE WHEN checked_in=1 THEN \'Checked-in\' ELSE \'Belum Check-in\' END</code> lalu <code>GROUP BY</code> hasil CASE-nya.',
     ordered:true,
     solution:"SELECT CASE WHEN checked_in=1 THEN 'Checked-in' ELSE 'Belum Check-in' END AS segment, COUNT(*) AS total FROM registrations GROUP BY segment ORDER BY total DESC"},

    {id:'proj_adv-05', topic:'Customer & product reports', level:'Sulit', title:'Laporan Ringkas per Company',
     task:'Buat laporan ringkas per <code>company</code> (anggap sebagai "customer"): <code>company</code>, jumlah pendaftar (<code>total_registrant</code>), dan daftar <code>product_interest</code> unik mereka digabung jadi satu string dipisah koma (alias <code>products</code>) — hanya untuk company dengan <b>lebih dari 1</b> pendaftar. Urut <code>company</code>.',
     hint:'<code>GROUP_CONCAT(product_interest, \', \')</code> untuk gabung string; bungkus dengan subquery ber-<code>DISTINCT</code> + <code>ORDER BY</code> supaya urutan gabungannya konsisten. Filter jumlah pendaftar pakai <code>HAVING COUNT(*) > 1</code>.',
     ordered:true,
     solution:"SELECT company, COUNT(*) AS total_registrant, (SELECT GROUP_CONCAT(product_interest, ', ') FROM (SELECT DISTINCT product_interest FROM registrations r2 WHERE r2.company = r.company ORDER BY product_interest)) AS products FROM registrations r WHERE company IS NOT NULL GROUP BY company HAVING COUNT(*) > 1 ORDER BY company"},

    {id:'proj_adv-07', topic:'Customer & product reports', level:'Sedang', title:'Laporan Ringkas per Produk',
     task:'Kali ini dari sisi "produk": buat laporan ringkas per <code>product_interest</code> — jumlah peminat (<code>total_interest</code>) dan jumlah yang sudah check-in (<code>total_checkin</code>). Urut <code>total_interest</code> menurun.',
     hint:'<code>GROUP BY product_interest</code> dengan <code>COUNT(*)</code> dan <code>SUM(checked_in)</code>.',
     ordered:true,
     solution:"SELECT product_interest, COUNT(*) AS total_interest, SUM(checked_in) AS total_checkin FROM registrations GROUP BY product_interest ORDER BY total_interest DESC"},
  ],
};
