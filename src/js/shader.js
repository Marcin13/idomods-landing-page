(() => {
  const canvas = document.querySelector('[data-shader]');
  if (!canvas) return;

  const CYCLE_MS = 25000;
  const FRAME_MS = 1000 / 30;
  const STATIC_PHASE = 0.12;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const vertexSource = `
    attribute vec2 position;
    void main() { gl_Position = vec4(position, 0.0, 1.0); }
  `;

  // Time only moves points around closed circles, so phase 1 equals phase 0.
  const fragmentSource = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    uniform vec2 resolution;
    uniform float phase;

    const float TAU = 6.28318530718;
    const vec3 INK = vec3(0.0627, 0.0627, 0.0667);
    const vec3 AMBER = vec3(0.44, 0.33, 0.08);
    const vec3 GOLD = vec3(0.949, 0.749, 0.145);

    float hash(vec2 p) {
      vec3 q = fract(vec3(p.xyx) * 0.1031);
      q += dot(q, q.yzx + 33.33);
      return fract((q.x + q.y) * q.z);
    }

    float noise(vec2 p) {
      vec2 cell = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      return mix(
        mix(hash(cell), hash(cell + vec2(1.0, 0.0)), u.x),
        mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.55;
      for (int i = 0; i < 3; i++) {
        value += amplitude * noise(p);
        p = mat2(1.6, 1.2, -1.2, 1.6) * p + vec2(3.1, 1.7);
        amplitude *= 0.48;
      }
      return value;
    }

    vec2 orbit(float turns, float offset) {
      float angle = TAU * (phase * turns + offset);
      return vec2(cos(angle), sin(angle));
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution;
      float aspect = resolution.x / resolution.y;
      vec2 p = vec2(uv.x * aspect, uv.y);

      // Long silk-like folds run diagonally, so noise is stretched along them.
      float across = dot(p, vec2(0.8, 0.6));
      float along = dot(p, vec2(0.6, -0.8));
      vec2 folded = vec2(across, along * 0.3);

      float warpA = fbm(folded * 1.15 + 0.34 * orbit(1.0, 0.0));
      float warpB = fbm(folded * 0.85 + vec2(4.3, 1.9) + 0.3 * orbit(1.0, 0.4));
      float drift = 0.55 * sin(TAU * phase);

      float fine = 0.5 + 0.5 * sin(across * 5.4 + warpA * 4.2 + warpB * 2.6 + drift);
      float broad = 0.5 + 0.5 * sin(across * 2.2 - along * 0.55 + warpB * 3.4 + TAU * phase);
      float folds = smoothstep(0.1, 0.96, mix(broad, fine, 0.6));

      float rise = smoothstep(0.98, 0.0, uv.y + 0.3 * (warpA - 0.5));
      float light = folds * rise * rise * 1.28;

      vec2 center = (uv - vec2(0.5, 0.52)) * vec2(1.25, 1.9);
      light *= mix(0.62, 1.0, smoothstep(0.1, 0.7, length(center)));

      vec3 color = mix(INK, AMBER, smoothstep(0.02, 0.56, light));
      color = mix(color, GOLD, smoothstep(0.5, 1.08, light));
      color += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl) return; // The CSS gradient stays as a fallback.

  let uniforms = null;
  let elapsed = 0;
  let lastTime = 0;
  let lastDraw = -Infinity;
  let frame = 0;
  let inView = false;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  }

  function setup() {
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) return false;

    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    uniforms = {
      resolution: gl.getUniformLocation(program, 'resolution'),
      phase: gl.getUniformLocation(program, 'phase'),
    };
    return true;
  }

  function draw(phase) {
    if (!uniforms) return;
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1f(uniforms.phase, phase);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    canvas.classList.add('is-ready');
  }

  function currentPhase() {
    return reducedMotion ? STATIC_PHASE : (elapsed % CYCLE_MS) / CYCLE_MS;
  }

  function resize() {
    // Soft gradients stay smooth at a reduced internal resolution.
    const bounds = canvas.getBoundingClientRect();
    const scale = Math.min(0.75, 960 / Math.max(bounds.width, 1));
    const width = Math.max(1, Math.round(bounds.width * scale));
    const height = Math.max(1, Math.round(bounds.height * scale));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    draw(currentPhase());
  }

  function render(now) {
    frame = requestAnimationFrame(render);
    elapsed += Math.min(now - lastTime, 250);
    lastTime = now;
    if (now - lastDraw < FRAME_MS) return;
    lastDraw = now;
    draw(currentPhase());
  }

  function updateLoop() {
    const shouldRun = inView && !document.hidden && !reducedMotion && uniforms;
    if (shouldRun && !frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(render);
    } else if (!shouldRun && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    uniforms = null;
    canvas.classList.remove('is-ready');
    updateLoop();
  });

  canvas.addEventListener('webglcontextrestored', () => {
    if (setup()) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw(currentPhase());
    }
    updateLoop();
  });

  if (!setup()) return;

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updateLoop();
  }, { rootMargin: '100px' }).observe(canvas);
  document.addEventListener('visibilitychange', updateLoop);
})();
