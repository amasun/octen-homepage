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
 * Video Search - Multi-Scene State Machine & Dual Sine Wave Audio Simulator
 * 1) Video play carousel (bottom-aligned, scrubber active)
 * 2) Green laser scanning & Octen mascot recognition
 * 3) Multimodal extract card decomposition
 * 4) Step-motion carousel shift & loop
 */
(function initVideoSearchEngine() {
  function start() {
    const card = document.getElementById('octen-video-card');
    const canvas = document.getElementById('octen-audio-waves');
    if (!card || !canvas) return;

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
        // Dual harmonic: primary + subtle secondary
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
    // 2. Multi-Scene State Machine Loop
    // ----------------------------------------------------
    const fillEl = document.getElementById('octen-vcard-timeline-fill');
    const thumbEl = document.getElementById('octen-vcard-timeline-thumb');
    let stateTimeout = null;
    let loopInterval = null;

    function runCycle() {
      // Scene 1: Video Playing
      card.classList.remove('is-shifting');
      card.setAttribute('data-scene', '1');
      if (fillEl && thumbEl) {
        fillEl.style.width = '25%';
        thumbEl.style.left = '25%';
        setTimeout(() => {
          if (fillEl && thumbEl) {
            fillEl.style.width = '48%';
            thumbEl.style.left = '48%';
          }
        }, 100);
      }

      // Scene 2: Green Laser Scanning & Octen Robot Mascot
      stateTimeout = setTimeout(() => {
        card.setAttribute('data-scene', '2');
        if (fillEl && thumbEl) {
          fillEl.style.width = '62%';
          thumbEl.style.left = '62%';
        }

        // Scene 3: Deconstructed Extract Card
        stateTimeout = setTimeout(() => {
          card.setAttribute('data-scene', '3');

          // Scene 4: Carousel shift to right
          stateTimeout = setTimeout(() => {
            card.classList.add('is-shifting');

            // Quick reset back to Scene 1
            stateTimeout = setTimeout(() => {
              card.classList.remove('is-shifting');
              card.setAttribute('data-scene', '1');
            }, 850);
          }, 2200);
        }, 2100);
      }, 2300);
    }

    // Start immediately then repeat every 7.8s
    runCycle();
    loopInterval = setInterval(runCycle, 7800);

    window.addEventListener('pagehide', () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (stateTimeout) clearTimeout(stateTimeout);
      if (loopInterval) clearInterval(loopInterval);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

