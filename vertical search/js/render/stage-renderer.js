import { state } from '../state.js';
import { getCurrentData, formatDateTime, formatTimeOnly, formatDate, extractDomain, imageCache } from '../data/verticals-data.js';
import { createBusinessDualDetailHTML, createBusinessSummaryCardHTML } from './card-templates.js';

let currentSelectedSubjectIdx = 0;

export function getSelectedSubjectIdx() {
  return currentSelectedSubjectIdx;
}

export function setSelectedSubjectIdx(idx) {
  currentSelectedSubjectIdx = idx;
}

export function updateTopNewsCard(subjectIdx = 0) {
  const curData = getCurrentData();
  const subj = curData.subjects ? curData.subjects[subjectIdx] : null;
  if (!subj) return;
  const topTitle = document.getElementById('topNewsTitle');
  const topDesc = document.getElementById('topNewsDesc');
  const topThumb = document.getElementById('topNewsThumb');
  const topTime = document.getElementById('topNewsTime');
  const topSource = document.getElementById('topNewsSource');
  const topTag = document.getElementById('topNewsTag');

  if (topTag) topTag.textContent = curData.badgeText || 'Top News';
  if (topTitle) topTitle.textContent = subj.name;
  if (topDesc) topDesc.textContent = subj.summary;
  if (topThumb && subj.cover) {
    const targetSrc = subj.cover;
    const currentSrc = topThumb.getAttribute('src');

    if (currentSrc !== targetSrc) {
      topThumb.classList.add('is-fading');
      topThumb.src = targetSrc;
      topThumb.onerror = () => {
        if (subj.fallbackCover && topThumb.src !== subj.fallbackCover) {
          topThumb.src = subj.fallbackCover;
        }
      };
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          topThumb.classList.remove('is-fading');
        });
      });
    }
  }

  if (topTime && subj.timeLatest) {
    topTime.textContent = formatDateTime(subj.timeLatest).replace(/-/g, '/');
  }
  if (topSource && subj.articles && subj.articles[0]) {
    topSource.textContent = extractDomain(subj.articles[0].url) || (curData.id === 'business' ? 'wsj.com' : 'reuters.com');
  }
}

export function renderTimelineStream(subjectIdx = 0, makeVisible = false) {
  const spineTrack = document.getElementById('timelineSpineTrack');
  const articlesGroup = document.getElementById('timelineArticlesSubgroup');
  if (!spineTrack || !articlesGroup) return;

  currentSelectedSubjectIdx = subjectIdx;
  const curData = getCurrentData();
  const subject = (curData.subjects && curData.subjects[subjectIdx]) || (curData.subjects && curData.subjects[0]);
  if (!subject) return;

  const articles = (subject.articles || []).slice().sort((a, b) => new Date(a.timePublished) - new Date(b.timePublished));
  const stemHeight = articles.length > 1 ? (articles.length - 1) * 68 : 0;
  let spineHTML = `<div class="timeline-spine-stem" id="timelineSpineStem" style="height: ${stemHeight}px; transform: scaleY(${makeVisible ? 1 : 0});"></div>`;

  articles.forEach((art, i) => {
    const dotTop = i * 68 + 24;
    spineHTML += `<div class="timeline-dot-node ${makeVisible ? 'visible' : ''}" data-dot-idx="${i}" style="top: ${dotTop}px;"></div>`;
  });
  spineTrack.innerHTML = spineHTML;

  let articlesHTML = '';
  articles.forEach((art, i) => {
    const domain = extractDomain(art.url);
    let timeStr = formatTimeOnly(art.timePublished);
    const isLastCard = i === articles.length - 1;
    let badgeHTML = '';
    if (isLastCard) {
      const defaultRelativeMap = {
        0: '3m ago',
        1: '10m ago',
        2: '24m ago',
        3: '36m ago'
      };
      timeStr = art.relativeTime || defaultRelativeMap[subjectIdx] || '3m ago';
      badgeHTML = '<span class="timeline-latest-tag">latest</span>';
    }
    articlesHTML += `
      <div class="timeline-sub-article ${makeVisible ? 'visible' : ''}" data-article-idx="${i}">
        <div class="sub-article-meta">
          <div class="sub-article-time-group">
            <span class="sub-article-time">${timeStr}</span>
            ${badgeHTML}
          </div>
          <span class="sub-article-domain">${domain}</span>
        </div>
        <p class="sub-article-title" title="${art.title.replace(/"/g, '&quot;')}">${art.title}</p>
      </div>
    `;
  });
  articlesGroup.innerHTML = articlesHTML;
}

/**
/**
 * Render Business Search Dual Cards with Spatial Push-out
 * (Active card expands to 472px detail, non-active card in overview form pushed out of viewport)
 */
export function renderBusinessDualDetail(mode = 'company') {
  const curData = getCurrentData('business');
  const entities = curData.entities || [];

  currentSelectedSubjectIdx = (mode === 'person' || mode === 1) ? 1 : 0;
  const topNewsBlock = document.getElementById('topNewsBlock');
  const timelineStreamBlock = document.getElementById('timelineStreamBlock');
  const businessDetailBlock = document.getElementById('businessDetailBlock');
  const cardListContainer = document.getElementById('cardListContainer');

  if (topNewsBlock) topNewsBlock.style.display = 'none';
  if (timelineStreamBlock) timelineStreamBlock.style.display = 'none';
  if (businessDetailBlock) businessDetailBlock.style.display = 'none';

  if (!cardListContainer) return;

  // Ensure cardListContainer has the two business cards in overview format
  if (!cardListContainer.querySelector('.biz-figma-card')) {
    let html = '';
    entities.forEach((ent, i) => {
      html += createBusinessSummaryCardHTML(ent, i);
    });
    cardListContainer.innerHTML = html;
  }
  cardListContainer.style.transform = 'translateY(0px)';

  // Reset all state classes
  cardListContainer.classList.remove('stage-company-active', 'stage-person-active', 'hover-company-active', 'hover-person-active');

  if (mode === 'company' || mode === 0) {
    cardListContainer.classList.add('stage-company-active');
    const scrollAreas = cardListContainer.querySelectorAll('.biz-overview-scroll-area');
    scrollAreas.forEach(sa => { sa.scrollTop = 0; });
  } else if (mode === 'person' || mode === 1) {
    cardListContainer.classList.add('stage-person-active');
    const scrollAreas = cardListContainer.querySelectorAll('.biz-overview-scroll-area');
    scrollAreas.forEach(sa => { sa.scrollTop = 0; });
  } else {
    // Mode is 'overview': neutral stacked state with interactive hover
    const scrollAreas = cardListContainer.querySelectorAll('.biz-overview-scroll-area');
    scrollAreas.forEach(sa => { sa.scrollTop = 0; });
    const allDots = cardListContainer.querySelectorAll('.biz-overview-full-sections .biz-figma-timeline-dot');
    allDots.forEach(dot => { dot.style.animation = ''; });
    initBusinessOverviewHover(cardListContainer);
  }
}

export function renderBusinessDetail(idxOrMode = 0) {
  if (idxOrMode === 'overview') {
    renderBusinessDualDetail('overview');
  } else {
    const mode = (idxOrMode === 1 || idxOrMode === 'person') ? 'person' : 'company';
    renderBusinessDualDetail(mode);
  }
}

export function handlePillClick(idx) {
  const cardCanvas = document.getElementById('newsSearchCard') || document.getElementById('heroCanvas');
  currentSelectedSubjectIdx = idx;

  if (state.currentVerticalKey === 'business') {
    renderBusinessDetail(idx);
    return;
  }

  // News vertical handling
  const topNewsBlock = document.getElementById('topNewsBlock');
  const timelineStreamBlock = document.getElementById('timelineStreamBlock');
  const businessDetailBlock = document.getElementById('businessDetailBlock');
  if (businessDetailBlock) businessDetailBlock.style.display = 'none';
  if (topNewsBlock) topNewsBlock.style.display = '';
  if (timelineStreamBlock) timelineStreamBlock.style.display = '';

  updateTopNewsCard(idx);
  const isTimelineActive = cardCanvas && cardCanvas.classList.contains('is-stage5');
  if (isTimelineActive) {
    state.currentSequenceId++;
    if (state.timelineScrollCleanup) {
      state.timelineScrollCleanup();
      state.timelineScrollCleanup = null;
    }
    const streamBlock = document.getElementById('timelineStreamBlock');
    if (streamBlock) {
      streamBlock.classList.remove('is-animating');
      streamBlock.style.overflowY = 'auto';
      streamBlock.style.pointerEvents = 'auto';
    }
    renderTimelineStream(idx, true);
    if (streamBlock) {
      requestAnimationFrame(() => {
        const maxScroll = Math.max(0, streamBlock.scrollHeight - streamBlock.clientHeight);
        streamBlock.scrollTop = maxScroll;
      });
    }
  } else {
    renderTimelineStream(idx, false);
  }
}

export function initSubjectsHBar() {
  const subjectsHBar = document.getElementById('subjectsHBar');
  if (!subjectsHBar || subjectsHBar.dataset.bound === 'true') return;
  subjectsHBar.dataset.bound = 'true';

  subjectsHBar.addEventListener('click', (e) => {
    const pill = e.target.closest('.subject-h-pill');
    if (!pill) return;
    if (pill.classList.contains('active')) return;
    const allPills = subjectsHBar.querySelectorAll('.subject-h-pill');
    allPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const idx = parseInt(pill.dataset.subjectIdx ?? pill.dataset.entityIdx, 10);
    handlePillClick(idx);
  });
}

export function syncSubjectPills(key = state.currentVerticalKey, onPillClick = null) {
  const subjectsHBar = document.getElementById('subjectsHBar');
  if (!subjectsHBar) return;
  initSubjectsHBar();

  if (key === 'business') {
    subjectsHBar.style.display = 'none';
    return;
  }

  subjectsHBar.style.display = '';
  const curData = getCurrentData(key);
  let html = '';
  const subjects = curData.subjects || [];
  subjects.forEach((subj, idx) => {
    html += `<div class="subject-h-pill ${idx === 0 ? 'active' : ''}" data-subject-idx="${idx}">Subject${idx + 1}</div>`;
  });

  subjectsHBar.innerHTML = html;

  if (typeof onPillClick === 'function') {
    const pills = subjectsHBar.querySelectorAll('.subject-h-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const idx = parseInt(pill.dataset.subjectIdx ?? pill.dataset.entityIdx, 10);
        onPillClick(idx);
      });
    });
  }
}

/**
 * Stage 5 Overview: Hover-to-Expand & Push-to-Dismiss Interactive Behavior
 * When hovering Company (Card 0): expands full details, pushes Person (Card 1) down out of viewport.
 * When hovering Person (Card 1): expands full details, shifts up into viewport, pushes Company (Card 0) up out of viewport.
 * When unhovered: smoothly restores both cards to compact overview stacked state.
 */
export function initBusinessOverviewHover(container) {
  if (!container) return;

  // Clean up any stale state classes
  container.classList.remove('hover-company-active', 'hover-person-active');

  let currentActive = null; // 'company' | 'person' | null
  let leaveTimer = null;

  const triggerStaggeredDotPulse = (entityIdx) => {
    const cardWrapper = container.querySelector(`.business-card-wrapper[data-entity-idx="${entityIdx}"]`);
    if (!cardWrapper) return;
    const dots = cardWrapper.querySelectorAll('.biz-overview-full-sections .biz-figma-timeline-dot');
    dots.forEach((dot, i) => {
      dot.style.animation = 'none';
      void dot.offsetWidth; // Force reflow
      const delay = (0.08 + i * 0.08).toFixed(2);
      dot.style.animation = `bizNodePulse 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s both`;
    });
  };

  const resetDotsAnimation = () => {
    const allDots = container.querySelectorAll('.biz-overview-full-sections .biz-figma-timeline-dot');
    allDots.forEach(dot => {
      dot.style.animation = '';
    });
  };

  const setHoverState = (nextState) => {
    if (leaveTimer) {
      clearTimeout(leaveTimer);
      leaveTimer = null;
    }
    if (currentActive === nextState) return;
    currentActive = nextState;

    container.classList.remove('hover-company-active', 'hover-person-active');
    if (nextState === 'company') {
      container.classList.add('hover-company-active');
      triggerStaggeredDotPulse(0);
    } else if (nextState === 'person') {
      container.classList.add('hover-person-active');
      triggerStaggeredDotPulse(1);
    } else {
      // Returning to default overview: reset scroll position & dots animation
      const scrollAreas = container.querySelectorAll('.biz-overview-scroll-area');
      scrollAreas.forEach(sa => { sa.scrollTop = 0; });
      resetDotsAnimation();
    }
  };

  const handlePointerEvent = (e) => {
    if (container.classList.contains('stage-company-active') || container.classList.contains('stage-person-active')) {
      return;
    }
    const cardWrapper = e.target.closest('.business-card-wrapper');
    if (cardWrapper) {
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = null;
      }
      const idx = cardWrapper.dataset.entityIdx;
      if (idx === '0') {
        setHoverState('company');
      } else if (idx === '1') {
        setHoverState('person');
      }
    } else {
      // Pointer is over container padding/empty space
      if (currentActive && !leaveTimer) {
        leaveTimer = setTimeout(() => {
          setHoverState(null);
        }, 160);
      }
    }
  };

  const handlePointerLeave = () => {
    if (container.classList.contains('stage-company-active') || container.classList.contains('stage-person-active')) {
      return;
    }
    if (leaveTimer) clearTimeout(leaveTimer);
    leaveTimer = setTimeout(() => {
      setHoverState(null);
    }, 120);
  };

  if (container._bizOverviewOverHandler) {
    container.removeEventListener('pointerover', container._bizOverviewOverHandler);
    container.removeEventListener('pointermove', container._bizOverviewOverHandler);
  }
  if (container._bizOverviewLeaveHandler) {
    container.removeEventListener('pointerleave', container._bizOverviewLeaveHandler);
  }

  container._bizOverviewOverHandler = handlePointerEvent;
  container._bizOverviewLeaveHandler = handlePointerLeave;

  container.addEventListener('pointerover', handlePointerEvent);
  container.addEventListener('pointermove', handlePointerEvent);
  container.addEventListener('pointerleave', handlePointerLeave);

  // Directly bind pointerenter/mouseenter/pointerover on each card wrapper and all its child blocks
  const cardWrappers = container.querySelectorAll('.business-card-wrapper');
  cardWrappers.forEach(cw => {
    const idx = cw.dataset.entityIdx;
    const targetState = idx === '0' ? 'company' : 'person';
    const onEnter = () => {
      if (container.classList.contains('stage-company-active') || container.classList.contains('stage-person-active')) {
        return;
      }
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = null;
      }
      setHoverState(targetState);
    };

    cw.addEventListener('pointerenter', onEnter);
    cw.addEventListener('mouseenter', onEnter);
    cw.addEventListener('pointerover', onEnter);

    // Deep-bind on all sub-cards and sensitive interactive regions (stats-grid, stat-cell, activity-bar, etc.)
    const subRegions = cw.querySelectorAll('.biz-figma-card, .biz-figma-stats-grid, .biz-figma-stat-cell, .biz-figma-header, .biz-figma-desc, .biz-figma-activity-bar, .biz-figma-links-row, .biz-figma-link-item, .biz-overview-scroll-area');
    subRegions.forEach(el => {
      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('pointerover', onEnter);
    });
  });
}
