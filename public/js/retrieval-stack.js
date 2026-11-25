/**
 * Embedding 插画:Octen 始终居中不动,卡片背景点阵(.rs-art::before,16px 网格)持续从左向右流动;
 *  - 球周围 RIN 内的点按距离「放大 + 变深」(透镜,中性灰);点阵移动靠 --emb-ox 同步背景的 background-position,叠加圆跟着同一相位走;
 *  - 球不断向四周(8 个角度分区,即 8 根触手)伸出直线触手,抓住流过身边的点:触手端点跟着那个点一起向右漂,
 *    点偏离 RIN 环超过 BAND_IN 开始按距离渐隐、到 BAND_OUT 松开(内外对称,左右线长均衡),另有寿命 LIFE 兜底;端点带小圆点。
 * 持续循环(Loop 的 data-ms 设成很大,只在进入/离开视口时启停);prefers-reduced-motion 只画静态一帧。
 */
(function () {
  'use strict';
  var art = document.querySelector('.rs-art--embed');
  if (!art) return;
  var svg = art.querySelector('.emb-svg'), hub = art.querySelector('.emb-hub'), tent = art.querySelector('.emb-tent'), grab = art.querySelector('.emb-grab');
  if (!svg || !hub || !tent || !grab) return;
  var NS = 'http://www.w3.org/2000/svg', VW = 600, HX = 300, HY = 84, R = 28, RIN = 104, BAND_IN = 14, BAND_OUT = 30, LIFE = 500, NB = 8, GRID = 16, SPEED = 44;
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
      // 抓点范围放宽到 RIN 环附近一整圈带子里随机取点(连接点位置更随机):右半边的点向外漂、左半边向内漂,
      // 窗口按运动方向错开(右 RIN-40..RIN+12,左 RIN-12..RIN+40),线在寿命内漂移后两侧平均线长仍对称。
      var off = dist - RIN;
      var ok = dx > 0 ? (off > -40 && off < 12) : (off > -12 && off < 40);
      if (ok && !held[w + ',' + d.row]) {
        var ang = Math.atan2(dy, dx) + Math.PI, bi = Math.floor(ang / (TWO_PI / NB)) % NB;
        cand[bi].push({ w: w, r: d.row });
      }
    });
    var k = 1 - Math.exp(-dt / 30);
    // 对称释放带:触手端点始终 = 点阵里那个点的真实位置(不截断、不回跳);线长 |dist - RIN| 偏离 BAND_IN 后按距离渐隐,
    // 到 BAND_OUT 完全消失才松开。右侧点向外漂(线变长)、左侧点向内漂(线变短)用同一个带宽 → 左右线长基本对称(约 RIN±30)。
    // 上下方的点几乎沿切向移动、距离变化慢,另加寿命 LIFE:到时用透明度淡出再松开,保证各方向都在持续更替。
    // 每条线有自己的中心半径 s.c(= 抓点时的距离沿运动方向再前移 16px),渐隐带围绕 s.c 计算 → 各条线在不同半径上出现 / 消失
    function bandFade(dist, c) {
      var o = Math.abs(dist - c);
      if (o <= BAND_IN) return 1;
      if (o >= BAND_OUT) return 0;
      var u = (o - BAND_IN) / (BAND_OUT - BAND_IN);
      return 1 - u * u * (3 - 2 * u);
    }
    bins.forEach(function (s, bi) {
      var distFade = 1;
      if (s.a > 0.02 || s.hold > 0) {
        var x = xs(s.w, S), y = rows[s.r];
        if (y === undefined) {
          s.hold = 0; s.a = 0; s.line.style.opacity = 0; s.cap.style.opacity = 0;
          return;
        }
        var dx = x - HX, dy = y - HY, dist = Math.sqrt(dx * dx + dy * dy);
        s.ex = x; s.ey = y;
        distFade = bandFade(dist, s.c);
        s.life = (s.life || 0) + dt;
        if (distFade <= 0) {                    // 漂出释放带:线已渐隐完,松开并稍等再抓新的点
          s.hold = 0; s.a = 0; s.cool = Math.random() * 40; s.line.style.opacity = 0; s.cap.style.opacity = 0;
          return;
        }
        if (s.life > s.maxLife || dist < R + 14) {   // 寿命到 / 太靠近球:透明度淡出后松开
          s.hold = 0; s.a += (0 - s.a) * k;
          if (s.a < 0.03) { s.a = 0; s.cool = Math.random() * 40; }
        } else { s.hold = 1; s.a += (1 - s.a) * k; }
      } else if ((s.cool = (s.cool || 0) - dt) <= 0 && Math.random() < dt / 10 &&
                 (cand[bi].length || cand[(bi + 1) % NB].length || cand[(bi + NB - 1) % NB].length)) {
        // 本分区没有可抓的点(卡片高度有限,左上 / 左下外环常被裁掉)时向相邻分区借一个,保证 8 根触手一直在工作
        var pickFrom = cand[bi].length ? cand[bi] : (cand[(bi + 1) % NB].length ? cand[(bi + 1) % NB] : cand[(bi + NB - 1) % NB]);      // 空闲的触手:在 RIN 环附近的带子里随机抓一个点
        var c = pickFrom.splice(Math.floor(Math.random() * pickFrom.length), 1)[0];   // 取出,避免两根触手同帧抓同一个点
        s.w = c.w; s.r = c.r; s.hold = 1; s.a = 0.05; s.life = 0; s.maxLife = LIFE * (0.7 + Math.random() * 0.6);
        s.ex = xs(c.w, S); s.ey = rows[c.r];
        var cdx = s.ex - HX, cdy = s.ey - HY, cd = Math.sqrt(cdx * cdx + cdy * cdy);
        s.c = cd + (cdx > 0 ? 16 : -16);        // 右侧向外漂 → 中心在外;左侧向内漂 → 中心在内
        distFade = bandFade(cd, s.c);
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
  var start = 0, running = false, last = 0, rafId = 0;
  function tick(now) {
    rafId = 0;
    if (!art.classList.contains('rs-run') || document.hidden) {
      if (!art.classList.contains('rs-run') && running) { running = false; reset(); }
      return;
    }
    if (!running) { running = true; start = now; last = now; measure(); reset(); }
    frame(now - start, Math.min(now - last, 64));
    last = now;
    rafId = requestAnimationFrame(tick);
  }
  function syncRaf() {
    var shouldRun = art.classList.contains('rs-run') && !document.hidden;
    if (shouldRun) {
      if (!rafId) rafId = requestAnimationFrame(tick);
    } else {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      if (!art.classList.contains('rs-run') && running) { running = false; reset(); }
    }
  }
  if (typeof MutationObserver === 'function') {
    new MutationObserver(syncRaf).observe(art, { attributes: true, attributeFilter: ['class'] });
  }
  document.addEventListener('visibilitychange', syncRaf);
  syncRaf();
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
    this.art = art; this.ms = +art.getAttribute('data-ms') || 9000; this.timer = null; this.on = false; this.inView = false;
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
  if (typeof IntersectionObserver !== 'function') { loops.forEach(function (l) { l.inView = true; l.start(); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var loop = loops.filter(function (l) { return l.art === e.target; })[0];
      if (!loop) return;
      loop.inView = e.isIntersecting;
      (e.isIntersecting && !document.hidden) ? loop.start() : loop.stop();
    });
  }, { threshold: 0.35 });
  loops.forEach(function (l) { io.observe(l.art); });
  document.addEventListener('visibilitychange', function () {
    loops.forEach(function (l) {
      if (document.hidden) l.stop();
      else if (l.inView) l.start();
    });
  });
})();

/**
 * Monitor 左侧多网址最低价轮动激活 + 右侧商品卡 NumberFlow 同步跟价
 */
(function () {
  'use strict';
  var mon = document.querySelector('.rs-art--mon');
  var flow = mon ? mon.querySelector('[data-mon-price]') : null;
  if (!mon || !flow || typeof customElements === 'undefined') return;

  var rows = Array.prototype.slice.call(mon.querySelectorAll('[data-mon-row]'));
  var vals = rows.map(function (r) { return r.querySelector('[data-mon-val]'); });
  var bridge = mon.querySelector('.rs-mon-bridge');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var PRICE_TICKS = [
    [49, 53, 55],
    [51, 44, 52],
    [48, 46, 39],
    [37, 45, 42],
    [43, 35, 41],
    [46, 40, 38],
    [41, 44, 47],
    [45, 42, 49]
  ];

  var definedPromise = customElements.get('number-flow')
    ? Promise.resolve()
    : customElements.whenDefined('number-flow');
  var pluginPromise = window.NumberFlowContinuous
    ? Promise.resolve()
    : new Promise(function (resolve) {
        window.addEventListener('numberflow-ready', resolve, { once: true });
      });

  Promise.all([definedPromise, pluginPromise]).then(function () {
    var plugins = window.NumberFlowContinuous ? [window.NumberFlowContinuous] : [];
    vals.forEach(function (v) {
      if (!v) return;
      v.plugins = plugins;
      v.spinTiming = { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };
      v.transformTiming = { duration: 380, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };
      v.opacityTiming = { duration: 200, easing: 'ease-out' };
    });

    flow.plugins = plugins;
    flow.spinTiming = { duration: 680, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };
    flow.transformTiming = { duration: 460, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };
    flow.opacityTiming = { duration: 240, easing: 'ease-out' };

    var tickIdx = 0;
    var prevPrices = PRICE_TICKS[0].slice();
    var prevBest = Math.min.apply(null, prevPrices);
    var loopTimer = null;
    var activeTimer = null;
    var priceTimer = null;

    function findMinIndex(prices) {
      var minIdx = 0;
      for (var i = 1; i < prices.length; i++) {
        if (prices[i] < prices[minIdx]) minIdx = i;
      }
      return minIdx;
    }

    function applyTick(prices, animate) {
      var minIdx = findMinIndex(prices);
      var minPrice = prices[minIdx];

      vals.forEach(function (v, i) {
        if (!v || typeof v.update !== 'function') return;
        v.trend = prices[i] < prevPrices[i] ? -1 : 1;
        v.animated = !!animate;
        v.update(prices[i]);
      });
      prevPrices = prices.slice();

      clearTimeout(activeTimer);
      clearTimeout(priceTimer);

      if (animate) {
        activeTimer = setTimeout(function () {
          rows.forEach(function (r, i) { r.classList.toggle('is-active', i === minIdx); });
          if (bridge) {
            bridge.classList.remove('is-pulsing');
            void bridge.offsetWidth;
            bridge.classList.add('is-pulsing');
          }
        }, 140);

        var dir = minPrice < prevBest ? -1 : 1;
        prevBest = minPrice;
        priceTimer = setTimeout(function () {
          flow.trend = dir;
          flow.animated = true;
          flow.update(minPrice);
        }, 260);
      } else {
        rows.forEach(function (r, i) { r.classList.toggle('is-active', i === minIdx); });
        prevBest = minPrice;
        flow.animated = false;
        flow.update(minPrice);
      }
    }

    if (reduce) {
      applyTick(PRICE_TICKS[1], false);
      return;
    }

    function startCycle() {
      if (loopTimer) return;
      tickIdx = 0;
      applyTick(PRICE_TICKS[0], false);
      loopTimer = setInterval(function () {
        tickIdx = (tickIdx + 1) % PRICE_TICKS.length;
        applyTick(PRICE_TICKS[tickIdx], true);
      }, 2100);
    }

    function stopCycle() {
      if (loopTimer) { clearInterval(loopTimer); loopTimer = null; }
      clearTimeout(activeTimer);
      clearTimeout(priceTimer);
      if (bridge) bridge.classList.remove('is-pulsing');
    }

    function sync() {
      if (mon.classList.contains('rs-run')) startCycle();
      else stopCycle();
    }

    if (typeof MutationObserver === 'function') {
      new MutationObserver(sync).observe(mon, { attributes: true, attributeFilter: ['class'] });
    }
    sync();
  });
})();
