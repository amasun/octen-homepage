/**
 * Hero console:取消滚轮对 console 界面的响应。
 *  - 在 console 上滚动滚轮 / 触控板:阻止内部滚动区滚动,把滚动量直接转给整页(页面照常滚屏)
 *  - console 内部内容只能通过拖动滚动条滚动
 * 样式见 public/css/hero-shader.css 末尾(触摸设备内部不滚动)。
 */
(function () {
  'use strict';
  var consoleEl = document.querySelector('#hero .hero-console');
  if (!consoleEl) return;

  consoleEl.addEventListener('wheel', function (e) {
    if (e.ctrlKey) return;                        // 保留 ctrl+滚轮 / 触控板捏合缩放
    e.preventDefault();
    if (window.__lenis) return;
    var k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    window.scrollBy(e.deltaX * k, e.deltaY * k);
  }, { passive: false });
})();
