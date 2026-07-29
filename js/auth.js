// ===========================================================================
// auth.js — Supabase email/password auth + login/signup UI.
// Depends on: supabase-js (CDN, global `supabase`), supabase-config.js.
// Exposes: supabaseClient, currentUser, initAuth(). Calls window.onAuthChange()
// (defined in app.js) whenever the signed-in user changes.
// ===========================================================================

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

let currentUser = null;

async function initAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  currentUser = session ? session.user : null;
  renderAuthUI();

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    const newUser = session ? session.user : null;
    const changed = (newUser?.id || null) !== (currentUser?.id || null);
    currentUser = newUser;
    renderAuthUI();
    if (changed && typeof window.onAuthChange === 'function') window.onAuthChange();
  });
}

function renderAuthUI() {
  const box = document.getElementById('authbar');
  if (!box) return;

  if (currentUser) {
    const initial = currentUser.email.charAt(0).toUpperCase();
    box.innerHTML = `
      <div class="accountmenu">
        <button class="avatarBtn" id="avatarBtn" title="${esc(currentUser.email)}">${esc(initial)}</button>
        <div class="accountdropdown" id="accountdropdown">
          <span class="authmail">${esc(currentUser.email)}</span>
          <button class="act small" id="logoutBtn">Keluar</button>
        </div>
      </div>
    `;
    document.getElementById('avatarBtn').onclick = (e) => {
      e.stopPropagation();
      document.getElementById('accountdropdown').classList.toggle('open');
    };
    document.getElementById('logoutBtn').onclick = () => supabaseClient.auth.signOut();
    document.addEventListener('click', () => {
      const dd = document.getElementById('accountdropdown');
      if (dd) dd.classList.remove('open');
    });
    return;
  }

  box.innerHTML = `
    <input type="email" id="authEmail" class="authinput" placeholder="Email" autocomplete="email">
    <input type="password" id="authPass" class="authinput" placeholder="Password" autocomplete="current-password">
    <button class="act small" id="loginBtn">Masuk</button>
    <button class="act small" id="signupBtn">Daftar</button>
    <span class="authmsg" id="authMsg"></span>
  `;
  document.getElementById('loginBtn').onclick = () => doAuth('signInWithPassword');
  document.getElementById('signupBtn').onclick = () => doAuth('signUp');
  document.getElementById('authPass').addEventListener('keydown', e => {
    if (e.key === 'Enter') doAuth('signInWithPassword');
  });
}

async function doAuth(method) {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPass').value;
  const msg = document.getElementById('authMsg');
  if (!email || !password) { msg.textContent = 'Isi email & password dulu.'; return; }

  msg.textContent = 'Memproses...';
  const { error } = await supabaseClient.auth[method]({ email, password });
  if (error) { msg.textContent = error.message; return; }
  msg.textContent = method === 'signUp'
    ? 'Akun dibuat. Kalau diminta verifikasi email, cek inbox — kalau tidak, kamu otomatis masuk.'
    : '';
}
