/* Radar card: draws the radar from table rows, links row hover to series,
   and shows a metric tooltip when hovering near one of Octen's radar points.
   The axis count follows the rows' data-radar length: 5 for Option 2, 4 for the Option 1 Value tab
   (.bpr-card[data-radar-axes="value4"]). */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var CX = 250;
  var CY = 219;
  var R = 150;

  function point(i, value, n) {
    var a = (-90 + i * (360 / n)) * Math.PI / 180;
    var r = R * value / 100;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  }

  function points(values) {
    return values.map(function (v, i) {
      var p = point(i, v, values.length);
      return p[0].toFixed(2) + ',' + p[1].toFixed(2);
    }).join(' ');
  }

  function fill(v, n) {
    var out = [];
    for (var i = 0; i < n; i++) out.push(v);
    return out;
  }

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  // The card appears in both Option 1 (Value tab) and Option 2, so set up every instance once.
  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('.bpr-card'), setupCard);
  }

  function setupCard(card) {
    if (card.dataset.radarReady) return;
    card.dataset.radarReady = '1';

    var grid = card.querySelector('.bpr-grid');
    var seriesLayer = card.querySelector('.bpr-series');
    var rows = Array.prototype.slice.call(card.querySelectorAll('[data-radar]'));
    if (!rows.length) return;
    var n = rows[0].dataset.radar.split(',').length;

    // Rings (20..100) and spokes
    grid.appendChild(el('polygon', { 'class': 'bpr-ring-outer', points: points(fill(100, n)) }));
    [20, 40, 60, 80, 100].forEach(function (v) {
      grid.appendChild(el('polygon', { 'class': 'bpr-ring', points: points(fill(v, n)) }));
    });
    var spokes = [];
    for (var i = 0; i < n; i++) {
      var end = point(i, 100, n);
      var spoke = el('line', { 'class': 'bpr-spoke', x1: CX, y1: CY, x2: end[0], y2: end[1] });
      grid.appendChild(spoke);
      spokes.push(spoke);
    }

    // Competitors first, Octen last so it draws on top
    var ordered = rows.filter(function (r) { return !r.classList.contains('is-octen'); })
      .concat(rows.filter(function (r) { return r.classList.contains('is-octen'); }));

    var groups = {};
    ordered.forEach(function (row) {
      var key = row.dataset.radarKey;
      var values = row.dataset.radar.split(',').map(Number);
      var g = el('g', { 'class': 'bpr-shape' + (row.classList.contains('is-octen') ? ' is-octen' : ''), 'data-radar-key': key });
      g.appendChild(el('polygon', { points: points(values) }));
      values.forEach(function (v, idx) {
        var p = point(idx, v, n);
        g.appendChild(el('circle', { cx: p[0], cy: p[1], r: 3.5 }));
      });
      seriesLayer.appendChild(g);
      groups[key] = g;
    });

    function highlight(key) {
      card.classList.toggle('is-focusing', !!key);
      Object.keys(groups).forEach(function (k) {
        groups[k].classList.toggle('is-focus', k === key);
      });
      rows.forEach(function (row) {
        row.classList.toggle('is-focus', row.dataset.radarKey === key);
      });
    }

    rows.forEach(function (row) {
      row.addEventListener('mouseenter', function () { highlight(row.dataset.radarKey); });
      row.addEventListener('mouseleave', function () { highlight(null); });
    });
    Object.keys(groups).forEach(function (k) {
      groups[k].addEventListener('mouseenter', function () { highlight(k); });
      groups[k].addEventListener('mouseleave', function () { highlight(null); });
    });

    initAxisTips(card, rows, spokes, AXIS_SETS[card.dataset.radarAxes] || AXIS_SETS.default);
  }

  // Octen point tooltips: hovering (or focusing) around one of Octen's radar points explains
  // that metric and gives Octen's score (plus the raw value from the table for the derived axes).
  var AXIS_SETS = {
    // Option 2: DeepSearchQA (top), BrowseComp, Omniscience, Cost Efficiency, Speed (clockwise)
    'default': [
      { name: 'DeepSearchQA F1', desc: 'Broad research questions that need many searches; F1 over the listed answer items.' },
      { name: 'BrowseComp Accuracy', desc: 'Hard-to-find facts that need multi-hop browsing; exact-answer accuracy.' },
      { name: 'Omniscience Accuracy', desc: '600 factual questions across 6 domains; how much search adds to the model.' },
      { name: 'Cost Efficiency', desc: 'Cost per task (model + search). Score = cheapest cost ÷ provider cost × 100.', raw: '.bpr-c-cost', unit: 'per task' },
      { name: 'Speed', desc: 'Time per task (model + search). Score = fastest time ÷ provider time × 100.', raw: '.bpr-c-time', unit: 'per task' }
    ],
    // Option 1 Value tab: Search Index (top), Cost Efficiency, Task Speed, Query Speed (clockwise)
    value4: [
      { name: 'Search Index', desc: 'Mean of DeepSearchQA F1, BrowseComp and AA-Omniscience accuracy. Score = provider index ÷ highest index × 100.', raw: '.bpr-c-idx', unit: 'index' },
      { name: 'Cost Efficiency', desc: 'Cost per task (model + search). Score = cheapest cost ÷ provider cost × 100.', raw: '.bpr-c-cost', unit: 'per task' },
      { name: 'Task Speed', desc: 'Time per task (model + search). Score = fastest time ÷ provider time × 100.', raw: '.bpr-c-time', unit: 'per task' },
      { name: 'Query Speed', desc: 'Search API response time for one query. Score = fastest time ÷ provider time × 100.', raw: '.bpr-c-tpq', unit: 'per query' }
    ]
  };
  var VIEW_Y = 36; // radar SVG viewBox y-offset (viewBox="0 36 500 368")
  var VIEW_W = 500;

  function initAxisTips(card, rows, spokes, axisMeta) {
    var radar = card.querySelector('.bpr-radar');
    var svg = card.querySelector('.bpr-radar-svg');
    if (!radar || !svg) return;

    var tip = document.createElement('div');
    tip.className = 'bpr-tip';
    tip.setAttribute('role', 'tooltip');
    radar.appendChild(tip);

    var octenRow = rows.filter(function (r) { return r.classList.contains('is-octen'); })[0];
    if (!octenRow) return;
    var octen = octenRow.dataset.radar.split(',').map(Number);
    var n = octen.length;

    function render(i) {
      var meta = axisMeta[i];
      var score = Math.round(octen[i]);
      var raw = meta.raw ? octenRow.querySelector(meta.raw).textContent.trim() : '';
      tip.innerHTML =
        '<p class="bpr-tip-title">Octen · ' + meta.name + '</p>' +
        '<p class="bpr-tip-value"><b>' + score + '</b>' +
          (raw ? '<span>' + raw + ' ' + meta.unit + '</span>' : '') + '</p>' +
        '<p class="bpr-tip-desc">' + meta.desc + '</p>';
    }

    function place(i) {
      var scale = svg.getBoundingClientRect().width / VIEW_W;
      var svgBox = svg.getBoundingClientRect();
      var box = radar.getBoundingClientRect();
      var p = point(i, octen[i], n);
      var x = svgBox.left - box.left + p[0] * scale;
      var y = svgBox.top - box.top + (p[1] - VIEW_Y) * scale;
      var w = tip.offsetWidth;
      var h = tip.offsetHeight;
      // Points right of centre open to the left; top, bottom and left-hand points open to the right
      var left = p[0] > CX + 1 ? x - w - 16 : x + 16;
      var top = Math.max(0, Math.min(y - h / 2, box.height - h));
      tip.style.left = Math.round(left) + 'px';
      tip.style.top = Math.round(top) + 'px';
    }

    function show(i) {
      render(i);
      tip.classList.add('is-visible');
      place(i);
      spokes.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
    }

    function hide() {
      tip.classList.remove('is-visible');
      spokes.forEach(function (s) { s.classList.remove('is-active'); });
    }

    var hits = el('g', { 'class': 'bpr-axis-hits' });
    axisMeta.slice(0, n).forEach(function (meta, i) {
      var p = point(i, octen[i], n);
      var hit = el('circle', { 'class': 'bpr-axis-hit', cx: p[0], cy: p[1], r: 16, tabindex: 0, 'aria-label': 'Octen ' + meta.name });
      hit.addEventListener('mouseenter', function () { show(i); });
      hit.addEventListener('mouseleave', hide);
      hit.addEventListener('focus', function () { show(i); });
      hit.addEventListener('blur', hide);
      hits.appendChild(hit);
    });
    svg.appendChild(hits);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
