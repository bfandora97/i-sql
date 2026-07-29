// ===========================================================================
// app.js — engine skeleton.  Depends (load order in index.html):
//   sql-wasm.js (CDN) -> data.js -> curriculum.js -> problems.js -> app.js
//
// This is a KERANGKA. The boot sequence + helpers are wired; the functions
// marked  // TODO  are yours to build in VS Code / Claude Code CLI.
// Reference behaviour you already saw in the prototype is described inline.
// ===========================================================================

const $  = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));

let db = null;
let current = null;                 // current problem object
const solved = loadProgress();      // Set of solved problem ids (persisted)

// --- boot -------------------------------------------------------------------
initSqlJs({ locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${f}` })
  .then(SQL => {
    db = new SQL.Database();
    db.run(DATA_SQL);
    $('loader').style.display = 'none';
    $('app').style.display = 'grid';
    buildSchema();
    buildNav();
    refreshProgress();
    for (const mod of CURRICULUM) {
      const probs = PROBLEM_BANK[mod.id];
      if (probs && probs.length) { selectProblem(probs[0]); break; }
    }
  })
  .catch(err => {
    $('loader').innerHTML = '⚠ Gagal memuat mesin SQL. Cek koneksi lalu muat ulang.<br><small>' + esc(String(err)) + '</small>';
  });

// --- schema panel (done) ----------------------------------------------------
function buildSchema() {
  $('schBody').innerHTML = SCHEMA
    .map(r => `<tr><td class="ty">${esc(r[0])}</td><td class="col">${r[1]}</td><td class="ty">${r[2]}</td><td>${esc(r[3])}</td></tr>`)
    .join('');
}

// --- navigation from CURRICULUM ---------------------------------------------
// TODO: render the left nav grouped by module.
//   - Loop CURRICULUM. For each module, render a section header (module name).
//   - For modules with problems in PROBLEM_BANK[module.id], render a chip per
//     problem (label "Q" + index, or the topic). Wire onclick -> selectProblem.
//   - For engine:'tsql' / 'concept' modules, render the `note` as a muted
//     "study only" tag instead of chips.
//   - Mark solved chips (solved.has(problem.id)) with the .solved class.
function buildNav() {
  const parts = [];
  CURRICULUM.forEach(mod => {
    parts.push(`<h2>${esc(mod.module)}</h2>`);
    if (mod.engine === 'tsql' || mod.engine === 'concept') {
      parts.push(`<div class="hint">${esc(mod.note || 'Materi teori — tidak ada soal interaktif di app ini.')}</div>`);
      return;
    }
    const probs = PROBLEM_BANK[mod.id] || [];
    if (!probs.length) {
      parts.push(`<div class="hint">Belum ada soal untuk modul ini.</div>`);
      return;
    }
    const chips = probs.map((p, i) => {
      const cls = 'chip' + (solved.has(p.id) ? ' solved' : '');
      return `<span class="${cls}" data-id="${esc(p.id)}">Q${i + 1}</span>`;
    }).join('');
    parts.push(`<div class="chips">${chips}</div>`);
  });
  $('nav').innerHTML = parts.join('');
  $('nav').querySelectorAll('.chip').forEach(chip => {
    chip.onclick = () => {
      const problem = findProblemById(chip.dataset.id);
      if (problem) selectProblem(problem);
    };
  });
}

function findProblemById(id) {
  for (const mod of CURRICULUM) {
    const probs = PROBLEM_BANK[mod.id] || [];
    const p = probs.find(x => x.id === id);
    if (p) return p;
  }
  return null;
}

// --- select & display a problem ---------------------------------------------
// TODO: given a problem object, fill #ptitle, #task, #hint, #keyq, #lvl,
//   reset the editor + verdict + result, set `current`, refresh chip states.
function selectProblem(problem) {
  current = problem;

  $('lvl').textContent = problem.level;
  $('lvl').className = 'level ' + problem.level;
  const num = problem.id.split('-').pop().replace(/^0+/, '') || '0';
  $('ptitle').textContent = `Q${num} — ${problem.title}`;
  $('task').innerHTML = problem.task;
  $('hint').innerHTML = problem.hint;
  $('keyq').textContent = problem.solution + ';';
  $('keyq').style.display = 'none';
  $('hintBox').open = false;

  $('ed').value = '';
  $('verdict').className = 'verdict';
  $('resultwrap').style.display = 'none';

  $('nav').querySelectorAll('.chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.id === problem.id);
  });
}

// --- run the editor query and grade it --------------------------------------
// TODO: implement using the helpers below.
//   1. read #ed value; if empty -> showVerdict('err', ...).
//   2. db.run(DATA_SQL) to reset state (so DML/DDL practice can't corrupt db).
//   3. try db.exec(sql); on throw -> showVerdict('err', message).
//   4. renderResult(gridOf(res)).
//   5. db.run(DATA_SQL) again, exec current.solution, gridOf() it.
//   6. verdict = judge(userGrid, solutionGrid, current.ordered).
//   7. if ok -> solved.add(current.id); saveProgress(); refreshProgress().
function runQuery() {
  if (!current) { showVerdict('err', 'Pilih soal dulu dari daftar di kiri.'); return; }

  const sql = $('ed').value.trim();
  if (!sql) { showVerdict('err', 'Query masih kosong.'); return; }

  db.run(DATA_SQL);
  let res;
  try {
    res = db.exec(sql);
  } catch (e) {
    showVerdict('err', esc(e.message));
    return;
  }
  const userGrid = gridOf(res);
  renderResult(userGrid);

  db.run(DATA_SQL);
  const solGrid = gridOf(db.exec(current.solution));

  const verdict = judge(userGrid, solGrid, current.ordered);
  if (verdict.ok) {
    solved.add(current.id);
    saveProgress();
    refreshProgress();
  }
  showVerdict(verdict.ok ? 'ok' : 'no', verdict.msg);
}

// --- helpers: shape a db.exec() result into {cols, rows} (done) --------------
function gridOf(execRes) {
  if (!execRes || !execRes.length) return { cols: [], rows: [] };
  const r = execRes[execRes.length - 1];
  return { cols: r.columns.slice(), rows: r.values.map(row => row.slice()) };
}

// --- grader (done — port from prototype; tweak messages as you like) ---------
function judge(userG, solG, ordered) {
  if (userG.cols.length === 0 && userG.rows.length === 0)
    return { ok:false, msg:'Query valid tapi <b>0 baris cocok</b>. Cek ejaan/huruf nilai di WHERE (case-sensitive).' };
  if (userG.cols.length !== solG.cols.length)
    return { ok:false, msg:`Jumlah kolom beda — butuh <b>${solG.cols.length}</b>, kamu <b>${userG.cols.length}</b>.` };
  if (userG.rows.length !== solG.rows.length)
    return { ok:false, msg:`Jumlah baris beda — harusnya <b>${solG.rows.length}</b>, kamu <b>${userG.rows.length}</b>.` };
  const key = rows => rows.map(r => r.map(c => c === null ? '\u2400' : String(c)).join('\u0001'));
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

// --- result table (done) ----------------------------------------------------
function renderResult(g) {
  $('resultwrap').style.display = 'block';
  $('resmeta').textContent = `${g.rows.length} baris · ${g.cols.length} kolom`;
  if (!g.cols.length) { $('res').innerHTML = '<tr><td style="padding:12px;color:var(--dim)">(tidak ada kolom)</td></tr>'; return; }
  const head = '<tr>' + g.cols.map(c => `<th>${esc(c)}</th>`).join('') + '</tr>';
  const body = g.rows.slice(0, 200).map(r =>
    '<tr>' + r.map(c => c === null ? '<td class="null">NULL</td>' : `<td>${esc(c)}</td>`).join('') + '</tr>'
  ).join('');
  $('res').innerHTML = head + body;
}

// --- verdict banner (done) --------------------------------------------------
function showVerdict(kind, html) {
  const v = $('verdict'); v.className = 'verdict show ' + kind;
  $('vico').textContent = kind === 'ok' ? '✅' : (kind === 'err' ? '⚠️' : '❌');
  $('vtxt').innerHTML = html;
}

// --- progress persistence (done — localStorage, safe fallback) --------------
function loadProgress() {
  try { return new Set(JSON.parse(localStorage.getItem('sqp_solved') || '[]')); }
  catch { return new Set(); }
}
function saveProgress() {
  try { localStorage.setItem('sqp_solved', JSON.stringify([...solved])); } catch {}
}
function resetProgress() {
  solved.clear(); saveProgress(); refreshProgress();
  $('nav').querySelectorAll('.chip.solved').forEach(chip => chip.classList.remove('solved'));
}
function refreshProgress() {
  $('solvedN').textContent = solved.size;

  const allProblems = Object.values(PROBLEM_BANK).flat();
  $('strip').innerHTML = allProblems.map(p =>
    `<span class="dot${solved.has(p.id) ? ' on' : ''}"></span>`
  ).join('');

  $('nav').querySelectorAll('.chip').forEach(chip => {
    chip.classList.toggle('solved', solved.has(chip.dataset.id));
  });
}

// --- wire toolbar buttons (partly done) -------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  $('runBtn')   && ($('runBtn').onclick   = runQuery);
  $('clearBtn') && ($('clearBtn').onclick = () => { $('ed').value=''; $('verdict').className='verdict'; $('resultwrap').style.display='none'; $('ed').focus(); });
  $('peekBtn')  && ($('peekBtn').onclick  = () => { $('ed').value='SELECT * FROM registrations LIMIT 5;'; runQuery(); });
  $('resetBtn') && ($('resetBtn').onclick = resetProgress);
  $('revealBtn') && ($('revealBtn').onclick = () => {
    $('keyq').style.display = $('keyq').style.display === 'none' ? 'block' : 'none';
  });
  const ed = $('ed');
  if (ed) ed.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runQuery(); }
    if (e.key === 'Tab') { e.preventDefault(); const s=ed.selectionStart, en=ed.selectionEnd;
      ed.value = ed.value.slice(0,s) + '  ' + ed.value.slice(en); ed.selectionStart = ed.selectionEnd = s+2; }
  });
});
