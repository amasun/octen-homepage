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
    var copyItems = Array.prototype.slice.call(section.querySelectorAll('[data-bpt-copy]'));
    var statCards = Array.prototype.slice.call(section.querySelectorAll('.bpt-stat-card'));
    // 点击上方指标卡 → 下方轮播跳到对应图表(卡片里的外链照常打开)
    statCards.forEach(function (c) {
      var idx = +c.getAttribute('data-bpt-jump');
      if (isNaN(idx)) return;
      c.setAttribute('role', 'button'); c.tabIndex = 0;
      function go(e) {
        if (e.target.closest && e.target.closest('a')) return;
        var p = panels[idx];
        if (p) { e.preventDefault(); activate(p.dataset.bptPanel, false, false); }
      }
      c.addEventListener('click', go);
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') go(e); });
    });
    var tabsContainer = section.querySelector('.bpt-stats') || section.querySelector('.bpt-tabs');
    var pill = section.querySelector('.bpt-tab-pill');
    var progressBars = Array.prototype.slice.call(section.querySelectorAll('.bpt-tab-progress-bar'));
    var railViewport = section.querySelector('#bptRailViewport') || section.querySelector('.bpt-rail-viewport');
    var railTrack = section.querySelector('#bptRailTrack') || section.querySelector('.bpt-rail-track');

    if (!panels.length) return;

    // 底部圆点分页器:每张轮播卡片一个点,当前卡片为拉长的胶囊;点击跳转
    var dots = [];
    if (railViewport && railViewport.parentNode) {
      var dotsWrap = document.createElement('div');
      dotsWrap.className = 'bpt-dots';
      dotsWrap.setAttribute('role', 'tablist');
      dotsWrap.setAttribute('aria-label', 'Performance charts');
      panels.forEach(function (panel, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'bpt-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Show chart ' + (i + 1) + ' of ' + panels.length);
        dot.addEventListener('click', function () {
          activate(panel.dataset.bptPanel, false, false);
          resetAutoTimer();
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
      railViewport.parentNode.insertBefore(dotsWrap, railViewport.nextSibling);
    }

    // 左右两侧圆形翻页按钮:上一张 / 下一张(循环)。放在 section 上而不是跑道里(跑道有边缘渐隐遮罩),垂直居中于当前卡片
    var arrowPrev = null, arrowNext = null;
    if (railViewport) {
      var mkArrow = function (dir) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'bpt-arrow bpt-arrow--' + dir;
        b.setAttribute('aria-label', dir === 'prev' ? 'Previous chart' : 'Next chart');
        b.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7') + '"/></svg>';
        b.addEventListener('click', function () {
          if (dir === 'prev') prevTab(); else nextTab();
          resetAutoTimer();
        });
        section.appendChild(b);
        return b;
      };
      arrowPrev = mkArrow('prev');
      arrowNext = mkArrow('next');
    }
    function placeArrows() {
      if (!arrowPrev || !railViewport) return;
      var top = (railViewport.getBoundingClientRect().top - section.getBoundingClientRect().top) + railViewport.offsetHeight / 2;
      arrowPrev.style.top = arrowNext.style.top = top + 'px';
      // 水平位置:当前卡片(居中)两侧外侧 30px;窄屏夹在屏幕内
      var active = panels.filter(function (p) { return p.classList.contains('is-active'); })[0];
      if (!active) return;
      var secW = section.clientWidth, size = arrowPrev.offsetWidth || 44, gap = 30;
      var half = active.offsetWidth / 2, cx = secW / 2;
      var minLeft = 8;
      arrowPrev.style.left = Math.max(minLeft, cx - half - gap - size) + 'px';
      arrowNext.style.left = Math.min(secW - minLeft - size, cx + half + gap) + 'px';
      arrowPrev.style.right = arrowNext.style.right = 'auto';
    }

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

    // The rail is as tall as its tallest panel; size the viewport to the active panel instead so the
    // section grows for tall tabs (Speed on mobile, Value) and shrinks back for single-card tabs.
    function syncRailHeight(activePanel, immediate) {
      if (!railViewport || !activePanel) return;
      var h = activePanel.offsetHeight + 'px';
      if (immediate) {
        var prevTransition = railViewport.style.transition;
        railViewport.style.transition = 'none';
        railViewport.style.height = h;
        railViewport.offsetHeight; // force reflow
        railViewport.style.transition = prevTransition || '';
      } else {
        railViewport.style.height = h;
      }
    }

    function centerActivePanel(immediate) {
      if (!railViewport || !railTrack) return;
      var activePanel = panels.filter(function (p) { return p.classList.contains('is-active'); })[0];
      if (!activePanel) return;
      syncRailHeight(activePanel, immediate);
      placeArrows();

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

      copyItems.forEach(function (copy) {
        var on = copy.dataset.bptCopy === name;
        copy.classList.toggle('is-active', on);
      });

      var targetPanel = null;
      var activeIdx = -1;
      panels.forEach(function (panel) {
        var on = panel.dataset.bptPanel === name;
        if (on) { targetPanel = panel; activeIdx = panels.indexOf(panel); }
        panel.classList.toggle('is-active', on);
        panel.setAttribute('aria-hidden', on ? 'false' : 'true');
      });

      // 上方四张指标数字:下方轮播切到对应图表时变绿。前三张图表(Value / Speed / Speed 任务)对应 Rank,之后一一对应 Scale / Freshness / Retrieval models
      var statMap = [0, 0, 0, 1, 2, 3];
      statCards.forEach(function (c, ci) { c.classList.toggle('is-lit', activeIdx >= 0 && statMap[activeIdx] === ci); });

      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === activeIdx);
        d.setAttribute('aria-selected', i === activeIdx ? 'true' : 'false');
      });

      // 第一张隐藏左按钮,最后一张隐藏右按钮
      if (arrowPrev) {
        arrowPrev.classList.toggle('is-hidden', activeIdx <= 0);
        arrowNext.classList.toggle('is-hidden', activeIdx >= panels.length - 1);
      }

      if (targetPanel) {
        centerActivePanel(immediate);
      }

      restartProgressBar();
    }

    function restartProgressBar() {
      if (!progressBars.length) return;
      progressBars.forEach(function (bar) {
        bar.classList.remove('is-animating');
        bar.style.animationPlayState = 'running';
      });
      void section.offsetWidth; // force reflow
      if (!isPaused && isIntersecting && !document.hidden) {
        progressBars.forEach(function (bar) { bar.classList.add('is-animating'); });
      }
    }

    function pauseProgressBar() {
      progressBars.forEach(function (bar) { bar.style.animationPlayState = 'paused'; });
    }

    function currentPanelIndex() {
      for (var i = 0; i < panels.length; i++) {
        if (panels[i].classList.contains('is-active')) return i;
      }
      return 0;
    }

    function nextTab() {
      activate(panels[(currentPanelIndex() + 1) % panels.length].dataset.bptPanel, false, false);
    }

    function prevTab() {
      activate(panels[(currentPanelIndex() - 1 + panels.length) % panels.length].dataset.bptPanel, false, false);
    }

    function startAutoTimer() {
      stopAutoTimer();
      if (!isPaused && isIntersecting && !document.hidden) {
        autoTimer = setInterval(nextTab, AUTO_SWITCH_INTERVAL);
        restartProgressBar();
      }
    }

    function stopAutoTimer() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
      pauseProgressBar();
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
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tab.click(); return; }
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
      centerActivePanel(true);
    }

    window.addEventListener('resize', refreshLayout, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshLayout);
    }

    // Initial activation
    var firstPanel = panels.filter(function (p) { return p.classList.contains('is-active'); })[0] || panels[0];
    activate(firstPanel.dataset.bptPanel, false, true);
    requestAnimationFrame(function () { centerActivePanel(true); });
    setTimeout(refreshLayout, 100);

    startAutoTimer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
