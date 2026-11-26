/**
 * Hero console 演示(还原 octen.ai 首页 console 的动效,不改 console 的尺寸 / 边框):
 *  1. 背景方块点阵:console 顶部 canvas 里 6×6 方块、间距 14px,每个方块的亮度随机缓慢闪动
 *  2. 操作过程:输入框逐字输入问题 → 点击提交按钮 → 骨架屏(指标 "--"、3×3 查询卡片)
 *     → 查询卡片依次填入 + 指标数字滚动 → 切换到 Search Process | Answer 双栏
 *     → 左栏逐行出现,右栏 Answer 流式输出并自动向下滚动
 *  再次点击提交按钮可重播。prefers-reduced-motion 下只画静态点阵,不播放演示。
 */
(function () {
  'use strict';
  var consoleEl = document.querySelector('#hero .hero-console');
  if (!consoleEl) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 点阵画布 ---------- */
  (function dots() {
    var cv = consoleEl.querySelector('canvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var SIZE = 6, PITCH = 14, A_MIN = 0.04, A_MAX = 0.16;
    var cols = 0, rows = 0, cur = [], tgt = [], dpr = 1, w = 0, h = 0, visible = true;

    function resize() {
      var r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / PITCH); rows = Math.ceil(h / PITCH);
      cur = []; tgt = [];
      for (var i = 0; i < cols * rows; i++) {
        var a = A_MIN + Math.random() * (A_MAX - A_MIN);
        cur.push(a); tgt.push(a);
      }
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#ccc';
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          ctx.globalAlpha = cur[r * cols + c];
          ctx.fillRect(c * PITCH, r * PITCH, SIZE, SIZE);
        }
      }
      ctx.globalAlpha = 1;
    }
    function tick() {
      if (visible && !document.hidden) {
        var n = cur.length, pick = Math.max(2, Math.round(n * 0.03));   // 每帧约 3% 的方块换新目标亮度
        for (var k = 0; k < pick; k++) tgt[(Math.random() * n) | 0] = A_MIN + Math.random() * (A_MAX - A_MIN);
        for (var i = 0; i < n; i++) cur[i] += (tgt[i] - cur[i]) * 0.07;
        draw();
      }
      requestAnimationFrame(tick);
    }
    resize(); draw();
    window.addEventListener('resize', function () { resize(); draw(); }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(cv);
    }
    if (!reduce) requestAnimationFrame(tick);
  })();

  if (reduce) return;

  /* ---------- 2. 操作过程演示 ---------- */
  var input = consoleEl.querySelector('input');
  var submitBtn = consoleEl.querySelector('button[style*="box-shadow"]');
  var clearBtn = input && input.parentElement.nextElementSibling && input.parentElement.nextElementSibling.querySelector('button');
  var body = consoleEl.querySelector(':scope > div.min-h-0');
  if (!input || !body) return;
  var statsRow = body.children[0];
  var pane = body.children[1];
  var desktop = pane && pane.querySelector('div.hidden.md\\:flex');
  if (!statsRow || !desktop) return;
  var leftPane = desktop.children[0];
  var rightPane = desktop.children[1];
  var listWrap = leftPane.querySelector('div.overflow-y-auto');
  var rows = listWrap ? Array.prototype.slice.call(listWrap.children) : [];
  var logEl = rightPane.querySelector('[role="log"]');
  var scroller = logEl && logEl.firstElementChild;
  var md = scroller && scroller.querySelector('div.space-y-4');
  var statSpans = statsRow.querySelectorAll('span.font-bold span');   // queries / results / latency 三个数字
  if (!rows.length || !scroller || !md || statSpans.length < 3) return;

  var QUESTION = input.value || 'What are AI agents actually being used for in production?';
  var FINAL = [statSpans[0].textContent, statSpans[1].textContent, statSpans[2].textContent];
  var mobile = function () { return window.matchMedia('(max-width: 767px)').matches; };

  // 骨架屏 / 查询卡片网格(覆盖在双栏之上,只在演示中显示)
  pane.style.position = 'relative';
  var grid = document.createElement('div');
  grid.className = 'hcd-grid';
  var cardData = rows.map(function (r) {
    var t = r.querySelector('span.truncate');
    var res = r.querySelector('div.shrink-0');
    var ms = r.querySelector('div.w-9');
    return { q: t ? t.textContent : '', res: res ? res.textContent.replace(/\D/g, '') : '5', ms: ms ? ms.textContent.replace(/\D/g, '') : '90' };
  });
  // console 比原版高,补足占位卡片把 3 列网格铺满到底(底部有渐隐遮罩);超出真实查询数的卡片用补充查询填充
  var EXTRA = ['AI agent frameworks adoption 2026', 'agentic workflows enterprise ROI', 'AI agents security and governance',
    'AI agents legal and compliance use cases', 'AI agents in retail and e-commerce', 'AI agents in logistics and supply chain',
    'multi-agent systems production lessons', 'AI agents observability and evaluation', 'AI agents cost per task benchmarks',
    'AI agents human-in-the-loop patterns'];
  var ROWS = 8;
  for (var ei = 0; cardData.length < ROWS * 3; ei++) {
    cardData.push({ q: EXTRA[ei % EXTRA.length], res: String(3 + (ei * 2) % 3), ms: String(70 + (ei * 17) % 60) });
  }
  cardData.forEach(function (d) {
    var card = document.createElement('div');
    card.className = 'hcd-card is-skel';
    card.innerHTML = '<div class="hcd-q"><i></i><span></span></div><div class="hcd-m"></div>';
    card._d = d;
    grid.appendChild(card);
  });
  pane.appendChild(grid);
  // 输入阶段的空状态:居中提示语,不出现指标和卡片矩阵(提交后才出现)
  var idle = document.createElement('div');
  idle.className = 'hcd-idle';
  idle.textContent = 'What would you like to search today?';
  pane.appendChild(idle);
  statsRow.classList.add('hcd-stats');
  var cards = Array.prototype.slice.call(grid.children);

  // 答案流式输出:把 markdown 里所有文字节点清空,按字符数逐步还原;块级元素在首个字符出现前隐藏
  var textNodes = [], fullText = [];
  (function collect() {
    var w = document.createTreeWalker(md, NodeFilter.SHOW_TEXT, null);
    var n; while ((n = w.nextNode())) { if (n.nodeValue.length) { textNodes.push(n); fullText.push(n.nodeValue); } }
  })();
  var blocks = [];   // {el, first}
  (function collectBlocks() {
    var idx = new Map();
    textNodes.forEach(function (n, i) { idx.set(n, i); });
    md.querySelectorAll('p, h1, h2, h3, h4, ul, ol, li, table, thead, tbody, tr, [data-streamdown="table-wrapper"]').forEach(function (el) {
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n, first = -1;
      while ((n = w.nextNode())) { if (idx.has(n)) { first = idx.get(n); break; } }
      if (first >= 0) blocks.push({ el: el, first: first });
    });
  })();

  var token = 0;                 // 重播时让旧流程失效
  var sleep = function (ms, t) { return new Promise(function (res) { setTimeout(function () { res(t === token); }, ms); }); };

  function setStats(a, b, c) { statSpans[0].textContent = a; statSpans[1].textContent = b; statSpans[2].textContent = c; }

  function resetAll() {
    grid.classList.remove('is-out');
    grid.classList.add('is-wait');
    idle.classList.remove('is-off');
    statsRow.style.opacity = '0';
    desktop.classList.remove('hcd-in');
    desktop.classList.add('hcd-hidden');
    grid.style.display = '';
    cards.forEach(function (c) { c.classList.add('is-skel'); c.classList.remove('is-done'); });
    rows.forEach(function (r) { r.classList.add('hcd-row-hide'); r.classList.remove('hcd-row-show'); });
    textNodes.forEach(function (n) { n.nodeValue = ''; });
    blocks.forEach(function (b) { b.el.style.display = 'none'; });
    scroller.scrollTop = 0;
    setStats('--', '--', '--');
  }

  function countTo(el, to, dur, t) {
    return new Promise(function (resolve) {
      var t0 = performance.now();
      (function step(now) {
        if (t !== token) return resolve();
        var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(to * e));
        if (p < 1) requestAnimationFrame(step); else resolve();
      })(t0);
    });
  }

  async function typeQuestion(t) {
    input.value = '';
    input.focus({ preventScroll: true });
    for (var i = 1; i <= QUESTION.length; i++) {
      input.value = QUESTION.slice(0, i);
      if (!(await sleep(22 + Math.random() * 26, t))) return false;
    }
    input.blur();
    return true;
  }

  async function streamAnswer(t) {
    var total = fullText.reduce(function (s, x) { return s + x.length; }, 0);
    var shown = 0, node = 0, off = 0, bi = 0;
    var CPS = 520;                                  // 每秒字符数
    var last = performance.now();
    return new Promise(function (resolve) {
      (function frame(now) {
        if (t !== token) return resolve(false);
        var add = Math.max(1, Math.round((now - last) * CPS / 1000)); last = now;
        while (add > 0 && node < textNodes.length) {
          var len = fullText[node].length, take = Math.min(add, len - off);
          off += take; add -= take; shown += take;
          textNodes[node].nodeValue = fullText[node].slice(0, off);
          if (off >= len) { node++; off = 0; }
        }
        while (bi < blocks.length && blocks[bi].first <= node) { blocks[bi].el.style.display = ''; bi++; }
        scroller.scrollTop = scroller.scrollHeight;   // 跟随输出自动滚到底
        if (shown < total) requestAnimationFrame(frame); else { blocks.forEach(function (b) { b.el.style.display = ''; }); resolve(true); }
      })(last);
    });
  }

  async function run() {
    var t = ++token;
    resetAll();
    // 1 输入
    if (clearBtn) clearBtn.style.opacity = '0';
    if (!(await sleep(500, t))) return;
    if (!(await typeQuestion(t))) return;
    if (clearBtn) clearBtn.style.opacity = '';
    if (!(await sleep(380, t))) return;
    // 2 点击提交
    if (submitBtn) { submitBtn.classList.add('hcd-press'); await sleep(160, t); submitBtn.classList.remove('hcd-press'); }
    if (t !== token) return;
    idle.classList.add('is-off');
    statsRow.style.opacity = '';
    grid.classList.remove('is-wait');
    // 3 骨架 → 查询卡片依次填入
    if (!(await sleep(650, t))) return;
    var ctr = [0, 0, 0];
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i], d = c._d;
      c.querySelector('.hcd-q span').textContent = d.q;
      c.querySelector('.hcd-m').textContent = d.res + ' results · ' + d.ms + 'ms';
      c.classList.remove('is-skel'); c.classList.add('is-done');
      ctr[0] = Math.min(Math.round(FINAL[0]), i + 1);
      ctr[1] = Math.round((i + 1) / cards.length * parseInt(FINAL[1], 10));
      ctr[2] = Math.round(parseInt(FINAL[2], 10) * (0.8 + 0.2 * (i + 1) / cards.length));
      setStats(String(ctr[0]), String(ctr[1]), String(ctr[2]));
      if (!(await sleep(i < 14 ? 130 : 45, t))) return;
    }
    setStats(FINAL[0], FINAL[1], FINAL[2]);
    if (!(await sleep(900, t))) return;
    // 4 切换到双栏
    grid.classList.add('is-out');
    desktop.classList.remove('hcd-hidden'); desktop.classList.add('hcd-in');
    if (!(await sleep(380, t))) return;
    grid.style.display = 'none';
    for (var k = 0; k < rows.length; k++) {
      rows[k].classList.remove('hcd-row-hide'); rows[k].classList.add('hcd-row-show');
      if (!(await sleep(70, t))) return;
    }
    // 5 答案流式输出
    await streamAnswer(t);
    if (t !== token) return;
    scroller.scrollTop = 0;
    blocks.forEach(function (b) { b.el.style.display = ''; });
  }

  if (submitBtn) submitBtn.addEventListener('click', function () { run(); });

  // 进入视口才开始
  var started = false;
  function start() { if (started) return; started = true; run(); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { io.disconnect(); start(); }
    }, { threshold: 0.35 });
    io.observe(consoleEl);
  } else start();
  resetAll();
})();
