/* build-data.js — DAVID'S JEEP 改裝資料庫 V2.0
   ─────────────────────────────────────────────
   規則：
   • 未確認的規格一律用 '待確認'，不編造。
   • 官方查到但未確認與實車一致的規格 → 放 reference（官方參考規格），不可當實車規格。
   • EVO / KING / TeraFlex 為三個獨立品牌，分開顯示。
   • 照片路徑集中於 assets/build/<folder>/ ，缺圖時顯示佔位圖（不破圖）。
   要新增照片：把 product.webp / installed.webp / detail-01.webp ... 放進對應資料夾即可。
*/

const BUILD_VEHICLE = {
  siteName: "DAVID'S JEEP",
  tagline: ['BUILT FOR THE EXTREME.', 'MADE FOR ADVENTURE.'],
  brand: 'Jeep',
  model: 'Wrangler JL Rubicon',
  engine: '3.6L Pentastar V6',
};

// 依資料夾產生三種照片路徑（實際檔案由使用者上傳，缺檔自動顯示佔位圖）
function buildPhotos(folder, detailCount = 2) {
  const base = 'assets/build/' + folder + '/';
  const detail = [];
  for (let i = 1; i <= detailCount; i++) detail.push(base + 'detail-' + String(i).padStart(2, '0') + '.webp');
  return { product: base + 'product.webp', installed: base + 'installed.webp', detail };
}

const BUILD_CATEGORIES = [
  'SUSPENSION SYSTEM',
  'AXLES & DRIVETRAIN',
  'STEERING & SWAY BAR',
  'WHEELS & TIRES',
  'EXTERIOR & RECOVERY',
  'OVERLANDING',
  'LIGHTING & ELECTRONICS',
  'AIR SYSTEM',
];

const BUILD = [
  /* ── SUSPENSION SYSTEM ── */
  {
    id: 'evo', brand: 'EVO Manufacturing', product: 'EVO Suspension System',
    model: '待確認', category: 'SUSPENSION SYSTEM', status: '目前使用',
    desc: '本車懸吊系統的主體架構，由 EVO Manufacturing 打造。EVO 為整套懸吊的主要品牌，搭配 KING 避震器與 TeraFlex 長控制臂一同運作。',
    dimensions: '待確認', specs: [], folder: 'evo',
    official: 'https://evomfg.com', officialProduct: '待確認',
  },
  {
    id: 'king', brand: 'KING Shocks', product: 'EVO SPEC KING Shocks',
    model: '待確認', category: 'SUSPENSION SYSTEM', status: '目前使用',
    desc: '搭配 EVO 系統使用的高性能避震器（EVO SPEC）。KING 為避震品牌，並非整套懸吊名稱。',
    note: '另有一組 KING 14" 客製後避震為先前購入之改裝品，目前尚未確認是否安裝；不以此覆蓋現役的 EVO SPEC KING 配置。',
    dimensions: '待確認', specs: [], folder: 'king',
    official: 'https://kingshocks.com', officialProduct: '待確認',
  },
  {
    id: 'teraflex', brand: 'TeraFlex', product: 'Long Control Arms',
    model: '版本待確認', category: 'SUSPENSION SYSTEM', status: '目前使用',
    desc: 'TeraFlex 長控制臂（Long Control Arms），改善大行程下的幾何與穩定度。此為 TeraFlex 品牌產品，非 EVO 長牛腿。',
    dimensions: '待確認', specs: [], folder: 'teraflex',
    official: 'https://teraflex.com', officialProduct: '待確認',
  },
  {
    id: 'fox', brand: 'FOX', product: 'Hydraulic Bump Stops',
    model: '型號待確認', category: 'SUSPENSION SYSTEM', status: '目前配置紀錄',
    desc: 'FOX 液壓緩衝（Hydraulic Bump Stops），吸收大行程觸底衝擊。',
    dimensions: '待確認', specs: [], folder: 'fox',
    official: 'https://ridefox.com', officialProduct: '待確認',
  },

  /* ── AXLES & DRIVETRAIN ── */
  {
    id: 'dynatrac-front', brand: 'Dynatrac', product: 'ProRock 60 Front Axle',
    model: 'ProRock 60', category: 'AXLES & DRIVETRAIN', status: '已改裝',
    desc: 'Dynatrac ProRock 60 前車軸，高強度重負荷車軸，對應大尺寸輪胎與嚴苛越野。',
    dimensions: '待確認', specs: [], folder: 'dynatrac',
    official: 'https://www.dynatrac.com', officialProduct: '待確認',
  },
  {
    id: 'dynatrac-rear', brand: 'Dynatrac', product: 'ProRock 60 Rear Axle',
    model: 'ProRock 60', category: 'AXLES & DRIVETRAIN', status: '已改裝',
    desc: 'Dynatrac ProRock 60 後車軸，與前軸同級的重負荷車軸配置。',
    dimensions: '待確認', specs: [], folder: 'dynatrac',
    official: 'https://www.dynatrac.com', officialProduct: '待確認',
  },
  {
    id: 'adams', brand: 'Adams Driveshaft', product: 'Heavy Duty Driveshaft',
    model: '1310 / 1350 規格待確認', category: 'AXLES & DRIVETRAIN', status: '已改裝',
    desc: 'Adams Driveshaft 重負荷傳動軸，對應升高與大扭力輸出。',
    note: '1310 / 1350 規格待確認；前後軸的實際安裝配置待確認。',
    dimensions: '待確認', specs: [], folder: 'adams',
    official: 'https://www.adamsdriveshaftoffroad.com', officialProduct: '待確認',
  },

  /* ── STEERING & SWAY BAR ── */
  {
    id: 'psc', brand: 'PSC Motorsports', product: 'Hydraulic Steering',
    model: '待確認', category: 'STEERING & SWAY BAR', status: '已改裝',
    desc: 'PSC Motorsports 液壓輔助轉向，對應大尺寸輪胎的轉向負荷。',
    dimensions: '待確認', specs: [], folder: 'psc',
    official: 'https://www.pscmotorsports.com', officialProduct: '待確認',
  },
  {
    id: 'swayloc', brand: 'OffRoadOnly', product: 'SwayLOC Dual-Rate Sway Bar',
    model: '待確認', category: 'STEERING & SWAY BAR', status: '已改裝',
    desc: 'OffRoadOnly SwayLOC 雙段式防傾桿，可切換公路剛性與越野斷開。',
    note: '前後配置及控制方式待確認。',
    dimensions: '待確認', specs: [], folder: 'swayloc',
    official: 'https://offroadonly.com', officialProduct: '待確認',
  },

  /* ── WHEELS & TIRES ── */
  {
    id: 'maxxis', brand: 'MAXXIS', product: 'Trepador M8060',
    model: 'M8060 · 42 Inch', category: 'WHEELS & TIRES', status: '已改裝',
    desc: 'MAXXIS Trepador M8060 42 吋越野胎，強悍胎紋與側壁，適應岩石與極限地形。',
    dimensions: '42 吋（42")', specs: [['尺寸', '42 吋'], ['型號', 'Trepador M8060']], folder: 'maxxis',
    official: 'https://www.maxxis.com', officialProduct: '待確認',
  },
  {
    id: 'raceline', brand: 'Raceline Wheels', product: 'True Beadlock',
    model: 'True Beadlock · 8 Lug', category: 'WHEELS & TIRES', status: '已改裝',
    desc: 'Raceline True Beadlock 真鎖胎圈，8 孔配置，低胎壓越野不脫圈。',
    dimensions: '8 Lug', specs: [['鎖圈', 'True Beadlock'], ['孔數', '8 Lug']], folder: 'raceline',
    official: 'https://racelinewheels.com', officialProduct: '待確認',
  },

  /* ── EXTERIOR & RECOVERY ── */
  {
    id: 'rebel', brand: 'Rebel Off Road', product: 'Front & Rear Bumper',
    model: '待確認', category: 'EXTERIOR & RECOVERY', status: '已改裝',
    desc: 'Rebel Off Road 前後保桿，強化進離去角與脫困、拖曳能力。',
    dimensions: '待確認', specs: [], folder: 'rebel',
    official: 'https://rebeloffroad.com', officialProduct: '待確認',
  },
  {
    id: 'rockslide-step', brand: 'Rock Slide Engineering', product: 'Electric Step Slider',
    model: '待確認', category: 'EXTERIOR & RECOVERY', status: '已改裝',
    desc: 'Rock Slide Engineering 電動側踏兼岩石滑板，上車可展開、越野可收起保護車側。',
    dimensions: '待確認', specs: [], folder: 'rockslide',
    official: 'https://rockslideengineering.com', officialProduct: '待確認',
  },
  {
    id: 'warn', brand: 'WARN', product: 'Electric Winch',
    model: '待確認', category: 'EXTERIOR & RECOVERY', status: '已改裝',
    desc: 'WARN 電動絞盤，自救與救援的核心脫困裝備。',
    dimensions: '待確認', specs: [], folder: 'warn',
    official: 'https://www.warn.com', officialProduct: '待確認',
  },

  /* ── OVERLANDING ── */
  {
    id: 'rockslide-spare', brand: 'Rock Slide Engineering', product: 'Rear Spare Tire Equipment Mount',
    model: '型號待確認', category: 'OVERLANDING', status: '已改裝',
    desc: 'Rock Slide Engineering 後備胎裝備架，於備胎處擴充載物與配件掛載。',
    dimensions: '待確認', specs: [], folder: 'rockslide',
    official: 'https://rockslideengineering.com', officialProduct: '待確認',
  },
  {
    id: 'watertank', brand: 'Rear Spare Tire Water Storage', product: 'Water Tank',
    model: '品牌與容量待確認', category: 'OVERLANDING', status: '已改裝',
    desc: '後備胎水箱，於備胎後方儲水，支援長程 Overlanding 用水。',
    note: '品牌與容量待確認。',
    dimensions: '待確認', specs: [], folder: 'water-tank',
    official: '待確認', officialProduct: '待確認',
  },
  {
    id: 'ada', brand: 'ADA', product: 'Side Awning',
    model: '待確認', category: 'OVERLANDING', status: '已改裝',
    desc: 'ADA 車側遮陽棚，快速展開提供營地遮蔽。',
    dimensions: '待確認', specs: [], folder: 'ada',
    official: '待確認', officialProduct: '待確認',
  },
  {
    id: 'rooftop', brand: 'Integrated Pop-up Rooftop Tent', product: 'Pop-up Rooftop Tent',
    model: '品牌與型號待確認', category: 'OVERLANDING', status: '已改裝',
    desc: '整合式車頂帳，彈起式設計，提供離地舒適露營空間。',
    note: '品牌與型號待確認。',
    dimensions: '待確認', specs: [], folder: 'rooftop',
    official: '待確認', officialProduct: '待確認',
  },

  /* ── LIGHTING & ELECTRONICS ── */
  {
    id: 'baja', brand: 'Baja Designs', product: 'Auxiliary Lighting',
    model: '待確認', category: 'LIGHTING & ELECTRONICS', status: '已改裝',
    desc: 'Baja Designs 輔助照明，提供高亮度越野照明。',
    dimensions: '待確認', specs: [], folder: 'baja',
    official: 'https://www.bajadesigns.com', officialProduct: '待確認',
  },
  {
    id: 'rigid', brand: 'RIGID Industries', product: 'LED Lighting',
    model: '待確認', category: 'LIGHTING & ELECTRONICS', status: '已改裝',
    desc: 'RIGID Industries LED 照明，強化夜間與惡劣天候能見度。',
    dimensions: '待確認', specs: [], folder: 'rigid',
    official: 'https://www.rigidindustries.com', officialProduct: '待確認',
  },
  {
    id: 'fury', brand: 'FURY', product: 'Auxiliary Light Control System',
    model: '型號待確認', category: 'LIGHTING & ELECTRONICS', status: '已改裝',
    desc: 'FURY 燈光控制系統，整合機艙內的輔助燈光開關與配電控制。',
    note: '機艙相關控制設備，詳細型號待確認。',
    dimensions: '待確認', specs: [], folder: 'fury',
    official: 'https://www.furyengraver.com', officialProduct: '待確認',
  },

  /* ── AIR SYSTEM ── */
  {
    id: 'arb', brand: 'ARB', product: 'Onboard Air Compressor',
    model: '待確認', category: 'AIR SYSTEM', status: '已改裝',
    desc: 'ARB 車載打氣幫浦，越野後快速充氣、支援氣動工具與鎖定差速器。',
    dimensions: '待確認', specs: [], folder: 'arb',
    official: 'https://store.arbusa.com', officialProduct: '待確認',
  },
];

// 實車安裝照（用 David 的真實 Jeep 照片；缺的維持佔位）
const R = 'assets/build/_real/';
const BUILD_INST = {
  evo: R + 'susp.webp', king: R + 'susp.webp', fox: R + 'susp.webp',
  teraflex: R + 'underbody.webp', 'dynatrac-front': R + 'underbody.webp', 'dynatrac-rear': R + 'underbody.webp',
  adams: R + 'underbody.webp', psc: R + 'underbody.webp', swayloc: R + 'underbody.webp',
  maxxis: R + 'underbody.webp', raceline: R + 'underbody.webp',
  rebel: R + 'front.webp', warn: R + 'front.webp', baja: R + 'front.webp', rigid: R + 'front.webp',
  'rockslide-step': R + 'side.webp', 'rockslide-spare': R + 'side.webp',
  watertank: R + 'side.webp', ada: R + 'side.webp', rooftop: R + 'side.webp',
};
// 把照片路徑補進每個產品（集中管理）；有實車照就套用
BUILD.forEach(p => {
  p.photos = buildPhotos(p.folder);
  if (BUILD_INST[p.id]) p.photos.installed = BUILD_INST[p.id];
  p.card = p.photos.installed; // 卡片縮圖優先用實車照（缺則為佔位路徑）
});

function findBuild(id) { return BUILD.find(p => p.id === id); }

/* 互動車輛視角 —— 熱點座標為 % （待換上實車照片後可再微調）
   每個 view：id / label / img（背景照，缺檔顯示佔位）/ hotspots[{x,y,label,pid}] */
const BUILD_VIEWS = [
  {
    id: 'side', label: 'SIDE VIEW', img: 'assets/build/_real/side.webp',
    hotspots: [
      { x: 12, y: 78, label: 'Front Tire · MAXXIS M8060', pid: 'maxxis' },
      { x: 12, y: 64, label: 'Front Wheel · Raceline Beadlock', pid: 'raceline' },
      { x: 19, y: 50, label: 'Front Suspension · EVO / KING', pid: 'evo' },
      { x: 21, y: 73, label: 'Front Axle · Dynatrac ProRock 60', pid: 'dynatrac-front' },
      { x: 27, y: 77, label: 'Long Control Arms · TeraFlex', pid: 'teraflex' },
      { x: 16, y: 58, label: 'Steering · PSC', pid: 'psc' },
      { x: 32, y: 72, label: 'Sway Bar · SwayLOC', pid: 'swayloc' },
      { x: 44, y: 73, label: 'Side Steps · Rock Slide', pid: 'rockslide-step' },
    ],
  },
  {
    id: 'rear', label: 'REAR VIEW', img: 'assets/build/_real/rear.webp',
    hotspots: [
      { x: 50, y: 64, label: 'Rear Axle · Dynatrac ProRock 60', pid: 'dynatrac-rear' },
      { x: 45, y: 50, label: 'Rear Suspension · EVO / KING', pid: 'king' },
      { x: 55, y: 40, label: 'Spare Tire Equipment · Rock Slide', pid: 'rockslide-spare' },
      { x: 60, y: 46, label: 'Water Tank · Spare Tire Storage', pid: 'watertank' },
      { x: 48, y: 22, label: 'Rooftop · Pop-up Tent', pid: 'rooftop' },
    ],
  },
  {
    id: 'front', label: 'FRONT VIEW', img: 'assets/build/_real/front.webp',
    hotspots: [
      { x: 53, y: 85, label: 'Front Bumper · Rebel Off Road', pid: 'rebel' },
      { x: 52, y: 78, label: 'Winch · WARN', pid: 'warn' },
      { x: 43, y: 91, label: 'Lighting · Baja Designs', pid: 'baja' },
      { x: 56, y: 17, label: 'Lighting · RIGID', pid: 'rigid' },
    ],
  },
  {
    id: 'underbody', label: 'UNDERBODY', img: 'assets/build/_real/underbody.webp',
    hotspots: [
      { x: 56, y: 49, label: 'EVO Suspension / KING', pid: 'evo' },
      { x: 44, y: 72, label: 'SwayLOC Sway Bar', pid: 'swayloc' },
      { x: 27, y: 86, label: 'PSC Steering', pid: 'psc' },
      { x: 36, y: 90, label: 'Dynatrac Axle', pid: 'dynatrac-front' },
      { x: 48, y: 88, label: 'Adams Driveshaft', pid: 'adams' },
      { x: 62, y: 60, label: 'MAXXIS / Raceline', pid: 'maxxis' },
    ],
  },
  {
    id: 'engine', label: 'ENGINE BAY', img: 'assets/build/views/engine.webp',
    hotspots: [
      { x: 50, y: 48, label: 'Lighting Control · FURY', pid: 'fury' },
      { x: 32, y: 56, label: 'Onboard Air · ARB', pid: 'arb' },
    ],
  },
];
