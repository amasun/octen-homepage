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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavDropdowns);
  } else {
    initNavDropdowns();
  }
})();
