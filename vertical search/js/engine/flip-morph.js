/**
 * FLIP Geometric Metamorphosis System:
 * Smoothly morphs 4 large Stage 3 subject cards into 4 horizontal pill tabs + white top news card
 */
import { state } from '../state.js';
import { sleep } from '../animations/motion.js';

export async function transitionOverviewToFocus(isValid, currentSeq) {
  const canvasRightPanel = document.getElementById('canvasRightPanel');
  const cardListContainer = document.getElementById('cardListContainer');
  const morphCardsOverlay = document.getElementById('morphCardsOverlay') || document.getElementById('flyingTagsOverlay');
  const subjectsHBar = document.getElementById('subjectsHBar');
  const eventsWhiteCard = document.getElementById('eventsWhiteCard');
  const stageFocusContainer = document.getElementById('stageFocusContainer');

  const panelRect = canvasRightPanel.getBoundingClientRect();
  const subjectWrappers = cardListContainer.querySelectorAll('.subject-card-wrapper');
  const targetPills = subjectsHBar ? subjectsHBar.querySelectorAll('.subject-h-pill') : [];

  if (!subjectWrappers.length || !targetPills.length || !morphCardsOverlay) {
    return;
  }

  // Clear any existing clones
  morphCardsOverlay.innerHTML = '';

  // 1. Measure First Positions
  const firsts = [];
  subjectWrappers.forEach((wrap, i) => {
    const box = wrap.querySelector('.subject-card-box') || wrap;
    const r = box.getBoundingClientRect();
    const badge = wrap.querySelector('.subject-badge');
    const badgeR = badge ? badge.getBoundingClientRect() : null;

    firsts.push({
      left: r.left - panelRect.left,
      top: r.top - panelRect.top,
      width: r.width,
      height: r.height,
      badgeLeft: badgeR ? badgeR.left - panelRect.left : 0,
      badgeTop: badgeR ? badgeR.top - panelRect.top : 0,
      badgeWidth: badgeR ? badgeR.width : 70,
      badgeHeight: badgeR ? badgeR.height : 26,
    });
  });

  // 2. Prepare Last state
  if (stageFocusContainer) {
    stageFocusContainer.style.removeProperty('display');
    stageFocusContainer.style.display = '';
    stageFocusContainer.style.opacity = '1';
    stageFocusContainer.style.pointerEvents = 'auto';
  }
  if (subjectsHBar) {
    subjectsHBar.style.removeProperty('display');
    subjectsHBar.style.display = '';
    subjectsHBar.style.opacity = '0';
  }
  if (eventsWhiteCard) {
    eventsWhiteCard.style.opacity = '0';
    eventsWhiteCard.style.transform = 'translateY(16px)';
  }

  // Measure target pill positions
  const lasts = [];
  targetPills.forEach((pill) => {
    const r = pill.getBoundingClientRect();
    lasts.push({
      left: r.left - panelRect.left,
      top: r.top - panelRect.top,
      width: r.width,
      height: r.height,
    });
  });

  // Hide original cards in list container
  subjectWrappers.forEach((wrap) => {
    const box = wrap.querySelector('.subject-card-box') || wrap;
    box.style.visibility = 'hidden';
  });

  // 3. Create Morphing Clones
  const clones = [];
  firsts.forEach((f, i) => {
    const l = lasts[i] || lasts[lasts.length - 1];
    const clone = document.createElement('div');
    clone.className = 'morph-card-clone' + (i === 0 ? ' is-active-pill' : '');
    clone.style.left = `${f.left}px`;
    clone.style.top = `${f.top}px`;
    clone.style.width = `${f.width}px`;
    clone.style.height = `${f.height}px`;

    const targetPillText = targetPills[i] ? targetPills[i].textContent.trim() : `Subject${i + 1}`;
    clone.innerHTML = `
      <div class="morph-clone-badge" style="
        position: absolute;
        left: ${f.badgeLeft - f.left}px;
        top: ${f.badgeTop - f.top}px;
        width: ${f.badgeWidth}px;
        height: ${f.badgeHeight}px;
      ">${targetPillText}</div>
    `;

    morphCardsOverlay.appendChild(clone);
    clones.push({ el: clone, first: f, last: l });
  });

  // 4. Animate Clones Flying & Morphing into Pills
  const duration = 650;
  const morphEase = 'cubic-bezier(0.2, 0.9, 0.28, 1)';

  clones.forEach((item, i) => {
    const { el, first, last } = item;
    const badge = el.querySelector('.morph-clone-badge');

    const cardAnim = el.animate([
      {
        transform: 'translate(0, 0)',
        width: `${first.width}px`,
        height: `${first.height}px`,
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        padding: '16px'
      },
      {
        offset: 0.25,
        borderRadius: '20px',
        padding: '6px'
      },
      {
        transform: `translate(${last.left - first.left}px, ${last.top - first.top}px)`,
        width: `${last.width}px`,
        height: `${last.height}px`,
        borderRadius: '20px',
        backgroundColor: i === 0 ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
        borderColor: i === 0 ? '#ffffff' : 'rgba(255, 255, 255, 0.12)',
        padding: '0px'
      }
    ], {
      duration,
      delay: i * 28,
      easing: morphEase,
      fill: 'forwards'
    });
    state.activeAnimations.push(cardAnim);

    if (badge) {
      const badgeAnim = badge.animate([
        {
          transform: 'translate(0, 0)',
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: '500',
          fontSize: '13px'
        },
        {
          transform: `translate(${(last.width - first.badgeWidth) / 2 - (first.badgeLeft - first.left)}px, ${(last.height - first.badgeHeight) / 2 - (first.badgeTop - first.top)}px)`,
          color: i === 0 ? '#0B1F0E' : 'rgba(255, 255, 255, 0.7)',
          fontWeight: i === 0 ? '600' : '500',
          fontSize: '13px'
        }
      ], {
        duration,
        delay: i * 28,
        easing: morphEase,
        fill: 'forwards'
      });
      state.activeAnimations.push(badgeAnim);
    }
  });

  // Fade and rise in White Events Card underneath
  if (eventsWhiteCard) {
    const cardAppearAnim = eventsWhiteCard.animate([
      { opacity: 0, transform: 'translateY(24px)' },
      { opacity: 1, transform: 'translateY(0px)' }
    ], {
      duration: 520,
      delay: 240,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'forwards'
    });
    state.activeAnimations.push(cardAppearAnim);
  }

  await sleep(duration + 140);
  if (!isValid()) {
    morphCardsOverlay.innerHTML = '';
    return;
  }

  // 5. Metamorphosis Complete: Hand off back to real DOM
  if (subjectsHBar) subjectsHBar.style.opacity = '1';
  if (eventsWhiteCard) {
    eventsWhiteCard.style.opacity = '1';
    eventsWhiteCard.style.transform = 'none';
  }
  morphCardsOverlay.innerHTML = '';

  subjectWrappers.forEach((wrap) => {
    const box = wrap.querySelector('.subject-card-box') || wrap;
    box.style.visibility = '';
  });
}
