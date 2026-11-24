/**
 * Web Search 模块:Human Search vs Octen Broad Search 对比动画
 * 还原自源站 octen.ai(Framer Motion 状态机 idle→typing→searching→results→pausing 循环),
 * 并按需求强化对比:
 *   两侧以相同速度输入同一句 query,之后分叉:
 *   左 Human:连接线 + 加载圆点 → 5 条结果「一条一条」出现(体现人工搜索慢)
 *   右 Octen:括号分叉 → 10 个子查询并发弹出 → 每个子查询的结果叠层同时展开(单 query → 群体 query → 多结果)
 * 进入视口(30%)开始,离开视口重置;prefers-reduced-motion 时直接显示最终状态。
 */
(function () {
  'use strict';

  var QUERY = 'What is the best AI search engine?';
  var TYPE_MS = 60;             // 左右两侧输入速度一致(每字符)
  var HUMAN_SEARCH_MS = 1600;   // 人:加载等待
  var HUMAN_RESULT_MS = 750;    // 人:每条结果间隔
  var CHIP_MS = 45;             // 子查询并发弹出间隔
  var STACK_MS = 55;            // 结果叠层展开间隔
  var HOLD_MS = 5000;           // 全部完成后的停留
  var BASE = '#webSearchCompare';

  function init() {
    var root = document.querySelector(BASE);
    if (!root || root.querySelectorAll(':scope > .octen-web-search-card').length < 2) return;
    var cardEls = root.querySelectorAll(':scope > .octen-web-search-card');
    var hc = cardEls[0], oc = cardEls[1];

    /* ---------- 取元素并打标记 ---------- */
    function mark(el, name) { if (el) el.setAttribute('data-ws', name); return el; }
    function all(ctx, sel, name) { var l = Array.prototype.slice.call(ctx.querySelectorAll(sel)); l.forEach(function (e) { mark(e, name); }); return l; }

    var hText = hc.querySelector('.octen-human-query-text');
    var oText = oc.querySelector('span.flex-1');
    var hLabelParts = (function () { var d = hc.querySelector('div.text-base'); return d ? [d.children[1], d.children[2]] : []; })();
    var oLabel = (function () { var d = oc.querySelector('div.text-base'); return d ? d.children[1] : null; })();
    hLabelParts.forEach(function (e) { mark(e, 'label-h'); });
    mark(oLabel, 'label');
    var hConn = mark(hc.querySelector('.octen-human-connector-line'), 'h-conn');
    var hPanel = hc.querySelector('.octen-human-results-panel');
    var hItems = all(hc, '.octen-human-result-item', 'h-item');
    var oBrace = mark(oc.querySelector('.w-\\[85\\%\\]'), 'o-brace');
    var oChips = all(oc, '.bg-\\[\\#32353880\\]', 'o-chip');
    var oVconn = mark(oc.querySelector('.-bottom-6'), 'o-vconn');
    var oStacks = (function () {
      var grid = oc.querySelector('.h-33'); if (!grid) return [];
      return Array.prototype.slice.call(grid.children).map(function (s) {
        mark(s, 'o-stack');
        var layers = Array.prototype.slice.call(s.querySelectorAll(':scope > .absolute.inset-0')).filter(function (l) { return l.style.top; });
        layers.forEach(function (l) { l.classList.add('ws-layer'); });
        // 追加一层更深的叠影(与原 2 层共 3 层,偏移 2/4/6px),表达「每个子查询返回很多结果」
        if (layers.length) {
          var host = layers[0], front = s.querySelector(':scope > .absolute.inset-0:not(.ws-layer)');
          [[6, 0.4]].forEach(function (p) {
            var c = host.cloneNode(false); c.className = host.className; c.style.cssText = 'top:' + p[0] + 'px;left:' + p[0] + 'px;opacity:' + p[1];
            s.insertBefore(c, layers[0]);
          });
        }
        return s;
      });
    })();
    if (!hText || !oText || !hPanel) return;

    /* ---------- 大括号随容器宽度自适应(与源站一致:svg 宽 = 容器宽,路径按宽度重算) ---------- */
    (function fitBrace() {
      if (!oBrace) return;
      var box = oBrace.querySelector('.opacity-30'), svg = oBrace.querySelector('svg');
      if (!box || !svg) return;
      var paths = svg.querySelectorAll('path'), grads = svg.querySelectorAll('linearGradient');
      function layout(w) {
        if (!(w > 40)) return;
        // 括号竖向压缩量 D(px):让右侧子查询网格的顶边与左侧结果面板顶边对齐(仅桌面双列布局);CSS 变量 --ws-brace-shrink 控制
        var D = 0;
        if (window.matchMedia && matchMedia('(min-width: 768px)').matches) {
          D = parseFloat(getComputedStyle(root).getPropertyValue('--ws-brace-shrink')) || 0;
        }
        var e = 59 - D;                           // 两端落点:svg 底边上方 1px(线宽 2、圆头),圆头正好落在子查询网格上边框,不穿过也不悬空
        var y2 = e - 20;                          // 横线所在高度:紧贴下角 20px 圆角上方,把汇聚点整体压低
        var y1 = Math.max(2, y2 - 8);             // 竖干终点(汇聚/分叉点):横线上方 8px(原 2px 处,桌面端下降约 7px)
        var k = y1 + (y2 - y1) * 0.667;           // 上弯曲线控制点
        // Figma 括号:中心 x = w/2+1,左端 x=1,右端 x=w+1;下角圆角固定 20px(竖向 y2 → e 恒为 20)
        var cx = w / 2 + 1, R = w + 1;
        svg.setAttribute('width', w);
        svg.setAttribute('height', 60 - D);
        if (paths[0]) paths[0].setAttribute('d', 'M ' + cx + ' 1 V ' + y1 + ' C ' + cx + ' ' + k + ' ' + (cx - 8) + ' ' + y2 + ' ' + (cx - 24) + ' ' + y2 + ' H 21 C 15.696 ' + y2 + ' 10.609 ' + (y2 + 2.107) + ' 6.858 ' + (y2 + 5.858) + ' C 3.107 ' + (y2 + 9.609) + ' 1 ' + (y2 + 14.696) + ' 1 ' + e);
        if (paths[1]) paths[1].setAttribute('d', 'M ' + cx + ' 1 V ' + y1 + ' C ' + cx + ' ' + k + ' ' + (cx + 8) + ' ' + y2 + ' ' + (cx + 24) + ' ' + y2 + ' H ' + (R - 20) + ' C ' + (R - 15.695) + ' ' + y2 + ' ' + (R - 10.608) + ' ' + (y2 + 2.107) + ' ' + (R - 6.857) + ' ' + (y2 + 5.858) + ' C ' + (R - 3.107) + ' ' + (y2 + 9.609) + ' ' + (R - 1) + ' ' + (y2 + 14.696) + ' ' + (R - 1) + ' ' + e);
        if (grads[0]) { grads[0].setAttribute('x1', cx); grads[0].setAttribute('x2', 1); }
        if (grads[1]) { grads[1].setAttribute('x1', cx); grads[1].setAttribute('x2', R); }
      }
      layout(box.getBoundingClientRect().width);
      if (typeof ResizeObserver === 'function') new ResizeObserver(function (e) { layout(e[0].contentRect.width); }).observe(box);
    })();

    /* 光标与加载圆点(JS 创建) */
    function caret() { var c = document.createElement('span'); c.className = 'ws-caret'; c.setAttribute('data-ws', 'caret'); return c; }
    var hNode = document.createTextNode(''), oNode = document.createTextNode('');
    var hCaret = caret(), oCaret = caret();
    hText.textContent = ''; hText.appendChild(hNode); hText.appendChild(hCaret);
    oText.textContent = ''; oText.appendChild(oNode); oText.appendChild(oCaret);
    var loader = document.createElement('div');
    loader.className = 'ws-loader'; loader.setAttribute('data-ws', 'h-loader'); loader.innerHTML = '<i></i><i></i><i></i>';
    hPanel.appendChild(loader);

    root.classList.add('ws-ready');
    var marked = Array.prototype.slice.call(root.querySelectorAll('[data-ws]'));

    /* ---------- 减少动态:直接显示最终状态 ---------- */
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hNode.data = oNode.data = QUERY;
      marked.forEach(function (e) { if (e !== hCaret && e !== oCaret && e !== loader) e.classList.add('ws-on'); });
      return;
    }

    /* ---------- 时间轴 ---------- */
    var runId = 0;
    function sleep(ms, id) { return new Promise(function (r) { setTimeout(function () { r(id === runId); }, ms); }); }
    function on(e) { e.classList.add('ws-on'); }
    function off(e) { e.classList.remove('ws-on'); }
    function reset() { marked.forEach(off); hNode.data = ''; oNode.data = ''; }

    // 两侧同步输入同一句 query,速度完全一致;差异从「输入完成之后」开始体现
    async function typeBoth(id) {
      on(hCaret); on(oCaret);
      for (var i = 1; i <= QUERY.length; i++) {
        hNode.data = oNode.data = QUERY.slice(0, i);
        if (!(await sleep(TYPE_MS, id))) return false;
      }
      return true;
    }

    async function human(id) {
      if (!(await sleep(500, id))) return false;
      on(hConn); on(loader);                                   // searching:连接线 + 加载圆点
      if (!(await sleep(HUMAN_SEARCH_MS, id))) return false;
      off(loader); off(hCaret); hLabelParts.forEach(on);       // results:结果逐条出现
      for (var k = 0; k < hItems.length; k++) {
        on(hItems[k]);
        if (!(await sleep(HUMAN_RESULT_MS, id))) return false;
      }
      return true;
    }

    async function octen(id) {
      if (!(await sleep(300, id))) return false;
      if (oBrace) on(oBrace);                                  // 括号分叉绘制
      if (!(await sleep(450, id))) return false;
      for (var c = 0; c < oChips.length; c++) {                // 单 query → 10 个子查询并发弹出
        on(oChips[c]);
        if (!(await sleep(CHIP_MS, id))) return false;
      }
      if (!(await sleep(250, id))) return false;
      off(oCaret); if (oVconn) on(oVconn);
      if (oLabel) on(oLabel);
      for (var s = 0; s < oStacks.length; s++) {               // 每个子查询 → 一叠结果,几乎同时展开
        on(oStacks[s]);
        if (!(await sleep(STACK_MS, id))) return false;
      }
      return true;
    }

    async function loop() {
      var id = ++runId;
      reset();
      if (!(await sleep(500, id))) return;
      if (!(await typeBoth(id))) return;
      var r = await Promise.all([human(id), octen(id)]);
      if (id !== runId || !r[0] || !r[1]) return;
      if (!(await sleep(HOLD_MS, id))) return;
      reset();
      if (!(await sleep(800, id))) return;
      loop();
    }

    /* ---------- 进入视口开始,离开视口重置 ---------- */
    if (typeof IntersectionObserver !== 'function') { loop(); return; }
    var playing = false;
    new IntersectionObserver(function (entries) {
      var vis = entries[0].isIntersecting;
      if (vis && !playing) { playing = true; loop(); }
      else if (!vis && playing) { playing = false; runId++; reset(); }
    }, { threshold: 0.3 }).observe(root);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
