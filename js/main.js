/* main.js — 首頁(index.html)互動
   依賴 store.js（須先載入）：PRODUCTS / setupCart / addToCart / productCardHTML / closeCartDrawer
*/
setupCart();
updateAuthUI();

// 商品列表（精選商品區）
const grid = document.getElementById('grid');
if (grid) {
  if (typeof STORE_OPEN !== 'undefined' && !STORE_OPEN) {
    const b = document.createElement('div'); b.className = 'shop-closed rv';
    b.textContent = '🛠 商店暫停營業中，商品僅供瀏覽，敬請期待再度開賣。';
    grid.parentNode.insertBefore(b, grid);
  }
  const delays = ['', 'd1', 'd2', 'd3'];
  grid.innerHTML = PRODUCTS.map((p, i) => productCardHTML(p, 'rv ' + (delays[i] || ''))).join('');
  grid.addEventListener('click', e => {
    const b = e.target.closest('.add');
    if (b) addToCart(b.dataset.id);
  });
  refreshFavUI();
}

// 行動版選單
const menu = document.getElementById('menu');
document.getElementById('openMenu').onclick = () => menu.classList.add('open');
document.getElementById('closeMenu').onclick = () => menu.classList.remove('open');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));

// 進場淡入動畫
const io = new IntersectionObserver(es => es.forEach(x => {
  if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
}), { threshold: .16 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

// 導覽列底色 + 頂部進度條
const nav = document.getElementById('nav'), prog = document.getElementById('prog');
const onScroll = () => {
  const y = scrollY;
  nav.classList.toggle('solid', y > 60);
  const h = document.documentElement.scrollHeight - innerHeight;
  prog.style.width = (h > 0 ? (y / h * 100) : 0) + '%';
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (window.closeCartDrawer) closeCartDrawer(); menu.classList.remove('open'); }
});

// 留言板（公開，任何人可留言；顯示時一律轉義防注入）
const gbForm = document.getElementById('gbForm');
if (gbForm && window.sb) {
  const gbList = document.getElementById('gbList');
  const gbName = document.getElementById('gb_name');
  const gbBody = document.getElementById('gb_body');
  const gbMsg = document.getElementById('gbMsg');
  const cu = getUser();
  if (cu && cu.name && !gbName.value) gbName.value = cu.name;

  async function loadMessages() {
    const { data, error } = await sb.from('messages').select('*').order('created_at', { ascending: false }).limit(50);
    if (error) { gbList.innerHTML = '<p class="gb-empty">留言載入失敗</p>'; return; }
    if (!data || !data.length) { gbList.innerHTML = '<p class="gb-empty">還沒有留言，來當第一個吧！</p>'; return; }
    gbList.innerHTML = data.map(m => {
      const when = m.created_at ? new Date(m.created_at).toLocaleDateString('zh-TW') : '';
      return `<div class="gb-item"><div class="gb-item-top"><span class="gb-item-name">${escapeHTML(m.name) || '訪客'}</span>` +
        `<span class="gb-item-date">${when}</span></div><p class="gb-item-body">${escapeHTML(m.body)}</p></div>`;
    }).join('');
  }

  gbForm.onsubmit = async e => {
    e.preventDefault();
    const body = gbBody.value.trim();
    if (!body) return;
    const name = gbName.value.trim().slice(0, 20) || '訪客';
    const btn = gbForm.querySelector('.gb-submit');
    btn.disabled = true;
    const { error } = await sb.from('messages').insert({ name, body: body.slice(0, 300) });
    btn.disabled = false;
    if (error) { gbMsg.textContent = '送出失敗，請稍後再試'; return; }
    gbBody.value = '';
    gbMsg.textContent = '留言成功，謝謝你！';
    setTimeout(() => { gbMsg.textContent = ''; }, 2500);
    loadMessages();
  };

  loadMessages();
}
