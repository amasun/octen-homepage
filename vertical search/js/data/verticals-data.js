/**
 * Verticals Data Configuration & Formatters
 * Extracted from Commit f13dc2b with 18px stroke watermark SVGs
 */
import { state } from '../state.js';

const VERTICALS = {
          news: {
            id: 'news',
            title: 'News Search',
            heading: 'Search built for vertical industries',
            desc: 'Deeply customized search engineered for vertical domains. Delivering real-time, high-precision, and in-depth intelligence structured for autonomous reasoning.',
            theme: 'news',
            query: 'Strait of Hormuz shipping disruptions',
            badgeText: 'Top News',
            summaryDesc: 'Search live news and read each story as a single grouped event.',
            stats: { num1: 4, label1: 'subjects', num2: 10, label2: 'articles' },
            bullets: [
              '• Search breaking news at wire speed within <span class="live-badge" title="Live wire speed" aria-label="Live breaking news"><span class="live-badge-dot"></span><span class="live-badge-text">live</span></span>&nbsp;<b><number-flow class="bullet-number-flow" data-flow="minutes" data-value="3">3</number-flow>&nbsp;minutes</b> of publication.',
              '• Cover <b><number-flow class="bullet-number-flow" data-flow="coverage" data-value="95">95</number-flow>%</b> of global tier-1 <span class="avatar-cycles" title="Global tier-1 news media sources" aria-label="Global tier-1 news media sources"><span class="avatar-cycles-track"><span class="avatar-cycle-item" title="Reuters"><svg viewBox="0 0 16 16" width="10" height="10" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#FF8000" stroke-width="1.8"/><path d="M6 5h2.5a1.8 1.8 0 0 1 0 3.6H6V5zm0 3.6h2.2l2.3 3.4" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"/></svg></span><span class="avatar-cycle-item" title="Bloomberg"><svg viewBox="0 0 16 16" width="10" height="10" fill="none"><path d="M4.5 3.5h4a2.5 2.5 0 0 1 2 4 2.5 2.5 0 0 1-2 4.5h-4V3.5z" stroke="#FFF" stroke-width="1.6" stroke-linejoin="round"/><line x1="4.5" y1="7.8" x2="8.8" y2="7.8" stroke="#FFF" stroke-width="1.5"/></svg></span><span class="avatar-cycle-item" title="Wall Street Journal"><span class="avatar-logo-wsj">WSJ</span></span><span class="avatar-cycle-item" title="BBC"><span class="avatar-logo-bbc">BBC</span></span><span class="avatar-cycle-item" title="Financial Times"><span class="avatar-logo-ft">FT</span></span><span class="avatar-cycle-item" title="Associated Press"><span class="avatar-logo-ap">AP</span></span><span class="avatar-cycle-item" title="Reuters" aria-hidden="true"><svg viewBox="0 0 16 16" width="10" height="10" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#FF8000" stroke-width="1.8"/><path d="M6 5h2.5a1.8 1.8 0 0 1 0 3.6H6V5zm0 3.6h2.2l2.3 3.4" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"/></svg></span><span class="avatar-cycle-item" title="Bloomberg" aria-hidden="true"><svg viewBox="0 0 16 16" width="10" height="10" fill="none"><path d="M4.5 3.5h4a2.5 2.5 0 0 1 2 4 2.5 2.5 0 0 1-2 4.5h-4V3.5z" stroke="#FFF" stroke-width="1.6" stroke-linejoin="round"/><line x1="4.5" y1="7.8" x2="8.8" y2="7.8" stroke="#FFF" stroke-width="1.5"/></svg></span><span class="avatar-cycle-item" title="Wall Street Journal" aria-hidden="true"><span class="avatar-logo-wsj">WSJ</span></span><span class="avatar-cycle-item" title="BBC" aria-hidden="true"><span class="avatar-logo-bbc">BBC</span></span><span class="avatar-cycle-item" title="Financial Times" aria-hidden="true"><span class="avatar-logo-ft">FT</span></span><span class="avatar-cycle-item" title="Associated Press" aria-hidden="true"><span class="avatar-logo-ap">AP</span></span></span></span>&nbsp;news media and wire&nbsp;services.',
              '• Deduplicate syndicated stories to save prompt <span class="token-meter" title="70% prompt token reduction" aria-label="70% prompt token reduction"><span class="token-meter-bar"></span><span class="token-meter-bar"></span><span class="token-meter-bar"></span><span class="token-meter-bar"></span><span class="token-meter-bar"></span><span class="token-meter-bar"></span><span class="token-meter-bar"></span><span class="token-meter-bar"></span><span class="token-meter-bar"></span><span class="token-meter-bar"></span></span>&nbsp;<b>tokens</b>.',
              '• Track full event lineage as unified <span class="storyline-timeline" title="Continuous event lineage tracking" aria-label="Continuous event storyline timeline"><span class="storyline-rail"></span><span class="storyline-stream"><span class="storyline-node"></span><span class="storyline-node"></span><span class="storyline-node"></span><span class="storyline-node"></span><span class="storyline-node"></span><span class="storyline-node"></span></span></span>&nbsp;<b>storylines</b>.'
            ],
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-newspaper"><path d="M15 18h-5"></path><path d="M18 14h-8"></path><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"></path><rect width="8" height="4" x="10" y="6" rx="1"></rect></svg>`,
            watermarkSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280" fill="none" stroke="currentColor" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-newspaper"><g transform="translate(14.333, 14.333)"><path d="M160.667 195.667H102.333M195.667 149H102.333M32.3333 242.333H219C225.188 242.333 231.123 239.875 235.499 235.499C239.875 231.123 242.333 225.188 242.333 219V32.3333C242.333 26.1449 239.875 20.21 235.499 15.8342C231.123 11.4583 225.188 9 219 9H79C72.8116 9 66.8767 11.4583 62.5008 15.8342C58.125 20.21 55.6667 26.1449 55.6667 32.3333V219C55.6667 225.188 53.2083 231.123 48.8325 235.499C44.4566 239.875 38.5217 242.333 32.3333 242.333ZM32.3333 242.333C26.1449 242.333 20.21 239.875 15.8342 235.499C11.4583 231.123 9 225.188 9 219V114C9 107.812 11.4583 101.877 15.8342 97.5008C20.21 93.125 26.1449 90.6667 32.3333 90.6667H55.6667"></path><path d="M184 55.6667H114C107.557 55.6667 102.333 60.89 102.333 67.3333V90.6667C102.333 97.11 107.557 102.333 114 102.333H184C190.443 102.333 195.667 97.11 195.667 90.6667V67.3333C195.667 60.89 190.443 55.6667 184 55.6667Z"></path></g></svg>`,
            subjects: [
              {
                name: 'Saudi Arabia halts East-West pipeline after drone attacks from Iraq, with repairs expected to take three to five weeks',
                summary: 'Saudi Arabia suspended operations on its East-West oil pipeline following drone attacks launched from Iraq that damaged pumping stations in the Riyadh and Medina regions. Satellite imagery confirmed major damage to a key facility, and officials told AP that repairs will take three to five weeks, potentially depleting export stocks at Yanbu.',
                timeStart: '2026-09-11T00:00:00Z',
                timeLatest: '2026-09-15T21:40:00Z',
                cover: './images/vertical/subject-1.webp',
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
                    relativeTime: '3m ago',
                    url: 'https://www.reuters.com/business/energy/saudi-pipeline-outage-threatens-loss-4-global-oil-supply-2026-09-15/'
                  }
                ]
              },
              {
                name: "Ghalibaf says Strait of Hormuz will remain closed until Iran's seven conditions are met",
                summary: "Iranian Parliament Speaker Mohammad Bagher Ghalibaf stated on September 20 that the Strait of Hormuz will not be reopened until the United States meets Iran's seven specific conditions. He announced that Tehran has conveyed these conditions to Washington through mediators and emphasized that Iran will pursue a strategy combining military action with diplomacy.",
                timeStart: '2026-09-19T00:00:00Z',
                timeLatest: '2026-09-20T21:40:00Z',
                cover: './images/vertical/subject-2.webp',
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
                    relativeTime: '10m ago',
                    url: 'https://apnews.com/article/un-security-council-iran-hormuz-standoff-2026'
                  }
                ]
              },
              {
                name: 'Houthi rebels seize Greater and Lesser Hanish islands, tightening control of Bab el-Mandeb Strait',
                summary: "Yemen's Houthi rebels have captured the strategic islands of Greater and Lesser Hanish in the southern Red Sea, displacing more than 80,000 people in recent fighting. The seizure strengthens the Iran-backed group's grip on the Bab el-Mandeb shipping route and has intensified concerns over global oil supply disruptions.",
                timeStart: '2026-09-14T00:00:00Z',
                timeLatest: '2026-09-15T21:40:00Z',
                cover: './images/vertical/subject-3.webp',
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
                    relativeTime: '24m ago',
                    url: 'https://www.lloydslist.com/insurance/red-sea-war-exclusion-zone-declaration'
                  }
                ]
              },
              {
                name: 'Oil prices rise 1.75% to $107.50 as traders assess impact of Saudi pipeline shutdown',
                summary: "Brent crude futures rose 1.75% to $107.50 per barrel and WTI rose 1.8% to $103.17 per barrel on Tuesday, September 15, 2026, as traders assessed the impact of the shutdown of Saudi Arabia's East-West pipeline. The closure, caused by recent strikes, threatens up to 4% of global oil supply, with the true extent of the damage to the pipeline not yet confirmed.",
                timeStart: '2026-09-13T00:00:00Z',
                timeLatest: '2026-09-15T21:40:00Z',
                cover: './images/vertical/subject-4.webp',
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
                    relativeTime: '36m ago',
                    url: 'https://www.cnbc.com/2026/09/15/opec-no-quota-hike-oil-crisis.html'
                  }
                ]
              }
            ]
          },
          business: {
            id: 'business',
            title: 'Business Search',
            heading: 'Search built for vertical industries',
            desc: 'Deeply customized search engineered for vertical domains. Delivering real-time, high-precision, and in-depth intelligence structured for autonomous reasoning.',
            theme: 'business',
            query: 'Coupang company overview and financial metrics',
            badgeText: 'Top Entity',
            summaryDesc: 'Analyze corporate filings, 52-week market metrics, and executive leadership profiles.',
            stats: { num1: 2, label1: 'entities', num2: 6, label2: 'results' },
            bullets: [
              '• Corporate entity profiling: verified SEC registries, C-suite leadership, and market metrics.',
              '• Real-time financial metrics: tracking <b>$8.9B</b> revenue (+10% FX neutral) and 52-week trading range.',
              '• Dual-track intelligence: separates official corporate activities from independent media news.'
            ],
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg>`,
            watermarkSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280" fill="none" stroke="currentColor" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase"><path d="M186.667 233.333V46.6667C186.667 40.4783 184.208 34.5434 179.832 30.1675C175.457 25.7917 169.522 23.3333 163.333 23.3333H116.667C110.478 23.3333 104.543 25.7917 100.168 30.1675C95.7917 34.5434 93.3333 40.4783 93.3333 46.6667V233.333"></path><path d="M233.333 70H46.6667C33.78 70 23.3333 80.4467 23.3333 93.3333V210C23.3333 222.887 33.78 233.333 46.6667 233.333H233.333C246.22 233.333 256.667 222.887 256.667 210V93.3333C256.667 80.4467 246.22 70 233.333 70Z"></path></svg>`,
            entities: [
              {
                type: 'company',
                id: 'coupang',
                name: 'Coupang, Inc.',
                aliases: ['쿠팡', 'Coupang'],
                badge: 'Company',
                logoText: 'CP',
                logoBg: '#C9252D',
                identifiers: {
                  website: 'aboutcoupang.com',
                  linkedin_url: 'https://www.linkedin.com/company/coupang',
                  stock_ticker: 'NYSE: CPNG',
                  sec_cik: '0001834584'
                },
                attributes: {
                  industry: 'E-commerce',
                  hq_country: 'United States',
                  founded_year: 2010,
                  employee_range: '10,001+'
                },
                summary: "One of South Korea’s largest e-commerce platforms, founded in 2010 and listed on the NYSE. Its core businesses span e-commerce, logistics fulfillment, and OTT streaming. Its self-built Rocket Delivery network reaches most of Korea’s population. In recent years, the company has focused its growth investments on advertising, food delivery, and international expansion—its Developing Offerings.",
                metrics: {
                  stock: { price: 14.29, todays_change_percent: -1.18, week_52_high: 34.08, week_52_low: 14.15, date: '2026-09-18', currency: 'USD' },
                  financials: { revenue: 8900000000, net_income: -570000000, currency: 'USD', period: '2026Q2' },
                  funding: { valuation: 9000000000, round: 'Series F', year: '2018', total_funding: 3400000000, currency: 'USD' },
                  web_traffic: { visits_monthly: 288090220, rank: 5, period: '2026-07' }
                },
                key_people: [
                  { name: 'Bom Kim', title: 'Founder & CEO' },
                  { name: 'Gaurav Anand', title: 'CFO' }
                ],
                activities: [
                  {
                    title: 'Coupang names new head of Fulfillment Technology',
                    timePublished: '2026-09-11T23:58:07Z',
                    authority: 'high',
                    highlight: 'Directly reporting to CEO, overseeing automated sorting and last-mile robotics dispatch lines.',
                    url: 'https://ir.aboutcoupang.com/news/2026/fulfillment-tech-lead'
                  },
                  {
                    title: 'Coupang Announces Results for Second Quarter 2026: Net revenues reach $8.9 billion',
                    timePublished: '2026-09-10T23:58:07Z',
                    authority: 'high',
                    highlight: 'Total net revenues were $8.9 billion, up 4% YoY (10% on constant currency basis).',
                    url: 'https://ir.aboutcoupang.com/news/2026/q2-results'
                  },
                  {
                    title: 'Coupang expands Rocket Delivery to two more provinces',
                    timePublished: '2026-09-04T15:58:07Z',
                    authority: 'high',
                    highlight: 'Next-day delivery coverage expands to 92% of South Korea population with prior capex recognized.',
                    url: 'https://ir.aboutcoupang.com/news/2026/rocket-expansion'
                  }
                ],
                news: [
                  {
                    title: "Analysts split on Coupang's margin trajectory after Q2",
                    timePublished: '2026-09-11T11:58:07Z',
                    source: "Barron's",
                    authority: 'standard',
                    url: 'https://www.barrons.com/articles/coupang-margin-outlook-2026'
                  },
                  {
                    title: 'Coupang (CPNG) Q2 2026 Earnings Call Transcript',
                    timePublished: '2026-09-11T03:58:07Z',
                    source: 'Motley Fool',
                    authority: 'standard',
                    url: 'https://www.fool.com/earnings/coupang-cpng-q2-2026-transcript'
                  },
                  {
                    title: '쿠팡플레이, 스포츠 독점 중계권 확대…OTT 경쟁 격화 (Coupang Play Sports OTT)',
                    timePublished: '2026-08-30T15:58:07Z',
                    source: 'Maeil Business',
                    authority: 'standard',
                    url: 'https://www.mk.co.kr/news/business/20260828/coupang-play-sports'
                  }
                ]
              },
              {
                type: 'person',
                id: 'bom-kim',
                name: 'Bom Kim',
                badge: 'Person',
                avatarText: 'BK',
                avatarBg: '#3D5A80',
                current_position: { title: 'Founder & CEO', organization: 'Coupang, Inc.' },
                linkedin_url: 'https://www.linkedin.com/in/bom-kim',
                summary: 'Founder & CEO of Coupang since 2010. Harvard College graduate and Harvard Business School alumnus, led Coupang through its 2021 NYSE IPO and nationwide automated logistics rollout.',
                career: [
                  { organization: 'Coupang, Inc.', title: 'Founder & CEO', start: '2010', end: null },
                  { organization: '02138 Magazine', title: 'Co-founder', start: '2006', end: '2008' },
                  { organization: 'The Boston Consulting Group', title: 'Associate', start: '2005', end: '2006' }
                ],
                activities: [
                  {
                    title: 'Coupang names new head of Fulfillment Technology',
                    timePublished: '2026-09-12T07:58:07Z',
                    timeDisplay: '2026/09/12 07:58:07',
                    isLatest: true,
                    source: 'biz.com',
                    highlight: 'Overseeing automated sorting and last-mile robotics dispatch lines.',
                    url: 'https://biz.com/news/coupang-fulfillment-tech'
                  },
                  {
                    title: 'Coupang Announces Results for Second Quarter 2026: Net revenues reach $8.9 billion',
                    timePublished: '2026-09-11T07:58:07Z',
                    timeDisplay: '2026/09/11 07:58:07',
                    source: 'ir.aboutcoupang.com',
                    highlight: 'Total net revenues were $8.9 billion, up 4% YoY (10% on constant currency basis).',
                    url: 'https://ir.aboutcoupang.com/news/2026/q2-results'
                  }
                ],
                news: [
                  {
                    title: "How Bom Kim built South Korea's Amazon with Coupang",
                    timePublished: '2026-09-08T12:00:00Z',
                    source: 'Bloomberg',
                    authority: 'standard',
                    url: 'https://www.bloomberg.com/news/articles/2026-09-08/bom-kim-coupang-story'
                  },
                  {
                    title: 'Bom Kim on expansion beyond South Korea into Taiwan',
                    timePublished: '2026-08-15T09:30:00Z',
                    source: 'Nikkei Asia',
                    authority: 'standard',
                    url: 'https://asia.nikkei.com/Business/Retail/Bom-Kim-Coupang-Taiwan-expansion'
                  }
                ]
              }
            ],
            subjects: [
              {
                name: 'Coupang, Inc. (NYSE: CPNG) Q2 2026 Financials & Market Intelligence',
                summary: 'Total net revenues reached $8.9B (+4% YoY, +10% constant currency). Product Commerce revenue grew 6%, while Developing Offerings doubled. Stock trading at $14.29 (52-week range $14.15–$34.08) with $3.4B in total funding.',
                timeStart: '2026-09-01T00:00:00Z',
                timeLatest: '2026-09-18T20:15:00Z',
                cover: './images/vertical/subject-1.webp',
                fallbackCover: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
                articles: [
                  {
                    title: 'Coupang Announces Results for Second Quarter 2026: Net revenues reach $8.9 billion',
                    timePublished: '2026-09-10T23:58:07Z',
                    relativeTime: '2h ago',
                    url: 'https://ir.aboutcoupang.com/news/2026/q2-results'
                  },
                  {
                    title: 'Coupang (CPNG) Q2 2026 Earnings Call Transcript: "The vast majority of customer spend never moved"',
                    timePublished: '2026-09-11T03:58:07Z',
                    relativeTime: '1h ago',
                    url: 'https://www.fool.com/earnings/coupang-cpng-q2-2026-transcript'
                  },
                  {
                    title: "Analysts split on Coupang's margin trajectory as Developing Offerings turn contribution-positive early",
                    timePublished: '2026-09-11T11:58:07Z',
                    relativeTime: '45m ago',
                    url: 'https://www.barrons.com/articles/coupang-margin-outlook-2026'
                  },
                  {
                    title: 'Coupang names new Head of Fulfillment Technology overseeing automated sorting and last-mile robotics',
                    timePublished: '2026-09-11T23:58:07Z',
                    relativeTime: '20m ago',
                    url: 'https://www.bizwire.com/people/coupang-fulfillment-tech-lead'
                  },
                  {
                    title: 'NYSE:CPNG 52-week market summary: trading at $14.29 with monthly active visits reaching 288M',
                    timePublished: '2026-09-18T20:15:00Z',
                    relativeTime: '5m ago',
                    url: 'https://www.bloomberg.com/markets/stocks/cpng-nyse'
                  }
                ]
              },
              {
                name: 'Bom Kim (Founder & CEO) Executive Profile & Strategic Vision',
                summary: 'Founder & CEO of Coupang since 2010. Harvard College alumnus. Pioneered nationwide automated logistics in South Korea and oversees Taiwan cross-border expansion alongside retail media network flywheel.',
                timeStart: '2026-08-20T00:00:00Z',
                timeLatest: '2026-09-15T16:30:00Z',
                cover: './images/vertical/subject-2.webp',
                fallbackCover: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80',
                articles: [
                  {
                    title: 'Bom Kim on Coupang\'s long-term moat: "Customer cohort retention remains resilient across all tiers"',
                    timePublished: '2026-09-11T04:15:00Z',
                    relativeTime: '3h ago',
                    url: 'https://www.wsj.com/business/coupang-bom-kim-strategy'
                  },
                  {
                    title: 'Founder track record: From 02138 Magazine and BCG to building Korea\'s largest retail disruptor',
                    timePublished: '2026-09-12T10:20:00Z',
                    relativeTime: '1h ago',
                    url: 'https://www.forbes.com/profile/bom-kim/'
                  },
                  {
                    title: 'Executive reorganization aligns direct reporting for Coupang Play OTT and international logistics under CEO',
                    timePublished: '2026-09-15T16:30:00Z',
                    relativeTime: '12m ago',
                    url: 'https://www.reuters.com/business/coupang-executive-leadership-reshuffle/'
                  }
                ]
              },
              {
                name: 'Rocket Delivery Infrastructure: Nationwide Automated Hubs & Cold Chain Expansion',
                summary: 'Coupang expands next-day Rocket Delivery network into two additional provinces, bringing coverage to 92% of the population. Multi-billion dollar fulfillment center capex recognized in prior fiscal cycle begins yielding margin expansion.',
                timeStart: '2026-08-25T00:00:00Z',
                timeLatest: '2026-09-14T18:45:00Z',
                cover: './images/vertical/subject-3.webp',
                fallbackCover: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
                articles: [
                  {
                    title: 'Coupang expands Rocket Delivery to two more provinces, raising next-day coverage to 92% of population',
                    timePublished: '2026-09-04T15:58:07Z',
                    relativeTime: '2h ago',
                    url: 'https://www.koreaherald.com/business/20260901/rocket-delivery-expansion'
                  },
                  {
                    title: 'Daegu and Gwangju mega automated fulfillment centers reach 96% throughput efficiency',
                    timePublished: '2026-09-08T09:12:00Z',
                    relativeTime: '45m ago',
                    url: 'https://www.kedglobal.com/logistics/coupang-daegu-automated-center'
                  },
                  {
                    title: 'Last-mile delivery robotics reduce fulfillment cycle time by 38% in Seoul metropolitan area',
                    timePublished: '2026-09-14T18:45:00Z',
                    relativeTime: '8m ago',
                    url: 'https://www.techinasia.com/coupang-logistics-robotics-efficiency'
                  }
                ]
              },
              {
                name: 'Developing Offerings: Coupang Play Sports OTT, Coupang Eats & Taiwan Expansion',
                summary: 'Developing Offerings segment contribution turns positive ahead of guidance. Coupang Play secures exclusive European football and baseball streaming rights, accelerating WOW membership flywheel and retail ad revenues.',
                timeStart: '2026-08-28T00:00:00Z',
                timeLatest: '2026-09-12T14:20:00Z',
                cover: './images/vertical/subject-4.webp',
                fallbackCover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80',
                articles: [
                  {
                    title: '쿠팡플레이, 해외 축구 및 메이저 스포츠 독점 중계권 확대…국내 OTT 1위 도약 (Coupang Play Sports OTT)',
                    timePublished: '2026-08-30T15:58:07Z',
                    relativeTime: '3h ago',
                    url: 'https://www.mk.co.kr/news/business/20260828/coupang-play-sports'
                  },
                  {
                    title: 'Taiwan market gross merchandise value jumps 84% YoY as Rocket Delivery model replicates overseas',
                    timePublished: '2026-09-05T11:40:00Z',
                    relativeTime: '1h ago',
                    url: 'https://www.ft.com/content/coupang-taiwan-expansion-growth'
                  },
                  {
                    title: 'Retail media network advertising surges as merchant ad placements surge across mobile app',
                    timePublished: '2026-09-12T14:20:00Z',
                    relativeTime: '15m ago',
                    url: 'https://www.wsj.com/articles/retail-media-ad-revenue-surge-coupang'
                  }
                ]
              }
            ]
          }
        };

export function getCurrentData(key = state.currentVerticalKey) {
  return VERTICALS[key] || VERTICALS.news;
}

export function setVerticalKey(key) {
  if (VERTICALS[key]) {
    state.currentVerticalKey = key;
  }
}

// Helpers
export const formatDate = d => (d ? d.slice(0, 10).replace(/-/g, '/') : '');
export const formatDateTime = d => (d ? `${d.slice(0, 10)} ${d.slice(11, 19)}` : '');
export const formatTimeOnly = d => {
  if (!d) return '';
  if (d.includes('T')) {
    return d.split('T')[1].slice(0, 8);
  }
  return d;
};
export const extractDomain = url => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (e) {
    return '';
  }
};

// Persistent memory cache holding pre-decoded Image instances
export const imageCache = new Map();

// Preload & pre-decode image covers in browser background across all verticals
export async function preloadCovers() {
  const urls = [];
  Object.values(VERTICALS).forEach(v => {
    if (v.subjects) {
      v.subjects.forEach(s => {
        if (s.cover && !urls.includes(s.cover)) urls.push(s.cover);
        if (s.fallbackCover && !urls.includes(s.fallbackCover)) urls.push(s.fallbackCover);
      });
    }
  });

  await Promise.allSettled(urls.map(async (url) => {
    try {
      const img = new Image();
      img.src = url;
      if (img.decode) {
        await img.decode();
      }
      imageCache.set(url, img);
    } catch (e) {
      // Fallback ignore
    }
  }));
}

