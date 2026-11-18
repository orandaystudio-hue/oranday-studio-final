/* Formulario de leads: envía a la plataforma y muestra el agradecimiento. Sin librerías. */
(function () {
  var ENDPOINT = 'https://panel.orandaystudio.com/api/public/leads';
  var WORKSPACE = '78ed7507-9a1d-49c9-a9fc-2ff4e41cc98a';
  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    var err = form.querySelector('.lead-error');
    var btn = form.querySelector('button[type=submit]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.textContent = '';
      var f = form.elements;
      var digits = String(f.phone.value).replace(/\D/g, '');
      if (!f.name.value.trim()) return (err.textContent = 'Escribe tu nombre.');
      if (digits.length < 10) return (err.textContent = 'Escribe tu WhatsApp a 10 dígitos.');
      if (!f.business_type.value.trim()) return (err.textContent = 'Escribe el nombre o tipo de tu negocio.');
      if (!f.need.value.trim()) return (err.textContent = 'Cuéntanos qué te gustaría resolver.');
      if (!f.consent.checked) return (err.textContent = 'Necesitamos tu autorización para contactarte.');
      var payload = {
        workspace_id: WORKSPACE,
        name: f.name.value.trim().slice(0, 80),
        phone: f.phone.value.trim(),
        email: f.email && f.email.value.trim() ? f.email.value.trim() : undefined,
        business_type: f.business_type.value.trim().slice(0, 120),
        need: f.need.value.trim().slice(0, 500),
        niche: form.getAttribute('data-niche'),
        consent: true,
        source_page: location.pathname,
        website: f.website.value
      };
      btn.disabled = true;
      btn.textContent = 'Enviando…';
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) {
            if (r.ok && j.ok) return done();
            if (r.status === 429) throw new Error('Recibimos varios envíos desde tu conexión. Escríbenos por WhatsApp.');
            throw new Error('Revisa tus datos e inténtalo de nuevo, o escríbenos por WhatsApp.');
          });
        })
        .catch(function (x) {
          err.textContent = x && x.message && x.message.indexOf('WhatsApp') > -1 ? x.message : 'No pudimos enviar. Escríbenos directo por WhatsApp.';
          btn.disabled = false;
          btn.textContent = btn.getAttribute('data-label');
        });
    });
    function done() {
      form.hidden = true;
      var box = form.parentNode.querySelector('.lead-thanks');
      if (box) { box.hidden = false; box.setAttribute('tabindex', '-1'); box.focus(); }
      document.querySelectorAll('[data-after-lead]').forEach(function (el) { el.hidden = false; });
    }
  });
})();
