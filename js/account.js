/* account.js — 會員頁(account.html)
   ★ 展示版：帳號資料暫存在瀏覽器 localStorage（非真正後端、未加密）。
     之後接上 Supabase 後，只要替換 doRegister / doLogin / doLogout 內部即可，畫面不變。
   依賴 store.js：setupCart / updateAuthUI / getUser / setUser / logoutUser
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

// ── 展示版資料存取（之後改接 Supabase） ──
const usersDB = () => { try { return JSON.parse(localStorage.getItem('djl_users')) || {}; } catch (e) { return {}; } };
const saveUsers = db => localStorage.setItem('djl_users', JSON.stringify(db));

function nowDate() { return new Date().toLocaleDateString('zh-TW'); }

function doRegister(name, email, phone, pw) {
  const db = usersDB();
  if (db[email]) return '這個 Email 已經註冊過了';
  const since = nowDate();
  db[email] = { name, phone, pw, since };
  saveUsers(db);
  setUser({ name, email, phone, since });
  return null;
}
function doLogin(email, pw) {
  const db = usersDB();
  if (!db[email] || db[email].pw !== pw) return 'Email 或密碼不正確';
  const u = db[email];
  setUser({ name: u.name, email, phone: u.phone || '', since: u.since || '' });
  return null;
}
function saveProfile(name, phone) {
  const u = getUser(), db = usersDB();
  if (db[u.email]) { db[u.email].name = name; db[u.email].phone = phone; saveUsers(db); }
  setUser({ ...u, name, phone });
  updateAuthUI();
}

function renderMember() {
  const u = getUser();
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
  document.getElementById('logoutBtn').onclick = () => { logoutUser(); updateAuthUI(); render(); toast('已登出'); };
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
        <button class="auth-submit" type="submit">儲存</button>
        <button class="member-edit" type="button" id="cancelEdit">取消</button>
      </form>
    </div>`;
  document.getElementById('cancelEdit').onclick = renderMember;
  document.getElementById('editForm').onsubmit = e => {
    e.preventDefault();
    saveProfile(document.getElementById('e_name').value.trim(), document.getElementById('e_phone').value.trim());
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
       <div><label>密碼</label><input id="f_pw" type="password" autocomplete="${tab === 'register' ? 'new-password' : 'current-password'}" minlength="4" required></div>
       <p class="auth-msg" id="authMsg"></p>
       <button class="auth-submit" type="submit">${tab === 'login' ? '登入' : '建立帳號'}</button>
       <p class="auth-note">展示版：帳號暫存在你的瀏覽器，尚未連接後端。<br>之後接上 Supabase 後即為正式會員。</p>
     </form>`;
  root.querySelectorAll('.auth-tabs button').forEach(b => b.onclick = () => renderAuth(b.dataset.tab));
  document.getElementById('authForm').onsubmit = e => {
    e.preventDefault();
    const email = document.getElementById('f_email').value.trim().toLowerCase();
    const pw = document.getElementById('f_pw').value;
    const err = tab === 'register'
      ? doRegister(document.getElementById('f_name').value.trim(), email, document.getElementById('f_phone').value.trim(), pw)
      : doLogin(email, pw);
    if (err) { document.getElementById('authMsg').textContent = err; return; }
    updateAuthUI();
    toast(tab === 'register' ? '註冊成功，已登入' : '登入成功');
    render();
  };
}

function render() { getUser() ? renderMember() : renderAuth('login'); }
render();
