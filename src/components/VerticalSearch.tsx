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

const themeGradients: Record<'news' | 'academic' | 'business' | 'purple', string> = {
  news: 'linear-gradient(44.87deg, #AAEF8A 3.49%, #F3FFC1 101.39%), linear-gradient(90deg, #BBEE97 0%, #BBEE97 100%)',
  academic: 'linear-gradient(44.87deg, #A4E5FF 3.49%, #EBF8FF 101.39%), linear-gradient(90deg, #B5EBFF 0%, #B5EBFF 100%)',
  business: 'linear-gradient(44.87deg, #FFDF80 3.49%, #FFF9E6 101.39%), linear-gradient(90deg, #FFE699 0%, #FFE699 100%)',
  purple: 'linear-gradient(44.87deg, #CFACFD 3.49%, #FAF5FF 101.39%), linear-gradient(90deg, #E0C6FE 0%, #E0C6FE 100%)',
};

const scenarioQueries: Record<string, string> = {
  legal: 'Antitrust precedents in AI agent autonomous transactions',
  sport: 'Champions league tactical pressing metrics and injury risk',
  code: 'Zero-allocation ring buffer implementation in Rust',
  design: 'Neomorphic vs Glassmorphic accessible contrast ratios',
  travel: 'Direct flight routes with biometric passport gates 2026',
  game: 'Unreal Engine 5.5 Nanite skeletal mesh deformation limits',
  'real-estate': 'Commercial logistics yield trends in EMEA ports',
  shopping: 'Carbon-neutral cashmere yarn suppliers global index',
  finance: 'Federal Reserve repurchase facility liquidity distribution',
  news: 'Strait of Hormuz shipping disruptions',
};

const scenarioTitles: Record<string, string> = {
  news: 'News Search',
  academic: 'Academic Search',
  business: 'Business Search',
  legal: 'Legal Search',
  sport: 'Sport Search',
  code: 'Code Search',
  design: 'Design Search',
  travel: 'Travel Search',
  game: 'Game Search',
  'real-estate': 'Real Estate Search',
  shopping: 'Shopping Search',
  finance: 'Finance Search',
};

const scenarioIcons: Record<string, string> = {
  news: '/assets/icon-news.svg',
  academic: '/assets/icon-academic.svg',
  business: '/assets/icon-business.svg',
  legal: '/assets/icon-legal.svg',
  sport: '/assets/icon-sport.svg',
  code: '/assets/icon-code.svg',
  design: '/assets/icon-design.svg',
  travel: '/assets/icon-travel.svg',
  game: '/assets/icon-game.svg',
  'real-estate': '/assets/icon-real-estate.svg',
  shopping: '/assets/icon-shopping.svg',
  finance: '/assets/icon-finance.svg',
};

const GRADIENT_THEMES: ('news' | 'academic' | 'business' | 'purple')[] = ['academic', 'business', 'purple', 'news'];

const MORE_SCENARIOS = [
  { key: 'legal', label: 'Legal' },
  { key: 'sport', label: 'Sport' },
  { key: 'code', label: 'Code' },
  { key: 'design', label: 'Design' },
  { key: 'travel', label: 'Travel' },
  { key: 'academic', label: 'Academic' },
  { key: 'business', label: 'Business' },
  { key: 'game', label: 'Game' },
  { key: 'real-estate', label: 'Real Estate' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'finance', label: 'Finance' },
];

export const VerticalSearch: React.FC = () => {
  const [activeTab] = useState<'news' | 'business' | 'academic'>('news');
  const [bgTheme, setBgTheme] = useState<'news' | 'academic' | 'business' | 'purple'>('news');
  const [currentScenario, setCurrentScenario] = useState<string>('news');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isHovered, setIsHovered] = useState(false);
  const [typedQuery, setTypedQuery] = useState(scenarioQueries.news);
  const [cardStep, setCardStep] = useState(0);
  const [pillOut, setPillOut] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const unhoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearUnhoverTimer = () => {
    if (unhoverTimerRef.current) {
      clearTimeout(unhoverTimerRef.current);
      unhoverTimerRef.current = null;
    }
  };

  const resetToNews = () => {
    clearUnhoverTimer();
    if (currentScenario === 'news') return;
    setCurrentScenario('news');
    setBgTheme('news');
    setPillOut(false);
    setCardStep(0);
    setStep(1);
    setTypedQuery('');
  };

  const handleScenarioEnter = (key: string) => {
    clearUnhoverTimer();
    if (currentScenario === key) return;
    setCurrentScenario(key);
    setPillOut(false);
    setStep(1);
    setCardStep(0);
    const query = scenarioQueries[key] || scenarioQueries.news;
    setTypedQuery(query);

    const available = GRADIENT_THEMES.filter(t => t !== bgTheme);
    const nextTheme = available[Math.floor(Math.random() * available.length)];
    setBgTheme(nextTheme);
  };

  const handleScenarioLeave = () => {
    clearUnhoverTimer();
    unhoverTimerRef.current = setTimeout(resetToNews, 150);
  };

  useEffect(() => {
    return () => {
      clearUnhoverTimer();
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current || hasStarted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

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

  const current = timelineData[activeTab];

  // Step 1: Typewriter Effect (Strictly news only)
  useEffect(() => {
    if (!hasStarted || step !== 1 || currentScenario !== 'news') return;
    setCardStep(0);
    setPillOut(false);
    setTypedQuery('');

    const target = current.query;
    let idx = 0;
    let step2Timer: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      idx++;
      if (idx <= target.length) {
        setTypedQuery(target.slice(0, idx));
      } else {
        clearInterval(interval);
        step2Timer = setTimeout(() => {
          setStep(2);
        }, 1200);
      }
    }, 36);

    return () => {
      clearInterval(interval);
      if (step2Timer) clearTimeout(step2Timer);
    };
  }, [hasStarted, step, activeTab, current.query, currentScenario]);

  // Step 2: Searching with loading dots (Strictly news only)
  useEffect(() => {
    if (step !== 2 || currentScenario !== 'news') return;
    const timer = setTimeout(() => {
      setStep(3);
    }, 1800);
    return () => clearTimeout(timer);
  }, [step, currentScenario]);

  // Step 3: Synthesis Result & 3-Card Window Upward Movement (Strictly news only)
  useEffect(() => {
    if (step !== 3 || currentScenario !== 'news') return;
    setCardStep(0);
    setPillOut(false);

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
          setPillOut(false);
          setStep(1);
        }, 3000);
      }
    };

    // 1. Stay for 2.0s so user clearly sees the search pill and statistics ("2 subjects · 10 articles · 89 ms")
    const stayTimer = setTimeout(() => {
      setPillOut(true);

      // 2. Pause 2.2s on initial window of 3 cards (Cards 0, 1, 2)
      timerId = setTimeout(() => {
        advanceStep();
      }, 2200);
    }, 2000);

    return () => {
      clearTimeout(stayTimer);
      clearTimeout(timerId);
    };
  }, [step, activeTab, current.items.length, currentScenario]);



  return (
    <section id="vertical-search" ref={sectionRef} className="octen-vertical-search" data-node-id="13625:179114">
      <div className="octen-vs-inner">
        {/* Top Header */}
        <div className="octen-vs-copy">
          <div className="octen-vs-tag" data-node-id="13625:179118">
            <div className="tag-pill-icon" data-name="vertical">
              <img src="/assets/icon-vertical-tag.svg" alt="" width={15} height={15} />
            </div>
            <span>Vertical Search</span>
          </div>
          <h2>Search built for every vertical</h2>
          <p>
            Give every industry the real-time context it needs with search tuned to its sources, language, and workflows. <strong>News search is live now.</strong>
          </p>
          <a className="octen-vs-button" href="/platform/overview" target="_blank" rel="noreferrer">
            Request Access
            <img src="/images/vertical/icon-arrow-right.svg" alt="" width={11} height={11} />
          </a>
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
              background: themeGradients[bgTheme],
              transition: 'background 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              borderRadius: '40px',
              flex: 'none',
              order: 0,
              flexGrow: 0,
            }}
          >
            {/* Topic Title (Figma node 13661:7381: News Search) */}
            <h3
              className="octen-vs-topic-title"
              style={{
                position: 'absolute',
                left: '50%',
                transform: step >= 2 ? 'translateX(-50%) translateY(-197px)' : 'translateX(-50%) translateY(0)',
                top: '172px',
                fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
                fontWeight: 600,
                fontSize: '30px',
                lineHeight: '24px',
                color: '#000000',
                margin: 0,
                padding: 0,
                whiteSpace: 'nowrap',
                textAlign: 'center',
                pointerEvents: 'none',
                zIndex: 10,
                opacity: step >= 2 ? 0 : 1,
                transition: step >= 2
                  ? 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease 0.25s'
                  : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
              }}
            >
              {scenarioTitles[currentScenario] || `${currentScenario.charAt(0).toUpperCase() + currentScenario.slice(1)} Search`}
            </h3>

            {/* Ambient Watermark Icon (Figma node 13631:181774 - source matches bottom buttons) */}
            <div
              className="octen-vs-watermark-icon"
              style={{
                position: 'absolute',
                left: '91px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '280px',
                height: '280px',
                opacity: 0.12,
                pointerEvents: 'none',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }}
            >
              <img
                src={scenarioIcons[currentScenario] || '/assets/icon-news.svg'}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            </div>

            {/* Search Pill: Moves out of frame in Step 3 after staying */}
            <div
              className={`octen-vs-search-pill ${step === 3 && pillOut ? 'pill-out' : ''}`}
              id="octen-vs-pill"
            >
              <div className="octen-vs-pill-top">
                <img
                  src={scenarioIcons[currentScenario] || '/assets/icon-news.svg'}
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
                transform: `translateX(-50%) translateY(${step === 3 && !pillOut ? '136px' : `-${cardStep * 158}px`})`,
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
        <div
          className="octen-vs-more-grid"
          onMouseEnter={clearUnhoverTimer}
          onMouseLeave={() => {
            clearUnhoverTimer();
            unhoverTimerRef.current = setTimeout(resetToNews, 120);
          }}
        >
          {MORE_SCENARIOS.map((item) => (
            <div
              key={item.key}
              className="octen-vs-more-badge"
              onMouseEnter={() => handleScenarioEnter(item.key)}
              onMouseLeave={handleScenarioLeave}
              onClick={(e) => e.preventDefault()}
              style={{ cursor: 'pointer' }}
            >
              <img src={scenarioIcons[item.key]} alt={item.label} width={18} height={18} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
