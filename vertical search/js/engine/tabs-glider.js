/**
 * Dual Vertical Tabs Bar Controller with Physics Glider Capsule & Inverted Mask
 */
import { state } from '../state.js';
import { getCurrentData, setVerticalKey } from '../data/verticals-data.js';
import { updateTopNewsCard, renderTimelineStream } from '../render/stage-renderer.js';
import { playSellingPointsNumberFlow, clearTokenMeterTimers } from '../animations/widgets.js';
import { runCycle } from './stage-controller.js';
import { syncSubjectPills } from './step-controls.js';

export function updateTabsIndicator(activeTab, key, animate = true) {
  const indicator = document.getElementById('tabsIndicator');
  const indicatorTrack = document.getElementById('tabsIndicatorTrack');
  const tabsBar = document.querySelector('.vertical-tabs-bar');
  if (!indicator || !tabsBar || !activeTab) return;

  let left = activeTab.offsetLeft;
  let top = activeTab.offsetTop;
  let width = activeTab.offsetWidth;
  let height = activeTab.offsetHeight;

  if (!width || !height) {
    const barRect = tabsBar.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    left = tabRect.left - barRect.left;
    top = tabRect.top - barRect.top;
    width = tabRect.width;
    height = tabRect.height;
  }

  const easeCurve = 'cubic-bezier(0.16, 1, 0.3, 1)';
  if (!animate) {
    indicator.style.transition = 'none';
    if (indicatorTrack) indicatorTrack.style.transition = 'none';
  } else {
    indicator.style.transition = `transform 0.38s ${easeCurve}, width 0.38s ${easeCurve}, height 0.38s ${easeCurve}, background-color 0.38s ${easeCurve}`;
    if (indicatorTrack) indicatorTrack.style.transition = `transform 0.38s ${easeCurve}`;
  }

  indicator.style.transform = `translate3d(${left}px, ${top}px, 0)`;
  indicator.style.width = `${width}px`;
  indicator.style.height = `${height}px`;

  if (indicatorTrack) {
    indicatorTrack.style.transform = `translate3d(${4 - left}px, ${4 - top}px, 0)`;
    const clones = indicatorTrack.querySelectorAll('.tab-clone');
    clones.forEach(c => {
      c.classList.toggle('active', c.dataset.vertical === key);
    });
  }

  if (key === 'news') {
    indicator.style.backgroundColor = '#8adb47';
  } else if (key === 'business') {
    indicator.style.backgroundColor = '#FBBF24';
  } else if (key === 'academic') {
    indicator.style.backgroundColor = '#38BDF8';
  }
}

export function switchVertical(key, force = false) {
  if (!force && state.currentVerticalKey === key) return;
  state.currentVerticalKey = key;
  setVerticalKey(key);
  const curData = getCurrentData(key);

  const demoWrapper = document.getElementById('demoWrapper') || document.querySelector('.demo-wrapper');
  if (demoWrapper) {
    demoWrapper.setAttribute('data-theme', key);
  }

  const tabNews = document.getElementById('tabNews');
  const tabBusiness = document.getElementById('tabBusiness');
  if (tabNews) {
    tabNews.classList.toggle('active', key === 'news');
    tabNews.setAttribute('aria-selected', key === 'news' ? 'true' : 'false');
  }
  if (tabBusiness) {
    tabBusiness.classList.toggle('active', key === 'business');
    tabBusiness.setAttribute('aria-selected', key === 'business' ? 'true' : 'false');
  }
  const activeTab = key === 'news' ? tabNews : tabBusiness;
  updateTabsIndicator(activeTab, key, true);

  const heroHeading = document.getElementById('verticalSearchHeading');
  const heroDesc = document.getElementById('verticalSearchDesc');
  if (heroHeading && curData.heading) heroHeading.textContent = curData.heading;
  if (heroDesc && curData.desc) heroDesc.textContent = curData.desc;

  const cardCanvas = document.getElementById('newsSearchCard') || document.getElementById('heroCanvas');
  if (cardCanvas) {
    cardCanvas.setAttribute('data-theme', curData.theme);
  }

  const canvasWatermark = document.getElementById('canvasWatermark');
  if (canvasWatermark && curData.watermarkSvg) {
    canvasWatermark.innerHTML = curData.watermarkSvg;
    canvasWatermark.classList.remove('watermark-pop');
    void canvasWatermark.offsetWidth;
    canvasWatermark.classList.add('watermark-pop');
  }

  const canvasHeadingTitle = document.getElementById('canvasHeadingTitle');
  const canvasHeadingIcon = document.getElementById('canvasHeadingIcon');
  if (canvasHeadingTitle) canvasHeadingTitle.textContent = curData.title;
  if (canvasHeadingIcon && curData.iconSvg) {
    canvasHeadingIcon.innerHTML = curData.iconSvg;
  }

  const summaryDesc = document.getElementById('summaryDesc');
  const summaryBulletsList = document.getElementById('summaryBulletsList');
  if (summaryDesc && curData.summaryDesc) {
    summaryDesc.textContent = curData.summaryDesc;
  }
  if (summaryBulletsList && curData.bullets) {
    summaryBulletsList.innerHTML = curData.bullets.map(b => `<li>${b}</li>`).join('');
  }

  if (key === 'news') {
    playSellingPointsNumberFlow();
  } else {
    clearTokenMeterTimers();
  }

  const btnStep4 = document.querySelector('.step-btn[data-step="focus"]');
  const btnStep5 = document.querySelector('.step-btn[data-step="timeline"]');
  if (btnStep4) btnStep4.textContent = key === 'business' ? '4. Company Detail' : '4. Top Focus';
  if (btnStep5) btnStep5.textContent = key === 'business' ? '5. Person Detail' : '5. Timeline';

  syncSubjectPills(key);

  updateTopNewsCard(0);
  renderTimelineStream(0, false);

  state.isAutoLooping = true;
  const togglePlayBtn = document.getElementById('togglePlayBtn');
  const replayBtn = document.getElementById('replayBtn');
  if (togglePlayBtn) togglePlayBtn.textContent = '⏸ Pause';
  if (replayBtn) replayBtn.classList.remove('visible');
  runCycle('typing');
}

export function getActiveTabButton() {
  const tabNews = document.getElementById('tabNews');
  const tabBusiness = document.getElementById('tabBusiness');
  return state.currentVerticalKey === 'business' ? tabBusiness : tabNews;
}

export function syncTabsIndicator(animate = false) {
  const targetTab = getActiveTabButton();
  if (targetTab) {
    updateTabsIndicator(targetTab, state.currentVerticalKey, animate);
  }
}
