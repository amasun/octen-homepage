/**
 * Business Search: Progressive Flow Unfolding & Dynamic Auto-Scroll Animations
 * Aligned with User Flow Specification:
 * 1. Step 3 (Company Detail): Content flows from top to bottom; auto-scrolls down if content overflows.
 * 2. Transition to Step 4 (Person Detail): After company finishes, automatically transitions to person card generation with identical flow & auto-scroll logic.
 * 3. Transition to Step 5 (Overview): Automatically settles into dual compact overview cards.
 */
import { state } from '../state.js';
import { sleep, smoothScrollTo } from './motion.js';

/**
 * Play progressive flow animation on Company Card (Stage 3)
 */
export async function playCompanyFlowAnimation(isValid = () => true) {
  const card0 = document.querySelector('.business-card-wrapper[data-entity-idx="0"]');
  if (!card0) return;
  const scrollArea = card0.querySelector('.biz-overview-scroll-area');
  if (!scrollArea) return;

  // 1. Reset scroll position to top and lock user interaction during flow
  scrollArea.scrollTop = 0;
  scrollArea.style.overflowY = 'hidden';

  const fullSec = card0.querySelector('.biz-overview-full-sections');
  if (!fullSec) return;

  const groups = Array.from(fullSec.querySelectorAll('.biz-figma-sec-group'));
  if (groups.length === 0) return;

  // Build flow units list
  const flowUnits = [];

  // Unit 0: Key People group (title + pills)
  if (groups[0]) flowUnits.push({ element: groups[0], hasDot: false });

  // Units for Official Activities (group 1)
  if (groups[1]) {
    const title = groups[1].querySelector('.biz-figma-sec-title');
    if (title) title.style.opacity = '1';
    const rows = Array.from(groups[1].querySelectorAll('.biz-figma-timeline-row'));
    rows.forEach(r => flowUnits.push({ element: r, hasDot: true }));
  }

  // Units for Media News (group 2)
  if (groups[2]) {
    const title = groups[2].querySelector('.biz-figma-sec-title');
    if (title) title.style.opacity = '1';
    const rows = Array.from(groups[2].querySelectorAll('.biz-figma-timeline-row'));
    rows.forEach(r => flowUnits.push({ element: r, hasDot: true }));
  }

  // Initially hide all units with subtle downward translation
  flowUnits.forEach(u => {
    u.element.style.opacity = '0';
    u.element.style.transform = 'translateY(12px)';
  });

  // Short pause before starting stream
  await sleep(150);
  if (!isValid()) return;

  // 2. Stream units sequentially from top to bottom
  for (const u of flowUnits) {
    if (!isValid()) return;

    u.element.style.transition = 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
    u.element.style.opacity = '1';
    u.element.style.transform = 'translateY(0)';

    if (u.hasDot) {
      const dot = u.element.querySelector('.biz-figma-timeline-dot');
      if (dot) dot.style.animation = 'bizNodePulse 0.4s ease forwards';
    }

    await sleep(90);
    if (!isValid()) return;

    // 3. Dynamic Auto-Scroll: check if item bottom is nearing or exceeding container bottom
    const sRect = scrollArea.getBoundingClientRect();
    const uRect = u.element.getBoundingClientRect();
    const bottomThreshold = sRect.bottom - 20;
    const delta = uRect.bottom - bottomThreshold;

    if (delta > 0) {
      const maxScroll = Math.max(0, scrollArea.scrollHeight - scrollArea.clientHeight);
      const targetScroll = Math.min(maxScroll, scrollArea.scrollTop + delta);
      if (targetScroll > scrollArea.scrollTop) {
        await smoothScrollTo(scrollArea, targetScroll, 340, isValid);
        if (!isValid()) return;
        await sleep(120);
      } else {
        await sleep(220);
      }
    } else {
      await sleep(220);
    }
  }

  // Unlock manual scroll when flow finishes
  scrollArea.style.overflowY = 'auto';

  // Clear inline animation and transform styles so overview hover can cleanly take over
  flowUnits.forEach(u => {
    u.element.style.opacity = '';
    u.element.style.transform = '';
    u.element.style.transition = '';
    if (u.hasDot) {
      const dot = u.element.querySelector('.biz-figma-timeline-dot');
      if (dot) dot.style.animation = '';
    }
  });
}

/**
 * Play progressive flow animation on Person Card (Stage 4)
 */
export async function playPersonFlowAnimation(isValid = () => true) {
  const card1 = document.querySelector('.business-card-wrapper[data-entity-idx="1"]');
  if (!card1) return;
  const scrollArea = card1.querySelector('.biz-overview-scroll-area');
  if (!scrollArea) return;

  // 1. Reset scroll position to top and lock user interaction during flow
  scrollArea.scrollTop = 0;
  scrollArea.style.overflowY = 'hidden';

  const fullSec = card1.querySelector('.biz-overview-full-sections');
  if (!fullSec) return;

  const groups = Array.from(fullSec.querySelectorAll('.biz-figma-sec-group'));
  if (groups.length === 0) return;

  // Build flow units list
  const flowUnits = [];

  // Career Section (Group 0)
  if (groups[0]) {
    const title = groups[0].querySelector('.biz-figma-sec-title');
    if (title) title.style.opacity = '1';
    const careerRows = Array.from(groups[0].querySelectorAll('.biz-figma-career-row'));
    careerRows.forEach(r => flowUnits.push({ element: r, hasDot: true }));
  }

  // Activities Section (Group 1)
  if (groups[1]) {
    const title = groups[1].querySelector('.biz-figma-sec-title');
    if (title) title.style.opacity = '1';
    const actRows = Array.from(groups[1].querySelectorAll('.biz-figma-timeline-row'));
    actRows.forEach(r => flowUnits.push({ element: r, hasDot: true }));
  }

  // News Section (Group 2)
  if (groups[2]) {
    const title = groups[2].querySelector('.biz-figma-sec-title');
    if (title) title.style.opacity = '1';
    const newsRows = Array.from(groups[2].querySelectorAll('.biz-figma-timeline-row'));
    newsRows.forEach(r => flowUnits.push({ element: r, hasDot: true }));
  }

  // Initially hide all units with subtle downward translation
  flowUnits.forEach(u => {
    u.element.style.opacity = '0';
    u.element.style.transform = 'translateY(12px)';
  });

  // Short pause before starting stream
  await sleep(150);
  if (!isValid()) return;

  // 2. Stream units sequentially from top to bottom
  for (const u of flowUnits) {
    if (!isValid()) return;

    u.element.style.transition = 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
    u.element.style.opacity = '1';
    u.element.style.transform = 'translateY(0)';

    if (u.hasDot) {
      const dot = u.element.querySelector('.biz-figma-timeline-dot');
      if (dot) dot.style.animation = 'bizNodePulse 0.4s ease forwards';
    }

    await sleep(90);
    if (!isValid()) return;

    // 3. Dynamic Auto-Scroll: check if item bottom is nearing or exceeding container bottom
    const sRect = scrollArea.getBoundingClientRect();
    const uRect = u.element.getBoundingClientRect();
    const bottomThreshold = sRect.bottom - 20;
    const delta = uRect.bottom - bottomThreshold;

    if (delta > 0) {
      const maxScroll = Math.max(0, scrollArea.scrollHeight - scrollArea.clientHeight);
      const targetScroll = Math.min(maxScroll, scrollArea.scrollTop + delta);
      if (targetScroll > scrollArea.scrollTop) {
        await smoothScrollTo(scrollArea, targetScroll, 340, isValid);
        if (!isValid()) return;
        await sleep(120);
      } else {
        await sleep(220);
      }
    } else {
      await sleep(220);
    }
  }

  // Unlock manual scroll when flow finishes
  scrollArea.style.overflowY = 'auto';

  // Clear inline animation and transform styles so overview hover can cleanly take over
  flowUnits.forEach(u => {
    u.element.style.opacity = '';
    u.element.style.transform = '';
    u.element.style.transition = '';
    if (u.hasDot) {
      const dot = u.element.querySelector('.biz-figma-timeline-dot');
      if (dot) dot.style.animation = '';
    }
  });
}
