import React, { useState, useEffect, useRef } from 'react';

interface TimelineItem {
  time: string;
  source: string;
  title: string;
}

interface DomainData {
  query: string;
  icon: string;
  stats: string;
  items: TimelineItem[];
}

export const VerticalSearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'business' | 'academic'>('news');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isHovered, setIsHovered] = useState(false);
  const [typedQuery, setTypedQuery] = useState('');
  const [cardStep, setCardStep] = useState(0);

  const timelineData: Record<'news' | 'business' | 'academic', DomainData> = {
    news: {
      query: 'Strait of Hormuz shipping disruptions',
      icon: '/images/vertical/icon-newspaper.svg',
      stats: '2 subjects · 10 articles · 89 ms',
      items: [
        {
          time: '19:28:13',
          source: 'bloomberg.com',
          title: 'Hormuz is blocked. Now Bab el-Mandeb is under threat: Why fuel crisis could get worse – IndiaToday',
        },
        {
          time: '16:24:02',
          source: 'indiatoday.in',
          title: 'While You Were Sleeping: 5 stories you might have missed, Sept 11, 2026 | The Straits Times',
        },
        {
          time: '06:45:31',
          source: 'cnbc.com',
          title: 'While You Were Sleeping: 5 stories you might have missed, Sept 11, 2026',
        },
        {
          time: '05:27:44',
          source: 'sbs.com.au',
          title: 'Houthi rebels seize strategic port city in Yemen, escalating US-Iran crisis',
        },
        {
          time: '05:26:15',
          source: 'sbs.com.au',
          title: 'Houthis advance along Yemen coast, threaten Saudi oil exports in the Red Sea',
        },
      ],
    },
    business: {
      query: 'Enterprise SaaS customer churn benchmarks & drivers',
      icon: '/images/vertical/icon-briefcase.svg',
      stats: '4 segments · 18 reports · 94 ms',
      items: [
        {
          time: '18:15:00',
          source: 'gartner.com',
          title: '2026 B2B SaaS Churn Index: Key drivers behind net revenue retention decline',
        },
        {
          time: '14:20:10',
          source: 'techcrunch.com',
          title: 'Why AI-native startups are replacing legacy CRM workflows in enterprise fleets',
        },
        {
          time: '11:05:42',
          source: 'forbes.com',
          title: 'The new unit economics of subscription contracts under agentic automation',
        },
        {
          time: '08:30:19',
          source: 'pitchbook.com',
          title: 'Early-stage enterprise valuation multiples rebound across vertical search',
        },
        {
          time: '06:12:05',
          source: 'venturebeat.com',
          title: 'Consolidation trends in developer infrastructure tools: Q3 analysis',
        },
      ],
    },
    academic: {
      query: 'DeepSeek-R1 multi-head latent attention mathematical proofs',
      icon: '/images/vertical/icon-graduation.svg',
      stats: '3 topics · 14 preprints · 112 ms',
      items: [
        {
          time: '20:45:10',
          source: 'arxiv.org',
          title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning',
        },
        {
          time: '17:12:33',
          source: 'nature.com',
          title: 'Convergence theorems for multi-head latent attention under low-rank approximations',
        },
        {
          time: '13:40:02',
          source: 'openreview.net',
          title: 'Empirical bounds on KV cache compression in massive context architectures',
        },
        {
          time: '09:15:48',
          source: 'paperswithcode.com',
          title: 'Reproducibility study: Group Relative Policy Optimization at trillion scale',
        },
        {
          time: '07:22:19',
          source: 'semanticscholar.org',
          title: 'Survey on long-context distillation mechanisms for agent reasoning loops',
        },
      ],
    },
  };

  const moreScenarios = [
    { name: 'Legal', icon: '/images/vertical/icon-legal.svg' },
    { name: 'Sport', icon: '/images/vertical/icon-sport.svg' },
    { name: 'Code', isCode: true },
    { name: 'Design', icon: '/images/vertical/icon-design.svg' },
    { name: 'Travel', isTravel: true },
    { name: 'Game', icon: '/images/vertical/icon-game.svg' },
    { name: 'Real Estate', icon: '/images/vertical/icon-real-estate.svg' },
    { name: 'Shopping', isShopping: true },
    { name: 'Finance', icon: '/images/vertical/icon-finance.svg' },
  ];

  const current = timelineData[activeTab];

  // Step 1: Typewriter Effect
  useEffect(() => {
    if (step !== 1) return;
    setCardStep(0);
    setTypedQuery('');

    const target = current.query;
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx <= target.length) {
        setTypedQuery(target.slice(0, idx));
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setStep(2);
        }, 1200);
      }
    }, 36);

    return () => clearInterval(interval);
  }, [step, activeTab, current.query]);

  // Step 2: Searching with loading dots (Right icon static, no rotation)
  useEffect(() => {
    if (step !== 2) return;
    const timer = setTimeout(() => {
      setStep(3);
    }, 1800);
    return () => clearTimeout(timer);
  }, [step]);

  // Step 3: Synthesis Result & 3-Card Window Upward Movement (new card emerges at bottom)
  useEffect(() => {
    if (step !== 3) return;
    setCardStep(0);

    const totalCards = current.items.length;
    const visibleCards = 3;
    const maxSteps = totalCards - visibleCards; // 5 - 3 = 2
    let cur = 0;
    let timerId: ReturnType<typeof setTimeout>;

    const advanceStep = () => {
      if (cur < maxSteps) {
        timerId = setTimeout(() => {
          cur++;
          setCardStep(cur);
          advanceStep();
        }, 2000 + 750);
      } else {
        // Final 3-card window shown! Pause 3.0s then loop back to Step 1
        timerId = setTimeout(() => {
          setStep(1);
        }, 3000);
      }
    };

    // Pause 2.2s on initial window of 3 cards
    timerId = setTimeout(() => {
      advanceStep();
    }, 2200);

    return () => clearTimeout(timerId);
  }, [step, activeTab, current.items.length]);

  const handleSelectTab = (tab: 'news' | 'business' | 'academic') => {
    setActiveTab(tab);
    setCardStep(0);
    setStep(1);
  };

  return (
    <section id="vertical-search" className="octen-vertical-search" data-node-id="13625:179114">
      <div className="octen-vs-inner">
        {/* Top Header */}
        <div className="octen-vs-copy">
          <div className="octen-vs-tag">Vertical Search</div>
          <h2>Search built for every vertical</h2>
          <p>
            Give every industry the real-time context it needs with search tuned to its sources, language, and workflows. <strong>News search is live now.</strong>
          </p>
          <a className="octen-vs-button" href="/platform/overview" target="_blank" rel="noreferrer">
            Request Access
            <img src="/images/vertical/icon-arrow-right.svg" alt="" width={11} height={11} />
          </a>
        </div>

        {/* Active Scenario Tabs */}
        <div className="octen-vs-tabs" role="tablist" aria-label="Vertical search domains">
          <button
            type="button"
            className={`octen-vs-tab-btn ${activeTab === 'business' ? 'active' : ''}`}
            onClick={() => handleSelectTab('business')}
            role="tab"
            aria-selected={activeTab === 'business'}
          >
            <img src="/images/vertical/icon-briefcase.svg" alt="" width={18} height={18} />
            <span>Business</span>
          </button>
          <button
            type="button"
            className={`octen-vs-tab-btn ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => handleSelectTab('news')}
            role="tab"
            aria-selected={activeTab === 'news'}
          >
            <img
              src={activeTab === 'news' ? '/images/vertical/icon-news-active.svg' : '/images/vertical/icon-news.svg'}
              alt=""
              width={18}
              height={18}
            />
            <span>News</span>
          </button>
          <button
            type="button"
            className={`octen-vs-tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
            onClick={() => handleSelectTab('academic')}
            role="tab"
            aria-selected={activeTab === 'academic'}
          >
            <img src="/images/vertical/icon-graduation.svg" alt="" width={18} height={18} />
            <span>Academic</span>
          </button>
        </div>

        {/* Central Showcase Banner Card (Frame 427319246) */}
        <div className="octen-vs-showcase-container">
          <div
            className="octen-vs-card-banner"
            id="octen-vs-banner"
            data-state={step}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              width: 'min(1260px, 100%)',
              height: '532px',
              background: 'linear-gradient(67.02deg, #AAEF8A 3.49%, #F3FFC1 101.39%), #BBEE97',
              borderRadius: '40px',
              flex: 'none',
              order: 0,
              flexGrow: 0,
            }}
          >
            {/* Search Pill: Moves out of frame in Step 3 */}
            <div
              className={`octen-vs-search-pill ${step === 3 ? 'pill-out' : ''}`}
              id="octen-vs-pill"
            >
              <div className="octen-vs-pill-top">
                <img
                  src={current.icon}
                  alt=""
                  className="octen-vs-search-icon-left"
                  width={24}
                  height={24}
                />
                <span className="octen-vs-search-text" id="octen-vs-query-text">
                  {step === 1 ? typedQuery : current.query}
                  {step === 1 && <span className="octen-vs-typing-cursor" />}
                </span>
                <img
                  src="/images/vertical/icon-ai-search.svg"
                  alt=""
                  className="octen-vs-search-icon-right"
                  width={24}
                  height={24}
                />
              </div>

              {/* Step 2: Animated Dot Stream */}
              <div className="octen-vs-pill-loading" aria-label="Searching across sources...">
                <span className="vs-dot" />
                <span className="vs-dot" />
                <span className="vs-dot" />
                <span className="vs-dot" />
                <span className="vs-dot" />
                <span className="vs-dot" />
                <span className="vs-dot" />
                <span className="vs-dot" />
                <span className="vs-dot" />
                <span className="vs-dot" />
              </div>

              {/* Step 3: Synthesis Statistics */}
              <div className="octen-vs-pill-stats" id="octen-vs-stats-text">
                {current.stats}
              </div>
            </div>

            {/* Step 3: Vertical Timeline Connector Line (6px thick) */}
            <div className="octen-vs-timeline-line" style={{ width: '6px' }} />

            {/* Step 3: Timeline Result Cards with 3-Card Window Upward Movement */}
            <div
              className="octen-vs-timeline-list"
              id="octen-vs-timeline-cards"
              style={{
                top: '49px',
                transform: `translateX(-50%) translateY(-${cardStep * 158}px)`,
                transition: 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {current.items.map((item, idx) => (
                <div key={idx} className="octen-vs-timeline-card">
                  <div className="octen-vs-card-header">
                    <div className="octen-vs-time-badge">
                      <img src="/images/vertical/icon-clock.svg" alt="" width={16} height={16} />
                      <span>{item.time}</span>
                    </div>
                    <span className="octen-vs-source">{item.source}</span>
                  </div>
                  <p className="octen-vs-card-title">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* More scenarios */}
        <div className="octen-vs-more-grid">
          <div className="octen-vs-more-badge">
            <img src="/images/vertical/icon-legal.svg" alt="" width={14} height={14} />
            <span>Legal</span>
          </div>
          <div className="octen-vs-more-badge">
            <img src="/images/vertical/icon-sport.svg" alt="" width={14} height={14} />
            <span>Sport</span>
          </div>
          <div className="octen-vs-more-badge">
            <span style={{ fontFamily: 'monospace', fontSize: '12px', opacity: 0.65, fontWeight: 700 }}>&lt;/&gt;</span>
            <span>Code</span>
          </div>
          <div className="octen-vs-more-badge">
            <img src="/images/vertical/icon-design.svg" alt="" width={14} height={14} />
            <span>Design</span>
          </div>
          <div className="octen-vs-more-badge">
            <span style={{ fontSize: '14px', opacity: 0.65 }}>✈</span>
            <span>Travel</span>
          </div>
          <div className="octen-vs-more-badge">
            <img src="/images/vertical/icon-game.svg" alt="" width={14} height={14} />
            <span>Game</span>
          </div>
          <div className="octen-vs-more-badge">
            <img src="/images/vertical/icon-real-estate.svg" alt="" width={14} height={14} />
            <span>Real Estate</span>
          </div>
          <div className="octen-vs-more-badge">
            <span style={{ fontSize: '14px', opacity: 0.65 }}>🛍</span>
            <span>Shopping</span>
          </div>
          <div className="octen-vs-more-badge">
            <img src="/images/vertical/icon-finance.svg" alt="" width={14} height={14} />
            <span>Finance</span>
          </div>
        </div>
      </div>
    </section>
  );
};
