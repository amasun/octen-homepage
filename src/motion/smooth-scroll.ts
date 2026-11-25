import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initBptMetrics } from './bpt-metrics';

declare global {
  interface Window {
    __lenis?: Lenis;
    __senseRebuildLines?: () => void;
  }
}

interface RevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
}

function initMotion(): void {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initBptMetrics(false);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });

  window.__lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  const onTick = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  document.addEventListener('visibilitychange', () => {
    const hidden = document.hidden;
    document.documentElement.classList.toggle('is-page-hidden', hidden);
    if (hidden) {
      lenis.stop();
      gsap.ticker.sleep();
    } else {
      gsap.ticker.wake();
      lenis.start();
    }
  });

  if (typeof IntersectionObserver === 'function') {
    const offscreenIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-offscreen', !entry.isIntersecting);
        });
      },
      { rootMargin: '120px 0px', threshold: 0 },
    );
    document
      .querySelectorAll(
        '#hero, #web-search, #search-tiers, #retrieval-stack, #showcase, #built-to-perform, #pricing, #get-started, #footer',
      )
      .forEach((el) => offscreenIo.observe(el));
  }

  // Smooth anchor navigation via Lenis
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as Element | null;
    const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!anchor) return;
    if (anchor.hasAttribute('data-back-to-top') || anchor.hasAttribute('data-copy-anchor')) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const dest = document.querySelector(href);
    if (!dest) return;

    e.preventDefault();
    lenis.scrollTo(dest as HTMLElement, { offset: -72, duration: 1.0 });
  });

  const revealGroup = (
    targets: string | Element | Element[] | NodeListOf<Element>,
    triggerEl: string | Element | null,
    opts: RevealOptions = {},
  ): void => {
    const els =
      typeof targets === 'string'
        ? Array.from(document.querySelectorAll(targets))
        : targets instanceof Element
          ? [targets]
          : Array.from(targets);

    const trigger =
      typeof triggerEl === 'string' ? document.querySelector(triggerEl) : triggerEl;

    if (!els.length || !trigger) return;

    gsap.from(els, {
      opacity: 0,
      y: opts.y ?? 22,
      duration: opts.duration ?? 0.68,
      stagger: opts.stagger ?? 0.075,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger,
        start: opts.start ?? 'top 86%',
        once: true,
        fastScrollEnd: true,
      },
    });
  };

  gsap.context(() => {
    // 1) Hero (#hero) — immediate load timeline
    const heroIntroItems = document.querySelectorAll(
      '#hero .relative.z-10.flex.flex-col.items-center > *',
    );
    const heroConsoleWrap = document.querySelector('#hero .hero-console-wrap');

    if (heroIntroItems.length || heroConsoleWrap) {
      const heroTl = gsap.timeline();
      if (heroIntroItems.length) {
        heroTl.from(heroIntroItems, {
          opacity: 0,
          y: 16,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
      }
      if (heroConsoleWrap) {
        heroTl.from(
          heroConsoleWrap,
          {
            opacity: 0,
            y: 22,
            duration: 0.75,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          },
          heroIntroItems.length ? '-=0.35' : 0,
        );
      }
    }

    // 2) Web Search (#web-search)
    revealGroup('#web-search [data-node-id="13625:168562"] > *', '#web-search', {
      start: 'top 85%',
    });
    revealGroup('#webSearchCompare > .octen-web-search-card', '#webSearchCompare', {
      y: 26,
      stagger: 0.12,
      start: 'top 84%',
    });

    // 3) Search Products (#search-tiers)
    revealGroup('#search-tiers .st-head > *', '#search-tiers .st-head', {
      y: 18,
      stagger: 0.07,
      start: 'top 86%',
    });
    ['.st-card--pulse', '.st-card--fast', '.st-card--premier'].forEach((selector) => {
      const card = document.querySelector(`#search-tiers ${selector}`);
      if (card) {
        revealGroup(card, card, { y: 26, duration: 0.7, start: 'top 86%' });
      }
    });
    // 三档总览(彩色卡片 + 下方「Lower latency → Higher precision」长横线):滚动到这里后自动播放(不随滚动 scrub),
    // 三张卡片从左到右逐张渐显,随后长横线从左向右画出,两端文字依次淡入
    const axis = document.querySelector<HTMLElement>('#search-tiers .st-axis');
    if (axis) {
      const axisCards = Array.from(axis.querySelectorAll<HTMLElement>('.st-axis-card'));
      const axisBar = axis.querySelector<HTMLElement>('.st-axis-bar');
      const axisLine = axisBar?.querySelector<HTMLElement>('.st-axis-line') ?? null;
      const axisLabels = axisBar ? Array.from(axisBar.querySelectorAll<HTMLElement>(':scope > span:not(.st-axis-line)')) : [];
      // 标记为动画接管透明度的元素:navbar.css 的「inline opacity:0 → 强制显示」回退规则会跳过它们
      [...axisCards, ...axisLabels].forEach((el) => el.setAttribute('data-scrub', ''));
      const axisTl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: axis, start: 'top 88%', once: true },
      });
      if (axisCards.length) {
        axisTl.fromTo(axisCards, { opacity: 0, x: -28 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.2, clearProps: 'transform' }, 0);
      }
      if (axisLabels[0]) axisTl.fromTo(axisLabels[0], { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.7);
      if (axisLine) {
        axisTl.fromTo(
          axisLine,
          { clipPath: 'inset(-10px 100% -10px 0)' },
          { clipPath: 'inset(-10px 0% -10px 0)', duration: 1, ease: 'power1.inOut', clearProps: 'clipPath' },
          0.75,
        );
      }
      if (axisLabels[1]) axisTl.fromTo(axisLabels[1], { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.55);
    }
    // Sense 示意图(v1 多模态图):滚动到这里播放一次 —— 连线依次画出,小方块弹出;视频只在可见时播放
    const senseViz = document.querySelector<HTMLElement>('#senseViz');
    if (senseViz) {
      // ---- 连线按各元素的真实边缘重新生成(地铁线路式:直角 + 圆角转折) ----
      // 起点贴在元素朝向中心的边缘上;转折之间至少走 44 个单位,不出现"刚转弯又转弯"的小折线;
      // 横向主干汇入中心 logo(左 y=210、右直线直入圆盘),上方 / 下方各一条竖向入口
      const svStage = senseViz.querySelector<HTMLElement>('.sv-stage');
      const SV_NODES = ['.sv-video', '.sv-news', '.sv-img', '.sv-biz', '.sv-place', '.sv-chart', '.sv-text', '.sv-web', '.sv-code'];
      const svRound = (pts: Array<[number, number]>, r = 14): string => {
        let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
        for (let i = 1; i < pts.length - 1; i++) {
          const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
          const l1 = Math.hypot(x0 - x1, y0 - y1), l2 = Math.hypot(x2 - x1, y2 - y1);
          const rr = Math.min(r, l1 / 2, l2 / 2);
          const ax = x1 + ((x0 - x1) / l1) * rr, ay = y1 + ((y0 - y1) / l1) * rr;
          const bx = x1 + ((x2 - x1) / l2) * rr, by = y1 + ((y2 - y1) / l2) * rr;
          const sweep = (x1 - x0) * (y2 - y1) - (y1 - y0) * (x2 - x1) > 0 ? 1 : 0;
          d += ` L${ax.toFixed(1)} ${ay.toFixed(1)} A${rr.toFixed(1)} ${rr.toFixed(1)} 0 0 ${sweep} ${bx.toFixed(1)} ${by.toFixed(1)}`;
        }
        const last = pts[pts.length - 1];
        return d + ` L${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
      };
      let senseFlowing = false;
      const senseFlows: Array<{ state: { p: number }; path: SVGPathElement; rect: SVGRectElement }> = [];
      const placeFlowRects = (): void => {   // 曲线随卡片视差重建后,立刻把方块重新放回各自曲线的当前进度位置(不等下一次 GSAP 更新)
        senseFlows.forEach(({ state, path, rect }) => {
          const pt = path.getPointAtLength(state.p * path.getTotalLength());
          gsap.set(rect, { x: pt.x, y: pt.y });
        });
      };
      const buildSenseLines = (): void => {
        if (!svStage) return;
        const sr = svStage.getBoundingClientRect();
        if (!sr.width) return;
        const k = 1020 / sr.width;
        const box = (sel: string) => {
          const el = senseViz.querySelector<HTMLElement>(sel);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { l: (r.left - sr.left) * k, t: (r.top - sr.top) * k, r: (r.right - sr.left) * k, b: (r.bottom - sr.top) * k };
        };
        const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
        const CX = 510, CY = 210;
        const routes: Array<Array<[number, number]> | null> = SV_NODES.map((sel, i) => {
          const n = box(sel);
          if (!n) return null;
          const midY = (n.t + n.b) / 2;
          switch (i) {
            case 0: return [[n.r, midY], [330, midY], [330, CY], [CX, CY]];                         // video → 左主干
            case 1: { const x = (n.l + n.r) / 2; return [[x, n.b], [x, CY], [CX, CY]]; }            // news → 自上而下汇入左主干
            case 2: { const y = clamp(60, n.t + 10, n.b - 10); return [[n.l, y], [CX, y], [CX, 160]]; }   // image → 上方入口
            case 3: { const y = clamp(CY, n.t + 10, n.b - 10); return [[n.r, y], [CX, y]]; }         // business → 直线入 logo
            case 4: { const y = clamp(137, n.t + 10, n.b - 10); return [[n.l, y], [548, y], [548, CY], [CX, CY]]; }   // place → 右主干
            case 5: { const y = clamp(224, n.t + 10, n.b - 10); return [[n.l, y], [CX, y]]; }        // chart → 直线入 logo
            case 6: return [[n.r, midY], [240, midY], [240, CY], [CX, CY]];                          // text → 左主干
            case 7: { const y = clamp(352, n.t + 10, n.b - 10); return [[n.r, y], [CX, y], [CX, 262]]; }   // web → 下方入口
            default: return [[n.l, midY], [CX, midY], [CX, 262]];                                   // code → 下方入口(位置比 Web 更低,取卡片中线)
          }
        });
        const ps = senseViz.querySelectorAll<SVGPathElement>('.sv-path');
        const rs = senseViz.querySelectorAll<SVGRectElement>('.diag-rect');
        routes.forEach((pts, i) => {
          if (!pts || !ps[i]) return;
          ps[i].setAttribute('d', svRound(pts));
          // 方块的几何固定在原点(-6.9, -6.9),位置完全由 GSAP 的 x / y(= 曲线上的绝对坐标)决定;
          // 这样曲线端点随卡片位移而改变时,方块不会因为属性变化而偏离曲线
          if (rs[i]) {
            rs[i].setAttribute('x', '-6.9');
            rs[i].setAttribute('y', '-6.9');
            if (!senseFlowing) {
              const st = ps[i].getPointAtLength(0);
              gsap.set(rs[i], { x: st.x, y: st.y });
            }
          }
        });
      };
      buildSenseLines();
      window.__senseRebuildLines = (): void => { buildSenseLines(); placeFlowRects(); };   // 视差移动卡片时,由 octen-tiers.js 调用,让连线起点始终贴着卡片边缘
      document.fonts?.ready.then(() => { buildSenseLines(); refreshSenseDash(); });
      if (svStage && 'ResizeObserver' in window) new ResizeObserver(() => { buildSenseLines(); refreshSenseDash(); }).observe(svStage);

      const paths = Array.from(senseViz.querySelectorAll<SVGPathElement>('.sv-path'));
      const rects = Array.from(senseViz.querySelectorAll<SVGRectElement>('.diag-rect'));
      rects.forEach((el) => el.setAttribute('data-scrub', ''));
      senseViz.querySelector('.sv-scan')?.setAttribute('data-scrub', '');
      const senseNodes = Array.from(senseViz.querySelectorAll<HTMLElement>('.sv-node'));
      senseNodes.forEach((el) => el.setAttribute('data-scrub', ''));
      let senseDrawn = false;
      function refreshSenseDash(): void {
        paths.forEach((path) => {
          const len = path.getTotalLength();
          path.style.strokeDasharray = senseDrawn ? 'none' : `${len}`;   // 画完后取消虚线,线长随视差变化时不会出现缺口
          path.style.strokeDashoffset = senseDrawn ? '0' : `${len}`;     // 从各元素一端向中心画出
        });
      }
      refreshSenseDash();
      // 入场之后:每个彩色方块沿一条连线(从各元素一端出发)持续流向中心的 Octen logo,像数据包;
      // 起点淡入、进入 logo 时缩小淡出;离开视口时暂停
      const flowTweens: gsap.core.Tween[] = [];
      const startFlows = (): void => {
        senseFlowing = true;
        rects.forEach((rect, i) => {
          const path = paths[i % paths.length];
          if (!path) return;
          const state = { p: 0 };
          senseFlows.push({ state, path, rect });
          flowTweens.push(
            gsap.to(state, {
              p: 1,
              duration: (path.getTotalLength() / 330) * 1.6 + 1.2,
              ease: 'sine.in',                                  // 越靠近中心越快,像被 logo 吸进去
              repeat: -1,
              repeatDelay: 0.3,
              delay: i * 0.33,
              onUpdate: () => {
                const len = path.getTotalLength();
                const pt = path.getPointAtLength(state.p * len);                         // 始终取当前曲线上的点(曲线随卡片视差实时重建)
                const k = Math.min(1, state.p * 8) * Math.min(1, (1 - state.p) * 6);   // 淡入 → 进入 logo 时淡出
                gsap.set(rect, { x: pt.x, y: pt.y, opacity: k, scale: 0.55 + 0.6 * k, transformOrigin: '50% 50%' });
              },
            }),
          );
        });
        ScrollTrigger.create({
          trigger: senseViz,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => flowTweens.forEach((t) => (self.isActive ? t.resume() : t.pause())),
        });
      };

      // 四角定位的扫描框:在右侧图形的各个元素之间依次切换聚焦(移动 + 缩放到目标,落定时轻微收紧一下),离开视口时暂停
      const scanBox = senseViz.querySelector<HTMLElement>('.sv-scan');
      const scanStage = senseViz.querySelector<HTMLElement>('.sv-stage');
      let scanActive = false;
      let scanIdx = -1;
      let scanTimer: gsap.core.Tween | null = null;
      const scanTargets = (): HTMLElement[] =>
        ['.sv-video', '.sv-news', '.sv-img', '.sv-biz', '.sv-place', '.sv-chart', '.sv-text', '.sv-web', '.sv-code']
          .map((sel) => senseViz.querySelector<HTMLElement>(sel))
          .filter((el): el is HTMLElement => !!el);
      const scanNext = (): void => {
        if (!scanBox || !scanStage || !scanActive) return;
        const targets = scanTargets();
        if (!targets.length) return;
        let next = scanIdx;
        while (targets.length > 1 && next === scanIdx) next = Math.floor(Math.random() * targets.length);
        scanIdx = next;
        const sr = scanStage.getBoundingClientRect();
        const tr = targets[next].getBoundingClientRect();
        const pad = 7;
        gsap.timeline({ onComplete: () => { scanTimer = gsap.delayedCall(1.1, scanNext); } })
          .to(scanBox, { opacity: 1, duration: 0.2, overwrite: 'auto' }, 0)
          .to(scanBox, { x: tr.left - sr.left - pad, y: tr.top - sr.top - pad, width: tr.width + pad * 2, height: tr.height + pad * 2, duration: 0.75, ease: 'power3.inOut' }, 0)
          .to(scanBox, { scale: 0.94, duration: 0.14, ease: 'power2.out', transformOrigin: '50% 50%' }, '>-0.02')
          .to(scanBox, { scale: 1, duration: 0.32, ease: 'back.out(3)' }, '>');
      };
      const startScan = (): void => {
        if (!scanBox || !scanStage) return;
        const sr = scanStage.getBoundingClientRect();
        gsap.set(scanBox, { x: sr.width * 0.5 - 30, y: sr.height * 0.5 - 30, width: 60, height: 60, opacity: 0 });
        scanActive = true;
        scanNext();
        ScrollTrigger.create({
          trigger: senseViz,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            scanActive = self.isActive;
            if (scanActive) { scanTimer?.kill(); scanTimer = gsap.delayedCall(0.2, scanNext); }
          },
        });
      };

      const senseTl = gsap.timeline({
        scrollTrigger: { trigger: senseViz, start: 'top 82%', once: true },
        onComplete: () => { startFlows(); startScan(); },
      });
      if (paths.length) {
        senseTl.to(paths, { strokeDashoffset: 0, duration: 1.6, stagger: 0.18, ease: 'power2.out', onComplete: () => { senseDrawn = true; paths.forEach((pp) => { pp.style.strokeDasharray = 'none'; pp.style.strokeDashoffset = '0'; }); } }, 0);
      }
      if (rects.length) {
        senseTl.fromTo(
          rects,
          { scale: 0, opacity: 0, transformOrigin: '50% 50%' },
          { scale: 1, opacity: 1, duration: 0.7, stagger: 0.14, ease: 'back.out(1.7)' },
          0.5,
        );
      }
      if (senseNodes.length) {
        senseTl.fromTo(senseNodes, { opacity: 0, scale: 0.6, transformOrigin: 'top left' }, { opacity: 1, scale: 0.88, duration: 0.6, stagger: 0.18, ease: 'back.out(1.6)' }, 0.9);
      }
      const senseVideo = senseViz.querySelector<HTMLVideoElement>('video');
      if (senseVideo && 'IntersectionObserver' in window) {
        new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) senseVideo.play().catch(() => undefined);
              else senseVideo.pause();
            });
          },
          { threshold: 0.2 },
        ).observe(senseViz);
      }
    }
    // Sense 卡片整体入场(滚动触发,自动播放一次):卡片上浮渐显 → 左侧文字逐行上浮 → 右侧示意图自右向左渐显
    const senseCard = document.querySelector<HTMLElement>('#search-tiers .st-card--sense');
    if (senseCard) {
      const senseTxt = Array.from(senseCard.querySelectorAll<HTMLElement>('.st-txt > *'));
      const senseGraphic = senseCard.querySelector<HTMLElement>('.sense-viz');
      [senseCard, ...senseTxt, ...(senseGraphic ? [senseGraphic] : [])].forEach((el) => el.setAttribute('data-scrub', ''));
      const senseCardTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: senseCard, start: 'top 86%', once: true },
      });
      senseCardTl.fromTo(senseCard, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7, clearProps: 'transform' }, 0);
      if (senseTxt.length) {
        senseCardTl.fromTo(senseTxt, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, clearProps: 'transform' }, 0.25);
      }
      if (senseGraphic) {
        senseCardTl.fromTo(senseGraphic, { opacity: 0, x: 32 }, { opacity: 1, x: 0, duration: 0.8, clearProps: 'transform' }, 0.35);
      }
    }
    revealGroup('#search-tiers .st-fx-grid > .st-fx', '#search-tiers .st-fx-grid', {
      y: 18,
      stagger: 0.06,
      start: 'top 84%',
    });
    revealGroup('#search-tiers .st-pm-grid > .st-pm', '#search-tiers .st-pm-grid', {
      y: 18,
      stagger: 0.06,
      start: 'top 84%',
    });
    revealGroup('#search-tiers .st-guide', '#search-tiers .st-guide', {
      y: 16,
      start: 'top 90%',
    });

    // 4) Octen Tools & Models (#retrieval-stack)
    revealGroup('#retrieval-stack .rs-head > *', '#retrieval-stack .rs-head', {
      y: 18,
      stagger: 0.07,
      start: 'top 86%',
    });
    revealGroup('#rsBento > .rs-cell', '#rsBento', {
      y: 24,
      stagger: 0.09,
      start: 'top 84%',
    });

    // 5) Showcase (#showcase)
    revealGroup('#showcase .sc-head', '#showcase .sc-head', {
      y: 18,
      start: 'top 86%',
    });
    revealGroup('#showcase .sc-apps > .sc-app', '#showcase .sc-apps', {
      y: 22,
      stagger: 0.07,
      start: 'top 85%',
    });

    // 5b) Showcase 卡片轨道:页面始终正常滚动(不 pin);区块在视口里经过的这段滚动中,卡片随滚轮自动向左移动,
    //     区块刚进入视口时在最左,快要离开视口时最后一张完整露出。桌面端启用(窄屏保持手指横滑);系统开了「减少动态效果」时本函数不会执行
    const showcaseEl = document.querySelector<HTMLElement>('#showcase');
    const showcaseApps = showcaseEl?.querySelector<HTMLElement>('.sc-apps');
    if (showcaseEl && showcaseApps) {
      const scMm = gsap.matchMedia();
      scMm.add('(min-width: 861px)', () => {
        const maxScroll = (): number => Math.max(0, showcaseApps.scrollWidth - showcaseApps.clientWidth);
        if (maxScroll() <= 4) return;
        showcaseEl.classList.add('is-scroll-driven');   // CSS:关闭 scroll-snap、隐藏左右按钮(由滚动接管)
        gsap.fromTo(
          showcaseApps,
          { scrollLeft: 0 },
          {
            scrollLeft: () => maxScroll(),
            ease: 'none',
            scrollTrigger: {
              trigger: showcaseEl,
              start: 'top 85%',        // 区块顶部进入视口 85% 处开始向左移
              end: 'center 40%',       // 区块中心上到视口 40% 处,最后一张卡片完整露出
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
        return () => showcaseEl.classList.remove('is-scroll-driven');
      });
    }

    // 6) Built to Perform (#built-to-perform)
    revealGroup('#built-to-perform .bpt-head > *', '#built-to-perform .bpt-head', {
      y: 18,
      stagger: 0.07,
      start: 'top 86%',
    });
    const bptPanels = document.querySelectorAll('#built-to-perform .bpt-panels');
    if (bptPanels.length) {
      revealGroup(bptPanels, '#built-to-perform .bpt-panels', { y: 24, start: 'top 85%' });
    } else {
      revealGroup('#built-to-perform .bpt-card', '#built-to-perform .bpt-card', {
        y: 24,
        start: 'top 85%',
      });
    }

    // 7) Pricing (#pricing)
    revealGroup('#pricing .mb-10 > *', '#pricing .mb-10', {
      y: 18,
      stagger: 0.07,
      start: 'top 86%',
    });
    revealGroup('#pricing-search-plans-root', '#pricing-search-plans-root', {
      y: 24,
      start: 'top 86%',
    });

    // 8) Get Started (#get-started)
    revealGroup('#get-started .gs-head > *', '#get-started .gs-head', {
      y: 18,
      stagger: 0.07,
      start: 'top 86%',
    });
    revealGroup('#get-started .gs-steps > .gs-step-card', '#get-started .gs-steps', {
      y: 22,
      stagger: 0.09,
      start: 'top 86%',
    });
    revealGroup('#get-started .gs-integrations', '#get-started .gs-integrations', {
      y: 20,
      start: 'top 88%',
    });

    // 9) Footer (#footer)
    revealGroup(
      '#footer .octen-footer-header, #footer .octen-footer-container > div:not(.octen-footer-header)',
      '#footer',
      { y: 18, stagger: 0.08, start: 'top 92%' },
    );
  });

  initBptMetrics(true);   // Built to Perform 指标数字:NumberFlow + ScrollTrigger 滚入触发

  // Refresh ScrollTrigger after async fonts, images, and React-mounted sections settle
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.setTimeout(() => ScrollTrigger.refresh(), 350);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMotion, { once: true });
} else {
  initMotion();
}
