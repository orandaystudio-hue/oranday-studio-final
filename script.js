/* =========================================================
   Oranday Studio — interacciones mínimas, editoriales
   ========================================================= */

(() => {
  'use strict';

  /* --- 1. Año dinámico en footer --- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* --- 2. Header con estado al hacer scroll --- */
  const header = document.querySelector('[data-header]');
  if (header) {
    const onScroll = () => {
      header.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- 3. Menú móvil --- */
  const toggle = document.querySelector('[data-nav-toggle]');
  const mobile = document.querySelector('[data-nav-mobile]');
  if (toggle && mobile) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      mobile.dataset.open = String(open);
      mobile.hidden = !open;
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!isOpen);
    });
    mobile.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setOpen(false));
    });
  }

  /* --- 4. Reveal on scroll (IntersectionObserver) --- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Pequeño escalonado para grupos contiguos
            const delay = Math.min(i * 60, 240);
            setTimeout(() => entry.target.classList.add('is-visible'), delay);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* --- 5. Lead Magnet — submit a Brevo sin redirigir --- */
  const leadForm = document.getElementById('sib-form');
  if (leadForm) {
    const submitBtn = leadForm.querySelector('.lead-magnet__submit');
    const okMsg = leadForm.querySelector('.lead-magnet__msg--ok');
    const errMsg = leadForm.querySelector('.lead-magnet__msg--err');
    const emailInput = leadForm.querySelector('input[name="EMAIL"]');
    const honeypot = leadForm.querySelector('input[name="email_address_check"]');
    const btnDefault = submitBtn ? submitBtn.textContent.trim() : 'Quiero el PDF';

    const showMsg = (which) => {
      okMsg && (okMsg.hidden = which !== 'ok');
      errMsg && (errMsg.hidden = which !== 'err');
    };
    const setBtn = (text, disabled) => {
      if (!submitBtn) return;
      submitBtn.textContent = text;
      submitBtn.disabled = !!disabled;
    };

    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      showMsg(null);

      // Honeypot anti-spam: si el campo oculto trae valor, lo descartamos en silencio.
      if (honeypot && honeypot.value) {
        showMsg('ok'); // engaño al bot
        return;
      }
      // Validación de email
      const email = (emailInput?.value || '').trim();
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!validEmail) {
        emailInput?.focus();
        showMsg('err');
        return;
      }

      setBtn('Enviando…', true);

      try {
        // Brevo (Sendinblue) acepta el submit por FormData en POST.
        // Usamos no-cors porque el endpoint no manda CORS headers públicos,
        // pero igual procesa la suscripción. El status no es leíble,
        // así que asumimos éxito si no hay error de red.
        const formData = new FormData(leadForm);
        await fetch(leadForm.action, {
          method: 'POST',
          mode: 'no-cors',
          body: formData,
          credentials: 'omit',
        });
        leadForm.reset();
        showMsg('ok');
        setBtn('Enviado ✓', true);

        // Analítica opcional (no rompe si no existe gtag/plausible)
        try { window.dataLayer && window.dataLayer.push({ event: 'lead_magnet_submit' }); } catch (_) {}
      } catch (err) {
        showMsg('err');
        setBtn(btnDefault, false);
      }
    });
  }

  /* --- 6. Anchors: scroll suave con offset de header sticky --- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
