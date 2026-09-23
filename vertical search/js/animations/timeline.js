/**
 * Stage 5 Dynamic Timeline Stream Unfold Animation
 */
import { state } from '../state.js';
import { sleep, smoothScrollTo } from './motion.js';
import { renderTimelineStream } from '../render/stage-renderer.js';

export async function playStage5TimelineAnimation(isValid = () => true) {
  const streamBlock = document.getElementById('timelineStreamBlock');
  const activePill = document.querySelector('.subject-h-pill.active');
  const activeIdx = activePill ? parseInt(activePill.dataset.subjectIdx, 10) : 0;

  if (state.timelineScrollCleanup) {
    state.timelineScrollCleanup();
    state.timelineScrollCleanup = null;
  }

  if (!streamBlock) return;

  // 1. Initial setup: collapse all stream items and reset scroll to top
  renderTimelineStream(activeIdx, false);
  streamBlock.scrollTop = 0;

  // Lock manual scrolling and hide scrollbar during unfold animation
  streamBlock.classList.add('is-animating');
  streamBlock.style.overflowY = 'hidden';

  const blockScroll = (e) => { e.preventDefault(); };
  streamBlock.addEventListener('wheel', blockScroll, { passive: false });
  streamBlock.addEventListener('touchmove', blockScroll, { passive: false });

  state.timelineScrollCleanup = () => {
    streamBlock.removeEventListener('wheel', blockScroll);
    streamBlock.removeEventListener('touchmove', blockScroll);
    streamBlock.classList.remove('is-animating');
    streamBlock.style.overflowY = 'auto';
    streamBlock.style.pointerEvents = 'auto';
  };

  const stem = document.getElementById('timelineSpineStem');
  const dots = document.querySelectorAll('.timeline-dot-node');
  const subArticles = document.querySelectorAll('.timeline-sub-article');
  const total = subArticles.length;

  if (stem) stem.style.transform = 'scaleY(0)';

  // 2. Sequential progressive unfold of timeline spine, dots, and news cards
  for (let i = 0; i < total; i++) {
    // A) Progressively extend stem down to current dot
    if (stem && total > 1) {
      const stemProgress = i === 0 ? 0 : (i / (total - 1));
      stem.style.transform = `scaleY(${stemProgress})`;
    }

    // Lead-in pause for spine line to reach target position before node lights up
    if (i > 0) {
      await sleep(120);
      if (!isValid()) {
        if (state.timelineScrollCleanup) state.timelineScrollCleanup();
        state.timelineScrollCleanup = null;
        return;
      }
    }

    // B) Reveal current dot and sub-article
    if (dots[i]) dots[i].classList.add('visible');
    if (subArticles[i]) subArticles[i].classList.add('visible');

    // C) Auto-scroll container
    if (i < 3) {
      if (streamBlock) streamBlock.scrollTop = 0;
      await sleep(i === 0 ? 800 : 680);
    } else if (streamBlock && subArticles[i]) {
      const containerHeight = streamBlock.clientHeight;
      const containerRect = streamBlock.getBoundingClientRect();
      const cardRect = subArticles[i].getBoundingClientRect();
      const cardBottomFromContentTop = (cardRect.bottom - containerRect.top) + streamBlock.scrollTop;
      const bottomSafety = 6;
      const maxScroll = Math.max(0, streamBlock.scrollHeight - containerHeight);

      const targetScroll = Math.max(streamBlock.scrollTop, cardBottomFromContentTop + bottomSafety - containerHeight);
      const boundedTarget = Math.min(maxScroll, targetScroll);

      if (boundedTarget > streamBlock.scrollTop) {
        const scrollDuration = 520;
        await smoothScrollTo(streamBlock, boundedTarget, scrollDuration, isValid);
        if (!isValid()) {
          if (state.timelineScrollCleanup) state.timelineScrollCleanup();
          state.timelineScrollCleanup = null;
          return;
        }
        await sleep(160);
      } else {
        await sleep(680);
      }
    } else {
      await sleep(680);
    }

    if (!isValid()) {
      if (state.timelineScrollCleanup) state.timelineScrollCleanup();
      state.timelineScrollCleanup = null;
      return;
    }
  }

  // 3. Animation finished: dwell for final smooth scroll to settle, then unlock scrollbar
  await sleep(350);
  if (!isValid()) {
    if (state.timelineScrollCleanup) state.timelineScrollCleanup();
    state.timelineScrollCleanup = null;
    return;
  }

  if (state.timelineScrollCleanup) {
    state.timelineScrollCleanup();
    state.timelineScrollCleanup = null;
  }
}
