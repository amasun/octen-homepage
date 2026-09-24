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

  if (!canvasRightPanel || !cardListContainer || !morphCardsOverlay) return;

  const panelRect = canvasRightPanel.getBoundingClientRect();
  const subjectWrappers = cardListContainer.querySelectorAll('.subject-card-wrapper');
  const targetPills = subjectsHBar ? subjectsHBar.querySelectorAll('.subject-h-pill') : [];

  if (!subjectWrappers.length || !targetPills.length) {
    return;
  }

  // 1. Position target tabs to get destination bounds
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
    eventsWhiteCard.style.transform = 'translateY(36px) scale(0.97)';
  }

  // Measure target tab pill positions
  const targetRects = Array.from(targetPills).map(pill => {
    const r = pill.getBoundingClientRect();
    return {
      left: Math.round(r.left - panelRect.left),
      top: Math.round(r.top - panelRect.top),
      width: Math.round(r.width),
      height: Math.round(r.height),
      text: pill.textContent.trim()
    };
  });

  // 2. Measure starting positions of the 4 big subject card boxes
  const sourceCards = Array.from(subjectWrappers).slice(0, 4);
  const startData = sourceCards.map((wrapper, idx) => {
    const cardBox = wrapper.querySelector('.subject-card-box') || wrapper;
    const r = cardBox.getBoundingClientRect();
    const dateEl = wrapper.querySelector('.subject-date-range');
    const titleEl = wrapper.querySelector('.subject-name');
    const summaryEl = wrapper.querySelector('.subject-summary');
    return {
      left: Math.round(r.left - panelRect.left),
      top: Math.round(r.top - panelRect.top),
      width: Math.round(r.width) || 520,
      height: Math.round(r.height) || 96,
      date: dateEl ? dateEl.textContent : '2026/09/12 – 2026/09/15',
      title: titleEl ? titleEl.textContent : `Subject ${idx + 1}`,
      summary: summaryEl ? summaryEl.textContent : '',
      cardEl: cardBox
    };
  });

  while (startData.length < 4) {
    const idx = startData.length;
    startData.push({
      left: targetRects[idx] ? targetRects[idx].left : 56,
      top: targetRects[idx] ? targetRects[idx].top + 80 : 120,
      width: 520,
      height: 96,
      date: '2026/09/12 – 2026/09/15',
      title: `Subject ${idx + 1}`,
      summary: '',
      cardEl: null
    });
  }

  // 3. Construct 4 Morphing Proxy Cards inside overlay
  morphCardsOverlay.innerHTML = '';
  const morphEntities = [];

  for (let i = 0; i < 4; i++) {
    const s = startData[i];
    const t = targetRects[i] || targetRects[targetRects.length - 1];
    const pillText = t.text || `Subject${i + 1}`;

    const card = document.createElement('div');
    card.className = 'morph-proxy-card';
    card.style.cssText = `
      position: absolute;
      left: ${s.left}px;
      top: ${s.top}px;
      width: ${s.width}px;
      height: ${s.height}px;
      background-color: #FFFFFF;
      border: 8px solid rgba(255, 255, 255, 0.35);
      border-radius: 24px;
      box-shadow: 0 8px 24px rgba(31, 72, 28, 0.08);
      box-sizing: border-box;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    card.innerHTML = `
      <div class="morph-proxy-inner">
        <div class="morph-proxy-card-view">
          <div class="morph-proxy-top-row">
            <span class="morph-proxy-date">${s.date}</span>
            <span class="morph-proxy-badge">Subject${i + 1}</span>
          </div>
          <div class="morph-proxy-title">${s.title}</div>
          <div class="morph-proxy-summary">${s.summary}</div>
        </div>
        <div class="morph-proxy-pill-tag">${pillText}</div>
      </div>
    `;
    morphCardsOverlay.appendChild(card);

    morphEntities.push({
      card,
      cardView: card.querySelector('.morph-proxy-card-view'),
      pillTag: card.querySelector('.morph-proxy-pill-tag'),
      s,
      t,
      index: i
    });
  }

  // 4. Hide original cards in Stage 3 scroller
  sourceCards.forEach(wrap => {
    const box = wrap.querySelector('.subject-card-box') || wrap;
    box.style.visibility = 'hidden';
  });

  // 5. Metamorphic Animation Execution
  const morphDuration = 600;
  const morphEase = 'cubic-bezier(0.2, 0.9, 0.28, 1)';

  morphEntities.forEach(({ card, cardView, pillTag, s, t, index }) => {
    // Content collapse
    if (cardView) {
      const viewAnim = cardView.animate([
        { offset: 0, opacity: 1, transform: 'scale(1)' },
        { offset: 0.28, opacity: 1, transform: 'scale(0.98)' },
        { offset: 0.48, opacity: 0, transform: 'scale(0.90) translateY(-4px)' },
        { offset: 1, opacity: 0, transform: 'scale(0.90) translateY(-4px)' }
      ], {
        duration: morphDuration,
        delay: index * 20,
        easing: 'ease-out',
        fill: 'forwards'
      });
      state.activeAnimations.push(viewAnim);
    }

    // Pill label tag
    if (pillTag) {
      const tagAnim = pillTag.animate([
        { offset: 0, opacity: 0, transform: 'scale(0.85)' },
        { offset: 0.35, opacity: 0, transform: 'scale(0.85)' },
        { offset: 0.70, opacity: 1, transform: 'scale(1)' },
        { offset: 1, opacity: 1, transform: 'scale(1)' }
      ], {
        duration: morphDuration,
        delay: index * 20,
        easing: 'cubic-bezier(0.2, 0.9, 0.28, 1)',
        fill: 'forwards'
      });
      state.activeAnimations.push(tagAnim);
    }

    // Card Frame Metamorphosis from Big White Card to Pill
    const dx = t.left - s.left;
    const dy = t.top - s.top;
    const targetBg = index === 0 ? '#039855' : 'rgba(76, 94, 86, 0.57)';

    const cardAnim = card.animate([
      {
        offset: 0,
        transform: 'translate(0, 0)',
        width: `${s.width}px`,
        height: `${s.height}px`,
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(255, 255, 255, 0.35)',
        borderWidth: '8px',
        borderRadius: '24px',
        boxShadow: '0 8px 24px rgba(31, 72, 28, 0.08)'
      },
      {
        offset: 0.32,
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(255, 255, 255, 0.35)',
        borderWidth: '6px',
        borderRadius: '20px',
        boxShadow: '0 6px 18px rgba(31, 72, 28, 0.06)'
      },
      {
        offset: 0.72,
        backgroundColor: targetBg,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: '1px',
        borderRadius: '16px',
        boxShadow: 'none'
      },
      {
        offset: 1,
        transform: `translate(${dx}px, ${dy}px)`,
        width: `${t.width}px`,
        height: `${t.height}px`,
        backgroundColor: targetBg,
        borderColor: 'transparent',
        borderWidth: '0px',
        borderRadius: '16px',
        boxShadow: 'none'
      }
    ], {
      duration: morphDuration,
      delay: index * 20,
      easing: morphEase,
      fill: 'forwards'
    });
    state.activeAnimations.push(cardAnim);
  });

  // 6. Top News white card slides up
  if (eventsWhiteCard) {
    const cardAppearAnim = eventsWhiteCard.animate([
      { opacity: 0, transform: 'translateY(36px) scale(0.97)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' }
    ], {
      duration: 480,
      delay: 190,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'forwards'
    });
    state.activeAnimations.push(cardAppearAnim);
  }

  await sleep(morphDuration + 4 * 20 + 20);
  if (isValid && !isValid()) {
    morphCardsOverlay.innerHTML = '';
    return;
  }

  // 7. Flawless zero-flicker handover to native Stage 4 layout
  if (subjectsHBar) subjectsHBar.style.opacity = '1';
  if (eventsWhiteCard) {
    eventsWhiteCard.style.opacity = '1';
    eventsWhiteCard.style.transform = 'none';
  }
  void (subjectsHBar ? subjectsHBar.offsetWidth : 0);
  morphCardsOverlay.innerHTML = '';

  sourceCards.forEach(wrap => {
    const box = wrap.querySelector('.subject-card-box') || wrap;
    box.style.visibility = '';
  });
}
