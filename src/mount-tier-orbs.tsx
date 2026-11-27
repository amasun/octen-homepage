import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ThinkingOrb } from 'thinking-orbs';

// 三大档位卡片右上角的 Orb:每档一个状态,表示该档能力;只露出 1/4,hover 卡片时播放,平时静止
const STATES: Record<string, any> = { pulse: 'connecting', fast: 'solving', premier: 'composing' };

function CardOrb({ card, state }: { card: HTMLElement; state: any }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const on = () => setPlay(true), off = () => setPlay(false);
    card.addEventListener('mouseenter', on); card.addEventListener('mouseleave', off);
    card.addEventListener('focus', on); card.addEventListener('blur', off);
    return () => { card.removeEventListener('mouseenter', on); card.removeEventListener('mouseleave', off); card.removeEventListener('focus', on); card.removeEventListener('blur', off); };
  }, [card]);
  return <ThinkingOrb state={state} size={64} theme="dark" paused={reduce || !play} />;
}

function mount() {
  document.querySelectorAll<HTMLElement>('.st-tier-orb[data-orb]').forEach((el) => {
    if (el.dataset.mounted === 'true') return;
    el.dataset.mounted = 'true';
    const state = STATES[el.dataset.orb || ''];
    const card = el.closest<HTMLElement>('.st-tier-card');
    if (!state || !card) return;
    ReactDOM.createRoot(el).render(<CardOrb card={card} state={state} />);
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
