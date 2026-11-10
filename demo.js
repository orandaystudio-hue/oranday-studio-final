(() => {
  const steps = [
    { name: 'Consulta', nextLabel: 'Ir a la visita' },
    { name: 'Visita', nextLabel: 'Ver la cotización' },
    { name: 'Cotización', nextLabel: 'Ver el seguimiento' },
    { name: 'Seguimiento', nextLabel: 'Volver a la consulta' },
  ];

  const scenarios = {
    climas: {
      name: 'Climatización',
      lead: 'Café Niebla',
      code: 'CL-024',
      source: 'Web → WhatsApp',
      stages: [
        {
          customerRole: 'Prospecto',
          customer: 'Hola. Queremos instalar tres equipos en una cafetería en San Pedro. ¿Nos pueden cotizar?',
          teamRole: 'Equipo comercial',
          team: '¡Claro! ¿Qué superficie quieren climatizar y cuándo les gustaría instalar los equipos?',
          status: 'Consulta recibida',
          owner: 'Atención comercial',
          next: 'Confirmar superficie y fecha tentativa.',
        },
        {
          customerRole: 'Prospecto',
          customer: 'Son 90 m² entre barra y comedor. Podemos recibir al técnico el jueves por la mañana.',
          teamRole: 'Equipo técnico',
          team: 'Agendamos el jueves a las 10:00. Revisaremos la carga térmica y dónde pueden quedar las unidades.',
          status: 'Visita agendada',
          owner: 'Coordinación técnica',
          next: 'Registrar medidas y requerimientos tras la visita.',
        },
        {
          customerRole: 'Prospecto',
          customer: '¿La propuesta incluye instalación y cuánto tiempo tendrían que cerrar el comedor?',
          teamRole: 'Equipo comercial',
          team: 'Te mandamos el desglose de equipos, instalación y tiempos por zona para que lo revises con tu equipo.',
          status: 'Cotización enviada',
          owner: 'Asesor comercial',
          next: 'Confirmar recepción y anotar fecha de decisión.',
        },
        {
          customerRole: 'Prospecto',
          customer: 'Estamos revisando el presupuesto. El viernes podemos confirmar si arrancamos.',
          teamRole: 'Equipo comercial',
          team: 'Perfecto. El viernes te escribo para resolver dudas y, si avanzamos, acordar la fecha de instalación.',
          status: 'Seguimiento agendado',
          owner: 'Asesor comercial',
          next: 'Retomar la propuesta el viernes.',
        },
      ],
    },
    solar: {
      name: 'Paneles solares',
      lead: 'Taller Horizonte',
      code: 'SL-031',
      source: 'Google → Web → WhatsApp',
      stages: [
        {
          customerRole: 'Prospecto',
          customer: 'Queremos evaluar paneles solares para un taller en Apodaca. ¿Qué necesitan para cotizar?',
          teamRole: 'Equipo comercial',
          team: 'Empecemos con el tipo de inmueble y el consumo del último periodo. Después podemos revisar el techo.',
          status: 'Consulta recibida',
          owner: 'Atención comercial',
          next: 'Confirmar municipio, inmueble y consumo.',
        },
        {
          customerRole: 'Prospecto',
          customer: 'El techo es de lámina y tenemos acceso desde el patio. El martes puede recibirlos el encargado.',
          teamRole: 'Equipo técnico',
          team: 'Agendamos para el martes. Vamos a revisar el área disponible, las sombras y la instalación eléctrica.',
          status: 'Visita agendada',
          owner: 'Ingeniería de proyectos',
          next: 'Registrar superficie útil y condiciones del sitio.',
        },
        {
          customerRole: 'Prospecto',
          customer: '¿La propuesta separa el equipo, la instalación y los pasos posteriores?',
          teamRole: 'Equipo comercial',
          team: 'Sí. Incluimos el alcance de cada parte, el dimensionamiento y los supuestos de la estimación.',
          status: 'Cotización enviada',
          owner: 'Asesor de proyectos',
          next: 'Confirmar quién revisa la propuesta y cuándo.',
        },
        {
          customerRole: 'Prospecto',
          customer: 'Lo vemos con administración el miércoles. Nos interesa entender el cálculo de consumo.',
          teamRole: 'Equipo comercial',
          team: 'El jueves te busco para revisar los supuestos con ustedes y decidir si hace falta ajustar el alcance.',
          status: 'Seguimiento agendado',
          owner: 'Asesor de proyectos',
          next: 'Retomar la propuesta el jueves con administración.',
        },
      ],
    },
  };

  const requestedSector = new URLSearchParams(window.location.search).get('giro');

  document.querySelectorAll('[data-demo]').forEach((demo) => {
    const sectorButtons = Array.from(demo.querySelectorAll('[data-demo-sector]'));
    const stepButtons = Array.from(demo.querySelectorAll('[data-demo-step]'));
    const values = new Map(Array.from(
      demo.querySelectorAll('[data-demo-value]'),
      (element) => [element.dataset.demoValue, element],
    ));
    const announcement = demo.querySelector('[data-demo-status]');
    const nextButton = demo.querySelector('[data-demo-next]');
    let sector = requestedSector === 'solar' ? 'solar' : 'climas';
    let step = 0;

    function render(action) {
      const scenario = scenarios[sector];
      const { name, nextLabel } = steps[step];
      const { lead, code, source } = scenario;
      const content = { lead, code, source, nextLabel, ...scenario.stages[step] };

      for (const [key, value] of Object.entries(content)) {
        values.get(key).textContent = value;
      }
      sectorButtons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.demoSector === sector));
      });
      stepButtons.forEach((button, index) => {
        button.setAttribute('aria-pressed', String(index === step));
      });

      if (action) {
        announcement.textContent = `${scenario.name}. ${name}. ${content.status}. Siguiente acción. ${content.next}`;
        demo.dispatchEvent(new CustomEvent('oranday:demo', {
          bubbles: true,
          detail: { action, sector, stage: step + 1 },
        }));
      }
    }

    sectorButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const selectedSector = button.dataset.demoSector;
        if (sector === selectedSector) return;
        sector = selectedSector;
        step = 0;
        render('scenario');
      });
    });
    stepButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        if (step === index) return;
        step = index;
        render('stage');
      });
    });
    nextButton.addEventListener('click', () => {
      step = (step + 1) % steps.length;
      render('stage');
    });

    render();
    demo.querySelectorAll('[data-demo-controls]').forEach((control) => {
      control.hidden = false;
    });
  });
})();
