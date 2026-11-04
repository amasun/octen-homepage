(function () {
  function init() {
    var openBtn = document.getElementById('openPulseVideoBtn');
    var modal = document.getElementById('pulseVideoModal');
    if (!openBtn || !modal) return;

    var video = modal.querySelector('video');
    var closeBtn = modal.querySelector('.pulse-modal-close');
    var dialog = modal.querySelector('.pulse-modal-dialog');

    function openModal(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      modal.hidden = false;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (video) {
        video.currentTime = 0;
        var playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(function () {
            // Autoplay with sound might be blocked, mute and play
            video.muted = true;
            video.play();
          });
        }
      }
    }

    function closeModal(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
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

    openBtn.addEventListener('click', openModal);
    openBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(e);
      }
    });

    if (video) {
      video.addEventListener('click', function (e) {
        e.stopPropagation();
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (e) {
      if (dialog && !dialog.contains(e.target)) {
        closeModal(e);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal(e);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
