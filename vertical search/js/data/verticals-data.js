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
            query: 'Fed rate decision market reaction',
            badgeText: 'Top News',
            summaryDesc: 'Search live news and read each story as a single grouped event.',
            stats: { num1: 4, label1: 'subjects', num2: 14, label2: 'articles' },
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
                name: 'US stocks retreat from record highs on oil-driven inflation fears and Fed rate hike bets',
                summary: 'A record-breaking US stock rally stalled as elevated oil prices fueled inflation concerns and bets on further Federal Reserve rate hikes, pulling the S&P 500 down from its peak. In the Treasury market, 10-year yields remained near their highest levels since 2002 following a solid $39 billion bond sale.',
                timeStart: '2026-10-08T01:20:45Z',
                timeLatest: '2026-10-08T05:38:34Z',
                topSource: 'bloomberg.com',
                cover: './images/vertical/subject-1.webp',
                fallbackCover: '/images/vertical/subject-1.webp',
                articles: [
                  {
                    title: 'Fed Swaps Price in Higher Peak Rate as Brent Crude Crosses $90',
                    timePublished: '2026-10-08T01:20:45Z',
                    url: 'https://www.reuters.com/markets/us/fed-swaps-higher-peak-rate-oil-2026-10-08/'
                  },
                  {
                    title: 'S&P 500 Snaps Winning Streak as Crude Jumps Past Key Resistance',
                    timePublished: '2026-10-08T02:45:12Z',
                    url: 'https://www.wsj.com/finance/stocks/sp-500-snaps-winning-streak-crude-jump'
                  },
                  {
                    title: 'Treasury 10-Year Yields Hold Near Two-Decade Highs After $39B Auction',
                    timePublished: '2026-10-08T03:50:20Z',
                    url: 'https://www.bloomberg.com/news/articles/2026-10-08/treasury-10-year-yields-near-highs'
                  },
                  {
                    title: 'Oil, Inflation Fears Derail Record US Stock Rally',
                    timePublished: '2026-10-08T05:38:34Z',
                    relativeTime: '3m ago',
                    url: 'https://www.bloomberg.com/news/articles/2026-10-08/oil-inflation-fears-derail-record-us-stock-rally'
                  }
                ]
              },
              {
                name: 'Emerging-market stocks and currencies advance on softer US jobs data and lower oil prices',
                summary: "Emerging-market stocks and currencies advanced on Monday after softer-than-expected US jobs data and a further decline in oil prices helped ease concern over aggressive interest-rate hikes by the Federal Reserve. MSCI Inc.'s gauge for developing-market equities climbed as much as 1.1%, while an index for EM currencies rose 0.3%.",
                timeStart: '2026-10-05T00:00:00Z',
                timeLatest: '2026-10-05T10:23:26Z',
                topSource: 'bloomberg.com',
                cover: './images/vertical/subject-2.webp',
                fallbackCover: '/images/vertical/subject-2.webp',
                articles: [
                  {
                    title: 'Asian Currencies Strengthen Following Softer US Employment Data',
                    timePublished: '2026-10-05T04:12:00Z',
                    url: 'https://www.reuters.com/markets/currencies/asian-currencies-strengthen-us-data-2026-10-05/'
                  },
                  {
                    title: 'MSCI Developing Equities Gauge Rallies as US Dollar Pulls Back',
                    timePublished: '2026-10-05T08:45:10Z',
                    url: 'https://www.bloomberg.com/news/articles/2026-10-05/msci-developing-equities-gauge-rallies'
                  },
                  {
                    title: 'Emerging-Market Assets Climb as Fed Hike Bets Cool, Oil Drops',
                    timePublished: '2026-10-05T10:23:26Z',
                    relativeTime: '12m ago',
                    url: 'https://www.bloomberg.com/news/articles/2026-10-05/emerging-market-assets-climb-fed-hike-bets-cool'
                  }
                ]
              },
              {
                name: 'US PCE Inflation Rises 0.3% in August, Lowering Odds of October Fed Rate Hike',
                summary: 'The US Commerce Department reported that the Personal Consumption Expenditures (PCE) price index rose 0.3% in August, while core PCE inflation increased 0.2% month-over-year. Following the release, traders reduced the market-implied probability of a Federal Reserve rate hike in October to about 36%.',
                timeStart: '2026-09-30T00:00:00Z',
                timeLatest: '2026-10-01T01:22:36Z',
                topSource: 'bloomberg.com',
                cover: './images/vertical/subject-3.webp',
                fallbackCover: '/images/vertical/subject-3.webp',
                articles: [
                  {
                    title: "Why Distortions in August's PCE Report May Complicate the Fed's Next Move",
                    timePublished: '2026-09-30T14:38:46Z',
                    url: 'https://www.barrons.com/articles/why-distortions-august-pce-report-complicate-fed-next-move'
                  },
                  {
                    title: 'US Consumer Spending Rises Most in a Year, Core PCE Up 0.2%',
                    timePublished: '2026-09-30T20:33:32Z',
                    url: 'https://www.bloomberg.com/news/articles/2026-09-30/us-consumer-spending-rises-core-pce-up'
                  },
                  {
                    title: 'Traders Cut Odds of October Fed Rate Hike After PCE Inflation Data Misses',
                    timePublished: '2026-09-30T20:48:02Z',
                    url: 'https://www.bloomberg.com/news/articles/2026-09-30/traders-cut-odds-october-fed-rate-hike-pce-miss'
                  },
                  {
                    title: 'Gold price today: Why is gold rising after cooler US inflation data?',
                    timePublished: '2026-10-01T01:22:36Z',
                    relativeTime: '1h ago',
                    url: 'https://www.hindustantimes.com/business/gold-price-today-rising-after-cooler-us-inflation-data'
                  }
                ]
              },
              {
                name: 'Global markets open mixed as Brent crude tops $100 on Houthi claim of attacks on Saudi Aramco',
                summary: 'Global markets opened mixed on Monday, October 5, as the probability of the Federal Reserve keeping its policy rate unchanged this month exceeded 80%. Brent crude oil climbed back above $100 per barrel after the Iranian-backed Yemeni Houthi group said it attacked Saudi Aramco facilities in Riyadh and Khurais with ballistic missiles and drones. The US Dollar Index rose 0.5% to 102.5, its highest level since April 2025, amid heightened geopolitical tensions.',
                timeStart: '2026-10-05T00:00:00Z',
                timeLatest: '2026-10-05T16:35:22Z',
                topSource: 'aa.com.tr',
                cover: './images/vertical/subject-4.webp',
                fallbackCover: '/images/vertical/subject-4.webp',
                articles: [
                  {
                    title: 'Dollar Index Touches 102.5 on Safe-Haven Inflows and Geopolitical Tensions',
                    timePublished: '2026-10-05T09:05:14Z',
                    url: 'https://www.bloomberg.com/news/articles/2026-10-05/dollar-index-touches-102-5-geopolitical-tensions'
                  },
                  {
                    title: 'Brent Crude Tops $100 as Middle East Supply Disruption Threat Intensifies',
                    timePublished: '2026-10-05T12:18:40Z',
                    url: 'https://www.reuters.com/business/energy/brent-crude-tops-100-middle-east-supply-disruptions'
                  },
                  {
                    title: 'Global markets open mixed despite easing expectations for Fed rate hike',
                    timePublished: '2026-10-05T16:35:22Z',
                    relativeTime: '2h ago',
                    url: 'https://www.aa.com.tr/en/economy/global-markets-open-mixed-despite-easing-fed-expectations'
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
                    timePublished: '2026-09-15T21:40:00Z',
                    timeDisplay: '12m ago',
                    relativeTime: '12m ago',
                    isLatest: true,
                    authority: 'high',
                    highlight: 'Directly reporting to CEO, overseeing automated sorting and last-mile robotics dispatch lines.',
                    url: 'https://ir.aboutcoupang.com/news/2026/fulfillment-tech-lead'
                  },
                  {
                    title: 'Coupang Announces Results for Second Quarter 2026: Net revenues reach $8.9 billion',
                    timePublished: '2026-09-11T07:58:07Z',
                    timeDisplay: '2026/09/11 07:58:07',
                    authority: 'high',
                    highlight: 'Total net revenues were $8.9 billion, up 4% YoY (10% on constant currency basis).',
                    url: 'https://ir.aboutcoupang.com/news/2026/q2-results'
                  },
                  {
                    title: 'Coupang expands Rocket Delivery to two more provinces',
                    timePublished: '2026-09-04T23:58:07Z',
                    timeDisplay: '2026/09/04 23:58:07',
                    authority: 'high',
                    highlight: 'Next-day delivery coverage expands to 92% of South Korea population with prior capex recognized.',
                    url: 'https://ir.aboutcoupang.com/news/2026/rocket-expansion'
                  }
                ],
                news: [
                  {
                    title: "Analysts split on Coupang's margin trajectory after Q2",
                    timePublished: '2026-09-15T21:27:00Z',
                    timeDisplay: '25m ago',
                    relativeTime: '25m ago',
                    isLatest: true,
                    source: "Barron's",
                    authority: 'standard',
                    url: 'https://www.barrons.com/articles/coupang-margin-outlook-2026'
                  },
                  {
                    title: 'Coupang (CPNG) Q2 2026 Earnings Call Transcript',
                    timePublished: '2026-09-11T07:58:07Z',
                    timeDisplay: '2026/09/11 07:58:07',
                    source: 'Motley Fool',
                    authority: 'standard',
                    url: 'https://www.fool.com/earnings/coupang-cpng-q2-2026-transcript'
                  },
                  {
                    title: '쿠팡플레이, 스포츠 독점 중계권 확대…OTT 경쟁 격화 (Coupang Play Sports OTT)',
                    timePublished: '2026-09-04T23:58:07Z',
                    timeDisplay: '2026/09/04 23:58:07',
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
                    timePublished: '2026-09-15T21:37:00Z',
                    timeDisplay: '15m ago',
                    relativeTime: '15m ago',
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
                    timePublished: '2026-09-15T21:20:00Z',
                    timeDisplay: '32m ago',
                    relativeTime: '32m ago',
                    isLatest: true,
                    source: 'Bloomberg',
                    authority: 'standard',
                    url: 'https://www.bloomberg.com/news/articles/2026-09-08/bom-kim-coupang-story'
                  },
                  {
                    title: 'Bom Kim on expansion beyond South Korea into Taiwan',
                    timePublished: '2026-09-08T12:00:00Z',
                    timeDisplay: '2026/09/08 12:00:00',
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
export const formatDateTime = d => (d ? `${d.slice(0, 10).replace(/-/g, '/')} ${d.slice(11, 19)}` : '');
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

