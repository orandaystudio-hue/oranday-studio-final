"use strict";

const menuToggle = document.querySelector('.menu-toggle');
const mainNavigation = document.querySelector('#main-navigation');
if (menuToggle && mainNavigation) {
  menuToggle.hidden = false;
  const closeMenu = () => {
    mainNavigation.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
  };
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    mainNavigation.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  mainNavigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuToggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
}

const fitContent = {
  web: { title: 'Una landing con un objetivo claro.', copy: 'Presenta lo que vendes, responde las dudas importantes y facilita que alguien te contacte desde su celular.', href: '/diseno-web-posicionamiento/' },
  sales: { title: 'Un recorrido comercial conectado.', copy: 'Registra cada consulta, asigna un responsable y deja la próxima acción lista. Tu equipo sabe a quién contactar y cuándo.', href: '/captacion-seguimiento-comercial/' },
  ai: { title: 'Un primer flujo con IA, a tu medida.', copy: 'Elegimos una tarea repetitiva, conectamos tus herramientas y probamos cómo ahorrar trabajo con revisión humana donde hace falta.', href: '/automatizacion-ia/' }
};
document.querySelectorAll('[data-fit-picker]').forEach((picker) => {
  const buttons = picker.querySelectorAll('[data-fit]');
  buttons.forEach((button) => button.addEventListener('click', () => {
    const content = fitContent[button.dataset.fit];
    if (!content) return;
    buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    picker.querySelector('[data-fit-title]').textContent = content.title;
    picker.querySelector('[data-fit-copy]').textContent = content.copy;
    picker.querySelector('[data-fit-link]').href = content.href;
    document.dispatchEvent(new CustomEvent('oranday:solution', { detail: { solution: button.dataset.fit, page: window.location.pathname } }));
  }));
});

// Optional entrance motion; content remains visible if animation is unavailable.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (motionPreference.matches || !entry.target.animate) return;
      entry.target.animate(
        [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' }
      );
    });
  }, { threshold: .12 });
  document.querySelectorAll('.home-page .section-heading, .home-page .solution-card, .home-page .process-card').forEach((element) => revealObserver.observe(element));
}

document.addEventListener("click", (event) => {
  const link = event.target instanceof Element ? event.target.closest("a[data-contact]") : null;
  if (!link) return;

  const channel = link.dataset.contact;
  if (channel !== "whatsapp" && channel !== "email") return;

  const detail = {
    event: channel === "whatsapp" ? "whatsapp_click" : "email_click",
    placement: link.dataset.placement || "link",
    page: window.location.pathname
  };
  document.dispatchEvent(new CustomEvent("oranday:contact", { detail }));
  if (Array.isArray(window.dataLayer)) window.dataLayer.push(detail);
});

// Botón flotante: aparece al bajar y se esconde cuando ya se ve el cierre de contacto.
(() => {
  if (document.querySelector('.wa-float')) return;
  const link = document.createElement('a');
  link.className = 'wa-float';
  link.href = 'https://wa.me/528132379135?text=' + encodeURIComponent('Hola, Diego. Quiero agendar la llamada gratis de 15 minutos para mi negocio.');
  link.dataset.contact = 'whatsapp';
  link.dataset.placement = 'flotante';
  link.setAttribute('aria-label', 'Agendar llamada gratis por WhatsApp');
  link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5A8.5 8.5 0 0 1 12.5 20a10 10 0 0 1-4-.9L3 21l1.9-5.5a10 10 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8z"/></svg><span>Llamada gratis</span>';
  document.body.append(link);
  const contact = document.querySelector('#contacto, .cta-panel');
  let contactVisible = false;
  const update = () => link.classList.toggle('is-on', window.scrollY > 520 && !contactVisible);
  if (contact && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { contactVisible = entries.some((e) => e.isIntersecting); update(); }).observe(contact);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
