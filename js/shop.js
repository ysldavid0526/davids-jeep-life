/* shop.js — 型錄頁(shop.html) 依賴 store.js：PRODUCTS / productCardHTML */

const grid = document.getElementById('grid');
if (grid) grid.innerHTML = PRODUCTS.map(p => productCardHTML(p)).join('');

// 行動版選單
const menu = document.getElementById('menu');
document.getElementById('openMenu').onclick = () => menu.classList.add('open');
document.getElementById('closeMenu').onclick = () => menu.classList.remove('open');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));

addEventListener('keydown', e => { if (e.key === 'Escape') menu.classList.remove('open'); });
