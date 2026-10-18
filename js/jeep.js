/* jeep.js — DAVID'S JEEP 改裝展示頁 V2.0
   依賴：store.js（escapeHTML）、build-data.js（BUILD/BUILD_VIEWS…）
*/

// 行動版選單
const menu = document.getElementById('menu');
document.getElementById('openMenu').onclick = () => menu.classList.add('open');
document.getElementById('closeMenu').onclick = () => menu.classList.remove('open');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));

const esc = (typeof escapeHTML === 'function') ? escapeHTML : (s => (s == null ? '' : String(s)));

// 圖片插槽：缺圖時自動顯示「照片待補」佔位，不破圖
function imgSlot(src, alt, cls) {
  return `<div class="ph ${cls || ''}"><img src="${src}" alt="${esc(alt || '')}" loading="lazy" ` +
    `onerror="this.closest('.ph').classList.add('ph-missing');this.remove();"/>` +
    `<span class="ph-label">照片待補</span></div>`;
}
function statusClass(s) { return /目前使用|已改裝/.test(s || '') ? 'on' : 'rec'; }

/* ── 互動車輛視角 ── */
let curView = BUILD_VIEWS[0].id;
function renderViews() {
  const tabs = document.getElementById('viewTabs');
  tabs.innerHTML = BUILD_VIEWS.map(v => `<button class="rig-view-tab ${v.id === curView ? 'on' : ''}" data-v="${v.id}">${v.label}</button>`).join('');
  tabs.querySelectorAll('.rig-view-tab').forEach(b => b.onclick = () => { curView = b.dataset.v; renderViews(); });
  renderStage();
}
function renderStage() {
  const v = BUILD_VIEWS.find(x => x.id === curView);
  const stage = document.getElementById('viewStage');
  stage.innerHTML = imgSlot(v.img, v.label, 'rig-stage-img') +
    v.hotspots.map((h, i) => `<button class="rig-dot" style="left:${h.x}%;top:${h.y}%" data-pid="${h.pid}">` +
      `<span class="rig-dot-n">${i + 1}</span><span class="rig-dot-tip">${esc(h.label)}</span></button>`).join('');
  stage.querySelectorAll('.rig-dot').forEach(d => d.onclick = () => openDetail(d.dataset.pid));
  document.getElementById('viewHint').textContent = v.label + '：點擊編號查看改裝（' + v.hotspots.length + ' 項）';
}

/* ── 改裝清單（依分類） ── */
function renderMods() {
  const box = document.getElementById('buildMods');
  document.getElementById('modCount').textContent = BUILD.length;
  box.innerHTML = BUILD_CATEGORIES.map(cat => {
    const items = BUILD.filter(p => p.category === cat);
    if (!items.length) return '';
    return `<div class="rig-cat"><h3 class="rig-cat-h">${cat}</h3><div class="rig-grid">` +
      items.map(p => `<button class="rig-card" data-pid="${p.id}">` +
        `<div class="rig-card-media">${imgSlot(p.card || p.photos.product, p.product)}</div>` +
        `<div class="rig-card-body"><span class="rig-brand">${esc(p.brand)}</span>` +
        `<h4>${esc(p.product)}</h4>` +
        `<div class="rig-card-foot"><span class="rig-model">${esc(p.model)}</span>` +
        `<span class="rig-status ${statusClass(p.status)}">${esc(p.status)}</span></div></div></button>`).join('') +
      `</div></div>`;
  }).join('');
  box.querySelectorAll('.rig-card').forEach(b => b.onclick = () => openDetail(b.dataset.pid));
}

/* ── 產品詳細彈窗 ── */
function openDetail(pid) {
  const p = findBuild(pid); if (!p) return;
  const modal = document.getElementById('buildModal');
  // 只用真實照片（實車照）；沒有就顯示單一佔位。一張大圖 + 右側條列說明。
  const reals = [p.photos.product, p.photos.installed].concat(p.photos.detail)
    .filter(s => s && s.indexOf('/_real/') >= 0);
  const hero = reals[0] || p.photos.installed;
  const canZoom = reals.length > 0;
  const offWeb = (p.official && p.official !== '待確認')
    ? `<a class="rig-offbtn" href="${esc(p.official)}" target="_blank" rel="noopener">VIEW OFFICIAL WEBSITE ↗</a>`
    : `<span class="rig-offbtn disabled">官方網站待確認</span>`;
  const specBullets = (p.specs && p.specs.length)
    ? p.specs.map(([k, v]) => `<li><span>${esc(k)}</span>${esc(v)}</li>`).join('')
    : `<li><span>技術規格</span><em class="rig-tbd">待確認</em></li>`;
  modal.innerHTML = `<div class="rig-modal-scrim"></div><div class="rig-modal-card">
    <button class="rig-modal-x" aria-label="關閉">×</button>
    <div class="rig-modal-grid">
      <div class="rig-modal-media">
        <div class="rig-modal-main" id="rmMain">${imgSlot(hero, p.product, 'rig-modal-mainimg')}</div>
        <p class="rig-modal-tip">${canZoom ? '點圖可放大・全螢幕' : '實車照陸續補上'}</p>
      </div>
      <div class="rig-modal-info">
        <span class="rig-brand">${esc(p.brand)}</span>
        <h3>${esc(p.product)}</h3>
        <span class="rig-status ${statusClass(p.status)}">${esc(p.status)}</span>
        <ul class="rig-bullets">
          <li><span>品牌</span>${esc(p.brand)}</li>
          <li><span>型號</span>${esc(p.model)}</li>
          <li><span>類別</span>${esc(p.category)}</li>
          <li><span>尺寸</span>${esc(p.dimensions)}</li>
          <li><span>安裝狀態</span>${esc(p.status)}</li>
          ${specBullets}
        </ul>
        <p class="rig-desc">${esc(p.desc)}</p>
        ${p.note ? `<p class="rig-noteline">※ ${esc(p.note)}</p>` : ''}
        <div class="rig-offrow">${offWeb}</div>
      </div>
    </div></div>`;
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const main = document.getElementById('rmMain');
  if (canZoom) { const im = main.querySelector('img'); if (im) im.onclick = () => openLightbox(reals, 0); }
  modal.querySelector('.rig-modal-x').onclick = closeDetail;
  modal.querySelector('.rig-modal-scrim').onclick = closeDetail;
}
function closeDetail() {
  const m = document.getElementById('buildModal');
  m.classList.remove('open'); m.setAttribute('aria-hidden', 'true');
  if (!document.getElementById('lightbox').classList.contains('open')) document.body.style.overflow = '';
}

/* ── 燈箱：放大 / 左右切換 / 全螢幕 / 手機滑動 ── */
let lbImgs = [], lbI = 0, lbZoom = false;
function openLightbox(imgs, i) {
  lbImgs = imgs; lbI = i || 0; lbZoom = false;
  const lb = document.getElementById('lightbox');
  lb.innerHTML = `<button class="lb-x" aria-label="關閉">×</button>
    <button class="lb-nav lb-prev" aria-label="上一張">‹</button>
    <div class="lb-stage" id="lbStage"></div>
    <button class="lb-nav lb-next" aria-label="下一張">›</button>
    <div class="lb-tools"><button class="lb-zoom">放大</button><button class="lb-full">全螢幕</button><span class="lb-count"></span></div>`;
  lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
  lb.querySelector('.lb-x').onclick = closeLightbox;
  lb.querySelector('.lb-prev').onclick = () => lbGo(-1);
  lb.querySelector('.lb-next').onclick = () => lbGo(1);
  lb.querySelector('.lb-zoom').onclick = () => { lbZoom = !lbZoom; lbRender(); };
  lb.querySelector('.lb-full').onclick = lbFull;
  let sx = 0;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 45) lbGo(dx < 0 ? 1 : -1); }, { passive: true });
  lbRender();
}
function lbRender() {
  const stage = document.getElementById('lbStage'); if (!stage) return;
  stage.innerHTML = imgSlot(lbImgs[lbI], '改裝照片 ' + (lbI + 1), 'lb-img' + (lbZoom ? ' zoom' : ''));
  const c = document.querySelector('.lb-count'); if (c) c.textContent = (lbI + 1) + ' / ' + lbImgs.length;
  const z = document.querySelector('.lb-zoom'); if (z) z.textContent = lbZoom ? '縮小' : '放大';
}
function lbGo(d) { lbI = (lbI + d + lbImgs.length) % lbImgs.length; lbZoom = false; lbRender(); }
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
  if (!document.getElementById('buildModal').classList.contains('open')) document.body.style.overflow = '';
}
function lbFull() {
  const lb = document.getElementById('lightbox');
  if (!document.fullscreenElement) { lb.requestFullscreen && lb.requestFullscreen(); }
  else { document.exitFullscreen && document.exitFullscreen(); }
}
addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox'), md = document.getElementById('buildModal');
  if (lb.classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') lbGo(-1);
    else if (e.key === 'ArrowRight') lbGo(1);
  } else if (md.classList.contains('open')) {
    if (e.key === 'Escape') closeDetail();
  } else if (e.key === 'Escape') { menu.classList.remove('open'); }
});

renderViews();
renderMods();
