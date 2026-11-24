(function () {
  'use strict';

  function initHeroMetricsFlow() {
    var features = document.querySelector('#hero .hero-features');
    var els = Array.prototype.slice.call(document.querySelectorAll('#hero .hero-metric-flow'));
    if (!features || !els.length) return;

    var prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function whenReady() {
      var definedPromise = customElements.get('number-flow')
        ? Promise.resolve()
        : customElements.whenDefined('number-flow');

      var pluginPromise = window.NumberFlowContinuous
        ? Promise.resolve()
        : new Promise(function (resolve) {
            window.addEventListener('numberflow-ready', resolve, { once: true });
          });

      return Promise.all([definedPromise, pluginPromise]);
    }

    whenReady().then(function () {
      if (prefersReducedMotion) {
        els.forEach(function (el) {
          var targetVal = parseFloat(el.dataset.value);
          if (typeof el.update === 'function' && !isNaN(targetVal)) {
            el.animated = false;
            el.update(targetVal);
          }
        });
        return;
      }

      els.forEach(function (el) {
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

      var played = false;
      function playOnce() {
        if (played) return;
        played = true;

        requestAnimationFrame(function () {
          els.forEach(function (el) {
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

      if (typeof IntersectionObserver !== 'function') {
        playOnce();
        return;
      }

      var io = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            io.disconnect();
            playOnce();
          }
        },
        { threshold: 0.1 }
      );
      io.observe(features);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroMetricsFlow, { once: true });
  } else {
    initHeroMetricsFlow();
  }
})();
