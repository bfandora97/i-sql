// ===========================================================================
// grader.js — runs the user's SQL against sql.js and compares it to the
// problem's solution. Depends on utils.js ($ / esc) and ui.js
// (renderResult / showVerdict / syncSidebarHeight). Reads/writes the shared
// state vars declared in app.js (db, current, solved).
// ===========================================================================

function runQuery() {
  if (!current) { showVerdict('err', 'Pilih soal dulu dari daftar di kiri.'); return; }

  const sql = $('ed').value.trim();
  if (!sql) { showVerdict('err', 'Query masih kosong.'); return; }

  resetDb();
  let res;
  try {
    res = db.exec(sql);
  } catch (e) {
    showVerdict('err', esc(e.message));
    return;
  }
  const userGrid = gridOf(res);
  renderResult(userGrid);

  resetDb();
  const solGrid = gridOf(db.exec(current.solution));

  const verdict = judge(userGrid, solGrid, current.ordered);
  if (verdict.ok) {
    solved.add(current.id);
    saveProgress(current.id);
    refreshProgress();
  }
  showVerdict(verdict.ok ? 'ok' : 'no', verdict.msg);
  syncSidebarHeight();
}

// --- helpers: shape a db.exec() result into {cols, rows} ---------------------
function gridOf(execRes) {
  if (!execRes || !execRes.length) return { cols: [], rows: [] };
  const r = execRes[execRes.length - 1];
  return { cols: r.columns.slice(), rows: r.values.map(row => row.slice()) };
}

// --- grader --------------------------------------------------------------------
function judge(userG, solG, ordered) {
  if (userG.cols.length === 0 && userG.rows.length === 0)
    return { ok:false, msg:'Query valid tapi <b>0 baris cocok</b>. Cek ejaan/huruf nilai di WHERE (case-sensitive).' };
  if (userG.cols.length !== solG.cols.length)
    return { ok:false, msg:`Jumlah kolom beda — butuh <b>${solG.cols.length}</b>, kamu <b>${userG.cols.length}</b>.` };
  if (userG.rows.length !== solG.rows.length)
    return { ok:false, msg:`Jumlah baris beda — harusnya <b>${solG.rows.length}</b>, kamu <b>${userG.rows.length}</b>.` };
  const key = rows => rows.map(r => r.map(c => c === null ? '␀' : String(c)).join(''));
  const u = key(userG.rows), s = key(solG.rows);
  if (!ordered) {
    const us = u.slice().sort(), ss = s.slice().sort();
    for (let i = 0; i < us.length; i++) if (us[i] !== ss[i])
      return { ok:false, msg:'Jumlah baris pas, tapi ada nilai yang beda. Cek kolom & filter.' };
    return { ok:true, msg:'Mantap! Semua baris cocok. ✔' };
  }
  for (let i = 0; i < u.length; i++) if (u[i] !== s[i]) {
    const sameSet = u.slice().sort().join('|') === s.slice().sort().join('|');
    return { ok:false, msg: sameSet
      ? 'Datanya benar, tapi <b>urutan</b> belum sesuai. Cek ASC/DESC di ORDER BY.'
      : 'Ada baris yang beda dari yang diharapkan.' };
  }
  return { ok:true, msg:'Mantap! Baris & urutan pas. ✔' };
}
