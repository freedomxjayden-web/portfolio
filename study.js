(() => {
  const buttons=[...document.querySelectorAll('[data-subject]')];
  const sheets=[...document.querySelectorAll('[data-study-subject]')];
  for(const button of buttons) button.addEventListener('click',()=>{
    const subject=button.dataset.subject;
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    sheets.forEach(s=>{s.hidden=subject!=='all'&&s.dataset.studySubject!==subject;});
    document.querySelector('.study-empty').hidden=sheets.some(s=>!s.hidden);
  });
})();
