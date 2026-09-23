/**
 * Octen Vertical Search Interactive Engine
 * Modular Main Entry Point
 */
import NumberFlow from 'number-flow';
import { preloadCovers } from './data/verticals-data.js';
import { updateTopNewsCard, renderTimelineStream } from './render/stage-renderer.js';
import { state } from './state.js';
import { runCycle, updateQueryDisplayScroll } from './engine/stage-controller.js';
import { switchVertical, syncTabsIndicator } from './engine/tabs-glider.js';
import { initStepControls } from './engine/step-controls.js';

(function init() {
  // Preload subject covers in background
  preloadCovers();

  // Setup 14 Wave Dots with sine delays in Stage 2 Searching overlay
  const waveDotsTrack = document.getElementById('waveDotsTrack');
  if (waveDotsTrack && waveDotsTrack.children.length === 0) {
    for (let i = 0; i < 14; i++) {
      const dot = document.createElement('span');
      dot.className = 'wave-dot';
      dot.style.animationDelay = `${(i / 14) * 1.4}s`;
      waveDotsTrack.appendChild(dot);
    }
  }

  // Bind tab click triggers
  const tabNews = document.getElementById('tabNews');
  const tabBusiness = document.getElementById('tabBusiness');
  if (tabNews) {
    tabNews.addEventListener('click', () => switchVertical('news'));
  }
  if (tabBusiness) {
    tabBusiness.addEventListener('click', () => switchVertical('business'));
  }

  // Bind developer controls & stage pills
  initStepControls();

  // Initial setup for Top News and Timeline stream
  updateTopNewsCard(0);
  renderTimelineStream(0, false);

  // Sync Sliding Glider Indicator position
  syncTabsIndicator(false);
  requestAnimationFrame(() => {
    syncTabsIndicator(false);
  });
  window.addEventListener('resize', () => {
    syncTabsIndicator(false);
    if (state.currentActiveStep === 'typing') {
      updateQueryDisplayScroll();
    }
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      syncTabsIndicator(false);
    });
  }
  window.addEventListener('load', () => {
    syncTabsIndicator(false);
  });

  // Initial watermark animation pop
  const initialWatermark = document.getElementById('canvasWatermark');
  if (initialWatermark) {
    initialWatermark.classList.remove('watermark-pop');
    void initialWatermark.offsetWidth;
    initialWatermark.classList.add('watermark-pop');
  }

  // Start with News Search by default (or check ?vertical= query param)
  const urlParams = new URLSearchParams(window.location.search);
  const initialVertical = urlParams.get('vertical') || 'business';

  if (initialVertical === 'business') {
    switchVertical('business', true);
  } else {
    runCycle();
  }
})();
