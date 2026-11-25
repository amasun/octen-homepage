/* Get started 灰底白点阵:随机挑点,以绿色四角星形闪现(淡入放大 → 淡出),任意时刻最多 6 颗。
   点阵与 CSS 背景(20px 网格,center top)对齐;只在区块进入视口时运行;prefers-reduced-motion 下不启动。 */
(function () {
  var section = document.getElementById('get-started');
  if (!section || section.dataset.gsDots) return;
  section.dataset.gsDots = '1';
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var STEP = 20;           // 与 .gs-section 背景点阵间距一致
  var MAX_STARS = 6;       // 同时最多 6 颗星
  var canvas = document.createElement('canvas');
  canvas.className = 'gs-dots-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  section.insertBefore(canvas, section.firstChild);
  var ctx = canvas.getContext('2d');

  var W = 0, H = 0, dpr = 1, cols = 0, rows = 0, x0 = 0, cap = 0;
  var active = [];
  var running = false, raf = 0, inView = true;

  function resize() {
    var r = section.getBoundingClientRect();
    W = Math.round(r.width); H = Math.round(r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    x0 = ((W - STEP) / 2) % STEP;          // background-position: center → 第一列点的 x 偏移
    if (x0 < 0) x0 += STEP;
    cols = Math.floor((W - x0) / STEP);
    rows = Math.floor(H / STEP);
    cap = MAX_STARS;
    active = [];
    refreshBlocked();
  }

  // 星只出现在没有被卡片 / 标题文字盖住的点位上(否则落在白色卡片后面就看不见)
  function blockedRects() {
    var sr = section.getBoundingClientRect();
    var list = section.querySelectorAll('.gs-step-card, .gs-integrations, .gs-title, .gs-subtitle, .start-building-tag');
    return Array.prototype.map.call(list, function (el) {
      var r = el.getBoundingClientRect();
      return { l: r.left - sr.left - 14, r: r.right - sr.left + 14, t: r.top - sr.top - 14, b: r.bottom - sr.top + 14 };
    });
  }
  var blocked = [];
  function refreshBlocked() { blocked = blockedRects(); }
  function isBlocked(cx, cy) {
    for (var k = 0; k < blocked.length; k++) {
      var b = blocked[k];
      if (cx > b.l && cx < b.r && cy > b.t && cy < b.b) return true;
    }
    return false;
  }

  function spawn(now) {
    for (var tries = 0; tries < 30; tries++) {
      var i = Math.floor(Math.random() * cols * rows);
      var cx = x0 + (i % cols) * STEP + STEP / 2;
      var cy = Math.floor(i / cols) * STEP + STEP / 2;
      if (isBlocked(cx, cy)) continue;
      var dup = false;
      for (var k = 0; k < active.length; k++) if (active[k].i === i) { dup = true; break; }
      if (dup) continue;
      active.push({ i: i, t0: now, dur: 2200 + Math.random() * 1800 });
      return;
    }
  }

  // 四角星:使用设计提供的 SVG 路径(viewBox 100×100),按半径缩放后绘制,颜色为主题黄绿渐变
  var STAR = new Path2D('M45.2498 3.30426C46.8576 -1.15534 53.1898 -1.0827 54.6948 3.41261L59.8 18.6609C63.1875 28.779 71.1285 36.72 81.2466 40.1076L96.4949 45.2127C100.99 46.7177 101.063 53.0499 96.6033 54.6577L80.5074 60.4605C70.8164 63.9543 63.2319 71.6535 59.8841 81.3959L54.6826 96.5325C53.1552 100.977 46.8957 101.05 45.2647 96.6427L39.3465 80.6488C35.9028 71.3423 28.5652 64.0048 19.2587 60.5611L3.26484 54.6428C-1.14281 53.0118 -1.06954 46.7523 3.37508 45.2249L18.5116 40.0234C28.254 36.6756 35.9532 29.0912 39.447 19.4001L45.2498 3.30426Z');
  function star(cx, cy, r, alpha) {
    var k = (r * 2) / 100;
    ctx.save();
    ctx.translate(cx - r, cy - r);
    ctx.scale(k, k);
    var g = ctx.createLinearGradient(15, 10, 85, 90);   // 主题黄绿渐变(同 Freshness 时间轴):黄绿 → 绿
    g.addColorStop(0, '#C9D97A');
    g.addColorStop(0.5, '#82C984');
    g.addColorStop(1, '#3AB870');
    ctx.globalAlpha = 0.95 * alpha;
    ctx.fillStyle = g;
    ctx.fill(STAR);
    ctx.restore();
  }

  var lastRefresh = 0;
  function frame(now) {
    if (!running) return;
    if (now - lastRefresh > 1500) { lastRefresh = now; refreshBlocked(); }
    ctx.clearRect(0, 0, W, H);
    // 补星:总数不超过 6 颗,随机错开出现(不一定总是 3 颗)
    if (active.length < cap && Math.random() < 0.035) spawn(now);
    for (var n = active.length - 1; n >= 0; n--) {
      var d = active[n];
      var p = (now - d.t0) / d.dur;
      if (p >= 1) { active.splice(n, 1); continue; }
      var a = Math.sin(p * Math.PI);                 // 渐亮 → 渐灭
      var cx = x0 + (d.i % cols) * STEP + STEP / 2;
      var cy = Math.floor(d.i / cols) * STEP + STEP / 2;
      star(cx, cy, 1.5 + 4 * a, a);   // 半径 1.5~5.5px(直径最大 11px)
    }
    raf = requestAnimationFrame(frame);
  }

  function start() { if (running) return; running = true; raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(section);
  else window.addEventListener('resize', resize, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { inView = es[0].isIntersecting; inView && !document.hidden ? start() : stop(); }, { threshold: 0 }).observe(section);
  } else start();
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (inView) start(); });
})();
