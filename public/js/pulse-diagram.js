/**
 * Pulse Search Diagram (#tier-pulse .st-art--pulse)
 * 12x6 LLM inference token-matrix marquee: cell 0 is the fixed brain tile,
 * cells 1..71 stream gray tokens and flip immediately to green Octen-bot tiles on hits.
 */
(function () {
  'use strict';

  var tier = document.getElementById('tier-pulse');
  if (!tier) return;
  var art = tier.querySelector('.st-art--pulse');
  if (!art) return;

  var grid = art.querySelector('[data-pulse-grid]');
  var countEl = art.querySelector('[data-pulse-count]');
  var stateEl = art.querySelector('[data-pulse-state]');
  var stateTextEl = art.querySelector('[data-pulse-state-text]');
  if (!grid || !countEl) return;

  var TOTAL = 96; // 12 cols x 8 rows
  var STEP_MS = 45;
  var HOLD_MS = 1500;

  var PATTERNS = [
    [6, 14, 21, 29, 34, 38, 45, 51, 56, 61, 66, 70, 75, 81, 87, 93],
    [4, 11, 18, 26, 33, 40, 44, 49, 55, 62, 65, 69, 76, 82, 88, 94],
  ];

  var BOT_SVG =
    '<svg class="st-pmx-bot" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M30.3644 21.5503C30.9655 21.5503 31.4532 22.0527 31.4533 22.6723V24.4721C31.4533 25.0918 30.9656 25.5952 30.3644 25.5952H28.9435C28.6536 25.5952 28.3769 25.7132 28.173 25.9233L27.8488 26.2583C27.645 26.4699 27.5296 26.755 27.5295 27.0522V28.518C27.5294 29.1376 27.0417 29.6401 26.4406 29.6401H24.6945C24.0936 29.6399 23.6058 29.1375 23.6057 28.518V26.7182C23.6057 26.0986 24.0936 25.5954 24.6945 25.5952H26.4406C26.7305 25.5952 27.0072 25.4771 27.2111 25.2671C27.415 25.0553 27.5295 24.7695 27.5295 24.4721V22.6723C27.5296 22.0529 28.0175 21.5505 28.6183 21.5503H30.3644ZM3.22675 21.5483C3.82786 21.5483 4.31659 22.0516 4.31659 22.6714V24.3872H4.31952C4.31958 24.6845 4.43403 24.9694 4.63788 25.1811C4.89307 25.4457 5.24034 25.5932 5.60272 25.5932H7.07245C7.67355 25.5932 8.16129 26.0966 8.16132 26.7163V28.5161C8.16132 29.1358 7.67357 29.6391 7.07245 29.6391H5.32635C4.72532 29.639 4.23749 29.1357 4.23749 28.5161V27.0014C4.23749 26.6277 4.09386 26.271 3.8371 26.0063C3.58187 25.7417 3.23467 25.5932 2.87225 25.5932H1.4826C0.881569 25.5932 0.393802 25.0908 0.393738 24.4712V22.6714C0.393738 22.0517 0.88153 21.5499 1.4826 21.5483H3.22675ZM13.5275 25.5942C14.1289 25.5942 14.6163 26.0964 14.6164 26.7163V28.5151C14.6163 29.135 14.1289 29.6372 13.5275 29.6372H11.7834C11.182 29.6372 10.6946 29.135 10.6945 28.5151V26.7163C10.6946 26.0964 11.182 25.5942 11.7834 25.5942H13.5275ZM19.9836 25.5942C20.5848 25.5943 21.0723 26.0964 21.0724 26.7163V28.5151C21.0724 29.135 20.5849 29.6371 19.9836 29.6372H18.2394C17.6381 29.6372 17.1497 29.135 17.1496 28.5151V26.7163C17.1497 26.0964 17.6381 25.5942 18.2394 25.5942H19.9836ZM21.0959 4.68503C21.697 4.68503 22.1848 5.18836 22.1848 5.80807V7.22311C22.1848 7.56411 22.3164 7.89153 22.549 8.13132L22.7131 8.30124C22.9457 8.54103 23.2637 8.67624 23.593 8.67624H24.923C25.5242 8.67624 26.0119 9.17957 26.0119 9.79928V20.8559L26.0148 20.8589C26.0147 21.4785 25.527 21.9809 24.926 21.9809H9.33221C8.73116 21.9809 8.24344 21.4785 8.24335 20.8589V19.3169C8.24327 19.018 8.12784 18.733 7.92401 18.5229L7.9201 18.518C7.63314 18.2222 7.24285 18.0561 6.83807 18.0561H5.52167C4.92055 18.0561 4.43182 17.5528 4.43182 16.9331V5.80807C4.43182 5.18836 4.92055 4.68503 5.52167 4.68503H21.0959ZM9.36053 8.64303C8.75944 8.64304 8.27169 9.14639 8.27167 9.76608V16.5786C8.27174 16.9973 8.43205 17.3971 8.71893 17.6928C8.92423 17.9029 9.20016 18.0218 9.48846 18.0219H21.0851C21.6863 18.0219 22.174 17.5186 22.174 16.8989V9.92624C22.1739 9.5855 22.0431 9.25871 21.8107 9.01901H21.8117C21.5776 8.77922 21.2601 8.64303 20.9308 8.64303H9.36053ZM13.0021 11.5991C13.6034 11.5991 14.0908 12.1013 14.091 12.7212V14.2944C14.0909 14.9143 13.6035 15.4165 13.0021 15.4165H11.4767C10.8754 15.4165 10.388 14.9143 10.3879 14.2944V12.7212C10.3881 12.1013 10.8755 11.5991 11.4767 11.5991H13.0021ZM18.8996 11.5991C19.5009 11.5991 19.9883 12.1013 19.9885 12.7212V14.2944C19.9884 14.9143 19.5009 15.4165 18.8996 15.4165H17.3742C16.773 15.4163 16.2854 14.9142 16.2853 14.2944V12.7212C16.2856 12.1014 16.7731 11.5993 17.3742 11.5991H18.8996Z" fill="#ffffff"/>' +
    '</svg>';

  var cells = [];
  for (var i = 0; i < TOTAL; i++) {
    var cell = document.createElement('span');
    cell.className = 'st-pmx-cell';
    grid.appendChild(cell);
    cells.push(cell);
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var patternIdx = 0;
  var activeHits = {};
  var cursor = 0;
  var lookups = 0;
  var timer = null;
  var stateTimer = null;
  var running = false;

  function setState(mode) {
    if (stateEl) {
      stateEl.classList.toggle('is-searching', mode === 'searching');
      stateEl.classList.toggle('is-done', mode === 'done');
    }
    if (stateTextEl) {
      stateTextEl.textContent = mode === 'searching' ? 'Searching' : mode === 'done' ? 'Complete' : 'Thinking';
    }
  }

  function setPattern(idx) {
    activeHits = {};
    PATTERNS[idx].forEach(function (pos) {
      activeHits[pos] = true;
    });
  }

  function resetGrid() {
    cursor = 0;
    lookups = 0;
    countEl.textContent = '0';
    if (stateTimer) {
      clearTimeout(stateTimer);
      stateTimer = null;
    }
    setState('thinking');
    for (var i = 0; i < TOTAL; i++) {
      cells[i].className = 'st-pmx-cell';
      if (activeHits[i]) {
        cells[i].innerHTML = BOT_SVG;
      } else if (cells[i].firstChild) {
        cells[i].innerHTML = '';
      }
    }
  }

  function renderStatic() {
    setPattern(0);
    resetGrid();
    for (var i = 0; i < TOTAL; i++) {
      if (activeHits[i]) {
        cells[i].classList.add('is-hit');
        lookups++;
      } else {
        cells[i].classList.add('is-done');
      }
    }
    countEl.textContent = String(lookups);
    setState('done');
  }

  function tick() {
    if (!running) return;

    if (cursor >= TOTAL) {
      if (stateTimer) {
        clearTimeout(stateTimer);
        stateTimer = null;
      }
      setState('done');
      timer = setTimeout(function () {
        if (!running) return;
        patternIdx = (patternIdx + 1) % PATTERNS.length;
        setPattern(patternIdx);
        resetGrid();
        tick();
      }, HOLD_MS);
      return;
    }

    var el = cells[cursor];
    if (activeHits[cursor]) {
      el.classList.add('is-hit', 'is-pulse');
      lookups++;
      countEl.textContent = String(lookups);
      setState('searching');
      if (stateTimer) clearTimeout(stateTimer);
      stateTimer = setTimeout(function () {
        stateTimer = null;
        if (running) setState('thinking');
      }, 240);
    } else {
      el.classList.add('is-done');
    }

    cursor++;
    timer = setTimeout(tick, STEP_MS);
  }

  function start() {
    if (running) return;
    if (reduce) {
      renderStatic();
      return;
    }
    running = true;
    setPattern(patternIdx);
    resetGrid();
    tick();
  }

  function stop() {
    running = false;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (stateTimer) {
      clearTimeout(stateTimer);
      stateTimer = null;
    }
    setState('thinking');
  }

  var inView = false;
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          inView = entry.isIntersecting;
          if (inView && !document.hidden) start();
          else stop();
        });
      },
      { threshold: 0.25 }
    );
    io.observe(tier);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (inView) start();
    });
  } else {
    inView = true;
    start();
  }
})();
