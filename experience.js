(() => {
  'use strict';

  const scenarios = {
    servicios: {
      initials: 'MR', name: 'Mariana R.', company: 'Oficinas en Monterrey',
      service: 'Limpieza de oficinas', location: 'Monterrey, N.L.', wait: 180,
      chips: ['Limpieza de oficinas', 'Monterrey'],
      request: '¿Cotizan limpieza para oficinas en Monterrey? Dos veces por semana.',
      shortRequest: '¿Cotizan limpieza para oficinas en Monterrey?',
      reply: '¡Hola, Mariana! ¿Cuántos metros cuadrados son y qué horario les funciona?',
      next: 'Confirmar superficie · ventas',
      summary: 'Servicio, zona y frecuencia identificados.'
    },
    climas: {
      initials: 'AG', name: 'Alejandro G.', company: 'Cafetería en San Pedro',
      service: 'Instalación de climas', location: 'San Pedro, N.L.', wait: 240,
      chips: ['3 climas', 'San Pedro'],
      request: 'Abrimos una cafetería en San Pedro y necesitamos tres climas. ¿Cotizan?',
      shortRequest: 'Necesito tres climas para una cafetería en San Pedro.',
      reply: '¡Hola, Alejandro! ¿Qué superficie tiene el local? Agendamos visita técnica.',
      next: 'Confirmar visita · instalaciones',
      summary: 'Equipos, ubicación y visita pendiente registrados.'
    },
    solar: {
      initials: 'LC', name: 'Lucía C.', company: 'Taller en Apodaca',
      service: 'Proyecto solar', location: 'Apodaca, N.L.', wait: 300,
      chips: ['Paneles · taller', 'Falta: consumo'],
      request: 'Queremos paneles solares para nuestro taller en Apodaca. ¿Qué necesitan?',
      shortRequest: 'Quiero cotizar paneles solares para un taller en Apodaca.',
      reply: '¡Hola, Lucía! Empecemos por tu consumo de luz. ¿Me compartes tu recibo?',
      next: 'Revisar consumo · proyectos',
      summary: 'Proyecto y municipio registrados; falta consumo.'
    },
    refacciones: {
      initials: 'JR', name: 'Jorge R.', company: 'Planta en Apodaca',
      service: 'Baleros y bandas', location: 'Apodaca, N.L.', wait: 95,
      chips: ['4 × Balero 6205-2RS', '6 × Banda B-52'],
      request: 'Me cotizan 4 baleros 6205 2RS y 6 bandas B-52. Urge para hoy.',
      shortRequest: 'Me cotizan 4 baleros 6205 2RS y 6 bandas B-52. Urge.',
      reply: '¡Hola, Jorge! Sí tenemos las dos piezas. ¿Recoges en mostrador o te las enviamos?',
      next: 'Enviar cotización hoy · mostrador',
      summary: 'Piezas y cantidades identificadas; falta la entrega.'
    },
    clinicas: {
      initials: 'PS', name: 'Paola S.', company: 'Paciente nueva',
      service: 'Valoración dental', location: 'Monterrey, N.L.', wait: 720,
      chips: ['Ortodoncia', 'Paciente nueva'],
      request: 'Quiero informes de ortodoncia. ¿Cuánto cuesta la valoración y qué días atienden?',
      shortRequest: 'Quiero informes de ortodoncia. ¿Qué días atienden?',
      reply: '¡Hola, Paola! La valoración es el primer paso. ¿Entre semana o sábado?',
      next: 'Confirmar horario · recepción',
      summary: 'Tratamiento de interés registrado; falta el horario.'
    },
    eventos: {
      initials: 'DM', name: 'Daniela M.', company: 'Evento de empresa',
      service: 'Banquete para 80 personas', location: 'San Nicolás, N.L.', wait: 150,
      chips: ['80 personas', 'Diciembre'],
      request: 'Buscamos salón y banquete para la posada, somos 80 personas. ¿Tienen fecha en diciembre?',
      shortRequest: 'Busco salón y banquete para 80 personas en diciembre.',
      reply: '¡Hola, Daniela! Revisamos fechas. ¿Qué día tienen pensado, comida o cena?',
      next: 'Confirmar fecha y menú · eventos',
      summary: 'Tipo de evento y número de personas registrados; falta la fecha.'
    }
  };
  // La página /grabar/ usa estos mismos ejemplos para los videos.
  window.orandayScenarios = scenarios;
  const stages = [
    { headline: 'Alguien necesita lo que vendes.', description: 'Te escriben por WhatsApp o tu página. Mientras nadie contesta, el cliente sigue buscando.', engine: 'Lista para organizar', thinking: 'Consulta lista para analizar', leadStatus: 'Nueva consulta recibida', recordStatus: 'Por organizar', replyLabel: 'Borrador sugerido por IA', replyNote: 'Tu equipo revisa antes de enviar', nextTitle: 'Seguimiento preparado' },
    { headline: 'Oranday hace el trabajo repetitivo.', description: 'Lee el mensaje, saca los datos importantes y prepara la respuesta con lo que falta preguntar.', engine: 'Lee, organiza y prepara', thinking: 'Datos detectados · borrador listo', leadStatus: 'Consulta clasificada', recordStatus: 'Organizada', replyLabel: 'Borrador sugerido por IA', replyNote: 'Tu equipo revisa antes de enviar', nextTitle: 'Seguimiento preparado' },
    { headline: 'Tu equipo aprueba con un clic.', description: 'Revisa el borrador, ajusta si hace falta y lo envía. Nada sale sin que una persona lo apruebe.', engine: 'Revisión humana', thinking: 'Esperando aprobación', leadStatus: 'Respuesta aprobada', recordStatus: 'En atención', replyLabel: 'Borrador sugerido por IA', replyNote: 'Esperando tu aprobación', nextTitle: 'Seguimiento preparado' },
    { headline: 'Cada cliente tiene un siguiente paso.', description: 'Queda una tarea con responsable y fecha. Ninguna consulta se queda olvidada en un chat.', engine: 'Seguimiento conectado', thinking: 'Consulta atendida y registrada', leadStatus: 'Seguimiento registrado', recordStatus: 'Con responsable', replyLabel: 'Revisada y enviada', replyNote: 'Ejemplo simulado', nextTitle: 'Siguiente acción registrada' }
  ];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const requestedSector = new URLSearchParams(window.location.search).get('giro');

  document.querySelectorAll('[data-experience]').forEach((root) => {
    const values = [...root.querySelectorAll('[data-experience-value]')];
    const sectors = [...root.querySelectorAll('[data-experience-sector]')];
    const steps = [...root.querySelectorAll('[data-experience-step]')];
    const playButton = root.querySelector('[data-experience-play]');
    const playLabel = root.querySelector('[data-experience-play-label]');
    const status = root.querySelector('[data-experience-status]');
    let sector = Object.prototype.hasOwnProperty.call(scenarios, requestedSector) ? requestedSector : 'servicios';
    let stage = reducedMotion.matches ? 3 : 0;
    let timer = null;
    let playing = false;
    let autoStarted = false;
    let finished = reducedMotion.matches;
    let pointerInitiatedFocus = false;
    // El giro solo viaja en el mensaje cuando la persona lo eligió o llegó con ?giro=.
    let sectorChosen = sector === requestedSector;
    const whatsappLinks = [...document.querySelectorAll('a[href^="https://wa.me/"]')];

    function tagWhatsappLinks() {
      if (!sectorChosen) return;
      const label = sectors.find((button) => button.dataset.experienceSector === sector).textContent.trim();
      const text = `Hola, Diego. Vi el ejemplo de ${label} en la demo de Oranday y quiero revisar un proceso de mi negocio.`;
      whatsappLinks.forEach((link) => {
        const url = new URL(link.href);
        url.searchParams.set('text', text);
        link.href = url.toString();
      });
    }

    function emit(action) {
      root.dispatchEvent(new CustomEvent('oranday:demo', { bubbles: true, detail: { action, sector, stage: stage + 1, component: 'experience' } }));
    }

    function updatePlayLabel() {
      root.dataset.playing = String(playing);
      playLabel.textContent = playing ? 'Pausar' : finished ? 'Volver a ver' : stage ? 'Continuar' : 'Ver recorrido';
      playButton.setAttribute('aria-label', `${playLabel.textContent} demostración`);
    }

    // En el paso 1 el contador corre de 1 a los minutos del ejemplo, como un chat que nadie contesta.
    let waitFrame = 0;
    function runWaitCounter(target) {
      window.cancelAnimationFrame(waitFrame);
      const labels = values.filter((element) => element.dataset.experienceValue === 'waitLabel');
      root.dataset.waiting = String(stage === 0);
      if (stage !== 0 || !playing || reducedMotion.matches) return;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / 3000);
        const minutes = Math.max(1, Math.round(target * t * t));
        labels.forEach((element) => { element.textContent = `Sin responder · ${minutes} min`; });
        if (t < 1 && stage === 0 && playing) waitFrame = window.requestAnimationFrame(tick);
      };
      waitFrame = window.requestAnimationFrame(tick);
    }

    function render(action) {
      const scenario = scenarios[sector];
      const content = { ...scenario, ...stages[stage], stepNumber: String(stage + 1).padStart(2, '0'),
        chip1: scenario.chips[0], chip2: scenario.chips[1],
        waitLabel: stage === 0 ? `Sin responder · ${scenario.wait} min` : 'Atendida al momento' };
      values.forEach((element) => { element.textContent = content[element.dataset.experienceValue] || ''; });
      runWaitCounter(scenario.wait);
      root.dataset.stage = String(stage);
      sectors.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.experienceSector === sector)));
      steps.forEach((button, index) => {
        button.setAttribute('aria-pressed', String(index === stage));
        button.dataset.complete = String(index < stage);
      });
      updatePlayLabel();
      if (action) {
        status.textContent = `${sectors.find((button) => button.dataset.experienceSector === sector).textContent}. Paso ${stage + 1} de 4. ${content.headline} ${content.description}`;
        emit(action);
      }
    }

    function pause() {
      window.clearTimeout(timer);
      timer = null;
      playing = false;
      updatePlayLabel();
    }

    function schedule() {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (stage === 3) {
          finished = true;
          pause();
          return;
        }
        stage += 1;
        render();
        schedule();
      }, 3800);
    }

    function play(userInitiated) {
      if (finished) { stage = 0; finished = false; }
      playing = true;
      render(userInitiated ? 'play' : undefined);
      schedule();
    }

    sectors.forEach((button) => button.addEventListener('click', () => {
      pause();
      autoStarted = true;
      sector = button.dataset.experienceSector;
      sectorChosen = true;
      tagWhatsappLinks();
      stage = 0;
      finished = false;
      render('scenario');
    }));

    steps.forEach((button) => button.addEventListener('click', () => {
      pause();
      autoStarted = true;
      stage = Number(button.dataset.experienceStep);
      finished = stage === 3;
      render('stage');
    }));

    playButton.addEventListener('click', () => {
      autoStarted = true;
      if (playing) { pause(); emit('pause'); status.textContent = 'Demostración en pausa.'; }
      else play(true);
    });

    // Reading controls with the keyboard must not compete with the timeline.
    // A pointer click may also focus Play, so only keyboard-visible focus pauses.
    document.addEventListener('pointerdown', () => { pointerInitiatedFocus = true; }, { passive: true });
    document.addEventListener('keydown', () => { pointerInitiatedFocus = false; });
    root.addEventListener('focusin', (event) => {
      if (pointerInitiatedFocus || !(event.target instanceof Element) || !event.target.matches(':focus-visible')) return;
      autoStarted = true;
      if (playing) {
        pause();
        emit('pause');
        status.textContent = 'Demostración en pausa.';
      }
    });

    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) pause(); });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < .3) { pause(); return; }
          if (!autoStarted && !reducedMotion.matches && !document.hidden) {
            autoStarted = true;
            play(false);
          }
        });
      }, { threshold: .3 });
      observer.observe(root);
    }
    render();
    tagWhatsappLinks();
    root.dataset.ready = 'true';
    root.querySelectorAll('[data-experience-controls]').forEach((element) => { element.hidden = false; });
  });
})();
