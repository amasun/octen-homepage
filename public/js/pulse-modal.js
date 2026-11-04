(function () {
  function init() {
    var openBtn = document.getElementById('openPulseVideoBtn');
    var modal = document.getElementById('pulseVideoModal');
    if (!openBtn || !modal) return;

    var video = modal.querySelector('video');
    var closeBtn = modal.querySelector('.pulse-modal-close');
    var dialog = modal.querySelector('.pulse-modal-dialog');

    function openModal() {
      modal.hidden = false;
      // Force reflow for CSS transition
      void modal.offsetWidth;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (video) {
        video.currentTime = 0;
        var playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(function () {
            // If browser blocks unmuted autoplay, mute and play
            video.muted = true;
            video.play();
          });
        }
      }
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      if (video) {
        video.pause();
      }
      setTimeout(function () {
        if (!modal.classList.contains('is-open')) {
          modal.hidden = true;
        }
      }, 300);
    }

    openBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeModal();
      });
    }

    modal.addEventListener('click', function (e) {
      if (dialog && !dialog.contains(e.target)) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
