(function () {
  'use strict';

  var prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initHeroLightRays() {
    var container = document.querySelector('#hero .light-rays-container');
    if (!container) return;

    var canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.setAttribute('aria-hidden', 'true');

    var contextOptions = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'default',
    };

    var gl = null;
    try {
      gl = canvas.getContext('webgl2', contextOptions) || canvas.getContext('webgl', contextOptions);
    } catch (err) {
      console.warn('[LightRays] WebGL init failed:', err);
      return;
    }

    if (!gl) {
      console.warn('[LightRays] WebGL context unavailable');
      return;
    }

    var vertexSource = [
      'attribute vec2 position;',
      'varying vec2 vUv;',
      'void main() {',
      '  vUv = position * 0.5 + 0.5;',
      '  gl_Position = vec4(position, 0.0, 1.0);',
      '}',
    ].join('\n');

    var fragmentSource = [
      'precision highp float;',
      '',
      'uniform float iTime;',
      'uniform vec2  iResolution;',
      '',
      'uniform vec2  rayPos;',
      'uniform vec2  rayDir;',
      'uniform vec3  raysColor;',
      'uniform float raysSpeed;',
      'uniform float lightSpread;',
      'uniform float rayLength;',
      'uniform float pulsating;',
      'uniform float fadeDistance;',
      'uniform float saturation;',
      'uniform vec2  mousePos;',
      'uniform float mouseInfluence;',
      'uniform float noiseAmount;',
      'uniform float distortion;',
      '',
      'varying vec2 vUv;',
      '',
      'float noise(vec2 st) {',
      '  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);',
      '}',
      '',
      'float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,',
      '                  float seedA, float seedB, float speed) {',
      '  vec2 sourceToCoord = coord - raySource;',
      '  vec2 dirNorm = normalize(sourceToCoord);',
      '  float cosAngle = dot(dirNorm, rayRefDirection);',
      '',
      '  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;',
      '',
      '  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));',
      '',
      '  float distance = length(sourceToCoord);',
      '  float maxDistance = iResolution.x * rayLength;',
      '  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);',
      '',
      '  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);',
      '  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;',
      '',
      '  float baseStrength = clamp(',
      '    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +',
      '    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),',
      '    0.0, 1.0',
      '  );',
      '',
      '  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;',
      '}',
      '',
      'void mainImage(out vec4 fragColor, in vec2 fragCoord) {',
      '  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);',
      '',
      '  vec2 finalRayDir = rayDir;',
      '  if (mouseInfluence > 0.0) {',
      '    vec2 mouseScreenPos = mousePos * iResolution.xy;',
      '    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);',
      '    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));',
      '  }',
      '',
      '  vec4 rays1 = vec4(1.0) *',
      '               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,',
      '                           1.5 * raysSpeed);',
      '  vec4 rays2 = vec4(1.0) *',
      '               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,',
      '                           1.1 * raysSpeed);',
      '',
      '  fragColor = rays1 * 0.5 + rays2 * 0.4;',
      '',
      '  if (noiseAmount > 0.0) {',
      '    float n = noise(coord * 0.01 + iTime * 0.1);',
      '    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);',
      '  }',
      '',
      '  float brightness = 1.0 - (coord.y / iResolution.y);',
      '  fragColor.x *= 0.1 + brightness * 0.8;',
      '  fragColor.y *= 0.3 + brightness * 0.6;',
      '  fragColor.z *= 0.5 + brightness * 0.5;',
      '',
      '  if (saturation != 1.0) {',
      '    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));',
      '    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);',
      '  }',
      '',
      '  fragColor.rgb *= raysColor;',
      '}',
      '',
      'void main() {',
      '  vec4 color;',
      '  mainImage(color, gl_FragCoord.xy);',
      '  gl_FragColor = color;',
      '}',
    ].join('\n');

    function compileShader(type, source) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var info = gl.getShaderInfoLog(shader) || 'Shader compile error';
        gl.deleteShader(shader);
        throw new Error(info);
      }
      return shader;
    }

    var program;
    try {
      var vs = compileShader(gl.VERTEX_SHADER, vertexSource);
      var fs = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || 'Program link error');
      }
    } catch (err) {
      console.warn('[LightRays] Shader compilation failed:', err);
      return;
    }

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(canvas);

    gl.useProgram(program);

    var posLoc = gl.getAttribLocation(program, 'position');
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    var u = {
      iTime: gl.getUniformLocation(program, 'iTime'),
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      rayPos: gl.getUniformLocation(program, 'rayPos'),
      rayDir: gl.getUniformLocation(program, 'rayDir'),
      raysColor: gl.getUniformLocation(program, 'raysColor'),
      raysSpeed: gl.getUniformLocation(program, 'raysSpeed'),
      lightSpread: gl.getUniformLocation(program, 'lightSpread'),
      rayLength: gl.getUniformLocation(program, 'rayLength'),
      pulsating: gl.getUniformLocation(program, 'pulsating'),
      fadeDistance: gl.getUniformLocation(program, 'fadeDistance'),
      saturation: gl.getUniformLocation(program, 'saturation'),
      mousePos: gl.getUniformLocation(program, 'mousePos'),
      mouseInfluence: gl.getUniformLocation(program, 'mouseInfluence'),
      noiseAmount: gl.getUniformLocation(program, 'noiseAmount'),
      distortion: gl.getUniformLocation(program, 'distortion'),
    };

    gl.uniform3f(u.raysColor, 0xb5 / 255, 0xe3 / 255, 0xc0 / 255);
    gl.uniform1f(u.raysSpeed, 1.5);
    gl.uniform1f(u.lightSpread, 0.5);
    gl.uniform1f(u.rayLength, 3.0);
    gl.uniform1f(u.pulsating, 0.0);
    gl.uniform1f(u.fadeDistance, 1.0);
    gl.uniform1f(u.saturation, 1.0);
    gl.uniform1f(u.mouseInfluence, 0.1);
    gl.uniform1f(u.noiseAmount, 0.0);
    gl.uniform1f(u.distortion, 0.0);

    var targetMouse = { x: 0.5, y: 0.5 };
    var smoothMouse = { x: 0.5, y: 0.5 };
    var cachedWidth = 1;
    var cachedHeight = 1;
    var isVisible = true;
    var rafId = null;

    function updateSize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      var w = container.clientWidth || 1;
      var h = container.clientHeight || 1;
      cachedWidth = w;
      cachedHeight = h;
      var pw = Math.max(1, Math.round(w * dpr));
      var ph = Math.max(1, Math.round(h * dpr));
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }
      gl.viewport(0, 0, pw, ph);
      gl.uniform2f(u.iResolution, pw, ph);
      gl.uniform2f(u.rayPos, 0.5 * pw, -0.2 * ph);
      gl.uniform2f(u.rayDir, 0, 1);
    }

    function renderFrame(timeSec) {
      smoothMouse.x = 0.92 * smoothMouse.x + 0.08 * targetMouse.x;
      smoothMouse.y = 0.92 * smoothMouse.y + 0.08 * targetMouse.y;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(u.iTime, timeSec);
      gl.uniform2f(u.mousePos, smoothMouse.x, smoothMouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function tick(now) {
      rafId = null;
      if (!isVisible || document.hidden) return;
      renderFrame(now * 0.001);
      rafId = requestAnimationFrame(tick);
    }

    function startLoop() {
      if (prefersReducedMotion) {
        renderFrame(1.0);
        return;
      }
      if (rafId === null && isVisible && !document.hidden) {
        rafId = requestAnimationFrame(tick);
      }
    }

    function stopLoop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    updateSize();

    window.addEventListener('resize', function () {
      updateSize();
      if (prefersReducedMotion) renderFrame(1.0);
    });

    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(function () {
        updateSize();
        if (prefersReducedMotion) renderFrame(1.0);
      }).observe(container);
    }

    window.addEventListener(
      'mousemove',
      function (e) {
        if (!isVisible || document.hidden) return;
        targetMouse.x = e.clientX / cachedWidth;
        targetMouse.y = e.clientY / cachedHeight;
      },
      { passive: true }
    );

    if (typeof IntersectionObserver === 'function') {
      new IntersectionObserver(
        function (entries) {
          isVisible = entries[0].isIntersecting;
          if (isVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { threshold: 0.01 }
      ).observe(container);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    });

    startLoop();
  }

  function boot() {
    initHeroLightRays();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
