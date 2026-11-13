(() => {
  'use strict';

  const scenarios = {
    servicios: {
      initials: 'MR', name: 'Mariana R.', company: 'Oficinas en Monterrey',
      service: 'Limpieza de oficinas', location: 'Monterrey, N.L.',
      request: 'Hola. Busco limpieza para nuestras oficinas dos veces por semana. ¿Me pueden cotizar?',
      shortRequest: 'Hola. ¿Cotizan limpieza para oficinas en Monterrey?',
      reply: '¡Hola, Mariana! ¿Cuántos metros cuadrados necesitan cubrir y qué horario les funciona?',
      next: 'Confirmar superficie y horario. Responsable: ventas.',
      summary: 'Servicio, zona y frecuencia identificados.'
    },
    climas: {
      initials: 'AG', name: 'Alejandro G.', company: 'Cafetería en San Pedro',
      service: 'Instalación de climas', location: 'San Pedro, N.L.',
      request: 'Hola. Abrimos una cafetería en San Pedro y necesitamos tres climas. ¿Pueden cotizar?',
      shortRequest: 'Necesito tres climas para una cafetería en San Pedro.',
      reply: '¡Hola, Alejandro! ¿Qué superficie tiene el local y cuándo podemos coordinar una visita técnica?',
      next: 'Confirmar visita técnica. Responsable: instalaciones.',
      summary: 'Equipos, ubicación y visita pendiente registrados.'
    },
    solar: {
      initials: 'LC', name: 'Lucía C.', company: 'Taller en Apodaca',
      service: 'Proyecto solar', location: 'Apodaca, N.L.',
      request: 'Queremos paneles solares para nuestro taller en Apodaca. ¿Qué necesitan para una propuesta?',
      shortRequest: 'Quiero cotizar paneles solares para un taller en Apodaca.',
      reply: '¡Hola, Lucía! Podemos empezar por el consumo de energía y el tipo de inmueble. ¿Los revisamos contigo?',
      next: 'Revisar consumo y techo. Responsable: proyectos.',
      summary: 'Proyecto y municipio registrados; falta consumo.'
    },
    refacciones: {
      initials: 'JR', name: 'Jorge R.', company: 'Planta en Apodaca',
      service: 'Baleros y bandas', location: 'Apodaca, N.L.',
      request: 'Buen día. Me cotizan 4 baleros 6205 2RS y 6 bandas B-52. Urge para hoy.',
      shortRequest: 'Me cotizan 4 baleros 6205 2RS y 6 bandas B-52. Urge.',
      reply: '¡Hola, Jorge! Tenemos las dos piezas en existencia. ¿Te las cotizo para recoger en mostrador o con envío a planta?',
      next: 'Enviar cotización hoy. Responsable: mostrador.',
      summary: 'Piezas y cantidades identificadas; falta la entrega.'
    },
    clinicas: {
      initials: 'PS', name: 'Paola S.', company: 'Paciente nueva',
      service: 'Valoración dental', location: 'Monterrey, N.L.',
      request: 'Hola. Quiero informes de ortodoncia. ¿Cuánto cuesta la valoración y qué días atienden?',
      shortRequest: 'Quiero informes de ortodoncia. ¿Qué días atienden?',
      reply: '¡Hola, Paola! La valoración es el primer paso. ¿Te queda mejor entre semana por la tarde o el sábado por la mañana?',
      next: 'Confirmar horario de valoración. Responsable: recepción.',
      summary: 'Tratamiento de interés registrado; falta el horario.'
    },
    eventos: {
      initials: 'DM', name: 'Daniela M.', company: 'Evento de empresa',
      service: 'Banquete para 80 personas', location: 'San Nicolás, N.L.',
      request: 'Hola. Buscamos salón y banquete para la posada de la empresa, somos 80 personas. ¿Tienen fecha en diciembre?',
      shortRequest: 'Busco salón y banquete para 80 personas en diciembre.',
      reply: '¡Hola, Daniela! Con gusto revisamos fechas. ¿Qué día tienen pensado y prefieren comida o cena?',
      next: 'Confirmar fecha y menú. Responsable: eventos.',
      summary: 'Tipo de evento y número de personas registrados; falta la fecha.'
    }
  };
  // La página /grabar/ usa estos mismos ejemplos para los videos.
  window.orandayScenarios = scenarios;
  const stages = [
    { headline: 'Alguien necesita lo que vendes.', description: 'La consulta entra por tu web o WhatsApp. El recorrido empieza aquí.', engine: 'Lista para organizar', thinking: 'Consulta lista para analizar', leadStatus: 'Nueva consulta recibida', recordStatus: 'Por organizar', replyLabel: 'Borrador sugerido por IA', replyNote: 'Tu equipo revisa antes de enviar', nextTitle: 'Seguimiento preparado' },
    { headline: 'La IA hace el trabajo repetitivo.', description: 'Identifica el servicio, organiza los datos y prepara una respuesta con las preguntas que faltan.', engine: 'Clasifica y prepara', thinking: 'Datos organizados · borrador listo', leadStatus: 'Consulta clasificada', recordStatus: 'Organizada', replyLabel: 'Borrador sugerido por IA', replyNote: 'Tu equipo revisa antes de enviar', nextTitle: 'Seguimiento preparado' },
    { headline: 'Tu equipo tiene el control.', description: 'Revisa el contexto, ajusta lo necesario y aprueba la respuesta. Las decisiones comerciales siguen en tus manos.', engine: 'Revisión humana', thinking: 'Revisión del equipo completada', leadStatus: 'Respuesta revisada', recordStatus: 'En atención', replyLabel: 'Revisada por tu equipo', replyNote: 'Respuesta aprobada · ejemplo simulado', nextTitle: 'Seguimiento preparado' },
    { headline: 'Cada oportunidad tiene un siguiente paso.', description: 'Queda una tarea con responsable para continuar la conversación y preparar la cotización.', engine: 'Seguimiento conectado', thinking: 'Consulta atendida y registrada', leadStatus: 'Seguimiento registrado', recordStatus: 'Con responsable', replyLabel: 'Revisada por tu equipo', replyNote: 'Respuesta aprobada · ejemplo simulado', nextTitle: 'Siguiente acción registrada' }
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

    function render(action) {
      const content = { ...scenarios[sector], ...stages[stage], stepNumber: String(stage + 1).padStart(2, '0') };
      values.forEach((element) => { element.textContent = content[element.dataset.experienceValue] || ''; });
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
