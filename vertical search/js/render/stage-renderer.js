import { state } from '../state.js';
import { getCurrentData, formatDateTime, formatTimeOnly, formatDate, extractDomain, imageCache } from '../data/verticals-data.js';
import { createBusinessDualDetailHTML } from './card-templates.js';

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
 * Render Business Search Dual Accordion Detail Cards (Company on Top, Person on Bottom)
 */
export function renderBusinessDualDetail(mode = 'company') {
  const curData = getCurrentData('business');
  const compEntity = curData.entities ? curData.entities[0] : null;
  const persEntity = curData.entities ? curData.entities[1] : null;

  currentSelectedSubjectIdx = mode === 'person' ? 1 : 0;
  const topNewsBlock = document.getElementById('topNewsBlock');
  const timelineStreamBlock = document.getElementById('timelineStreamBlock');
  const businessDetailBlock = document.getElementById('businessDetailBlock');

  if (topNewsBlock) topNewsBlock.style.display = 'none';
  if (timelineStreamBlock) timelineStreamBlock.style.display = 'none';

  if (!businessDetailBlock) return;
  businessDetailBlock.style.display = 'flex';

  const compCard = document.getElementById('bizCompanyAccordionCard');
  const persCard = document.getElementById('bizPersonAccordionCard');

  if (compCard && persCard && compCard.querySelector('.biz-figma-sec-group')) {
    if (mode === 'company') {
      compCard.classList.remove('is-collapsed');
      compCard.classList.add('is-expanded');
      compCard.title = '';
      persCard.classList.remove('is-expanded');
      persCard.classList.add('is-collapsed');
      persCard.title = 'Click to expand Bom Kim';
      const scrollArea = compCard.querySelector('.biz-accordion-scroll-area');
      if (scrollArea) scrollArea.scrollTop = 0;
    } else {
      compCard.classList.remove('is-expanded');
      compCard.classList.add('is-collapsed');
      compCard.title = 'Click to expand Coupang';
      persCard.classList.remove('is-collapsed');
      persCard.classList.add('is-expanded');
      persCard.title = '';
      const scrollArea = persCard.querySelector('.biz-accordion-scroll-area');
      if (scrollArea) scrollArea.scrollTop = 0;
    }
  } else {
    businessDetailBlock.innerHTML = createBusinessDualDetailHTML(compEntity, persEntity, mode);
  }

  // Bind click toggle on accordion cards
  if (businessDetailBlock.dataset.boundAccordion !== 'true') {
    businessDetailBlock.dataset.boundAccordion = 'true';
    businessDetailBlock.addEventListener('click', (e) => {
      const card = e.target.closest('.biz-accordion-card');
      if (!card) return;
      if (card.classList.contains('is-collapsed')) {
        const type = card.dataset.entityType;
        if (type === 'company') {
          const compBtn = document.querySelector('.step-btn[data-step="company-detail"]') || document.querySelectorAll('.step-btn')[2];
          if (compBtn) compBtn.click();
        } else if (type === 'person') {
          const persBtn = document.querySelector('.step-btn[data-step="person-detail"]') || document.querySelectorAll('.step-btn')[3];
          if (persBtn) persBtn.click();
        }
      }
    });
  }
}

export function renderBusinessDetail(idxOrMode = 0) {
  const mode = (idxOrMode === 1 || idxOrMode === 'person') ? 'person' : 'company';
  renderBusinessDualDetail(mode);
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
