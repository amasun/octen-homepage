import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initTierMetrics, initBptMetrics } from './tier-metrics';
import { initTierCardsScroll } from './tier-cards-scroll';

declare global {
  interface Window {
    __lenis?: Lenis;
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
    initTierMetrics(false);   // 只写入最终值,不做滚轮动画
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

    // 2b) Broad Search 文字:跟随滚动逐步显现(scrub,进度由 Lenis 平滑后的滚动位置驱动)
    //     标题整块上浮淡入 → 正文逐词由暗变亮 → 链接最后淡入;prefers-reduced-motion 时本函数不执行,文字保持完全可见
    const shiftForGap = (): number => (window.matchMedia('(min-width: 861px)').matches ? 120 - 12 : 0);
    const bsTxt = document.querySelector<HTMLElement>('.st-bs-txt');
    if (bsTxt) {
      const bsTitle = bsTxt.querySelector<HTMLElement>('.st-bs-h');
      const bsPara = bsTxt.querySelector<HTMLElement>('.st-bs-p');
      const bsLink = bsTxt.querySelector<HTMLElement>('.st-bs-link');

      const bsWords: HTMLElement[] = [];
      if (bsPara) {
        const text = bsPara.textContent ?? '';
        bsPara.textContent = '';
        text.split(/(\s+)/).forEach((token) => {
          if (!token) return;
          if (/^\s+$/.test(token)) {
            bsPara.append(document.createTextNode(token));
            return;
          }
          const span = document.createElement('span');
          span.className = 'st-bs-w';
          span.textContent = token;
          bsPara.append(span);
          bsWords.push(span);
        });
      }

      // 标记为滚动 scrub 元素:navbar.css 的「inline opacity:0 → 强制显示」回退规则会跳过它们
      [bsTitle, bsLink, ...bsWords].forEach((el) => el?.setAttribute('data-scrub', ''));

      const bsTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: bsTxt,
          // ScrollTrigger 在 refresh 时按「卡片与面板间距 = 120px」的初始版面量位置,而三张卡片的动画走完后间距收到 12px,
          // 面板实际上会比量到的位置高 108px。这里把这 108px 补进来,让进度与「真实版面」对齐:
          //   开始:文字块顶部进入视口 90% 处;结束:文字块中心到达视口 54% 处 —— 在 Broad Search 卡片到达页面中心之前就过渡完毕
          start: () => `top ${Math.round(window.innerHeight * 0.9 + shiftForGap())}px`,
          end: () => `center ${Math.round(window.innerHeight * 0.54 + shiftForGap())}px`,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
      if (bsTitle) {
        bsTl.fromTo(bsTitle, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0);
      }
      if (bsWords.length) {
        bsTl.fromTo(
          bsWords,
          { opacity: 0.14 },
          { opacity: 1, duration: 0.12, stagger: { each: 0.6 / bsWords.length } },
          0.2,
        );
      }
      if (bsLink) {
        bsTl.fromTo(bsLink, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.85);
      }
    }

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
    // Search by type 六类 Bento:标题区 + 卡片逐张上浮
    revealGroup('#search-tiers .st-types-head > *', '#search-tiers .st-types-head', { y: 18, stagger: 0.07, start: 'top 88%' });
    revealGroup('#stTypes > .st-bt', '#stTypes', { y: 26, stagger: 0.08, start: 'top 86%' });
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

  // Search 总览卡片指标(10 ms / 62 ms / High):直接显示最终值
  initTierCardsScroll();
  initTierMetrics(false);   // 卡片内的数字不再单独触发滚轮,随卡片整体出现(直接显示最终值)
  initBptMetrics(true);     // Built to Perform 指标数字:NumberFlow + ScrollTrigger 滚入触发

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
