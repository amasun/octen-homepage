(function () {
  /**
   * Octen Vertical Search - Interactive News Search Controller
   * High-Fidelity 5-Step Motion System & Timing Specification
   * Aligned with Figma Node 13784-6606 & NEWS_SEARCH_ANIMATION_SPEC.md
   */

  function initVerticalSearch() {
    const cardCanvas = document.getElementById('newsSearchCard') || document.getElementById('heroCanvas');
    if (!cardCanvas) return;

    // ==========================================
    // 1. DUAL VERTICAL DATA CONFIGURATION
    // ==========================================
    const VERTICALS = {
      news: {
        id: 'news',
        title: 'News Search',
        heading: 'News Search',
        desc: 'Real-time global reporting indexed at wire speed. Curated across trusted publications, cross-verified, and structured for autonomous reasoning.',
        theme: 'news',
        query: 'Strait of Hormuz shipping disruptions',
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-newspaper"><path d="M15 18h-5"></path><path d="M18 14h-8"></path><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"></path><rect width="8" height="4" x="10" y="6" rx="1"></rect></svg>`,
        watermarkSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-newspaper"><path d="M15 18h-5"></path><path d="M18 14h-8"></path><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"></path><rect width="8" height="4" x="10" y="6" rx="1"></rect></svg>`,
        badgeText: 'Top News',
        stats: { num1: 4, label1: 'subjects', num2: 10, label2: 'articles' },
        bullets: [
          '• Fresh news, delivered in milliseconds.',
          '• Track the progress of each subject across the timeline.',
          "• Dive deep into the story's development."
        ],
        subjects: [
          {
            name: 'Saudi Arabia halts East-West pipeline after drone attacks from Iraq, with repairs expected to take three to five weeks',
            summary: 'Saudi Arabia suspended operations on its East-West oil pipeline following drone attacks launched from Iraq that damaged pumping stations in the Riyadh and Medina regions. Satellite imagery confirmed major damage to a key facility, and officials told AP that repairs will take three to five weeks, potentially depleting export stocks at Yanbu.',
            timeStart: '2026-09-11T00:00:00Z',
            timeLatest: '2026-09-15T21:40:00Z',
            cover: '/images/vertical/subject-1.png',
            fallbackCover: 'https://www.reuters.com/resizer/v2/NBVC6SDELNITTNCA4X55OSSPKM.jpg?auth=45ddc3632d960da3fa4dc5652e455479277bdb7240c23991d56f1ff7164c973d&height=1005&width=1920&quality=80&smart=true',
            articles: [
              {
                title: 'Global Oil Prices Could Hit Highest Levels in Months After Saudi Pipeline Attacks',
                timePublished: '2026-09-15T05:26:15Z',
                url: 'https://www.sbs.com.au/news/article/global-oil-prices-could-hit-highest-levels-in-months-after-saudi-pipeline-attacks/2958h2'
              },
              {
                title: 'Saudi Arabia: Satellite image reveals major damage that shut crucial oil pipeline',
                timePublished: '2026-09-15T05:27:44Z',
                url: 'https://www.sbs.com.au/news/article/saudi-arabia-satellite-image-reveals-major-damage/c65yw2gq2nrno'
              },
              {
                title: 'Oil squeeze tightens as Iran-backed attacks cripple Hormuz escape routes',
                timePublished: '2026-09-15T06:45:31Z',
                url: 'https://www.cnbc.com/politics/oil-squeeze-tightens-iran-backed-attacks-cripple-hormuz-escape-routes.print'
              },
              {
                title: 'Aramco activates emergency storage tankers at Yanbu port amid transit deadlock',
                timePublished: '2026-09-15T09:04:31Z',
                url: 'https://www.bloomberg.com/news/articles/2026-09-15/aramco-activates-emergency-yanbu-storage-tankers'
              },
              {
                title: 'Saudi pipeline outage threatens loss of 4% of global oil supply',
                timePublished: '2026-09-15T12:04:04Z',
                url: 'https://www.reuters.com/business/energy/saudi-pipeline-outage-threatens-loss-4-global-oil-supply-2026-09-15/'
              }
            ]
          },
          {
            name: "Ghalibaf says Strait of Hormuz will remain closed until Iran's seven conditions are met",
            summary: "Iranian Parliament Speaker Mohammad Bagher Ghalibaf stated on September 20 that the Strait of Hormuz will not be reopened until the United States meets Iran's seven specific conditions. He announced that Tehran has conveyed these conditions to Washington through mediators and emphasized that Iran will pursue a strategy combining military action with diplomacy.",
            timeStart: '2026-09-19T00:00:00Z',
            timeLatest: '2026-09-20T21:40:00Z',
            cover: '/images/vertical/subject-2.png',
            fallbackCover: 'https://th-i.thgim.com/public/incoming/hc96xo/article71487642.ece/alternates/LANDSCAPE_1200/2026-08-21T070048Z_1945003085_RC2V2NAMLYIS_RTRMADP_3_IRAN-CRISIS-IRAQ-QALIBAF-NAJAF.JPG',
            articles: [
              {
                title: 'Tehran outlines seven non-negotiable conditions for Hormuz strait access',
                timePublished: '2026-09-20T06:15:20Z',
                url: 'https://www.aljazeera.com/news/2026/9/20/tehran-outlines-seven-conditions-hormuz'
              },
              {
                title: "Swiss diplomatic backchannel receives Iran's formal demands on sanctions relief",
                timePublished: '2026-09-20T08:38:54Z',
                url: 'https://www.reuters.com/world/middle-east/swiss-backchannel-receives-iran-demands-2026-09-20/'
              },
              {
                title: "No reopening of Strait of Hormuz until Iran's conditions are met, says Ghalibaf",
                timePublished: '2026-09-20T10:44:29Z',
                url: 'https://www.thehindu.com/news/international/no-reopening-of-strait-of-hormuz-until-irans-conditions-are-met-says-ghalibaf/article71487500.ece'
              },
              {
                title: 'US State Department rejects Tehran ultimatum, calls maritime blockade unacceptable',
                timePublished: '2026-09-20T13:20:10Z',
                url: 'https://www.cnn.com/2026/09/20/politics/state-department-rejects-iran-hormuz-ultimatum/index.html'
              },
              {
                title: 'UN Security Council convenes emergency session on Persian Gulf naval standoff',
                timePublished: '2026-09-20T18:05:42Z',
                url: 'https://apnews.com/article/un-security-council-iran-hormuz-standoff-2026'
              }
            ]
          },
          {
            name: 'Houthi rebels seize Greater and Lesser Hanish islands, tightening control of Bab el-Mandeb Strait',
            summary: "Yemen's Houthi rebels have captured the strategic islands of Greater and Lesser Hanish in the southern Red Sea, displacing more than 80,000 people in recent fighting. The seizure strengthens the Iran-backed group's grip on the Bab el-Mandeb shipping route and has intensified concerns over global oil supply disruptions.",
            timeStart: '2026-09-14T00:00:00Z',
            timeLatest: '2026-09-15T21:40:00Z',
            cover: '/images/vertical/subject-3.png',
            fallbackCover: 'https://i.guim.co.uk/img/media/0d73d909d1a2538485c626492748c53674c1966e/0_0_3840_3072/master/3840.jpg?width=1200&height=630&quality=85&auto=format&fit=crop&precrop=40:21,offset-x50,offset-y0&overlay-align=bottom%2Cleft&overlay-width=100p&overlay-base64=L2ltZy9zdGF0aWMvb3ZlcmxheXMvdGctZGVmYXVsdC5wbmc&enable=upscale&s=75486fa313ea5ee36d3db5532d4f7a78',
            articles: [
              {
                title: 'Houthis seize strategic Red Sea islands as analysts warn of impending oil crunch',
                timePublished: '2026-09-15T04:22:16Z',
                url: 'https://www.theguardian.com/world/2026/sep/15/houthi-rebels-seize-red-sea-hanish-islands-saudi-oil-warning'
              },
              {
                title: 'Houthi naval units launch amphibious assault on Red Sea navigation hubs',
                timePublished: '2026-09-15T07:47:23Z',
                url: 'https://apnews.com/article/yemen-houthi-red-sea-amphibious-assault-2026'
              },
              {
                title: 'Commercial vessels reroute around Cape of Good Hope, adding two weeks to transit',
                timePublished: '2026-09-15T11:30:45Z',
                url: 'https://www.ft.com/content/red-sea-rerouting-cape-good-hope-delays'
              },
              {
                title: 'Coalition warships reposition toward southern Bab el-Mandeb following island capture',
                timePublished: '2026-09-15T14:28:31Z',
                url: 'https://news.usni.org/2026/09/15/coalition-warships-reposition-bab-el-mandeb'
              },
              {
                title: 'Insurance syndicates declare entire southern Red Sea high-risk war exclusion zone',
                timePublished: '2026-09-15T19:18:00Z',
                url: 'https://www.lloydslist.com/insurance/red-sea-war-exclusion-zone-declaration'
              }
            ]
          },
          {
            name: 'Oil prices rise 1.75% to $107.50 as traders assess impact of Saudi pipeline shutdown',
            summary: "Brent crude futures rose 1.75% to $107.50 per barrel and WTI rose 1.8% to $103.17 per barrel on Tuesday, September 15, 2026, as traders assessed the impact of the shutdown of Saudi Arabia's East-West pipeline. The closure, caused by recent strikes, threatens up to 4% of global oil supply, with the true extent of the damage to the pipeline not yet confirmed.",
            timeStart: '2026-09-13T00:00:00Z',
            timeLatest: '2026-09-15T21:40:00Z',
            cover: '/images/vertical/subject-4.png',
            fallbackCover: 'https://images.wsj.net/im-48341995/social',
            articles: [
              {
                title: 'Oil Prices Rise as Traders Gauge Lost Saudi Arabian Volumes After Pipeline Attack',
                timePublished: '2026-09-15T05:37:00Z',
                url: 'https://www.wsj.com/finance/currencies/oil-rises-as-stabilizers-in-crude-market-start-to-weaken-5dc85781'
              },
              {
                title: 'Iran dismisses US talks as Strait of Hormuz crisis deepens across commodities',
                timePublished: '2026-09-15T08:31:14Z',
                url: 'https://www.thenationalnews.com/news/gulf/2026/09/15/iran-dismisses-us-talks-as-hormuz-crisis-deepens/'
              },
              {
                title: 'Brent crude surges past $105 as Asian markets open to Middle East supply shock',
                timePublished: '2026-09-15T11:23:00Z',
                url: 'https://www.bloomberg.com/news/articles/2026-09-15/brent-crude-surges-past-105-middle-east-shock'
              },
              {
                title: 'IEA considers coordinated strategic petroleum reserve release to calm markets',
                timePublished: '2026-09-15T16:40:22Z',
                url: 'https://www.reuters.com/business/energy/iea-emergency-reserve-release-deliberations-2026-09-15/'
              },
              {
                title: 'OPEC+ delegates signal no immediate quota hikes despite spiking global futures',
                timePublished: '2026-09-15T20:15:30Z',
                url: 'https://www.cnbc.com/2026/09/15/opec-no-quota-hike-oil-crisis.html'
              }
            ]
          }
        ]
      },
      business: {
        id: 'business',
        title: 'Business Search',
        heading: 'Business Search',
        desc: 'Enterprise registries, SEC filings, and capital expenditure forecasts indexed at wire speed. Structured for financial models and market intelligence.',
        theme: 'business',
        query: 'Semiconductor supply chain CAPEX forecasts 2026',
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg>`,
        watermarkSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg>`,
        badgeText: 'Top Business',
        stats: { num1: 8, label1: 'filings', num2: 12, label2: 'reports' },
        bullets: [
          '• Real-time SEC filings & earnings disclosures.',
          '• Supply chain capex & capacity utilization shifts.',
          '• Comprehensive corporate registry intelligence.'
        ],
        subjects: [
          {
            name: 'TSMC & Samsung revise 2nm equipment procurement timelines ahead of schedule',
            summary: 'Leading foundry operators have accelerated 2nm fab equipment installations in response to unprecedented hyperscaler AI accelerator allocations, committing over $62B in combined near-term capex.',
            timeStart: '2026-09-11T00:00:00Z',
            timeLatest: '2026-09-20T21:40:00Z',
            cover: '/images/vertical/subject-1.png',
            fallbackCover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
            articles: [
              {
                title: 'Global foundry utilization rates surge to 94% amid AI accelerator demand boom',
                timePublished: '2026-09-20T06:15:20Z',
                url: 'https://www.wsj.com/business/semiconductor-foundry-capacity-surge'
              },
              {
                title: 'TSMC, Samsung revise 2nm fab equipment procurement timelines forward by two quarters',
                timePublished: '2026-09-20T08:42:11Z',
                url: 'https://www.ft.com/content/tsmc-samsung-advance-2nm-procurement'
              },
              {
                title: 'ASML raises 2026 High-NA EUV lithography tool shipment guidance to record highs',
                timePublished: '2026-09-20T11:30:45Z',
                url: 'https://www.reuters.com/technology/asml-raises-high-na-euv-shipment-guidance-2026/'
              },
              {
                title: 'Enterprise memory makers announce $18B combined greenfield packaging CAPEX expansions',
                timePublished: '2026-09-20T14:05:18Z',
                url: 'https://www.bloomberg.com/news/articles/memory-makers-announce-18b-packaging-capex'
              },
              {
                title: 'Semiconductor CAPEX expected to top $215B in 2026 as hyperscaler silicon demand outpaces supply',
                timePublished: '2026-09-20T17:10:00Z',
                url: 'https://www.bloomberg.com/news/articles/semiconductor-capex-tops-215b-2026'
              }
            ]
          },
          {
            name: 'NVIDIA & AMD lock in advanced CoWoS packaging capacity through 2027',
            summary: 'Multi-year capacity reservations for advanced silicon interposers and high-bandwidth memory (HBM4) integration have reached historic contract values across Asian manufacturing hubs.',
            timeStart: '2026-09-12T00:00:00Z',
            timeLatest: '2026-09-18T18:30:00Z',
            cover: '/images/vertical/subject-2.png',
            fallbackCover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
            articles: [
              {
                title: 'Hyperscalers sign multi-billion dollar long-term supply agreements for custom silicon',
                timePublished: '2026-09-18T07:22:00Z',
                url: 'https://www.wsj.com/tech/custom-silicon-supply-agreements'
              },
              {
                title: 'Next-gen HBM4 memory packaging yields improve significantly across test batches',
                timePublished: '2026-09-18T09:40:00Z',
                url: 'https://www.eetimes.com/hbm4-packaging-yields'
              },
              {
                title: 'Substrate manufacturers report full order books extending well into fiscal 2027',
                timePublished: '2026-09-18T12:15:00Z',
                url: 'https://www.digitimes.com/news/substrate-capacity-2027'
              }
            ]
          },
          {
            name: 'Regulatory approvals cleared for European semiconductor mega-fab clusters',
            summary: 'European authorities finalize state aid authorizations under the Chips Act framework, unlocking €38B in co-investment for leading-edge automotive and industrial semiconductor fabrication.',
            timeStart: '2026-09-08T00:00:00Z',
            timeLatest: '2026-09-16T15:20:00Z',
            cover: '/images/vertical/subject-3.png',
            fallbackCover: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
            articles: [
              {
                title: 'EU Commission gives final green light to Dresden silicon cluster financing',
                timePublished: '2026-09-16T08:10:00Z',
                url: 'https://www.reuters.com/technology/eu-greenlights-dresden-chip-fab/'
              },
              {
                title: 'Automotive OEMs secure direct silicon equity stakes to guarantee microcontroller supply',
                timePublished: '2026-09-16T11:45:00Z',
                url: 'https://www.ft.com/automotive-silicon-equity-stakes'
              }
            ]
          },
          {
            name: 'Power utility grid connections become primary bottleneck for AI datacenter expansion',
            summary: 'Regional transmission operators warn of multi-year interconnection queues for multi-hundred megawatt campus facilities, driving demand for co-located nuclear and renewable microgrids.',
            timeStart: '2026-09-05T00:00:00Z',
            timeLatest: '2026-09-14T20:10:00Z',
            cover: '/images/vertical/subject-4.png',
            fallbackCover: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
            articles: [
              {
                title: 'Utilities demand dedicated power purchase agreements before approving datacenter substations',
                timePublished: '2026-09-14T09:30:00Z',
                url: 'https://www.bloomberg.com/news/datacenter-grid-bottlenecks'
              },
              {
                title: 'Tech giants explore private nuclear reactor partnerships to power next-gen clusters',
                timePublished: '2026-09-14T14:15:00Z',
                url: 'https://www.wsj.com/articles/tech-nuclear-power-datacenters'
              }
            ]
          }
        ]
      }
    };

    let currentVerticalKey = 'news';
    function getCurrentData() {
      return VERTICALS[currentVerticalKey] || VERTICALS.news;
    }

    // Preload cover images in background across all verticals
    Object.values(VERTICALS).forEach(v => {
      v.subjects.forEach(s => {
        if (s.cover) {
          const img = new Image();
          img.src = s.cover;
        }
      });
    });

    // Date & string formatting helpers
    const formatDate = d => d.slice(0, 10).replace(/-/g, '/');
    const formatDateTime = d => `${d.slice(0, 10)} ${d.slice(11, 19)}`;
    const formatTimeOnly = d => {
      if (!d) return '';
      if (d.includes('T')) return d.split('T')[1].slice(0, 8);
      return d;
    };
    const extractDomain = url => {
      try {
        return new URL(url).hostname.replace(/^www\./, '');
      } catch (e) {
        return '';
      }
    };

    // ==========================================
    // 2. DOM ELEMENTS
    // ==========================================
    const canvasRightPanel = document.getElementById('canvasRightPanel');
    const queryTextSpan = document.getElementById('queryTextSpan');
    const statSubjectsEl = document.getElementById('statSubjects');
    const statArticlesEl = document.getElementById('statArticles');
    const waveDotsTrack = document.getElementById('waveDotsTrack');
    const cardListContainer = document.getElementById('cardListContainer');
    const resultsViewport = document.getElementById('resultsViewport');
    const morphCardsOverlay = document.getElementById('morphCardsOverlay');
    const subjectsHBar = document.getElementById('subjectsHBar');
    const eventsWhiteCard = document.getElementById('eventsWhiteCard');
    const stageFocusContainer = document.getElementById('stageFocusContainer');
    const replayBtn = document.getElementById('replayBtn');
    const searchBoxWrapper = document.getElementById('searchBoxWrapper');
    const summaryBox = document.getElementById('summaryBox');

    // Setup 14 Wave Dots with sine delays
    if (waveDotsTrack && waveDotsTrack.children.length === 0) {
      for (let i = 0; i < 14; i++) {
        const dot = document.createElement('span');
        dot.className = 'wave-dot';
        dot.style.animationDelay = `${(i / 14) * 1.4}s`;
        waveDotsTrack.appendChild(dot);
      }
    }

    // ==========================================
    // 3. RENDER CARD TEMPLATES
    // ==========================================
    function createSubjectCardHTML(subject, index, isFirst = false) {
      return `
        <div class="subject-card-wrapper" data-subject-card="true" ${isFirst ? 'data-first-subject="true"' : 'data-other-subject="true"'} style="position: relative;">
          <article class="subject-card-box">
            <div class="subject-card-top">
              <span class="subject-date-range">${formatDate(subject.timeStart)} – ${formatDate(subject.timeLatest)}</span>
              <span class="subject-badge">Subject${index + 1}</span>
            </div>
            <div class="subject-card-body">
              <div class="subject-text-content">
                <h3 class="subject-name">${subject.name}</h3>
                <p class="subject-summary">${subject.summary}</p>
              </div>
            </div>
          </article>
        </div>
      `;
    }

    function updateTopNewsCard(subjectIdx = 0) {
      const curData = getCurrentData();
      const subj = curData.subjects[subjectIdx];
      if (!subj) return;
      const topTitle = document.getElementById('topNewsTitle');
      const topDesc = document.getElementById('topNewsDesc');
      const topThumb = document.getElementById('topNewsThumb');
      const topTime = document.getElementById('topNewsTime');
      const topSource = document.getElementById('topNewsSource');
      const topTag = document.querySelector('.top-news-tag');

      if (topTag && curData.badgeText) {
        topTag.textContent = curData.badgeText;
      }
      if (topTitle) topTitle.textContent = subj.name;
      if (topDesc) topDesc.textContent = subj.summary;
      if (topThumb && subj.cover) {
        topThumb.src = subj.cover;
        if (subj.fallbackCover) {
          topThumb.onerror = () => { topThumb.src = subj.fallbackCover; };
        }
      }
      if (topTime && subj.timeLatest) {
        topTime.textContent = formatDateTime(subj.timeLatest).replace(/-/g, '/');
      }
      if (topSource && subj.articles && subj.articles[0]) {
        topSource.textContent = extractDomain(subj.articles[0].url) || 'reuters.com';
      }
    }

    function renderTimelineStream(subjectIdx = 0, makeVisible = false) {
      const spineTrack = document.getElementById('timelineSpineTrack');
      const articlesGroup = document.getElementById('timelineArticlesSubgroup');
      if (!spineTrack || !articlesGroup) return;

      const curData = getCurrentData();
      const subject = curData.subjects[subjectIdx] || curData.subjects[0];
      // Chronological order: earlier timestamps on top, later at the bottom
      const articles = (subject.articles || []).slice().sort((a, b) => new Date(a.timePublished) - new Date(b.timePublished));

      // Stem height connects Dot 0 (center 30px) to Dot (N - 1) (center 30 + (N - 1) * 68px)
      const stemHeight = articles.length > 1 ? (articles.length - 1) * 68 : 0;
      let spineHTML = `<div class="timeline-spine-stem" id="timelineSpineStem" style="height: ${stemHeight}px; transform: scaleY(${makeVisible ? 1 : 0});"></div>`;

      articles.forEach((art, i) => {
        const dotTop = i * 68 + 24;
        spineHTML += `<div class="timeline-dot-node ${makeVisible ? 'visible' : ''}" data-dot-idx="${i}" style="top: ${dotTop}px;"></div>`;
      });
      spineTrack.innerHTML = spineHTML;

      let articlesHTML = '';
      articles.forEach((art, i) => {
        const domain = extractDomain(art.url);
        const timeStr = formatTimeOnly(art.timePublished);
        articlesHTML += `
          <div class="timeline-sub-article ${makeVisible ? 'visible' : ''}" data-article-idx="${i}">
            <div class="sub-article-meta">
              <span class="sub-article-time">${timeStr}</span>
              <span class="sub-article-domain">${domain}</span>
            </div>
            <p class="sub-article-title" title="${art.title.replace(/"/g, '&quot;')}">${art.title}</p>
          </div>
        `;
      });
      articlesGroup.innerHTML = articlesHTML;
    }

    // ==========================================
    // 4. ANIMATION ENGINE & STATE MANAGEMENT
    // ==========================================
    let isUserHovered = false;
    let currentSequenceId = 0;
    let currentActiveStep = 'typing';
    let activeAnimations = [];
    let timelineScrollCleanup = null;

    function setCanvasState(state) {
      currentActiveStep = state;
      cardCanvas.classList.remove('is-typing', 'is-searching', 'has-results', 'not-typing', 'is-stage4', 'is-stage5');

      if (replayBtn && state !== 'timeline') {
        replayBtn.classList.remove('visible');
      }

      if (timelineScrollCleanup) {
        timelineScrollCleanup();
        timelineScrollCleanup = null;
      }
      const streamBlock = document.getElementById('timelineStreamBlock');
      if (streamBlock && state !== 'timeline') {
        streamBlock.scrollTop = 0;
        streamBlock.classList.remove('is-animating');
        streamBlock.style.overflowY = '';
      }

      if (morphCardsOverlay) morphCardsOverlay.innerHTML = '';
      if (subjectsHBar) subjectsHBar.style.opacity = '';
      if (eventsWhiteCard) {
        eventsWhiteCard.style.opacity = '';
        eventsWhiteCard.style.transform = '';
      }
      if (stageFocusContainer) {
        stageFocusContainer.style.opacity = '';
        stageFocusContainer.style.pointerEvents = '';
      }

      const allCards = cardListContainer ? cardListContainer.querySelectorAll('.subject-card-box') : [];
      allCards.forEach(c => { c.style.opacity = ''; c.style.transform = ''; c.style.visibility = ''; });
      const allBadges = cardListContainer ? cardListContainer.querySelectorAll('.subject-badge') : [];
      allBadges.forEach(b => { b.style.visibility = ''; });

      if (state === 'typing') {
        cardCanvas.classList.add('is-typing');
        if (searchBoxWrapper) {
          searchBoxWrapper.style.display = 'block';
          searchBoxWrapper.style.opacity = '1';
          searchBoxWrapper.style.transform = 'none';
        }
        if (summaryBox) {
          summaryBox.style.display = 'none';
        }
      } else if (state === 'searching') {
        cardCanvas.classList.add('not-typing', 'is-searching');
        if (searchBoxWrapper) {
          searchBoxWrapper.style.display = 'block';
          searchBoxWrapper.style.opacity = '1';
          searchBoxWrapper.style.transform = 'none';
        }
        if (summaryBox) {
          summaryBox.style.display = 'none';
        }
      } else if (state === 'overview') {
        cardCanvas.classList.add('not-typing', 'has-results');
        if (searchBoxWrapper) {
          searchBoxWrapper.style.display = 'none';
        }
        if (summaryBox) {
          summaryBox.style.display = 'flex';
          summaryBox.style.opacity = '1';
          summaryBox.style.transform = 'none';
        }
      } else if (state === 'focus') {
        cardCanvas.classList.add('not-typing', 'has-results', 'is-stage4');
        if (searchBoxWrapper) {
          searchBoxWrapper.style.display = 'none';
        }
        if (summaryBox) {
          summaryBox.style.display = 'flex';
          summaryBox.style.opacity = '1';
          summaryBox.style.transform = 'none';
        }
      } else if (state === 'timeline') {
        cardCanvas.classList.add('not-typing', 'has-results', 'is-stage4', 'is-stage5');
        if (searchBoxWrapper) {
          searchBoxWrapper.style.display = 'none';
        }
        if (summaryBox) {
          summaryBox.style.display = 'flex';
          summaryBox.style.opacity = '1';
          summaryBox.style.transform = 'none';
        }
      }
    }

    // Metamorphic Card-to-Pill Transition (Stage 3 Overview -> Stage 4 Top News)
    async function transitionOverviewToFocus(isValid, currentSeq) {
      if (!canvasRightPanel || !cardListContainer) return;
      const panelRect = canvasRightPanel.getBoundingClientRect();
      const subjectWrappers = cardListContainer.querySelectorAll('.subject-card-wrapper');
      const targetPills = subjectsHBar ? subjectsHBar.querySelectorAll('.subject-h-pill') : [];

      if (!subjectWrappers.length || !targetPills.length || !morphCardsOverlay) {
        setCanvasState('focus');
        return;
      }

      // 1. Position target tabs to get destination bounds
      stageFocusContainer.style.opacity = '1';
      stageFocusContainer.style.pointerEvents = 'auto';
      subjectsHBar.style.opacity = '0';
      eventsWhiteCard.style.opacity = '0';
      eventsWhiteCard.style.transform = 'translateY(36px) scale(0.97)';

      const targetRects = Array.from(targetPills).map(pill => {
        const r = pill.getBoundingClientRect();
        return {
          left: Math.round(r.left - panelRect.left),
          top: Math.round(r.top - panelRect.top),
          width: Math.round(r.width),
          height: Math.round(r.height)
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
          left: targetRects[idx].left,
          top: targetRects[idx].top + 80,
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
        const t = targetRects[i];

        const card = document.createElement('div');
        card.className = 'morph-proxy-card';
        card.style.cssText = `
          left: ${s.left}px;
          top: ${s.top}px;
          width: ${s.width}px;
          height: ${s.height}px;
          background-color: #FFFFFF;
          border: 8px solid rgba(255, 255, 255, 0.4);
          border-radius: 24px;
          box-shadow: 0 8px 24px rgba(31, 72, 28, 0.08);
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
            <div class="morph-proxy-pill-tag">Subject${i + 1}</div>
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
        activeAnimations.push(viewAnim);

        // Pill label tag
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
        activeAnimations.push(tagAnim);

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
            borderColor: 'rgba(255, 255, 255, 0.5)',
            borderWidth: '8px',
            borderRadius: '24px',
            boxShadow: '0 8px 24px rgba(31, 72, 28, 0.08)'
          },
          {
            offset: 0.32,
            backgroundColor: '#FFFFFF',
            borderColor: 'rgba(255, 255, 255, 0.4)',
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
        activeAnimations.push(cardAnim);
      });

      // 6. Top News white card slides up
      setTimeout(() => {
        if (isValid && !isValid()) return;
        eventsWhiteCard.style.opacity = '1';
        eventsWhiteCard.style.transform = 'translateY(0) scale(1)';
        const cardEnterAnim = eventsWhiteCard.animate([
          { opacity: 0, transform: 'translateY(36px) scale(0.97)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' }
        ], {
          duration: 480,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'forwards'
        });
        activeAnimations.push(cardEnterAnim);
      }, 190);

      await sleep(morphDuration + 4 * 20 + 20);
      if (isValid && !isValid()) return;

      // 7. Flawless zero-flicker handover to native Stage 4 layout
      currentActiveStep = 'focus';
      cardCanvas.classList.remove('is-typing', 'is-searching', 'is-stage5');
      cardCanvas.classList.add('not-typing', 'has-results', 'is-stage4');

      stageFocusContainer.style.opacity = '1';
      stageFocusContainer.style.pointerEvents = 'auto';
      subjectsHBar.style.opacity = '1';
      eventsWhiteCard.style.opacity = '1';
      eventsWhiteCard.style.transform = 'none';

      const pills = document.querySelectorAll('.subject-h-pill');
      pills.forEach((p, idx) => p.classList.toggle('active', idx === 0));
      updateTopNewsCard(0);
      renderTimelineStream(0, false);

      void subjectsHBar.offsetWidth;
      morphCardsOverlay.innerHTML = '';

      sourceCards.forEach(wrap => {
        const box = wrap.querySelector('.subject-card-box') || wrap;
        box.style.visibility = '';
      });
    }

    // FLIP Layout Transition from typing to searching
    function transitionToSearching() {
      const headingRow = document.querySelector('.canvas-heading-row');
      if (!headingRow || !searchBoxWrapper) {
        setCanvasState('searching');
        return;
      }

      const firstHeadingRect = headingRow.getBoundingClientRect();
      const firstSearchRect = searchBoxWrapper.getBoundingClientRect();

      cardCanvas.classList.remove('is-typing', 'has-results');
      cardCanvas.classList.add('not-typing', 'is-searching');

      searchBoxWrapper.style.display = 'block';
      searchBoxWrapper.style.opacity = '1';
      searchBoxWrapper.style.transform = 'none';

      const lastHeadingRect = headingRow.getBoundingClientRect();
      const lastSearchRect = searchBoxWrapper.getBoundingClientRect();

      const dxHeading = firstHeadingRect.left - lastHeadingRect.left;
      const dyHeading = firstHeadingRect.top - lastHeadingRect.top;

      const dxSearch = firstSearchRect.left - lastSearchRect.left;
      const dySearch = firstSearchRect.top - lastSearchRect.top;

      const duration = 600;
      const easeCurve = 'cubic-bezier(0.4, 0, 0.2, 1)';

      const headingAnim = headingRow.animate([
        { transform: `translate(${dxHeading}px, ${dyHeading}px)` },
        { transform: 'translate(0, 0)' }
      ], {
        duration,
        easing: easeCurve,
        fill: 'none'
      });
      activeAnimations.push(headingAnim);

      const searchAnim = searchBoxWrapper.animate([
        {
          transform: `translate(${dxSearch}px, ${dySearch}px)`,
          width: `${firstSearchRect.width}px`
        },
        {
          transform: 'translate(0, 0)',
          width: `${lastSearchRect.width}px`
        }
      ], {
        duration,
        easing: easeCurve,
        fill: 'none'
      });
      activeAnimations.push(searchAnim);
    }

    // FLIP Layout Transition from searching to overview
    function transitionToOverview() {
      const headingRow = document.querySelector('.canvas-heading-row');
      if (!headingRow) {
        setCanvasState('overview');
        return;
      }

      const firstHeadingRect = headingRow.getBoundingClientRect();

      if (searchBoxWrapper && searchBoxWrapper.style.display !== 'none') {
        const searchExitAnim = searchBoxWrapper.animate([
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-10px)' }
        ], {
          duration: 280,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards'
        });
        activeAnimations.push(searchExitAnim);
      }

      setCanvasState('overview');
      if (searchBoxWrapper) searchBoxWrapper.style.display = 'none';
      if (summaryBox) {
        summaryBox.style.display = 'flex';
        summaryBox.style.opacity = '1';
        summaryBox.style.transform = 'none';
      }

      const lastHeadingRect = headingRow.getBoundingClientRect();

      const dxHeading = firstHeadingRect.left - lastHeadingRect.left;
      const dyHeading = firstHeadingRect.top - lastHeadingRect.top;

      const duration = 520;
      const easeCurve = 'cubic-bezier(0.4, 0, 0.2, 1)';

      if (Math.abs(dxHeading) > 0.5 || Math.abs(dyHeading) > 0.5) {
        const headingAnim = headingRow.animate([
          { transform: `translate(${dxHeading}px, ${dyHeading}px)` },
          { transform: 'translate(0, 0)' }
        ], {
          duration,
          easing: easeCurve,
          fill: 'none'
        });
        activeAnimations.push(headingAnim);
      }

      if (summaryBox) {
        const summaryAnim = summaryBox.animate([
          { opacity: 0, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], {
          duration: 480,
          delay: 40,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'forwards'
        });
        activeAnimations.push(summaryAnim);
      }
    }

    function sleep(ms) {
      return new Promise(resolve => {
        const startId = currentSequenceId;
        const start = Date.now();
        function check() {
          if (currentSequenceId !== startId) return; // aborted
          if (isUserHovered) {
            setTimeout(check, 100);
            return;
          }
          if (Date.now() - start >= ms) {
            resolve();
          } else {
            setTimeout(check, 25);
          }
        }
        setTimeout(check, ms);
      });
    }

    function animateNumber(element, start, end, duration = 1800) {
      if (!element) return;
      const startTime = performance.now();
      function frame(now) {
        const progress = Math.min(1, (now - startTime) / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(start + (end - start) * ease);
        if (progress < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    // Hover pause / resume
    if (resultsViewport) {
      resultsViewport.addEventListener('mouseenter', () => {
        isUserHovered = true;
        activeAnimations.forEach(a => {
          try { if (a.playState === 'running') a.pause(); } catch (e) {}
        });
      });
      resultsViewport.addEventListener('mouseleave', () => {
        isUserHovered = false;
        activeAnimations.forEach(a => {
          try { if (a.playState === 'paused') a.play(); } catch (e) {}
        });
      });
    }

    if (eventsWhiteCard) {
      eventsWhiteCard.addEventListener('mouseenter', () => { isUserHovered = true; });
      eventsWhiteCard.addEventListener('mouseleave', () => { isUserHovered = false; });
    }

    // Smooth scroll with easeOutQuart curve (cubic-bezier(0.25, 1, 0.5, 1))
    function smoothScrollTo(element, targetTop, duration = 650, isValid = () => true) {
      return new Promise(resolve => {
        if (!element) return resolve();
        const startTop = element.scrollTop;
        const distance = targetTop - startTop;
        if (Math.abs(distance) < 0.5) {
          element.scrollTop = targetTop;
          return resolve();
        }

        let startTime = null;
        let pausedDuration = 0;
        let isCurrentlyPaused = false;
        let pauseStartTime = null;

        const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

        function step(currentTime) {
          if (!isValid()) return resolve();

          if (isUserHovered) {
            if (!isCurrentlyPaused) {
              isCurrentlyPaused = true;
              pauseStartTime = currentTime;
            }
            requestAnimationFrame(step);
            return;
          } else if (isCurrentlyPaused) {
            isCurrentlyPaused = false;
            if (pauseStartTime !== null) {
              pausedDuration += (currentTime - pauseStartTime);
              pauseStartTime = null;
            }
          }

          if (startTime === null) startTime = currentTime;
          const elapsed = currentTime - startTime - pausedDuration;
          const progress = Math.min(Math.max(elapsed / duration, 0), 1);
          const easedProgress = easeOutQuart(progress);

          element.scrollTop = Math.round(startTop + distance * easedProgress);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            element.scrollTop = targetTop;
            resolve();
          }
        }

        requestAnimationFrame(step);
      });
    }

    // Stage 5 Sequential Timeline Unfold
    async function playStage5TimelineAnimation(isValid = () => true) {
      const streamBlock = document.getElementById('timelineStreamBlock');
      const activePill = document.querySelector('.subject-h-pill.active');
      const activeIdx = activePill ? parseInt(activePill.dataset.subjectIdx, 10) : 0;

      if (timelineScrollCleanup) {
        timelineScrollCleanup();
        timelineScrollCleanup = null;
      }

      if (!streamBlock) return;

      renderTimelineStream(activeIdx, false);
      streamBlock.scrollTop = 0;

      streamBlock.classList.add('is-animating');
      streamBlock.style.overflowY = 'hidden';

      const blockScroll = (e) => { e.preventDefault(); };
      streamBlock.addEventListener('wheel', blockScroll, { passive: false });
      streamBlock.addEventListener('touchmove', blockScroll, { passive: false });

      timelineScrollCleanup = () => {
        streamBlock.removeEventListener('wheel', blockScroll);
        streamBlock.removeEventListener('touchmove', blockScroll);
        streamBlock.classList.remove('is-animating');
        streamBlock.style.overflowY = 'auto';
        streamBlock.style.pointerEvents = 'auto';
      };

      const stem = document.getElementById('timelineSpineStem');
      const dots = document.querySelectorAll('.timeline-dot-node');
      const subArticles = document.querySelectorAll('.timeline-sub-article');
      const total = subArticles.length;

      if (stem) stem.style.transform = 'scaleY(0)';

      for (let i = 0; i < total; i++) {
        if (stem && total > 1) {
          const stemProgress = i === 0 ? 0 : (i / (total - 1));
          stem.style.transform = `scaleY(${stemProgress})`;
        }

        if (i > 0) {
          await sleep(120);
          if (!isValid()) {
            if (timelineScrollCleanup) timelineScrollCleanup();
            timelineScrollCleanup = null;
            return;
          }
        }

        if (dots[i]) dots[i].classList.add('visible');
        if (subArticles[i]) subArticles[i].classList.add('visible');

        if (i < 3) {
          // Cards 1, 2, 3: strictly guaranteed no scroll (scrollTop = 0)
          if (streamBlock) streamBlock.scrollTop = 0;
          await sleep(i === 0 ? 800 : 680);
        } else if (streamBlock && subArticles[i]) {
          // Card 4 and onwards: smooth auto-scroll to reveal new card at bottom
          const containerHeight = streamBlock.clientHeight;
          const containerRect = streamBlock.getBoundingClientRect();
          const cardRect = subArticles[i].getBoundingClientRect();
          const cardBottomFromContentTop = (cardRect.bottom - containerRect.top) + streamBlock.scrollTop;
          const bottomSafety = 6;
          const maxScroll = Math.max(0, streamBlock.scrollHeight - containerHeight);

          const targetScroll = Math.max(streamBlock.scrollTop, cardBottomFromContentTop + bottomSafety - containerHeight);
          const boundedTarget = Math.min(maxScroll, targetScroll);

          if (boundedTarget > streamBlock.scrollTop) {
            const scrollDuration = 520;
            await smoothScrollTo(streamBlock, boundedTarget, scrollDuration, isValid);
            if (!isValid()) {
              if (timelineScrollCleanup) timelineScrollCleanup();
              timelineScrollCleanup = null;
              return;
            }
            await sleep(160);
          } else {
            await sleep(680);
          }
        } else {
          await sleep(680);
        }

        if (!isValid()) {
          if (timelineScrollCleanup) timelineScrollCleanup();
          timelineScrollCleanup = null;
          return;
        }
      }

      await sleep(350);
      if (!isValid()) {
        if (timelineScrollCleanup) timelineScrollCleanup();
        timelineScrollCleanup = null;
        return;
      }

      if (timelineScrollCleanup) {
        timelineScrollCleanup();
        timelineScrollCleanup = null;
      }
    }

    // ==========================================
    // 5. THE 5-STAGE SEQUENCE
    // ==========================================
    async function runCycle(fromStep = 'typing') {
      currentSequenceId++;
      const seq = currentSequenceId;
      const isValid = () => seq === currentSequenceId;

      const curData = getCurrentData();
      const currentQuery = curData.query;
      const currentSubjects = curData.subjects;
      const currentTotalSubjects = curData.stats.num1;
      const currentTotalArticles = curData.stats.num2;

      activeAnimations.forEach(a => { try { a.cancel(); } catch (e) {} });
      activeAnimations = [];
      if (replayBtn) replayBtn.classList.remove('visible');

      const stepOrder = ['typing', 'searching', 'overview', 'focus', 'timeline'];
      let startIndex = stepOrder.indexOf(fromStep);
      if (startIndex < 0) startIndex = 0;

      // --------------------------------------------------
      // STAGE 1: TYPING
      // --------------------------------------------------
      if (startIndex <= 0) {
        if (searchBoxWrapper) {
          searchBoxWrapper.style.display = 'block';
          searchBoxWrapper.style.opacity = '1';
          searchBoxWrapper.style.transform = 'none';
        }
        if (summaryBox) {
          summaryBox.style.opacity = '1';
          summaryBox.style.transform = 'none';
        }

        setCanvasState('typing');
        if (queryTextSpan) queryTextSpan.textContent = '';
        if (cardListContainer) cardListContainer.style.transform = 'none';
        await sleep(500);
        if (!isValid()) return;

        for (let i = 1; i <= currentQuery.length; i++) {
          if (queryTextSpan) queryTextSpan.textContent = currentQuery.slice(0, i);
          await sleep(32);
          if (!isValid()) return;
        }
        await sleep(700);
        if (!isValid()) return;
      }

      // --------------------------------------------------
      // STAGE 2: SEARCHING (Smooth Gliding Transition)
      // --------------------------------------------------
      if (startIndex <= 1) {
        if (queryTextSpan) queryTextSpan.textContent = currentQuery;
        if (startIndex === 1 && !cardCanvas.classList.contains('is-typing')) {
          setCanvasState('searching');
        } else {
          transitionToSearching();
        }
        await sleep(1100);
        if (!isValid()) return;
      }

      // --------------------------------------------------
      // STAGE 3: RESULTS OVERVIEW
      // --------------------------------------------------
      if (startIndex <= 2) {
        if (queryTextSpan) queryTextSpan.textContent = currentQuery;

        if (startIndex === 2 && !cardCanvas.classList.contains('is-searching')) {
          setCanvasState('overview');
        } else {
          transitionToOverview();
        }

        animateNumber(statSubjectsEl, 0, currentTotalSubjects, 1400);
        animateNumber(statArticlesEl, 0, currentTotalArticles, 1400);

        if (cardListContainer && resultsViewport) {
          const tempFirstWrap = document.createElement('div');
          tempFirstWrap.innerHTML = createSubjectCardHTML(currentSubjects[0], 0, true);
          const firstCard = tempFirstWrap.firstElementChild;
          firstCard.style.opacity = '0';
          firstCard.style.transform = 'translateY(24px) scale(0.97)';
          cardListContainer.innerHTML = '';
          cardListContainer.appendChild(firstCard);

          const viewportH = resultsViewport.clientHeight;
          const firstCardH = firstCard.offsetHeight || 96;
          const firstCardTop = firstCard.offsetTop;

          let currentTranslateY = Math.round((viewportH - firstCardH) / 2 - firstCardTop);
          cardListContainer.style.transform = `translateY(${currentTranslateY}px)`;

          await sleep(100);
          if (!isValid()) return;

          const firstAnim = firstCard.animate([
            { opacity: 0, transform: 'translateY(24px) scale(0.97)', filter: 'blur(4px)' },
            { opacity: 0.65, offset: 0.45, filter: 'blur(1px)' },
            { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0px)' }
          ], {
            duration: 420,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'forwards'
          });
          activeAnimations.push(firstAnim);

          await sleep(420);
          if (!isValid()) return;

          firstCard.style.opacity = '1';
          firstCard.style.transform = 'none';

          await sleep(380);
          if (!isValid()) return;

          for (let i = 1; i < currentSubjects.length; i++) {
            const tempWrap = document.createElement('div');
            tempWrap.innerHTML = createSubjectCardHTML(currentSubjects[i], i, false);
            const nextCard = tempWrap.firstElementChild;
            nextCard.style.opacity = '0';
            nextCard.style.transform = 'translateY(28px) scale(0.97)';
            cardListContainer.appendChild(nextCard);

            const vH = resultsViewport.clientHeight;
            const cardTopBase = firstCard.offsetTop;
            const nextCardBottom = nextCard.offsetTop + nextCard.offsetHeight;
            const clusterH = nextCardBottom - cardTopBase;
            const bottomSafetyMargin = 20;

            let targetTranslateY;
            if (clusterH + bottomSafetyMargin <= vH) {
              targetTranslateY = Math.round((vH - clusterH) / 2 - cardTopBase);
            } else {
              targetTranslateY = Math.round(vH - nextCardBottom - bottomSafetyMargin);
            }

            const stepDuration = 420;
            const carouselPushEase = 'cubic-bezier(0.25, 1, 0.5, 1)';
            const cardEntranceEase = 'cubic-bezier(0.16, 1, 0.3, 1)';

            const shiftAnim = cardListContainer.animate([
              { transform: `translateY(${currentTranslateY}px)` },
              { transform: `translateY(${targetTranslateY}px)` }
            ], {
              duration: stepDuration,
              easing: carouselPushEase,
              fill: 'forwards'
            });
            activeAnimations.push(shiftAnim);

            const cardEnterAnim = nextCard.animate([
              { opacity: 0, transform: 'translateY(28px) scale(0.97)', filter: 'blur(4px)' },
              { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0px)' }
            ], {
              duration: stepDuration,
              easing: cardEntranceEase,
              fill: 'forwards'
            });
            activeAnimations.push(cardEnterAnim);

            currentTranslateY = targetTranslateY;
            cardListContainer.style.transform = `translateY(${currentTranslateY}px)`;

            await sleep(stepDuration);
            if (!isValid()) return;

            nextCard.style.opacity = '1';
            nextCard.style.transform = 'none';

            if (i < currentSubjects.length - 1) {
              await sleep(380);
              if (!isValid()) return;
            }
          }

          await sleep(380);
          if (!isValid()) return;
        }
      }

      // --------------------------------------------------
      // STAGE 4: TOP NEWS & HORIZONTAL SUBJECT TABS
      // --------------------------------------------------
      if (startIndex <= 3) {
        if (queryTextSpan) queryTextSpan.textContent = currentQuery;
        if (statSubjectsEl) statSubjectsEl.textContent = currentTotalSubjects;
        if (statArticlesEl) statArticlesEl.textContent = currentTotalArticles;

        if (startIndex === 3 && !cardCanvas.classList.contains('has-results')) {
          setCanvasState('focus');
        } else {
          await transitionOverviewToFocus(isValid, seq);
          if (!isValid()) return;
        }

        const activePill = document.querySelector('.subject-h-pill.active');
        const activeIdx = activePill ? parseInt(activePill.dataset.subjectIdx, 10) : 0;
        updateTopNewsCard(activeIdx);
        renderTimelineStream(activeIdx, false);

        await sleep(750);
        if (!isValid()) return;
      }

      // --------------------------------------------------
      // STAGE 5: TIMELINE STREAM UNFOLD UNDER TOP NEWS
      // --------------------------------------------------
      if (queryTextSpan) queryTextSpan.textContent = currentQuery;
      if (statSubjectsEl) statSubjectsEl.textContent = currentTotalSubjects;
      if (statArticlesEl) statArticlesEl.textContent = currentTotalArticles;

      setCanvasState('timeline');

      const activePill = document.querySelector('.subject-h-pill.active');
      const activeIdx = activePill ? parseInt(activePill.dataset.subjectIdx, 10) : 0;
      updateTopNewsCard(activeIdx);

      await playStage5TimelineAnimation(isValid);
      if (!isValid()) return;

      // Animation complete: reveal replay button in bottom-left corner
      if (replayBtn) replayBtn.classList.add('visible');
    }

    // ==========================================
    // 6. INTERACTIVE CONTROLS & LISTENERS
    // ==========================================
    // Dual Vertical Tabs Interactive Switching (News Search / Business Search)
    const tabNews = document.getElementById('tabNews');
    const tabBusiness = document.getElementById('tabBusiness');

    function switchVertical(key) {
      if (currentVerticalKey === key) return;
      currentVerticalKey = key;
      const curData = getCurrentData();

      // 1. Update Tabs active state & aria-selected
      if (tabNews) {
        tabNews.classList.toggle('active', key === 'news');
        tabNews.setAttribute('aria-selected', key === 'news' ? 'true' : 'false');
      }
      if (tabBusiness) {
        tabBusiness.classList.toggle('active', key === 'business');
        tabBusiness.setAttribute('aria-selected', key === 'business' ? 'true' : 'false');
      }

      // 2. Update Hero Section Heading & Description
      const heroHeading = document.getElementById('verticalSearchHeading');
      const heroDesc = document.getElementById('verticalSearchDesc');
      if (heroHeading) heroHeading.textContent = curData.heading;
      if (heroDesc) heroDesc.textContent = curData.desc;

      // 3. Update Canvas data-theme
      if (cardCanvas) {
        cardCanvas.setAttribute('data-theme', curData.theme);
      }

      // 4. Update Canvas watermark
      const canvasWatermark = document.getElementById('canvasWatermark');
      if (canvasWatermark && curData.watermarkSvg) {
        canvasWatermark.innerHTML = curData.watermarkSvg;
      }

      // 5. Update Canvas Left Panel Heading Title & Icon
      const canvasHeadingTitle = document.getElementById('canvasHeadingTitle');
      const canvasHeadingIcon = document.getElementById('canvasHeadingIcon');
      if (canvasHeadingTitle) canvasHeadingTitle.textContent = curData.title;
      if (canvasHeadingIcon && curData.iconSvg) {
        canvasHeadingIcon.innerHTML = curData.iconSvg;
      }

      // 6. Update Summary Box Stats & Bullets
      const statUnitSubjects = document.getElementById('statUnitSubjects');
      const statUnitArticles = document.getElementById('statUnitArticles');
      const summaryBulletsList = document.getElementById('summaryBulletsList');
      if (statUnitSubjects) statUnitSubjects.textContent = curData.stats.label1;
      if (statUnitArticles) statUnitArticles.textContent = curData.stats.label2;
      if (summaryBulletsList && curData.bullets) {
        summaryBulletsList.innerHTML = curData.bullets.map(b => `<li>${b}</li>`).join('');
      }

      // 7. Reset Horizontal Pills Active Index to 0
      const pills = document.querySelectorAll('.subject-h-pill');
      pills.forEach((p, idx) => p.classList.toggle('active', idx === 0));

      // 8. Update Top News Card & Timeline for Subject 0
      updateTopNewsCard(0);
      renderTimelineStream(0, false);

      // 9. Re-run animation cycle from typing
      if (replayBtn) replayBtn.classList.remove('visible');
      runCycle('typing');
    }

    if (tabNews) {
      tabNews.addEventListener('click', () => switchVertical('news'));
    }
    if (tabBusiness) {
      tabBusiness.addEventListener('click', () => switchVertical('business'));
    }

    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        replayBtn.classList.remove('visible');
        const pills = document.querySelectorAll('.subject-h-pill');
        pills.forEach((p, idx) => p.classList.toggle('active', idx === 0));
        runCycle('typing');
      });
    }

    // Horizontal Subject Pills Interactive Switching
    const subjectPills = document.querySelectorAll('.subject-h-pill');
    subjectPills.forEach(pill => {
      pill.addEventListener('click', () => {
        if (pill.classList.contains('active')) return;
        subjectPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const idx = parseInt(pill.dataset.subjectIdx, 10);
        updateTopNewsCard(idx);
        const isTimelineActive = cardCanvas.classList.contains('is-stage5');
        if (isTimelineActive) {
          currentSequenceId++;
          if (timelineScrollCleanup) {
            timelineScrollCleanup();
            timelineScrollCleanup = null;
          }
          const streamBlock = document.getElementById('timelineStreamBlock');
          if (streamBlock) {
            streamBlock.classList.remove('is-animating');
            streamBlock.style.overflowY = 'auto';
            streamBlock.style.pointerEvents = 'auto';
            streamBlock.scrollTop = 0;
          }
          renderTimelineStream(idx, true);
        } else {
          renderTimelineStream(idx, false);
        }
      });
    });

    // Initial setup for Top News and Timeline stream
    updateTopNewsCard(0);
    renderTimelineStream(0, false);

    // ==========================================
    // 7. VIEWPORT SCROLL TRIGGER (IntersectionObserver)
    // ==========================================
    let hasStartedAnimation = false;
    function startAnimationSequence() {
      if (hasStartedAnimation) return;
      hasStartedAnimation = true;
      runCycle();
    }

    const triggerTarget = cardCanvas || document.getElementById('vertical-search') || document.querySelector('.vertical-search-section');

    if (triggerTarget && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startAnimationSequence();
            obs.disconnect();
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
      });

      observer.observe(triggerTarget);
    } else {
      startAnimationSequence();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVerticalSearch);
  } else {
    initVerticalSearch();
  }
})();
