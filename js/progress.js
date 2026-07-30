// ===========================================================================
// progress.js — solved-problem persistence: Supabase (signed-in users) with
// a localStorage mirror as an offline fallback. Depends on utils.js ($),
// auth.js (supabaseClient / currentUser), and reads/writes the shared state
// vars declared in app.js (solved).
// ===========================================================================

function loadLocalProgress() {
  try { return new Set(JSON.parse(localStorage.getItem('sqp_solved') || '[]')); }
  catch { return new Set(); }
}
function saveLocalProgress() {
  try { localStorage.setItem('sqp_solved', JSON.stringify([...solved])); } catch {}
}

// Guests get localStorage. Signed-in users get their cloud progress, merged
// with any local guest progress made before logging in (uploaded once here).
async function loadProgress() {
  const local = loadLocalProgress();
  if (!currentUser) return local;
  try {
    const { data, error } = await supabaseClient
      .from('solved_problems')
      .select('problem_id')
      .eq('user_id', currentUser.id);
    if (error) throw error;
    const cloud = new Set(data.map(r => r.problem_id));
    const localOnly = [...local].filter(id => !cloud.has(id));
    if (localOnly.length) {
      await supabaseClient.from('solved_problems')
        .upsert(localOnly.map(problem_id => ({ user_id: currentUser.id, problem_id })));
      localOnly.forEach(id => cloud.add(id));
    }
    return cloud;
  } catch {
    return local; // Supabase unreachable — keep working offline
  }
}

async function saveProgress(problemId) {
  saveLocalProgress();
  if (!currentUser) return;
  try {
    await supabaseClient.from('solved_problems').upsert({ user_id: currentUser.id, problem_id: problemId });
  } catch {}
}

async function resetProgress() {
  solved.clear();
  saveLocalProgress();
  refreshProgress();
  $('nav').querySelectorAll('.chip.solved').forEach(chip => chip.classList.remove('solved'));
  if (currentUser) {
    try { await supabaseClient.from('solved_problems').delete().eq('user_id', currentUser.id); } catch {}
  }
}

function refreshProgress() {
  const total = Object.values(PROBLEM_BANK).reduce((n, arr) => n + arr.length, 0);
  $('solvedN').textContent = solved.size;
  $('totalN').textContent = total;

  $('nav').querySelectorAll('.chip').forEach(chip => {
    chip.classList.toggle('solved', solved.has(chip.dataset.id));
  });
}
