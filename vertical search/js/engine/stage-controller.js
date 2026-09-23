/**
 * 5-Stage Sequence Controller and Layout Transitions
 */
import { state, clearActiveAnimations } from '../state.js';
import { getCurrentData } from '../data/verticals-data.js';
import { createSubjectCardHTML } from '../render/card-templates.js';
import { updateTopNewsCard, renderTimelineStream, syncSubjectPills } from '../render/stage-renderer.js';
import { sleep, animateNumber } from '../animations/motion.js';
import { playTokenMeterAnim, clearTokenMeterTimers, playSellingPointsNumberFlow } from '../animations/widgets.js';
import { playStage5TimelineAnimation } from '../animations/timeline.js';
import { transitionOverviewToFocus } from './flip-morph.js';

export function updateQueryDisplayScroll() {
  const queryDisplay = document.querySelector('.query-display');
  if (!queryDisplay) return;
  const maxScroll = queryDisplay.scrollWidth - queryDisplay.clientWidth;
  if (maxScroll > 0) {
    queryDisplay.scrollLeft = maxScroll + 8;
    queryDisplay.classList.add('is-overflowing');
  } else {
    queryDisplay.scrollLeft = 0;
    queryDisplay.classList.remove('is-overflowing');
  }
}

export function resetQueryDisplayScroll() {
  const queryDisplay = document.querySelector('.query-display');
  if (!queryDisplay) return;
  queryDisplay.scrollLeft = 0;
  queryDisplay.classList.remove('is-overflowing');
}

export function setCanvasState(targetState) {
  state.currentActiveStep = targetState;
  const cardCanvas = document.getElementById('newsSearchCard') || document.getElementById('heroCanvas');
  const stepBtns = document.querySelectorAll('.step-btn');
  const replayBtn = document.getElementById('replayBtn');
  const cardListContainer = document.getElementById('cardListContainer');
  const morphCardsOverlay = document.getElementById('morphCardsOverlay') || document.getElementById('flyingTagsOverlay');
  const subjectsHBar = document.getElementById('subjectsHBar');
  const eventsWhiteCard = document.getElementById('eventsWhiteCard');
  const stageFocusContainer = document.getElementById('stageFocusContainer');

  if (!cardCanvas) return;

  cardCanvas.classList.remove('is-typing', 'is-searching', 'has-results', 'not-typing', 'is-stage4', 'is-stage5');
  stepBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.step === targetState));

  if (replayBtn && targetState !== 'timeline') {
    replayBtn.classList.remove('visible');
  }

  if (state.timelineScrollCleanup) {
    state.timelineScrollCleanup();
    state.timelineScrollCleanup = null;
  }
  const streamBlock = document.getElementById('timelineStreamBlock');
  if (streamBlock && targetState !== 'timeline') {
    streamBlock.scrollTop = 0;
    streamBlock.classList.remove('is-animating');
    streamBlock.style.overflowY = '';
  }

  if (morphCardsOverlay) morphCardsOverlay.innerHTML = '';
  if (subjectsHBar) subjectsHBar.style.opacity = '';
  if (eventsWhiteCard) {
    eventsWhiteCard.style.opacity = '';
    eventsWhiteCard.style.transform = '';
  }
  if (stageFocusContainer) {
    stageFocusContainer.style.opacity = '';
    stageFocusContainer.style.pointerEvents = '';
  }

  if (cardListContainer) {
    const allCards = cardListContainer.querySelectorAll('.subject-card-box');
    allCards.forEach(c => { c.style.opacity = ''; c.style.transform = ''; c.style.visibility = ''; });
    const allBadges = cardListContainer.querySelectorAll('.subject-badge');
    allBadges.forEach(b => { b.style.visibility = ''; });
  }

  const searchBoxWrapper = document.getElementById('searchBoxWrapper');
  const summaryBox = document.getElementById('summaryBox');
  const canvasWatermark = document.getElementById('canvasWatermark');
  const canvasHeadingIcon = document.getElementById('canvasHeadingIcon');

  if (canvasWatermark) {
    try {
      canvasWatermark.getAnimations().forEach(anim => anim.cancel());
    } catch (e) {}
    canvasWatermark.style.transform = '';
    canvasWatermark.style.zIndex = '';
    if (targetState === 'typing') {
      canvasWatermark.style.display = 'block';
      canvasWatermark.style.opacity = '';
    } else {
      canvasWatermark.style.display = 'none';
      canvasWatermark.style.opacity = '0';
    }
  }
  if (canvasHeadingIcon) {
    if (targetState === 'typing' || targetState === 'searching') {
      canvasHeadingIcon.style.opacity = '';
    } else {
      canvasHeadingIcon.style.opacity = '1';
    }
  }

  if (targetState === 'typing') {
    resetQueryDisplayScroll();
    const flowEls = document.querySelectorAll('.bullet-number-flow');
    flowEls.forEach(el => {
      if (typeof el.update === 'function') {
        el.animated = false;
        el.update(0);
      }
    });
    cardCanvas.classList.add('is-typing');
    if (searchBoxWrapper) {
      searchBoxWrapper.style.display = 'block';
      searchBoxWrapper.style.opacity = '1';
      searchBoxWrapper.style.transform = 'none';
    }
    if (summaryBox) {
      summaryBox.style.display = 'none';
    }
  } else if (targetState === 'searching') {
    resetQueryDisplayScroll();
    cardCanvas.classList.add('not-typing', 'is-searching');
    if (searchBoxWrapper) {
      searchBoxWrapper.style.display = 'block';
      searchBoxWrapper.style.opacity = '1';
      searchBoxWrapper.style.transform = 'none';
    }
    if (summaryBox) {
      summaryBox.style.display = 'none';
    }
  } else if (targetState === 'overview') {
    cardCanvas.classList.add('not-typing', 'has-results');
    if (searchBoxWrapper) {
      searchBoxWrapper.style.display = 'none';
    }
    if (summaryBox) {
      summaryBox.style.display = 'flex';
      summaryBox.style.opacity = '1';
      summaryBox.style.transform = 'none';
    }
  } else if (targetState === 'focus') {
    cardCanvas.classList.add('not-typing', 'has-results', 'is-stage4');
    if (searchBoxWrapper) {
      searchBoxWrapper.style.display = 'none';
    }
    if (summaryBox) {
      summaryBox.style.display = 'flex';
      summaryBox.style.opacity = '1';
      summaryBox.style.transform = 'none';
    }
  } else if (targetState === 'timeline') {
    cardCanvas.classList.add('not-typing', 'has-results', 'is-stage4', 'is-stage5');
    if (searchBoxWrapper) {
      searchBoxWrapper.style.display = 'none';
    }
    if (summaryBox) {
      summaryBox.style.display = 'flex';
      summaryBox.style.opacity = '1';
      summaryBox.style.transform = 'none';
    }
  }
}

export function transitionToSearching() {
  const cardCanvas = document.getElementById('newsSearchCard') || document.getElementById('heroCanvas');
  const stepBtns = document.querySelectorAll('.step-btn');
  const headingRow = document.querySelector('.canvas-heading-row');
  const searchBoxWrapper = document.getElementById('searchBoxWrapper');
  const canvasWatermark = document.getElementById('canvasWatermark');
  const canvasHeadingIcon = document.getElementById('canvasHeadingIcon');

  const firstHeadingRect = headingRow ? headingRow.getBoundingClientRect() : null;
  const firstSearchRect = searchBoxWrapper ? searchBoxWrapper.getBoundingClientRect() : null;
  const firstWatermarkRect = canvasWatermark ? canvasWatermark.getBoundingClientRect() : null;

  if (cardCanvas) {
    cardCanvas.classList.remove('is-typing', 'has-results');
    cardCanvas.classList.add('not-typing', 'is-searching');
  }
  stepBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.step === 'searching'));

  if (searchBoxWrapper) {
    searchBoxWrapper.style.display = 'block';
    searchBoxWrapper.style.opacity = '1';
    searchBoxWrapper.style.transform = 'none';
  }

  const lastHeadingRect = headingRow ? headingRow.getBoundingClientRect() : null;
  const lastSearchRect = searchBoxWrapper ? searchBoxWrapper.getBoundingClientRect() : null;
  const lastIconRect = canvasHeadingIcon ? canvasHeadingIcon.getBoundingClientRect() : null;

  const duration = 650;
  const easeCurve = 'cubic-bezier(0.16, 1, 0.3, 1)';

  if (firstHeadingRect && lastHeadingRect) {
    const dxHeading = firstHeadingRect.left - lastHeadingRect.left;
    const dyHeading = firstHeadingRect.top - lastHeadingRect.top;
    const headingAnim = headingRow.animate([
      { transform: `translate(${dxHeading}px, ${dyHeading}px)` },
      { transform: 'translate(0, 0)' }
    ], { duration, easing: easeCurve, fill: 'none' });
    state.activeAnimations.push(headingAnim);
  }

  if (firstSearchRect && lastSearchRect) {
    const dxSearch = firstSearchRect.left - lastSearchRect.left;
    const dySearch = firstSearchRect.top - lastSearchRect.top;
    const searchAnim = searchBoxWrapper.animate([
      { transform: `translate(${dxSearch}px, ${dySearch}px)`, width: `${firstSearchRect.width}px` },
      { transform: 'translate(0, 0)', width: `${lastSearchRect.width}px` }
    ], { duration, easing: easeCurve, fill: 'none' });
    state.activeAnimations.push(searchAnim);
  }

  if (canvasWatermark && canvasHeadingIcon && firstWatermarkRect && lastIconRect && firstWatermarkRect.width > 0 && lastIconRect.width > 0) {
    try {
      canvasWatermark.getAnimations().forEach(anim => anim.cancel());
    } catch (e) {}
    canvasWatermark.style.display = 'block';
    canvasHeadingIcon.style.opacity = '0';
    canvasHeadingIcon.style.transition = 'none';

    const wCenterX = firstWatermarkRect.left + firstWatermarkRect.width / 2;
    const wCenterY = firstWatermarkRect.top + firstWatermarkRect.height / 2;
    const iCenterX = lastIconRect.left + lastIconRect.width / 2;
    const iCenterY = lastIconRect.top + lastIconRect.height / 2;

    const dxWatermark = iCenterX - wCenterX;
    const dyWatermark = iCenterY - wCenterY;
    const scaleWatermark = lastIconRect.width / firstWatermarkRect.width;

    canvasWatermark.style.transformOrigin = 'center center';
    canvasWatermark.style.zIndex = '12';
    canvasWatermark.style.opacity = '0.12';

    const watermarkMorphAnim = canvasWatermark.animate([
      { transform: 'translate(0px, 0px) scale(1)', opacity: 0.12 },
      { offset: 0.35, opacity: 0.65 },
      { transform: `translate(${dxWatermark}px, ${dyWatermark}px) scale(${scaleWatermark})`, opacity: 1 }
    ], { duration, easing: easeCurve, fill: 'forwards' });
    state.activeAnimations.push(watermarkMorphAnim);

    watermarkMorphAnim.onfinish = () => {
      try { watermarkMorphAnim.cancel(); } catch (e) {}
      canvasHeadingIcon.style.opacity = '1';
      canvasWatermark.style.opacity = '0';
      canvasWatermark.style.zIndex = '';
      canvasWatermark.style.transform = 'none';
      canvasWatermark.style.display = 'none';
    };
  }
}

export function transitionToTyping() {
  const headingRow = document.querySelector('.canvas-heading-row');
  const searchBoxWrapper = document.getElementById('searchBoxWrapper');
  const canvasWatermark = document.getElementById('canvasWatermark');
  const canvasHeadingIcon = document.getElementById('canvasHeadingIcon');

  const firstHeadingRect = headingRow ? headingRow.getBoundingClientRect() : null;
  const firstSearchRect = searchBoxWrapper ? searchBoxWrapper.getBoundingClientRect() : null;
  const firstIconRect = canvasHeadingIcon ? canvasHeadingIcon.getBoundingClientRect() : null;

  setCanvasState('typing');

  const lastHeadingRect = headingRow ? headingRow.getBoundingClientRect() : null;
  const lastSearchRect = searchBoxWrapper ? searchBoxWrapper.getBoundingClientRect() : null;
  const lastWatermarkRect = canvasWatermark ? canvasWatermark.getBoundingClientRect() : null;

  const duration = 600;
  const easeCurve = 'cubic-bezier(0.16, 1, 0.3, 1)';

  if (firstHeadingRect && lastHeadingRect) {
    const dxHeading = firstHeadingRect.left - lastHeadingRect.left;
    const dyHeading = firstHeadingRect.top - lastHeadingRect.top;
    const headingAnim = headingRow.animate([
      { transform: `translate(${dxHeading}px, ${dyHeading}px)` },
      { transform: 'translate(0, 0)' }
    ], { duration, easing: easeCurve, fill: 'none' });
    state.activeAnimations.push(headingAnim);
  }

  if (firstSearchRect && lastSearchRect) {
    const dxSearch = firstSearchRect.left - lastSearchRect.left;
    const dySearch = firstSearchRect.top - lastSearchRect.top;
    const searchAnim = searchBoxWrapper.animate([
      { transform: `translate(${dxSearch}px, ${dySearch}px)`, width: `${firstSearchRect.width}px` },
      { transform: 'translate(0, 0)', width: `${lastSearchRect.width}px` }
    ], { duration, easing: easeCurve, fill: 'none' });
    state.activeAnimations.push(searchAnim);
  }

  if (canvasWatermark && canvasHeadingIcon && firstIconRect && lastWatermarkRect && lastWatermarkRect.width > 0 && firstIconRect.width > 0) {
    try {
      canvasWatermark.getAnimations().forEach(anim => anim.cancel());
    } catch (e) {}
    canvasHeadingIcon.style.opacity = '0';
    canvasWatermark.style.display = 'block';

    const iCenterX = firstIconRect.left + firstIconRect.width / 2;
    const iCenterY = firstIconRect.top + firstIconRect.height / 2;
    const wCenterX = lastWatermarkRect.left + lastWatermarkRect.width / 2;
    const wCenterY = lastWatermarkRect.top + lastWatermarkRect.height / 2;

    const dx = iCenterX - wCenterX;
    const dy = iCenterY - wCenterY;
    const startScale = firstIconRect.width / lastWatermarkRect.width;

    canvasWatermark.style.transformOrigin = 'center center';
    canvasWatermark.style.zIndex = '12';

    const reverseMorphAnim = canvasWatermark.animate([
      { transform: `translate(${dx}px, ${dy}px) scale(${startScale})`, opacity: 1 },
      { offset: 0.65, opacity: 0.35 },
      { transform: 'translate(0px, 0px) scale(1)', opacity: 0.12 }
    ], { duration, easing: easeCurve, fill: 'forwards' });
    state.activeAnimations.push(reverseMorphAnim);

    reverseMorphAnim.onfinish = () => {
      try { reverseMorphAnim.cancel(); } catch (e) {}
      canvasWatermark.style.opacity = '';
      canvasWatermark.style.zIndex = '';
      canvasWatermark.style.transform = '';
      canvasWatermark.style.display = 'block';
      clearTokenMeterTimers();
      const tokenBars = document.querySelectorAll('.token-meter-bar');
      tokenBars.forEach(b => b.classList.remove('is-dimmed', 'is-half'));
    };
  }
}

export function transitionToOverview() {
  const headingRow = document.querySelector('.canvas-heading-row');
  const searchBoxWrapper = document.getElementById('searchBoxWrapper');
  const summaryBox = document.getElementById('summaryBox');

  const firstHeadingRect = headingRow ? headingRow.getBoundingClientRect() : null;

  if (searchBoxWrapper && searchBoxWrapper.style.display !== 'none') {
    const searchExitAnim = searchBoxWrapper.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-10px)' }
    ], { duration: 280, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' });
    state.activeAnimations.push(searchExitAnim);
  }

  setCanvasState('overview');
  if (searchBoxWrapper) searchBoxWrapper.style.display = 'none';
  if (summaryBox) {
    summaryBox.style.display = 'flex';
    summaryBox.style.opacity = '1';
    summaryBox.style.transform = 'none';
  }

  if (!headingRow || !firstHeadingRect) return;
  const lastHeadingRect = headingRow.getBoundingClientRect();
  const dxHeading = firstHeadingRect.left - lastHeadingRect.left;
  const dyHeading = firstHeadingRect.top - lastHeadingRect.top;

  const duration = 520;
  const easeCurve = 'cubic-bezier(0.4, 0, 0.2, 1)';

  if (Math.abs(dxHeading) > 0.5 || Math.abs(dyHeading) > 0.5) {
    const headingAnim = headingRow.animate([
      { transform: `translate(${dxHeading}px, ${dyHeading}px)` },
      { transform: 'translate(0, 0)' }
    ], { duration, easing: easeCurve, fill: 'none' });
    state.activeAnimations.push(headingAnim);
  }

  if (summaryBox) {
    const summaryAnim = summaryBox.animate([
      { opacity: 0, transform: 'translateY(16px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 480, delay: 40, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' });
    state.activeAnimations.push(summaryAnim);
  }
}

export async function runCycle(fromStep = 'typing') {
  state.currentSequenceId++;
  const seq = state.currentSequenceId;
  const isValid = () => seq === state.currentSequenceId;

  const curData = getCurrentData(state.currentVerticalKey);
  const QUERY_TEXT = curData.query;
  const SUBJECTS_DATA = curData.subjects;
  const TOTAL_SUBJECTS = curData.stats.num1;
  const TOTAL_ARTICLES = curData.stats.num2;

  clearActiveAnimations();

  const replayBtn = document.getElementById('replayBtn');
  const togglePlayBtn = document.getElementById('togglePlayBtn');
  const cardCanvas = document.getElementById('newsSearchCard') || document.getElementById('heroCanvas');
  const queryTextSpan = document.getElementById('queryTextSpan');
  const cardListContainer = document.getElementById('cardListContainer');
  const resultsViewport = document.getElementById('resultsViewport');
  const statSubjectsEl = document.getElementById('statSubjects');
  const statArticlesEl = document.getElementById('statArticles');

  if (replayBtn) replayBtn.classList.remove('visible');

  const stepOrder = ['typing', 'searching', 'overview', 'focus', 'timeline'];
  let startIndex = stepOrder.indexOf(fromStep);
  if (startIndex < 0) startIndex = 0;

  // --------------------------------------------------
  // STAGE 1: TYPING
  // --------------------------------------------------
  if (startIndex <= 0) {
    const searchBoxWrapper = document.getElementById('searchBoxWrapper');
    const summaryBox = document.getElementById('summaryBox');
    if (searchBoxWrapper) {
      searchBoxWrapper.style.display = 'block';
      searchBoxWrapper.style.opacity = '1';
      searchBoxWrapper.style.transform = 'none';
    }
    if (summaryBox) {
      summaryBox.style.opacity = '1';
      summaryBox.style.transform = 'none';
    }

    if (state.currentActiveStep !== 'typing') {
      transitionToTyping();
    } else {
      setCanvasState('typing');
    }
    if (queryTextSpan) queryTextSpan.textContent = '';
    if (cardListContainer) cardListContainer.style.transform = 'none';
    resetQueryDisplayScroll();
    await sleep(500);
    if (!isValid()) return;

    for (let i = 1; i <= QUERY_TEXT.length; i++) {
      if (queryTextSpan) queryTextSpan.textContent = QUERY_TEXT.slice(0, i);
      updateQueryDisplayScroll();
      await sleep(32);
      if (!isValid()) return;
    }
    await sleep(700);
    if (!isValid()) return;
  }

  // --------------------------------------------------
  // STAGE 2: SEARCHING
  // --------------------------------------------------
  if (startIndex <= 1) {
    if (queryTextSpan) queryTextSpan.textContent = QUERY_TEXT;
    if (startIndex === 1 && cardCanvas && !cardCanvas.classList.contains('is-typing')) {
      setCanvasState('searching');
    } else {
      transitionToSearching();
    }
    await sleep(1100);
    if (!isValid()) return;
  }

  // --------------------------------------------------
  // STAGE 3: RESULTS OVERVIEW
  // --------------------------------------------------
  if (startIndex <= 2) {
    if (queryTextSpan) queryTextSpan.textContent = QUERY_TEXT;

    if (startIndex === 2 && cardCanvas && !cardCanvas.classList.contains('is-searching')) {
      setCanvasState('overview');
    } else {
      transitionToOverview();
    }
    playSellingPointsNumberFlow();

    if (statSubjectsEl) animateNumber(statSubjectsEl, 0, TOTAL_SUBJECTS, 1400);
    if (statArticlesEl) animateNumber(statArticlesEl, 0, TOTAL_ARTICLES, 1400);

    const tempFirstWrap = document.createElement('div');
    tempFirstWrap.innerHTML = createSubjectCardHTML(SUBJECTS_DATA[0], 0, true);
    const firstCard = tempFirstWrap.firstElementChild;
    firstCard.style.opacity = '0';
    firstCard.style.transform = 'translateY(24px) scale(0.97)';
    if (cardListContainer) {
      cardListContainer.innerHTML = '';
      cardListContainer.appendChild(firstCard);
    }

    const viewportH = resultsViewport ? resultsViewport.clientHeight : 360;
    const firstCardH = firstCard.offsetHeight || 96;
    const firstCardTop = firstCard.offsetTop;

    let currentTranslateY = Math.round((viewportH - firstCardH) / 2 - firstCardTop);
    if (cardListContainer) {
      cardListContainer.style.transform = `translateY(${currentTranslateY}px)`;
    }

    await sleep(100);
    if (!isValid()) return;

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

    for (let i = 1; i < SUBJECTS_DATA.length; i++) {
      const tempWrap = document.createElement('div');
      tempWrap.innerHTML = createSubjectCardHTML(SUBJECTS_DATA[i], i, false);
      const nextCard = tempWrap.firstElementChild;
      nextCard.style.opacity = '0';
      nextCard.style.transform = 'translateY(28px) scale(0.97)';
      if (cardListContainer) cardListContainer.appendChild(nextCard);

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

      if (cardListContainer) {
        const shiftAnim = cardListContainer.animate([
          { transform: `translateY(${currentTranslateY}px)` },
          { transform: `translateY(${targetTranslateY}px)` }
        ], { duration: stepDuration, easing: carouselPushEase, fill: 'forwards' });
        state.activeAnimations.push(shiftAnim);
      }

      const cardEnterAnim = nextCard.animate([
        { opacity: 0, transform: 'translateY(28px) scale(0.97)', filter: 'blur(4px)' },
        { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0px)' }
      ], { duration: stepDuration, easing: cardEntranceEase, fill: 'forwards' });
      state.activeAnimations.push(cardEnterAnim);

      currentTranslateY = targetTranslateY;
      if (cardListContainer) {
        cardListContainer.style.transform = `translateY(${currentTranslateY}px)`;
      }

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
    if (!isValid()) return;
  }

  // --------------------------------------------------
  // STAGE 4: TOP NEWS & HORIZONTAL SUBJECT TABS
  // --------------------------------------------------
  if (startIndex <= 3) {
    if (queryTextSpan) queryTextSpan.textContent = QUERY_TEXT;
    if (statSubjectsEl) statSubjectsEl.textContent = TOTAL_SUBJECTS;
    if (statArticlesEl) statArticlesEl.textContent = TOTAL_ARTICLES;

    syncSubjectPills(state.currentVerticalKey);

    if (startIndex === 3 && cardCanvas && !cardCanvas.classList.contains('has-results')) {
      setCanvasState('focus');
    } else {
      await transitionOverviewToFocus(isValid, seq);
      if (!isValid()) return;
    }

    const activePill = document.querySelector('.subject-h-pill.active');
    const activeIdx = activePill ? parseInt(activePill.dataset.subjectIdx, 10) : 0;
    updateTopNewsCard(activeIdx);
    renderTimelineStream(activeIdx, false);

    await sleep(750);
    if (!isValid()) return;
  }

  // --------------------------------------------------
  // STAGE 5: TIMELINE STREAM UNFOLD UNDER TOP NEWS
  // --------------------------------------------------
  if (queryTextSpan) queryTextSpan.textContent = QUERY_TEXT;
  if (statSubjectsEl) statSubjectsEl.textContent = TOTAL_SUBJECTS;
  if (statArticlesEl) statArticlesEl.textContent = TOTAL_ARTICLES;

  setCanvasState('timeline');

  const activePill = document.querySelector('.subject-h-pill.active');
  const activeIdx = activePill ? parseInt(activePill.dataset.subjectIdx, 10) : 0;
  updateTopNewsCard(activeIdx);

  await playStage5TimelineAnimation(isValid);
  if (!isValid()) return;

  if (replayBtn) replayBtn.classList.add('visible');

  state.isAutoLooping = false;
  if (togglePlayBtn) togglePlayBtn.textContent = '▶ Resume';
}
