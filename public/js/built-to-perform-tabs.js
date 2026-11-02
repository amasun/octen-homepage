/* Built to Perform (tabs layout): switches the panel under the pill tab bar. */
(function () {
  function init() {
    var section = document.getElementById('built-to-perform');
    if (!section || section.dataset.bptReady) return;
    section.dataset.bptReady = '1';

    var tabs = Array.prototype.slice.call(section.querySelectorAll('[data-bpt-tab]'));
    var panels = Array.prototype.slice.call(section.querySelectorAll('[data-bpt-panel]'));

    function activate(name, focus) {
      tabs.forEach(function (tab) {
        var on = tab.dataset.bptTab === name;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
        if (on && focus) tab.focus();
      });
      panels.forEach(function (panel) {
        var on = panel.dataset.bptPanel === name;
        panel.hidden = !on;
        panel.classList.toggle('is-active', on);
      });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        activate(tab.dataset.bptTab);
      });
      tab.addEventListener('keydown', function (e) {
        var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        activate(tabs[(i + step + tabs.length) % tabs.length].dataset.bptTab, true);
      });
    });

    var current = tabs.filter(function (t) { return t.classList.contains('is-active'); })[0] || tabs[0];
    if (current) activate(current.dataset.bptTab);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
