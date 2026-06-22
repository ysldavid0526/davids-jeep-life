/* product.js — 個別商品頁(product.html?id=DJ-XX)
   依賴 store.js：PRODUCTS / findProduct / setupCart / addToCart / updateAuthUI / NT
*/
setupCart();
updateAuthUI();

// 行動版選單
const menu = document.getElementById('menu');
document.getElementById('openMenu').onclick = () => menu.classList.add('open');
document.getElementById('closeMenu').onclick = () => menu.classList.remove('open');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));
addEventListener('keydown', e => { if (e.key === 'Escape') { if (window.closeCartDrawer) closeCartDrawer(); menu.classList.remove('open'); } });

// 取得網址 ?id= 並帶出商品
const id = new URLSearchParams(location.search).get('id');
const p = findProduct(id);

if (!p) {
  document.getElementById('pdp').innerHTML =
    '<div class="wrap" style="padding:160px 0 120px;text-align:center">' +
    '<p style="color:#bdbdb8;margin-bottom:24px">找不到這個商品</p>' +
    '<a class="btn-sand" href="shop.html">返回商品</a></div>';
} else {
  document.title = p.name + ' · David\'s Jeep Life';
  const mainImg = document.getElementById('pdpImg');
  mainImg.src = p.img;
  mainImg.alt = p.name;
  document.getElementById('pdpSku').textContent = p.id;
  document.getElementById('pdpName').textContent = p.name;
  document.getElementById('pdpPrice').innerHTML = '<span class="cur">NT$</span>' + p.price.toLocaleString('en-US');
  document.getElementById('pdpDesc').textContent = p.desc;

  // 多角度圖：縮圖列（只有一張時不顯示）
  const gallery = (p.gallery && p.gallery.length ? p.gallery : [p.img]);
  const thumbs = document.getElementById('pdpThumbs');
  if (gallery.length > 1) {
    thumbs.innerHTML = gallery.map((src, i) =>
      `<button class="pdp-thumb${i === 0 ? ' active' : ''}" data-src="${src}"><img src="${src}" alt="${p.name} ${i + 1}"/></button>`
    ).join('');
    thumbs.addEventListener('click', e => {
      const b = e.target.closest('.pdp-thumb');
      if (!b) return;
      mainImg.src = b.dataset.src;
      thumbs.querySelectorAll('.pdp-thumb').forEach(t => t.classList.toggle('active', t === b));
    });
  }

  // 介紹文案
  document.getElementById('pdpIntro').textContent = p.intro || p.desc;

  // 特色亮點
  if (p.features && p.features.length) {
    document.getElementById('pdpFeatures').innerHTML = p.features.map(f =>
      `<div class="pdp-feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20 L9 9 L13 15 L17 7 L21 20 Z"/></svg>` +
      `<div><div class="ft-label">${f.label}</div><div class="ft-note">${f.note || ''}</div></div></div>`
    ).join('');
  }

  // 規格表
  if (p.specs && p.specs.length) {
    document.getElementById('pdpSpecs').innerHTML = p.specs.map(([k, v]) =>
      `<tr><th>${k}</th><td>${v}</td></tr>`).join('');
  }

  // 尺寸選擇（衣服類才有 sizes）
  let selectedSize = '';
  const hasSizes = p.sizes && p.sizes.length;
  if (hasSizes) {
    document.getElementById('pdpSizeWrap').hidden = false;
    const box = document.getElementById('pdpSizes');
    box.innerHTML = p.sizes.map(s => `<button class="pdp-size-btn" data-size="${s}">${s}</button>`).join('');
    box.addEventListener('click', e => {
      const b = e.target.closest('.pdp-size-btn');
      if (!b) return;
      selectedSize = b.dataset.size;
      box.querySelectorAll('.pdp-size-btn').forEach(x => x.classList.toggle('active', x === b));
    });
  }

  // 數量選擇
  let qty = 1;
  const qEl = document.getElementById('qty');
  document.getElementById('qMinus').onclick = () => { if (qty > 1) { qty--; qEl.textContent = qty; } };
  document.getElementById('qPlus').onclick = () => { qty++; qEl.textContent = qty; };
  document.getElementById('pdpAdd').onclick = () => {
    if (hasSizes && !selectedSize) { toast('請先選擇尺寸'); return; }
    addToCart(p.id, qty, selectedSize);
  };

  // 收藏鈕（綁定此商品；點擊由 store.js 的全站委派處理）
  const favBtn = document.getElementById('pdpFav');
  if (favBtn) { favBtn.dataset.fav = p.id; refreshFavUI(); }
}
