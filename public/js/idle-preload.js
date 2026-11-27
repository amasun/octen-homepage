/**
 * 空闲预加载:首屏加载完成并且浏览器空闲后,按页面顺序把下方的懒加载图片(loading="lazy")
 * 以及 Showcase 卡片的背景图提前拉取到缓存里,用户滚到那里时直接显示,不再出现"图片慢慢刷出来"。
 *  - 同时最多 3 个请求,不抢首屏和交互的带宽
 *  - 开了"省流量"模式 / 2G 网络 / 页面不可见时不预加载
 */
(function () {
  var c = navigator.connection || {};
  if (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')) return;

  function urls() {
    var list = [], seen = {};
    function add(u) { if (u && !seen[u] && u.indexOf('data:') !== 0) { seen[u] = 1; list.push(u); } }
    Array.prototype.forEach.call(document.querySelectorAll('img[loading="lazy"]'), function (img) { add(img.currentSrc || img.src); });
    Array.prototype.forEach.call(document.querySelectorAll('#showcase *, .st-types *, #search-tiers *'), function (el) {
      var bg = getComputedStyle(el).backgroundImage;
      if (bg && bg !== 'none') bg.replace(/url\(["']?([^"')]+)["']?\)/g, function (_, u) { add(u); });
    });
    return list;
  }

  function run() {
    var q = urls(), active = 0, MAX = 3;
    function next() {
      if (document.hidden) { document.addEventListener('visibilitychange', function once() { document.removeEventListener('visibilitychange', once); next(); }); return; }
      while (active < MAX && q.length) {
        active++;
        var im = new Image();
        im.decoding = 'async';
        im.onload = im.onerror = function () { active--; next(); };
        im.src = q.shift();
      }
    }
    next();
  }

  function start() { (window.requestIdleCallback || function (f) { setTimeout(f, 1200); })(run, { timeout: 4000 }); }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
})();
