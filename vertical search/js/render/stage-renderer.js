import { state } from '../state.js';
import { getCurrentData, formatDateTime, formatTimeOnly, formatDate, extractDomain, imageCache } from '../data/verticals-data.js';

let currentSelectedSubjectIdx = 0;

export function getSelectedSubjectIdx() {
  return currentSelectedSubjectIdx;
}

export function setSelectedSubjectIdx(idx) {
  currentSelectedSubjectIdx = idx;
}

export function updateTopNewsCard(subjectIdx = 0) {
  const curData = getCurrentData();
  const subj = curData.subjects[subjectIdx];
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
      // Instant synchronous swap with 140ms smooth dissolve
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
  const subject = curData.subjects[subjectIdx] || curData.subjects[0];
  // Ensure chronological order: earlier timestamps on top, later timestamps at the bottom
  const articles = (subject.articles || []).slice().sort((a, b) => new Date(a.timePublished) - new Date(b.timePublished));

  // Stem height connects Dot 0 (center 30px) to Dot (N - 1) (center 30 + (N - 1) * 68px)
  const stemHeight = articles.length > 1 ? (articles.length - 1) * 68 : 0;
  let spineHTML = `<div class="timeline-spine-stem" id="timelineSpineStem" style="height: ${stemHeight}px; transform: scaleY(${makeVisible ? 1 : 0});"></div>`;

  articles.forEach((art, i) => {
    const dotTop = i * 68 + 24; // Center at i * 68 + 30px (12px node with 2px white border)
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

export function handlePillClick(idx) {
  const cardCanvas = document.getElementById('newsSearchCard') || document.getElementById('heroCanvas');
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
    const idx = parseInt(pill.dataset.subjectIdx, 10);
    handlePillClick(idx);
  });
}

export function syncSubjectPills(key = state.currentVerticalKey, onPillClick = null) {
  const subjectsHBar = document.getElementById('subjectsHBar');
  if (!subjectsHBar) return;
  initSubjectsHBar();
  const curData = getCurrentData(key);
  const subjects = curData.subjects || [];

  let html = '';
  subjects.forEach((subj, idx) => {
    html += `<div class="subject-h-pill ${idx === 0 ? 'active' : ''}" data-subject-idx="${idx}">Subject${idx + 1}</div>`;
  });
  subjectsHBar.innerHTML = html;

  if (typeof onPillClick === 'function') {
    const pills = subjectsHBar.querySelectorAll('.subject-h-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const idx = parseInt(pill.dataset.subjectIdx, 10);
        onPillClick(idx);
      });
    });
  }
}
