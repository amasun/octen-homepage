/**
 * Showcase「Try Octen in our applications」应用卡片轨道
 *  - 左右切换按钮:每次滚动一张卡(卡宽 + 间距),到两端时禁用对应按钮;内容不溢出时隐藏按钮组
 *  - 边缘渐隐:按滚动位置写 --sc-fl / --sc-fr(左 / 右渐隐长度),到头的一侧不渐隐
 */
(function () {
  'use strict';
  var track = document.querySelector('#showcase .sc-apps');
  var nav = document.querySelector('#showcase .sc-nav');
  if (!track) return;
  var prev = nav && nav.querySelector('[data-dir="-1"]');
  var next = nav && nav.querySelector('[data-dir="1"]');

  function fadeLen() { return window.matchMedia('(max-width: 767px)').matches ? 48 : 120; }

  function update() {
    var max = track.scrollWidth - track.clientWidth;
    var x = track.scrollLeft;
    var atStart = x <= 2, atEnd = x >= max - 2, f = fadeLen();
    track.style.setProperty('--sc-fl', atStart ? '0px' : f + 'px');
    track.style.setProperty('--sc-fr', atEnd ? '0px' : f + 'px');
    if (nav) {
      nav.hidden = max <= 2;
      if (prev) prev.disabled = atStart;
      if (next) next.disabled = atEnd;
    }
  }

  function step() {
    var card = track.querySelector('.sc-app');
    if (!card) return track.clientWidth * 0.8;
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  if (nav) {
    nav.addEventListener('click', function (e) {
      var btn = e.target.closest('.sc-nav-btn');
      if (!btn || btn.disabled) return;
      track.scrollBy({ left: step() * +btn.getAttribute('data-dir'), behavior: 'smooth' });
    });
  }

  var ticking = false;
  track.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }, { passive: true });
  window.addEventListener('resize', update);
  if (typeof ResizeObserver === 'function') new ResizeObserver(update).observe(track);
  update();

  /* hover 到应用卡片时，在背景图上随机亮起纯白点阵 */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    var cards = track.querySelectorAll('.sc-app');
    cards.forEach(function (card) {
      var banner = card.querySelector('.sc-banner');
      if (!banner) return;

      var grid = document.createElement('div');
      grid.className = 'sc-dots';
      grid.setAttribute('aria-hidden', 'true');
      var dots = [];
      for (var i = 0; i < 72; i++) {
        var dot = document.createElement('i');
        grid.appendChild(dot);
        dots.push(dot);
      }
      var icon = banner.querySelector('.sc-icon');
      banner.insertBefore(grid, icon || null);

      var timer = null;
      var burst = function () {
        var count = 5 + Math.floor(Math.random() * 4);
        for (var k = 0; k < count; k++) {
          (function (d, peak) {
            d.classList.add(peak ? 'is-peak' : 'is-lit');
            setTimeout(function () {
              d.classList.remove('is-lit', 'is-peak');
            }, 420 + Math.floor(Math.random() * 260));
          })(dots[Math.floor(Math.random() * dots.length)], Math.random() < 0.25);
        }
      };

      card.addEventListener('mouseenter', function () {
        if (timer) clearInterval(timer);
        burst();
        timer = setInterval(burst, 180);
      });

      card.addEventListener('mouseleave', function () {
        if (timer) { clearInterval(timer); timer = null; }
        dots.forEach(function (d) { d.classList.remove('is-lit', 'is-peak'); });
      });
    });
  }
})();
