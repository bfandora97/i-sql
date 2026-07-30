// ===========================================================================
// app.js — entry point. Loads last (after utils.js, ui.js, grader.js,
// progress.js). Owns the shared state vars, boots the app, and wires up
// toolbar/editor event listeners.
// ===========================================================================

let db = null;
let current = null;                 // current problem object
let solved = new Set();             // Set of solved problem ids (persisted)
let displayNum = {};                // problem.id -> Q-number shown in nav (topic display order)

// --- boot -------------------------------------------------------------------
// Login is required: the app only loads once a Supabase session exists.
// Any sign-in/sign-out reloads the page so the gate/app state is always correct.
window.onAuthChange = () => location.reload();

async function boot() {
  try { await initAuth(); } catch {}

  if (!currentUser) {
    $('loader').style.display = 'none';
    $('authgate').style.display = 'block';
    return;
  }

  solved = await loadProgress();

  initSqlJs({ locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${f}` })
    .then(SQL => {
      db = new SQL.Database();
      db.run(DATA_SQL);
      $('loader').style.display = 'none';
      $('app').style.display = 'flex';
      $('materibar').style.display = 'flex';
      $('navToggleBtn').onclick = () => {
        $('sidebar').classList.toggle('open');
        syncSidebarHeight();
      };
      window.addEventListener('resize', syncSidebarHeight);
      $('sidebar').classList.add('open');
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
}
boot();

// --- wire toolbar buttons -----------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  $('runBtn')   && ($('runBtn').onclick   = runQuery);
  $('clearBtn') && ($('clearBtn').onclick = () => { $('ed').value=''; $('verdict').className='verdict'; $('resultwrap').style.display='none'; $('ed').focus(); });
  $('peekBtn')  && ($('peekBtn').onclick  = () => { $('ed').value='SELECT * FROM registrations LIMIT 5;'; runQuery(); });
  $('resetBtn') && ($('resetBtn').onclick = resetProgress);
  $('revealBtn') && ($('revealBtn').onclick = () => {
    $('keyq').style.display = $('keyq').style.display === 'none' ? 'block' : 'none';
  });
  $('schemaBtn') && ($('schemaBtn').onclick = () => $('schemaModal').style.display = 'flex');
  $('nextBtn') && ($('nextBtn').onclick = goToNextProblem);
  $('schemaCloseBtn') && ($('schemaCloseBtn').onclick = () => $('schemaModal').style.display = 'none');
  $('schemaModal') && $('schemaModal').addEventListener('click', (e) => {
    if (e.target === $('schemaModal')) $('schemaModal').style.display = 'none';
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $('schemaModal').style.display !== 'none') $('schemaModal').style.display = 'none';
  });
  const ed = $('ed');
  if (ed) ed.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runQuery(); }
    if (e.key === 'Tab') { e.preventDefault(); const s=ed.selectionStart, en=ed.selectionEnd;
      ed.value = ed.value.slice(0,s) + '  ' + ed.value.slice(en); ed.selectionStart = ed.selectionEnd = s+2; }
    if (e.key === 'Escape') hideColumnSuggestions();
  });
  if (ed) ed.addEventListener('input', () => {
    autoUppercaseKeyword(ed);
    showColumnSuggestions(ed);
  });
  if (ed) ed.addEventListener('blur', () => setTimeout(hideColumnSuggestions, 150));
});
