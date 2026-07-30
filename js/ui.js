// ===========================================================================
// ui.js — everything that renders/reads the DOM outside the grader itself:
// schema table, nav accordion, problem selection, sidebar height sync,
// verdict/result rendering, and the editor's auto-uppercase + column
// suggestion helpers. Depends on utils.js ($ / esc) and the data/curriculum/
// problems globals. Reads/writes the shared state vars declared in app.js
// (current, solved, displayNum).
// ===========================================================================

// --- schema panel ------------------------------------------------------------
function buildSchema() {
  let lastTable = null;
  $('schBody').innerHTML = SCHEMA.map(r => {
    const isNewTable = r[0] !== lastTable;
    lastTable = r[0];
    const cls = isNewTable ? ' class="tablestart"' : '';
    const tableCell = isNewTable ? `<span class="tablepill">${esc(r[0])}</span>` : '';
    return `<tr${cls}><td>${tableCell}</td><td class="col">${r[1]}</td><td class="ty">${r[2]}</td><td>${esc(r[3])}</td></tr>`;
  }).join('');
}

// --- navigation from CURRICULUM ---------------------------------------------
function buildNav() {
  const openModId = current ? findModuleIdForProblem(current.id) : firstPracticeableModuleId();

  const parts = [];
  CURRICULUM.forEach(mod => {
    const openAttr = mod.id === openModId ? ' open' : '';
    const modProbs = PROBLEM_BANK[mod.id] || [];
    const modComplete = modProbs.length > 0 && modProbs.every(p => solved.has(p.id));
    const modCls = modComplete ? ' modsec complete' : ' modsec';
    const check = modComplete ? '<span class="modcheck">✓</span> ' : '';
    parts.push(`<details class="${modCls.trim()}"${openAttr} data-modid="${esc(mod.id)}"><summary>${check}${esc(mod.module)}</summary>`);

    if (mod.engine === 'tsql' || mod.engine === 'concept') {
      parts.push(`<div class="hint">${esc(mod.note || 'Materi teori — tidak ada soal interaktif di app ini.')}</div>`);
    } else {
      const probs = modProbs;
      if (!probs.length) {
        parts.push(`<div class="hint">Belum ada soal untuk modul ini.</div>`);
      } else {
        // group chips by topic (sub-bab), in the order topics are listed in curriculum.js
        const byTopic = {};
        probs.forEach(p => (byTopic[p.topic] = byTopic[p.topic] || []).push(p));
        const topicOrder = (mod.topics && mod.topics.length) ? mod.topics : Object.keys(byTopic);
        let qnum = 0;
        topicOrder.filter(t => byTopic[t]).forEach(topic => {
          const chips = byTopic[topic].map(p => {
            qnum++;
            displayNum[p.id] = qnum;
            const cls = 'chip' + (solved.has(p.id) ? ' solved' : '');
            return `<span class="${cls}" data-id="${esc(p.id)}">Q${qnum} — ${esc(p.title)}</span>`;
          }).join('');
          parts.push(`<div class="subtopic">${esc(topic)}</div><div class="chips">${chips}</div>`);
        });
      }
    }
    parts.push('</details>');
  });
  $('nav').innerHTML = parts.join('');

  // accordion: opening one module (bab) closes the others
  const sections = $('nav').querySelectorAll('details.modsec');
  sections.forEach(sec => {
    sec.addEventListener('toggle', () => {
      if (sec.open) sections.forEach(other => { if (other !== sec) other.open = false; });
    });
  });

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

function findModuleIdForProblem(problemId) {
  for (const mod of CURRICULUM) {
    const probs = PROBLEM_BANK[mod.id] || [];
    if (probs.some(p => p.id === problemId)) return mod.id;
  }
  return null;
}

function firstPracticeableModuleId() {
  for (const mod of CURRICULUM) {
    const probs = PROBLEM_BANK[mod.id];
    if (probs && probs.length) return mod.id;
  }
  return null;
}

// --- "next problem" — same order as the nav (module -> topic -> problem) ----
function getOrderedProblems() {
  const list = [];
  CURRICULUM.forEach(mod => {
    const probs = PROBLEM_BANK[mod.id] || [];
    if (!probs.length) return;
    const byTopic = {};
    probs.forEach(p => (byTopic[p.topic] = byTopic[p.topic] || []).push(p));
    const topicOrder = (mod.topics && mod.topics.length) ? mod.topics : Object.keys(byTopic);
    topicOrder.filter(t => byTopic[t]).forEach(topic => byTopic[topic].forEach(p => list.push(p)));
  });
  return list;
}

function goToNextProblem() {
  if (!current) return;
  const list = getOrderedProblems();
  const idx = list.findIndex(p => p.id === current.id);
  if (idx === -1) return;
  selectProblem(list[(idx + 1) % list.length]);
}

// --- select & display a problem ---------------------------------------------
function selectProblem(problem) {
  current = problem;

  $('lvl').textContent = problem.level;
  $('lvl').className = 'level ' + problem.level;
  const num = displayNum[problem.id] || problem.id.split('-').pop().replace(/^0+/, '') || '0';
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

  renderExamplePreview(problem);
  $('ptitle').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  syncSidebarHeight();
}

// --- example preview: run the solution quietly, show the first few rows so
//     students see the expected shape/format before writing their own query.
function renderExamplePreview(problem) {
  if (!db) { $('examplewrap').style.display = 'none'; return; }
  try {
    resetDb();
    const g = gridOf(db.exec(problem.solution));
    resetDb(); // leave a genuinely clean db for whatever runs next (runQuery, etc.)
    if (!g.cols.length) { $('examplewrap').style.display = 'none'; return; }
    const previewRows = g.rows.slice(0, 3);
    const head = '<tr>' + g.cols.map(c => `<th>${esc(c)}</th>`).join('') + '</tr>';
    const body = previewRows.map(r =>
      '<tr>' + r.map(c => c === null ? '<td class="null">NULL</td>' : `<td>${esc(c)}</td>`).join('') + '</tr>'
    ).join('');
    $('exampleRes').innerHTML = head + body;
    $('examplewrap').style.display = 'block';
  } catch {
    $('examplewrap').style.display = 'none';
  }
}

// --- Materi sidebar always matches the question card's height, so both
//     columns line up instead of the sidebar running its own (viewport) height.
function syncSidebarHeight() {
  const card = document.querySelector('.maincol .card');
  const fullnav = document.querySelector('.fullnav');
  if (card && fullnav) fullnav.style.maxHeight = card.getBoundingClientRect().height + 'px';
}

// --- result table -------------------------------------------------------------
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

// --- verdict banner ------------------------------------------------------------
function showVerdict(kind, html) {
  const v = $('verdict'); v.className = 'verdict show ' + kind;
  $('vico').textContent = kind === 'ok' ? '✅' : (kind === 'err' ? '⚠️' : '❌');
  $('vtxt').innerHTML = html;
}

// --- auto-uppercase SQL keywords as you type (textarea can't do bold/color) --
const SQL_KEYWORDS = new Set(['SELECT','FROM','WHERE','AND','OR','NOT','ORDER','BY','GROUP','HAVING',
  'LIMIT','DISTINCT','JOIN','INNER','LEFT','RIGHT','FULL','OUTER','CROSS','ON','AS','IN','BETWEEN','LIKE',
  'IS','NULL','INSERT','INTO','VALUES','UPDATE','SET','DELETE','CREATE','TABLE','ALTER','DROP','ADD',
  'COLUMN','VIEW','WITH','RECURSIVE','UNION','ALL','EXCEPT','INTERSECT','CASE','WHEN','THEN','ELSE','END',
  'ASC','DESC','TOP','EXISTS','ANY','COUNT','SUM','AVG','MIN','MAX','OVER','PARTITION','ROWS','RANGE',
  'PRECEDING','FOLLOWING','CURRENT','ROW','TEMP','TEMPORARY']);

function autoUppercaseKeyword(ed) {
  const val = ed.value;
  const pos = ed.selectionStart;
  if (pos === 0 || pos !== ed.selectionEnd) return;
  const lastChar = val[pos - 1];
  if (!/[\s,();]/.test(lastChar)) return;
  let start = pos - 2;
  while (start >= 0 && /[A-Za-z_]/.test(val[start])) start--;
  start++;
  const word = val.slice(start, pos - 1);
  if (word && SQL_KEYWORDS.has(word.toUpperCase()) && word !== word.toUpperCase()) {
    ed.value = val.slice(0, start) + word.toUpperCase() + val.slice(pos - 1);
    ed.selectionStart = ed.selectionEnd = pos;
  }
}

// --- column/table name suggestions, shown below the editor -------------------
function getCurrentWord(ed) {
  const val = ed.value;
  const pos = ed.selectionStart;
  let start = pos;
  while (start > 0 && /[A-Za-z0-9_]/.test(val[start - 1])) start--;
  return { word: val.slice(start, pos), start, end: pos };
}

function showColumnSuggestions(ed) {
  const { word, start, end } = getCurrentWord(ed);
  if (word.length < 2) { hideColumnSuggestions(); return; }
  const names = [...new Set(SCHEMA.map(r => r[1]))];
  const tables = [...new Set(SCHEMA.map(r => r[0]))];
  const matches = [...tables, ...names].filter(n =>
    n.toLowerCase().startsWith(word.toLowerCase()) && n.toLowerCase() !== word.toLowerCase()
  ).slice(0, 8);
  if (!matches.length) { hideColumnSuggestions(); return; }
  $('colSuggest').innerHTML = matches.map(m => `<span class="col-suggest-item" data-val="${esc(m)}">${esc(m)}</span>`).join('');
  $('colSuggest').style.display = 'flex';
  $('colSuggest').querySelectorAll('.col-suggest-item').forEach(item => {
    item.onmousedown = (e) => {
      e.preventDefault();
      const val = ed.value;
      const insert = item.dataset.val;
      ed.value = val.slice(0, start) + insert + val.slice(end);
      ed.focus();
      const newPos = start + insert.length;
      ed.selectionStart = ed.selectionEnd = newPos;
      hideColumnSuggestions();
    };
  });
}

function hideColumnSuggestions() {
  $('colSuggest').style.display = 'none';
}
