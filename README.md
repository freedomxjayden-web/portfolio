# 作品中心 / Project Collection — v16

九頁繁中／英文靜態網站，本版包含核心體驗升級；公開發布及驗證結果見 `VERIFICATION-v16.md`。

本版按最新方向改用冷白 `#F1F5F7`、石墨 `#19262E`、藍灰 `#5E6C76` 及藍色 `#285E91`。保留工作枱構圖，移除膠紙、紙夾及裝飾箭嘴，作品只保留很小嘅角度差。中文標題引用裝置已有 LingWai TC，英文 Bradley Hand，提供楷體及 Georgia 等後備；不分發字體檔。內文維持 16px 系統無襯線字體。

## 九頁與來源

原七頁網址不變：首頁 `index.html`；分類 `categories/games.html`、`websites.html`、`programs.html`；作品 `projects/cat-outpost.html`、`cloud-drive.html`、`stock-atlas.html`。新增 `lab.html` 科學實驗室及 `study.html` 學習資料。

- `data/site.json`：雙語文案、作品與文件網址、分類、封面尺寸、日誌及實驗預設參數。
- `tools/build.py`、`tools/pages_v15.py`：Python 標準庫產生九頁、共享 `content.js`、metadata 及 sitemap。修改來源後重建，避免單改產生檔。
- `tools/covers.py`：現有原圖裁切、PNG／WebP 封面及九張 1200×630 分享圖；只喺製作圖片時使用現有 Pillow 與系統字體。原始截圖不修改。
- `styles.css`：共享排版、冷色主題、響應式、焦點及減少動態效果。
- `script.js`：共用語言、選單及原圖預覽；語言變更會通知頁面模組。
- `desk.js`：只喺首頁載入；桌面滑鼠拖動工作枱。
- `lab.js`：只喺科學實驗室載入；計算、繪圖、控制、保存及 PNG 匯出。
- `study.js`：只喺學習資料頁載入；科目篩選。
- `tools/check.py`：靜態路徑、錨點、分類、翻譯、圖片尺寸及六個文件網址檢查。

## 科學實驗室

新頁按最新確認改為互動科學實驗，取代原先拼貼／便條工具。

| 實驗 | 可調參數 | 模型及觀察 |
| --- | --- | --- |
| 波動 | 頻率 0.2–2 Hz、振幅 0.1–1 m | 波速固定 1 m/s；λ=c/f、T=1/f；理想行波，忽略阻尼與反射 |
| 拋體 | 初速度 5–25 m/s、角度 15–75°、地球／月球／火星 | 同高發射落地，忽略空氣阻力；顯示射程、飛行時間、最高點；可拖動時間滑桿 |
| 折射 | 入射角 0–80°、兩側空氣／水／玻璃 | Snell 定律與臨界角；顯示全內反射；折射率為固定近似值，不計色散或強度 |

動畫預設暫停，按「播放」才開始；離開可見頁面會暫停。所有參數用原生 range／select，可觸控或鍵盤調整，數值另以 HTML 呈現。PNG 輸出為 1200×800，只繪製當下實驗圖、標示及參數，不含工具列；等待字體載入，失敗保留狀態並容許重試。

參數使用獨立版本鍵 `portfolio-science-v1`；載入時驗證版本、有限數值、範圍及列舉值。損壞時回復預設並提示；儲存受阻仍可操作及下載。沒有上傳、登入、雲端儲存、新套件或 API。

## 工作枱與文件

≥1024px、滑鼠精確指標及可 hover 時，三件作品以獨立把手移動，限制在工作枱內；方向鍵 10px、Shift＋方向鍵 1px。拖動同直接入口分開。重設、重新載入及切換固定版面會回復預設；縮放後重新限制位置。平板、手機及觸控裝置用固定單欄：喵哨站、Stock Atlas、學習資料；先文字與入口，再圖片。

學習資料頁按歷史／物理／英文篩選；六個 PDF／Word 網址同雲端詳情頁保持一致，沒有新增未核實描述。停用 JavaScript 時完整顯示三科六個連結。

## 語言與相容性

原有語言鍵 `x-portfolio-language` 保持不變，跨九頁保存；品牌仍為純文字「作品中心」。選單及原圖預覽使用 dialog，保留 Esc、焦點循環及返回。原圖連結、作品入口、文件入口及靜態導覽無 JavaScript 仍可使用；科學頁顯示三個預設 SVG 示意、公式與模型說明，隱藏不可用控制。

保留首頁 #home、#work、#cloud-drive、#cat-outpost、#stock-atlas、#resources、#technology、#journal、#about、#contact，以及詳情 #implementation。支援減少動態效果，不使用自動漂浮、捲動接管或自訂游標。

## 重建與本機預覽

```sh
python3 tools/build.py
python3 tools/check.py
python3 -m http.server 4175 --bind 127.0.0.1
```

開啟 <http://127.0.0.1:4175/index.html?v=16> 或 <http://127.0.0.1:4175/lab.html?v=16>。網站運行只需要靜態檔案。

驗收紀錄與對照圖位於專案根目錄 `outputs/portfolio-v15-acceptance.md`、`outputs/portfolio-v14-v15-comparison.png`、`outputs/portfolio-v15-desktop-mobile.png`、`outputs/portfolio-v15-science-desktop-mobile.png`；實際逐頁截圖與瀏覽器報告在 `work/output/playwright/v15/`。參考 1:09、Grit Pictures、Fine Thought 嘅構圖方法，沒有移植其圖片、角色、標誌或字體。

## English

Nine bilingual static pages with a cooler workbench layout and less collage decoration. The new science lab contains travelling waves, projectile motion and refraction with validated local parameters, keyboard controls and PNG export. The study directory preserves all six original PDF/Word links. No backend, new runtime dependencies or deployment.

## v16 核心體驗升級

首頁使用具體定位，精選排序為喵哨站、Stock Atlas、學習資料。空白程式分類從主要導覽隱藏，原分類網址及舊錨點保留。案例提供版本、核對日期、實作與限制；未確認的個人分工不代填。

學習頁保留六個原網址；已實際讀取 PDF/Word 後補內容、頁數及檔案大小。原文件、AList 設定及權限未修改。文件作者、版本仍未確認。科學實驗新增三條觀察任務，PNG 加上模型假設。

修改 `data/site.json`、產生器或共用資產後執行 `python3 tools/build.py` 與 `python3 tools/check.py`。更新封面用 `python3 tools/covers.py`（Pillow）；全尺寸原圖保留。現有公開網址為 https://freedomxjayden-web.github.io/portfolio/ 。

## English — v16

The original bilingual cool workbench is preserved. Clearer project actions, release evidence, verified study-file metadata and science observation tasks improve the core flow. Cat Outpost and Stock Atlas previews now show the current versions. Existing routes, anchors and document URLs remain compatible. AList and Block Gun are outside this release.
