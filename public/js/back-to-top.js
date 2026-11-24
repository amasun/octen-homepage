/* Footer「Back to top」:平滑滚动回页面顶部(减少动态效果时直接跳转),并把焦点还给页面开头 */
(function () {
  document.querySelectorAll('[data-back-to-top]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (window.__lenis && !reduce) {
        window.__lenis.scrollTo(0, { duration: 1.0 });
      } else {
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      }
      if (history.replaceState && location.hash) history.replaceState(null, '', location.pathname + location.search);
    });
  });
})();
