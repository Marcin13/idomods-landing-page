(() => {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  const slides = [...hero.querySelectorAll('[data-slide]')];
  const segments = [...hero.querySelectorAll('[data-segment]')];
  const lamps = [...hero.querySelectorAll('[data-lamp]')];
  const pauseButton = hero.querySelector('[data-pause]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pauseReasons = new Set();
  let current = 0;

  function setPaused(reason, paused) {
    if (paused) pauseReasons.add(reason);
    else pauseReasons.delete(reason);
    hero.classList.toggle('is-paused', pauseReasons.size > 0);
  }

  function syncLitState() {
    const anyLit = lamps.some((lamp) => lamp.getAttribute('aria-pressed') === 'true');
    slides[0].classList.toggle('is-lit', anyLit);
    setPaused('lit', anyLit && current === 0);
  }

  function goTo(index) {
    const next = (index + slides.length) % slides.length;
    if (next === current) return;

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === next);
      slide.classList.remove('is-entering');
      slide.inert = i !== next;
    });
    void slides[next].offsetWidth; // Restarts the entrance animation.
    slides[next].classList.add('is-entering');
    segments.forEach((segment, i) => segment.classList.toggle('is-active', i === next));
    current = next;
    syncLitState();
  }

  hero.querySelector('[data-prev]').addEventListener('click', () => goTo(current - 1));
  hero.querySelector('[data-next]').addEventListener('click', () => goTo(current + 1));

  // The progress bar is the slider clock, so pausing it also pauses autoplay.
  hero.addEventListener('animationend', (event) => {
    if (event.animationName === 'hero-progress') goTo(current + 1);
  });

  lamps.forEach((lamp) => {
    lamp.addEventListener('click', () => {
      const on = lamp.getAttribute('aria-pressed') !== 'true';
      lamp.setAttribute('aria-pressed', String(on));
      lamp.setAttribute('aria-label', `${on ? 'Wyłącz' : 'Włącz'} ${lamp.dataset.lamp} lampę`);
      syncLitState();
    });
    lamp.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') setPaused('lamp-hover', true);
    });
    lamp.addEventListener('pointerleave', () => setPaused('lamp-hover', false));
  });

  hero.addEventListener('focusin', (event) => {
    if (event.target.matches(':focus-visible')) setPaused('focus', true);
  });
  hero.addEventListener('focusout', (event) => {
    if (!hero.contains(event.relatedTarget)) setPaused('focus', false);
  });
  document.addEventListener('visibilitychange', () => setPaused('hidden', document.hidden));

  if (!reducedMotion) {
    hero.classList.add('is-autoplay');
    pauseButton.hidden = false;
    pauseButton.addEventListener('click', () => {
      const paused = !pauseReasons.has('user');
      setPaused('user', paused);
      pauseButton.classList.toggle('is-stopped', paused);
      pauseButton.setAttribute(
        'aria-label',
        paused ? 'Wznów automatyczne przewijanie' : 'Zatrzymaj automatyczne przewijanie',
      );
    });
  }

  if (reducedMotion || !finePointer) return;

  // Lamps lean toward the cursor, each with its own depth.
  const states = lamps.map((element, i) => ({
    element,
    depth: [1, 0.65, 1.3][i],
    x: 0, y: 0, rotate: 0,
    targetX: 0, targetY: 0, targetRotate: 0,
  }));
  let frame = 0;

  function tick() {
    let moving = false;
    states.forEach((state) => {
      state.x += (state.targetX - state.x) * 0.09;
      state.y += (state.targetY - state.y) * 0.09;
      state.rotate += (state.targetRotate - state.rotate) * 0.09;
      if (Math.abs(state.targetX - state.x) + Math.abs(state.targetY - state.y)
        + Math.abs(state.targetRotate - state.rotate) > 0.01) moving = true;
      state.element.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0) rotate(${state.rotate.toFixed(2)}deg)`;
    });
    frame = moving ? requestAnimationFrame(tick) : 0;
  }

  function animate() {
    if (!frame) frame = requestAnimationFrame(tick);
  }

  hero.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = hero.getBoundingClientRect();
    const stage = slides[0].getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;
    const normalX = pointerX / bounds.width - 0.5;
    const normalY = pointerY / bounds.height - 0.5;

    states.forEach((state) => {
      const centerX = stage.left - bounds.left + state.element.offsetLeft + state.element.offsetWidth / 2;
      const lean = ((pointerX - centerX) / bounds.width) * 26;
      state.targetX = normalX * 44 * state.depth;
      state.targetY = normalY * 32 * state.depth;
      state.targetRotate = Math.max(-9, Math.min(9, lean));
    });
    animate();
  });

  hero.addEventListener('pointerleave', () => {
    states.forEach((state) => {
      state.targetX = 0;
      state.targetY = 0;
      state.targetRotate = 0;
    });
    animate();
  });
})();
