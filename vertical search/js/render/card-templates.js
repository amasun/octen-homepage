/**
 * Card HTML Template Generators (Subject Cards & Business Entity Cards)
 * Strictly aligned with NEWS_SEARCH_ANIMATION_SPEC.md & BUSINESS_SEARCH_SPEC.md
 */
import { formatDate, formatDateTime, extractDomain } from '../data/verticals-data.js';

export function formatMoneyCompact(val, currency = 'USD') {
  if (val == null) return '';
  const sym = currency === 'USD' ? '$' : currency + ' ';
  if (Math.abs(val) >= 1e12) {
    const num = Math.abs(val) / 1e12;
    const numStr = Number.isInteger(num) ? num.toString() : num.toFixed(1);
    return `${val < 0 ? '-' : ''}${sym}${numStr}T`;
  }
  if (Math.abs(val) >= 1e9) {
    const num = Math.abs(val) / 1e9;
    const numStr = Number.isInteger(num) ? num.toString() : num.toFixed(1);
    return `${val < 0 ? '-' : ''}${sym}${numStr}B`;
  }
  if (Math.abs(val) >= 1e6) {
    return `${val < 0 ? '-' : ''}${sym}${(Math.abs(val) / 1e6).toFixed(0)}M`;
  }
  return `${val < 0 ? '-' : ''}${sym}${val.toLocaleString()}`;
}

export function formatStockTicker(ticker) {
  if (!ticker) return 'NVDA · NASDAQ';
  if (ticker.startsWith('XNAS:') || ticker.toUpperCase().includes('NASDAQ')) {
    return ticker.replace(/^(XNAS:|NASDAQ:\s*)/i, '').trim() + ' · NASDAQ';
  }
  if (ticker.startsWith('NYSE:') || ticker.toUpperCase().includes('NYSE')) {
    return ticker.replace(/^NYSE:\s*/i, '').trim() + ' · NYSE';
  }
  return ticker;
}

// ----------------------------------------------------
// NEWS SEARCH TEMPLATES
// ----------------------------------------------------

export function createSubjectCardHTML(subject, index, isFirst = false) {
  const dStart = formatDate(subject.timeStart);
  const dLatest = formatDate(subject.timeLatest);
  const dateRangeStr = (dStart && dLatest && dStart !== dLatest) ? `${dStart} – ${dLatest}` : (dLatest || dStart);

  return `
    <div class="subject-card-wrapper" data-subject-card="true" ${isFirst ? 'data-first-subject="true"' : 'data-other-subject="true"'} style="position: relative;">
      <article class="subject-card-box">
        <div class="subject-card-top">
          <span class="subject-date-range">${dateRangeStr}</span>
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

export function createArticleCardHTML(article, index) {
  return `
    <div class="article-card-wrapper" data-article="${index}" style="position: relative; opacity: 0; transform: translateY(28px);">
      <span class="timeline-node-circle visible" data-rail-node="true">
        <span class="core-dot"></span>
      </span>
      <article class="article-card-box">
        <div class="article-card-top">
          <span class="article-timestamp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${formatDateTime(article.timePublished)}
          </span>
          <span class="article-source-domain">${extractDomain(article.url)}</span>
        </div>
        <p class="article-title">${article.title}</p>
      </article>
    </div>
  `;
}

// ----------------------------------------------------
// BUSINESS SEARCH TEMPLATES (Overview Summary Cards & Details)
// ----------------------------------------------------

/**
 * Helper to prepare, sort (newest on top), and format timeline items
 * Ensures the newest item is at index 0, formatted with 'xxm ago', and marked as latest
 */
export function prepareTimelineItems(items, defaultRelative = '12m ago') {
  if (!items || !items.length) return [];
  // Sort descending: newest timestamp first
  const sorted = [...items].sort((a, b) => {
    if (a.isLatest && !b.isLatest) return -1;
    if (!a.isLatest && b.isLatest) return 1;
    const timeA = new Date(a.timePublished || a.time_published || 0).getTime();
    const timeB = new Date(b.timePublished || b.time_published || 0).getTime();
    return timeB - timeA;
  });

  return sorted.map((item, idx) => {
    const isTop = idx === 0;
    let time = item.timeDisplay;
    if (isTop) {
      time = item.relativeTime || (item.timeDisplay && item.timeDisplay.includes('ago') ? item.timeDisplay : defaultRelative);
    } else if (!time || time.includes('ago')) {
      const pub = item.timePublished || item.time_published;
      time = pub ? formatDateTime(pub) : '2026/09/11 07:58:07';
    }
    const domain = item.source || item.authors || (item.url ? extractDomain(item.url) : 'biz.com');
    return {
      ...item,
      time,
      domain,
      isLatest: isTop
    };
  });
}

/**
 * Stage 3: Business Summary Card (Two cards: Company & Person)
 */
export function createBusinessSummaryCardHTML(entity, index) {
  const isCompany = entity.type === 'company';
  const ids = entity.identifiers || {};
  const stock = entity.metrics?.stock || {};
  const fin = Array.isArray(entity.metrics?.financials) 
    ? (entity.metrics.financials[0] || {}) 
    : (entity.metrics?.financials || {});
  
  let valuationVal = null;
  if (Array.isArray(entity.metrics?.funding)) {
    const valObj = entity.metrics.funding.find(f => f.valuation != null);
    valuationVal = valObj ? valObj.valuation : entity.metrics.funding[0]?.amount;
  } else if (entity.metrics?.funding?.valuation != null) {
    valuationVal = entity.metrics.funding.valuation;
  }

  const pos = entity.current_position || {};
  const activities = entity.activities || [];
  const firstAct = activities[0] || null;

  if (isCompany) {
    const compPeople = (entity.key_people && entity.key_people.length) 
      ? entity.key_people.slice(0, 2) 
      : [
          { name: 'Jensen Huang', title: 'Founder, President & CEO' },
          { name: 'Colette Kress', title: 'EVP & CFO' }
        ];

    const compActivities = prepareTimelineItems(entity.activities || [], '15m ago');
    const compNews = prepareTimelineItems(entity.news || [], '18m ago');

    const actDateStr = compActivities[0]?.time || '15m ago';
    const actTitle = compActivities[0]?.title || firstAct?.title || 'Financial Reports & Corporate Developments';
    const tickerStr = formatStockTicker(ids.stock_ticker) || 'NVDA · NASDAQ';
    const isNvda = (entity.name && entity.name.toLowerCase().includes('nvidia')) || entity.id === 'nvidia';
    const defaultLogo = isNvda ? './images/vertical/nvidia-logo.svg' : './images/vertical/coupang-logo.png';
    const logoSrc = entity.logo?.url || defaultLogo;

    return `
      <div class="business-card-wrapper" data-business-card="true" data-entity-idx="${index}">
        <article class="business-summary-card-box biz-figma-card" data-biz-type="company" data-entity-idx="${index}">
          <div class="biz-overview-scroll-area">
            <!-- Company Header -->
            <div class="biz-figma-header">
              <div class="biz-figma-logo-wrap">
                <img src="${logoSrc}" alt="${entity.name || 'Company'} Logo" class="biz-figma-logo-img" onerror="this.onerror=null;this.src='${defaultLogo}';" />
              </div>
              <div class="biz-figma-header-info">
                <div class="biz-figma-title-row">
                  <h3 class="biz-figma-title">${entity.name || 'NVIDIA'}</h3>
                  <span class="biz-figma-tag biz-tag-company">Company</span>
                </div>
                <div class="biz-figma-links-row">
                  <div class="biz-figma-link-item">
                    <img src="./images/vertical/stock-icon.svg" alt="" class="biz-figma-link-icon" />
                    <span class="biz-figma-link-text">${tickerStr}</span>
                  </div>
                  <div class="biz-figma-link-item">
                    <img src="./images/vertical/city-icon.svg" alt="" class="biz-figma-link-icon" />
                    <span class="biz-figma-link-text">${ids.website || 'nvidia.com'}</span>
                  </div>
                  <div class="biz-figma-link-item">
                    <img src="./images/vertical/linkedin-icon.svg" alt="" class="biz-figma-link-icon" />
                    <span class="biz-figma-link-text">Linkedin</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="biz-figma-desc">
              ${entity.summary || 'Pioneer in accelerated computing and modern AI, delivering full-stack data-center-scale offerings.'}
            </p>

            <!-- Stats Grid -->
            <div class="biz-figma-stats-grid">
              <div class="biz-figma-stat-cell">
                <span class="biz-figma-stat-label">STOCK PRICE</span>
                <div class="biz-figma-stat-val-row">
                  <span class="biz-figma-stat-val">$${stock.price != null ? Number(stock.price).toFixed(2) : '230.74'}</span>
                  <span class="biz-figma-stat-sub ${stock.todays_change_percent < 0 ? 'biz-color-neg' : ''}">${stock.todays_change_percent != null ? (stock.todays_change_percent > 0 ? '+' : '') + Number(stock.todays_change_percent).toFixed(2) + '%' : '-2.83%'}</span>
                </div>
              </div>
              <div class="biz-figma-stat-cell">
                <span class="biz-figma-stat-label">52-WEEK HIGH</span>
                <div class="biz-figma-stat-val-row">
                  <span class="biz-figma-stat-val">$${stock.week_52_high != null ? Number(stock.week_52_high).toFixed(2) : '243.37'}</span>
                </div>
              </div>
              <div class="biz-figma-stat-cell">
                <span class="biz-figma-stat-label">52-WEEK LOW</span>
                <div class="biz-figma-stat-val-row">
                  <span class="biz-figma-stat-val">$${stock.week_52_low != null ? Number(stock.week_52_low).toFixed(2) : '164.27'}</span>
                </div>
              </div>
              <div class="biz-figma-stat-cell">
                <span class="biz-figma-stat-label">REVENUE</span>
                <div class="biz-figma-stat-val-row">
                  <span class="biz-figma-stat-val">${formatMoneyCompact(fin.revenue) || '$81.6B'}</span>
                </div>
              </div>
              <div class="biz-figma-stat-cell">
                <span class="biz-figma-stat-label">NET INCOME</span>
                <div class="biz-figma-stat-val-row">
                  <span class="biz-figma-stat-val ${(fin.net_income || 0) < 0 ? 'biz-color-neg' : ''}">${formatMoneyCompact(fin.net_income) || '$58.3B'}</span>
                </div>
              </div>
              <div class="biz-figma-stat-cell">
                <span class="biz-figma-stat-label">VALUATION</span>
                <div class="biz-figma-stat-val-row">
                  <span class="biz-figma-stat-val">${formatMoneyCompact(valuationVal) || '$5.0T'}</span>
                </div>
              </div>
            </div>

            <!-- Compact-Only Activity Bar -->
            <div class="biz-figma-activity-bar biz-overview-compact-only">
              <img src="./images/vertical/activity-dot.svg" alt="" class="biz-figma-act-dot" />
              <span class="biz-figma-act-date">${actDateStr}</span>
              <span class="biz-figma-act-title" title="${actTitle}">${actTitle}</span>
            </div>

            <!-- Expanded-Only Full Sections (Figma 13810:169821) -->
            <div class="biz-overview-full-sections">
              <!-- Key People -->
              <div class="biz-figma-sec-group">
                <h4 class="biz-figma-sec-title">Key People</h4>
                <div class="biz-figma-people-row">
                  ${compPeople.map(p => `
                    <div class="biz-figma-person-pill" title="${p.name} · ${p.title}">
                      <span class="biz-figma-person-name" title="${p.name}">${p.name}</span>
                      <span class="biz-figma-person-role" title="${p.title}">${p.title}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Official Activities -->
              <div class="biz-figma-sec-group">
                <h4 class="biz-figma-sec-title">Official Activities</h4>
                <div class="biz-figma-subcard">
                  <div class="biz-figma-timeline-list">
                    ${compActivities.map(act => `
                      <div class="biz-figma-timeline-row">
                        <span class="biz-figma-timeline-dot"></span>
                        <div class="biz-figma-timeline-meta">
                          <span class="biz-figma-timeline-time">${act.time}</span>
                          ${act.isLatest ? '<span class="timeline-latest-tag biz-figma-tag-latest">latest</span>' : ''}
                          <span class="biz-figma-timeline-domain">${act.domain}</span>
                        </div>
                        <p class="biz-figma-timeline-title" title="${act.title}">${act.title}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Media News -->
              <div class="biz-figma-sec-group">
                <h4 class="biz-figma-sec-title">Media News</h4>
                <div class="biz-figma-subcard">
                  <div class="biz-figma-timeline-list">
                    ${compNews.map(item => `
                      <div class="biz-figma-timeline-row">
                        <span class="biz-figma-timeline-dot"></span>
                        <div class="biz-figma-timeline-meta">
                          <span class="biz-figma-timeline-time">${item.time}</span>
                          ${item.isLatest ? '<span class="timeline-latest-tag biz-figma-tag-latest">latest</span>' : ''}
                          <span class="biz-figma-timeline-domain">${item.domain}</span>
                        </div>
                        <p class="biz-figma-timeline-title" title="${item.title}">${item.title}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Handle -->
          <div class="biz-figma-handle-wrap" title="Hover to view details">
            <div class="biz-figma-handle-bar"></div>
          </div>
        </article>
      </div>
    `;
  } else {
    // Person Summary Card (Jensen Huang)
    const persCareer = entity.career || [
      { organization: 'NVIDIA Corporation', title: 'Founder, President & CEO', start: '1993', end: null },
      { organization: 'LSI Logic', title: 'Director, Coreware', start: '1985', end: '1993' },
      { organization: 'Advanced Micro Devices (AMD)', title: 'Microprocessor Designer', start: '1984', end: '1985' }
    ];
    const persActivities = prepareTimelineItems(entity.activities || [], '3d ago');
    const persNews = prepareTimelineItems(entity.news || [], 'Aug 26');

    const isJh = (entity.name && entity.name.toLowerCase().includes('jensen')) || entity.id === 'jensen-huang';
    const defaultAvatar = isJh ? './images/vertical/jensen-huang-avatar.svg' : './images/vertical/bom-kim-avatar.svg';
    const avatarSrc = entity.avatar?.url || defaultAvatar;

    return `
      <div class="business-card-wrapper" data-business-card="true" data-entity-idx="${index}">
        <article class="business-summary-card-box biz-figma-card" data-biz-type="person" data-entity-idx="${index}">
          <div class="biz-overview-scroll-area">
            <!-- CEO / Leader Header -->
            <div class="biz-figma-header">
              <div class="biz-figma-avatar-wrap">
                <img src="${avatarSrc}" alt="${entity.name || 'Person'} Avatar" class="biz-figma-avatar-img" onerror="this.onerror=null;this.src='${defaultAvatar}';" />
              </div>
              <div class="biz-figma-header-info">
                <div class="biz-figma-title-row">
                  <h3 class="biz-figma-title">${entity.name || 'Jensen Huang'}</h3>
                  <span class="biz-figma-tag biz-tag-person">Person</span>
                </div>
                <div class="biz-figma-links-row">
                  <div class="biz-figma-link-item">
                    <img src="./images/vertical/id-card-icon.svg" alt="" class="biz-figma-link-icon" />
                    <span class="biz-figma-link-text">${pos.title || entity.current_position?.title || 'Founder, President & CEO'}</span>
                  </div>
                  <div class="biz-figma-link-item">
                    <img src="./images/vertical/linkedin-icon.svg" alt="" class="biz-figma-link-icon" />
                    <span class="biz-figma-link-text">Linkedin</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="biz-figma-desc">
              ${entity.summary || 'Co-founder, President and CEO of NVIDIA since 1993. Under his leadership, NVIDIA invented the GPU in 1999 and pioneered accelerated computing.'}
            </p>

            <!-- Expanded-Only Full Sections (Figma 13810:169958) -->
            <div class="biz-overview-full-sections">
              <!-- Career Section -->
              <div class="biz-figma-sec-group">
                <h4 class="biz-figma-sec-title">Career</h4>
                <div class="biz-figma-subcard">
                  <div class="biz-figma-timeline-list">
                    ${persCareer.map(c => {
                      const period = c.end ? `${c.start} – ${c.end}` : `${c.start} – Present`;
                      return `
                        <div class="biz-figma-career-row">
                          <span class="biz-figma-timeline-dot"></span>
                          <span class="biz-figma-career-period">${period}</span>
                          <span class="biz-figma-career-role">${c.title}</span>
                          <span class="biz-figma-career-org">${c.organization}</span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>

              <!-- Activities Section -->
              <div class="biz-figma-sec-group">
                <h4 class="biz-figma-sec-title">Activities</h4>
                <div class="biz-figma-subcard">
                  <div class="biz-figma-timeline-list">
                    ${persActivities.map(a => `
                      <div class="biz-figma-timeline-row">
                        <span class="biz-figma-timeline-dot"></span>
                        <div class="biz-figma-timeline-meta">
                          <span class="biz-figma-timeline-time">${a.time}</span>
                          ${a.isLatest ? '<span class="timeline-latest-tag biz-figma-tag-latest">latest</span>' : ''}
                          <span class="biz-figma-timeline-domain">${a.domain}</span>
                        </div>
                        <p class="biz-figma-timeline-title" title="${a.title}">${a.title}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- News Section -->
              <div class="biz-figma-sec-group">
                <h4 class="biz-figma-sec-title">News</h4>
                <div class="biz-figma-subcard">
                  <div class="biz-figma-timeline-list">
                    ${persNews.map(n => `
                      <div class="biz-figma-timeline-row">
                        <span class="biz-figma-timeline-dot"></span>
                        <div class="biz-figma-timeline-meta">
                          <span class="biz-figma-timeline-time">${n.time}</span>
                          ${n.isLatest ? '<span class="timeline-latest-tag biz-figma-tag-latest">latest</span>' : ''}
                          <span class="biz-figma-timeline-domain">${n.domain}</span>
                        </div>
                        <p class="biz-figma-timeline-title" title="${n.title}">${n.title}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Handle -->
          <div class="biz-figma-handle-wrap" title="Hover to view details">
            <div class="biz-figma-handle-bar"></div>
          </div>
        </article>
      </div>
    `;
  }
}

/**
 * Stage 3 & 4: Dual Accordion Cards (Company on Top, Person on Bottom)
 * Strictly max-height: 414px;
 * Perfectly aligned with user uploaded screenshot
 */
export function createBusinessDualDetailHTML(companyEntity, personEntity, activeMode = 'company') {
  const isCompActive = activeMode === 'company';
  
  // --- Company Data ---
  const comp = companyEntity || {};
  const compIds = comp.identifiers || {};
  const compStock = comp.metrics?.stock || {};
  const compFin = Array.isArray(comp.metrics?.financials) 
    ? (comp.metrics.financials[0] || {}) 
    : (comp.metrics?.financials || {});
  
  let compValuation = null;
  if (Array.isArray(comp.metrics?.funding)) {
    const valObj = comp.metrics.funding.find(f => f.valuation != null);
    compValuation = valObj ? valObj.valuation : comp.metrics.funding[0]?.amount;
  } else if (comp.metrics?.funding?.valuation != null) {
    compValuation = comp.metrics.funding.valuation;
  }

  const compPeople = (comp.key_people && comp.key_people.length) 
    ? comp.key_people.slice(0, 2) 
    : [
        { name: 'Jensen Huang', title: 'Founder, President & CEO' },
        { name: 'Colette Kress', title: 'EVP & CFO' }
      ];

  const compActivities = prepareTimelineItems(comp.activities || [], '15m ago');
  const compNews = prepareTimelineItems(comp.news || [], '18m ago');
  const compFirstAct = compActivities[0] || null;
  const compActTitle = compFirstAct?.title || 'Financial Reports & Corporate Developments';
  const compActDateStr = compFirstAct?.time || '15m ago';
  const compTickerStr = formatStockTicker(compIds.stock_ticker) || 'NVDA · NASDAQ';
  
  const isNvdaComp = (comp.name && comp.name.toLowerCase().includes('nvidia')) || comp.id === 'nvidia';
  const compDefaultLogo = isNvdaComp ? './images/vertical/nvidia-logo.svg' : './images/vertical/coupang-logo.png';
  const compLogoSrc = comp.logo?.url || compDefaultLogo;

  // --- Person Data ---
  const pers = personEntity || {};
  const persPos = pers.current_position || {};
  const persCareer = pers.career || [
    { organization: 'NVIDIA Corporation', title: 'Founder, President & CEO', start: '1993', end: null },
    { organization: 'LSI Logic', title: 'Director, Coreware', start: '1985', end: '1993' },
    { organization: 'Advanced Micro Devices (AMD)', title: 'Microprocessor Designer', start: '1984', end: '1985' }
  ];
  const persActivities = prepareTimelineItems(pers.activities || [], '3d ago');
  const persNews = prepareTimelineItems(pers.news || [], 'Aug 26');

  const isJhPers = (pers.name && pers.name.toLowerCase().includes('jensen')) || pers.id === 'jensen-huang';
  const persDefaultAvatar = isJhPers ? './images/vertical/jensen-huang-avatar.svg' : './images/vertical/bom-kim-avatar.svg';
  const persAvatarSrc = pers.avatar?.url || persDefaultAvatar;

  return `
    <div class="biz-dual-cards-stack" id="bizDualCardsStack">
      <!-- 1. Top Card: Company Detail (Figma 13810:169821) -->
      <article class="biz-accordion-card biz-company-card ${isCompActive ? 'is-expanded' : 'is-collapsed'}" id="bizCompanyAccordionCard" data-entity-type="company" title="${isCompActive ? '' : `Click to expand ${comp.name || 'Company'}`}">
        <!-- Collapsed Bar (Top Card, height 52px) -->
        <div class="biz-card-collapsed-bar biz-company-collapsed-bar">
          <div class="biz-figma-activity-bar" style="background: transparent; height: 24px; padding: 0 2px; margin: 0;">
            <img src="./images/vertical/activity-dot.svg" alt="" class="biz-figma-act-dot" />
            <span class="biz-figma-act-date">${compActDateStr}</span>
            <span class="biz-figma-act-title" title="${compActTitle}">${compActTitle}</span>
          </div>
          <div class="biz-figma-handle-wrap biz-collapsed-handle" style="margin-left: auto; width: auto; padding: 0;">
            <div class="biz-figma-handle-bar"></div>
          </div>
        </div>

        <!-- Expanded Content (Scrollable, strictly contained within 414px card) -->
        <div class="biz-accordion-scroll-area biz-company-expanded-body">
          <!-- Header -->
          <div class="biz-figma-header">
            <div class="biz-figma-logo-wrap">
              <img src="${compLogoSrc}" alt="${comp.name || 'Company'} Logo" class="biz-figma-logo-img" onerror="this.onerror=null;this.src='${compDefaultLogo}';" />
            </div>
            <div class="biz-figma-header-info">
              <div class="biz-figma-title-row">
                <h3 class="biz-figma-title">${comp.name || 'NVIDIA'}</h3>
                <span class="biz-figma-tag biz-tag-company">Company</span>
              </div>
              <div class="biz-figma-links-row">
                <div class="biz-figma-link-item">
                  <img src="./images/vertical/stock-icon.svg" alt="" class="biz-figma-link-icon" />
                  <span class="biz-figma-link-text">${compTickerStr}</span>
                </div>
                <div class="biz-figma-link-item">
                  <img src="./images/vertical/city-icon.svg" alt="" class="biz-figma-link-icon" />
                  <span class="biz-figma-link-text">${compIds.website || 'nvidia.com'}</span>
                </div>
                <div class="biz-figma-link-item">
                  <img src="./images/vertical/linkedin-icon.svg" alt="" class="biz-figma-link-icon" />
                  <span class="biz-figma-link-text">Linkedin</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <p class="biz-figma-desc">
            ${comp.summary || 'Pioneer in accelerated computing and modern AI, delivering full-stack data-center-scale offerings.'}
          </p>

          <!-- Metrics Grid -->
          <div class="biz-figma-stats-grid">
            <div class="biz-figma-stat-cell">
              <span class="biz-figma-stat-label">STOCK PRICE</span>
              <div class="biz-figma-stat-val-row">
                <span class="biz-figma-stat-val">$${compStock.price != null ? Number(compStock.price).toFixed(2) : '230.74'}</span>
                <span class="biz-figma-stat-sub ${compStock.todays_change_percent < 0 ? 'biz-color-neg' : ''}">${compStock.todays_change_percent != null ? (compStock.todays_change_percent > 0 ? '+' : '') + Number(compStock.todays_change_percent).toFixed(2) + '%' : '-2.83%'}</span>
              </div>
            </div>
            <div class="biz-figma-stat-cell">
              <span class="biz-figma-stat-label">52-WEEK HIGH</span>
              <div class="biz-figma-stat-val-row">
                <span class="biz-figma-stat-val">$${compStock.week_52_high != null ? Number(compStock.week_52_high).toFixed(2) : '243.37'}</span>
              </div>
            </div>
            <div class="biz-figma-stat-cell">
              <span class="biz-figma-stat-label">52-WEEK LOW</span>
              <div class="biz-figma-stat-val-row">
                <span class="biz-figma-stat-val">$${compStock.week_52_low != null ? Number(compStock.week_52_low).toFixed(2) : '164.27'}</span>
              </div>
            </div>
            <div class="biz-figma-stat-cell">
              <span class="biz-figma-stat-label">REVENUE</span>
              <div class="biz-figma-stat-val-row">
                <span class="biz-figma-stat-val">${formatMoneyCompact(compFin.revenue) || '$81.6B'}</span>
              </div>
            </div>
            <div class="biz-figma-stat-cell">
              <span class="biz-figma-stat-label">NET INCOME</span>
              <div class="biz-figma-stat-val-row">
                <span class="biz-figma-stat-val ${(compFin.net_income || 0) < 0 ? 'biz-color-neg' : ''}">${formatMoneyCompact(compFin.net_income) || '$58.3B'}</span>
              </div>
            </div>
            <div class="biz-figma-stat-cell">
              <span class="biz-figma-stat-label">VALUATION</span>
              <div class="biz-figma-stat-val-row">
                <span class="biz-figma-stat-val">${formatMoneyCompact(compValuation) || '$5.0T'}</span>
              </div>
            </div>
          </div>

          <!-- Key People Section (Figma 13810:169880) -->
          <div class="biz-figma-sec-group">
            <h4 class="biz-figma-sec-title">Key People</h4>
            <div class="biz-figma-people-row">
              ${compPeople.map(p => `
                <div class="biz-figma-person-pill" title="${p.name} · ${p.title}">
                  <span class="biz-figma-person-name" title="${p.name}">${p.name}</span>
                  <span class="biz-figma-person-role" title="${p.title}">${p.title}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Official Activities Section (Figma 13810:169891) -->
          <div class="biz-figma-sec-group">
            <h4 class="biz-figma-sec-title">Official Activities</h4>
            <div class="biz-figma-subcard">
              <div class="biz-figma-timeline-list">
                ${compActivities.map(act => `
                  <div class="biz-figma-timeline-row">
                    <span class="biz-figma-timeline-dot"></span>
                    <div class="biz-figma-timeline-meta">
                      <span class="biz-figma-timeline-time">${act.time}</span>
                      ${act.isLatest ? '<span class="timeline-latest-tag biz-figma-tag-latest">latest</span>' : ''}
                      <span class="biz-figma-timeline-domain">${act.domain}</span>
                    </div>
                    <p class="biz-figma-timeline-title" title="${act.title}">${act.title}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Media News Section (Figma 13810:169915) -->
          <div class="biz-figma-sec-group">
            <h4 class="biz-figma-sec-title">Media News</h4>
            <div class="biz-figma-subcard">
              <div class="biz-figma-timeline-list">
                ${compNews.map(item => `
                  <div class="biz-figma-timeline-row">
                    <span class="biz-figma-timeline-dot"></span>
                    <div class="biz-figma-timeline-meta">
                      <span class="biz-figma-timeline-time">${item.time}</span>
                      ${item.isLatest ? '<span class="timeline-latest-tag biz-figma-tag-latest">latest</span>' : ''}
                      <span class="biz-figma-timeline-domain">${item.domain}</span>
                    </div>
                    <p class="biz-figma-timeline-title" title="${item.title}">${item.title}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Handle -->
        <div class="biz-figma-handle-wrap" style="padding-top: 4px;">
          <div class="biz-figma-handle-bar"></div>
        </div>
      </article>

      <!-- 2. Bottom Card: Person Detail (Figma 13810:169958) -->
      <article class="biz-accordion-card biz-person-card ${!isCompActive ? 'is-expanded' : 'is-collapsed'}" id="bizPersonAccordionCard" data-entity-type="person" title="${!isCompActive ? '' : `Click to expand ${pers.name || 'Person'}`}">
        <!-- Collapsed Bar (Bottom Card, height 52px) -->
        <div class="biz-card-collapsed-bar biz-person-collapsed-bar">
          <div class="biz-figma-avatar-wrap" style="width: 28px; height: 28px; flex-shrink: 0;">
            <img src="${persAvatarSrc}" alt="${pers.name || 'Person'}" class="biz-figma-avatar-img" onerror="this.onerror=null;this.src='${persDefaultAvatar}';" />
          </div>
          <span class="biz-person-collapsed-name">${pers.name || 'Jensen Huang'}</span>
          <span class="biz-figma-tag biz-tag-person">Person</span>
          <span class="biz-person-collapsed-role">${persPos.title || pers.current_position?.title || 'Founder, President & CEO'}</span>
          <div class="biz-figma-handle-wrap biz-collapsed-handle" style="margin-left: auto; width: auto; padding: 0;">
            <div class="biz-figma-handle-bar"></div>
          </div>
        </div>

        <!-- Expanded Content (Scrollable, strictly contained within 414px card) -->
        <div class="biz-accordion-scroll-area biz-person-expanded-body">
          <!-- Header -->
          <div class="biz-figma-header">
            <div class="biz-figma-avatar-wrap" style="width: 44px; height: 44px; flex-shrink: 0;">
              <img src="${persAvatarSrc}" alt="${pers.name || 'Person'} Avatar" class="biz-figma-avatar-img" onerror="this.onerror=null;this.src='${persDefaultAvatar}';" />
            </div>
            <div class="biz-figma-header-info">
              <div class="biz-figma-title-row">
                <h3 class="biz-figma-title">${pers.name || 'Jensen Huang'}</h3>
                <span class="biz-figma-tag biz-tag-person">Person</span>
              </div>
              <div class="biz-figma-links-row">
                <div class="biz-figma-link-item">
                  <img src="./images/vertical/id-card-icon.svg" alt="" class="biz-figma-link-icon" />
                  <span class="biz-figma-link-text">${persPos.title || pers.current_position?.title || 'Founder, President & CEO'}</span>
                </div>
                <div class="biz-figma-link-item">
                  <img src="./images/vertical/linkedin-icon.svg" alt="" class="biz-figma-link-icon" />
                  <span class="biz-figma-link-text">Linkedin</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <p class="biz-figma-desc">
            ${pers.summary || 'Co-founder, President and CEO of NVIDIA since 1993. Under his leadership, NVIDIA invented the GPU in 1999 and pioneered accelerated computing.'}
          </p>

          <!-- Career Section (Figma 13810:170022) -->
          <div class="biz-figma-sec-group">
            <h4 class="biz-figma-sec-title">Career</h4>
            <div class="biz-figma-subcard">
              <div class="biz-figma-timeline-list">
                ${persCareer.map(c => {
                  const period = c.end ? `${c.start} – ${c.end}` : `${c.start} – Present`;
                  return `
                    <div class="biz-figma-career-row">
                      <span class="biz-figma-timeline-dot"></span>
                      <span class="biz-figma-career-period">${period}</span>
                      <span class="biz-figma-career-role">${c.title}</span>
                      <span class="biz-figma-career-org">${c.organization}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Activities Section (Figma 13810:169986) -->
          <div class="biz-figma-sec-group">
            <h4 class="biz-figma-sec-title">Activities</h4>
            <div class="biz-figma-subcard">
              <div class="biz-figma-timeline-list">
                ${persActivities.map(a => `
                  <div class="biz-figma-timeline-row">
                    <span class="biz-figma-timeline-dot"></span>
                    <div class="biz-figma-timeline-meta">
                      <span class="biz-figma-timeline-time">${a.time}</span>
                      ${a.isLatest ? '<span class="timeline-latest-tag biz-figma-tag-latest">latest</span>' : ''}
                      <span class="biz-figma-timeline-domain">${a.domain}</span>
                    </div>
                    <p class="biz-figma-timeline-title" title="${a.title}">${a.title}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- News Section (Figma 13810:170004) -->
          <div class="biz-figma-sec-group">
            <h4 class="biz-figma-sec-title">News</h4>
            <div class="biz-figma-subcard">
              <div class="biz-figma-timeline-list">
                ${persNews.map(n => `
                  <div class="biz-figma-timeline-row">
                    <span class="biz-figma-timeline-dot"></span>
                    <div class="biz-figma-timeline-meta">
                      <span class="biz-figma-timeline-time">${n.time}</span>
                      ${n.isLatest ? '<span class="timeline-latest-tag biz-figma-tag-latest">latest</span>' : ''}
                      <span class="biz-figma-timeline-domain">${n.domain}</span>
                    </div>
                    <p class="biz-figma-timeline-title" title="${n.title}">${n.title}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Handle -->
        <div class="biz-figma-handle-wrap" style="padding-top: 4px;">
          <div class="biz-figma-handle-bar"></div>
        </div>
      </article>
    </div>
  `;
}


