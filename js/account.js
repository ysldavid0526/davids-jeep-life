/* account.js — 會員頁(account.html)
   ★ 正式版：帳號透過 Supabase Auth 註冊／登入,資料存在雲端 profiles 表(含 RLS 保護）。
     依賴：supabase-config.js(window.sb / window.djlSyncUser）、store.js(getUser / updateAuthUI / setUser）。
   依賴 store.js：setupCart / updateAuthUI / getUser / setUser
*/
setupCart();
updateAuthUI();

// 行動版選單
const menu = document.getElementById('menu');
document.getElementById('openMenu').onclick = () => menu.classList.add('open');
document.getElementById('closeMenu').onclick = () => menu.classList.remove('open');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));
addEventListener('keydown', e => { if (e.key === 'Escape') { if (window.closeCartDrawer) closeCartDrawer(); menu.classList.remove('open'); } });

const root = document.getElementById('authRoot');

const BADGE = '<img class="brand-logo auth-logo" src="assets/logo.png" alt="David\'s Jeep Life"/>';

// ── Supabase 錯誤訊息中文化 ──
function zhErr(msg) {
  const m = (msg || '').toLowerCase();
  if (m.includes('invalid login')) return 'Email 或密碼不正確';
  if (m.includes('already registered') || m.includes('already been registered')) return '這個 Email 已經註冊過了';
  if (m.includes('password should be at least')) return '密碼至少需要 6 個字';
  if (m.includes('unable to validate email') || m.includes('invalid email')) return 'Email 格式不正確';
  if (m.includes('email rate limit') || m.includes('too many requests')) return '操作太頻繁,請稍後再試';
  return msg || '發生錯誤,請稍後再試';
}

// ── Supabase 帳號操作 ──
async function doRegister(name, email, phone, pw) {
  const { data, error } = await sb.auth.signUp({
    email, password: pw,
    options: { data: { name, phone } },
  });
  if (error) return zhErr(error.message);
  if (!data.session) return '__CONFIRM__';   // 開啟 Email 驗證時,需先收信確認
  return null;
}
async function doLogin(email, pw) {
  const { error } = await sb.auth.signInWithPassword({ email, password: pw });
  if (error) return zhErr(error.message);
  return null;
}
async function saveProfile(name, phone) {
  const u = getUser();
  if (!u) return;
  const { error } = await sb.from('profiles').update({ name, phone }).eq('id', u.id);
  if (!error) {
    await sb.auth.updateUser({ data: { name, phone } });
    setUser({ ...u, name, phone });
    updateAuthUI();
  }
  return error ? zhErr(error.message) : null;
}

function renderMember() {
  const u = getUser();
  if (!u) { renderAuth('login'); return; }
  root.innerHTML =
    BADGE +
    `<div class="member">
      <h2>會員中心</h2>
      <p class="email">${u.email}</p>
      <span class="member-tier">一般會員 · MEMBER</span>
      <div class="row"><span>姓名</span><span>${u.name || '—'}</span></div>
      <div class="row"><span>手機</span><span>${u.phone || '—'}</span></div>
      <div class="row"><span>Email</span><span>${u.email}</span></div>
      <div class="row"><span>加入日期</span><span>${u.since || '—'}</span></div>
      <div class="row"><span>訂單紀錄</span><span>即將推出</span></div>
      <div class="row"><span>收藏清單</span><span>即將推出</span></div>
      <button class="member-edit" id="editBtn">編輯資料</button>
      <button class="logout" id="logoutBtn">登出</button>
    </div>`;
  document.getElementById('editBtn').onclick = renderEdit;
  document.getElementById('logoutBtn').onclick = async () => {
    await sb.auth.signOut();
    await djlSyncUser(null);
    render(); toast('已登出');
  };
}

function renderEdit() {
  const u = getUser();
  root.innerHTML =
    BADGE +
    `<div class="member">
      <h2>編輯資料</h2>
      <p class="email">${u.email}</p>
      <form class="auth-form" id="editForm" style="margin-top:18px;text-align:left">
        <div><label>姓名</label><input id="e_name" type="text" value="${u.name || ''}" required></div>
        <div><label>手機</label><input id="e_phone" type="tel" value="${u.phone || ''}"></div>
        <p class="auth-msg" id="editMsg"></p>
        <button class="auth-submit" type="submit">儲存</button>
        <button class="member-edit" type="button" id="cancelEdit">取消</button>
      </form>
    </div>`;
  document.getElementById('cancelEdit').onclick = renderMember;
  document.getElementById('editForm').onsubmit = async e => {
    e.preventDefault();
    const btn = e.target.querySelector('.auth-submit');
    btn.disabled = true;
    const err = await saveProfile(
      document.getElementById('e_name').value.trim(),
      document.getElementById('e_phone').value.trim()
    );
    btn.disabled = false;
    if (err) { document.getElementById('editMsg').textContent = err; return; }
    toast('資料已更新');
    renderMember();
  };
}

function renderAuth(tab = 'login') {
  root.innerHTML =
    BADGE +
    `<div class="auth-tabs">
       <button data-tab="login" class="${tab === 'login' ? 'active' : ''}">登入</button>
       <button data-tab="register" class="${tab === 'register' ? 'active' : ''}">註冊</button>
     </div>
     <form class="auth-form" id="authForm">
       ${tab === 'register' ? '<div><label>姓名</label><input id="f_name" type="text" autocomplete="name" required></div>' : ''}
       ${tab === 'register' ? '<div><label>手機（選填）</label><input id="f_phone" type="tel" autocomplete="tel"></div>' : ''}
       <div><label>Email</label><input id="f_email" type="email" autocomplete="email" required></div>
       <div><label>密碼</label><input id="f_pw" type="password" autocomplete="${tab === 'register' ? 'new-password' : 'current-password'}" minlength="6" required></div>
       <p class="auth-msg" id="authMsg"></p>
       <button class="auth-submit" type="submit">${tab === 'login' ? '登入' : '建立帳號'}</button>
       <p class="auth-note">你的帳號將安全儲存於雲端，密碼經加密保護。</p>
     </form>`;
  root.querySelectorAll('.auth-tabs button').forEach(b => b.onclick = () => renderAuth(b.dataset.tab));
  document.getElementById('authForm').onsubmit = async e => {
    e.preventDefault();
    const msg = document.getElementById('authMsg');
    const btn = e.target.querySelector('.auth-submit');
    const email = document.getElementById('f_email').value.trim().toLowerCase();
    const pw = document.getElementById('f_pw').value;
    msg.textContent = ''; btn.disabled = true;
    const err = tab === 'register'
      ? await doRegister(document.getElementById('f_name').value.trim(), email, document.getElementById('f_phone').value.trim(), pw)
      : await doLogin(email, pw);
    btn.disabled = false;
    if (err === '__CONFIRM__') {
      msg.style.color = 'inherit';
      msg.textContent = '註冊成功！請到信箱收確認信,點擊連結後即可登入。';
      return;
    }
    if (err) { msg.textContent = err; return; }
    // 確保顯示快取已更新後再切到會員中心
    const { data: { session } } = await sb.auth.getSession();
    await djlSyncUser(session);
    toast(tab === 'register' ? '註冊成功，已登入' : '登入成功');
    render();
  };
}

function render() { getUser() ? renderMember() : renderAuth('login'); }

// 進頁時先以快取畫面,再依 Supabase 實際 session 校正(onAuthStateChange 會觸發 onDjlAuthChange）
window.onDjlAuthChange = render;
render();
