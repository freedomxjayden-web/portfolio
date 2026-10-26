(() => {
  'use strict';

  const messages = {
    zh: {
      title: '作品集 — 網站、工具與遊戲',
      heroLineOne: '有用，', heroLineTwo: '亦有趣。', heroDescription: '搵份溫習資料、守住貓咪基地，或者讀懂一個股票術語。由你想做嘅事開始。',
      exploreWork: '探索三件作品', selectedWork: '作品目錄', collectionNote: '揀一件，直接開始。',
      actualPreview: '實際畫面', enlargePreview: '放大預覽', previewNote: '先睇實際畫面，再打開作品。', fullArchive: '瀏覽完整雲端檔案庫',
      closePreview: '關閉', screenshotNote: '靜態畫面預覽；使用作品請按作品卡片上嘅按鈕。', studyTag: '三個科目', browserPlay: '瀏覽器直接玩', previewPrefix: '放大預覽：',
      description: '探索可以直接使用嘅作品：雲端檔案庫學習資料、喵哨站貓咪塔防，同 Stock Atlas 股票術語及分析工具。',
      indexStock: '查術語、研究股票', stockCategory: '股票知識與分析', stockLede: '由睇懂術語，到研究一隻股票。',
      stockDescription: '用白話解釋同例子理解 200 個股票術語，按八大分類搵概念；再由港股或美股代號，開始研究走勢同基本面。',
      stockTerms: '200 個術語', stockCategories: '八大分類', stockMarkets: '港股及美股', openStock: '探索股票術語', stockAnalysis: '研究一隻股票',
      stockPlatform: '搜尋術語 · 分類瀏覽 · 收藏概念', stockPreviewLink: '開啟 Stock Atlas 股票術語資料庫（於新分頁開啟）',
      stockPreviewAlt: 'Stock Atlas 實際術語資料庫，包含搜尋欄、八大知識分類及股票術語卡片。',
      skip: '跳至主要內容', home: '作品集 — 返回頁首', navigation: '主要導覽', language: '網站語言',
      portfolio: '作品集', navWork: '作品', navResources: '資料內容', eyebrow: '網站、工具與遊戲',
      projectIndex: '揀選作品', indexStudy: '搵學習資料', indexGame: '玩貓咪塔防', seeSubjects: '揀科目',
      gameTitle: '喵哨站', gameCategory: '瀏覽器遊戲 · 塔防生存', gameLede: '最後一罐罐罐，交畀你守護。',
      gameDescription: '帶領貓咪小隊，應付四方來襲嘅敵人。部署炮塔、改裝升級，睇下你可以守幾耐。',
      gamePixel: '像素塔防', gameSurvival: '無限生存', playGame: '即刻開玩', gamePlatform: '瀏覽器直接玩 · 自動射擊，你專心部署',
      gamePreviewLink: '開啟喵哨站遊戲（於新分頁開啟）', gamePreviewAlt: '喵哨站開始畫面，三隻像素貓咪與「罐罐喺度，我哋唔退」標語。', gamePreviewCaption: '遊戲實際開始畫面',
      workTitle: '作品，打開就能用。', collected: '作品目錄', projectCategory: '檔案與學習', projectTitle: '雲端檔案庫',
      projectLede: '溫習資料，集中一處。',
      projectDescription: '中國近代史、初三物理、英文中英對照。按科目搵資料，選 PDF 或 Word 開啟。',
      openStudy: '打開學習資料', openProject: '瀏覽完整網站', newTab: '（於新分頁開啟）', formats: 'PDF 及 Word',
      previewLabel: '先睇內容，再打開。', previewLink: '開啟雲端檔案庫學習資料（於新分頁開啟）',
      previewAlt: '雲端檔案庫實際介面，列出歷史、物理及英文嘅 PDF 和 Word 資料。', previewCaption: '網站實際畫面',
      insideProject: '01 / 雲端檔案庫 · 學習資料', resourcesTitle: '由你要睇嘅科目開始。', resourcesDescription: '揀科目，再揀你想用嘅格式。',
      historyTitle: '中國近代史', historyDescription: '學習資料', historyFormats: '中國近代史資料格式',
      physicsTitle: '初三物理', physicsDescription: '重點溫習 · 20 頁詳細版', physicsFormats: '初三物理資料格式',
      englishTitle: '英文', englishDescription: '中英對照學習資料', englishFormats: '英文資料格式',
      allFilesDescription: '想直接睇晒所有檔案？', allFiles: '前往學習資料夾', contact: '聯絡', backTop: '返回頁首',
    },
    en: {
      title: 'Portfolio — Websites, Tools & Games',
      heroLineOne: 'Useful.', heroLineTwo: 'Playful.', heroDescription: 'Find study notes, defend a cat outpost, or make sense of a stock term. Start with what you want to do.',
      exploreWork: 'Explore three projects', selectedWork: 'Selected work', collectionNote: 'Pick a project. Try it out.',
      actualPreview: 'Actual screenshot', enlargePreview: 'View larger', previewNote: 'See the real interface. Then try it yourself.', fullArchive: 'Browse the full Cloud Drive',
      closePreview: 'Close', screenshotNote: 'Static screenshot. To use the project, open it from its card.', studyTag: 'Three subjects', browserPlay: 'Play in your browser', previewPrefix: 'Enlarge preview: ',
      description: 'Explore projects you can use now: Cloud Drive study resources, Cat Outpost tower defence, and Stock Atlas stock terms and analysis tools.',
      indexStock: 'Learn terms, research stocks', stockCategory: 'Stock knowledge & analysis', stockLede: 'Learn the terms. Research a stock.',
      stockDescription: 'Learn 200 stock terms across eight categories with clear explanations and examples. Explore Hong Kong and US stock trends and fundamentals.',
      stockTerms: '200 stock terms', stockCategories: 'Eight categories', stockMarkets: 'HK & US stocks', openStock: 'Explore stock terms', stockAnalysis: 'Research a stock',
      stockPlatform: 'Search terms · Browse categories · Save favourites', stockPreviewLink: 'Open Stock Atlas stock glossary (opens in a new tab)',
      stockPreviewAlt: 'Actual Stock Atlas glossary with a search bar, eight knowledge categories and stock terminology cards.',
      skip: 'Skip to content', home: 'Portfolio — Back to top', navigation: 'Main navigation', language: 'Site language',
      portfolio: 'Portfolio', navWork: 'Work', navResources: 'Resources', eyebrow: 'Websites, tools & games',
      projectIndex: 'Choose a project', indexStudy: 'Find study resources', indexGame: 'Play cat tower defence', seeSubjects: 'Choose a subject',
      gameTitle: 'Cat Outpost', gameCategory: 'Browser game · Tower defence', gameLede: 'One last can. Hold the line.',
      gameDescription: 'Defend your cat outpost from every direction. Deploy and upgrade towers, then see how long you can hold the line.',
      gamePixel: 'Pixel tower defence', gameSurvival: 'Endless survival', playGame: 'Play now', gamePlatform: 'Play in your browser · Auto-fire, you handle deployment',
      gamePreviewLink: 'Open Cat Outpost game (opens in a new tab)', gamePreviewAlt: 'Cat Outpost start screen with three pixel-art cats and a rallying message to defend the last supply.', gamePreviewCaption: 'Actual game start screen',
      workTitle: 'Made to be used.', collected: 'Project index', projectCategory: 'Files & learning', projectTitle: 'Cloud Drive',
      projectLede: 'Study resources. One place.',
      projectDescription: 'Modern Chinese history, Year 9 physics, and bilingual English notes. Choose your subject and open a PDF or Word file.',
      openStudy: 'Explore study resources', openProject: 'Visit the full website', newTab: ' (opens in a new tab)', formats: 'PDF & Word',
      previewLabel: 'See what’s inside.', previewLink: 'Open Cloud Drive study resources (opens in a new tab)',
      previewAlt: 'Actual Cloud Drive interface listing history, physics, and English resources in PDF and Word formats.', previewCaption: 'Actual website preview',
      insideProject: '01 / Cloud Drive · Study resources', resourcesTitle: 'Start with your subject.', resourcesDescription: 'Pick a subject. Choose your format.',
      historyTitle: 'Chinese history', historyDescription: 'Modern history study resources', historyFormats: 'Chinese history file formats',
      physicsTitle: 'Year 9 physics', physicsDescription: 'Key revision · 20-page edition', physicsFormats: 'Physics file formats',
      englishTitle: 'English', englishDescription: 'Chinese–English study resources', englishFormats: 'English file formats',
      allFilesDescription: 'Want to browse everything?', allFiles: 'Open the study folder', contact: 'Contact', backTop: 'Back to top',
    },
  };

  document.documentElement.classList.add('js');
  let activePreview = null;
  const storageKey = 'x-portfolio-language';
  const buttons = document.querySelectorAll('[data-lang]');

  function setLanguage(language) {
    const copy = messages[language];
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-HK';
    document.title = copy.title;
    document.querySelector('meta[name="description"]').content = copy.description;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = copy[element.dataset.i18n];
    });
    document.querySelectorAll('[data-i18n-label]').forEach(element => {
      element.setAttribute('aria-label', copy[element.dataset.i18nLabel]);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
      element.alt = copy[element.dataset.i18nAlt];
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
    document.querySelectorAll('[data-preview]').forEach(trigger => {
      const project = document.getElementById(trigger.dataset.preview);
      const name = project.querySelector('h3').textContent;
      trigger.setAttribute('aria-label', copy.previewPrefix + name);
    });
    if (activePreview) updatePreview(activePreview);
  }

  let initialLanguage = 'zh';
  try {
    const saved = localStorage.getItem(storageKey);
    if (Object.hasOwn(messages, saved)) initialLanguage = saved;
  } catch {
    // Language switching stays available if browser storage is blocked.
  }
  setLanguage(initialLanguage);

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const language = button.dataset.lang;
      setLanguage(language);
      try {
        localStorage.setItem(storageKey, language);
      } catch {
        // Keep the selection for this visit even when it cannot be stored.
      }
    });
  });

  const dialog = document.querySelector('.preview-dialog');
  const previewImage = document.getElementById('preview-image');
  let previewTrigger = null;

  function updatePreview(project) {
    const image = project.querySelector('.site-preview');
    document.getElementById('preview-title').textContent = project.querySelector('h3').textContent;
    previewImage.src = image.src;
    previewImage.alt = image.alt;
  }

  document.querySelectorAll('[data-preview]').forEach(trigger => {
    trigger.addEventListener('click', event => {
      if (typeof dialog.showModal !== 'function') {
        if (trigger.tagName === 'BUTTON') window.open(document.querySelector(`#${trigger.dataset.preview} .site-preview`).src, '_blank', 'noopener,noreferrer');
        return;
      }
      // Modified clicks on the image link retain native new-tab behaviour.
      if (trigger.tagName === 'A' && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
      event.preventDefault();
      activePreview = document.getElementById(trigger.dataset.preview);
      previewTrigger = trigger;
      updatePreview(activePreview);
      dialog.showModal();
      document.body.classList.add('preview-open');
    });
  });
  document.querySelector('.close-preview').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, a[href], [tabindex="0"]')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if ((!event.shiftKey && document.activeElement === last) || (event.shiftKey && document.activeElement === first)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('preview-open');
    activePreview = null;
    if (previewTrigger) previewTrigger.focus({ preventScroll: true });
  });

  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
