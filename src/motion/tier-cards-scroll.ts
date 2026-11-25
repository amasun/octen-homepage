import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Search 总览三张卡片的「跟滚轮演进」入场(scrub,进度由 Lenis 平滑后的滚动位置驱动):
 *   帧 1:Pulse(最快)最先浮现,Fast 次之,Premier 最后(依次更低、更透明)
 *   帧 2:三张都已显现,左高右低
 *   帧 3:三张并排对齐 —— Premier 最后到位
 * 上下元素协调:
 *   - 指标轴(Lower latency → Higher precision)随卡片收拢「画出」:先左标签,线条自左向右,最后右标签
 *   - 下方 Broad Search 面板在卡片并排之后才浮起(单独的 scrub 段)
 * 窄屏(<861px,三张卡片竖排)改为每张进入视口时各自上浮一次。
 */
export function initTierCardsScroll(): void {
  const scale = document.querySelector<HTMLElement>('.st-scale');
  const cols = document.querySelector<HTMLElement>('.st-scale-cols');
  if (!scale || !cols) return;

  const cards = Array.from(cols.querySelectorAll<HTMLElement>('.st-tier-card'));
  const find = (tier: string) => cards.find((c) => c.dataset.tier === tier);
  const pulse = find('pulse');
  const fast = find('fast');
  const premier = find('premier');
  if (!pulse || !fast || !premier) return;

  const axis = scale.querySelector<HTMLElement>('.st-axis-bar');
  const axisL = axis?.children[0] as HTMLElement | undefined;
  const axisLine = axis?.querySelector<HTMLElement>('.st-axis-line') ?? undefined;
  const axisR = axis?.children[2] as HTMLElement | undefined;
  const broad = document.querySelector<HTMLElement>('#web-search.st-bs');
  const bigword = scale.querySelector<HTMLElement>('.st-bigword');

  // 标记为 scrub 元素:navbar.css 的「inline opacity:0 → 强制显示」回退规则会跳过它们
  [...cards, axisL, axisR, axisLine, broad, bigword].forEach((el) => el?.setAttribute('data-scrub', ''));

  const mm = gsap.matchMedia();

  mm.add('(min-width: 861px)', () => {
    // 桌面:启用背景大字所需的版式(基础 CSS 里大字默认隐藏、间距 24px,这样减少动态 / 窄屏 / 无 JS 时是干净的静态版式)
    scale.classList.add('has-bigword');

    // 大字初始位置:居中在三张卡片所在的区域(此时卡片还没出现,大字完整可读);之后随视差下移到卡片下方的空隙
    const wordStartY = () => {
      if (!bigword) return 0;
      const axisH = axis ? axis.offsetHeight + 16 : 0;   // 指标轴现在位于卡片下方、仍在 .st-scale 内
      return -(cols.offsetHeight / 2 + bigword.offsetHeight / 2 + axisH) + 6;
    };

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: scale,
        start: 'top 92%',
        // 终点:让「三张卡片 + 指标轴 + Broad Search 面板」的最终形态完整落在一屏内——
        // 整体高度 H = 卡片区(含轴)+ 最终间距 12 + 面板高度;卡片区顶部停在 (视口高 - H) / 2 处(上限 140px,下限 100px 避开 promo 条与导航栏)
        end: () => {
          const H = scale.offsetHeight + 12 + (broad ? broad.offsetHeight : 0);
          const top = Math.max(100, Math.min((window.innerHeight - H) / 2, 140));   // 下限 100px:避开顶部 promo 条 + 导航栏
          return `top ${Math.round(top)}px`;
        },
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    /* 时序(0 → 1):
       0.00–0.25  OCTEN SEARCH 先出现:渐显,位置略高于卡片区中心,完整可读(卡片、面板此时都还没出现)
       0.30–0.80  三张卡片逐次进场(Pulse → Fast → Premier 最后;Pulse 最快所以最先),盖在大字之上;大字同时视差下移到卡片下方
       0.55–1.00  Broad Search 面板上升靠近(间距 120 → 12px),盖住大字(大字不再渐隐,继续随滚动下移,直到 Search by type 卡片背后) */
    if (bigword) {
      // 渐显:先于卡片出现;之后不再渐隐,一直保持可见(被 Broad Search 面板盖住的那一段看不到,之后会从面板下方的空隙重新露出)
      tl.fromTo(bigword, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'none' }, 0);
    }

    // 卡片:Pulse → Fast → Premier(按速度,Pulse 最快所以最先);起始位置依次更低,逐次收拢到同一水平线(整体推迟到大字出现之后)
    tl.fromTo(pulse, { y: 72, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0.3);
    tl.fromTo(fast, { y: 92, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0.4);
    tl.fromTo(premier, { y: 112, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0.5);

    // 卡片内部元素(标签、数字、说明)不再单独做动画:随卡片整体一起出现

    // 指标轴:出现时贴在 Premier 卡片(最后到位的那张)的底部,与它同步(同起点、同缓动、同位移 112px)上升,
    // 不再被卡片压在下面;随后回到最终位置(卡片正下方、Broad Search 面板上方)
    if (axis) tl.fromTo(axis, { y: 112 }, { y: 0, duration: 0.4 }, 0.5);

    // 指标轴:随卡片收拢画出
    if (axisL) tl.fromTo(axisL, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'none' }, 0.4);
    if (axisLine) tl.fromTo(axisLine, { clipPath: 'inset(-10px 100% -10px 0)' }, { clipPath: 'inset(-10px 0% -10px 0)', duration: 0.4, ease: 'none' }, 0.45);   // 上下各留 10px:不裁掉末端箭头
    if (axisR) tl.fromTo(axisR, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'none' }, 0.8);

    // Broad Search 面板:上升靠近三张卡片(间距收拢),盖住灰色大字
    // 面板保持不透明(不做淡入),这样灰色大字始终在它后面、被它实实在在地盖住,不会透出来;最终间距收到 12px
    tl.fromTo(scale, { marginBottom: 120 }, { marginBottom: 12, duration: 0.45, ease: 'power2.inOut' }, 0.55);

    // 灰色大字:始终是 position:fixed 的屏幕背景字,置底在屏幕下部(CSS top 76%)——相对屏幕不位移,
    //   所以不会有任何向上的"跳起",也不受 Lenis 平滑影响(页面向上滚多少像素,它相对页面就向下移多少像素,看起来一直置底);
    //   入场:只随滚动渐隐出现(透明度由卡片演进时间轴负责),位置不变;
    //   层级最低:Broad Search 面板、Search by type(标题 + 卡片)都画在它上面,大字不会压在文字上;
    //   出场:等 Search by type 快浏览完(其底边升到视口 72% 处)才结束,最后 320px 滚动距离内渐隐消失
    const typesGrid = document.querySelector<HTMLElement>('.st-types');
    if (bigword && typesGrid) {
      const docTop = (el: HTMLElement): number => el.getBoundingClientRect().top + window.scrollY;
      // 卡片区动画走完后 .st-scale 的下边距是 12px;刷新时可能还在 120px,这里换算到最终版面
      const marginFix = (): number => (parseFloat(getComputedStyle(scale).marginBottom) || 0) - 12;
      const setSize = (): void => { scale.style.setProperty('--st-bw-fs', `${(scale.clientWidth * 0.141).toFixed(2)}px`); };   // 字号 = 一排宽度的 14.1%
      setSize();
      ScrollTrigger.addEventListener('refreshInit', setSize);
      let fading = false;
      ScrollTrigger.create({
        trigger: scale,
        start: 'top 92%',
        end: () => Math.round(docTop(typesGrid) - marginFix() + typesGrid.offsetHeight - window.innerHeight * 0.72),
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (!self.isActive) return;
          const remain = self.end - self.scroll();
          if (remain < 320) {                       // 出场渐隐(渐显那一段由上面的卡片演进时间轴负责)
            fading = true;
            gsap.set(bigword, { opacity: Math.max(0, remain / 320) });
          } else if (fading) {
            fading = false;
            gsap.set(bigword, { opacity: 1 });
          }
        },
        onLeave: () => { gsap.set(bigword, { opacity: 0 }); bigword.classList.add('is-gone'); },
        onEnterBack: () => bigword.classList.remove('is-gone'),
        onLeaveBack: () => { fading = false; },
        onRefresh: (self) => { bigword.classList.toggle('is-gone', self.progress >= 1); },
      });
    }

    return () => { scale.classList.remove('has-bigword'); bigword?.classList.remove('is-gone'); };
  });

  // 窄屏:竖排,各自进入视口时上浮一次
  mm.add('(max-width: 860px)', () => {
    cards.forEach((card) => {
      gsap.from(card, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      });
    });
    if (broad) {
      gsap.from(broad, {
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: broad, start: 'top 92%', once: true },
      });
    }
  });

  ScrollTrigger.refresh();
}
