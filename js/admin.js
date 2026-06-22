/* admin.js — 訂單管理後台（admin.html）
   權限：只有 ADMIN_EMAIL 這個帳號能看到所有訂單並更新狀態（搭配 Supabase RLS 管理員政策）。
   依賴：supabase-config.js（sb / djlSyncUser）、store.js（getUser / NT / findProduct / toast / updateAuthUI）
*/
const ADMIN_EMAIL = 'ysldavid0526@gmail.com';
const STAGES = ['訂單成立', '備貨中', '已出貨', '已送達'];

updateAuthUI();
const root = document.getElementById('adminRoot');
const BADGE = '<img class="brand-logo auth-logo" src="assets/logo.png" alt="David\'s Jeep Life"/>';

function zhErr(msg) {
  const m = (msg || '').toLowerCase();
  if (m.includes('invalid login')) return 'Email 或密碼不正確';
  return msg || '發生錯誤，請稍後再試';
}

// 登入畫面（後台）
function renderLogin(note) {
  root.innerHTML =
    BADGE +
    `<div class="auth-card-inner">
       <h2 class="admin-h">訂單後台</h2>
       <p class="admin-sub">請以管理員帳號登入</p>
       ${note ? `<p class="auth-msg" style="color:#e88a8a">${note}</p>` : ''}
       <form class="auth-form" id="adminLogin" style="margin-top:14px">
         <div><label>Email</label><input id="a_email" type="email" autocomplete="email" required></div>
         <div><label>密碼</label><input id="a_pw" type="password" autocomplete="current-password" required></div>
         <p class="auth-msg" id="aMsg"></p>
         <button class="auth-submit" type="submit">登入</button>
       </form>
     </div>`;
  document.getElementById('adminLogin').onsubmit = async e => {
    e.preventDefault();
    const btn = e.target.querySelector('.auth-submit');
    btn.disabled = true;
    const email = document.getElementById('a_email').value.trim().toLowerCase();
    const { error } = await sb.auth.signInWithPassword({ email, password: document.getElementById('a_pw').value });
    btn.disabled = false;
    if (error) { document.getElementById('aMsg').textContent = zhErr(error.message); return; }
    const { data: { session } } = await sb.auth.getSession();
    await djlSyncUser(session);
    render();
  };
}

// 非管理員
function renderNoAccess(u) {
  root.innerHTML =
    BADGE +
    `<div class="auth-card-inner">
       <h2 class="admin-h">無管理權限</h2>
       <p class="admin-sub">目前登入：${u.email}<br>此帳號不是管理員。</p>
       <button class="logout" id="logoutBtn" style="margin-top:18px">登出</button>
     </div>`;
  document.getElementById('logoutBtn').onclick = async () => { await sb.auth.signOut(); await djlSyncUser(null); render(); };
}

// 後台主畫面
async function renderDashboard() {
  root.innerHTML =
    `<div class="admin-bar">
       <div><h2 class="admin-h">訂單管理</h2><p class="admin-sub" id="adminCount">載入中…</p></div>
       <button class="member-edit admin-logout" id="logoutBtn">登出</button>
     </div>
     <div id="orderList" class="admin-list"><p class="member-empty">載入中…</p></div>`;
  document.getElementById('logoutBtn').onclick = async () => { await sb.auth.signOut(); await djlSyncUser(null); render(); };
  await loadAllOrders();
}

async function loadAllOrders() {
  const list = document.getElementById('orderList');
  const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false });
  if (error) { list.innerHTML = `<p class="member-empty">讀取失敗：${error.message}</p>`; return; }
  document.getElementById('adminCount').textContent = `共 ${data.length} 筆訂單`;
  if (!data.length) { list.innerHTML = '<p class="member-empty">目前還沒有訂單</p>'; return; }

  list.innerHTML = data.map(o => {
    const date = o.created_at ? new Date(o.created_at).toLocaleString('zh-TW') : '';
    const items = (o.items || []).map(it => `${it.name}${it.size ? '（' + it.size + '）' : ''} ×${it.qty}`).join('、');
    const cur = STAGES.includes(o.status) ? o.status : STAGES[0];
    const opts = STAGES.map(s => `<option value="${s}"${s === cur ? ' selected' : ''}>${s}</option>`).join('');
    return `<div class="admin-order">
        <div class="ao-head">
          <span class="order-no">${o.order_no || '訂單'}</span>
          <select class="ao-status" data-id="${o.id}">${opts}</select>
        </div>
        <div class="ao-date">${date}</div>
        <div class="ao-cust">
          <span>${o.recipient || '—'}　${o.phone || ''}</span>
          ${o.email ? `<a href="mailto:${o.email}">${o.email}</a>` : ''}
        </div>
        ${o.address ? `<div class="ao-addr">${o.shipping_method || '宅配到府'}・${o.address}</div>` : ''}
        <div class="ao-items">${items}</div>
        <div class="ao-sub">小計 <b>${NT(o.subtotal || 0)}</b></div>
      </div>`;
  }).join('');

  list.querySelectorAll('.ao-status').forEach(sel => {
    sel.onchange = async () => {
      const id = sel.dataset.id, status = sel.value;
      sel.disabled = true;
      const { error } = await sb.from('orders').update({ status }).eq('id', id);
      sel.disabled = false;
      toast(error ? ('更新失敗：' + error.message) : ('已更新為「' + status + '」'));
    };
  });
}

function render() {
  const u = getUser();
  if (!u) { renderLogin(); return; }
  if (u.email !== ADMIN_EMAIL) { renderNoAccess(u); return; }
  renderDashboard();
}

window.onDjlAuthChange = render;
render();
