(function() {
  function initNavDropdowns() {
    var triggers = document.querySelectorAll('button.pc-nav_Trigger__LBs_7');
    var navLinks = document.querySelectorAll('a.pc-nav_Trigger__LBs_7');
    var viewport = document.querySelector('.pc-nav_Viewport__lDMhI');
    var contents = document.querySelectorAll('.pc-nav_Content__Dr4EA');
    var navRoot = document.querySelector('.pc-nav_Root__XoY_e') || document.querySelector('header') || document.querySelector('nav');
    var closeTimer = null;

    if (!triggers.length || !viewport) return;

    function openTab(idx) {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      triggers.forEach(function(btn, i) {
        if (i === idx) {
          btn.setAttribute('data-state', 'open');
          btn.setAttribute('aria-expanded', 'true');
        } else {
          btn.setAttribute('data-state', 'closed');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
      contents.forEach(function(content, i) {
        if (i === idx) {
          content.setAttribute('data-state', 'open');
          content.style.display = 'block';
        } else {
          content.setAttribute('data-state', 'closed');
          content.style.display = 'none';
        }
      });
      viewport.setAttribute('data-state', 'open');
      viewport.style.display = 'block';
    }

    function closeAll() {
      closeTimer = setTimeout(function() {
        triggers.forEach(function(btn) {
          btn.setAttribute('data-state', 'closed');
          btn.setAttribute('aria-expanded', 'false');
        });
        contents.forEach(function(content) {
          content.setAttribute('data-state', 'closed');
          content.style.display = 'none';
        });
        viewport.setAttribute('data-state', 'closed');
        viewport.style.display = 'none';
      }, 180);
    }

    triggers.forEach(function(btn, idx) {
      btn.addEventListener('mouseenter', function() { openTab(idx); });
      btn.addEventListener('focus', function() { openTab(idx); });
      btn.addEventListener('mouseleave', closeAll);
    });

    navLinks.forEach(function(link) {
      link.addEventListener('mouseenter', closeAll);
    });

    contents.forEach(function(content, idx) {
      content.addEventListener('mouseenter', function() {
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        openTab(idx);
      });
      content.addEventListener('mouseleave', closeAll);
    });

    viewport.addEventListener('mouseenter', function() {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    });
    viewport.addEventListener('mouseleave', closeAll);

    if (navRoot) {
      navRoot.addEventListener('mouseleave', closeAll);
    }

    var innerLinks = document.querySelectorAll('.pc-nav_Content__Dr4EA a');
    innerLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        triggers.forEach(function(btn) {
          btn.setAttribute('data-state', 'closed');
          btn.setAttribute('aria-expanded', 'false');
        });
        contents.forEach(function(content) {
          content.setAttribute('data-state', 'closed');
          content.style.display = 'none';
        });
        viewport.setAttribute('data-state', 'closed');
        viewport.style.display = 'none';
      });
    });
  }

  // Scroll state + theme, as on octen.ai's homepage: transparent at the top; once scrolled the bar
  // gets a background — light (white, black text) from the retrieval stack (#api-introduce) until
  // the Get started section (#get-started), dark elsewhere. CSS keys off data-scrolled / data-theme.
  var LOGO_WHITE = '/_next/static/media/logo-white.690e48c0.svg';
  var LOGO_DARK = '/_next/static/media/logo.2d668011.svg';

  function initNavScrollState() {
    var navs = ['pcNav', 'mobileNav']
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!navs.length) return;

    var logos = [];
    navs.forEach(function (nav) {
      Array.prototype.forEach.call(nav.querySelectorAll('img[alt="Octen logo"]'), function (img) {
        logos.push(img);
      });
    });

    function docTop(id) {
      var el = document.getElementById(id);
      return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
    }

    var promo = document.getElementById('promoBar');
    var promoClose = promo && promo.querySelector('.promo-bar-close');
    if (promoClose) {
      promoClose.addEventListener('click', function () {
        promo.classList.add('is-dismissed');
        document.body.classList.add('promo-dismissed');
      });
    }

    var lastTheme = null;
    var lastScrolled = null;

    function update() {
      var y = window.scrollY;
      var lightStart = docTop('api-introduce') - 140;
      var lightEnd = docTop('get-started') - 70;
      var theme = y >= lightStart && y < lightEnd ? 'light' : 'dark';
      var scrolled = y > 0 ? 'true' : 'false';
      if (promo) promo.classList.toggle('is-hidden', y > 0); // the promo bar only shows at the very top
      if (theme === lastTheme && scrolled === lastScrolled) return;
      lastTheme = theme;
      lastScrolled = scrolled;

      navs.forEach(function (nav) {
        nav.setAttribute('data-theme', theme);
        nav.setAttribute('data-scrolled', scrolled);
      });
      logos.forEach(function (img) {
        img.src = theme === 'light' ? LOGO_DARK : LOGO_WHITE;
      });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        update();
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  function init() {
    initNavDropdowns();
    initNavScrollState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
