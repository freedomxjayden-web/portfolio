(() => {
  'use strict';
  const content = window.portfolioContent;
  if (!content) return;
  const pageId = document.body.dataset.page;
  const pageCopy = content.pages[pageId];
  if (!pageCopy) return;
  const storageKey = 'x-portfolio-language';
  const languageButtons = document.querySelectorAll('[data-lang]');
  const dialog = document.querySelector('.preview-dialog');
  const previewImage = document.getElementById('preview-image');
  const navigation = document.getElementById('primary-nav');
  const navigationPanel = document.getElementById('navigation-panel');
  const menuButton = document.querySelector('.menu-button');
  let activePreview = null;
  let previewTrigger = null;

  function updatePreview(project) {
    const image = project.querySelector('.site-preview');
    document.getElementById('preview-title').textContent = project.querySelector('[data-project-title]').textContent;
    previewImage.src = image.src;
    previewImage.alt = image.alt;
    previewImage.width = Number(image.getAttribute('width'));
    previewImage.height = Number(image.getAttribute('height'));
    const directLink = project.querySelector('.primary-button');
    const previewLink = dialog.querySelector('.preview-open-project');
    previewLink.href = directLink.href;
  }

  function setLanguage(language) {
    const copy = { ...content.common[language], ...pageCopy[language] };
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-HK';
    document.title = copy.pageTitle;
    document.querySelector('meta[name="description"]').content = copy.pageDescription;
    document.querySelector('meta[property="og:title"]').content = copy.pageTitle;
    document.querySelector('meta[property="og:description"]').content = copy.pageDescription;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const value = copy[element.dataset.i18n];
      if (typeof value === 'string') element.textContent = value;
    });
    document.querySelectorAll('[data-i18n-label]').forEach(element => {
      element.setAttribute('aria-label', copy[element.dataset.i18nLabel]);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
      element.alt = copy[element.dataset.i18nAlt];
    });
    languageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
    document.querySelectorAll('[data-preview]').forEach(trigger => {
      const project = document.getElementById(trigger.dataset.preview);
      trigger.setAttribute('aria-label', copy.previewPrefix + project.querySelector('[data-project-title]').textContent);
    });
    if (activePreview) updatePreview(activePreview);
  }

  let initialLanguage = 'zh';
  try {
    const saved = localStorage.getItem(storageKey);
    if (Object.hasOwn(content.common, saved)) initialLanguage = saved;
  } catch {
    // A blocked store must not prevent reading or switching languages.
  }
  setLanguage(initialLanguage);
  languageButtons.forEach(button => button.addEventListener('click', () => {
    setLanguage(button.dataset.lang);
    try { localStorage.setItem(storageKey, button.dataset.lang); } catch { /* Keep this visit usable. */ }
  }));

  function closeMenu() {
    if (navigationPanel.open) navigationPanel.close();
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('navigation-open');
  }
  menuButton.addEventListener('click', () => {
    navigationPanel.showModal();
    menuButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('navigation-open');
    navigationPanel.querySelector('.close-navigation').focus();
  });
  navigationPanel.querySelector('.close-navigation').addEventListener('click', closeMenu);
  navigationPanel.addEventListener('cancel', event => {
    event.preventDefault();
    closeMenu();
  });
  navigationPanel.addEventListener('close', () => {
    if (navigationPanel.open) return;
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('navigation-open');
    if (document.activeElement === document.body || navigationPanel.contains(document.activeElement)) menuButton.focus({preventScroll: true});
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    closeMenu();
    const url = new URL(link.href);
    if (url.pathname === location.pathname && url.hash) {
      const target = document.getElementById(url.hash.slice(1));
      if (target) { target.setAttribute('tabindex', '-1'); target.focus({preventScroll: true}); }
    }
  }));
  window.addEventListener('pageshow', () => {
    closeMenu();
    try {
      const saved = localStorage.getItem(storageKey);
      if (Object.hasOwn(content.common, saved)) setLanguage(saved);
    } catch { /* In-memory selection remains usable. */ }
  });

  document.querySelectorAll('[data-preview]').forEach(trigger => trigger.addEventListener('click', event => {
    const project = document.getElementById(trigger.dataset.preview);
    if (typeof dialog.showModal !== 'function') {
      if (trigger.tagName === 'BUTTON') window.open(project.querySelector('.site-preview').src, '_blank', 'noopener,noreferrer');
      return;
    }
    if (trigger.tagName === 'A' && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    event.preventDefault();
    closeMenu();
    activePreview = project;
    previewTrigger = trigger;
    updatePreview(project);
    dialog.showModal();
    document.body.classList.add('preview-open');
  }));
  function revealAnchor() {
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if (!target) return;
    const disclosure = target.closest('details');
    if (disclosure) disclosure.open = true;
  }
  revealAnchor();
  window.addEventListener('hashchange', revealAnchor);
  document.querySelector('.close-preview').addEventListener('click', () => dialog.close());
  function trapDialogFocus(panel, event) {
    if (event.key !== 'Tab') return;
    const controls = [...panel.querySelectorAll('button, a[href], [tabindex="0"]')];
    const first = controls[0], last = controls[controls.length - 1];
    if ((!event.shiftKey && document.activeElement === last) || (event.shiftKey && document.activeElement === first)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  }
  [dialog, navigationPanel].forEach(panel => {
    panel.addEventListener('keydown', event => trapDialogFocus(panel, event));
    panel.addEventListener('click', event => {
      const bounds = panel.getBoundingClientRect();
      if (event.target === panel && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) panel.close();
    });
  });
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    document.body.classList.remove('preview-open');
    activePreview = null;
    if (document.activeElement === document.body || dialog.contains(document.activeElement)) {
      previewTrigger?.focus({preventScroll: true});
    }
  });
  document.getElementById('year').textContent = String(new Date().getFullYear());
  // Enable enhanced controls only after the handlers and translations are ready.
  document.documentElement.classList.add('js');
})();
