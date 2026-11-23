(() => {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  const slides = [...hero.querySelectorAll('[data-slide]')];
  const segments = [...hero.querySelectorAll('[data-segment]')];
  const lamps = [...hero.querySelectorAll('[data-lamp]')];
  const pools = [...hero.querySelectorAll('[data-pool]')];
  const pauseButton = hero.querySelector('[data-pause]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pauseReasons = new Set();
  const TAU = Math.PI * 2;

  // Rock outline in stage coordinates, used to land each light beam.
  const ROCK = [[0.156, 1], [0.234, 0.93], [0.344, 0.847], [0.47, 0.75], [0.594, 0.736],
    [0.734, 0.731], [0.797, 0.75], [0.844, 0.861], [0.859, 1]];
  const MOTION = [
    { depth: 1, period: 12800, phase: 0.6 },
    { depth: 0.65, period: 15200, phase: 2.8 },
    { depth: 1.3, period: 11600, phase: 4.5 },
  ];

  let current = 0;
  let frame = 0;
  let inView = true;
  let stage = { width: 1, height: 1 };

  const states = lamps.map((element, i) => ({
    element,
    beam: element.querySelector('.lamp__beam'),
    pool: pools[i],
    ...MOTION[i],
    x: 0, y: 0, rotate: 0,
    targetX: 0, targetY: 0, targetRotate: 0,
  }));

  function rockHeight(u) {
    for (let i = 1; i < ROCK.length; i += 1) {
      const [x0, y0] = ROCK[i - 1];
      const [x1, y1] = ROCK[i];
      if (u >= x0 && u <= x1) return y0 + ((u - x0) / (x1 - x0)) * (y1 - y0);
    }
    return Infinity;
  }

  function castToRock(x, y, dirX, dirY) {
    const step = stage.height / 120;
    for (let distance = 0; distance < stage.height * 1.25; distance += step) {
      const px = x + dirX * distance;
      const py = y + dirY * distance;
      if (px < 0 || px > stage.width || py > stage.height) return null;
      const u = px / stage.width;
      if (py / stage.height >= rockHeight(u)) {
        const left = rockHeight(u - 0.01);
        const right = rockHeight(u + 0.01);
        const slope = Number.isFinite(left) && Number.isFinite(right)
          ? Math.atan2((right - left) * stage.height, 0.02 * stage.width)
          : 0;
        return { x: px, y: py, distance, slope };
      }
    }
    return null;
  }

  function measure() {
    stage = { width: slides[0].offsetWidth || 1, height: slides[0].offsetHeight || 1 };
    states.forEach((state) => {
      const { element, beam, pool } = state;
      const style = getComputedStyle(element);
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      state.width = width;
      state.height = height;
      state.centerX = element.offsetLeft + width / 2;
      state.centerY = element.offsetTop + height / 2;
      state.faceX = (parseFloat(style.getPropertyValue('--face-x')) / 100 - 0.5) * width;
      state.faceY = (parseFloat(style.getPropertyValue('--face-y')) / 100 - 0.5) * height;
      state.beamAngle = parseFloat(style.getPropertyValue('--beam-rotate'));
      state.beamLength = beam.offsetHeight;
      pool.style.width = `${beam.offsetWidth * 0.62}px`;
      state.poolWidth = pool.offsetWidth;
      state.poolHeight = pool.offsetHeight;
    });
  }

  // One pose drives the lamp, its beam and its light on the rock in the same frame.
  function renderLamp(state, time) {
    const wave = reducedMotion ? 0 : Math.sin((time / state.period) * TAU + state.phase);
    const x = state.x;
    const y = state.y + wave * 0.014 * state.height;
    const rotate = state.rotate + wave * 1.4;
    const radians = (rotate * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const faceX = state.centerX + x + state.faceX * cos - state.faceY * sin;
    const faceY = state.centerY + y + state.faceX * sin + state.faceY * cos;
    const axis = ((state.beamAngle + rotate) * Math.PI) / 180;
    const hit = castToRock(faceX, faceY, -Math.sin(axis), Math.cos(axis));
    const reach = hit ? (hit.distance * 1.12) / state.beamLength : 1;
    const stretch = Math.max(0.12, Math.min(1.4, reach));
    const widen = Math.min(1, 0.46 + stretch * 0.5);

    state.element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotate.toFixed(3)}deg)`;
    state.beam.style.transform = `translateX(-50%) rotate(${state.beamAngle}deg) scale(${widen.toFixed(4)}, ${stretch.toFixed(4)})`;
    state.pool.classList.toggle('is-landed', Boolean(hit));
    if (hit) {
      const spread = (widen * 1.3) / Math.max(0.55, Math.abs(Math.cos(axis - hit.slope)));
      state.pool.style.transform = `translate3d(${(hit.x - state.poolWidth / 2).toFixed(2)}px, ${(hit.y - state.poolHeight / 2).toFixed(2)}px, 0) rotate(${hit.slope.toFixed(4)}rad) scaleX(${spread.toFixed(4)})`;
    }
  }

  function tick(time) {
    states.forEach((state) => {
      state.x += (state.targetX - state.x) * 0.09;
      state.y += (state.targetY - state.y) * 0.09;
      state.rotate += (state.targetRotate - state.rotate) * 0.09;
      renderLamp(state, time);
    });
    frame = requestAnimationFrame(tick);
  }

  function updateLoop() {
    const shouldRun = !reducedMotion && inView && !document.hidden && current === 0;
    if (shouldRun && !frame) {
      frame = requestAnimationFrame(tick);
    } else if (!shouldRun && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

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
    updateLoop();
  }

  hero.querySelector('[data-prev]').addEventListener('click', () => goTo(current - 1));
  hero.querySelector('[data-next]').addEventListener('click', () => goTo(current + 1));

  // The progress bar is the slider clock, so pausing it also pauses autoplay.
  hero.addEventListener('animationend', (event) => {
    if (event.animationName === 'hero-progress') goTo(current + 1);
  });

  states.forEach(({ element: lamp, pool }) => {
    lamp.addEventListener('click', () => {
      const on = lamp.getAttribute('aria-pressed') !== 'true';
      lamp.setAttribute('aria-pressed', String(on));
      lamp.setAttribute('aria-label', `${on ? 'Wyłącz' : 'Włącz'} ${lamp.dataset.lamp} lampę`);
      pool.classList.toggle('is-on', on);
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
  document.addEventListener('visibilitychange', () => {
    setPaused('hidden', document.hidden);
    updateLoop();
  });

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

  measure();
  states.forEach((state) => renderLamp(state, performance.now()));

  new ResizeObserver(() => {
    measure();
    states.forEach((state) => renderLamp(state, performance.now()));
  }).observe(slides[0]);

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updateLoop();
  }).observe(hero);

  updateLoop();

  if (reducedMotion || !finePointer) return;

  // Lamps lean toward the cursor, each with its own depth.
  hero.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = hero.getBoundingClientRect();
    const slide = slides[0].getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;
    const normalX = pointerX / bounds.width - 0.5;
    const normalY = pointerY / bounds.height - 0.5;

    states.forEach((state) => {
      const centerX = slide.left - bounds.left + state.centerX;
      const lean = ((pointerX - centerX) / bounds.width) * 26;
      state.targetX = normalX * 44 * state.depth;
      state.targetY = normalY * 32 * state.depth;
      state.targetRotate = Math.max(-9, Math.min(9, lean));
    });
  });

  hero.addEventListener('pointerleave', () => {
    states.forEach((state) => {
      state.targetX = 0;
      state.targetY = 0;
      state.targetRotate = 0;
    });
  });
})();
