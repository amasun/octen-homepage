/* 调试用:右下角实时显示滚动像素数(调动画节奏)。上线前删除本文件和 10-scripts.html 里的引用即可 */
(function () {
  var el = document.createElement('div');
  el.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:2147483647;padding:6px 10px;border-radius:8px;background:rgba(0,0,0,.78);color:#7CFF9B;font:600 13px/1.2 ui-monospace,Menlo,monospace;pointer-events:none;font-variant-numeric:tabular-nums';
  document.body.appendChild(el);
  function tick() {
    var y = window.__lenis ? window.__lenis.scroll : window.scrollY;
    el.textContent = 'scrollY ' + Math.round(y) + ' px';
    requestAnimationFrame(tick);
  }
  tick();
})();
