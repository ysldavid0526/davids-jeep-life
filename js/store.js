/* store.js — 共用商品資料與購物車邏輯
   首頁(index.html)與購物頁(shop.html)共用這支；購物車存在瀏覽器 localStorage，兩頁同步。
   ── 要改商品：直接編輯下方 PRODUCTS 陣列
   ── 要改免運門檻：改 FREE 的數字
*/
const PRODUCTS = [
  {
    id:'DJ-01', name:'鈦合金露營杯', desc:'超輕鈦金屬・折疊握把・含杯蓋', price:1280,
    img:'assets/product-dj-01.jpg',
    gallery:['assets/product-dj-01.jpg'],
    intro:'從清晨的山頂到深夜的營火，一只好杯子是旅途中最忠實的夥伴。鈦合金露營杯以航太級鈦金屬打造，超輕量卻堅固耐用，折疊握把收納不佔空間，附杯蓋保溫防塵——無論裝的是熱咖啡還是威士忌，都讓每一口都帶著探索的味道。',
    features:[
      {label:'超輕量', note:'航太級鈦金屬'},
      {label:'耐用堅固', note:'耐刮耐高溫'},
      {label:'折疊握把', note:'收納不佔空間'},
      {label:'附杯蓋', note:'保溫又防塵'},
    ],
    specs:[['材質','航太級鈦金屬'],['容量','約 350ml'],['重量','約 60g'],['配件','含杯蓋'],['產地','Taiwan']],
  },
  {
    id:'DJ-02', name:'經典刷字 T 恤', desc:'純棉重磅・前後印花・經典黑', price:880,
    img:'assets/product-dj-02.jpg',
    gallery:['assets/product-dj-02.jpg','assets/product-dj-02-front.jpg','assets/product-dj-02-back.jpg'],
    intro:'把生活態度穿在身上。經典刷字 T 恤採用純棉重磅布料，手感扎實、耐洗耐穿；前胸小 logo 低調有型，背後大字「David\'s Jeep」張揚個性——適合上山下海，也適合走進城市。Explore More. Live More.',
    features:[
      {label:'純棉重磅', note:'手感扎實'},
      {label:'前後印花', note:'前小後大 logo'},
      {label:'耐洗耐穿', note:'不易退色'},
      {label:'經典黑', note:'百搭日常'},
    ],
    specs:[['材質','100% 純棉（重磅）'],['印花','前胸 + 背後'],['顏色','經典黑'],['尺寸','S / M / L / XL / 2XL'],['產地','Taiwan']],
    sizes:['S','M','L','XL','2XL'],
  },
  {
    id:'DJ-03', name:'重磅刷毛帽 T', desc:'厚磅內刷毛・落肩版型・經典黑', price:1680,
    img:'assets/product-dj-03.jpg',
    gallery:['assets/product-dj-03.jpg','assets/product-dj-03-front.jpg','assets/product-dj-03-back.jpg'],
    intro:'為每一次出發保暖。重磅刷毛帽 T 內裡厚磅刷毛，鎖住溫度也鎖住舒適；落肩版型寬鬆有型，搭配大面積背後印花，露營、夜衝、城市穿搭都百搭。天氣轉涼時，它就是你最想抓起來的那一件。',
    features:[
      {label:'厚磅刷毛', note:'保暖鎖溫'},
      {label:'落肩版型', note:'寬鬆有型'},
      {label:'前後印花', note:'大面積背印'},
      {label:'經典黑', note:'四季百搭'},
    ],
    specs:[['材質','棉混紡・內刷毛'],['版型','落肩寬鬆'],['印花','前胸 + 背後'],['顏色','經典黑'],['尺寸','M / L / XL / 2XL']],
    sizes:['M','L','XL','2XL'],
  },
  {
    id:'DJ-04', name:'防潑水旅行袋', desc:'大容量・可側背・附行李吊牌', price:2480,
    img:'assets/product-dj-04.jpg',
    gallery:['assets/product-dj-04.jpg'],
    intro:'說走就走，從打包開始。防潑水旅行袋大容量設計，週末小旅行一袋搞定；表面防潑水材質應付突如其來的天氣，可手提可側背，附專屬行李吊牌——低調的質感，是探索者的隨行夥伴。',
    features:[
      {label:'防潑水', note:'應付突來天氣'},
      {label:'大容量', note:'週末旅行一袋搞定'},
      {label:'可側背', note:'手提／側背兩用'},
      {label:'附吊牌', note:'專屬行李吊牌'},
    ],
    specs:[['材質','防潑水布料'],['容量','約 35L'],['揹法','手提 / 側背'],['配件','行李吊牌'],['顏色','經典黑']],
  },
  {
    id:'DJ-05', name:'David\'s Jeep 刺繡棒球帽', desc:'100% 純棉・正面精緻刺繡・可調式後扣', price:980,
    img:'assets/product-dj-05.jpg',
    gallery:['assets/product-dj-05.jpg'],
    intro:'細節，藏在每一針裡。經典棒球帽版型百搭日常，正面立體精緻刺繡讓質感再升級；透氣孔設計久戴不悶熱，可調式後扣適合各種頭圍。無論開著牧馬人上山，還是城市裡的日常，這頂帽子都剛剛好。',
    features:[
      {label:'100% 純棉', note:'親膚透氣'},
      {label:'透氣孔', note:'久戴不悶熱'},
      {label:'可調後扣', note:'頭圍自由調節'},
      {label:'精緻刺繡', note:'正面立體刺繡'},
    ],
    specs:[['材質','100% 棉'],['工藝','正面立體刺繡'],['調節','可調式後扣'],['頭圍','約 54–60cm'],['顏色','黑色']],
  },
];
const FREE = 2000;

const NT = n => 'NT$' + Number(n).toLocaleString('en-US');
const findProduct = id => PRODUCTS.find(p => p.id === id);

// 購物車的 key：無尺寸=商品編號；有尺寸=「編號__尺寸」(例 DJ-02__M)，不同尺寸視為不同項目
const cartKey = (id, size) => size ? id + '__' + size : id;
const parseKey = key => {
  const i = key.indexOf('__');
  const id = i < 0 ? key : key.slice(0, i);
  return { id, size: i < 0 ? '' : key.slice(i + 2), product: findProduct(id) };
};

let cart = (() => { try { return JSON.parse(localStorage.getItem('djl_cart')) || {}; } catch (e) { return {}; } })();
const saveCart = () => localStorage.setItem('djl_cart', JSON.stringify(cart));
const cartQty = () => Object.values(cart).reduce((s, q) => s + q, 0);
const cartSubtotal = () => Object.keys(cart).reduce((s, k) => s + (parseKey(k).product?.price || 0) * cart[k], 0);

let _toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* 愛心圖示（收藏鈕共用） */
const HEART_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.6 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13z"/></svg>';

/* 商品卡片 HTML（首頁與購物頁共用；圖片與標題可點進個別商品頁） */
function productCardHTML(p, revealClass = '') {
  const href = `product.html?id=${p.id}`;
  return `<article class="card ${revealClass}">` +
    `<button class="card-fav" data-fav="${p.id}" aria-label="加入收藏">${HEART_SVG}</button>` +
    `<a class="card-link" href="${href}"><div class="card-media"><span class="sku">${p.id}</span>` +
    `<img src="${p.img}" alt="${p.name}" loading="lazy"/></div></a>` +
    `<div class="card-body"><a class="card-link" href="${href}"><h3>${p.name}</h3></a><p>${p.desc}</p>` +
    `<div class="price-row"><span class="price"><span class="cur">NT$</span>${p.price.toLocaleString('en-US')}</span>` +
    `<button class="add" data-id="${p.id}">加入</button></div></div></article>`;
}

/* 手機底部導覽列（App 式,≤600px 顯示）。各頁載入時由 setupCart 自動注入。 */
const _TAB_ICONS = {
  home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/>',
  bag:  '<path d="M6 8h12l-1.2 11.5H7.2z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
  cart: '<circle cx="9.5" cy="20" r="1.3"/><circle cx="17.5" cy="20" r="1.3"/><path d="M3 4h2l2.2 11h11l1.6-8H6.2"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.6 3.5-5.6 7-5.6s7 2 7 5.6"/>',
};
function injectTabBar(openCart) {
  if (document.querySelector('.tabbar')) return;
  const path = (location.pathname.split('/').pop() || 'index.html');
  const onShop = path === 'shop.html' || path === 'product.html';
  const onHome = path === '' || path === 'index.html';
  const icon = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${_TAB_ICONS[k]}</svg>`;
  const nav = document.createElement('nav');
  nav.className = 'tabbar';
  nav.innerHTML =
    `<a href="index.html" class="${onHome ? 'on' : ''}">${icon('home')}<span>首頁</span></a>` +
    `<a href="shop.html" class="${onShop ? 'on' : ''}">${icon('bag')}<span>商品</span></a>` +
    `<button type="button" id="tabCart">${icon('cart')}<span class="tc" id="tabCount" style="display:none">0</span><span>購物車</span></button>` +
    `<a href="account.html" class="${path === 'account.html' ? 'on' : ''}">${icon('user')}<span>會員</span></a>`;
  document.body.appendChild(nav);
  const tc = document.getElementById('tabCart');
  if (tc && openCart) tc.onclick = openCart;
}

/* 綁定購物車抽屜（頁面需含 drawer / scrim / cartItems / count / subtotal / shipNote / checkout / toast 等元素） */
function setupCart() {
  const $ = id => document.getElementById(id);
  const drawer = $('drawer'), scrim = $('scrim'), items = $('cartItems'),
        countEl = $('count'), subtotalEl = $('subtotal'), shipNote = $('shipNote'), checkout = $('checkout');
  const openBtn = $('openCart'), closeBtn = $('closeCart');

  const open  = () => { drawer.classList.add('open');  scrim.classList.add('open');  };
  const close = () => { drawer.classList.remove('open'); scrim.classList.remove('open'); };
  if (openBtn)  openBtn.onclick  = open;
  if (closeBtn) closeBtn.onclick = close;
  if (scrim)    scrim.onclick    = close;
  window.closeCartDrawer = close;
  injectTabBar(open);

  window.renderCart = function () {
    const ids = Object.keys(cart);
    const q = cartQty();
    if (countEl) countEl.textContent = q;
    const tabCountEl = document.getElementById('tabCount');
    if (tabCountEl) { tabCountEl.textContent = q; tabCountEl.style.display = q ? '' : 'none'; }
    if (items) {
      if (!ids.length) {
        items.innerHTML = '<p class="empty">購物車是空的</p>';
        if (checkout) checkout.disabled = true;
      } else {
        items.innerHTML = ids.map(key => {
          const { id, size, product: p } = parseKey(key), q = cart[key];
          if (!p) return '';
          const sku = size ? `${p.id} · ${size}` : p.id;
          return `<div class="li"><img src="${p.img}" alt="${p.name}"/><div class="info"><h4>${p.name}</h4>` +
            `<div class="ls">${sku}</div><div class="lb"><div class="qty">` +
            `<button data-id="${key}" data-d="-1">−</button><span>${q}</span><button data-id="${key}" data-d="1">+</button>` +
            `</div><span class="lp">${NT(p.price * q)}</span></div></div></div>`;
        }).join('');
        if (checkout) checkout.disabled = false;
      }
    }
    const sub = cartSubtotal();
    if (subtotalEl) subtotalEl.textContent = NT(sub);
    if (shipNote) shipNote.innerHTML = sub >= FREE
      ? '<b>已達免運門檻 ✓</b>'
      : (sub === 0 ? '再買 <b>' + NT(FREE) + '</b> 即可免運' : '再買 <b>' + NT(FREE - sub) + '</b> 即可免運');
  };

  if (items) items.addEventListener('click', e => {
    const b = e.target.closest('button[data-d]');
    if (!b) return;
    cart[b.dataset.id] += +b.dataset.d;
    if (cart[b.dataset.id] <= 0) delete cart[b.dataset.id];
    saveCart(); renderCart();
  });

  if (checkout) checkout.onclick = () => { close(); openCheckout(); };

  window.addToCart = function (id, n = 1, size = '') {
    const key = cartKey(id, size);
    cart[key] = (cart[key] || 0) + n;
    saveCart(); renderCart();
    toast('已加入購物車');
  };

  renderCart();
}

/* ── 結帳：填收件資訊 → 建立展示訂單（不收款） ── */
function genOrderNo() {
  const d = new Date();
  const ymd = '' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  return 'DJL-' + ymd + '-' + String(Math.floor(1000 + Math.random() * 9000));
}
function openCheckout() {
  if (!cartQty()) return;
  const u = getUser();
  if (!u) { toast('請先登入會員，即可下單並保留訂購紀錄'); setTimeout(() => location.href = 'account.html', 1100); return; }

  const items = Object.keys(cart).map(k => {
    const { id, size, product: p } = parseKey(k);
    return p ? { id, name: p.name, size, qty: cart[k], price: p.price } : null;
  }).filter(Boolean);
  const subtotal = cartSubtotal();
  const esc = s => (s || '').replace(/"/g, '&quot;');

  let ov = document.getElementById('coModal');
  if (!ov) { ov = document.createElement('div'); ov.id = 'coModal'; ov.className = 'co-modal'; document.body.appendChild(ov); }
  const itemsHTML = items.map(it =>
    `<div class="co-li"><span>${it.name}${it.size ? '（' + it.size + '）' : ''} ×${it.qty}</span><span>${NT(it.price * it.qty)}</span></div>`).join('');
  ov.innerHTML =
    `<div class="co-scrim" id="coScrim"></div>
     <div class="co-card">
       <div class="co-head"><h3>結帳・收件資訊</h3><button class="x" id="coClose" aria-label="關閉">×</button></div>
       <div class="co-body">
         <div class="co-summary">${itemsHTML}
           <div class="co-li co-total"><span>小計</span><span>${NT(subtotal)}</span></div>
           <div class="co-li"><span>運費</span><span>${subtotal >= FREE ? '免運 ✓' : '結帳時計算'}</span></div>
         </div>
         <form id="coForm" class="co-form">
           <div><label>收件人 *</label><input id="co_name" type="text" value="${esc(u.name)}" required></div>
           <div><label>手機 *</label><input id="co_phone" type="tel" value="${esc(u.phone)}" required></div>
           <div><label>配送方式</label><input type="text" value="宅配到府" readonly class="co-readonly"></div>
           <div><label>配送地址 *</label><input id="co_addr" type="text" placeholder="例：台北市信義區市府路 1 號" required></div>
           <p class="co-note">這是展示用訂單，不會真的收款或出貨。</p>
           <button type="submit" class="co-submit">確認下單</button>
           <button type="button" class="co-back" id="coBack">返回購物車</button>
         </form>
       </div>
     </div>`;
  ov.classList.add('open');
  const closeCO = () => ov.classList.remove('open');
  document.getElementById('coClose').onclick = closeCO;
  document.getElementById('coScrim').onclick = closeCO;
  document.getElementById('coBack').onclick = closeCO;
  document.getElementById('coForm').onsubmit = async e => {
    e.preventDefault();
    const btn = e.target.querySelector('.co-submit');
    btn.disabled = true;
    const order = {
      user_id: u.id,
      order_no: genOrderNo(),
      email: u.email,
      items, subtotal,
      recipient: document.getElementById('co_name').value.trim(),
      phone: document.getElementById('co_phone').value.trim(),
      address: document.getElementById('co_addr').value.trim(),
      shipping_method: '宅配到府',
      status: '訂單成立',
    };
    const { error } = await sb.from('orders').insert(order);
    if (error) { toast('下單失敗，請稍後再試'); btn.disabled = false; return; }
    cart = {}; saveCart(); renderCart();
    closeCO();
    if (window.closeCartDrawer) window.closeCartDrawer();
    showOrderSuccess(order);
  };
}

/* 預計送達：下單後 3～5 個工作天（展示用） */
function estDeliveryText(fromDate) {
  const base = fromDate ? new Date(fromDate) : new Date();
  const fmt = ms => { const d = new Date(base.getTime() + ms); return (d.getMonth() + 1) + '/' + d.getDate(); };
  return fmt(3 * 864e5) + '～' + fmt(5 * 864e5);
}

/* 訂單成立確認畫面（下單後彈出） */
function showOrderSuccess(o) {
  let ov = document.getElementById('coModal');
  if (!ov) { ov = document.createElement('div'); ov.id = 'coModal'; ov.className = 'co-modal'; document.body.appendChild(ov); }
  const itemsHTML = (o.items || []).map(it => {
    const p = findProduct(it.id);
    const img = p ? p.img : '';
    return `<div class="os-li"><img src="${img}" alt=""/><div class="os-li-info"><span class="os-li-name">${it.name}${it.size ? '（' + it.size + '）' : ''}</span><span class="os-li-meta">×${it.qty}　${NT(it.price * it.qty)}</span></div></div>`;
  }).join('');
  ov.innerHTML =
    `<div class="co-scrim" id="osScrim"></div>
     <div class="co-card os-card">
       <div class="co-body">
         <div class="os-check">✓</div>
         <h3 class="os-title">訂單成立！</h3>
         <p class="os-no">${o.order_no || ''}</p>
         <div class="os-block">
           <div class="os-row"><span>配送方式</span><span>${o.shipping_method || '宅配到府'}</span></div>
           <div class="os-row"><span>收件人</span><span>${o.recipient || ''}　${o.phone || ''}</span></div>
           <div class="os-row"><span>配送地址</span><span>${o.address || ''}</span></div>
           <div class="os-row os-eta"><span>預計送達</span><span>${estDeliveryText()}</span></div>
         </div>
         <div class="os-items">${itemsHTML}
           <div class="os-total"><span>小計</span><span>${NT(o.subtotal || 0)}</span></div>
         </div>
         <p class="co-note os-note">展示用訂單，不會真的收款或出貨。可至會員中心追蹤配送狀況。</p>
         <a class="co-submit os-link" href="account.html">查看我的訂單</a>
         <button class="co-back" id="osClose">繼續逛逛</button>
       </div>
     </div>`;
  ov.classList.add('open');
  const close = () => ov.classList.remove('open');
  document.getElementById('osScrim').onclick = close;
  document.getElementById('osClose').onclick = close;
}

/* ── 會員（展示版：帳號暫存瀏覽器 localStorage；之後可改接 Supabase，介面不變） ── */
function getUser() { try { return JSON.parse(localStorage.getItem('djl_user')); } catch (e) { return null; } }
function setUser(u) { localStorage.setItem('djl_user', JSON.stringify(u)); }
function logoutUser() { localStorage.removeItem('djl_user'); }

/* 依登入狀態更新導覽列的「登入/註冊」按鈕（每頁載入時呼叫） */
function updateAuthUI() {
  const btn = document.getElementById('acctBtn');
  if (!btn) return;
  const u = getUser();
  btn.textContent = u ? ('HI, ' + (u.name || u.email.split('@')[0])) : '登入 / 註冊';
  btn.onclick = () => location.href = 'account.html';
}

/* ── 收藏 Favorites（存在 Supabase favorites 表；未登入則提示登入） ── */
let _favs = new Set();
async function loadFavorites() {
  _favs = new Set();
  const u = getUser();
  if (u && window.sb) {
    try {
      const { data } = await sb.from('favorites').select('product_id').eq('user_id', u.id);
      if (data) data.forEach(r => _favs.add(r.product_id));
    } catch (e) { /* favorites 表可能尚未建立 */ }
  }
  refreshFavUI();
}
function isFav(id) { return _favs.has(id); }
function refreshFavUI() {
  document.querySelectorAll('[data-fav]').forEach(b => {
    if (b.dataset.fav) b.classList.toggle('on', _favs.has(b.dataset.fav));
  });
}
async function toggleFavorite(id) {
  const u = getUser();
  if (!u) { toast('請先登入會員，才能收藏'); setTimeout(() => location.href = 'account.html', 1000); return; }
  if (!window.sb) return;
  if (_favs.has(id)) {
    _favs.delete(id); refreshFavUI();
    await sb.from('favorites').delete().eq('user_id', u.id).eq('product_id', id);
    toast('已移除收藏');
  } else {
    _favs.add(id); refreshFavUI();
    await sb.from('favorites').insert({ user_id: u.id, product_id: id });
    toast('已加入收藏 ♥');
  }
}
/* 全站委派：任何帶 [data-fav] 的愛心鈕（商品卡、商品頁）都能用 */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-fav]');
  if (!b || !b.dataset.fav) return;
  e.preventDefault();
  toggleFavorite(b.dataset.fav);
});
