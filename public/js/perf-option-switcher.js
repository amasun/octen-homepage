/* Homepage: floating card that switches the Built to Perform slot between Option 1 (default) and Option 2. */
(function () {
  function init() {
    var slot = document.getElementById('perfOptions');
    var card = document.getElementById('perfSwitcher');
    if (!slot || !card || card.dataset.ready) return;
    card.dataset.ready = '1';

    var options = Array.prototype.slice.call(slot.querySelectorAll('[data-perf-option]'));
    var buttons = Array.prototype.slice.call(card.querySelectorAll('[data-perf-switch]'));

    function select(value) {
      slot.dataset.activeOption = value;
      options.forEach(function (opt) {
        opt.hidden = opt.dataset.perfOption !== value;
      });
      buttons.forEach(function (btn) {
        var on = btn.dataset.perfSwitch === value;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      // The newly shown option measured itself while hidden; let its resize handlers re-layout
      // (tab pill position, rail dot/bar, bubble chart) now and again after the next paint.
      window.dispatchEvent(new Event('resize'));
      requestAnimationFrame(function () {
        window.dispatchEvent(new Event('resize'));
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        select(btn.dataset.perfSwitch);
      });
    });

    // Show the card only while the Performance slot is on screen
    function setVisible(on) {
      card.classList.toggle('is-visible', on);
      card.setAttribute('aria-hidden', on ? 'false' : 'true');
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        setVisible(entries[0].isIntersecting);
      }, { threshold: 0, rootMargin: '-30% 0px -30% 0px' }).observe(slot);
    } else {
      setVisible(true);
    }

    select(slot.dataset.activeOption || '1');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
