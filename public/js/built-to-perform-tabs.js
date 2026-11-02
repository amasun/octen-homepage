/* Built to Perform (tabs layout): switches the panel under the pill tab bar with auto-cycle & smooth sliding capsule. */
(function () {
  function init() {
    var section = document.getElementById('built-to-perform');
    if (!section || section.dataset.bptReady) return;
    section.dataset.bptReady = '1';

    var tabs = Array.prototype.slice.call(section.querySelectorAll('[data-bpt-tab]'));
    var panels = Array.prototype.slice.call(section.querySelectorAll('[data-bpt-panel]'));
    var tabsContainer = section.querySelector('.bpt-tabs');
    var pill = section.querySelector('.bpt-tab-pill');

    if (!tabs.length) return;

    var AUTO_SWITCH_INTERVAL = 5000;
    var autoTimer = null;
    var transitionTimer = null;
    var isPaused = false;
    var isIntersecting = true;

    function updatePill(activeTab, immediate) {
      if (!pill || !activeTab) return;
      var left = activeTab.offsetLeft;
      var width = activeTab.offsetWidth;

      if (immediate) {
        var prevTransition = pill.style.transition;
        pill.style.transition = 'none';
        pill.style.transform = 'translateX(' + left + 'px)';
        pill.style.width = width + 'px';
        pill.style.opacity = '1';
        pill.offsetHeight; // force reflow
        pill.style.transition = prevTransition || '';
      } else {
        pill.style.transform = 'translateX(' + left + 'px)';
        pill.style.width = width + 'px';
        pill.style.opacity = '1';
      }
    }

    function activate(name, focus, immediate) {
      var activeTab = null;
      tabs.forEach(function (tab) {
        var on = tab.dataset.bptTab === name;
        if (on) activeTab = tab;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
        if (on && focus) tab.focus();
      });

      if (activeTab) {
        updatePill(activeTab, immediate);
      }

      var targetPanel = null;
      var currentPanel = null;

      panels.forEach(function (panel) {
        if (panel.dataset.bptPanel === name) {
          targetPanel = panel;
        } else if (!panel.hidden && panel.classList.contains('is-active')) {
          currentPanel = panel;
        }
      });

      if (!targetPanel) return;
      if (targetPanel === currentPanel) return;

      if (transitionTimer) {
        clearTimeout(transitionTimer);
        transitionTimer = null;
      }

      if (immediate || !currentPanel) {
        panels.forEach(function (panel) {
          var on = panel === targetPanel;
          panel.hidden = !on;
          panel.classList.toggle('is-active', on);
          panel.classList.remove('is-leaving', 'is-entering');
        });
        return;
      }

      // Animate: currentPanel pushes left & fades out; targetPanel pushes in from right
      panels.forEach(function (panel) {
        if (panel !== currentPanel && panel !== targetPanel) {
          panel.hidden = true;
          panel.classList.remove('is-active', 'is-leaving', 'is-entering');
        }
      });

      currentPanel.classList.remove('is-active', 'is-entering');
      currentPanel.classList.add('is-leaving');
      currentPanel.hidden = false;

      targetPanel.hidden = false;
      targetPanel.classList.remove('is-leaving');
      targetPanel.classList.add('is-entering', 'is-active');

      transitionTimer = setTimeout(function () {
        currentPanel.hidden = true;
        currentPanel.classList.remove('is-leaving');
        targetPanel.classList.remove('is-entering');
        transitionTimer = null;
      }, 380);
    }

    function nextTab() {
      var currentIdx = -1;
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].classList.contains('is-active')) {
          currentIdx = i;
          break;
        }
      }
      var nextIdx = (currentIdx + 1) % tabs.length;
      activate(tabs[nextIdx].dataset.bptTab, false, false);
    }

    function startAutoTimer() {
      stopAutoTimer();
      if (!isPaused && isIntersecting && !document.hidden) {
        autoTimer = setInterval(nextTab, AUTO_SWITCH_INTERVAL);
      }
    }

    function stopAutoTimer() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function resetAutoTimer() {
      stopAutoTimer();
      startAutoTimer();
    }

    // Tab click & keyboard events
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        activate(tab.dataset.bptTab, false, false);
        resetAutoTimer();
      });
      tab.addEventListener('keydown', function (e) {
        var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        var targetTab = tabs[(i + step + tabs.length) % tabs.length];
        activate(targetTab.dataset.bptTab, true, false);
        resetAutoTimer();
      });
    });

    // Pause on hover
    section.addEventListener('mouseenter', function () {
      isPaused = true;
      stopAutoTimer();
    });
    section.addEventListener('mouseleave', function () {
      isPaused = false;
      startAutoTimer();
    });

    // Tab focus pause
    if (tabsContainer) {
      tabsContainer.addEventListener('focusin', function () {
        isPaused = true;
        stopAutoTimer();
      });
      tabsContainer.addEventListener('focusout', function () {
        isPaused = false;
        startAutoTimer();
      });
    }

    // Visibility change pause
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopAutoTimer();
      } else {
        startAutoTimer();
      }
    });

    // IntersectionObserver to only auto-switch when visible in viewport
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            startAutoTimer();
          } else {
            stopAutoTimer();
          }
        });
      }, { threshold: 0.1 });
      observer.observe(section);
    }

    // Window resize & font load handling for pixel-perfect pill positioning
    function refreshPill() {
      var current = tabs.filter(function (t) { return t.classList.contains('is-active'); })[0] || tabs[0];
      if (current) updatePill(current, true);
    }

    window.addEventListener('resize', refreshPill, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshPill);
    }

    // Initial activation
    var initial = tabs.filter(function (t) { return t.classList.contains('is-active'); })[0] || tabs[0];
    if (initial) {
      activate(initial.dataset.bptTab, false, true);
      requestAnimationFrame(function () {
        updatePill(initial, true);
      });
    }

    startAutoTimer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
