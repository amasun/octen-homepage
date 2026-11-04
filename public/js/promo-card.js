/* Floating promo card: shows once the page is scrolled past the hero, hides again at the very top.
   Dismissal is in-memory only for easy testing, so refreshing the page restores the card. */
(function () {
  var SHOW_AFTER = 480; // px scrolled

  function init() {
    var card = document.getElementById('promoCard');
    if (!card) return;

    // Clear legacy sessionStorage dismissal flag if present
    try { sessionStorage.removeItem('octen-promo-card-dismissed'); } catch (e) {}

    card.hidden = false;

    var ticking = false;
    function update() {
      ticking = false;
      card.classList.toggle('is-visible', window.scrollY > SHOW_AFTER);
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    var closeBtn = card.querySelector('.promo-card-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        card.classList.remove('is-visible');
        window.removeEventListener('scroll', onScroll);
        setTimeout(function () { card.hidden = true; }, 350);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
