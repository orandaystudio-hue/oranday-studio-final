(() => {
  'use strict';
  // Decorative enhancement: content and links never depend on pointer input.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.solution-bento .solution-card').forEach((card) => {
    let frame = 0;
    let pendingPoint = null;
    function clear() {
      cancelAnimationFrame(frame);
      frame = 0;
      pendingPoint = null;
      card.removeAttribute('data-pointer-active');
      card.style.removeProperty('--spot-x');
      card.style.removeProperty('--spot-y');
    }
    card.addEventListener('pointermove', (event) => {
      if (!finePointer.matches || reduced.matches || event.pointerType === 'touch') return;
      pendingPoint = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!pendingPoint) return;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${pendingPoint.x - bounds.left}px`);
        card.style.setProperty('--spot-y', `${pendingPoint.y - bounds.top}px`);
        card.dataset.pointerActive = 'true';
      });
    }, { passive:true });
    card.addEventListener('pointerleave', clear);
    reduced.addEventListener('change', clear);
    finePointer.addEventListener('change', clear);
    document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
  });
})();
