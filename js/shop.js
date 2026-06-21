/* shop.js — 購物頁(shop.html)互動
   依賴 store.js（須先載入）：PRODUCTS / setupCart / addToCart / productCardHTML / closeCartDrawer
*/
setupCart();

// 商品列表
const grid = document.getElementById('grid');
if (grid) {
  grid.innerHTML = PRODUCTS.map(p => productCardHTML(p)).join('');
  grid.addEventListener('click', e => {
    const b = e.target.closest('.add');
    if (b) addToCart(b.dataset.id);
  });
}

// 行動版選單
const menu = document.getElementById('menu');
document.getElementById('openMenu').onclick = () => menu.classList.add('open');
document.getElementById('closeMenu').onclick = () => menu.classList.remove('open');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));

// 會員按鈕（依登入狀態顯示，點擊前往會員頁）
updateAuthUI();

addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (window.closeCartDrawer) closeCartDrawer(); menu.classList.remove('open'); }
});
