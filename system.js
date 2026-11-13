// Sistema de ejemplo: pestañas, cifras que suben, gráfica, actividad en vivo y asistente.
// Todo es ficticio y se dice en la página. Sin red, sin almacenamiento.
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('[data-system]').forEach((root) => {
    const tabs = [...root.querySelectorAll('[data-system-tab]')];
    const panels = [...root.querySelectorAll('[data-system-panel]')];
    const feed = root.querySelector('[data-system-feed]');
    const chat = root.querySelector('[data-system-chat]');
    let current = 0;
    let inView = false;
    let userTook = false;
    let rotateTimer = 0;
    let feedTimer = 0;
    let typingTimer = 0;

    // Cifras que cuentan desde cero cuando el panel aparece.
    function countUp(panel) {
      panel.querySelectorAll('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const format = (n) => prefix + Math.round(n).toLocaleString('es-MX') + suffix;
        if (reduced.matches) { el.textContent = format(target); return; }
        const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / 900);
          el.textContent = format(target * (1 - Math.pow(1 - t, 3)));
          if (t < 1 && panel.classList.contains('is-active')) requestAnimationFrame(step);
          else el.textContent = format(target);
        };
        requestAnimationFrame(step);
      });
    }

    // Actividad en vivo: entra un evento nuevo arriba y sale el más viejo.
    const events = [
      ['Nueva consulta', 'Alejandro G. · 3 climas · WhatsApp'],
      ['Borrador listo', 'Cotización COT-1043 espera revisión'],
      ['Cotización enviada', 'Distribuidora del Norte · $12,480'],
      ['Seguimiento', 'Retomar con Paola S. mañana 10:00'],
      ['Pago registrado', 'Taller Apodaca · $8,900'],
      ['Nueva consulta', 'Daniela M. · evento 80 personas · Web'],
      ['Cita agendada', 'Valoración · jueves 5:30 p. m.'],
      ['Borrador listo', 'Respuesta a Mariana R. con 2 horarios'],
    ];
    let eventIndex = 5;
    function pushEvent() {
      if (!feed) return;
      const [title, detail] = events[eventIndex % events.length];
      eventIndex += 1;
      const li = document.createElement('li');
      li.className = 'system-feed-item is-new';
      li.innerHTML = '<i aria-hidden="true"></i><div><strong></strong><span></span></div><time>ahora</time>';
      li.querySelector('strong').textContent = title;
      li.querySelector('span').textContent = detail;
      feed.prepend(li);
      feed.querySelectorAll('time').forEach((t, i) => { if (i > 0) t.textContent = `hace ${i * 2} min`; });
      while (feed.children.length > 4) feed.lastElementChild.remove();
      requestAnimationFrame(() => li.classList.remove('is-new'));
    }

    // Asistente: la pregunta aparece y la respuesta se escribe sola.
    function playChat() {
      if (!chat) return;
      const answer = chat.querySelector('[data-system-answer]');
      const full = answer.dataset.text;
      const list = chat.querySelector('[data-system-answer-list]');
      window.clearTimeout(typingTimer);
      if (reduced.matches) { answer.textContent = full; list.hidden = false; return; }
      answer.textContent = '';
      list.hidden = true;
      let i = 0;
      const type = () => {
        i += 2;
        answer.textContent = full.slice(0, i);
        if (i < full.length) typingTimer = window.setTimeout(type, 22);
        else list.hidden = false;
      };
      typingTimer = window.setTimeout(type, 500);
    }

    function show(index, fromUser) {
      current = index;
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
      });
      panels.forEach((panel, i) => {
        const on = i === index;
        panel.hidden = !on;
        panel.classList.toggle('is-active', on);
        if (on) {
          panel.classList.remove('is-entering');
          void panel.offsetWidth; // reinicia las animaciones de entrada
          panel.classList.add('is-entering');
          countUp(panel);
          if (panel.dataset.systemPanel === 'asistente') playChat();
        }
      });
      if (fromUser) {
        userTook = true;
        window.clearTimeout(rotateTimer);
        root.dispatchEvent(new CustomEvent('oranday:system', { bubbles: true, detail: { module: panels[index].dataset.systemPanel } }));
      }
      schedule();
    }

    function schedule() {
      window.clearTimeout(rotateTimer);
      window.clearInterval(feedTimer);
      if (!inView || document.hidden || reduced.matches) return;
      if (panels[current].dataset.systemPanel === 'inicio') feedTimer = window.setInterval(pushEvent, 2600);
      if (!userTook) rotateTimer = window.setTimeout(() => show((current + 1) % tabs.length, false), 7000);
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => show(i, true));
      tab.addEventListener('keydown', (event) => {
        const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        if (!(event.key in keys)) return;
        event.preventDefault();
        const next = (i + keys[event.key] + tabs.length) % tabs.length;
        show(next, true);
        tabs[next].focus();
      });
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        const was = inView;
        inView = entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.35);
        if (inView && !was) show(current, false);
        else schedule();
      }, { threshold: [0, 0.35] }).observe(root);
    } else {
      inView = true;
    }
    document.addEventListener('visibilitychange', schedule);
    root.dataset.ready = 'true';
    show(0, false);
  });
})();
