/* Homepage only: progressively enhance the fixed paper composition. */
(() => {
  const board = document.querySelector('.desk-board');
  if (!board) return;
  const mode = matchMedia('(min-width:1024px) and (hover:hover) and (pointer:fine)');
  const sheets = [...board.querySelectorAll('.project-card')];
  let order = 5, drag = null;
  function reset() {
    drag = null;
    sheets.forEach(sheet => { sheet.querySelector('.paper-handle').tabIndex = mode.matches ? 0 : -1; });
    sheets.forEach(sheet => {
      sheet.style.removeProperty('left'); sheet.style.removeProperty('top');
      sheet.style.removeProperty('z-index');
    });
  }
  function move(sheet, x, y) {
    // A conservative rotation margin keeps the complete paper inside the desk.
    const margin = 24;
    sheet.style.left = Math.max(margin, Math.min(x, board.clientWidth - sheet.offsetWidth - margin)) + 'px';
    sheet.style.top = Math.max(margin, Math.min(y, board.clientHeight - sheet.offsetHeight - margin)) + 'px';
  }
  for (const sheet of sheets) {
    const handle = sheet.querySelector('.paper-handle');
    handle.addEventListener('pointerdown', event => {
      if (!mode.matches || event.button !== 0) return;
      event.preventDefault(); handle.setPointerCapture(event.pointerId);
      sheet.style.zIndex = String(++order);
      drag = {sheet, id:event.pointerId, x:event.clientX, y:event.clientY, left:sheet.offsetLeft, top:sheet.offsetTop};
    });
    handle.addEventListener('pointermove', event => {
      if (!drag || drag.id !== event.pointerId) return;
      move(sheet, drag.left + event.clientX - drag.x, drag.top + event.clientY - drag.y);
    });
    const end = () => { drag = null; };
    handle.addEventListener('pointerup', end); handle.addEventListener('pointercancel', end);
    handle.addEventListener('lostpointercapture', end);
    handle.addEventListener('keydown', event => {
      const delta = {ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
      if (!delta || !mode.matches) return;
      event.preventDefault();
      const step=event.shiftKey?1:10;
      move(sheet, sheet.offsetLeft+delta[0]*step, sheet.offsetTop+delta[1]*step);
    });
    // Focused links always come above moved papers, without changing reading order.
    sheet.addEventListener('focusin', () => { if(mode.matches) sheet.style.zIndex=String(++order); });
  }
  document.querySelector('.desk-reset').addEventListener('click',reset);
  mode.addEventListener('change',reset); reset();
  new ResizeObserver(() => {
    if(mode.matches) for(const sheet of sheets) if(sheet.style.left) move(sheet,sheet.offsetLeft,sheet.offsetTop);
  }).observe(board);
})();
