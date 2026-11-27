/* Octen Search → three tiers(src/sections/03b-search-tiers.html)
   1. 概览按钮 hover / focus → 高亮下方对应卡片;≤1024px 点击平滑滚动到该卡片
   2. 进入视口时给 section 加 .is-inview,驱动 Pulse 光点动画
   3. Premier Bento 的搜索框轮流输入 News / Business / Place 示例查询,对应卡片加 .is-hl(触发与悬停相同的动效)
   4. Fast API 卡片进入视口后轮流高亮(.is-hl),悬停暂停
   其余悬停动效为纯 CSS(octen-tiers.css「Premier Bento」、fast-bento.css) */
(function () {
  var root = document.getElementById('search-tiers');
  if (!root) return;
  var wrap = root.querySelector('#stTiers');
  var ovs = root.querySelectorAll('.st-ov');

  function setActive(t) {
    wrap.setAttribute('data-active', t || '');
    ovs.forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-tier') === t); });
  }
  ovs.forEach(function (b) {
    var t = b.getAttribute('data-tier');
    b.addEventListener('mouseenter', function () { setActive(t); });
    b.addEventListener('focus', function () { setActive(t); });
    b.addEventListener('mouseleave', function () { setActive(''); });
    b.addEventListener('blur', function () { setActive(''); });
    b.addEventListener('click', function () {
      setActive(t);
      var card = document.getElementById('tier-' + t);
      if (card) card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ---------- Premier 搜索框:轮流输入三类示例查询,对应卡片同步高亮(.is-hl) ---------- */
  var QUERIES = [
    { dom: 'news', chip: 'News', q: 'port strike latest' },
    { dom: 'web', chip: 'Web Search Premier', q: 'northwind q4 stock price' },
    { dom: 'business', chip: 'Business', q: 'northwind robotics' },
    { dom: 'place', chip: 'Place', q: 'coffee near harbor st' }
  ];
  var qEl = root.querySelector('[data-q]');
  var chipEl = root.querySelector('[data-chip]');
  var cards = root.querySelectorAll('.st-pm[data-dom]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var head = root.querySelector('.st-head');
  if (head) {
    if (reduce || !('IntersectionObserver' in window)) {
      head.classList.add('is-fly-in');
    } else {
      var flyIo = new IntersectionObserver(function (es) {
        if (es[0] && es[0].isIntersecting) {
          head.classList.add('is-fly-in');
          flyIo.disconnect();
        }
      }, { threshold: 0.35, rootMargin: '0px 0px -60px 0px' });
      flyIo.observe(head);
    }
  }
  var qi = 0, timer = null, running = false;
  var rootInView = false, pmInView = false, fxOn = false, fxHover = false, scaleOn = false;
  var fxStop = function () {}, fxTick = function () {};
  var startScaleWave = function () {}, stopScaleWave = function () {};
  var hideCursor = function () {};

  function highlight(dom) {
    cards.forEach(function (c) { c.classList.toggle('is-hl', c.getAttribute('data-dom') === dom); });
  }
  function typeNext() {
    var item = QUERIES[qi];
    chipEl.textContent = item.chip;
    highlight(item.dom);
    var n = 0;
    (function type() {
      if (!running) return;
      qEl.textContent = item.q.slice(0, ++n);
      if (n < item.q.length) { timer = setTimeout(type, 55); return; }
      timer = setTimeout(function erase() {
        if (!running) return;
        qEl.textContent = item.q.slice(0, --n);
        if (n > 0) { timer = setTimeout(erase, 22); return; }
        qi = (qi + 1) % QUERIES.length;
        timer = setTimeout(typeNext, 250);
      }, 2400);
    })();
  }
  function start() { if (running || reduce || !qEl) return; running = true; typeNext(); }
  function stop() { running = false; clearTimeout(timer); highlight(''); }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        rootInView = e.isIntersecting;
        root.classList.toggle('is-inview', rootInView && !document.hidden);
        if (!rootInView) hideCursor();
      });
    }, { threshold: 0.2 }).observe(root);
    var grid = root.querySelector('.st-pm-grid');
    if (grid) new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        pmInView = e.isIntersecting;
        if (pmInView && !document.hidden) start(); else stop();
      });
    }, { threshold: 0.35 }).observe(grid);
  } else {
    rootInView = true;
    pmInView = true;
    root.classList.add('is-inview');
    start();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      root.classList.remove('is-inview');
      stop();
      fxStop();
      stopScaleWave();
      hideCursor();
    } else {
      if (rootInView) root.classList.add('is-inview');
      if (pmInView) start();
      if (fxOn && !fxHover) { clearTimeout(fxTimer); fxTick(); }
      if (scaleOn) startScaleWave();
    }
  });

  /* ---------- Fast API 卡片:进入视口后逐个轮流高亮 Web → Broad → Image → Video → Sense(.is-hl 与 :hover 样式一致),
     悬停网格时暂停轮播、交给鼠标;离开视口停止 ---------- */
  var fxGrid = root.querySelector('#stTypes');
  if (fxGrid && !reduce && 'IntersectionObserver' in window) {
    var fxCards = Array.prototype.slice.call(fxGrid.querySelectorAll('.st-bt[data-fx]'));
    var fxDurations = { image: 2600, video: 2400, news: 2800, business: 2600, place: 2600, design: 2600 };
    var fxVideoCard = fxGrid.querySelector('.st-fx--video');
    var fxVideoEl = fxGrid.querySelector('.fx-vid-bg');
    var fxDotsWrap = fxGrid.querySelector('[data-vid-dots]');
    var fxDots = [];
    if (fxDotsWrap) {
      for (var d = 0; d < 50; d++) {
        var dot = document.createElement('i');
        fxDotsWrap.appendChild(dot);
        fxDots.push(dot);
      }
    }
    var fxDotTimer = null;
    var fxI = 0, fxTimer = null;

    var clearDots = function () {
      if (fxDotTimer) { clearInterval(fxDotTimer); fxDotTimer = null; }
      fxDots.forEach(function (dot) { dot.classList.remove('is-lit', 'is-peak'); });
    };

    var pulseDots = function () {
      if (!fxDots.length) return;
      var burst = 5 + Math.floor(Math.random() * 4);
      for (var k = 0; k < burst; k++) {
        (function (dot, isPeak) {
          dot.classList.add(isPeak ? 'is-peak' : 'is-lit');
          setTimeout(function () {
            dot.classList.remove('is-lit', 'is-peak');
          }, 360 + Math.floor(Math.random() * 140));
        })(fxDots[Math.floor(Math.random() * fxDots.length)], k === 0 || (k === 1 && Math.random() > 0.5));
      }
    };

    var syncVideo = function (play) {
      if (fxVideoEl) {
        if (play) {
          var p = fxVideoEl.play();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        } else {
          fxVideoEl.pause();
        }
      }
      if (play) {
        if (!fxDotTimer && fxDots.length) {
          pulseDots();
          fxDotTimer = setInterval(pulseDots, 160);
        }
      } else {
        clearDots();
      }
    };

    var fxSet = function (el) {
      fxCards.forEach(function (c) { c.classList.toggle('is-hl', c === el); });
      if (!fxHover) syncVideo(el === fxVideoCard);
    };

    fxTick = function () {
      if (!fxOn || fxHover || document.hidden || !fxCards.length) return;
      var activeCard = fxCards[fxI];
      fxSet(activeCard);
      var dur = fxDurations[activeCard.getAttribute('data-fx')] || 2400;
      fxI = (fxI + 1) % fxCards.length;
      fxTimer = setTimeout(fxTick, dur);
    };

    fxStop = function () {
      clearTimeout(fxTimer);
      fxSet(null);
      syncVideo(false);
    };

    fxGrid.addEventListener('mouseenter', function () {
      fxHover = true;
      clearTimeout(fxTimer);
      fxCards.forEach(function (c) { c.classList.remove('is-hl'); });
      syncVideo(false);
    });
    fxGrid.addEventListener('mouseleave', function () {
      fxHover = false;
      syncVideo(false);
      if (fxOn) fxTimer = setTimeout(fxTick, 600);
    });

    if (fxVideoCard) {
      fxVideoCard.addEventListener('mouseenter', function () { syncVideo(true); });
      fxVideoCard.addEventListener('mouseleave', function () {
        if (fxHover || !fxVideoCard.classList.contains('is-hl')) syncVideo(false);
      });
    }

    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        fxOn = e.isIntersecting;
        if (fxOn && !document.hidden) { clearTimeout(fxTimer); fxTick(); } else fxStop();
      });
    }, { threshold: 0.4 }).observe(fxGrid);
  }

  /* ---------- Pulse / Fast 延迟大数字 NumberFlow 滚轮动画 ---------- */
  var bento = root.querySelector('.st-bento');
  var flowEls = Array.prototype.slice.call(root.querySelectorAll('.st-stat-flow'));
  if (bento && flowEls.length && typeof customElements !== 'undefined') {
    var definedPromise = customElements.get('number-flow')
      ? Promise.resolve()
      : customElements.whenDefined('number-flow');
    var pluginPromise = window.NumberFlowContinuous
      ? Promise.resolve()
      : new Promise(function (resolve) {
          window.addEventListener('numberflow-ready', resolve, { once: true });
        });

    Promise.all([definedPromise, pluginPromise]).then(function () {
      if (reduce) {
        flowEls.forEach(function (el) {
          var targetVal = parseFloat(el.dataset.value);
          if (typeof el.update === 'function' && !isNaN(targetVal)) {
            el.animated = false;
            el.update(targetVal);
          }
        });
        return;
      }

      flowEls.forEach(function (el) {
        var startVal = parseFloat(el.dataset.start);
        var trendVal = Number(el.dataset.trend) || 1;
        el.plugins = window.NumberFlowContinuous ? [window.NumberFlowContinuous] : [];
        el.trend = trendVal;
        el.spinTiming = { duration: 1100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };
        el.transformTiming = { duration: 650, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };
        el.opacityTiming = { duration: 350, easing: 'ease-out' };
        if (typeof el.update === 'function' && !isNaN(startVal)) {
          el.animated = false;
          el.update(startVal);
        }
      });

      var flowPlayed = false;
      function playFlowOnce() {
        if (flowPlayed) return;
        flowPlayed = true;
        requestAnimationFrame(function () {
          flowEls.forEach(function (el) {
            var targetVal = parseFloat(el.dataset.value);
            var delay = parseInt(el.dataset.delay || '0', 10) || 0;
            setTimeout(function () {
              if (typeof el.update === 'function' && !isNaN(targetVal)) {
                el.animated = true;
                el.update(targetVal);
              }
            }, delay);
          });
        });
      }

      if (!('IntersectionObserver' in window)) {
        playFlowOnce();
        return;
      }

      var flowIo = new IntersectionObserver(function (es) {
        if (es[0] && es[0].isIntersecting) {
          flowIo.disconnect();
          playFlowOnce();
        }
      }, { threshold: 0.15 });
      flowIo.observe(bento);
    });
  }

  /* ---------- Fast: 1K → 1M+ QPS 实时波动延迟曲线 (50ms ~ 80ms) ---------- */
  var scaleBar = root.querySelector('.st-scale-bar');
  var scalePath = root.querySelector('[data-scale-path]');
  var scaleDot = root.querySelector('[data-scale-dot]');
  var scaleMs = root.querySelector('[data-scale-ms]');
  if (scaleBar && scalePath && scaleDot && scaleMs && !reduce) {
    var scaleRaf = null;
    var lastMsUpdate = 0;
    var lastWaveDraw = 0;

    var sampleWave = function (x, t) {
      var w1 = Math.sin(x * 0.042 - t * 2.1) * 0.55;
      var w2 = Math.sin(x * 0.095 - t * 3.4 + 1.1) * 0.3;
      var w3 = Math.cos(x * 0.023 - t * 1.3 + 2.4) * 0.15;
      return w1 + w2 + w3; // roughly [-1, 1]
    };

    var drawWave = function (now) {
      scaleRaf = null;
      if (!scaleOn || document.hidden) return;
      if (now - lastWaveDraw < 33) {
        scaleRaf = requestAnimationFrame(drawWave);
        return;
      }
      lastWaveDraw = now;
      var t = now * 0.001;
      var d = '';
      var tipY = 9;
      var tipNorm = 0;
      var steps = 40;
      var maxX = 356;

      for (var i = 0; i <= steps; i++) {
        var x = (maxX / steps) * i;
        var norm = sampleWave(x, t);
        var y = 9 - norm * 2.4;
        d += (i === 0 ? 'M' : ' L') + x.toFixed(1) + ' ' + y.toFixed(2);
        if (i === steps) {
          tipY = y;
          tipNorm = norm;
        }
      }

      scalePath.setAttribute('d', d);
      scaleDot.setAttribute('cy', tipY.toFixed(2));

      if (now - lastMsUpdate >= 180) {
        lastMsUpdate = now;
        var msVal = Math.max(50, Math.min(80, Math.round(65 + tipNorm * 15)));
        scaleMs.textContent = String(msVal);
      }

      scaleRaf = requestAnimationFrame(drawWave);
    };

    startScaleWave = function () {
      if (!scaleRaf && scaleOn && !document.hidden) {
        scaleRaf = requestAnimationFrame(drawWave);
      }
    };
    stopScaleWave = function () {
      if (scaleRaf) {
        cancelAnimationFrame(scaleRaf);
        scaleRaf = null;
      }
    };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        scaleOn = Boolean(es[0] && es[0].isIntersecting);
        if (scaleOn) startScaleWave();
        else stopScaleWave();
      }, { threshold: 0.2 }).observe(scaleBar);
    } else {
      scaleOn = true;
      startScaleWave();
    }
  }

  /* ---------- Image Search 搜索框:轮流输入不同的 query(打字 → 停留 → 回删 → 下一条),进入视口才运行 ---------- */
  (function () {
    var label = root.querySelector('.st-bt--image .fx-img-label');
    if (!label || reduce) return;
    var IMG_QUERIES = [
      'sunset over harbor',
      'green geometric art',
      'latte on wooden table',
      'neon city at night',
      'vintage jazz poster',
      'orange abstract blur'
    ];
    var qi = 0, ci = 0, timer = null, on = false, phase = 'type';
    label.textContent = '';
    function step() {
      if (!on) return;
      var q = IMG_QUERIES[qi];
      if (phase === 'type') {
        label.textContent = q.slice(0, ++ci);
        if (ci >= q.length) { phase = 'hold'; timer = setTimeout(step, 1900); return; }
        timer = setTimeout(step, 48 + Math.random() * 40);
      } else if (phase === 'hold') {
        phase = 'erase';
        timer = setTimeout(step, 0);
      } else {
        label.textContent = q.slice(0, --ci);
        if (ci <= 0) { phase = 'type'; qi = (qi + 1) % IMG_QUERIES.length; timer = setTimeout(step, 380); return; }
        timer = setTimeout(step, 22);
      }
    }
    function start() { if (on) return; on = true; step(); }
    function stop() { on = false; clearTimeout(timer); }
    var card = root.querySelector('.st-bt--image');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && !document.hidden) start(); else stop(); });
      }, { threshold: 0.3 }).observe(card);
    } else { start(); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); });
  })();

  /* ---------- 三档主卡片原生鼠标旁跟随档位标签（当前已隐藏） ---------- */
  var ENABLE_TIER_CURSOR = false;
  var finePointer = ENABLE_TIER_CURSOR && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer) {
    var TIER_LABELS = {
      pulse: 'Pulse Search',
      fast: 'Fast Search',
      premier: 'Premier Search'
    };

    var cursorEl = document.createElement('div');
    cursorEl.className = 'st-tier-cursor';
    cursorEl.setAttribute('aria-hidden', 'true');
    cursorEl.innerHTML =
      '<div class="st-tier-cursor-inner">' +
        '<span class="st-tier-cursor-tag"></span>' +
      '</div>';
    document.body.appendChild(cursorEl);

    var tagEl = cursorEl.querySelector('.st-tier-cursor-tag');
    var lastX = -999;
    var lastY = -999;
    var activeTier = '';

    function updateCursorTarget(el) {
      var card = el && typeof el.closest === 'function' ? el.closest('#search-tiers .st-card[data-tier]') : null;
      var tier = card ? card.getAttribute('data-tier') : '';
      if (tier && TIER_LABELS[tier]) {
        if (activeTier !== tier) {
          activeTier = tier;
          cursorEl.setAttribute('data-tier', tier);
          tagEl.textContent = TIER_LABELS[tier];
        }
        cursorEl.classList.add('is-on');
      } else {
        activeTier = '';
        cursorEl.classList.remove('is-on', 'is-down');
      }
    }

    hideCursor = function () {
      activeTier = '';
      cursorEl.classList.remove('is-on', 'is-down');
    };

    window.addEventListener('mousemove', function (e) {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!rootInView || document.hidden) {
        if (activeTier) hideCursor();
        return;
      }
      cursorEl.style.transform = 'translate3d(' + lastX + 'px, ' + lastY + 'px, 0)';
      updateCursorTarget(e.target);
    }, { passive: true });

    window.addEventListener('mousedown', function () {
      if (activeTier) cursorEl.classList.add('is-down');
    }, { passive: true });

    window.addEventListener('mouseup', function () {
      cursorEl.classList.remove('is-down');
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', hideCursor);
    window.addEventListener('blur', hideCursor);
    window.addEventListener('scroll', function () {
      if (!rootInView || document.hidden || lastX < 0 || lastY < 0) {
        if (activeTier) hideCursor();
        return;
      }
      updateCursorTarget(document.elementFromPoint(lastX, lastY));
    }, { passive: true });
  }
})();

/* Sense 卡片:跟随鼠标的微弱立体倾斜(最大 ±2.2°;右侧分支图本身没有视差)+ 背景点阵拖尾:鼠标经过的点依次点亮(放大、变亮),随后逐渐褪去,形成拖尾;
   触屏 / 减少动画偏好下不启用 */
(function () {
  var card = document.querySelector('#tier-sense');
  if (!card) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var hoverFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;   // 倾斜 / 拖尾只在有鼠标的设备上启用;从中心球体向外扩散的光点涟漪所有设备都有

  /* ---- 倾斜 ---- */
  var MAX = 2.2, tx = 0, ty = 0, cx = 0, cy = 0, tiltRaf = 0;
  function tiltFrame() {
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    card.style.setProperty('--st-rx', cx.toFixed(3) + 'deg');
    card.style.setProperty('--st-ry', cy.toFixed(3) + 'deg');
    if (Math.abs(tx - cx) > 0.004 || Math.abs(ty - cy) > 0.004) tiltRaf = requestAnimationFrame(tiltFrame);
    else tiltRaf = 0;
  }
  function tiltKick() { if (!tiltRaf) tiltRaf = requestAnimationFrame(tiltFrame); }

  /* ---- 点阵拖尾(画布):与 CSS 底层点阵同一网格(12px,圆心在格子中心) ---- */
  var STEP = 12, REACH = 52, DECAY = 0.94, TURB = 5;   // 点阵间距 12px(与 CSS 底层点阵一致);TURB = 尾部湍流的最大位移(px)
  var canvas = document.createElement('canvas');
  canvas.className = 'st-dots-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  card.insertBefore(canvas, card.firstChild);
  card.classList.add('has-dot-canvas');   // 画布接管整层背景点阵(CSS 的底层点阵隐藏),涟漪 / 拖尾点亮的就是这些点本身
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, cols = 0, rows = 0, level = null, tint = null, dotRaf = 0, lastX = null, lastY = null;
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = card.offsetWidth; H = card.offsetHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / STEP); rows = Math.ceil(H / STEP);
    level = new Float32Array(cols * rows);
    tint = new Float32Array(cols * rows);
    drawBase(dpr);
    ctx.clearRect(0, 0, W, H); ctx.drawImage(baseCanvas, 0, 0, W, H);
  }
  // 底层点阵(与原 CSS 点阵同一网格、同样的淡白色)预先画到离屏画布,每帧整张贴回;被点亮的点在同一个位置上变亮 / 变大
  var baseCanvas = document.createElement('canvas');
  function drawBase(dpr) {
    baseCanvas.width = W * dpr; baseCanvas.height = H * dpr;
    var b = baseCanvas.getContext('2d');
    b.setTransform(dpr, 0, 0, dpr, 0, 0);
    b.fillStyle = 'rgba(255,255,255,0.12)';
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        b.beginPath();
        b.arc(c * STEP + STEP / 2, r * STEP + STEP / 2, 0.95, 0, 6.2832);
        b.fill();
      }
    }
  }
  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(card);

  function stamp(px, py) {   // 以 (px,py) 为圆心点亮周围的点(强度随距离衰减,取较大值,所以划过的路径上的点都会被点亮)
    var c0 = Math.max(0, Math.floor((px - REACH) / STEP)), c1 = Math.min(cols - 1, Math.ceil((px + REACH) / STEP));
    var r0 = Math.max(0, Math.floor((py - REACH) / STEP)), r1 = Math.min(rows - 1, Math.ceil((py + REACH) / STEP));
    for (var r = r0; r <= r1; r++) {
      for (var c = c0; c <= c1; c++) {
        var d = Math.hypot(c * STEP + STEP / 2 - px, r * STEP + STEP / 2 - py);
        if (d >= REACH) continue;
        var v = 1 - d / REACH;
        v = v * v * (3 - 2 * v);
        var i = r * cols + c;
        if (v > level[i]) level[i] = v;
      }
    }
  }
  function dotFrame(now) {
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(baseCanvas, 0, 0, W, H);   // 先铺满底层点阵,再在原位置叠加被点亮的点
    var alive = false, t = now || performance.now();
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var i = r * cols + c, v = level[i];
        if (v < 0.015) { level[i] = 0; continue; }
        alive = true;
        // 尾部湍流:亮度越低(越靠近尾部)位移越大,位移方向由随位置 / 时间变化的伪噪声决定,点在褪去时像被气流卷走
        var lit = tint[i] > 0.08, tail = 1 - v, amp = lit ? 0 : TURB * tail * tail;   // 涟漪点不做湍流位移,始终钉在网格上
        var nx = Math.sin(c * 0.83 + r * 0.41 + t * 0.0031) * Math.cos(r * 0.97 - c * 0.29 + t * 0.0023);
        var ny = Math.cos(c * 0.57 - r * 0.88 + t * 0.0027) * Math.sin(r * 0.62 + c * 0.35 - t * 0.0035);
        ctx.fillStyle = tint[i] > 0.08 ? 'rgba(112,254,126,' + (0.6 * v).toFixed(3) + ')' : 'rgba(255,255,255,' + (0.62 * v).toFixed(3) + ')';   // 涟漪点为绿色,鼠标拖尾为白色
        ctx.beginPath();
        ctx.arc(c * STEP + STEP / 2 + nx * amp, r * STEP + STEP / 2 + ny * amp, (lit ? 0.95 + 1.0 * v : 0.75 + 0.7 * v), 0, 6.2832);
        ctx.fill();
        level[i] = v * DECAY;
        tint[i] = tint[i] * DECAY;
      }
    }
    dotRaf = alive ? requestAnimationFrame(dotFrame) : 0;
  }
  function dotKick() { if (!dotRaf) dotRaf = requestAnimationFrame(dotFrame); }

  /* ---- 中心球体向外扩散的光点涟漪:用背景点阵本身来完成(点阵亮起 → 褪去),与球体光晕呼吸同步:光晕升到峰值时发出一圈 ---- */
  var RIPPLE_MS = 2900, PERIOD = 3800, PEAK = 1900, SIG = 15;
  var ringStart = -1, ringCx = 0, ringCy = 0, ringR0 = 0, ringMax = 0, waveRaf = 0, lastPhase = -1, waveVisible = true;
  function breatheAnim() {
    var svg = card.querySelector('.sv-center .sv-svg');
    if (!svg || !svg.getAnimations) return null;
    var a = svg.getAnimations();
    for (var i = 0; i < a.length; i++) if (a[i].animationName === 'sv-breathe') return a[i];
    return null;
  }
  function launchRing(now) {
    var el = card.querySelector('.sv-center');
    if (!el) return;
    var cr = card.getBoundingClientRect(), r = el.getBoundingClientRect();
    ringCx = r.left + r.width / 2 - cr.left; ringCy = r.top + r.height / 2 - cr.top;
    ringR0 = r.width * 0.34; ringMax = Math.max(260, Math.min(W, 520) * 0.5);
    ringStart = now;
  }
  function stampRing(p) {   // p: 0~1 的扩散进度;环上的点亮度按高斯分布,越往外越淡
    var eased = 1 - Math.pow(1 - p, 2.2);
    var R = ringR0 + (ringMax - ringR0) * eased, amp = 0.5 * Math.pow(1 - p, 1.25);
    var c0 = Math.max(0, Math.floor((ringCx - R - 3 * SIG) / STEP)), c1 = Math.min(cols - 1, Math.ceil((ringCx + R + 3 * SIG) / STEP));
    var r0 = Math.max(0, Math.floor((ringCy - R - 3 * SIG) / STEP)), r1 = Math.min(rows - 1, Math.ceil((ringCy + R + 3 * SIG) / STEP));
    for (var r = r0; r <= r1; r++) {
      for (var c = c0; c <= c1; c++) {
        var d = Math.hypot(c * STEP + STEP / 2 - ringCx, r * STEP + STEP / 2 - ringCy), dd = d - R;
        if (dd > 3 * SIG || dd < -3 * SIG) continue;
        var v = amp * Math.exp(-(dd * dd) / (2 * SIG * SIG)), i = r * cols + c;
        if (v > level[i]) { level[i] = v; if (v > tint[i]) tint[i] = v; }
      }
    }
  }
  function waveFrame(now) {
    waveRaf = 0;
    if (!waveVisible || document.hidden) return;
    var an = breatheAnim();
    var phase = an && an.currentTime != null ? (an.currentTime % PERIOD) : (now % PERIOD);
    if (lastPhase >= 0 && lastPhase < PEAK && phase >= PEAK) launchRing(now);   // 光晕升过峰值的那一刻发出一圈
    lastPhase = phase;
    if (ringStart >= 0) {
      var p = (now - ringStart) / RIPPLE_MS;
      if (p >= 1) ringStart = -1; else { stampRing(p); dotKick(); }
    }
    waveRaf = requestAnimationFrame(waveFrame);
  }
  function waveKick() { if (!waveRaf) waveRaf = requestAnimationFrame(waveFrame); }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { waveVisible = es[0].isIntersecting; if (waveVisible) waveKick(); }).observe(card);
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) waveKick(); });
  waveKick();

  if (hoverFine) card.addEventListener('pointermove', function (e) {
    var r = card.getBoundingClientRect();
    var x = e.clientX - r.left, y = e.clientY - r.top;
    ty = (x / r.width - 0.5) * 2 * MAX;     // 鼠标在右 → 右侧远离(rotateY 为正)
    tx = -(y / r.height - 0.5) * 2 * MAX;   // 鼠标在上 → 上侧远离(rotateX 为正)
    card.classList.add('is-tilting');
    tiltKick();
    // 在上一个指针位置到当前位置之间补点,快速移动时轨迹也连续
    if (lastX !== null) {
      var dist = Math.hypot(x - lastX, y - lastY), n = Math.max(1, Math.ceil(dist / (STEP * 0.8)));
      for (var k = 1; k <= n; k++) stamp(lastX + (x - lastX) * k / n, lastY + (y - lastY) * k / n);
    } else stamp(x, y);
    lastX = x; lastY = y;
    dotKick();
  });

  if (hoverFine) card.addEventListener('pointerleave', function () {
    tx = 0; ty = 0; lastX = null; lastY = null;
    card.classList.remove('is-tilting');
    tiltKick();
  });
})();
