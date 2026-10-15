// Built to Perform — Plan A (#built-to-perform): left tab rail + Pareto chart tooltip.
// Loaded synchronously by src/sections/07-showcase/built-to-perform-a.html (extracted from an inline <script>).
    (function initBuiltToPerformTabs() {
      const ENABLE_TAB_SWITCHING = true;

      function initParetoTooltip() {
        const root = document.getElementById('built-to-perform');
        const wrapper = root ? root.querySelector('.built-perf-chart-wrapper') : null;
        const tooltip = document.getElementById('paretoChartTooltip');
        if (!wrapper || !tooltip || wrapper.dataset.tooltipBound === 'true') return;
        wrapper.dataset.tooltipBound = 'true';

        const title = document.getElementById('paretoTooltipTitle');
        const cost = document.getElementById('paretoTooltipCost');
        const score = document.getElementById('paretoTooltipScore');

        const targets = Array.from(wrapper.querySelectorAll('.pareto-point, .pareto-octen-group'));
        const ACTIVATION_RADIUS = 36; // px radius around dot to trigger tooltip

        let currentActiveTarget = null;

        function updateTooltipContent(el) {
          const rawName = el.dataset.name || '';
          // Strip out "Search" / "search" words cleanly
          const cleanName = rawName.replace(/\b[Ss]earch\b/gi, '').replace(/\s{2,}/g, ' ').trim();
          if (title) title.textContent = cleanName;
          if (cost) cost.textContent = el.dataset.cost || '';
          if (score) score.textContent = el.dataset.score || '';
        }

        function positionTooltip(mouseX, mouseY, wrapperRect) {
          const tooltipWidth = tooltip.offsetWidth || 236;
          const tooltipHalfWidth = tooltipWidth / 2;
          const clampedX = Math.max(tooltipHalfWidth + 10, Math.min(wrapperRect.width - tooltipHalfWidth - 10, mouseX));

          tooltip.style.left = clampedX + 'px';
          tooltip.style.top = mouseY + 'px';
        }

        function setActiveTarget(el, mouseX, mouseY, wrapperRect) {
          if (currentActiveTarget !== el) {
            if (currentActiveTarget) currentActiveTarget.classList.remove('active-hover');
            currentActiveTarget = el;
            if (el) el.classList.add('active-hover');
            if (el) updateTooltipContent(el);
          }
          if (el) {
            const timeTooltip = document.getElementById('timeChartTooltip');
            if (timeTooltip) timeTooltip.classList.remove('active');
            positionTooltip(mouseX, mouseY, wrapperRect);
            tooltip.classList.add('active');
          }
        }

        function clearActiveTarget() {
          if (currentActiveTarget) {
            currentActiveTarget.classList.remove('active-hover');
            currentActiveTarget = null;
          }
          targets.forEach(t => t.classList.remove('active-hover'));
          tooltip.classList.remove('active');
        }

        function handlePointerMove(e) {
          const wrapperRect = wrapper.getBoundingClientRect();
          const mouseX = e.clientX - wrapperRect.left;
          const mouseY = e.clientY - wrapperRect.top;

          // If completely outside wrapper boundaries
          if (mouseX < 0 || mouseX > wrapperRect.width || mouseY < 0 || mouseY > wrapperRect.height) {
            clearActiveTarget();
            return;
          }

          let closestTarget = null;
          let minDistance = Infinity;

          targets.forEach(target => {
            const circle = target.classList.contains('pareto-octen-group')
              ? target.querySelector('circle:last-child')
              : (target.querySelectorAll('circle')[1] || target.querySelector('circle'));

            if (!circle) return;
            const cRect = circle.getBoundingClientRect();
            const dotX = cRect.left - wrapperRect.left + cRect.width / 2;
            const dotY = cRect.top - wrapperRect.top + cRect.height / 2;

            let dist = Math.hypot(mouseX - dotX, mouseY - dotY);

            // If pointer is directly touching the SVG element (badge or hit area)
            if (target.contains(e.target)) {
              dist = Math.min(dist, 10);
            }

            if (dist < minDistance) {
              minDistance = dist;
              closestTarget = target;
            }
          });

          // Proximity trigger: activate and track within ACTIVATION_RADIUS
          if (closestTarget && minDistance <= ACTIVATION_RADIUS) {
            setActiveTarget(closestTarget, mouseX, mouseY, wrapperRect);
          } else {
            clearActiveTarget();
          }
        }

        wrapper.addEventListener('pointermove', handlePointerMove);
        wrapper.addEventListener('pointerdown', handlePointerMove);
        wrapper.addEventListener('pointerleave', clearActiveTarget);
        window.addEventListener('scroll', clearActiveTarget, { passive: true });
        document.addEventListener('touchstart', (e) => {
          if (!wrapper.contains(e.target)) {
            clearActiveTarget();
          }
        }, { passive: true });
      }

      function initTimeChartTooltip() {
        const root = document.getElementById('built-to-perform');
        const timeSection = root ? root.querySelector('.built-perf-time-section') : null;
        const timeSvg = timeSection ? timeSection.querySelector('.built-perf-time-svg') : null;
        const tooltip = document.getElementById('timeChartTooltip');
        const paretoTooltip = document.getElementById('paretoChartTooltip');
        if (!timeSection || !timeSvg || !tooltip || timeSection.dataset.tooltipBound === 'true') return;
        timeSection.dataset.tooltipBound = 'true';

        const title = document.getElementById('timeTooltipTitle');
        const badge = document.getElementById('timeTooltipBadge');
        const total = document.getElementById('timeTooltipTotal');
        const search = document.getElementById('timeTooltipSearch');
        const searchDot = document.getElementById('timeTooltipSearchDot');
        const model = document.getElementById('timeTooltipModel');

        const barGroups = Array.from(timeSvg.querySelectorAll('.built-perf-time-bar-group'));
        let activeIndex = -1;

        function updateTooltip(el) {
          if (!el) return;
          const name = el.dataset.name || '';
          const isFastest = el.dataset.fastest === 'true';
          if (title) title.textContent = name;
          if (badge) badge.style.display = isFastest ? 'inline-block' : 'none';
          if (total) {
            total.textContent = el.dataset.total || '';
            total.style.color = isFastest ? '#039855' : '#0F172A';
          }
          if (search) search.textContent = el.dataset.search || '';
          if (model) model.textContent = el.dataset.model || '';
          if (searchDot) searchDot.style.background = el.dataset.color || '#039855';
        }

        function positionTooltip(index) {
          const targetGroup = barGroups[index];
          if (!targetGroup) return;

          const sectionRect = timeSection.getBoundingClientRect();
          const groupRect = targetGroup.getBoundingClientRect();
          const tooltipWidth = tooltip.offsetWidth || 236;
          const tooltipHalfWidth = tooltipWidth / 2;

          const barCenterX = (groupRect.left - sectionRect.left) + (groupRect.width / 2);
          const clampedX = Math.max(tooltipHalfWidth + 10, Math.min(sectionRect.width - tooltipHalfWidth - 10, barCenterX));
          const targetY = (groupRect.top - sectionRect.top);

          tooltip.style.left = clampedX + 'px';
          tooltip.style.top = targetY + 'px';
        }

        function setActiveIndex(index) {
          if (index < 0 || index >= barGroups.length) {
            clearActive();
            return;
          }
          if (index === activeIndex) return;
          activeIndex = index;

          if (paretoTooltip) paretoTooltip.classList.remove('active');
          barGroups.forEach((g, i) => {
            if (i === index) g.classList.add('active-hover');
            else g.classList.remove('active-hover');
          });
          updateTooltip(barGroups[index]);
          positionTooltip(index);
          tooltip.classList.add('active');
        }

        function clearActive() {
          if (activeIndex === -1) return;
          activeIndex = -1;
          barGroups.forEach(g => g.classList.remove('active-hover'));
          tooltip.classList.remove('active');
        }

        function handlePointer(e) {
          const group = e.target.closest('.built-perf-time-bar-group');
          if (group) {
            const index = barGroups.indexOf(group);
            if (index !== -1) {
              setActiveIndex(index);
              return;
            }
          }
          clearActive();
        }

        timeSection.addEventListener('pointermove', handlePointer);
        timeSection.addEventListener('pointerdown', handlePointer);
        timeSection.addEventListener('pointerleave', clearActive);
        window.addEventListener('scroll', clearActive, { passive: true });
      }

      function setup() {
        initParetoTooltip();
        initTimeChartTooltip();

        const container = document.getElementById('perfTabsList');
        if (!container || container.dataset.bound === 'true') return;
        container.dataset.bound = 'true';

        const tabs = container.querySelectorAll('.built-perf-item');
        const chartCost = document.getElementById('chartCostEfficiency');
        const chartAcc = document.getElementById('chartAccuracy');
        const bar = document.getElementById('perfRailBar');
        const dot = document.getElementById('perfRailDot');

        function updateRail() {
          const activeItem = container.querySelector('.built-perf-item.active');
          if (!activeItem || !bar || !dot) return;

          const containerRect = container.getBoundingClientRect();
          const itemRect = activeItem.getBoundingClientRect();
          const label = activeItem.querySelector('.built-perf-label');
          const labelRect = label ? label.getBoundingClientRect() : itemRect;

          const dotTop = (labelRect.top - containerRect.top) + (labelRect.height / 2) - 6.5;
          const itemTop = itemRect.top - containerRect.top;
          const itemHeight = itemRect.height;

          dot.style.top = `${dotTop}px`;
          bar.style.top = `${itemTop}px`;
          bar.style.height = `${itemHeight}px`;
        }

        requestAnimationFrame(() => {
          updateRail();
          setTimeout(updateRail, 150);
        });
        window.addEventListener('resize', updateRail, { passive: true });

        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            if (!ENABLE_TAB_SWITCHING) {
              return;
            }

            const key = tab.dataset.perfTab;
            tabs.forEach(t => {
              const isTarget = t === tab;
              const body = t.querySelector('.built-perf-body');

              if (isTarget) {
                t.classList.add('active');
                if (body) {
                  body.style.display = 'block';
                  body.style.opacity = '1';
                  body.style.height = 'auto';
                }
              } else {
                t.classList.remove('active');
                if (body) {
                  body.style.display = 'none';
                  body.style.opacity = '0';
                  body.style.height = '0';
                }
              }
            });

            // Toggle right-hand benchmark panels
            if (chartCost && chartAcc) {
              if (key === 'accuracy') {
                chartCost.style.display = 'none';
                chartAcc.style.display = 'block';
              } else {
                chartAcc.style.display = 'none';
                chartCost.style.display = 'block';
              }
            }

            requestAnimationFrame(updateRail);
          });
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
      } else {
        setup();
      }
    })();
