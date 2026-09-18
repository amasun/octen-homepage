/**
 * Modalities Search - Spiral 6-Arm Card Ambient Shimmer Engine
 * Randomly pulses 1 to 3 Lucide icons at a time with faster rhythm:
 * Opacity ramps 0.5 -> 1.0 -> 0.5 in ~1.5s total duration.
 * Non-pulsing icons remain at default opacity 0.5.
 */
(function initSpiralIconShimmer() {
  function start() {
    const icons = Array.from(document.querySelectorAll('.octen-spiral-icon'));
    if (!icons.length) return;

    let previousSet = new Set();
    let cycleTimer = null;

    function pulseNext() {
      // Clear pulsing state from all icons and boxes
      icons.forEach((icon) => {
        icon.classList.remove('is-pulsing');
        if (icon.parentElement) icon.parentElement.classList.remove('is-pulsing');
      });

      // Pick 1 to 3 random icons (uniform distribution across 1, 2, 3)
      const count = Math.floor(Math.random() * 3) + 1;

      // Filter available candidates to avoid immediate repeats
      const pool = [];
      for (let i = 0; i < icons.length; i++) {
        if (!previousSet.has(i)) {
          pool.push(i);
        }
      }

      // Shuffle pool (Fisher-Yates)
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }

      const selected = pool.slice(0, count);
      previousSet = new Set(selected);

      // Trigger pulse on the 1-3 icons with organic micro-stagger (50ms)
      selected.forEach((idx, offset) => {
        setTimeout(() => {
          if (icons[idx]) {
            icons[idx].classList.add('is-pulsing');
            if (icons[idx].parentElement) icons[idx].parentElement.classList.add('is-pulsing');
          }
        }, offset * 50);
      });

      // Hold at peak then gently ramp down
      setTimeout(() => {
        selected.forEach((idx) => {
          if (icons[idx]) {
            icons[idx].classList.remove('is-pulsing');
            if (icons[idx].parentElement) icons[idx].parentElement.classList.remove('is-pulsing');
          }
        });
      }, 900);
    }

    // Faster recurring cycle: every 1.8s
    cycleTimer = setInterval(pulseNext, 1800);

    // Initial pulse after short delay
    setTimeout(pulseNext, 300);

    window.addEventListener('pagehide', () => {
      if (cycleTimer) clearInterval(cycleTimer);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

/**
 * Video Search - Multi-Scene Infinite Rightward State Machine & Dual Sine Wave Audio Simulator
 * 1) Video play carousel (bottom-aligned, scrubber active)
 * 2) Single green laser scanning (reduced opacity) & Octen mascot recognition
 * 3) Multimodal extract card decomposition
 * 4) Continuous rightward carousel shift (left card moves to center, new card slides in from left)
 */
(function initVideoSearchEngine() {
  function start() {
    const card = document.getElementById('octen-video-card');
    const track = document.getElementById('octen-video-track');
    const canvas = document.getElementById('octen-audio-waves');
    if (!card || !track || !canvas) return;

    // ----------------------------------------------------
    // 1. Dual-Frequency Audio Sine Wave Canvas Simulator
    // ----------------------------------------------------
    const ctx = canvas.getContext('2d');
    let animFrameId = null;
    let waveTime = 0;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(rect.width * dpr, 716 * dpr);
      canvas.height = Math.max(rect.height * dpr, 60 * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawWaves() {
      const w = 716;
      const h = 60;
      ctx.clearRect(0, 0, w, h);

      const isScanning = card.getAttribute('data-scene') === '2';
      waveTime += 0.03;

      // Wave 1: Lower frequency, larger swell
      ctx.beginPath();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = isScanning ? 'rgba(112, 254, 126, 0.45)' : 'rgba(209, 209, 209, 0.25)';

      for (let x = 0; x <= w; x += 4) {
        const y = 32 + Math.sin(x * 0.0095 + waveTime * 1.2) * 14 + Math.sin(x * 0.021 - waveTime * 0.8) * 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave 2: Higher frequency, phase-offset counter-swell
      ctx.beginPath();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = isScanning ? 'rgba(112, 254, 126, 0.35)' : 'rgba(209, 209, 209, 0.22)';

      for (let x = 0; x <= w; x += 4) {
        const y = 30 + Math.sin(x * 0.0165 - waveTime * 1.5) * 11 + Math.cos(x * 0.008 + waveTime * 0.6) * 5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animFrameId = requestAnimationFrame(drawWaves);
    }

    animFrameId = requestAnimationFrame(drawWaves);

    // ----------------------------------------------------
    // 2. 4-Slide Infinite Rightward State Machine Loop
    // ----------------------------------------------------
    const slides = [
      document.getElementById('octen-video-slide-0'),
      document.getElementById('octen-video-slide-1'),
      document.getElementById('octen-video-slide-2'),
      document.getElementById('octen-video-slide-3')
    ].filter(Boolean);

    if (slides.length < 4) return;

    // Initial slot assignments:
    // S0: pos-incoming (offscreen left)
    // S1: pos-left
    // S2: pos-center (active center)
    // S3: pos-right
    let centerIndex = 2;
    let timeouts = [];

    function clearAllTimeouts() {
      timeouts.forEach((t) => clearTimeout(t));
      timeouts = [];
    }

    function schedule(fn, delay) {
      const t = setTimeout(fn, delay);
      timeouts.push(t);
      return t;
    }

    function runCycle() {
      const centerSlide = slides[centerIndex];
      const incomingSlide = slides[(centerIndex - 2 + 4) % 4];
      const leftSlide = slides[(centerIndex - 1 + 4) % 4];
      const rightSlide = slides[(centerIndex + 1) % 4];

      // === SCENE 1: Video Playing on Center Card ===
      card.setAttribute('data-scene', '1');

      // Animate active timeline scrubber on center slide
      const fillEl = centerSlide.querySelector('.octen-vcard-timeline-fill');
      const thumbEl = centerSlide.querySelector('.octen-vcard-timeline-thumb');
      if (fillEl && thumbEl) {
        fillEl.style.transition = 'none';
        thumbEl.style.transition = 'none';
        fillEl.style.width = '24%';
        thumbEl.style.left = '24%';
        requestAnimationFrame(() => {
          fillEl.style.transition = 'width 2.0s linear';
          thumbEl.style.transition = 'left 2.0s linear';
          fillEl.style.width = '52%';
          thumbEl.style.left = '52%';
        });
      }

      // === SCENE 2: Single Green Laser Scan & Octen Robot Mascot ===
      schedule(() => {
        card.setAttribute('data-scene', '2');
        if (fillEl && thumbEl) {
          fillEl.style.transition = 'width 1.8s linear';
          thumbEl.style.transition = 'left 1.8s linear';
          fillEl.style.width = '66%';
          thumbEl.style.left = '66%';
        }

        // === SCENE 3: Deconstructed Extract Card ===
        schedule(() => {
          card.setAttribute('data-scene', '3');
          centerSlide.classList.add('is-extracted');

          // === SCENE 4: Continuous Carousel Shift Right ===
          // (Left card moves to center, center moves to right, new card enters from left)
          schedule(() => {
            card.setAttribute('data-scene', '4');

            // Make sure incoming slide is prepared before sliding into view
            incomingSlide.classList.remove('is-extracted');
            const incFill = incomingSlide.querySelector('.octen-vcard-timeline-fill');
            const incThumb = incomingSlide.querySelector('.octen-vcard-timeline-thumb');
            if (incFill && incThumb) {
              incFill.style.transition = 'none';
              incThumb.style.transition = 'none';
              incFill.style.width = '24%';
              incThumb.style.left = '24%';
            }

            // Animate positions to the right simultaneously:
            // incoming (offscreen left) -> left slot
            // left -> center slot (becomes new center active card!)
            // center (extract) -> right slot
            // right -> outgoing (offscreen right)
            incomingSlide.className = 'octen-video-slide pos-left';
            leftSlide.className = 'octen-video-slide pos-center';
            centerSlide.className = 'octen-video-slide pos-right is-extracted';
            rightSlide.className = 'octen-video-slide pos-outgoing';

            // Wait for 850ms CSS transition to complete
            schedule(() => {
              // Instantly recycle outgoing slide to incoming position without animation
              track.classList.add('no-transition');

              rightSlide.className = 'octen-video-slide pos-incoming';
              rightSlide.classList.remove('is-extracted');

              // Force layout reflow
              void track.offsetHeight;

              // Re-enable smooth transitions
              track.classList.remove('no-transition');

              // Advance centerIndex to the slide that just entered center
              centerIndex = (centerIndex - 1 + 4) % 4;

              // Immediately start next cycle smoothly!
              runCycle();
            }, 860);
          }, 2100);
        }, 2000);
      }, 2200);
    }

    // Start running immediately
    runCycle();

    window.addEventListener('pagehide', () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      clearAllTimeouts();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearAllTimeouts();
      } else {
        clearAllTimeouts();
        runCycle();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

