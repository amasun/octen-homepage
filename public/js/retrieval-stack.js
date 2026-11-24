/**
 * Embedding 插画:Octen 始终居中不动,卡片背景点阵(.rs-art::before,16px 网格)持续从左向右流动;
 *  - 球周围 RIN 内的点按距离「放大 + 变深」(透镜,中性灰);点阵移动靠 --emb-ox 同步背景的 background-position,叠加圆跟着同一相位走;
 *  - 球不断向四周(16 个角度分区)伸出直线触手,抓住流过身边的点:触手端点跟着那个点一起向右漂,
 *    随机持有一小段时间或点漂出范围后松开,再抓别的点;端点带小圆点。
 * 持续循环(Loop 的 data-ms 设成很大,只在进入/离开视口时启停);prefers-reduced-motion 只画静态一帧。
 */
(function () {
  'use strict';
  var art = document.querySelector('.rs-art--embed');
  if (!art) return;
  var svg = art.querySelector('.emb-svg'), hub = art.querySelector('.emb-hub'), tent = art.querySelector('.emb-tent'), grab = art.querySelector('.emb-grab');
  if (!svg || !hub || !tent || !grab) return;
  var NS = 'http://www.w3.org/2000/svg', VW = 600, HX = 300, HY = 84, R = 28, RIN = 104, FADE_START = 125, FADE_END = 225, NB = 16, GRID = 16, SPEED = 44;
  var rows = [], pool = [], bins = [], scale = 1, ox = 0, ncol = 0, TWO_PI = Math.PI * 2;
  var NOEL = { setAttribute: function () {} };
  function mk(tag, parent) { var e = document.createElementNS(NS, tag); parent.appendChild(e); return e; }
  for (var b = 0; b < NB; b++) bins.push({ line: mk('line', tent), cap: mk('circle', tent), w: 0, r: -1, a: 0, hold: 0, ex: HX, ey: HY });
  bins.forEach(function (s) { s.cap.setAttribute('r', 2.6); s.cap.setAttribute('fill', '#a1a1aa'); s.cap.setAttribute('stroke', 'none'); s.line.style.opacity = 0; s.cap.style.opacity = 0; });
  tent.setAttribute('stroke', '#a1a1aa'); tent.setAttribute('stroke-width', '0.85');
  hub.setAttribute('transform', 'translate(' + HX + ' ' + HY + ')');

  // 背景点阵每格中心在 (GRID/2 + GRID*w + S, GRID/2 + GRID*row)(CSS px,相对 .rs-art);换算成 SVG 坐标
  function measure() {
    var ar = art.getBoundingClientRect(), sr = svg.getBoundingClientRect();
    scale = sr.width / VW || 1; ox = (ar.left - sr.left) / scale;
    var oy = (ar.top - sr.top) / scale; rows = [];
    for (var gy = GRID / 2; gy < ar.height; gy += GRID) { var y = oy + gy / scale; if (y > 2 && y < 166) rows.push(y); }
    ncol = Math.ceil((2 * RIN + 4 * GRID) / (GRID / scale)) + 2;
    while (grab.firstChild) grab.removeChild(grab.firstChild);
    pool = [];
    for (var j = 0; j < ncol; j++) for (var r = 0; r < rows.length; r++) pool.push({ el: NOEL, j: j, row: r });   // 不再叠加放大的圆:所有点保持背景原样,只有被触手抓住的点显示端点圆
  }
  function xs(w, S) { return ox + (GRID / 2 + GRID * w + S) / scale; }
  function shade(f) { var v = Math.round(207 - 112 * f); return 'rgb(' + v + ',' + v + ',' + v + ')'; }

  function frame(t, dt) {
    var S = SPEED * t / 1000;
    art.style.setProperty('--emb-ox', (S % GRID).toFixed(2) + 'px');
    var hubArt = (HX - ox) * scale, wBase = Math.floor((hubArt - (RIN + 2 * GRID / scale * 0) * scale - 2 * GRID - GRID / 2 - S) / GRID);
    var cand = []; for (var q = 0; q < NB; q++) cand.push([]);
    var held = {};
    bins.forEach(function (s) { if (s.a > 0.02) held[s.w + ',' + s.r] = true; });
    pool.forEach(function (d) {
      var w = wBase + d.j, x = xs(w, S), y = rows[d.row], dx = x - HX, dy = y - HY, dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < RIN) {
        var f = Math.max(0, 1 - Math.max(dist - R, 0) / (RIN - R)); f = f * f * (3 - 2 * f);
        f *= Math.max(0, Math.min(1, (2 - dy) / 10));   // 球心以下的点不放大(球心附近 10px 内平滑过渡)
        if (f < 0.03) d.el.setAttribute('r', 0);        // 不放大的点不叠加,直接露出背景里原来的点
        else { d.el.setAttribute('cx', x.toFixed(1)); d.el.setAttribute('cy', y.toFixed(1));
          d.el.setAttribute('r', (1.3 + 3.2 * f).toFixed(2)); d.el.setAttribute('fill', shade(f)); }
      } else d.el.setAttribute('r', 0);
      if (dist > RIN - 16 && dist < RIN + 4 && !held[w + ',' + d.row]) {
        var ang = Math.atan2(dy, dx) + Math.PI, bi = Math.floor(ang / (TWO_PI / NB)) % NB;
        cand[bi].push({ w: w, r: d.row });
      }
    });
    var k = 1 - Math.exp(-dt / 65);
    bins.forEach(function (s, bi) {
      var distFade = 1;
      if (s.a > 0.02 || s.hold > 0) {
        var x = xs(s.w, S), y = rows[s.r];
        if (y === undefined) {
          s.hold = 0; s.a = 0; s.line.style.opacity = 0; s.cap.style.opacity = 0;
          return;
        }
        var dx = x - HX, dy = y - HY, dist = Math.sqrt(dx * dx + dy * dy);
        s.hold -= dt;
        s.ex = x; s.ey = y;
        if (dist >= FADE_END) {               // 线已随点拉长到完全淡出:这时才松开,并稍等再抓新的点
          s.hold = 0; s.a = 0; s.cool = 150 + Math.random() * 350; s.line.style.opacity = 0; s.cap.style.opacity = 0;
          return;
        }
        if (dist > FADE_START) {
          var u = (dist - FADE_START) / (FADE_END - FADE_START);
          distFade = 1 - u * u * (3 - 2 * u);
        }
        // 不再按计时松手:触手一直连着这个点,点随点阵右移时线跟着拉长并按距离渐隐(distFade),
        // 只有点漂进球体附近才淡出松开。端点始终 = 点阵里那个点的真实位置,不做任何截断。
        if (dist < R + 14) { s.hold = 0; s.a += (0 - s.a) * k; if (s.a < 0.03) s.cool = 150 + Math.random() * 350; }
        else { s.hold = 1; s.a += (1 - s.a) * k; }
      } else if ((s.cool = (s.cool || 0) - dt) <= 0 && cand[bi].length && Math.random() < dt / 110) {      // 空闲的触手:随机抓一个流过的点
        var c = cand[bi][Math.floor(Math.random() * cand[bi].length)];
        s.w = c.w; s.r = c.r; s.hold = 700 + Math.random() * 1100; s.a = 0.05; s.ex = xs(c.w, S); s.ey = rows[c.r];
        var cdx = s.ex - HX, cdy = s.ey - HY, cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cdist > FADE_START) {
          var cu = Math.min(1, (cdist - FADE_START) / (FADE_END - FADE_START));
          distFade = 1 - cu * cu * (3 - 2 * cu);
        }
      }
      var vis = s.a * distFade;
      if (vis < 0.02) { s.line.style.opacity = 0; s.cap.style.opacity = 0; if (s.hold <= 0 && s.a < 0.03) s.a = 0; return; }
      var ddx = s.ex - HX, ddy = s.ey - HY, len = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
      s.line.setAttribute('x1', (HX + ddx / len * R).toFixed(1)); s.line.setAttribute('y1', (HY + ddy / len * R).toFixed(1));
      s.line.setAttribute('x2', s.ex.toFixed(1)); s.line.setAttribute('y2', s.ey.toFixed(1));
      s.cap.setAttribute('cx', s.ex.toFixed(1)); s.cap.setAttribute('cy', s.ey.toFixed(1));
      s.line.style.opacity = vis * 0.55; s.cap.style.opacity = vis * 0.65;
    });
  }
  function reset() {
    pool.forEach(function (d) { d.el.setAttribute('r', 0); });
    bins.forEach(function (s) { s.a = 0; s.hold = 0; s.line.style.opacity = 0; s.cap.style.opacity = 0; });
    art.style.setProperty('--emb-ox', '0px');
  }
  function handleResize() {
    measure();
    bins.forEach(function (s) { s.a = 0; s.hold = 0; s.line.style.opacity = 0; s.cap.style.opacity = 0; });
  }
  window.addEventListener('resize', handleResize);
  if (typeof ResizeObserver === 'function') {
    var ro = new ResizeObserver(handleResize);
    ro.observe(art);
    ro.observe(svg);
  }

  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    measure(); for (var z = 0; z < 40; z++) frame(1200, 40); return;
  }
  var start = 0, running = false, last = 0;
  function tick(now) {
    var on = art.classList.contains('rs-run');
    if (on && !running) { running = true; start = now; last = now; measure(); reset(); }
    if (!on && running) { running = false; reset(); }
    if (running) { frame(now - start, Math.min(now - last, 64)); last = now; }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/**
 * Retrieval Stack bento 插画动画控制器
 * 每个 .rs-art 是一个独立循环:进入视口(35%)→ 加 .rs-run 播放一轮(默认 9s)→ 加 .rs-out 淡出 → 重启;
 * 离开视口暂停并清空;prefers-reduced-motion 时不启用(CSS 直接显示最终静态画面)。
 */
(function () {
  'use strict';
  var bento = document.getElementById('rsBento');
  if (!bento) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  bento.classList.add('rs-js');   // 启用「未播放时隐藏」规则;无 JS 时保持静态完整画面

  function Loop(art) {
    this.art = art; this.ms = +art.getAttribute('data-ms') || 9000; this.timer = null; this.on = false;
  }
  Loop.prototype.start = function () {
    var self = this, art = this.art;
    if (this.on) return;
    this.on = true;
    (function run() {
      art.classList.remove('rs-out', 'rs-run');
      void art.offsetWidth;                       // 强制重排,让动画从头开始
      art.classList.add('rs-run');
      self.timer = setTimeout(function () {
        art.classList.add('rs-out');
        self.timer = setTimeout(function () { if (self.on) run(); }, 600);
      }, self.ms);
    })();
  };
  Loop.prototype.stop = function () {
    this.on = false; clearTimeout(this.timer);
    this.art.classList.remove('rs-run', 'rs-out');
  };

  var loops = Array.prototype.map.call(bento.querySelectorAll('.rs-art'), function (a) { return new Loop(a); });
  if (typeof IntersectionObserver !== 'function') { loops.forEach(function (l) { l.start(); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var loop = loops.filter(function (l) { return l.art === e.target; })[0];
      if (!loop) return;
      e.isIntersecting ? loop.start() : loop.stop();
    });
  }, { threshold: 0.35 });
  loops.forEach(function (l) { io.observe(l.art); });
})();
