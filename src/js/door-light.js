(() => {
  const canvas = document.querySelector('[data-door-light]');
  const context = canvas && canvas.getContext('2d');
  if (!context) return;

  const TAU = Math.PI * 2;
  const SHADOW = { red: 16, green: 16, blue: 17, alpha: 0.76 };
  const GLOW = { red: 242, green: 191, blue: 37, alpha: 0.3 };
  const DOOR_TOP = { x: 0.16, y: -0.34 };
  const LIGHT_TARGET = { x: 0.6, y: 1 };
  const CRACK_ANGLE = 0.05;
  const OPEN_LIMIT_X = 0.98; // The moving edge stays inside the section.
  const STATIC_OPENING = 0.3;
  const CYCLE_MS = 38000;
  const FRAME_MS = 1000 / 30;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let image = null;
  let angles = null;
  let distances = null;
  let glowMask = null;
  let frameEdge = 0;
  let openSlope = 0;
  let opening = STATIC_OPENING;
  let phase = 1;
  let clock = 0;
  let lastTime = 0;
  let lastDraw = -Infinity;
  let frame = 0;
  let inView = false;

  const smoothstep = (edge0, edge1, value) => {
    const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  };

  // A low-resolution shadow map is cheap to update and scales up with soft edges.
  function measure() {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(64, Math.min(240, Math.round(bounds.width / 8)));
    height = Math.max(40, Math.min(140, Math.round(bounds.height / 8)));
    canvas.width = width;
    canvas.height = height;
    image = context.createImageData(width, height);
    angles = new Float32Array(width * height);
    distances = new Float32Array(width * height);
    glowMask = new Float32Array(width * height);

    const aspect = bounds.width / Math.max(bounds.height, 1);
    const textScale = Math.max(0.8, Math.min(1.6, aspect));
    const originX = DOOR_TOP.x * aspect;
    frameEdge = Math.atan2((LIGHT_TARGET.x - DOOR_TOP.x) * aspect, LIGHT_TARGET.y - DOOR_TOP.y) - 0.24;
    openSlope = ((OPEN_LIMIT_X - DOOR_TOP.x) * aspect) / (1 - DOOR_TOP.y);

    for (let y = 0, index = 0; y < height; y += 1) {
      const dy = (y + 0.5) / height - DOOR_TOP.y;
      for (let x = 0; x < width; x += 1, index += 1) {
        const dx = ((x + 0.5) / width) * aspect - originX;
        angles[index] = Math.atan2(dx, dy);
        distances[index] = Math.hypot(dx, dy);
        // The glow softens around the copy without breaking the beam.
        const textX = ((x + 0.5) / width - 0.5) * textScale;
        const textY = ((y + 0.5) / height - 0.47) * 2.1;
        glowMask[index] = 0.45 + 0.55 * smoothstep(0.24, 0.86, Math.hypot(textX, textY));
      }
    }
  }

  function draw() {
    // Interpolating the tangent moves the edge evenly across the screen.
    const closedSlope = Math.tan(frameEdge + CRACK_ANGLE);
    const doorEdge = Math.atan(closedSlope + (openSlope - closedSlope) * opening);
    const spread = doorEdge - frameEdge;
    const penumbra = 0.2 + 0.8 * smoothstep(CRACK_ANGLE, 0.46, spread);
    const { data } = image;

    for (let index = 0; index < angles.length; index += 1) {
      const angle = angles[index];
      const distance = distances[index];
      // The penumbra widens with distance and tightens smoothly near a closed door.
      const blur = (0.035 + 0.085 * distance) * penumbra;
      const light = smoothstep(frameEdge - blur, frameEdge + blur, angle)
        * (1 - smoothstep(doorEdge - blur, doorEdge + blur, angle))
        * (1 - 0.22 * smoothstep(0.7, 2.2, distance));
      const shadow = SHADOW.alpha * (1 - light);
      const glow = GLOW.alpha * light * glowMask[index]
        * (1 - 0.45 * smoothstep(0.5, 2.2, distance)) * (1 - shadow);
      const alpha = shadow + glow;
      const offset = index * 4;

      if (alpha > 0.001) {
        data[offset] = (SHADOW.red * shadow + GLOW.red * glow) / alpha;
        data[offset + 1] = (SHADOW.green * shadow + GLOW.green * glow) / alpha;
        data[offset + 2] = (SHADOW.blue * shadow + GLOW.blue * glow) / alpha;
      }
      data[offset + 3] = 255 * alpha;
    }

    context.putImageData(image, 0, 0);
    canvas.classList.add('is-ready');
  }

  function advance(delta) {
    clock += delta;
    // Two unrelated waves make the door drift instead of moving like a metronome.
    const tempo = 1 + 0.26 * Math.sin(clock * 0.00021 + 0.7) + 0.15 * Math.sin(clock * 0.00053 + 2.1);
    phase = (phase + (delta / CYCLE_MS) * TAU * tempo) % TAU;
    const swing = (0.5 - 0.5 * Math.cos(phase)) ** 1.25;
    const flutter = 0.012 * Math.sin(clock * 0.0013) * Math.sin(clock * 0.00071) * swing;
    opening = Math.max(0, Math.min(1, swing + flutter));
  }

  function renderDoorLight(now) {
    frame = requestAnimationFrame(renderDoorLight);
    const delta = Math.min(now - lastTime, 250);
    lastTime = now;
    advance(delta);
    if (now - lastDraw < FRAME_MS) return;
    lastDraw = now;
    draw();
  }

  function updateLoop() {
    const shouldRun = inView && !document.hidden && !reducedMotion;
    if (shouldRun && !frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(renderDoorLight);
    } else if (!shouldRun && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  measure();
  if (!reducedMotion) advance(0);
  draw();

  new ResizeObserver(() => {
    measure();
    draw();
  }).observe(canvas);

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updateLoop();
  }, { rootMargin: '100px' }).observe(canvas);

  document.addEventListener('visibilitychange', updateLoop);
})();
