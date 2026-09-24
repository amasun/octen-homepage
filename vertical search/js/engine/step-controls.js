/**
 * Developer Controls, Step Jumping, Replay, and Mouse Hover Bindings
 */
import { state, clearActiveAnimations } from '../state.js';
import { getCurrentData } from '../data/verticals-data.js';
import { createSubjectCardHTML, createBusinessSummaryCardHTML } from '../render/card-templates.js';
import { updateTopNewsCard, renderTimelineStream, syncSubjectPills, handlePillClick, initSubjectsHBar, renderBusinessDetail } from '../render/stage-renderer.js';
import { playSellingPointsNumberFlow } from '../animations/widgets.js';
import { playStage5TimelineAnimation } from '../animations/timeline.js';
import { transitionToTyping, transitionToSearching, transitionToOverview, setCanvasState, runCycle, updateQueryDisplayScroll } from './stage-controller.js';
import { transitionOverviewToFocus } from './flip-morph.js';

export function initStepControls() {
  const togglePlayBtn = document.getElementById('togglePlayBtn');
  const stepBtns = document.querySelectorAll('.step-btn');
  const replayBtn = document.getElementById('replayBtn');
  const cardListContainer = document.getElementById('cardListContainer');
  const queryTextSpan = document.getElementById('queryTextSpan');
  const statSubjectsEl = document.getElementById('statSubjects');
  const statArticlesEl = document.getElementById('statArticles');
  const cardCanvas = document.getElementById('newsSearchCard') || document.getElementById('heroCanvas');
  const resultsViewport = document.getElementById('resultsViewport');
  const eventsWhiteCard = document.getElementById('eventsWhiteCard');

  // Initialize horizontal subject bar delegation
  initSubjectsHBar();

  if (togglePlayBtn) {
    togglePlayBtn.addEventListener('click', () => {
      state.isAutoLooping = !state.isAutoLooping;
      togglePlayBtn.textContent = state.isAutoLooping ? '⏸ Pause' : '▶ Resume';
      if (state.isAutoLooping) {
        if (replayBtn) replayBtn.classList.remove('visible');
        runCycle(state.currentActiveStep === 'timeline' ? 'typing' : state.currentActiveStep);
      } else {
        state.currentSequenceId++;
        state.activeAnimations.forEach(a => { try { a.pause(); } catch (e) {} });
      }
    });
  }

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.isAutoLooping = false;
      if (togglePlayBtn) togglePlayBtn.textContent = '▶ Resume';
      state.currentSequenceId++;
      clearActiveAnimations();
      if (replayBtn) replayBtn.classList.remove('visible');

      const curData = getCurrentData(state.currentVerticalKey);
      const QUERY_TEXT = curData.query;
      const SUBJECTS_DATA = curData.subjects;
      const TOTAL_SUBJECTS = curData.stats.num1;
      const TOTAL_ARTICLES = curData.stats.num2;

      const targetStep = btn.dataset.step;

      if (targetStep === 'typing') {
        if (state.currentActiveStep !== 'typing') {
          transitionToTyping();
        } else {
          setCanvasState('typing');
        }
        if (queryTextSpan) queryTextSpan.textContent = QUERY_TEXT;
        updateQueryDisplayScroll();
        if (cardListContainer) cardListContainer.innerHTML = '';
      } else if (targetStep === 'searching') {
        if (queryTextSpan) queryTextSpan.textContent = QUERY_TEXT;
        if (cardListContainer) cardListContainer.innerHTML = '';
        if (cardCanvas && cardCanvas.classList.contains('is-typing')) {
          transitionToSearching();
        } else {
          setCanvasState('searching');
        }
      } else if (targetStep === 'company-detail') {
        setCanvasState('company-detail');
        if (queryTextSpan) queryTextSpan.textContent = QUERY_TEXT;
        if (statSubjectsEl) statSubjectsEl.textContent = TOTAL_SUBJECTS;
        if (statArticlesEl) statArticlesEl.textContent = TOTAL_ARTICLES;
        renderBusinessDetail(0);
      } else if (targetStep === 'person-detail') {
        setCanvasState('person-detail');
        if (queryTextSpan) queryTextSpan.textContent = QUERY_TEXT;
        if (statSubjectsEl) statSubjectsEl.textContent = TOTAL_SUBJECTS;
        if (statArticlesEl) statArticlesEl.textContent = TOTAL_ARTICLES;
        renderBusinessDetail(1);
        const activityNodes = document.querySelectorAll('.biz-activity-node, .biz-career-dot');
        activityNodes.forEach((node, i) => {
          node.style.animation = 'bizNodePulse 0.4s ease forwards ' + (i * 0.15) + 's';
        });
      } else if (targetStep === 'overview') {
        if (state.currentVerticalKey === 'business') {
          setCanvasState('overview');
          if (queryTextSpan) queryTextSpan.textContent = QUERY_TEXT;
          if (statSubjectsEl) statSubjectsEl.textContent = TOTAL_SUBJECTS;
          if (statArticlesEl) statArticlesEl.textContent = TOTAL_ARTICLES;
          const entities = curData.entities || [];
          let html = '';
          entities.forEach((ent, i) => {
            html += createBusinessSummaryCardHTML(ent, i);
          });
          if (cardListContainer) {
            cardListContainer.innerHTML = html;
            cardListContainer.style.transform = 'translateY(0px)';
          }
          if (replayBtn) replayBtn.classList.add('visible');
        } else {
          if (state.currentActiveStep === 'searching') {
            transitionToOverview();
          } else {
            setCanvasState('overview');
          }
          playSellingPointsNumberFlow();
          if (queryTextSpan) queryTextSpan.textContent = QUERY_TEXT;
          if (statSubjectsEl) statSubjectsEl.textContent = TOTAL_SUBJECTS;
          if (statArticlesEl) statArticlesEl.textContent = TOTAL_ARTICLES;
          let html = '';
          SUBJECTS_DATA.forEach((s, i) => { html += createSubjectCardHTML(s, i, i === 0); });
          if (cardListContainer) {
            cardListContainer.innerHTML = html;
            cardListContainer.style.transform = 'translateY(0px)';
          }
        }
      } else if (targetStep === 'focus') {
        syncSubjectPills(state.currentVerticalKey);
        if (queryTextSpan) queryTextSpan.textContent = QUERY_TEXT;
        if (statSubjectsEl) statSubjectsEl.textContent = TOTAL_SUBJECTS;
        if (statArticlesEl) statArticlesEl.textContent = TOTAL_ARTICLES;

        const prevStep = state.currentActiveStep;
        if (prevStep === 'overview' && cardListContainer && cardListContainer.querySelector('.subject-badge')) {
          transitionOverviewToFocus(() => true, state.currentSequenceId);
        } else {
          setCanvasState('focus');
        }
        const activePill = document.querySelector('.subject-h-pill.active');
        const activeIdx = activePill ? parseInt(activePill.dataset.subjectIdx, 10) : 0;
        updateTopNewsCard(activeIdx);
        renderTimelineStream(activeIdx, false);
      } else if (targetStep === 'timeline') {
        syncSubjectPills(state.currentVerticalKey);
        setCanvasState('timeline');
        if (queryTextSpan) queryTextSpan.textContent = QUERY_TEXT;
        if (statSubjectsEl) statSubjectsEl.textContent = TOTAL_SUBJECTS;
        if (statArticlesEl) statArticlesEl.textContent = TOTAL_ARTICLES;

        const activePill = document.querySelector('.subject-h-pill.active');
        const activeIdx = activePill ? parseInt(activePill.dataset.subjectIdx, 10) : 0;
        updateTopNewsCard(activeIdx);
        const seq = state.currentSequenceId;
        playStage5TimelineAnimation(() => seq === state.currentSequenceId).then(() => {
          if (seq === state.currentSequenceId && replayBtn) {
            replayBtn.classList.add('visible');
          }
        });
      }
    });
  });

  // Business Card Click Interactions (Step 5: clicking Company card expands Company Detail, clicking Person card expands Person Detail)
  if (cardListContainer && cardListContainer.dataset.boundBiz !== 'true') {
    cardListContainer.dataset.boundBiz = 'true';
    cardListContainer.addEventListener('click', (e) => {
      if (state.currentVerticalKey !== 'business') return;
      const card = e.target.closest('.biz-figma-card, .business-card-wrapper');
      if (!card) return;
      const idx = parseInt(card.dataset.entityIdx, 10);
      if (idx === 0) {
        const compBtn = document.querySelector('.step-btn[data-step="company-detail"]') || document.querySelectorAll('.step-btn')[2];
        if (compBtn) compBtn.click();
      } else if (idx === 1) {
        const persBtn = document.querySelector('.step-btn[data-step="person-detail"]') || document.querySelectorAll('.step-btn')[3];
        if (persBtn) persBtn.click();
      }
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      replayBtn.classList.remove('visible');
      const canvasWatermark = document.getElementById('canvasWatermark');
      if (canvasWatermark) {
        canvasWatermark.classList.remove('watermark-pop');
        void canvasWatermark.offsetWidth;
        canvasWatermark.classList.add('watermark-pop');
      }
      syncSubjectPills(state.currentVerticalKey);
      state.isAutoLooping = true;
      if (togglePlayBtn) togglePlayBtn.textContent = '⏸ Pause';
      runCycle('typing');
    });
  }

  syncSubjectPills(state.currentVerticalKey);

  if (resultsViewport) {
    resultsViewport.addEventListener('mouseenter', () => {
      state.isUserHovered = true;
      state.activeAnimations.forEach(a => {
        try { if (a.playState === 'running') a.pause(); } catch (e) {}
      });
    });
    resultsViewport.addEventListener('mouseleave', () => {
      state.isUserHovered = false;
      state.activeAnimations.forEach(a => {
        try { if (a.playState === 'paused') a.play(); } catch (e) {}
      });
    });
  }

  if (eventsWhiteCard) {
    eventsWhiteCard.addEventListener('mouseenter', () => {
      state.isUserHovered = true;
    });
    eventsWhiteCard.addEventListener('mouseleave', () => {
      state.isUserHovered = false;
    });
  }
}

export { handlePillClick, syncSubjectPills, initSubjectsHBar };
