/**
 * Hero 底部绿色光晕上的「真实动态 ASCII」叠加层(替代原静态 multimodal-ascii.png)
 * 字符集取自 Hacker / Signal / Symbols(. : ; - = + x * O X # ○ ◇ ✦ × Δ),保留四角星 ✦;越靠底部越密越亮,向上逐渐稀疏变暗;最亮处压暗为绿色(不用白色)。
 * 动效:以光晕底部正中为圆心向外扩散的涟漪(横向拉宽的椭圆环,环越往外越弱),环峰处字符更密更亮;
 *       字符集里随机混入 o c t e n 五个字母(品牌名);字符按各自的随机节奏慢速闪烁。
 * 实现:Canvas 2D;约 24fps,离开视口/标签页隐藏时暂停;prefers-reduced-motion 时只绘制一帧。
 */
(function () {
  'use strict';

  var host = document.querySelector('#web-search .hero-bottom-glow__inner, .hero-bottom-glow__inner');
  if (!host) return;

  // 字符集取自 Hacker / Signal / Symbols 三套:
  //   Hacker  — . + * x O X #      Signal — . : ; - = + x      Symbols — . : ○ ◇ ✦ × Δ
  var RAMP = ['.', ':', ';', '-', '=', '+', 'x', '*', 'O', 'X', '#'];   // 密度由疏到密(Hacker + Signal)
  var SYMBOLS = ['✦', '✦', '✦', '○', '◇', '×', 'Δ'];                  // Symbols 点缀;✦(四角星)权重最高
  var SYMBOL_P = 0.16;                                                  // 每个出现的字符里,有多少概率换成符号
  var FONT = "'DM Mono', ui-monospace, Menlo, 'Apple Symbols', 'Segoe UI Symbol', Consolas, monospace";
  var FPS = 24;
  var IMG_ASPECT = 2110 / 3840;     // 原 PNG 宽高比:亮度轮廓按它的高度折算,保证与原图分布一致
  var VISIBLE = 0.72;               // 字符分布高度占(原图)图高的比例,自底部起;0.36 是原图,加大 → 整体更高
  var STOPS = [[30, 105, 46], [78, 200, 66], [118, 235, 84]];   // 暗绿 → 中绿 → 最亮处也保持绿色(不再到白)
  var BUCKETS = 10;
  var BRAND = 'octen';              // 随机混入的品牌字母
  var BRAND_P = 0.2;                // 每个出现的字符里,有多少概率换成品牌字母
  var WAVE_LEN = 240;               // 涟漪波长(px,按 1429px 宽基准,随宽度缩放);越大环越宽
  var WAVE_SPEED = 0.26;            // 扩散速度:每秒前进的波长数
  var WAVE_STRETCH = 0.5;           // 水平距离折算系数(<1 → 环在横向拉得更宽)

  var canvas = document.createElement('canvas');
  canvas.className = 'hero-ascii';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var colors = [];
  for (var b = 0; b < BUCKETS; b++) {
    var t = b / (BUCKETS - 1), a, c;
    if (t < 0.55) { a = t / 0.55; c = lerp3(STOPS[0], STOPS[1], a); }
    else { a = (t - 0.55) / 0.45; c = lerp3(STOPS[1], STOPS[2], a); }
    colors.push('rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (0.32 + 0.48 * t).toFixed(2) + ')');
  }
  function lerp3(p, q, k) { return [Math.round(p[0] + (q[0] - p[0]) * k), Math.round(p[1] + (q[1] - p[1]) * k), Math.round(p[2] + (q[2] - p[2]) * k)]; }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  /* 整数哈希 → [0,1) 与双线性值噪声 */
  function hash(i, j, k) {
    var h = (i * 374761393 + j * 668265263 + k * 2147483647) | 0;
    h = (h ^ (h >>> 13)) * 1274126177 | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function noise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = hash(xi, yi, 7), b = hash(xi + 1, yi, 7), c = hash(xi, yi + 1, 7), d = hash(xi + 1, yi + 1, 7);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, cw = 0, rh = 0, cols = 0, rows = 0, originX = 0, originY = 0, wl = WAVE_LEN;

  function resize() {
    var w = host.clientWidth;
    if (!w) return;
    W = w;
    H = Math.round(w * 0.5);                        // 需覆盖字符分布区(自底部起 VISIBLE × 图高)
    rh = clamp(w * 0.0068, 8, 12);                  // 行高:1429px 宽 ≈ 9.7px(比之前缩小约 22%)
    cw = rh * 0.6;
    wl = WAVE_LEN * (w / 1429);
    cols = Math.ceil(W / cw);
    rows = Math.ceil(H / rh);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = rh + 'px ' + FONT;
    ctx.textBaseline = 'top';
    // 涟漪圆心:可见区域(光晕容器)的底部正中——画布被整体下移裁切了一部分,需把圆心放回容器底边
    var off = canvas.getBoundingClientRect().bottom - host.getBoundingClientRect().bottom;
    originX = W / 2;
    originY = H - Math.max(0, off);
    draw(performance.now());
  }

  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    var tt = now / 1000, imgH = W * IMG_ASPECT;
    var buckets = [];
    for (var k = 0; k < BUCKETS; k++) buckets.push([]);

    for (var r = 0; r < rows; r++) {
      var y = r * rh;
      var dist = H - (y + rh);                       // 距画布底部
      var base = 1 - (dist / imgH) / VISIBLE;        // 底部 1 → 分布区顶部 0
      if (base <= 0) continue;
      base = Math.pow(base, 0.85);
      for (var c = 0; c < cols; c++) {
        // 涟漪:到圆心的(横向压缩)距离 → 随时间向外推进的余弦环;外圈衰减;叠一点噪声避免过于规整
        var dx = (c * cw - originX) * WAVE_STRETCH, dy = y - originY;
        var d = Math.sqrt(dx * dx + dy * dy);
        var ring = 0.5 + 0.5 * Math.cos(6.2831853 * (d / wl - tt * WAVE_SPEED));
        ring = ring * ring;                          // 次方越小环越粗
        var atten = Math.exp(-d / (W * 0.75));
        var jitter = noise(c * 0.2 + tt * 0.3, r * 0.3 - tt * 0.4);
        var v = base * (0.16 + 1.15 * ring * atten + 0.3 * jitter * atten);
        if (v < 0.04) continue;
        // 每个格子按自己的节奏慢速开关,形成字符闪烁
        var slot = Math.floor(tt * (1.5 + hash(c, r, 1) * 3) + hash(c, r, 2) * 10);
        if (hash(c, r, slot) > v * v * 1.5) continue;
        var ch;
        if (hash(c, r, slot + 7) < BRAND_P) ch = BRAND.charAt(Math.floor(hash(c, r, slot + 13) * BRAND.length));   // 随机出现 o c t e n
        else if (hash(c, r, slot + 31) < SYMBOL_P) ch = SYMBOLS[Math.floor(hash(c, r, slot + 57) * SYMBOLS.length)];   // ✦ ○ ◇ × Δ
        else ch = RAMP[clamp(Math.floor(v * RAMP.length * 0.95 + (hash(c, r, slot + 99) - 0.5) * 3), 0, RAMP.length - 1)];
        var bi = clamp(Math.floor(v * (BUCKETS - 1) + 0.35), 0, BUCKETS - 1);
        buckets[bi].push(ch, c * cw, y);
      }
    }
    for (var m = 0; m < BUCKETS; m++) {
      var list = buckets[m];
      if (!list.length) continue;
      ctx.fillStyle = colors[m];
      for (var i = 0; i < list.length; i += 3) ctx.fillText(list[i], list[i + 1], list[i + 2]);
    }
  }

  /* ---------- 调度 ---------- */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visible = true, last = 0, raf = 0;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    if (now - last < 1000 / FPS) return;
    last = now;
    draw(now);
  }

  if (typeof ResizeObserver === 'function') new ResizeObserver(resize).observe(host);
  else window.addEventListener('resize', resize);
  resize();

  if (!reduce) {
    if (typeof IntersectionObserver === 'function') new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(host);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);
    raf = requestAnimationFrame(loop);
  }
})();
