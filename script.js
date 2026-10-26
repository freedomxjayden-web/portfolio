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
  const menuButton = document.querySelector('.menu-button');
  const mobile = window.matchMedia('(max-width: 699px)');
  let activePreview = null;
  let previewTrigger = null;

  function updatePreview(project) {
    const image = project.querySelector('.site-preview');
    document.getElementById('preview-title').textContent = project.querySelector('[data-project-title]').textContent;
    previewImage.src = image.src;
    previewImage.alt = image.alt;
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

  function closeMenu(restoreFocus = false) {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus && mobile.matches) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
    if (open) navigation.querySelector('a').focus();
  });
  navigation.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobile.matches) closeMenu(true);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if (!mobile.matches) return;
    closeMenu();
    const url = new URL(link.href);
    if (url.pathname === location.pathname && url.hash) {
      const target = document.getElementById(url.hash.slice(1));
      if (target) { target.setAttribute('tabindex', '-1'); target.focus({preventScroll: true}); }
    }
  }));
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header') && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu(navigation.contains(document.activeElement));
    }
  });
  mobile.addEventListener('change', () => {
    const focusInNav = navigation.contains(document.activeElement);
    closeMenu(focusInNav && mobile.matches);
  });
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
  document.querySelector('.close-preview').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, a[href], [tabindex="0"]')];
    const first = controls[0], last = controls[controls.length - 1];
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
