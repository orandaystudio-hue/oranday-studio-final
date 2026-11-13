/*
 * Animated Beam geometry adapted from Magic UI (MIT).
 * https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/animated-beam.tsx
 * See THIRD_PARTY_NOTICES.md. The renderer below uses native SVG and browser observers.
 */
(() => {
  'use strict';
  const svgNS = 'http://www.w3.org/2000/svg';
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileLayout = window.matchMedia('(max-width: 700px)');

  function svgElement(name, attributes) {
    const element = document.createElementNS(svgNS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  document.querySelectorAll('[data-experience]').forEach((root) => {
    const scene = root.querySelector('.experience-scene');
    const lead = root.querySelector('.experience-lead');
    const core = root.querySelector('.experience-core');
    const phone = root.querySelector('.experience-phone');
    const conversation = root.querySelector('.experience-conversation');
    const record = root.querySelector('.experience-record');
    if (!scene || !lead || !core || !phone || !conversation || !record || scene.querySelector('.experience-beams')) return;

    const svg = svgElement('svg', {
      class: 'experience-beams', 'aria-hidden': 'true', focusable: 'false',
      fill: 'none', preserveAspectRatio: 'none'
    });
    const connections = ['intake', 'response', 'followup'].map((name) => {
      const group = svgElement('g', { class: `experience-beam experience-beam-${name}` });
      const track = svgElement('path', { class: 'experience-beam-track', 'vector-effect': 'non-scaling-stroke' });
      const glow = svgElement('path', { class: 'experience-beam-glow', pathLength: '1000', 'vector-effect': 'non-scaling-stroke' });
      const pulse = svgElement('path', { class: 'experience-beam-pulse', pathLength: '1000', 'vector-effect': 'non-scaling-stroke' });
      const start = svgElement('circle', { class: 'experience-beam-terminal', r: '2' });
      const end = svgElement('circle', { class: 'experience-beam-terminal', r: '2' });
      group.append(track, glow, pulse, start, end);
      svg.append(group);
      return { group, paths: [track, glow, pulse], start, end };
    });
    scene.prepend(svg);

    let frame = 0;
    let inView = false;
    let disposed = false;

    // Read all bounding boxes before writing SVG attributes to avoid layout thrash.
    function draw() {
      frame = 0;
      if (!root.isConnected) { dispose(); return; }
      const containerRect = scene.getBoundingClientRect();
      if (!containerRect.width || !containerRect.height) return;
      const boxes = [lead, core, phone, conversation, record].map((element) => element.getBoundingClientRect());
      const [leadRect, coreRect, phoneRect, chatRect, recordRect] = boxes;
      const point = (rect, x, y) => ({ x: rect.left - containerRect.left + rect.width * x, y: rect.top - containerRect.top + rect.height * y });
      const format = ({ x, y }) => `${x.toFixed(2)} ${y.toFixed(2)}`;
      const curves = [];

      const intakeStart = point(leadRect, 1, .5);
      const intakeEnd = point(coreRect, 0, .5);
      const intakeMid = (intakeStart.x + intakeEnd.x) / 2;
      curves.push({ start: intakeStart, end: intakeEnd, d: `M ${format(intakeStart)} C ${intakeMid} ${intakeStart.y}, ${intakeMid} ${intakeEnd.y}, ${format(intakeEnd)}` });

      if (mobileLayout.matches) {
        // Route through the gap between the source card and the phone, away from copy.
        const start = point(coreRect, .85, 1);
        const end = point(phoneRect, .78, 0);
        const bendY = phoneRect.top - containerRect.top - 13;
        curves.push({ start, end, d: `M ${format(start)} C ${start.x} ${bendY}, ${end.x} ${bendY}, ${format(end)}` });
        curves.push(null);
      } else {
        const start = point(coreRect, 1, .5);
        const end = { x: phoneRect.left - containerRect.left, y: chatRect.top - containerRect.top + chatRect.height * .5 };
        const middle = (start.x + end.x) / 2;
        curves.push({ start, end, d: `M ${format(start)} C ${middle} ${start.y}, ${middle} ${end.y}, ${format(end)}` });

        // Leave from the lower left edge so the return route avoids the engine label.
        const followStart = point(coreRect, .18, 1);
        const followEnd = point(recordRect, 1, .5);
        curves.push({ start: followStart, end: followEnd, d: `M ${format(followStart)} C ${followStart.x - 24} ${followStart.y + 25}, ${followEnd.x + 38} ${followEnd.y}, ${format(followEnd)}` });
      }

      svg.setAttribute('viewBox', `0 0 ${containerRect.width} ${containerRect.height}`);
      connections.forEach((connection, index) => {
        const curve = curves[index];
        connection.group.style.display = curve ? '' : 'none';
        if (!curve) return;
        connection.paths.forEach((path) => path.setAttribute('d', curve.d));
        connection.start.setAttribute('cx', curve.start.x);
        connection.start.setAttribute('cy', curve.start.y);
        connection.end.setAttribute('cx', curve.end.x);
        connection.end.setAttribute('cy', curve.end.y);
      });
      root.dataset.beamsReady = 'true';
    }

    function requestDraw() {
      if (!frame && !disposed) frame = window.requestAnimationFrame(draw);
    }

    function syncPlayback() {
      const stage = Number(root.dataset.stage || 0);
      // Follow-up is shown on the core-to-phone connection in the compact layout.
      const active = stage < 2 ? 0 : stage === 2 || mobileLayout.matches ? 1 : 2;
      connections.forEach(({ group }, index) => { group.dataset.active = String(index === active); });
      svg.dataset.running = String(root.dataset.playing === 'true' && inView && !document.hidden && !motionPreference.matches);
      svg.dataset.reduced = String(motionPreference.matches);
    }

    const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(requestDraw) : null;
    [scene, lead, core, phone, conversation, record].forEach((element) => resizeObserver?.observe(element));
    const mutationObserver = new MutationObserver(() => { syncPlayback(); requestDraw(); });
    mutationObserver.observe(root, { attributes: true, attributeFilter: ['data-stage', 'data-playing'] });
    const visibilityObserver = typeof IntersectionObserver === 'function' ? new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= .3);
      syncPlayback();
    }, { threshold: .3 }) : null;
    if (visibilityObserver) visibilityObserver.observe(root);
    else inView = true;

    function onLayoutChange() { requestDraw(); syncPlayback(); }
    function dispose() {
      if (disposed) return;
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      mutationObserver.disconnect();
      visibilityObserver?.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      window.removeEventListener('resize', requestDraw);
      mobileLayout.removeEventListener('change', onLayoutChange);
      motionPreference.removeEventListener('change', syncPlayback);
    }

    document.addEventListener('visibilitychange', syncPlayback);
    window.addEventListener('resize', requestDraw, { passive: true });
    mobileLayout.addEventListener('change', onLayoutChange);
    motionPreference.addEventListener('change', syncPlayback);
    document.fonts?.ready.then(requestDraw);
    syncPlayback();
    requestDraw();
  });
})();
