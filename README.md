# x 作品目錄 / Project directory

公開網站：https://freedomxjayden-web.github.io/portfolio/

靜態 HTML、CSS、JavaScript；GitHub Pages 由 main 根目錄發布，無安裝、編譯或後端。

## 頁面與操作

- 首頁：三行作品入口，依次為雲端檔案庫、喵哨站、Stock Atlas；主要按鈕直接使用作品，次要連結進入作品介紹。
- 三橫線導覽：手機與桌面均使用分類側欄，含簡短介紹、遊戲、網站、程式及聯絡連結。遊戲為喵哨站；網站為雲端檔案庫及 Stock Atlas；程式目前沒有作品。
- 每件作品獨立一頁，保留 projects/cloud-drive.html、projects/cat-outpost.html、projects/stock-atlas.html，可直接分享及重新整理。
- 作品頁包含真實畫面、直接入口、功能及開始使用步驟；實作、來源與限制以原生 details 展開。雲端檔案庫保留原有六個文件連結。
- 技術以一行附實作連結顯示。日誌收起，四筆日期紀錄反映真實主網站里程碑。關於只含名字與作品理念。

## 視覺與相容性

暖灰白 #F6F5F1、深藍 #172B3A、青綠 #087F78，系統字體；內文至少 16px、輔助文字至少 13px、主要操作至少 44px 高。

首頁保留 #home、#work、#cloud-drive、#cat-outpost、#stock-atlas、#resources、#technology、#journal、#about、#contact。首頁 #resources 連到雲端作品頁內的文件區。#implementation 可直接展開作品實作說明。

預設香港繁中，可切換英文；共用 x-portfolio-language 儲存鍵，跨頁及重新載入保留選擇。儲存被禁止時，當次頁面仍可切換。標題、描述、替代文字、預覽及分類導覽同步翻譯。

分類側欄與圖片預覽使用原生 dialog，支援焦點循環、Esc、關閉按鈕、背景關閉及焦點返回。主要內容支援跳至內容、可見鍵盤焦點及減少動態效果。停用 JavaScript 時，分類導覽直接顯示、圖片連結開啟原圖，作品、介紹、文件及原生展開區仍可使用。

無外部字體、追蹤程式、登入、表單、雲盤 API 請求或即時狀態監測。附屬作品網站未有改動。

## 本機預覽

在本目錄執行：

```sh
python3 -m http.server 4174 --bind 127.0.0.1
```

開啟 http://127.0.0.1:4174/?v=10 ，亦可直接開啟 HTML 檔案。

## 維護與來源

content.js 存放中英文及各頁 metadata；HTML 保留完整預設繁中內容，修改時兩者需要同步。script.js 處理語言、分類側欄、圖片預覽與錨點展開；styles.css 為四頁共用樣式。使用相對資源路徑，保留 /portfolio/ 子目錄相容性。

截圖：雲端檔案庫、喵哨站為 2026-10-25；Stock Atlas 為 2026-10-26。Stock Atlas 引用 2026-10-26 歷史驗收紀錄，並非本次新測試或持續服務保證。AList／Google Drive 為現成平台，未聲稱自行開發儲存服務；喵哨站只根據公開資訊說明。

## 發布與回復

儲存庫：https://github.com/freedomxjayden-web/portfolio

網站檔案、projects/、assets/ 發布至 main 根目錄，保留 .nojekyll。確認 Pages build 完成後覆驗四頁、資源與互動。改版前提交為 1abc8310d1929747830773f840791d05fb7057d7；如有問題，對本次改版提交執行 git revert，再重新發布，避免覆寫後續修改。

## English

A compact bilingual directory with three direct project entries and one dedicated page per project. A hamburger menu opens a classified navigation drawer on desktop and mobile: Games, Websites and an empty Programs category. Each project page provides real screenshots, features, getting-started steps and collapsible implementation/source/limitation notes. Native dialogs support keyboard navigation; core links and details remain usable without JavaScript. Only the portfolio website was changed.
