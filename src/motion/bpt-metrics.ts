import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
