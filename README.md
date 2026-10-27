# x 作品中心 / Project Collection

公開網站：https://freedomxjayden-web.github.io/portfolio/

七頁靜態 HTML、CSS、JavaScript，GitHub Pages 由 main 根目錄發布。瀏覽網站毋須安裝依賴或執行後端。

## 網站結構

- `index.html`：三件作品嘅橫向目錄，依次為雲端檔案庫、喵哨站、Stock Atlas。
- `categories/games.html`：遊戲，喵哨站，1 件。
- `categories/websites.html`：網站，雲端檔案庫及 Stock Atlas，2 件。
- `categories/programs.html`：程式，0 件，提供返回全部作品入口。
- `projects/cloud-drive.html`、`projects/cat-outpost.html`、`projects/stock-atlas.html`：獨立作品展示頁，包含直接使用、大幅實際畫面、功能、三步使用方法及可展開嘅實作／來源／限制。雲端檔案庫另有六個文件入口。

三橫線選單供桌面及手機使用，包含簡短介紹、三類數量、各作品及 Instagram／GitHub。分類及作品頁可直接分享及重新整理。

## 視覺與內容

全站使用暖白 #F6F5F1、深藍 #172B3A、青綠 #087F78，系統字體；目錄採統一白色列表，作品頁採用途標題、直接入口與全幅畫面。各作品封面由真實截圖重新裁切及構圖：文件紙張、像素貓咪與戰場、股票知識卡片。放大後顯示完整原始截圖，並非封面合成圖。

截圖於 2026-10-27 重新擷取。封面內像素角色取自遊戲實際畫面，沒有製作假介面、示範行情或使用設計參考網站嘅圖片。設計參考：Sindre Sorhus Apps、Gifski、Linear 及 Nicky Case，取其產品識別、圖文比例、分類與操作層次。

各頁有獨立標題、描述、canonical、1200×630 分享圖及分類麵包屑。所有圖片提供 PNG 原圖與 WebP、明確尺寸及適當延遲載入。內文至少 16px，輔助文字至少 13px，主要操作至少 44px 高。

Stock Atlas 引用嘅 2026-10-26 驗收結果屬歷史紀錄，不代表本次重跑項目測試或持續服務監測。AList／Google Drive 為現成平台；喵哨站只根據公開可確認內容介紹。附屬作品網站未有改動。

## 語言與無障礙

首次預設香港繁中，英文完整翻譯；`x-portfolio-language` 儲存鍵跨頁保存語言。儲存被禁止時仍可在當頁切換。頁面標題、描述、圖片替代文字、選單、分類、預覽與日誌同步翻譯。

選單及圖片預覽使用原生 dialog，支援關閉按鈕、背景關閉、Esc、Tab 循環及焦點返回。另有跳至內容、可見焦點及減少動態效果。停用 JavaScript 後，分類導覽、主要內容、直接入口、作品介紹、六個文件及原生展開區仍可使用；圖片連結直接開啟完整原圖。

保留首頁 #home、#work、#cloud-drive、#cat-outpost、#stock-atlas、#resources、#technology、#journal、#about、#contact。#resources 連到雲端作品頁文件區；作品頁 #implementation 可直接展開實作資料。

無追蹤、登入、搜尋、評分、表單、新 API 或後端。

## 本機預覽及維護

```sh
python3 tools/build.py
python3 -m http.server 4174 --bind 127.0.0.1
```

開啟 http://127.0.0.1:4174/?v=11 。亦可直接開啟七個 HTML 檔案。

- `data/site.json`：作品、分類、入口、圖片資料、六個檔案網址、完整中英文及日誌。新增作品或調整分類只需由此維護；數量與目錄由作品資料計算。
- `tools/build.py`：只需 Python 3 標準庫，產生七頁完整靜態 HTML、裁減後嘅 `content.js` 及 sitemap。修改來源後執行；不要單獨修改產生嘅頁面。
- `tools/covers.py`：可選嘅封面製作工具，需要 Pillow 及 macOS 系統中文字體。讀取保留嘅真實 PNG，輸出三張封面及七張分享圖。網站運行及一般內容重建不需要 Pillow。
- `script.js`：語言、選單、原圖預覽與錨點展開。
- `styles.css`：全站七頁共享視覺及各尺寸排版。

五筆手動日誌只記錄實際里程碑；狀態標籤由人工維護，不自動抓取提交或即時監測。

## 驗收與發布

驗收範圍：七頁、兩種語言、320／390／768／1024／1440px；分類及空狀態、跨頁語言、所有原有連結、手機選單、圖片預覽、焦點循環、Esc、跳至內容、原生展開區、減少動態效果及停用 JavaScript。桌面 1440×900 要見到三件作品名稱及使用入口，390×844 要見到第一件作品使用入口。

正式發布後另外覆驗七頁、靜態資源及手機 Lighthouse（效能／無障礙／SEO）。實際分數及日期隨本次交付驗收紀錄提供；分數為單次測量，會受網絡與設備影響。

儲存庫：https://github.com/freedomxjayden-web/portfolio

發布保留 `.nojekyll`，確認 Pages build 成功及對應提交，再覆驗正式網址。改版前基準為 `8ca27b4e67d0e254e82249aad5c5628836ea8185`；若有問題，對本次發布提交執行 `git revert` 再重新發布，保留其後修改。

## English

A bilingual seven-page collection with a compact project directory, three shareable category pages and three dedicated project pages. Art-directed covers use real screenshots; enlarged previews show the complete originals. Category membership, counts, URLs and copy are maintained in `data/site.json`, and `python3 tools/build.py` generates complete static pages without third-party packages. Browsing needs no build, backend or tracking. Keyboard, responsive, cross-page language and no-JavaScript flows are covered by release verification. Only the portfolio repository is changed.
