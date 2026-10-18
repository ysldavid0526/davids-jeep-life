/* jeep.js — DAVID'S JEEP 改裝展示頁（極簡版）
   一張車 + 下面直接條列改裝了什麼。
   依賴：store.js（escapeHTML）、build-data.js（BUILD / BUILD_CATEGORIES）
*/

// 行動版選單
const menu = document.getElementById('menu');
document.getElementById('openMenu').onclick = () => menu.classList.add('open');
document.getElementById('closeMenu').onclick = () => menu.classList.remove('open');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));

const esc = (typeof escapeHTML === 'function') ? escapeHTML : (s => (s == null ? '' : String(s)));
function statusClass(s) { return /目前使用|已改裝/.test(s || '') ? 'on' : 'rec'; }

/* ── 改裝清單（依分類，純條列） ── */
function renderMods() {
  const box = document.getElementById('buildMods');
  document.getElementById('modCount').textContent = BUILD.length;
  box.innerHTML = BUILD_CATEGORIES.map(cat => {
    const items = BUILD.filter(p => p.category === cat);
    if (!items.length) return '';
    return `<div class="mod-cat">
      <h3 class="mod-cat-h">${esc(cat)}</h3>
      <ul class="mod-list">` +
      items.map(p => `<li class="mod-item">
        <div class="mod-item-top">
          <span class="mod-brand">${esc(p.brand)}</span>
          <span class="mod-status ${statusClass(p.status)}">${esc(p.status)}</span>
        </div>
        <h4 class="mod-name">${esc(p.product)}</h4>
        <p class="mod-desc">${esc(p.desc)}</p>
        ${p.note ? `<p class="mod-note">※ ${esc(p.note)}</p>` : ''}
      </li>`).join('') +
      `</ul></div>`;
  }).join('');
}

addEventListener('keydown', e => { if (e.key === 'Escape') menu.classList.remove('open'); });

renderMods();
