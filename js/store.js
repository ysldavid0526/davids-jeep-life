/* store.js — 商品型錄資料與共用工具
   純展示型錄：顯示商品與價格，訂購走 Instagram 私訊（無購物車 / 會員 / 後端）。
   ── 要改商品：直接編輯下方 PRODUCTS 陣列
   ── 要改 IG 訂購連結：改 IG_ORDER
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

// Instagram 私訊訂購連結（商品的「私訊訂購」按鈕會開這個）
const IG_ORDER = 'https://ig.me/m/davidjeeplife';

const NT = n => 'NT$' + Number(n).toLocaleString('en-US');
const findProduct = id => PRODUCTS.find(p => p.id === id);

// 文字轉義（改裝頁顯示資料用）
function escapeHTML(s) {
  return (s == null ? '' : String(s)).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* 商品卡片（首頁與型錄共用）：圖片/標題可點進商品頁；價格旁為「私訊訂購」 */
function productCardHTML(p, revealClass = '') {
  const href = `product.html?id=${p.id}`;
  return `<article class="card ${revealClass}">` +
    `<a class="card-link" href="${href}"><div class="card-media"><span class="sku">${p.id}</span>` +
    `<img src="${p.img}" alt="${p.name}" loading="lazy"/></div></a>` +
    `<div class="card-body"><a class="card-link" href="${href}"><h3>${p.name}</h3></a><p>${p.desc}</p>` +
    `<div class="price-row"><span class="price"><span class="cur">NT$</span>${p.price.toLocaleString('en-US')}</span>` +
    `<a class="ig-order" href="${IG_ORDER}" target="_blank" rel="noopener">私訊訂購</a></div></div></article>`;
}
