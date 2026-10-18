/* product.js — 個別商品頁(product.html?id=DJ-XX)
   依賴 store.js：findProduct / IG_ORDER
*/

// 行動版選單
const menu = document.getElementById('menu');
document.getElementById('openMenu').onclick = () => menu.classList.add('open');
document.getElementById('closeMenu').onclick = () => menu.classList.remove('open');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));
addEventListener('keydown', e => { if (e.key === 'Escape') menu.classList.remove('open'); });

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

  // 多角度圖
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

  // 尺寸（僅顯示資訊；訂購時於私訊註明）
  if (p.sizes && p.sizes.length) {
    document.getElementById('pdpSizeWrap').hidden = false;
    document.getElementById('pdpSizes').innerHTML = p.sizes.map(s => `<span class="pdp-size-chip">${s}</span>`).join('');
  }

  // Instagram 私訊訂購
  const ig = document.getElementById('pdpOrder');
  if (ig) ig.href = IG_ORDER;
}
