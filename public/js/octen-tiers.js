/* Octen Search → three tiers(src/sections/03b-search-tiers.html)
   1. 概览按钮 hover / focus → 高亮下方对应卡片;≤1024px 点击平滑滚动到该卡片
   2. 进入视口时给 section 加 .is-inview,驱动 Pulse 光点动画
   3. Premier Bento 的搜索框轮流输入 News / Business / Place 示例查询,对应卡片加 .is-hl(触发与悬停相同的动效)
   其余悬停动效为纯 CSS(octen-tiers.css「Premier Bento」) */
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
      es.forEach(function (e) { root.classList.toggle('is-inview', e.isIntersecting); });
    }, { threshold: 0.2 }).observe(root);
    var grid = root.querySelector('.st-pm-grid');
    if (grid) new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) start(); else stop(); });
    }, { threshold: 0.35 }).observe(grid);
  } else {
    root.classList.add('is-inview');
    start();
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
})();
