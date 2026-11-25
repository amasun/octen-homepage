import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * 三大 Search 总览卡片里的指标动画(10 ms / 62 ms / High precision):
 *  - 数字:<number-flow> 滚轮(与页面其它 NumberFlow 一致:continuous 插件 + spring 缓动),初始 0,滚动到卡片时由 ScrollTrigger 触发一次
 *  - "High":NumberFlow 只处理数字,这里用同样的「纵向滚轮」做逐字母滚动(每个字母一条竖向字母带,expo.out 落定)
 * prefers-reduced-motion:直接显示最终值,不动画。
 */

const FLOW_SELECTOR = '.st-tier-flow';
const TEXT_SELECTOR = '.st-tier-textflow';
const TRIGGER_SELECTOR = '.st-scale-cols';

type FlowEl = HTMLElement & {
  update?: (v: number) => void;
  animated?: boolean;
  trend?: number;
  plugins?: unknown[];
  spinTiming?: unknown;
  transformTiming?: unknown;
  opacityTiming?: unknown;
};

function whenNumberFlowReady(): Promise<void> {
  const defined = customElements.get('number-flow')
    ? Promise.resolve()
    : customElements.whenDefined('number-flow').then(() => undefined);
  const w = window as unknown as { NumberFlowContinuous?: unknown };
  const plugin = w.NumberFlowContinuous
    ? Promise.resolve()
    : new Promise<void>((resolve) => window.addEventListener('numberflow-ready', () => resolve(), { once: true }));
  return Promise.all([defined, plugin]).then(() => undefined);
}

/** 把 "High" 拆成逐字母的竖向字母带,返回每条字母带(用于后续滚动) */
function buildTextFlow(el: HTMLElement): HTMLElement[] {
  const text = el.dataset.text ?? el.textContent ?? '';
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const strips: HTMLElement[] = [];
  Array.from(text).forEach((ch, i) => {
    const slot = document.createElement('span');
    slot.className = 'st-tf-slot';
    slot.setAttribute('aria-hidden', 'true');
    const strip = document.createElement('span');
    strip.className = 'st-tf-strip';
    const isUpper = ch === ch.toUpperCase() && ch !== ch.toLowerCase();
    const pool = isUpper ? 'ABCDEFGHJKLMNPRSTUVW' : 'abcdefghklmnoprstuvwy';
    const count = 6 + i;                       // 越靠后的字母滚得越久(错峰落定)
    const chars: string[] = [];
    for (let k = 0; k < count; k++) chars.push(pool[Math.floor(Math.random() * pool.length)]);
    chars.push(ch);
    chars.forEach((c) => {
      const cell = document.createElement('span');
      cell.className = 'st-tf-cell';
      cell.textContent = c;
      strip.append(cell);
    });
    strip.dataset.cells = String(chars.length);
    slot.append(strip);
    el.append(slot);
    strips.push(strip);
  });
  // 槽位宽度 = 目标字母自身宽度(而不是字母带里最宽的随机字母),否则字母间距会被撑开;字体加载完再量一次
  const fit = () => {
    strips.forEach((strip) => {
      const last = strip.lastElementChild as HTMLElement | null;
      const slot = strip.parentElement as HTMLElement | null;
      if (last && slot) slot.style.width = `${last.getBoundingClientRect().width}px`;
    });
  };
  fit();
  document.fonts?.ready.then(fit);
  return strips;
}

export function initTierMetrics(animate: boolean): void {
  const flows = Array.from(document.querySelectorAll<FlowEl>(FLOW_SELECTOR));
  const texts = Array.from(document.querySelectorAll<HTMLElement>(TEXT_SELECTOR));
  const trigger = document.querySelector<HTMLElement>(TRIGGER_SELECTOR);
  if (!flows.length && !texts.length) return;

  // 数字
  whenNumberFlowReady().then(() => {
    const w = window as unknown as { NumberFlowContinuous?: unknown };
    flows.forEach((el) => {
      const target = parseFloat(el.dataset.value ?? '');
      if (Number.isNaN(target) || typeof el.update !== 'function') return;
      if (!animate) {
        el.animated = false;
        el.update(target);
        return;
      }
      el.plugins = w.NumberFlowContinuous ? [w.NumberFlowContinuous] : [];
      el.trend = 1;
      el.spinTiming = { duration: 1300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };
      el.transformTiming = { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };
      el.opacityTiming = { duration: 350, easing: 'ease-out' };
      el.animated = false;
      el.update(parseFloat(el.dataset.start ?? '0') || 0);
    });

    if (!animate) return;
    ScrollTrigger.create({
      trigger: trigger ?? flows[0],
      start: 'top 40%',
      once: true,
      onEnter: () => {
        flows.forEach((el, i) => {
          const target = parseFloat(el.dataset.value ?? '');
          if (Number.isNaN(target) || typeof el.update !== 'function') return;
          window.setTimeout(() => {
            el.animated = true;
            el.update?.(target);
          }, 120 + i * 140);
        });
      },
    });
  });

  // "High" 文字滚轮
  if (!animate) return;
  const groups = texts.map((el) => ({ el, strips: buildTextFlow(el) }));
  ScrollTrigger.create({
    trigger: trigger ?? texts[0],
    start: 'top 40%',
    once: true,
    onEnter: () => {
      groups.forEach(({ strips }) => {
        strips.forEach((strip, i) => {
          const n = Number(strip.dataset.cells) || 2;
          gsap.fromTo(
            strip,
            { yPercent: 0 },
            { yPercent: -(100 * (n - 1)) / n, duration: 1.15 + i * 0.12, delay: 0.38 + i * 0.07, ease: 'expo.out' },
          );
        });
      });
    },
  });
}

/**
 * Built to Perform 指标区(Top 3 / 62ms / <5min / #1)的数字:<number-flow class="bpt-flow">,
 * 初始 0,滚动到指标区时由 ScrollTrigger 触发一次(与上方 Search 总览同一套滚轮 + spring 缓动)。
 * prefers-reduced-motion 或 animate=false:直接显示最终值。
 */
export function initBptMetrics(animate: boolean): void {
  const flows = Array.from(document.querySelectorAll<FlowEl>('.bpt-flow'));
  if (!flows.length) return;
  const trigger = document.querySelector<HTMLElement>('.bpt-stats') ?? flows[0];

  whenNumberFlowReady().then(() => {
    const w = window as unknown as { NumberFlowContinuous?: unknown };
    flows.forEach((el) => {
      const target = parseFloat(el.dataset.value ?? '');
      if (Number.isNaN(target) || typeof el.update !== 'function') return;
      if (!animate) {
        el.animated = false;
        el.update(target);
        return;
      }
      el.plugins = w.NumberFlowContinuous ? [w.NumberFlowContinuous] : [];
      el.trend = 1;
      el.spinTiming = { duration: 1300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };
      el.transformTiming = { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };
      el.opacityTiming = { duration: 350, easing: 'ease-out' };
      el.animated = false;
      el.update(parseFloat(el.dataset.start ?? '0') || 0);
    });
    if (!animate) return;
    ScrollTrigger.create({
      trigger,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        flows.forEach((el, i) => {
          const target = parseFloat(el.dataset.value ?? '');
          if (Number.isNaN(target) || typeof el.update !== 'function') return;
          window.setTimeout(() => {
            el.animated = true;
            el.update?.(target);
          }, 100 + i * 140);
        });
      },
    });
  });
}
