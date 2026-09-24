/**
 * News Search: Dedicated Flow Animations
 * 1. Step 3 (Overview): 4 Subject cards streaming carousel entrance into #cardListContainer.
 * 2. Step 4 (Top Focus): FLIP metamorphosis morphing 4 cards into 4 horizontal pills (#subjectsHBar)
 *    and rising #eventsWhiteCard displaying Top News (#topNewsBlock).
 * 3. Step 5 (Timeline): Progressive unfold of timeline spine, dots, and news items (#timelineStreamBlock).
 */
import { state } from '../state.js';
import { sleep } from './motion.js';
import { getCurrentData } from '../data/verticals-data.js';
import { createSubjectCardHTML } from '../render/card-templates.js';
import { updateTopNewsCard, renderTimelineStream, syncSubjectPills } from '../render/stage-renderer.js';
import { transitionOverviewToFocus } from '../engine/flip-morph.js';
import { playStage5TimelineAnimation } from './timeline.js';

/**
 * Stage 3 (News Overview): 4 Subject Cards Streaming Entrance & Carousel Push
 */
export async function playNewsOverviewAnimation(isValid = () => true) {
  const cardListContainer = document.getElementById('cardListContainer');
  const resultsViewport = document.getElementById('resultsViewport');
  if (!cardListContainer) return;

  const curData = getCurrentData('news');
  const SUBJECTS_DATA = curData.subjects || [];
  if (SUBJECTS_DATA.length === 0) return;

  // 1. First card preparation
  const tempFirstWrap = document.createElement('div');
  tempFirstWrap.innerHTML = createSubjectCardHTML(SUBJECTS_DATA[0], 0, true);
  const firstCard = tempFirstWrap.firstElementChild;
  firstCard.style.opacity = '0';
  firstCard.style.transform = 'translateY(24px) scale(0.97)';

  cardListContainer.innerHTML = '';
  cardListContainer.appendChild(firstCard);

  const viewportH = resultsViewport ? resultsViewport.clientHeight : 360;
  const firstCardH = firstCard.offsetHeight || 96;
  const firstCardTop = firstCard.offsetTop;

  let currentTranslateY = Math.round((viewportH - firstCardH) / 2 - firstCardTop);
  cardListContainer.style.transform = `translateY(${currentTranslateY}px)`;

  await sleep(100);
  if (!isValid()) return;

  // Animate first card in
  const firstAnim = firstCard.animate([
    { opacity: 0, transform: 'translateY(24px) scale(0.97)', filter: 'blur(4px)' },
    { opacity: 0.65, offset: 0.45, filter: 'blur(1px)' },
    { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0px)' }
  ], {
    duration: 420,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    fill: 'forwards'
  });
  state.activeAnimations.push(firstAnim);

  await sleep(420);
  if (!isValid()) return;

  firstCard.style.opacity = '1';
  firstCard.style.transform = 'none';

  await sleep(380);
  if (!isValid()) return;

  // 2. Stream subsequent cards with carousel upward push
  for (let i = 1; i < SUBJECTS_DATA.length; i++) {
    const tempWrap = document.createElement('div');
    tempWrap.innerHTML = createSubjectCardHTML(SUBJECTS_DATA[i], i, false);
    const nextCard = tempWrap.firstElementChild;
    nextCard.style.opacity = '0';
    nextCard.style.transform = 'translateY(28px) scale(0.97)';
    cardListContainer.appendChild(nextCard);

    const vH = resultsViewport ? resultsViewport.clientHeight : 360;
    const cardTopBase = firstCard.offsetTop;
    const nextCardBottom = nextCard.offsetTop + nextCard.offsetHeight;
    const clusterH = nextCardBottom - cardTopBase;
    const bottomSafetyMargin = 20;

    let targetTranslateY;
    if (clusterH + bottomSafetyMargin <= vH) {
      targetTranslateY = Math.round((vH - clusterH) / 2 - cardTopBase);
    } else {
      targetTranslateY = Math.round(vH - nextCardBottom - bottomSafetyMargin);
    }

    const stepDuration = 420;
    const carouselPushEase = 'cubic-bezier(0.25, 1, 0.5, 1)';
    const cardEntranceEase = 'cubic-bezier(0.16, 1, 0.3, 1)';

    const shiftAnim = cardListContainer.animate([
      { transform: `translateY(${currentTranslateY}px)` },
      { transform: `translateY(${targetTranslateY}px)` }
    ], { duration: stepDuration, easing: carouselPushEase, fill: 'forwards' });
    state.activeAnimations.push(shiftAnim);

    const cardEnterAnim = nextCard.animate([
      { opacity: 0, transform: 'translateY(28px) scale(0.97)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0px)' }
    ], { duration: stepDuration, easing: cardEntranceEase, fill: 'forwards' });
    state.activeAnimations.push(cardEnterAnim);

    currentTranslateY = targetTranslateY;
    cardListContainer.style.transform = `translateY(${currentTranslateY}px)`;

    await sleep(stepDuration);
    if (!isValid()) return;

    nextCard.style.opacity = '1';
    nextCard.style.transform = 'none';

    if (i < SUBJECTS_DATA.length - 1) {
      await sleep(380);
      if (!isValid()) return;
    }
  }

  await sleep(380);
}

/**
 * Stage 4 (Top Focus): FLIP Metamorphosis & Top News Reveal
 */
export async function playNewsFocusAnimation(isValid = () => true, seq = state.currentSequenceId, setCanvasState = null) {
  const stageFocusContainer = document.getElementById('stageFocusContainer');
  const cardCanvas = document.getElementById('newsSearchCard') || document.getElementById('heroCanvas');
  const cardListContainer = document.getElementById('cardListContainer');

  // Ensure clean container state
  if (stageFocusContainer) {
    stageFocusContainer.style.removeProperty('display');
    stageFocusContainer.style.display = '';
  }

  // Ensure pills are synced and Subject1 is active
  syncSubjectPills('news');

  const hasOverviewCards = cardListContainer && cardListContainer.querySelectorAll('.subject-card-wrapper').length > 0;

  if (hasOverviewCards) {
    // Morph 4 cards into 4 pills + white card rises
    await transitionOverviewToFocus(isValid, seq);
    if (!isValid()) return;
  }

  // Canvas state switches to focus (is-stage4)
  if (typeof setCanvasState === 'function') {
    setCanvasState('focus');
  } else if (cardCanvas) {
    cardCanvas.classList.remove('is-typing', 'is-searching', 'is-stage5');
    cardCanvas.classList.add('not-typing', 'has-results', 'is-stage4');
  }

  const activePill = document.querySelector('.subject-h-pill.active');
  const activeIdx = activePill ? parseInt(activePill.dataset.subjectIdx, 10) : 0;
  updateTopNewsCard(activeIdx);
  renderTimelineStream(activeIdx, false);

  await sleep(750);
}

/**
 * Stage 5 (Timeline): Progressive Unfolding of News Timeline Stream
 */
export async function playNewsTimelineAnimation(isValid = () => true, setCanvasState = null) {
  const cardCanvas = document.getElementById('newsSearchCard') || document.getElementById('heroCanvas');
  const replayBtn = document.getElementById('replayBtn');
  const togglePlayBtn = document.getElementById('togglePlayBtn');

  if (typeof setCanvasState === 'function') {
    setCanvasState('timeline');
  } else if (cardCanvas) {
    cardCanvas.classList.remove('is-typing', 'is-searching');
    cardCanvas.classList.add('not-typing', 'has-results', 'is-stage4', 'is-stage5');
  }

  const activePill = document.querySelector('.subject-h-pill.active');
  const activeIdx = activePill ? parseInt(activePill.dataset.subjectIdx, 10) : 0;
  updateTopNewsCard(activeIdx);

  await playStage5TimelineAnimation(isValid);
  if (!isValid()) return;

  if (replayBtn) replayBtn.classList.add('visible');
  state.isAutoLooping = false;
  if (togglePlayBtn) togglePlayBtn.textContent = '▶ Resume';
}
