import React, { useState, useEffect, useRef } from 'react';
import NumberFlow, { continuous } from '@number-flow/react';

interface SubjectCardData {
  date: string;
  tag: string;
  thumb: string;
  title: string;
  desc: string;
}

interface TimelineArticle {
  time: string;
  domain: string;
  title: string;
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

const SUBJECT_CARDS: SubjectCardData[] = [
  {
    date: '2026/09/14 – 2026/09/15',
    tag: 'Subject1',
    thumb: '/images/vertical/subject-1.png',
    title: 'Iranian hardliners attacked three commercial ships in Strait of Hormuz to sabotage US peace deal',
    desc: 'A clandestine hard-line faction in Iran, led by former IRGC intelligence director Hossein Taeb, attacked three commercial ships in the Strait of Hormuz, including a Qatari LNG tanker, to derail a recently signed peace agreement with the United States.',
  },
  {
    date: '2026/09/14 – 2026/09/15',
    tag: 'Subject2',
    thumb: '/images/vertical/subject-2.png',
    title: 'Oil prices settle 1% higher after Saudi strikes and Hormuz attacks',
    desc: 'Oil prices settled approximately 1% higher on Monday, September 14, 2026, with Brent crude at $105.68 per barrel and WTI at $101.39, after jumping nearly 5% intraday.',
  },
  {
    date: '2026/09/14 – 2026/09/15',
    tag: 'Subject3',
    thumb: '/images/vertical/subject-3.png',
    title: 'Iran and Oman agree on new entry and exit routes for Strait of Hormuz',
    desc: 'Iran and Oman have reached a final agreement on new shipping routes for the Strait of Hormuz, with the entry point located entirely within Iranian territorial waters.',
  },
  {
    date: '2026/09/14 – 2026/09/15',
    tag: 'Subject4',
    thumb: '/images/vertical/subject-4.png',
    title: 'Houthis seize strategic Red Sea port of Mocha and advance toward Bab el-Mandeb Strait',
    desc: 'Iran-backed Houthi rebels captured the strategic Red Sea port city of Mocha from Saudi-backed government forces on September 10, 2026, marking their largest territorial gain since the 2022 ceasefire.',
  },
];

const TIMELINE_ARTICLES: TimelineArticle[] = [
  { time: '05:26:15', domain: 'sbs.com.au', title: 'Houthis advance along Yemen coast, threaten Saudi oil exports in the Red Sea' },
  { time: '05:27:44', domain: 'sbs.com.au', title: 'Houthi rebels seize strategic port city in Yemen, escalating US-Iran crisis' },
  { time: '06:45:31', domain: 'cnbc.com', title: 'While You Were Sleeping: 5 stories you might have missed, Sept 11, 2026' },
  { time: '16:24:02', domain: 'indiatoday.in', title: 'While You Were Sleeping: 5 stories you might have missed, Sept 11, 2026 | The Straits Times' },
  { time: '10 mins ago', domain: 'bloomberg.com', title: 'Hormuz is blocked. Now Bab el-Mandeb is under threat: Why fuel crisis could get worse – IndiaToday' },
];

const TIMELINE_OFFSETS = [0, 172, 288, 404, 520];

export const VerticalSearch: React.FC = () => {
  const [bgTheme, setBgTheme] = useState<'news' | 'academic' | 'business' | 'purple'>('news');
  const [currentScenario, setCurrentScenario] = useState<string>('news');
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [timelineSubState, setTimelineSubState] = useState<'expanded' | 'scrolling'>('expanded');
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [typedQuery, setTypedQuery] = useState(scenarioQueries.news);
  const [hasStarted, setHasStarted] = useState(false);
  const [subjectsVal, setSubjectsVal] = useState(0);
  const [articlesVal, setArticlesVal] = useState(0);
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
    setStep(1);
    setTimelineIndex(0);
    setTypedQuery('');
  };

  const handleScenarioEnter = (key: string) => {
    clearUnhoverTimer();
    if (currentScenario === key) return;
    setCurrentScenario(key);
    setStep(1);
    setTimelineIndex(0);
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

  // Number-flow values manager for Step 3, 4, 5 (staggered continuous rolling tumbler)
  useEffect(() => {
    if (step < 3) {
      setSubjectsVal(0);
      setArticlesVal(0);
    } else if (step === 3) {
      setSubjectsVal(0);
      setArticlesVal(0);
      const t1 = setTimeout(() => setSubjectsVal(4), 120);
      const t2 = setTimeout(() => setArticlesVal(10), 280);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setSubjectsVal(4);
      setArticlesVal(10);
    }
  }, [step]);

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

  // Step 1: Typewriter Effect (News only)
  useEffect(() => {
    if (!hasStarted || step !== 1 || currentScenario !== 'news' || isHovered) return;
    setTypedQuery('');
    setTimelineIndex(0);

    const target = scenarioQueries.news;
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
  }, [hasStarted, step, currentScenario, isHovered]);

  // Step 2: Searching with 14 pulse wave dots (1.8s)
  useEffect(() => {
    if (step !== 2 || currentScenario !== 'news' || isHovered) return;
    const timer = setTimeout(() => {
      setStep(3);
    }, 1800);
    return () => clearTimeout(timer);
  }, [step, currentScenario, isHovered]);

  // Step 3: 4 Subject cards overview (4.0s for sequential appearance & scroll)
  useEffect(() => {
    if (step !== 3 || currentScenario !== 'news' || isHovered) return;
    const timer = setTimeout(() => {
      setStep(4);
    }, 4000);
    return () => clearTimeout(timer);
  }, [step, currentScenario, isHovered]);

  // Step 4: Focus on Subject 1 with timeline hint (1.5s)
  useEffect(() => {
    if (step !== 4 || currentScenario !== 'news' || isHovered) return;
    const timer = setTimeout(() => {
      setTimelineSubState('expanded');
      setStep(5);
    }, 1500);
    return () => clearTimeout(timer);
  }, [step, currentScenario, isHovered]);

  // Step 5: Timeline Drilldown (5A: expanded 1.8s, 5B: scrolling stepping)
  useEffect(() => {
    if (step !== 5 || currentScenario !== 'news' || isHovered) return;

    if (timelineSubState === 'expanded') {
      const expandTimer = setTimeout(() => {
        setTimelineSubState('scrolling');
        setTimelineIndex(1);
      }, 1800);
      return () => clearTimeout(expandTimer);
    }

    if (timelineSubState === 'scrolling') {
      if (timelineIndex < TIMELINE_ARTICLES.length - 1) {
        const stepTimer = setTimeout(() => {
          setTimelineIndex((prev) => prev + 1);
        }, 1600);
        return () => clearTimeout(stepTimer);
      } else {
        const loopTimer = setTimeout(() => {
          setStep(1);
        }, 3000);
        return () => clearTimeout(loopTimer);
      }
    }
  }, [step, timelineSubState, timelineIndex, currentScenario, isHovered]);

  return (
    <section id="vertical-search" ref={sectionRef} className="vertical-search-section" data-node-id="13625:179114">
      <div className="hero-header-box">
        <div className="hero-title-group">
          <div className="tag-pill" data-node-id="13625:179118">
            <div className="tag-pill-icon" data-name="vertical">
              <img src="/assets/icon-vertical-tag.svg" alt="" width={15} height={15} />
            </div>
            <span>Vertical Search</span>
          </div>
          <h2 className="hero-heading">Search built for every vertical</h2>
          <p className="hero-desc">
            Give every industry the real-time context it needs with search tuned to its sources, language, and workflows. <strong>News search is live now.</strong>
          </p>
          <a className="btn-request" href="/platform/overview" target="_blank" rel="noreferrer">
            Request Access
            <img className="btn-request-icon" src="/assets/arrow-right.svg" alt="" width={11} height={11} />
          </a>
        </div>
      </div>

      {/* Central Interactive Display Canvas (1260x532) */}
      <div className="canvas-section">
        <div
          className="hero-canvas"
          id="heroCanvas"
          data-theme={bgTheme}
          data-news-step={step}
          data-timeline-state={timelineSubState}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="canvas-aura" />

          {/* Ambient Watermark Icon (Strictly only visible in Step 1) */}
          <div
            className="canvas-watermark-icon"
            id="canvasWatermarkIcon"
            aria-hidden="true"
            style={{
              opacity: step === 1 ? 0.12 : 0,
              visibility: step === 1 ? 'visible' : 'hidden',
              pointerEvents: 'none',
              transform: step === 1 ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0.85)',
              transition: 'opacity 0.35s ease, transform 0.35s ease, visibility 0.35s',
            }}
          >
            <img src={scenarioIcons[currentScenario] || '/assets/icon-news.svg'} alt="" width={280} height={280} />
          </div>

          {/* Topic Title Header (Figma 13661:163789) */}
          <div
            className="canvas-topic-header"
            id="canvasTopicHeader"
            style={{
              position: 'absolute',
              left: step === 1 ? '50%' : '64px',
              top: step === 1 ? '172px' : '166px',
              transform: step === 1 ? 'translateX(-50%)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              zIndex: 10,
              pointerEvents: 'none',
              transition: 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {step >= 2 && (
              <span
                className="topic-header-icon"
                id="topicHeaderIcon"
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {currentScenario === 'news' ? (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.4999 21.0002H11.6666M20.9999 16.3335H11.6666M4.66659 25.6668H23.3333C23.9521 25.6668 24.5456 25.421 24.9832 24.9834C25.4208 24.5458 25.6666 23.9523 25.6666 23.3335V4.66683C25.6666 4.04799 25.4208 3.4545 24.9832 3.01691C24.5456 2.57933 23.9521 2.3335 23.3333 2.3335H9.33325C8.71441 2.3335 8.12092 2.57933 7.68334 3.01691C7.24575 3.4545 6.99992 4.04799 6.99992 4.66683V23.3335C6.99992 23.9523 6.75409 24.5458 6.3165 24.9834C5.87892 25.421 5.28542 25.6668 4.66659 25.6668ZM4.66659 25.6668C4.04775 25.6668 3.45425 25.421 3.01667 24.9834C2.57908 24.5458 2.33325 23.9523 2.33325 23.3335V12.8335C2.33325 12.2147 2.57908 11.6212 3.01667 11.1836C3.45425 10.746 4.04775 10.5002 4.66659 10.5002H6.99992" stroke="black" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19.8332 7H12.8332C12.1888 7 11.6665 7.52233 11.6665 8.16667V10.5C11.6665 11.1443 12.1888 11.6667 12.8332 11.6667H19.8332C20.4775 11.6667 20.9998 11.1443 20.9998 10.5V8.16667C20.9998 7.52233 20.4775 7 19.8332 7Z" stroke="black" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                ) : (
                  <img src={scenarioIcons[currentScenario] || '/assets/icon-news.svg'} alt="" width={28} height={28} />
                )}
              </span>
            )}
            <h3 className="canvas-topic-title" id="canvasTopicTitle">
              {scenarioTitles[currentScenario] || 'News Search'}
            </h3>
          </div>

          {/* Floating Search Pill */}
          <div className="search-pill" id="searchPill">
            <div className="search-pill-top-row">
              <div className="search-pill-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 12V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
                  <path d="m22 22-1.5-1.5" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="search-pill-content">
                <div className="search-query-display">
                  <span className="search-query-text">{step === 1 ? typedQuery : scenarioQueries[currentScenario]}</span>
                  {step === 1 && <span className="typing-cursor" />}
                </div>
              </div>
              <div className="search-pill-action">
                <img src="/assets/ai-search.svg" alt="AI Search" width={24} height={24} />
              </div>
            </div>
          </div>

          {/* Left Panel: Meta Stats & Feature Points (Step 3, 4, 5) */}
          <div className="canvas-left-panel" id="canvasLeftPanel">
            <div className="stats-counter-row" id="statsCounterRow">
              <div className="stat-item stat-item-1">
                <NumberFlow
                  value={subjectsVal}
                  animated={step >= 3}
                  plugins={[continuous]}
                  spinTiming={{ duration: 900, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                  className="stat-num-val"
                  aria-label="4"
                />
                <span className="stat-label">subjects</span>
              </div>
              <div className="stat-item stat-item-2">
                <NumberFlow
                  value={articlesVal}
                  animated={step >= 3}
                  plugins={[continuous]}
                  spinTiming={{ duration: 1100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                  className="stat-num-val"
                  aria-label="10"
                />
                <span className="stat-label">articles</span>
              </div>
            </div>
            <div className="meta-bullets-list">
              <p className="bullet-item">• Fresh news, delivered in milliseconds.</p>
              <p className="bullet-item">• Track the progress of each subject across the timeline.</p>
              <p className="bullet-item">• Dive deep into the story's development.</p>
            </div>
          </div>

          {/* Right Side: Step 2 Searching State */}
          <div className="searching-state-container" id="searchingStateContainer">
            <span className="searching-label">Searching...</span>
            <div className="searching-dots-wave">
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} className="pulse-dot" />
              ))}
            </div>
          </div>

          {/* Right Side: Step 3 & 4 Subjects Overview */}
          <div className="subjects-overview-container" id="subjectsOverviewContainer">
            <div className="subjects-cards-track" id="subjectsCardsTrack">
              {SUBJECT_CARDS.map((sub, idx) => (
                <div
                  key={idx}
                  className={`subject-card subject-card-${idx + 1}`}
                  id={`subjectCard${idx + 1}`}
                >
                  <div className="subject-card-header">
                    <span className="subject-card-date">{sub.date}</span>
                    <span className="subject-card-tag">{sub.tag}</span>
                  </div>
                  <div className="subject-card-body">
                    <img className="subject-thumb" src={sub.thumb} alt={sub.tag} width={116} height={87} />
                    <div className="subject-card-text">
                      <h4 className="subject-card-title">{sub.title}</h4>
                      <p className="subject-card-desc">{sub.desc}</p>
                    </div>
                  </div>
                  {idx === 0 && <div className="subject-timeline-hint">timeline ↓</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Step 5 Timeline Stream with Spine */}
          <div className="timeline-drilldown-container" id="timelineDrilldownContainer">
            <div className="timeline-drilldown-viewport">
              <div
                className="timeline-drilldown-track"
                id="timelineDrilldownTrack"
                style={{
                  transform: `translateY(-${TIMELINE_OFFSETS[timelineIndex] || 0}px)`,
                }}
              >
                {/* Continuous 6px Vertical Spine Line behind Spheres */}
                <div className="timeline-spine-line" />

                {/* Root Subject 1 Header Card */}
                <div className="timeline-item timeline-header-item">
                  <div className="timeline-node">
                    <div className="timeline-sphere" />
                  </div>
                  <div className="timeline-header-card">
                    <div className="subject-card-header">
                      <span className="subject-card-date">{SUBJECT_CARDS[0].date}</span>
                      <span className="subject-card-tag">{SUBJECT_CARDS[0].tag}</span>
                    </div>
                    <div className="subject-card-body">
                      <img className="subject-thumb" src={SUBJECT_CARDS[0].thumb} alt="Subject 1" width={116} height={87} />
                      <div className="subject-card-text">
                        <h4 className="subject-card-title">{SUBJECT_CARDS[0].title}</h4>
                        <p className="subject-card-desc">{SUBJECT_CARDS[0].desc}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chronological Timeline Articles */}
                <div className="timeline-articles-group">
                  {TIMELINE_ARTICLES.map((art, idx) => (
                    <div
                      key={idx}
                      className={`timeline-item timeline-article-item ${idx <= timelineIndex ? 'article-revealed' : ''}`}
                      data-article-index={idx}
                    >
                      <div className="timeline-node">
                        <div className="timeline-sphere" />
                      </div>
                      <div className="timeline-article-card">
                        <div className="article-meta">
                          <div className="article-time">
                            <img src="/assets/fe-clock.svg" alt="Clock" width={16} height={16} />
                            <span>{art.time}</span>
                          </div>
                          <span className="article-domain">{art.domain}</span>
                        </div>
                        <h4 className="article-title">{art.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* More Scenarios Marquee */}
      <div className="future-scenarios-section">
        <h3 className="scenarios-heading">More scenarios in future releases</h3>
        <div
          className="scenarios-marquee-container"
          onMouseEnter={clearUnhoverTimer}
          onMouseLeave={() => {
            clearUnhoverTimer();
            unhoverTimerRef.current = setTimeout(resetToNews, 120);
          }}
        >
          <div className="marquee-mask-left" />
          <div className="marquee-mask-right" />
          <div className="marquee-track">
            <div className="marquee-group">
              {MORE_SCENARIOS.map((item) => (
                <div
                  key={item.key}
                  className="scenario-chip"
                  onMouseEnter={() => handleScenarioEnter(item.key)}
                  onMouseLeave={handleScenarioLeave}
                  onClick={(e) => e.preventDefault()}
                >
                  <img src={scenarioIcons[item.key]} alt={item.label} width={18} height={18} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {MORE_SCENARIOS.map((item) => (
                <div
                  key={`${item.key}-dup`}
                  className="scenario-chip"
                  onMouseEnter={() => handleScenarioEnter(item.key)}
                  onMouseLeave={handleScenarioLeave}
                  onClick={(e) => e.preventDefault()}
                >
                  <img src={scenarioIcons[item.key]} alt={item.label} width={18} height={18} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
