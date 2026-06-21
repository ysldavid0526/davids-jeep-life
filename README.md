# David's Jeep Life — 官方網站

> Explore More. Live More.
> Jeep / 戶外探索生活風格品牌官網（純靜態網站）

---

## 資料夾結構

```
davidjeep system/
├── index.html              ← 網站主檔（HTML 結構與所有文案）
├── css/
│   └── styles.css          ← 所有樣式（顏色、版面、響應式）
├── js/
│   └── main.js             ← 商品資料 + 購物車 + 互動效果
├── assets/                 ← 所有圖片（已從原型還原成獨立檔）
│   ├── logo.png            ← 品牌 logo（導覽列 + 首屏共用）
│   ├── hero.jpg            ← 首屏背景
│   ├── story.jpg           ← 品牌故事照片
│   ├── founder.jpg         ← 創辦人照片
│   ├── manifesto.jpg       ← Manifesto 區背景
│   ├── product-dj-01.jpg   ← 鈦合金露營杯
│   ├── product-dj-02.jpg   ← 經典刷字 T 恤
│   ├── product-dj-03.jpg   ← 重磅刷毛帽 T
│   └── product-dj-04.jpg   ← 防潑水旅行袋
├── .claude/launch.json     ← 本機開發伺服器設定
├── build_from_prototype.py ← 一次性重構腳本（已執行完，可保留或刪除）
└── README.md               ← 本說明
```

---

## 怎麼啟動（本機預覽）

這是純靜態網站，**不需要安裝任何東西**，用 macOS 內建的 Python 就能跑。

在專案資料夾打開終端機，執行：

```bash
cd "/Users/shenchaocheng/davidjeep system"
python3 -m http.server 8765
```

然後在瀏覽器打開：**http://localhost:8765**

按 `Ctrl + C` 可停止伺服器。

> 💡 為什麼要用伺服器、不能直接雙擊 index.html？
> 直接用 `file://` 開啟時，瀏覽器的安全限制會擋掉部分功能（之後階段二的離線快取也需要伺服器環境）。用上面的指令最保險。

---

## 之後怎麼改內容

| 想改什麼 | 改哪個檔案 |
|---|---|
| 文字、標語、段落、選單 | `index.html` |
| 顏色、字級、間距、版面 | `css/styles.css`（最上方 `:root` 是品牌色變數） |
| 商品（名稱、價格、描述、免運門檻） | `js/main.js` 最上面的 `PRODUCTS` 陣列與 `FREE` 變數 |
| 換圖片 | 把新圖丟進 `assets/`，沿用相同檔名最省事；或改 `index.html` / `js/main.js` 裡的路徑 |

### 範例：新增一個商品
打開 `js/main.js`，在 `PRODUCTS` 陣列裡加一筆，並把商品圖放到 `assets/`：

```js
{ id:'DJ-05', name:'防風衝鋒衣', desc:'三層防水・透氣・軍綠', price:3280, img:'assets/product-dj-05.jpg' },
```

### 品牌色（已寫死在 css/styles.css 的 :root）
- 黑 `#111111`／軍綠 `#4A5A3A`／沙色 `#DCC9A3`／白 `#F5F5F5`／灰 `#6B6B6B`
- 標題字體 Bebas Neue、內文 Montserrat（從 Google Fonts 載入）

---

## 注意事項
- 「前往結帳」目前是**展示用**，按下只會跳提示，尚未接金流或後端。
- 字體目前從 Google Fonts 線上載入，需要網路才會顯示正確字體。
