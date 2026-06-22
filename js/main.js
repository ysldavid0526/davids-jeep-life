/* main.js — 首頁(index.html)互動
   依賴 store.js（須先載入）：PRODUCTS / setupCart / addToCart / productCardHTML / closeCartDrawer
*/
setupCart();
updateAuthUI();

// 商品列表（精選商品區）
const grid = document.getElementById('grid');
if (grid) {
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
