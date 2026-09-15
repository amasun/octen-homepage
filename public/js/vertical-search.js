(function() {
  function initVerticalSearchSubpage() {
    /**
     * Octen Vertical Search - Interactive Controller
     * High-Fidelity Figma Node 13625-179114 Implementation
     */
    
    
      // 1. High-Fidelity Vector SVG Icon Definitions (24x24 Lucide Standard & Octen Logo Variable)
      const ICONS = {
        logoVariable: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-node-id="13631:181644">
          <g transform="translate(0.05, 2.4)">
            <path d="M23.0596 12.9756C23.5218 12.9758 23.8973 13.3624 23.8975 13.8389V15.2236C23.8975 15.7003 23.5219 16.0877 23.0596 16.0879H21.9658C21.7427 16.0879 21.5299 16.1791 21.373 16.3408L21.123 16.5986C20.9664 16.7615 20.878 16.9804 20.8779 17.209V18.3369C20.8777 18.8135 20.5024 19.2002 20.04 19.2002H18.6973C18.2349 19.2002 17.8596 18.8135 17.8594 18.3369V16.9512C17.8596 16.4746 18.2349 16.0879 18.6973 16.0879H20.04C20.2631 16.0879 20.4759 15.9967 20.6328 15.835C20.7897 15.672 20.8779 15.4524 20.8779 15.2236V13.8389C20.8781 13.3623 21.2535 12.9756 21.7158 12.9756H23.0596ZM2.17969 12.9746C2.64212 12.9746 3.01749 13.3612 3.01758 13.8379V15.1582H3.02051C3.02051 15.387 3.10875 15.6066 3.26562 15.7695C3.46197 15.973 3.72909 16.0869 4.00781 16.0869H5.13867C5.60102 16.087 5.97645 16.4736 5.97656 16.9502V18.335C5.97656 18.8117 5.60109 19.1991 5.13867 19.1992H3.79492C3.33256 19.1991 2.95703 18.8117 2.95703 18.335V17.1699C2.95703 16.8824 2.84692 16.6079 2.64941 16.4043C2.45311 16.2007 2.186 16.087 1.90723 16.0869H0.837891C0.375401 16.0869 0 15.6995 0 15.2227V13.8379C8.95772e-05 13.3612 0.375456 12.9758 0.837891 12.9746H2.17969ZM10.1045 16.0869C10.5671 16.0869 10.9422 16.4733 10.9424 16.9502V18.334C10.9424 18.811 10.5672 19.1982 10.1045 19.1982H8.7627C8.3 19.1982 7.9248 18.811 7.9248 18.334V16.9502C7.925 16.4733 8.30012 16.0869 8.7627 16.0869H10.1045ZM15.0723 16.0869C15.5347 16.0871 15.91 16.4734 15.9102 16.9502V18.334C15.9102 18.8109 15.5348 19.1981 15.0723 19.1982H13.7295C13.2669 19.1981 12.8916 18.8109 12.8916 18.334V16.9502C12.8918 16.4734 13.267 16.0871 13.7295 16.0869H15.0723ZM15.9277 0C16.3902 0 16.7656 0.387461 16.7656 0.864258V1.95312C16.7657 2.2154 16.867 2.46693 17.0459 2.65137L17.1729 2.78223C17.3517 2.96646 17.5955 3.07028 17.8486 3.07031H18.8721C19.3346 3.07031 19.71 3.45777 19.71 3.93457V12.4414L19.7129 12.4434C19.7129 12.9201 19.3374 13.3075 18.875 13.3076H6.87695C6.41446 13.3076 6.03906 12.9202 6.03906 12.4434V11.2578C6.03906 11.0278 5.95082 10.8082 5.79395 10.6465L5.79004 10.6426C5.56929 10.4152 5.26925 10.2871 4.95801 10.2871H3.94531C3.48292 10.2871 3.10758 9.90048 3.10742 9.42383V0.864258C3.10742 0.387461 3.48282 0 3.94531 0H15.9277ZM6.89844 3.0459C6.43618 3.04616 6.06154 3.43256 6.06152 3.90918V9.15039C6.06153 9.47262 6.18452 9.7802 6.40527 10.0078C6.56331 10.1695 6.7761 10.2607 6.99805 10.2607H15.9199C16.3823 10.2607 16.7577 9.87408 16.7578 9.39746V4.03223C16.7577 3.77 16.6564 3.51839 16.4775 3.33398H16.4785C16.2984 3.14962 16.054 3.0459 15.8008 3.0459H6.89844ZM9.70117 5.31934C10.1635 5.31959 10.5378 5.70596 10.5381 6.18262V7.39258C10.5381 7.86945 10.1637 8.25658 9.70117 8.25684H8.52734C8.06462 8.25684 7.68945 7.86961 7.68945 7.39258V6.18262C7.6897 5.7058 8.06477 5.31934 8.52734 5.31934H9.70117ZM14.2383 5.31934C14.7009 5.31934 15.0759 5.7058 15.0762 6.18262V7.39258C15.0762 7.86961 14.701 8.25684 14.2383 8.25684H13.0645C12.6019 8.25667 12.2266 7.86951 12.2266 7.39258V6.18262C12.2268 5.7059 12.602 5.3195 13.0645 5.31934H14.2383Z" fill="#000000"/>
          </g>
        </svg>`,
    
        news: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
          <path d="M18 14h-8"></path>
          <path d="M15 18h-5"></path>
          <path d="M10 6h8v4h-8V6Z"></path>
        </svg>`,
    
        academic: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5 7.49978V11.9998M16.065 8.19128C16.1992 8.13205 16.3132 8.03473 16.3927 7.91138C16.4722 7.78803 16.5137 7.64407 16.5122 7.49733C16.5107 7.35059 16.4662 7.20752 16.3841 7.08584C16.3021 6.96416 16.1862 6.86922 16.0507 6.81278L9.62247 3.88478C9.42705 3.79564 9.21476 3.74951 8.99997 3.74951C8.78518 3.74951 8.57289 3.79564 8.37747 3.88478L1.94997 6.80978C1.81645 6.86826 1.70286 6.96438 1.6231 7.08639C1.54333 7.2084 1.50085 7.35101 1.50085 7.49678C1.50085 7.64255 1.54333 7.78516 1.6231 7.90717C1.70286 8.02918 1.81645 8.1253 1.94997 8.18378L8.37747 11.1148C8.57289 11.2039 8.78518 11.25 8.99997 11.25C9.21476 11.25 9.42705 11.2039 9.62247 11.1148L16.065 8.19128Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4.5 9.375V12C4.5 12.5967 4.97411 13.169 5.81802 13.591C6.66193 14.0129 7.80653 14.25 9 14.25C10.1935 14.25 11.3381 14.0129 12.182 13.591C13.0259 13.169 13.5 12.5967 13.5 12V9.375" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
    
        business: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          <rect width="20" height="14" x="2" y="6" rx="2"></rect>
        </svg>`,
    
        legal: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
          <path d="M7 21h10"></path>
          <path d="M12 3v18"></path>
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>
        </svg>`,
    
        sport: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M2.1 13.4A10.1 10.1 0 0 0 13.4 21.9"></path>
          <path d="M21.9 10.6A10.1 10.1 0 0 0 10.6 2.1"></path>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
          <path d="M2 12a14.5 14.5 0 0 0 20 0 14.5 14.5 0 0 0-20 0"></path>
        </svg>`,
    
        code: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 12L16.5 9L13.5 6M4.5 6L1.5 9L4.5 12M10.875 3L7.125 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
    
        design: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z"></path>
        </svg>`,
    
        travel: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
        </svg>`,
    
        game: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 1.5H4.5C4.08579 1.5 3.75 1.83579 3.75 2.25V15.75C3.75 16.1642 4.08579 16.5 4.5 16.5H13.5C13.9142 16.5 14.25 16.1642 14.25 15.75V2.25C14.25 1.83579 13.9142 1.5 13.5 1.5Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M6 12.75H9M7.5 11.25V14.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 3.75H12V7.125H6V3.75Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M11.625 12C12.0392 12 12.375 11.6642 12.375 11.25C12.375 10.8358 12.0392 10.5 11.625 10.5C11.2108 10.5 10.875 10.8358 10.875 11.25C10.875 11.6642 11.2108 12 11.625 12Z" fill="currentColor"/>
          <path d="M11.625 15C12.0392 15 12.375 14.6642 12.375 14.25C12.375 13.8358 12.0392 13.5 11.625 13.5C11.2108 13.5 10.875 13.8358 10.875 14.25C10.875 14.6642 11.2108 15 11.625 15Z" fill="currentColor"/>
        </svg>`,
    
        'real-estate': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        </svg>`,
    
        shopping: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
          <path d="M3 6h18"></path>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>`,
    
        finance: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 5v4"></path>
          <rect width="4" height="6" x="7" y="9" rx="1"></rect>
          <path d="M9 15v2"></path>
          <path d="M17 3v2"></path>
          <rect width="4" height="8" x="15" y="5" rx="1"></rect>
          <path d="M17 13v3"></path>
          <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
        </svg>`
      };
    
      // 2. Data configuration for verticals (News, Academic, Business)
      const verticalsData = {
        news: {
          theme: 'news',
          title: 'News',
          iconKey: 'news',
          query: 'Strait of Hormuz shipping disruptions',
          sparkleColor: '#039855',
          metaStats: '2 subjects · 10 articles · 89 ms',
          cards: [
            {
              time: '05:26:15',
              domain: 'sbs.com.au',
              title: 'Houthis advance along Yemen coast, threaten Saudi oil exports in the Red Sea',
              isLatest: false
            },
            {
              time: '05:27:44',
              domain: 'sbs.com.au',
              title: 'Houthi rebels seize strategic port city in Yemen, escalating US-Iran crisis',
              isLatest: false
            },
            {
              time: '06:45:31',
              domain: 'cnbc.com',
              title: 'While You Were Sleeping: 5 stories you might have missed, Sept 11, 2026',
              isLatest: false
            },
            {
              time: '16:24:02',
              domain: 'indiatoday.in',
              title: 'While You Were Sleeping: 5 stories you might have missed, Sept 11, 2026 | The Straits Timesstraitstimes.com',
              isLatest: false
            },
            {
              time: '10min ago',
              domain: 'bloomberg.com',
              title: 'Hormuz is blocked. Now Bab el-Mandeb is under threat: Why fuel crisis could get worse – IndiaToday',
              isLatest: true
            }
          ]
        },
        academic: {
          theme: 'academic',
          title: 'Academic',
          iconKey: 'academic',
          query: 'Quantum error correction in superconducting qubits',
          sparkleColor: '#0284C7',
          metaStats: '4 journals · 18 papers · 64 ms',
          cards: [
            {
              time: 'May 12, 2026',
              domain: 'nature.com',
              title: 'Demonstration of fault-tolerant logical qubit operations using distributed surface codes',
              isLatest: false
            },
            {
              time: 'June 28, 2026',
              domain: 'arxiv.org',
              title: 'Threshold theorem improvements for transmon qubit architectures under correlated flux noise',
              isLatest: false
            },
            {
              time: 'Aug 14, 2026',
              domain: 'science.org',
              title: 'Real-time decoding of topological color codes using low-latency neuromorphic FPGA coprocessors',
              isLatest: false
            },
            {
              time: 'Yesterday',
              domain: 'aps.org',
              title: 'High-fidelity two-qubit gates beyond the fault-tolerance threshold in 3D circuit QED',
              isLatest: false
            },
            {
              time: '10min ago',
              domain: 'nature.com',
              title: 'Breakthrough: Exponential suppression of bit-flip errors in a 100-qubit planar architecture',
              isLatest: true
            }
          ]
        },
        business: {
          theme: 'business',
          title: 'Business',
          iconKey: 'business',
          query: 'Semiconductor supply chain CAPEX forecasts 2026',
          sparkleColor: '#D97706',
          metaStats: '8 filings · 12 reports · 92 ms',
          cards: [
            {
              time: '06:15:20',
              domain: 'wsj.com',
              title: 'Global foundry utilization rates surge to 94% amid AI accelerator demand boom',
              isLatest: false
            },
            {
              time: '08:42:11',
              domain: 'ft.com',
              title: 'TSMC, Samsung revise 2nm fab equipment procurement timelines forward by two quarters',
              isLatest: false
            },
            {
              time: '11:30:45',
              domain: 'reuters.com',
              title: 'ASML raises 2026 High-NA EUV lithography tool shipment guidance to record highs',
              isLatest: false
            },
            {
              time: '14:05:18',
              domain: 'bloomberg.com',
              title: 'Enterprise memory makers announce $18B combined greenfield packaging CAPEX expansions',
              isLatest: false
            },
            {
              time: '10min ago',
              domain: 'bloomberg.com',
              title: 'Semiconductor CAPEX expected to top $215B in 2026 as hyperscaler silicon demand outpaces supply',
              isLatest: true
            }
          ]
        }
      };
    
      // Scenario quick queries mapping for future chips
      const scenarioQueries = {
        'legal': 'Antitrust precedents in AI agent autonomous transactions',
        'sport': 'Champions league tactical pressing metrics and injury risk',
        'code': 'Zero-allocation ring buffer implementation in Rust',
        'design': 'Neomorphic vs Glassmorphic accessible contrast ratios',
        'travel': 'Direct flight routes with biometric passport gates 2026',
        'academic': 'Quantum error correction in superconducting qubits',
        'business': 'Semiconductor supply chain CAPEX forecasts 2026',
        'game': 'Unreal Engine 5.5 Nanite skeletal mesh deformation limits',
        'real estate': 'Commercial logistics yield trends in EMEA ports',
        'real-estate': 'Commercial logistics yield trends in EMEA ports',
        'shopping': 'Carbon-neutral cashmere yarn suppliers global index',
        'finance': 'Federal Reserve repurchase facility liquidity distribution',
        'news': 'Strait of Hormuz shipping disruptions'
      };
    
      // 3. Element selectors
      const tabButtons = document.querySelectorAll('.tab-trigger');
      const heroCanvas = document.getElementById('heroCanvas');
      const canvasWatermarkIcon = document.getElementById('canvasWatermarkIcon');
      const searchInput = document.getElementById('searchPillInput');
      const searchPillIcon = document.getElementById('searchPillIcon');
      const searchPill = document.getElementById('searchPill');
      const searchQueryText = document.getElementById('searchQueryText');
      const typingCursor = document.getElementById('typingCursor');
      const aiSearchAction = document.getElementById('aiSearchAction');
      const scenarioChips = document.querySelectorAll('.scenario-chip');
      const timelineScrollTrack = document.getElementById('timelineScrollTrack');
      const pipelineSpine = document.getElementById('pipelineSpine');
      const searchResultsMeta = document.getElementById('searchResultsMeta');
      const cardsGroup = document.getElementById('cardsGroup');
    
      // Render vertical-specific cards and stats
      function renderVerticalCards(verticalKey) {
        const data = verticalsData[verticalKey] || verticalsData.news;
        if (searchResultsMeta) {
          searchResultsMeta.textContent = data.metaStats;
        }
        const container = cardsGroup || document.getElementById('cardsGroup') || document.querySelector('.news-cards-group');
        if (!container) return;
    
        container.innerHTML = data.cards.map((c, i) => `
          <div class="news-card" data-card-index="${i}">
            <div class="news-card-meta">
              <div class="news-card-time ${c.isLatest ? 'news-card-time-latest' : ''}">
                <img src="/assets/fe-clock.svg" alt="Clock" width="16" height="16" />
                <span>${c.time}</span>
              </div>
              <span class="news-card-domain">${c.domain}</span>
            </div>
            <h3 class="news-card-title">${c.title}</h3>
          </div>
        `).join('');
      }
    
      // Animation Loop Timers & Configuration
      let typeInterval = null;
      let typeTimeout = null;
      let autoLoopTimer = null;
      let cardStepTimer = null;
      let pillStayTimer = null;
      let isLoopPaused = false;
      let hasStartedAnimation = false;
      let currentStep = 1;
      let currentScrollStep = 0;
      const VISIBLE_CARDS_COUNT = 3;
      const TOTAL_CARDS = 5;
      const MAX_SCROLL_STEPS = TOTAL_CARDS - VISIBLE_CARDS_COUNT; // 2 steps (steps 0, 1, 2)
      const STEP_DISPLACEMENT_Y = 158; // 118px card height + 40px gap

      // Dynamically update the timeline spine height to reach exactly the bottom visible card
      function updateSpineHeight(bottomCardIndex) {
        if (!pipelineSpine) return;
        if (bottomCardIndex < 0) {
          pipelineSpine.style.height = '0px';
          return;
        }
        // Starts at top: -40px and extends down through all visible cards to bottom of bottomCardIndex
        const spineHeight = 40 + (bottomCardIndex * STEP_DISPLACEMENT_Y) + 118;
        pipelineSpine.style.height = `${spineHeight}px`;
      }
    
      // 4. Character-by-Character Typewriter Function for query input
      function clearTypewriter() {
        if (typeInterval) {
          clearInterval(typeInterval);
          typeInterval = null;
        }
        if (typeTimeout) {
          clearTimeout(typeTimeout);
          typeTimeout = null;
        }
      }
    
      function startTypewriter(targetQuery, onComplete) {
        clearTypewriter();
    
        if (!searchQueryText) {
          if (searchInput) searchInput.value = targetQuery;
          if (onComplete) onComplete();
          return;
        }
    
        if (typingCursor) {
          typingCursor.style.display = 'inline-block';
        }
    
        searchQueryText.textContent = '';
        if (searchInput) searchInput.value = '';
    
        let charIdx = 0;
        typeInterval = setInterval(() => {
          charIdx++;
          if (charIdx <= targetQuery.length) {
            const partial = targetQuery.slice(0, charIdx);
            searchQueryText.textContent = partial;
            if (searchInput) searchInput.value = partial;
          } else {
            clearInterval(typeInterval);
            typeInterval = null;
            searchQueryText.textContent = targetQuery;
            if (searchInput) searchInput.value = targetQuery;
    
            // Keep blinking cursor for 1.2s so user can read complete prompt before next step
            if (onComplete) {
              typeTimeout = setTimeout(() => {
                if (typingCursor && currentStep !== 1) {
                  typingCursor.style.display = 'none';
                }
                onComplete();
              }, 1200);
            }
          }
        }, 36); // ~36ms per char (smooth human typing rhythm)
      }
    
      // 5. Update All Icons in the Huge Card
      function updateCardIcons(iconKey, sparkleColor) {
        const svgHtml = ICONS[iconKey] || ICONS.news;
    
        // A. Update search pill icon (Figma node-id=13631:181644: logo-variable)
        if (searchPillIcon) {
          searchPillIcon.innerHTML = ICONS.logoVariable;
          searchPillIcon.classList.remove('icon-pop');
          void searchPillIcon.offsetWidth; // Force CSS reflow to re-trigger animation
          searchPillIcon.classList.add('icon-pop');
        }
    
        // B. Update background watermark icon with fade animation
        if (canvasWatermarkIcon) {
          canvasWatermarkIcon.innerHTML = svgHtml;
          canvasWatermarkIcon.classList.remove('watermark-pop');
          void canvasWatermarkIcon.offsetWidth; // Force CSS reflow
          canvasWatermarkIcon.classList.add('watermark-pop');
        }
    
        // C. Update AI search sparkle accent color
        if (aiSearchAction && sparkleColor) {
          const sparklePath = aiSearchAction.querySelector('path#Vector');
          if (sparklePath) {
            sparklePath.setAttribute('fill', sparkleColor);
          }
        }
      }
    
      // 6. Set Step Function
      function setNewsStep(stepNum) {
        currentStep = stepNum;
        if (heroCanvas) {
          heroCanvas.setAttribute('data-news-step', String(stepNum));
        }
        if (stepNum !== 1) {
          if (typingCursor) {
            typingCursor.style.display = 'none';
          }
        }
        if (stepNum === 3) {
          // When Step 3 begins, do NOT hide searchPill immediately.
          // It stays visible at top: 36px so users can read the statistics info (e.g. "2 subjects · 10 articles · 89 ms")
          if (searchPill) {
            searchPill.classList.remove('pill-out');
          }
        } else {
          clearCardStepTimer();
          currentScrollStep = 0;
          if (searchPill) {
            searchPill.classList.remove('pill-out');
          }
          if (timelineScrollTrack) {
            timelineScrollTrack.style.transform = 'translateX(-50%) translateY(0)';
          }
          updateSpineHeight(-1);
          const allCards = document.querySelectorAll('.news-card');
          allCards.forEach(c => c.classList.remove('card-revealed'));
        }
      }
    
      function clearCardStepTimer() {
        if (cardStepTimer) {
          clearTimeout(cardStepTimer);
          cardStepTimer = null;
        }
        if (pillStayTimer) {
          clearTimeout(pillStayTimer);
          pillStayTimer = null;
        }
      }
    
      function clearNewsAutoLoop() {
        clearTypewriter();
        if (autoLoopTimer) {
          clearTimeout(autoLoopTimer);
          autoLoopTimer = null;
        }
        clearCardStepTimer();
      }
    
      // 7. Step 3: Sequentially Stepped 3-Card Timeline Stream Animation
      function stepToWindow(stepIndex) {
        if (currentStep !== 3) return;
        currentScrollStep = stepIndex;
    
        const allCards = document.querySelectorAll('.news-card');
    
        if (currentScrollStep === 0) {
          allCards.forEach(c => c.classList.remove('card-revealed'));
          updateSpineHeight(-1);
    
          // 1. Initial State of Step 3:
          // Keep search pill at top (top: 36px) showing the query and synthesis statistics
          // e.g. "2 subjects · 10 articles · 89 ms"
          if (searchPill) {
            searchPill.classList.remove('pill-out');
          }
          // Position timeline track slightly lower (translateY: 136px) so Card 0 appears right below the search pill
          if (timelineScrollTrack) {
            timelineScrollTrack.style.transform = 'translateX(-50%) translateY(136px)';
          }
    
          // Reveal Card 0 and Card 1 emerging under the search pill
          setTimeout(() => {
            if (currentStep !== 3) return;
            if (allCards[0]) allCards[0].classList.add('card-revealed');
            updateSpineHeight(0);
          }, 80);

          setTimeout(() => {
            if (currentStep !== 3) return;
            if (allCards[1]) allCards[1].classList.add('card-revealed');
            updateSpineHeight(1);
          }, 260);
    
          // 2. Stay for 2.0 seconds so user clearly reads the statistics ("2 subjects · 10 articles · 89 ms")
          pillStayTimer = setTimeout(() => {
            if (isLoopPaused || currentStep !== 3) return;

            // Search pill now glides smoothly upward out of the canvas
            if (searchPill) {
              searchPill.classList.add('pill-out');
            }

            // Timeline track smoothly glides upward into standard centered 3-card view (translateY: 0)
            if (timelineScrollTrack) {
              timelineScrollTrack.style.transform = 'translateX(-50%) translateY(0)';
            }

            // Card 2 emerges at the bottom slot of the 3-card screen
            setTimeout(() => {
              if (currentStep !== 3) return;
              if (allCards[2]) allCards[2].classList.add('card-revealed');
              updateSpineHeight(2);
            }, 200);

            // 3. Hold for 2.2s for user to view the full 3-card screen (Cards 0, 1, 2)
            cardStepTimer = setTimeout(() => {
              if (isLoopPaused || currentStep !== 3) return;
              stepToWindow(1);
            }, 2200);
          }, 2000);
          return;
        }
    
        // Shift track upward so exactly 3 cards remain in screen,
        // and the newly emerging card slides into view at the BOTTOM slot
        const moveY = currentScrollStep * STEP_DISPLACEMENT_Y;
        if (timelineScrollTrack) {
          timelineScrollTrack.style.transform = `translateX(-50%) translateY(-${moveY}px)`;
        }
    
        // Reveal newly emerging card at the bottom slot (index = currentScrollStep + 2)
        const bottomCardIndex = currentScrollStep + VISIBLE_CARDS_COUNT - 1;
        if (allCards[bottomCardIndex]) {
          allCards[bottomCardIndex].classList.add('card-revealed');
        }
        updateSpineHeight(bottomCardIndex);
    
        if (currentScrollStep < MAX_SCROLL_STEPS) {
          // Pause 2.0s on intermediate window (+ 750ms translation transition)
          cardStepTimer = setTimeout(() => {
            if (isLoopPaused || currentStep !== 3) return;
            stepToWindow(currentScrollStep + 1);
          }, 2000 + 750);
        } else {
          // Final 3-card window (Cards 2, 3, 4 with Card 4 latest) has finished sliding into view at the bottom!
          // Stay for a full 3.0s (3000ms + 750ms transition)
          // Then automatically switch to the next vertical (News -> Academic -> Business -> News)
          cardStepTimer = setTimeout(() => {
            if (isLoopPaused || currentStep !== 3) return;
            switchToNextVertical();
          }, 3000 + 750);
        }
      }
    
      // Vertical sequence order for automated rotation
      const VERTICAL_ORDER = ['news', 'academic', 'business'];
    
      function switchToNextVertical() {
        const activeTab = document.querySelector('.tab-trigger.active');
        const currentTabKey = activeTab ? activeTab.getAttribute('data-tab') : 'news';
        const currentIndex = VERTICAL_ORDER.indexOf(currentTabKey);
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % VERTICAL_ORDER.length : 0;
        const nextKey = VERTICAL_ORDER[nextIndex];
        switchVertical(nextKey);
      }
    
      function runStep3SequentialStream() {
        clearCardStepTimer();
        stepToWindow(0);
      }
    
      // 8. Continuous Automated 1 → 2 → 3 Animation Loop for Active Vertical (News / Academic / Business)
      function runVerticalCycle() {
        clearNewsAutoLoop();
    
        const activeTab = document.querySelector('.tab-trigger.active');
        const currentTabKey = activeTab ? activeTab.getAttribute('data-tab') : 'news';
        const targetData = verticalsData[currentTabKey] || verticalsData.news;
    
        // Render this vertical's cards & meta stats before starting cycle
        renderVerticalCards(currentTabKey);
    
        // Step 1: Query Input with Character-by-Character Typewriter effect
        setNewsStep(1);
    
        const queryTarget = targetData.query;
        startTypewriter(queryTarget, () => {
          if (isLoopPaused || currentStep !== 1) return;
    
          // Step 2: Searching with 14 wave dots (1.8s)
          setNewsStep(2);
    
          autoLoopTimer = setTimeout(() => {
            if (isLoopPaused || currentStep !== 2) return;
    
            // Step 3: Stream Results (Sequentially stepped timeline stream)
            setNewsStep(3);
            runStep3SequentialStream();
          }, 1800);
        });
      }
    
      // Hover on hero canvas in Step 3 pauses upward movement; resume on mouseleave
      if (heroCanvas) {
        heroCanvas.addEventListener('mouseenter', () => {
          if (currentStep === 3) {
            isLoopPaused = true;
            clearCardStepTimer();
          }
        });
    
        heroCanvas.addEventListener('mouseleave', () => {
          if (isLoopPaused && currentStep === 3) {
            isLoopPaused = false;
            clearCardStepTimer();

            // Check if we were paused during the initial stay or during scrolling
            if (searchPill && !searchPill.classList.contains('pill-out')) {
              // Paused during initial stay: continue stay for remaining 1.2s then slide up
              pillStayTimer = setTimeout(() => {
                if (isLoopPaused || currentStep !== 3) return;
                if (searchPill) searchPill.classList.add('pill-out');
                if (timelineScrollTrack) timelineScrollTrack.style.transform = 'translateX(-50%) translateY(0)';
                setTimeout(() => {
                  if (currentStep !== 3) return;
                  const allCards = document.querySelectorAll('.news-card');
                  if (allCards[2]) allCards[2].classList.add('card-revealed');
                  updateSpineHeight(2);
                }, 200);

                cardStepTimer = setTimeout(() => {
                  if (isLoopPaused || currentStep !== 3) return;
                  stepToWindow(1);
                }, 2200);
              }, 1200);
            } else {
              // Paused during scrolling:
              const resumeDelay = (currentScrollStep >= MAX_SCROLL_STEPS) ? 3000 : 2000;
              cardStepTimer = setTimeout(() => {
                if (isLoopPaused || currentStep !== 3) return;
                if (currentScrollStep < MAX_SCROLL_STEPS) {
                  stepToWindow(currentScrollStep + 1);
                } else {
                  switchToNextVertical();
                }
              }, resumeDelay);
            }
          }
        });
      }
    
      // 9. Switch Vertical (News / Academic / Business)
      function switchVertical(key, autoStart = true) {
        const target = verticalsData[key];
        if (!target) return;
    
        // Update active tab button classes
        tabButtons.forEach(btn => {
          const tabKey = btn.getAttribute('data-tab');
          const isCurrent = tabKey === key;
          btn.classList.toggle('active', isCurrent);
          btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        });
    
        // Update canvas theme gradient
        if (heroCanvas) {
          heroCanvas.setAttribute('data-theme', target.theme);
        }
    
        // Update both the search pill icon & the card watermark icon
        updateCardIcons(target.iconKey, target.sparkleColor);
    
        // Reset loop state
        clearNewsAutoLoop();
        isLoopPaused = false;

        if (autoStart) {
          hasStartedAnimation = true;
          runVerticalCycle();
        } else {
          // Prepare static initial layout (Step 1) without triggering timers
          setNewsStep(1);
          renderVerticalCards(key);
          if (searchQueryText) searchQueryText.textContent = '';
          if (searchInput) searchInput.value = '';
          if (typingCursor) typingCursor.style.display = 'inline-block';
        }
      }

      // 10. Attach Tab Click Listeners
      tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const tabKey = btn.getAttribute('data-tab');
          hasStartedAnimation = true;
          switchVertical(tabKey, true);
        });
      });
    
      // 11. Interactive Scenario Chips
      scenarioChips.forEach(chip => {
        chip.addEventListener('click', () => {
          const rawText = chip.textContent.trim().toLowerCase();
          const normalizedKey = rawText.replace(/\s+/g, '-');
    
          // If matches top tabs, switch normally
          if (verticalsData[normalizedKey]) {
            hasStartedAnimation = true;
            switchVertical(normalizedKey, true);
            return;
          }
    
          // Otherwise, update query & card icons for this scenario
          const customQuery = scenarioQueries[rawText] || scenarioQueries[normalizedKey];
          if (customQuery) {
            hasStartedAnimation = true;
            clearNewsAutoLoop();
            setNewsStep(1);
            startTypewriter(customQuery);
            updateCardIcons(normalizedKey, '#039855');
    
            // Gentle feedback bounce on search pill
            if (searchPill) {
              searchPill.style.transform = 'translate(-50%, -54%) scale(1.02)';
              searchPill.style.borderColor = 'rgba(255, 255, 255, 0.85)';
              setTimeout(() => {
                searchPill.style.transform = '';
                searchPill.style.borderColor = '';
              }, 240);
            }
          }
        });
      });
    
      function playVerticalFlow() {
        hasStartedAnimation = true;
        clearNewsAutoLoop();
        isLoopPaused = false;
        runVerticalCycle();
      }
    
      // 12. AI Search Button Click Effect (Triggers vertical flow)
      if (aiSearchAction) {
        aiSearchAction.addEventListener('click', () => {
          playVerticalFlow();
        });
      }
    
      // 13. Enter key triggers AI search pulse / News flow
      if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            if (aiSearchAction) aiSearchAction.click();
          }
        });
      }
    
      // 14. Initial static setup to populate icons, cards & layout cleanly (without auto-animating yet)
      switchVertical('news', false);

      // 15. Scroll-triggered animation entry: Only start animation cycle when scrolled into visible area
      function startAnimationSequence() {
        if (hasStartedAnimation) return;
        hasStartedAnimation = true;
        runVerticalCycle();
      }

      const triggerTarget = heroCanvas || document.getElementById('vertical-search') || document.querySelector('.vertical-search-section');

      if (triggerTarget && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              startAnimationSequence();
              obs.disconnect(); // Animation cycle initiated, disconnect observer
            }
          });
        }, {
          threshold: 0.15, // Trigger when at least 15% of the canvas/section enters the viewport
          rootMargin: '0px 0px -30px 0px'
        });

        observer.observe(triggerTarget);
      } else {
        // Fallback for environments without IntersectionObserver
        startAnimationSequence();
      }
    
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVerticalSearchSubpage);
  } else {
    initVerticalSearchSubpage();
  }
})();
