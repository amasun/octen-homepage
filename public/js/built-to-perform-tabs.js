/* Built to Perform (tabs layout): 五连屏全视口居中画卷跑道画廊 (Five-Screen Centered Carousel)
   - Dynamic viewport-centered horizontal track
   - Smooth transform slide with spring-like cubic bezier
   - Inactive side cards decay opacity & scale; click-to-center support
   - Sliding capsule indicator & 5s auto-cycle
*/
(function () {
  function init() {
    var section = document.getElementById('built-to-perform');
    if (!section || section.dataset.bptReady) return;
    section.dataset.bptReady = '1';

    var tabs = Array.prototype.slice.call(section.querySelectorAll('[data-bpt-tab]'));
    var panels = Array.prototype.slice.call(section.querySelectorAll('[data-bpt-panel]'));
    var tabsContainer = section.querySelector('.bpt-tabs');
    var pill = section.querySelector('.bpt-tab-pill');
    var railViewport = section.querySelector('#bptRailViewport') || section.querySelector('.bpt-rail-viewport');
    var railTrack = section.querySelector('#bptRailTrack') || section.querySelector('.bpt-rail-track');

    if (!tabs.length || !panels.length) return;

    var AUTO_SWITCH_INTERVAL = 5000;
    var autoTimer = null;
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

    function centerActivePanel(immediate) {
      if (!railViewport || !railTrack) return;
      var activePanel = panels.filter(function (p) { return p.classList.contains('is-active'); })[0];
      if (!activePanel) return;

      var panelCenter = activePanel.offsetLeft + (activePanel.offsetWidth / 2);
      var viewportCenter = railViewport.offsetWidth / 2;
      var targetX = Math.round(viewportCenter - panelCenter);

      if (immediate) {
        var prevTransition = railTrack.style.transition;
        railTrack.style.transition = 'none';
        railTrack.style.transform = 'translate3d(' + targetX + 'px, 0, 0)';
        railTrack.offsetHeight; // force reflow
        railTrack.style.transition = prevTransition || '';
      } else {
        railTrack.style.transform = 'translate3d(' + targetX + 'px, 0, 0)';
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
      panels.forEach(function (panel) {
        var on = panel.dataset.bptPanel === name;
        if (on) targetPanel = panel;
        panel.classList.toggle('is-active', on);
        panel.setAttribute('aria-hidden', on ? 'false' : 'true');
      });

      if (targetPanel) {
        centerActivePanel(immediate);
      }
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

    function prevTab() {
      var currentIdx = -1;
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].classList.contains('is-active')) {
          currentIdx = i;
          break;
        }
      }
      var prevIdx = (currentIdx - 1 + tabs.length) % tabs.length;
      activate(tabs[prevIdx].dataset.bptTab, false, false);
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

    // Inactive card click to center
    panels.forEach(function (panel) {
      panel.addEventListener('click', function (e) {
        if (!panel.classList.contains('is-active')) {
          e.preventDefault();
          activate(panel.dataset.bptPanel, false, false);
          resetAutoTimer();
        }
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

    // Touch swipe support on rail
    var touchStartX = 0;
    var touchStartY = 0;
    if (railViewport) {
      railViewport.addEventListener('touchstart', function (e) {
        if (e.touches && e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      railViewport.addEventListener('touchend', function (e) {
        if (e.changedTouches && e.changedTouches.length === 1) {
          var diffX = e.changedTouches[0].clientX - touchStartX;
          var diffY = e.changedTouches[0].clientY - touchStartY;
          if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX < 0) {
              nextTab();
            } else {
              prevTab();
            }
            resetAutoTimer();
          }
        }
      }, { passive: true });
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

    // Window resize & font load handling for pixel-perfect pill & rail positioning
    function refreshLayout() {
      var current = tabs.filter(function (t) { return t.classList.contains('is-active'); })[0] || tabs[0];
      if (current) {
        updatePill(current, true);
        centerActivePanel(true);
      }
    }

    window.addEventListener('resize', refreshLayout, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshLayout);
    }

    // Initial activation
    var initial = tabs.filter(function (t) { return t.classList.contains('is-active'); })[0] || tabs[0];
    if (initial) {
      activate(initial.dataset.bptTab, false, true);
      requestAnimationFrame(function () {
        updatePill(initial, true);
        centerActivePanel(true);
      });
      setTimeout(function () {
        refreshLayout();
      }, 100);
    }

    startAutoTimer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
