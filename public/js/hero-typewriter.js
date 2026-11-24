(function () {
  'use strict';

  var WORDS = [
    'Real-Time',
    'Web',
    'Broad',
    'Image',
    'Video',
    'News',
    'Business',
    'Place',
    'Design',
    'Everything',
  ];

  var INITIAL_HOLD_MS = 1800;
  var HOLD_MS = 2200;
  var DELETE_MS = 42;
  var SWITCH_PAUSE_MS = 220;
  var TYPE_BASE_MS = 75;

  function initHeroTypewriter() {
    var hero = document.getElementById('hero');
    var heading = hero ? hero.querySelector('h1') : null;
    var slot = document.getElementById('heroTypeSlot');
    var textEl = document.getElementById('heroTypeText');
    var cursorEl = document.getElementById('heroTypeCursor');

    if (!hero || !heading || !slot || !textEl || !cursorEl) return;

    var prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      textEl.textContent = WORDS[0];
      return;
    }

    var measureEl = document.createElement('span');
    measureEl.className = 'hero-type-measure';
    measureEl.setAttribute('aria-hidden', 'true');
    slot.appendChild(measureEl);

    var currentIndex = 0;
    var charIndex = WORDS[0].length;
    var phase = 'holding'; // 'holding' | 'deleting' | 'switching' | 'typing'
    var timerId = null;
    var isHovered = false;
    var isVisible = true;

    function measureWordWidth(word) {
      measureEl.textContent = word;
      var textWidth = measureEl.getBoundingClientRect().width;
      var cursorWidth = cursorEl.getBoundingClientRect().width;
      var cursorMargin = parseFloat(window.getComputedStyle(cursorEl).marginLeft || '0') || 0;
      var totalWidth = textWidth + cursorWidth + cursorMargin + 4;
      if (totalWidth > 0) {
        slot.style.width = Math.ceil(totalWidth) + 'px';
      }
    }

    function clearTimer() {
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
    }

    function scheduleNext(fn, delay) {
      clearTimer();
      if (!isVisible) return;
      timerId = setTimeout(fn, delay);
    }

    function setBlinking(on) {
      if (on) {
        cursorEl.classList.add('is-blinking');
      } else {
        cursorEl.classList.remove('is-blinking');
      }
    }

    function step() {
      if (!isVisible) return;

      var targetWord = WORDS[currentIndex];

      if (phase === 'holding') {
        if (isHovered) {
          setBlinking(true);
          return;
        }
        phase = 'deleting';
        setBlinking(false);
        scheduleNext(step, DELETE_MS);
        return;
      }

      if (phase === 'deleting') {
        if (charIndex > 0) {
          charIndex -= 1;
          textEl.textContent = targetWord.slice(0, charIndex);
          scheduleNext(step, DELETE_MS);
          return;
        }

        currentIndex = (currentIndex + 1) % WORDS.length;
        phase = 'switching';
        measureWordWidth(WORDS[currentIndex]);
        scheduleNext(step, SWITCH_PAUSE_MS);
        return;
      }

      if (phase === 'switching') {
        phase = 'typing';
        charIndex = 0;
        setBlinking(false);
        scheduleNext(step, TYPE_BASE_MS);
        return;
      }

      if (phase === 'typing') {
        if (charIndex < targetWord.length) {
          charIndex += 1;
          textEl.textContent = targetWord.slice(0, charIndex);
          var jitter = Math.round((Math.random() - 0.5) * 26);
          scheduleNext(step, Math.max(40, TYPE_BASE_MS + jitter));
          return;
        }

        phase = 'holding';
        setBlinking(true);
        if (!isHovered) {
          scheduleNext(step, HOLD_MS);
        }
      }
    }

    function remeasureActive() {
      measureWordWidth(WORDS[currentIndex]);
    }

    // Initial measurement & font-ready remeasurement
    textEl.textContent = WORDS[0];
    setBlinking(true);
    remeasureActive();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(remeasureActive);
    }

    window.addEventListener('resize', remeasureActive);

    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(remeasureActive).observe(heading);
    }

    heading.addEventListener('mouseenter', function () {
      isHovered = true;
      if (phase === 'holding') {
        clearTimer();
      }
    });

    heading.addEventListener('mouseleave', function () {
      isHovered = false;
      if (phase === 'holding' && isVisible) {
        scheduleNext(step, 450);
      }
    });

    if (typeof IntersectionObserver === 'function') {
      new IntersectionObserver(
        function (entries) {
          var nowVisible = entries[0].isIntersecting;
          if (nowVisible === isVisible) return;
          isVisible = nowVisible;
          if (isVisible) {
            if (phase === 'holding') {
              if (!isHovered) scheduleNext(step, 600);
            } else {
              scheduleNext(step, 80);
            }
          } else {
            clearTimer();
          }
        },
        { threshold: 0.01 }
      ).observe(hero);
    }

    scheduleNext(step, INITIAL_HOLD_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroTypewriter, { once: true });
  } else {
    initHeroTypewriter();
  }
})();
