/**
 * shine-word.js — 从 bonjour.bio 抽离的「彩色扫光轮播词」核心实现(Three.js,无框架)
 *
 * 用法:
 *   import { ShineWord } from './shine-word.js';
 *   new ShineWord(document.querySelector('#word'), { words: ['Airbnb','SpaceX'] });
 *
 * 宿主元素的 font / color / line-height 会被读取并烘焙到字形纹理里,
 * 所以直接用 CSS 控制样式即可。依赖:three (>=0.160)。
 */
import * as THREE from 'three';

/* ───────────── 缓动 ───────────── */
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const bez = (t, a, b) => { const r = 1 - t; return 3 * r * r * t * a + 3 * r * t * t * b + t * t * t; };
/** cubic-bezier(x1,y1,x2,y2) 求值:输入 x∈[0,1] → 输出 y */
function cubicBezier(x, x1, y1, x2, y2) {
  x = clamp01(x);
  let lo = 0, hi = 1, t = x;
  for (let i = 0; i < 10; i++) {
    const v = bez(t, x1, x2);
    if (Math.abs(v - x) < 1e-4) break;
    v < x ? (lo = t) : (hi = t);
    t = (lo + hi) / 2;
  }
  return bez(t, y1, y2);
}

/* ───────────── 着色器 ───────────── */
const VERT = /* glsl */ `
  uniform float uGlyphLeft, uGlyphWidth, uWordWidth;
  varying vec2 vUv, vWordUv;
  void main() {
    vUv = uv;
    // 字形在整个单词里的归一化坐标(让光环跨字符连续)
    vWordUv = vec2(clamp((uGlyphLeft + uv.x * uGlyphWidth) / max(uWordWidth, 1e-4), 0., 1.), uv.y);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }`;

const HEAT = /* glsl */ `
  float gaussian(float d, float r) { return exp(-pow(d / r, 2.)); }

  // 6 段色标(由 JS 传入),0=冷暗端 … 5=高光端
  vec3 thermalPalette(float v) {
    vec3 c = mix(uPal[0], uPal[1], smoothstep(0., .20, v));
    c = mix(c, uPal[2], smoothstep(.26, .44, v));
    c = mix(c, uPal[3], smoothstep(.40, .62, v));
    c = mix(c, uPal[4], smoothstep(.50, .78, v));
    return mix(c, uPal[5], smoothstep(.74, 1., v));
  }

  vec4 heatSweepAt(vec2 wordUv, float progress, float strength, float widthScale, float paletteOffset, float exitShift) {
    if (strength == 0.) return vec4(0.);
    float crossAxis = wordUv.x - .5;
    vec2 origin = vec2(0., 3.);                                   // 光源在单词正下方 3 个字高处
    vec2 pos = vec2(crossAxis * uWordAspect, 1. - wordUv.y);
    float radialDistance = distance(pos, origin);
    float r0 = max(origin.y - 1. + .05, 0.);
    float r1 = length(vec2(uWordAspect * .5, origin.y)) + .3;
    float radius = mix(r0, r1, progress) + exitShift * progress * progress;   // 光环半径随 progress 扩张
    float d = radialDistance - radius;
    float haze = gaussian(d, .34 * widthScale), body = gaussian(d, .19 * widthScale), core = gaussian(d, .062 * widthScale);

    // 色散:R/G/B 三通道的光场各自偏移(字形 alpha 共用,不会产生重影)
    float disp = .010 + abs(crossAxis) * .009;
    vec3 chroma = vec3(gaussian(d + disp, .072), gaussian(d, .058), gaussian(d - disp, .072));

    float p = clamp(.54 - d * 1.25 + crossAxis * .07 + paletteOffset, 0., 1.);
    vec3 col = mix(thermalPalette(p), chroma, core * .30) + vec3(core * .30);
    // 镭射金属质感:沿光环方向的细密干涉条纹 + 窄高光线(类似拉丝/薄膜反射)
    float bands = .5 + .5 * sin(p * 22. + crossAxis * 7.);
    float spec = pow(clamp(1. - abs(d) / (.05 * widthScale), 0., 1.), 3.);
    col = mix(col, col * (.82 + .5 * bands) + vec3(.10) * bands, .45 * (body + core));
    col += uPal[5] * spec * .35;
    col = mix(vec3(dot(col, vec3(.299, .587, .114))), col, 1.35);         // 提高饱和度
    float heat = clamp((haze * .34 + body * 1.0 + core * .5) * strength * 1.25, 0., 1.);  // 染色浓度
    return vec4(col * heat, heat);
  }

  vec4 combinedHeatAt(vec2 wordUv) {
    vec4 a = heatSweepAt(wordUv, uPrimaryProgress, uShineStrength, mix(1.7, 3.2, uPrimaryProgress), -.03, .68);
    vec4 b = heatSweepAt(wordUv, uSecondaryProgress, uSecondaryStrength * uShineStrength * .195, 1.64, .09, 0.);
    float heat = 1. - (1. - a.a) * (1. - b.a);
    vec3 col = (a.rgb + b.rgb) / max(a.a + b.a, 1e-4);
    col += vec3(.26, .16, .30) * a.a * b.a;
    return vec4(clamp(col, 0., 1.), heat);
  }`;

const FRAG = /* glsl */ `
  uniform sampler2D uGlyphMap;
  uniform vec3 uTextColor, uTextColor2;   // 静止态字色:左 → 右渐变
  uniform vec3 uPal[6];
  uniform float uBaseOpacity, uOpacity, uShineStrength, uPrimaryProgress, uSecondaryProgress, uSecondaryStrength, uWordAspect;
  varying vec2 vUv, vWordUv;
  ${HEAT}
  void main() {
    float alpha = texture2D(uGlyphMap, vUv).a * uOpacity;
    if (alpha == 0.) { gl_FragColor = vec4(0.); return; }
    vec4 h = combinedHeatAt(vWordUv);

    vec3 base = mix(uTextColor, uTextColor2, vWordUv.x);
    vec3 color = mix(base, h.rgb, h.a);    // 模式 0:正常字形,被光环染色
    gl_FragColor = vec4(color, alpha * mix(uBaseOpacity, 1., h.a));
    #include <colorspace_fragment>
    gl_FragColor.rgb *= gl_FragColor.a;          // 预乘 alpha
  }`;

/* ───────────── 5 套镭射金属配色(每套 6 个色标:冷暗 → … → 高光) ───────────── */
export const PALETTES = [
  { name: 'aurora', stops: [[.025,.16,1],[.02,.46,1.12],[.34,.055,1],[.96,.045,.52],[1,.30,.035],[1,.94,.84]] },   // 原站:蓝紫品红琥珀
  { name: 'gold',   stops: [[.22,.08,0],[.75,.40,.02],[1,.70,.12],[1,.86,.40],[1,.95,.68],[1,1,.92]] },            // 液态黄金
  { name: 'emerald',stops: [[0,.16,.30],[0,.58,.62],[.08,.88,.62],[.45,1,.72],[.85,1,.82],[1,1,.96]] },            // 青绿极光
  { name: 'rose',   stops: [[.18,.04,.42],[.55,.14,.88],[.95,.28,.80],[1,.52,.62],[1,.78,.72],[1,.96,.93]] },      // 玫瑰紫铬
  { name: 'ice',    stops: [[.10,.16,.55],[.30,.55,.98],[.62,.82,1],[.82,.94,1],[.95,.92,1],[1,1,1]] },            // 冰蓝银
];

/* ───────────── 时间参数(已提速) ───────────── */
const PAD = 24;               // canvas 比文字多出的外边距(给光晕留空间)
const GLYPH_PAD = 18;         // 每个字形纹理的四周留白
const ENTER_MS = 340;         // 单字入场时长
const EXIT_MS = 160;          // 单字退场时长
const RISE = 0.22;            // 入/退场位移 = fontSize * 0.22
const SHINE_MS = 3200;        // 扫光总时长
const SHINE_OVERLAP = 500;    // 扫光在入场结束前 700ms 开始
const SECOND_DELAY = 320, SECOND_MS = 1000;   // 第二道较弱的光环
const stagger = (i) => i * 11; // 逐字入场间隔

export class ShineWord {
  /**
   * @param {HTMLElement} host 一个行内元素(span)。其 CSS font/color 决定文字样式
   * @param {object} o
   * @param {string[]} o.words 轮播词
   * @param {number} [o.holdMs=700] 扫光结束后停留时间
   * @param {{name:string,stops:number[][]}[]} [o.palettes] 配色方案,第 i 个词用 palettes[i % n]
   * @param {number} [o.baseOpacity=1]
   * @param {[string,string]} [o.baseGradient] 静止态字色渐变(CSS 颜色,左→右);缺省用宿主 color
   * @param {number} [o.loopPause=0] 每轮轮播结束(回到第一个词之前)槽位收起、只剩前文居中的停留毫秒数
   * @param {number} [o.initialDelay=0] 首屏加载后先让轮播词槽位保持收起(前文居中)的毫秒数,之后才展开并开始入场 + 扫光
   */
  constructor(host, { words, holdMs = 700, baseOpacity = 1, palettes = PALETTES, baseGradient = null, initialDelay = 0, loopPause = 0 }) {
    this.host = host; this.words = words; this.holdMs = holdMs; this.palettes = palettes; this.baseGradient = baseGradient; this.baseOpacity = baseOpacity; this.initialDelay = initialDelay; this.loopPause = loopPause; this.started = false;
    this.index = 0; this.glyphs = []; this.state = 'idle'; this.t0 = 0; this.dead = false;

    // DOM:sizer(不可见,撑开宽度并提供测量) + canvas(实际绘制)
    host.classList.add('shine-word');
    host.setAttribute('aria-label', words[0]);
    host.textContent = '';
    this.sizer = Object.assign(document.createElement('span'), { className: 'shine-word__sizer' });
    this.canvas = Object.assign(document.createElement('canvas'), { className: 'shine-word__canvas' });
    this.canvas.setAttribute('aria-hidden', 'true');
    host.append(this.sizer, this.canvas);
    this.sizer.textContent = words[0];

    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reduced || !this.#initRenderer()) { host.classList.add('shine-word--fallback'); host.classList.remove('shine-word--collapsed'); host.style.width = ''; return; }

    this.io = new IntersectionObserver(([e]) => (this.visible = e.isIntersecting), { threshold: 0.1 });
    this.io.observe(host);
    this.visible = true;
    if (initialDelay > 0) { host.style.width = '0px'; host.classList.add('shine-word--collapsed'); }   // 初始收起,前文居中
    (document.fonts?.ready ?? Promise.resolve()).then(() => this.#start());
    this.raf = requestAnimationFrame(this.#tick);

    // 字号随视口变化(clamp/vw)时重新烘焙
    let timer;
    this.onResize = () => { clearTimeout(timer); timer = setTimeout(() => { if (this.dead || !this.started) return; this.host.style.width = ''; this.#showWord(); }, 150); };
    addEventListener('resize', this.onResize);
  }

  /* 首次启动:可选的「前文居中停留」→ 槽位展开(宽度过渡)→ 词入场并扫光 */
  async #start() {
    if (this.dead) return;
    if (this.initialDelay > 0) {
      await new Promise((r) => setTimeout(r, this.initialDelay));
      if (this.dead) return;
      this.host.style.width = this.sizer.getBoundingClientRect().width + 'px';
      this.host.classList.remove('shine-word--collapsed');
      await new Promise((r) => setTimeout(r, 250));
      if (this.dead) return;
    }
    this.started = true;
    this.#showWord();
  }

  destroy() {
    this.dead = true; cancelAnimationFrame(this.raf); this.io?.disconnect(); removeEventListener('resize', this.onResize);
    this.#disposeGlyphs(); this.renderer?.dispose();
  }

  /* ───── 渲染器 + bloom 管线 ───── */
  #initRenderer() {
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true, depth: false, stencil: false, premultipliedAlpha: true });
    } catch { return false; }
    const r = this.renderer;
    r.setClearColor(0, 0); r.autoClear = false; r.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    return true;
  }

  /* ───── 把当前词烘焙成「每字一个 mesh」 ───── */
  #showWord() {
    const word = this.words[this.index];
    this.sizer.textContent = word;
    this.host.setAttribute('aria-label', word);
    this.#disposeGlyphs();

    const cs = getComputedStyle(this.sizer);
    const box = this.sizer.getBoundingClientRect();
    const fontSize = parseFloat(cs.fontSize) || box.height;
    const lineH = parseFloat(cs.lineHeight) || box.height;
    const pr = Math.min(devicePixelRatio || 1, 3);
    const W = Math.ceil(box.width + PAD * 2), H = Math.ceil(box.height + PAD * 2);
    this.W = W; this.H = H; this.fontSize = fontSize;
    if (!this.host.style.width) this.host.style.width = box.width + 'px';   // 先固定一次宽度,之后的变化才有 CSS 过渡

    const r = this.renderer;
    r.setPixelRatio(pr); r.setSize(W, H, false);
    this.canvas.style.width = W + 'px'; this.canvas.style.height = H + 'px';
    this.camera = new THREE.OrthographicCamera(0, W, H, 0, -1, 1);   // 像素坐标,y 向上

    // 字符宽度:用前缀测量保留字距调整,再按 DOM 实际宽度缩放对齐
    const m = document.createElement('canvas').getContext('2d');
    m.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ('letterSpacing' in m && cs.letterSpacing !== 'normal') m.letterSpacing = cs.letterSpacing;
    const chars = Array.from(word);
    let prev = 0, acc = '';
    const adv = chars.map((c) => { acc += c; const w = m.measureText(acc).width; const a = Math.max(0, w - prev); prev = w; return a; });
    const k = box.width / (adv.reduce((s, v) => s + v, 0) || 1);
    const fm = m.measureText('Hg');
    const asc = fm.fontBoundingBoxAscent ?? fontSize * 0.8, desc = fm.fontBoundingBoxDescent ?? fontSize * 0.2;
    const textColor = new THREE.Color(this.baseGradient?.[0] ?? cs.color);
    const textColor2 = new THREE.Color(this.baseGradient?.[1] ?? this.baseGradient?.[0] ?? cs.color);
    const pal = this.palettes[this.index % this.palettes.length].stops.map((c) => new THREE.Vector3(...c));  // 每换一个词换一套配色

    let x = 0, n = 0;
    chars.forEach((ch, i) => {
      const a = adv[i] * k;
      if (ch.trim()) {
        const pw = Math.max(1, a + GLYPH_PAD * 2), ph = lineH + GLYPH_PAD * 2;
        const c = document.createElement('canvas');
        c.width = Math.ceil(pw * pr); c.height = Math.ceil(ph * pr);
        const g = c.getContext('2d');
        g.scale(pr, pr); g.font = m.font; g.fillStyle = '#fff'; g.textBaseline = 'alphabetic';
        g.fillText(ch, GLYPH_PAD, GLYPH_PAD + (lineH - asc - desc) / 2 + asc);
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.needsUpdate = true;

        const geo = new THREE.PlaneGeometry(pw, ph);
        const mat = new THREE.ShaderMaterial({
          vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthTest: false, depthWrite: false, premultipliedAlpha: true, toneMapped: false,
          uniforms: {
            uGlyphMap: { value: tex }, uPal: { value: pal }, uTextColor: { value: textColor.clone() }, uTextColor2: { value: textColor2.clone() }, uBaseOpacity: { value: this.baseOpacity },
            uOpacity: { value: 0 }, uShineStrength: { value: 0 },
            uPrimaryProgress: { value: 0 }, uSecondaryProgress: { value: 0 }, uSecondaryStrength: { value: 0 },
            uGlyphLeft: { value: PAD + x - GLYPH_PAD - PAD }, uGlyphWidth: { value: pw }, uWordWidth: { value: box.width }, uWordAspect: { value: box.width / ph },
          },
        });
        const mesh = new THREE.Mesh(geo, mat);
        const baseY = H - (PAD + box.height / 2);        // 单行:垂直居中
        mesh.position.set(PAD + x + a / 2, baseY, 0);
        this.scene.add(mesh);
        this.glyphs.push({ mesh, geo, mat, tex, baseY, delay: stagger(n++) });
      }
      x += a;
    });
    this.enterDur = Math.max(0, ...this.glyphs.map((g) => g.delay)) + ENTER_MS;
    this.exitDur = Math.max(0, ...this.glyphs.map((g) => g.delay)) + EXIT_MS;

    this.state = 'enter'; this.t0 = performance.now();
  }

  #disposeGlyphs() {
    for (const g of this.glyphs) { this.scene.remove(g.mesh); g.geo.dispose(); g.mat.dispose(); g.tex.dispose(); }
    this.glyphs = [];
  }

  /* ───── 主循环:enter → shine → hold → exit → 切词 ───── */
  #tick = (now) => {
    if (this.dead) return;
    this.raf = requestAnimationFrame(this.#tick);
    if (!this.visible || document.hidden || !this.glyphs.length) return;
    const t = now - this.t0;

    if (this.state === 'enter' || this.state === 'hold') {
      this.#frame('enter', t);
      if (t > this.enterDur + SHINE_MS - SHINE_OVERLAP + this.holdMs) { this.state = 'exit'; this.t0 = now; }
    } else if (this.state === 'exit') {
      this.#frame('exit', t);
      if (t > this.exitDur) {
        this.state = 'switching';
        this.index = (this.index + 1) % this.words.length;
        this.sizer.textContent = this.words[this.index];
        if (this.index === 0 && this.loopPause > 0) {
          // 一轮结束:槽位收起,回到只剩前文居中的「干净」状态,停留 loopPause 后再开始下一轮
          this.host.style.width = '0px';
          this.host.classList.add('shine-word--collapsed');
          setTimeout(() => {
            if (this.dead) return;
            this.host.style.width = this.sizer.getBoundingClientRect().width + 'px';
            this.host.classList.remove('shine-word--collapsed');
            setTimeout(() => !this.dead && this.#showWord(), 250);
          }, this.loopPause);
        } else {
          this.host.style.width = this.sizer.getBoundingClientRect().width + 'px';  // CSS transition 负责宽度过渡
          setTimeout(() => !this.dead && this.#showWord(), 250);
        }
      }
    }
  };

  #frame(phase, t) {
    // 扫光进度:主光环 + 延迟 320ms 的次光环
    const c = phase === 'enter' ? Math.max(0, t + SHINE_OVERLAP - this.enterDur) : 0;
    const shine = c > 0;
    const primary = cubicBezier(clamp01(c / SHINE_MS), 0.1, 0, 0.5, 1);
    const sp = clamp01((c - SECOND_DELAY) / SECOND_MS);
    const secondary = cubicBezier(sp, 0.1, 0, 0.5, 1), secondaryStrength = clamp01(sp / 0.1);
    const s = this.fontSize * RISE;

    for (const g of this.glyphs) {
      let o = 1, dy = 0;
      if (phase === 'exit') { const e = cubicBezier((t - g.delay) / EXIT_MS, 0.4, 0, 1, 1); o = 1 - e; dy = s * e; }
      else { const e = cubicBezier((t - g.delay) / ENTER_MS, 0, 0, 0.3, 1); o = e; dy = -s * (1 - e); }
      const u = g.mat.uniforms;
      g.mesh.position.y = g.baseY + dy;
      u.uOpacity.value = o; u.uShineStrength.value = shine ? 1 : 0;
      u.uPrimaryProgress.value = primary; u.uSecondaryProgress.value = secondary; u.uSecondaryStrength.value = secondaryStrength;
    }
    this.#render();
  }

  #render() {
    const r = this.renderer;
    r.setRenderTarget(null); r.clear(true, false, false);
    r.render(this.scene, this.camera);                      // 只画字形(扫光染色在片元着色器里),无外发光
  }
}
