/* Option 2 · Search API performance profile: draws the radar from table rows and links row hover to series. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var CX = 250;
  var CY = 219;
  var R = 150;
  var AXES = 5; // DeepSearchQA (top), BrowseComp, Omniscience, Cost Efficiency, Speed (clockwise)

  function point(i, value) {
    var a = (-90 + i * (360 / AXES)) * Math.PI / 180;
    var r = R * value / 100;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  }

  function points(values) {
    return values.map(function (v, i) {
      var p = point(i, v);
      return p[0].toFixed(2) + ',' + p[1].toFixed(2);
    }).join(' ');
  }

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function init() {
    var card = document.getElementById('perfRadarCard');
    if (!card || card.dataset.radarReady) return;
    card.dataset.radarReady = '1';

    var grid = card.querySelector('.bpr-grid');
    var seriesLayer = card.querySelector('.bpr-series');
    var rows = Array.prototype.slice.call(card.querySelectorAll('[data-radar]'));

    // Rings (20..100) and spokes
    grid.appendChild(el('polygon', { 'class': 'bpr-ring-outer', points: points([100, 100, 100, 100, 100]) }));
    [20, 40, 60, 80, 100].forEach(function (v) {
      grid.appendChild(el('polygon', { 'class': 'bpr-ring', points: points([v, v, v, v, v]) }));
    });
    for (var i = 0; i < AXES; i++) {
      var end = point(i, 100);
      grid.appendChild(el('line', { 'class': 'bpr-spoke', x1: CX, y1: CY, x2: end[0], y2: end[1] }));
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
        var p = point(idx, v);
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
