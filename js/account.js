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
    options: {
      data: { name, phone },
      emailRedirectTo: location.origin + location.pathname,  // 確認信點完導回「這一頁」（會員頁），不依賴 Site URL
    },
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

      <div class="member-section">
        <h3>訂購紀錄</h3>
        <div id="ordersBox" class="orders-box"><p class="member-empty">載入中…</p></div>
      </div>
      <div class="member-section">
        <h3>收藏清單</h3>
        <div id="favBox" class="fav-box"><p class="member-empty">載入中…</p></div>
      </div>

      <button class="member-edit" id="editBtn">編輯資料</button>
      <button class="logout" id="logoutBtn">登出</button>
    </div>`;
  document.getElementById('editBtn').onclick = renderEdit;
  document.getElementById('logoutBtn').onclick = async () => {
    await sb.auth.signOut();
    await djlSyncUser(null);
    render(); toast('已登出');
  };
  loadOrders();
  loadFavs();
}

// 配送進度時間軸
const ORDER_STAGES = ['訂單成立', '備貨中', '已出貨', '已送達'];
const STAGE_NOTE = {
  '訂單成立': '我們已收到您的訂單，正在為您安排備貨。',
  '備貨中': '商品正在打包中，即將出貨。',
  '已出貨': '包裹已交給物流，配送中。',
  '已送達': '包裹已送達，感謝您的購買！',
};
function orderTimeline(status) {
  let idx = ORDER_STAGES.indexOf(status);
  if (idx < 0) idx = 0; // 舊訂單（展示訂單）視為第一階段
  return '<div class="track">' + ORDER_STAGES.map((s, i) =>
    `<div class="track-step${i <= idx ? ' done' : ''}${i === idx ? ' now' : ''}"><span class="dot"></span><span class="lb">${s}</span></div>`
  ).join('') + '</div>';
}

// 訂購紀錄（從 Supabase orders 表讀取）
async function loadOrders() {
  const u = getUser(); if (!u) return;
  const box = document.getElementById('ordersBox'); if (!box) return;
  const { data, error } = await sb.from('orders').select('*').eq('user_id', u.id).order('created_at', { ascending: false });
  if (error || !data || !data.length) { box.innerHTML = '<p class="member-empty">目前還沒有訂單</p>'; return; }
  box.innerHTML = data.map(o => {
    const date = o.created_at ? new Date(o.created_at).toLocaleDateString('zh-TW') : '';
    const items = (o.items || []).map(it => `${it.name}${it.size ? '（' + it.size + '）' : ''} ×${it.qty}`).join('、');
    const thumbs = (o.items || []).map(it => {
      const p = findProduct(it.id);
      return p ? `<img class="order-thumb" src="${p.img}" alt="${p.name}" title="${p.name}${it.size ? '（' + it.size + '）' : ''} ×${it.qty}"/>` : '';
    }).join('');
    const note = STAGE_NOTE[o.status] || STAGE_NOTE['訂單成立'];
    const eta = (o.status !== '已送達' && typeof estDeliveryText === 'function')
      ? `<br><span class="order-eta">預計送達 ${estDeliveryText(o.created_at)}</span>` : '';
    const ship = o.address
      ? `<div class="order-ship">${o.shipping_method || '宅配到府'}・${o.recipient || ''} ${o.phone || ''}<br>${o.address}${eta}</div>` : '';
    return `<div class="order-card">
        <div class="order-top"><span class="order-no">${o.order_no || '訂單'}</span><span class="order-status">${o.status || '訂單成立'}</span></div>
        <div class="order-date">${date}</div>
        ${orderTimeline(o.status)}
        <p class="order-note">${note}</p>
        <div class="order-thumbs">${thumbs}</div>
        <p class="order-items">${items}</p>
        ${ship}
        <div class="order-sub">小計 <b>${NT(o.subtotal || 0)}</b></div>
      </div>`;
  }).join('');
}

// 收藏清單（從 Supabase favorites 表讀取，對照商品資料顯示）
async function loadFavs() {
  const u = getUser(); if (!u) return;
  const box = document.getElementById('favBox'); if (!box) return;
  const { data, error } = await sb.from('favorites').select('product_id, created_at').eq('user_id', u.id).order('created_at', { ascending: false });
  const list = error ? [] : (data || []).map(r => findProduct(r.product_id)).filter(Boolean);
  if (!list.length) { box.innerHTML = '<p class="member-empty">還沒有收藏的商品</p>'; return; }
  box.innerHTML = list.map(p => `
      <div class="fav-card">
        <a href="product.html?id=${p.id}"><img src="${p.img}" alt="${p.name}"/></a>
        <div class="fav-info"><a href="product.html?id=${p.id}"><h4>${p.name}</h4></a><span class="fav-price">${NT(p.price)}</span></div>
        <button class="fav-remove" data-rm="${p.id}" aria-label="移除收藏">×</button>
      </div>`).join('');
  box.querySelectorAll('[data-rm]').forEach(b => b.onclick = async () => {
    await sb.from('favorites').delete().eq('user_id', u.id).eq('product_id', b.dataset.rm);
    if (typeof _favs !== 'undefined' && _favs.delete) _favs.delete(b.dataset.rm);
    toast('已移除收藏');
    loadFavs();
  });
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

function renderConfirmSent(email) {
  root.innerHTML =
    BADGE +
    `<div class="member confirm-sent">
      <div class="confirm-icon">✉️</div>
      <h2>註冊成功</h2>
      <p class="confirm-lead">確認信已寄到</p>
      <p class="email">${email}</p>
      <p class="confirm-desc">請打開信件、點擊裡面的<b>確認連結</b>完成驗證，就能登入囉。</p>
      <p class="confirm-hint">沒收到？請稍等 1～2 分鐘，並記得看看「垃圾郵件 / 促銷內容」匣。</p>
      <button class="auth-submit" id="goLogin">我已完成驗證，前往登入</button>
      <button class="member-edit" id="resendBtn">重新寄送確認信</button>
      <p class="auth-msg" id="confirmMsg"></p>
    </div>`;
  document.getElementById('goLogin').onclick = () => renderAuth('login');
  document.getElementById('resendBtn').onclick = async e => {
    e.target.disabled = true;
    const m = document.getElementById('confirmMsg');
    const { error } = await sb.auth.resend({
      type: 'signup', email,
      options: { emailRedirectTo: location.origin + location.pathname },
    });
    m.textContent = error ? zhErr(error.message) : '確認信已重新寄出 ✓';
    e.target.disabled = false;
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
