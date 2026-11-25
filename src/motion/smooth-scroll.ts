import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

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
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
    //     区块进入视口后先停在最左,稍晚才开始左移,快要离开视口时最后一张完整露出。桌面端启用(窄屏保持手指横滑);系统开了「减少动态效果」时本函数不会执行
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
              start: 'top 55%',        // 区块顶部上到视口 55% 处才开始向左移(延后,先让区块完整进入视线)
              end: 'bottom 62%',       // 区块底部上到视口 62% 处,最后一张卡片完整露出
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
