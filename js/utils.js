// ===========================================================================
// utils.js — tiny shared DOM/escaping helpers used by every other script.
// Must load before ui.js / grader.js / progress.js / app.js.
// ===========================================================================

const $  = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
