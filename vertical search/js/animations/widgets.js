/**
 * Micro-widgets interactive animations:
 * - NumberFlow dynamic number updates
 * - Token Compression Meter 10-bar progressive reduction
 */
import { state } from '../state.js';

let tokenMeterTimers = [];

export function clearTokenMeterTimers() {
  tokenMeterTimers.forEach(t => clearTimeout(t));
  tokenMeterTimers = [];
}

// Drive Token Meter cascade height drain animation with 3s dwell and continuous looping
export function playTokenMeterAnim() {
  clearTokenMeterTimers();
  const meters = document.querySelectorAll('.token-meter');
  if (!meters.length) return;
  const seq = state.currentSequenceId;

  function runMeterCycle(isFirstRun = false) {
    if (state.currentSequenceId !== seq) return;
    if (state.currentVerticalKey !== 'news') return;

    // 1. Refill all 10 bars to full height
    meters.forEach(meter => {
      const bars = meter.querySelectorAll('.token-meter-bar');
      bars.forEach(bar => bar.classList.remove('is-dimmed', 'is-half'));
    });

    // 2. Pause at full 10 bars so user clearly perceives 10 full bars
    const fullDwell = isFirstRun ? 500 : 750;
    const stepInterval = 140; // Slower, deliberate pacing (140ms per bar)
    // Indices 9 down to 3 drain to 0%, index 2 (3rd bar) drains to 50% (half height)
    const extinguishIndices = [9, 8, 7, 6, 5, 4, 3, 2];

    extinguishIndices.forEach((idx, step) => {
      const t = setTimeout(() => {
        if (state.currentSequenceId !== seq) return;
        if (state.currentVerticalKey !== 'news') return;
        meters.forEach(meter => {
          const bars = meter.querySelectorAll('.token-meter-bar');
          if (bars[idx]) {
            if (idx === 2) {
              bars[idx].classList.add('is-half');
            } else {
              bars[idx].classList.add('is-dimmed');
            }
          }
        });
      }, fullDwell + step * stepInterval);
      tokenMeterTimers.push(t);
    });

    // 3. Dwell for 3s after all bars finish draining, then loop again
    const totalDrainTime = fullDwell + (extinguishIndices.length - 1) * stepInterval + 650;
    const dwellAfterDrain = 3000; // Dwell 3s before looping again

    const loopTimer = setTimeout(() => {
      if (state.currentSequenceId !== seq) return;
      if (state.currentVerticalKey !== 'news') return;
      runMeterCycle(false);
    }, totalDrainTime + dwellAfterDrain);
    tokenMeterTimers.push(loopTimer);
  }

  runMeterCycle(true);
}

// Drive selling points numbers using official number-flow (@barvian/number-flow)
export function playSellingPointsNumberFlow() {
  playTokenMeterAnim();
  const flowEls = document.querySelectorAll('.bullet-number-flow');
  if (!flowEls.length) return;

  const isDefined = customElements.get('number-flow');
  if (!isDefined) {
    customElements.whenDefined('number-flow').then(() => {
      playSellingPointsNumberFlow();
    });
    return;
  }

  // Reset to 0 instantly without animation
  flowEls.forEach(el => {
    if (typeof el.update === 'function') {
      el.animated = false;
      el.update(0);
    }
  });

  // Spin up to target values with smooth decelerating odometer spring physics
  requestAnimationFrame(() => {
    setTimeout(() => {
      flowEls.forEach(el => {
        const targetVal = parseFloat(el.dataset.value) || 0;
        if (typeof el.update === 'function') {
          el.animated = true;
          el.spinTiming = { duration: 950, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };
          el.update(targetVal);
        } else {
          el.textContent = targetVal;
        }
      });
    }, 120);
  });
}
