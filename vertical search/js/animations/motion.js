/**
 * Common Motion Curves & Helpers
 */
import { state } from '../state.js';

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export function animateNumber(element, start, end, duration = 1800) {
  if (!element) return;
  const startTime = performance.now();
  function frame(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(start + (end - start) * ease);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

export const EASE_SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const EASE_POP = 'cubic-bezier(0.34, 1.18, 0.64, 1)';
export const EASE_CAROUSEL = 'cubic-bezier(0.25, 1, 0.5, 1)';
export const EASE_LAYOUT = 'cubic-bezier(0.4, 0, 0.2, 1)';
export const EASE_MORPH = 'cubic-bezier(0.2, 0.9, 0.28, 1)';

// Custom silky-smooth requestAnimationFrame scroll animation to allow leisurely, refined timeline scrolling
export function smoothScrollTo(element, targetTop, duration = 650, isValid = () => true) {
  return new Promise(resolve => {
    if (!element) return resolve();
    const startTop = element.scrollTop;
    const distance = targetTop - startTop;
    if (Math.abs(distance) < 0.5) {
      element.scrollTop = targetTop;
      return resolve();
    }

    let startTime = null;
    let pausedDuration = 0;
    let isCurrentlyPaused = false;
    let pauseStartTime = null;

    // Ease-out Quart curve matching cubic-bezier(0.25, 1, 0.5, 1) for seamless deceleration
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    function step(currentTime) {
      if (!isValid()) return resolve();

      // Respect hover pause if active
      if (state.isUserHovered) {
        if (!isCurrentlyPaused) {
          isCurrentlyPaused = true;
          pauseStartTime = currentTime;
        }
        requestAnimationFrame(step);
        return;
      } else if (isCurrentlyPaused) {
        isCurrentlyPaused = false;
        if (pauseStartTime !== null) {
          pausedDuration += (currentTime - pauseStartTime);
          pauseStartTime = null;
        }
      }

      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime - pausedDuration;
      const progress = Math.min(Math.max(elapsed / duration, 0), 1);
      const easedProgress = easeOutQuart(progress);

      element.scrollTop = Math.round(startTop + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.scrollTop = targetTop;
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}
