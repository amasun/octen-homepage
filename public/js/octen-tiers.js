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
