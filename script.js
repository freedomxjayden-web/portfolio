(() => {
  'use strict';

  const messages = {
    zh: {
      title: '作品集 — 雲端檔案庫',
      description: '探索雲端檔案庫：集中瀏覽中國近代史、初三物理及英文學習資料，直接開啟 PDF 或 Word 文件。',
      skip: '跳至主要內容', home: '作品集 — 返回頁首', navigation: '主要導覽', language: '網站語言',
      portfolio: '作品集', navWork: '作品', navResources: '資料內容', eyebrow: '網站與工具',
      workTitle: '作品，打開就能用。', collected: '作品目錄', projectCategory: '檔案與學習', projectTitle: '雲端檔案庫',
      projectLede: '溫習資料，集中一處。',
      projectDescription: '中國近代史、初三物理、英文中英對照。按科目搵資料，選 PDF 或 Word 開啟。',
      openStudy: '打開學習資料', openProject: '瀏覽完整網站', newTab: '（於新分頁開啟）', formats: 'PDF 及 Word',
      previewLabel: '先睇內容，再打開。', previewLink: '開啟雲端檔案庫學習資料（於新分頁開啟）',
      previewAlt: '雲端檔案庫實際介面，列出歷史、物理及英文嘅 PDF 和 Word 資料。', previewCaption: '網站實際畫面',
      insideProject: '呢件作品入面有咩？', resourcesTitle: '由你要睇嘅科目開始。', resourcesDescription: '揀科目，再揀你想用嘅格式。',
      historyTitle: '中國近代史', historyDescription: '學習資料', historyFormats: '中國近代史資料格式',
      physicsTitle: '初三物理', physicsDescription: '重點溫習 · 20 頁詳細版', physicsFormats: '初三物理資料格式',
      englishTitle: '英文', englishDescription: '中英對照學習資料', englishFormats: '英文資料格式',
      allFilesDescription: '想直接睇晒所有檔案？', allFiles: '前往學習資料夾', contact: '聯絡', backTop: '返回頁首',
    },
    en: {
      title: 'Portfolio — Cloud Drive',
      description: 'Explore Cloud Drive: study resources for Chinese history, Year 9 physics, and English, in PDF and Word formats.',
      skip: 'Skip to content', home: 'Portfolio — Back to top', navigation: 'Main navigation', language: 'Site language',
      portfolio: 'Portfolio', navWork: 'Work', navResources: 'Resources', eyebrow: 'Websites & tools',
      workTitle: 'Made to be used.', collected: 'Project index', projectCategory: 'Files & learning', projectTitle: 'Cloud Drive',
      projectLede: 'Study resources. One place.',
      projectDescription: 'Modern Chinese history, Year 9 physics, and bilingual English resources. Choose a subject, then open a PDF or Word file.',
      openStudy: 'Explore study resources', openProject: 'Visit the full website', newTab: ' (opens in a new tab)', formats: 'PDF & Word',
      previewLabel: 'See what’s inside.', previewLink: 'Open Cloud Drive study resources (opens in a new tab)',
      previewAlt: 'Actual Cloud Drive interface listing history, physics, and English resources in PDF and Word formats.', previewCaption: 'Actual website preview',
      insideProject: 'Inside this project', resourcesTitle: 'Start with your subject.', resourcesDescription: 'Pick a subject. Choose your format.',
      historyTitle: 'Chinese history', historyDescription: 'Modern history study resources', historyFormats: 'Chinese history file formats',
      physicsTitle: 'Year 9 physics', physicsDescription: 'Key revision · 20-page edition', physicsFormats: 'Physics file formats',
      englishTitle: 'English', englishDescription: 'Chinese–English study resources', englishFormats: 'English file formats',
      allFilesDescription: 'Want to browse everything?', allFiles: 'Open the study folder', contact: 'Contact', backTop: 'Back to top',
    },
  };

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

  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
