/**
 * Card HTML Template Generators (Subject Cards & Business Entity Cards)
 * Strictly aligned with NEWS_SEARCH_ANIMATION_SPEC.md & BUSINESS_SEARCH_SPEC.md
 */
import { formatDate, formatDateTime, extractDomain } from '../data/verticals-data.js';

export function formatMoneyCompact(val, currency = 'USD') {
  if (val == null) return '';
  const sym = currency === 'USD' ? '$' : currency + ' ';
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

// ----------------------------------------------------
// NEWS SEARCH TEMPLATES
// ----------------------------------------------------

export function createSubjectCardHTML(subject, index, isFirst = false) {
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
 * Stage 3: Business Summary Card (Two cards: Company & Person)
 */
export function createBusinessSummaryCardHTML(entity, index) {
  const isCompany = entity.type === 'company';
  const ids = entity.identifiers || {};
  const stock = entity.metrics?.stock || {};
  const fin = entity.metrics?.financials || {};
  const fund = entity.metrics?.funding || {};
  const pos = entity.current_position || {};
  const activities = entity.activities || [];
  const firstAct = activities[0] || null;

  if (isCompany) {
    const actDateStr = '2026/09/12 07:58:07';
    const actTitle = firstAct?.title || 'Coupang names new head of Fulfillment Technology';
    const tickerStr = ids.stock_ticker ? ids.stock_ticker.replace(/^NYSE:\s*/i, '') + ' · NYSE' : 'CPENG · NYSE';
    const compPeople = entity.key_people || [
      { name: 'Bom Kim', title: 'Founder & CEO' },
      { name: 'Gaurav Anand', title: 'CFO' }
    ];
    const compActivities = entity.activities || [
      {
        title: 'Coupang names new head of Fulfillment Technology',
        timeDisplay: '2026/09/12 07:58:07',
        isLatest: true,
        source: 'biz.com'
      },
      {
        title: 'Coupang Announces Results for Second Quarter 2026: Net revenues reach $8.9 billion',
        timeDisplay: '2026/09/11 07:58:07',
        source: 'ir.aboutcoupang.com'
      },
      {
        title: 'Coupang expands Rocket Delivery to two more provinces',
        timeDisplay: '2026/09/04 23:58:07',
        source: 'koreaherald.com'
      }
    ];
    const compNews = entity.news || [
      {
        title: "Analysts split on Coupang's margin trajectory after Q2",
        timeDisplay: '2026/09/12 07:58:07',
        isLatest: true,
        source: 'Barrons.com'
      },
      {
        title: 'Coupang (CPNG) Q2 2026 Earnings Call Transcript',
        timeDisplay: '2026/09/11 07:58:07',
        source: 'Fool.com'
      },
      {
        title: '쿠팡플레이, 스포츠 독점 중계권 확대…OTT 경쟁 격화 (Coupang Play Sports OTT)',
        timeDisplay: '2026/09/04 23:58:07',
        source: 'MaeilBusiness.com'
      }
    ];

    return `
      <div class="business-card-wrapper" data-business-card="true" data-entity-idx="${index}">
        <article class="business-summary-card-box biz-figma-card" data-biz-type="company" data-entity-idx="${index}">
          <div class="biz-overview-scroll-area">
            <!-- Company Header -->
            <div class="biz-figma-header">
              <div class="biz-figma-logo-wrap">
                <img src="./images/vertical/coupang-logo.png" alt="Coupang Logo" class="biz-figma-logo-img" />
              </div>
              <div class="biz-figma-header-info">
                <div class="biz-figma-title-row">
                  <h3 class="biz-figma-title">${entity.name || 'Coupang, Inc.'}</h3>
                  <span class="biz-figma-tag biz-tag-company">Company</span>
                </div>
                <div class="biz-figma-links-row">
                  <div class="biz-figma-link-item">
                    <img src="./images/vertical/stock-icon.svg" alt="" class="biz-figma-link-icon" />
                    <span class="biz-figma-link-text">${tickerStr}</span>
                  </div>
                  <div class="biz-figma-link-item">
                    <img src="./images/vertical/city-icon.svg" alt="" class="biz-figma-link-icon" />
                    <span class="biz-figma-link-text">${ids.website || 'aboutcoupang.com'}</span>
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
              ${entity.summary || 'One of South Korea’s largest e-commerce platforms, founded in 2010 and listed on the NYSE. Its core businesses span e-commerce, logistics fulfillment, and OTT streaming. Its self-built Rocket Delivery network reaches most of Korea’s population. In recent years, the company has focused its growth investments on advertising, food delivery, and international expansion—its Developing Offerings.'}
            </p>

            <!-- Stats Grid -->
            <div class="biz-figma-stats-grid">
              <div class="biz-figma-stat-cell">
                <span class="biz-figma-stat-label">STOCK PRICE</span>
                <div class="biz-figma-stat-val-row">
                  <span class="biz-figma-stat-val">$${stock.price?.toFixed(2) || '14.29'}</span>
                  <span class="biz-figma-stat-sub ${stock.todays_change_percent < 0 ? 'biz-color-neg' : ''}">${stock.todays_change_percent || -1.18}%</span>
                </div>
              </div>
              <div class="biz-figma-stat-cell">
                <span class="biz-figma-stat-label">52-WEEK HIGH</span>
                <div class="biz-figma-stat-val-row">
                  <span class="biz-figma-stat-val">$${stock.week_52_high?.toFixed(2) || '34.08'}</span>
                </div>
              </div>
              <div class="biz-figma-stat-cell">
                <span class="biz-figma-stat-label">52-WEEK LOW</span>
                <div class="biz-figma-stat-val-row">
                  <span class="biz-figma-stat-val">$${stock.week_52_low?.toFixed(2) || '14.15'}</span>
                </div>
              </div>
              <div class="biz-figma-stat-cell">
                <span class="biz-figma-stat-label">REVENUE</span>
                <div class="biz-figma-stat-val-row">
                  <span class="biz-figma-stat-val">${formatMoneyCompact(fin.revenue) || '$8.9B'}</span>
                </div>
              </div>
              <div class="biz-figma-stat-cell">
                <span class="biz-figma-stat-label">NET INCOME</span>
                <div class="biz-figma-stat-val-row">
                  <span class="biz-figma-stat-val biz-color-neg">${formatMoneyCompact(fin.net_income) || '-$570M'}</span>
                </div>
              </div>
              <div class="biz-figma-stat-cell">
                <span class="biz-figma-stat-label">VALUATION</span>
                <div class="biz-figma-stat-val-row">
                  <span class="biz-figma-stat-val">${formatMoneyCompact(fund.valuation) || '$9B'}</span>
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
                    <div class="biz-figma-person-pill">
                      <span class="biz-figma-person-name">${p.name}</span>
                      <span class="biz-figma-person-role">${p.title}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Official Activities -->
              <div class="biz-figma-sec-group">
                <h4 class="biz-figma-sec-title">Official Activities</h4>
                <div class="biz-figma-subcard">
                  <div class="biz-figma-timeline-list">
                    ${compActivities.map(act => {
                      const time = act.timeDisplay || (act.timePublished ? formatDateTime(act.timePublished) : '2026/09/12 07:58:07');
                      const domain = act.source || (act.url ? extractDomain(act.url) : 'biz.com');
                      return `
                        <div class="biz-figma-timeline-row">
                          <span class="biz-figma-timeline-dot"></span>
                          <div class="biz-figma-timeline-meta">
                            <span class="biz-figma-timeline-time">${time}</span>
                            ${act.isLatest ? '<span class="biz-figma-tag-latest">latest</span>' : ''}
                            <span class="biz-figma-timeline-domain">${domain}</span>
                          </div>
                          <p class="biz-figma-timeline-title" title="${act.title}">${act.title}</p>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>

              <!-- Media News -->
              <div class="biz-figma-sec-group">
                <h4 class="biz-figma-sec-title">Media News</h4>
                <div class="biz-figma-subcard">
                  <div class="biz-figma-timeline-list">
                    ${compNews.map(item => {
                      const time = item.timeDisplay || (item.timePublished ? formatDateTime(item.timePublished) : '2026/09/12 07:58:07');
                      const domain = item.source || (item.url ? extractDomain(item.url) : 'Barrons.com');
                      return `
                        <div class="biz-figma-timeline-row">
                          <span class="biz-figma-timeline-dot"></span>
                          <div class="biz-figma-timeline-meta">
                            <span class="biz-figma-timeline-time">${time}</span>
                            ${item.isLatest ? '<span class="biz-figma-tag-latest">latest</span>' : ''}
                            <span class="biz-figma-timeline-domain">${domain}</span>
                          </div>
                          <p class="biz-figma-timeline-title" title="${item.title}">${item.title}</p>
                        </div>
                      `;
                    }).join('')}
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
    // Person Summary Card (Bom Kim)
    const persCareer = entity.career || [
      { organization: 'Coupang, Inc.', title: 'Founder & CEO', start: '2010', end: 'Present' },
      { organization: '02138 Magazine', title: 'Co-founder', start: '2006', end: '2008' },
      { organization: 'The Boston Consulting Group', title: 'Associate', start: '2005', end: '2006' }
    ];
    const persActivities = entity.activities || [
      {
        title: 'Coupang names new head of Fulfillment Technology',
        timeDisplay: '2026/09/12 07:58:07',
        isLatest: true,
        source: 'biz.com'
      },
      {
        title: 'Coupang Announces Results for Second Quarter 2026: Net revenues reach $8.9 billion',
        timeDisplay: '2026/09/11 07:58:07',
        source: 'ir.aboutcoupang.com'
      }
    ];
    const persNews = entity.news || [
      {
        title: 'Coupang names new head of Fulfillment Technology',
        timeDisplay: '2026/09/12 07:58:07',
        isLatest: true,
        source: 'biz.com'
      },
      {
        title: 'Coupang Announces Results for Second Quarter 2026: Net revenues reach $8.9 billion',
        timeDisplay: '2026/09/11 07:58:07',
        source: 'ir.aboutcoupang.com'
      }
    ];

    return `
      <div class="business-card-wrapper" data-business-card="true" data-entity-idx="${index}">
        <article class="business-summary-card-box biz-figma-card" data-biz-type="person" data-entity-idx="${index}">
          <div class="biz-overview-scroll-area">
            <!-- CEO Header -->
            <div class="biz-figma-header">
              <div class="biz-figma-avatar-wrap">
                <img src="./images/vertical/bom-kim-avatar.svg" alt="Bom Kim Avatar" class="biz-figma-avatar-img" />
              </div>
              <div class="biz-figma-header-info">
                <div class="biz-figma-title-row">
                  <h3 class="biz-figma-title">${entity.name || 'Bom Kim'}</h3>
                  <span class="biz-figma-tag biz-tag-person">Person</span>
                </div>
                <div class="biz-figma-links-row">
                  <div class="biz-figma-link-item">
                    <img src="./images/vertical/id-card-icon.svg" alt="" class="biz-figma-link-icon" />
                    <span class="biz-figma-link-text">${pos.title || 'Founder & CEO'}</span>
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
              ${entity.summary || 'Founder & CEO of Coupang since 2010. Harvard College graduate and Harvard Business School alumnus, led Coupang through its 2021 NYSE IPO and nationwide automated logistics rollout.'}
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
                    ${persActivities.map(a => {
                      const time = a.timeDisplay || (a.timePublished ? formatDateTime(a.timePublished) : '2026/09/12 07:58:07');
                      const domain = a.source || (a.url ? extractDomain(a.url) : 'biz.com');
                      return `
                        <div class="biz-figma-timeline-row">
                          <span class="biz-figma-timeline-dot"></span>
                          <div class="biz-figma-timeline-meta">
                            <span class="biz-figma-timeline-time">${time}</span>
                            ${a.isLatest ? '<span class="biz-figma-tag-latest">latest</span>' : ''}
                            <span class="biz-figma-timeline-domain">${domain}</span>
                          </div>
                          <p class="biz-figma-timeline-title" title="${a.title}">${a.title}</p>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>

              <!-- News Section -->
              <div class="biz-figma-sec-group">
                <h4 class="biz-figma-sec-title">News</h4>
                <div class="biz-figma-subcard">
                  <div class="biz-figma-timeline-list">
                    ${persNews.map(n => {
                      const time = n.timeDisplay || (n.timePublished ? formatDateTime(n.timePublished) : '2026/09/12 07:58:07');
                      const domain = n.source || (n.url ? extractDomain(n.url) : 'biz.com');
                      return `
                        <div class="biz-figma-timeline-row">
                          <span class="biz-figma-timeline-dot"></span>
                          <div class="biz-figma-timeline-meta">
                            <span class="biz-figma-timeline-time">${time}</span>
                            ${n.isLatest ? '<span class="biz-figma-tag-latest">latest</span>' : ''}
                            <span class="biz-figma-timeline-domain">${domain}</span>
                          </div>
                          <p class="biz-figma-timeline-title" title="${n.title}">${n.title}</p>
                        </div>
                      `;
                    }).join('')}
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
  const compFin = comp.metrics?.financials || {};
  const compFund = comp.metrics?.funding || {};
  const compPeople = comp.key_people || [
    { name: 'Bom Kim', title: 'Founder & CEO' },
    { name: 'Gaurav Anand', title: 'CFO' }
  ];
  const compActivities = comp.activities || [
    {
      title: 'Coupang names new head of Fulfillment Technology',
      timeDisplay: '2026/09/12 07:58:07',
      isLatest: true,
      source: 'biz.com'
    },
    {
      title: 'Coupang Announces Results for Second Quarter 2026: Net revenues reach $8.9 billion',
      timeDisplay: '2026/09/11 07:58:07',
      source: 'ir.aboutcoupang.com'
    },
    {
      title: 'Coupang expands Rocket Delivery to two more provinces',
      timeDisplay: '2026/09/04 23:58:07',
      source: 'koreaherald.com'
    }
  ];
  const compNews = comp.news || [
    {
      title: "Analysts split on Coupang's margin trajectory after Q2",
      timeDisplay: '2026/09/12 07:58:07',
      isLatest: true,
      source: 'Barrons.com'
    },
    {
      title: 'Coupang (CPNG) Q2 2026 Earnings Call Transcript',
      timeDisplay: '2026/09/11 07:58:07',
      source: 'Fool.com'
    },
    {
      title: '쿠팡플레이, 스포츠 독점 중계권 확대…OTT 경쟁 격화 (Coupang Play Sports OTT)',
      timeDisplay: '2026/09/04 23:58:07',
      source: 'MaeilBusiness.com'
    }
  ];
  const compFirstAct = compActivities[0] || null;
  const compActTitle = compFirstAct?.title || 'Coupang names new head of Fulfillment Technology';
  const compTickerStr = compIds.stock_ticker ? compIds.stock_ticker.replace(/^NYSE:\s*/i, '') + ' · NYSE' : 'CPENG · NYSE';

  // --- Person Data ---
  const pers = personEntity || {};
  const persPos = pers.current_position || {};
  const persCareer = pers.career || [
    { organization: 'Coupang, Inc.', title: 'Founder & CEO', start: '2010', end: 'Present' },
    { organization: '02138 Magazine', title: 'Co-founder', start: '2006', end: '2008' },
    { organization: 'The Boston Consulting Group', title: 'Associate', start: '2005', end: '2006' }
  ];
  const persActivities = pers.activities || [
    {
      title: 'Coupang names new head of Fulfillment Technology',
      timeDisplay: '2026/09/12 07:58:07',
      isLatest: true,
      source: 'biz.com'
    },
    {
      title: 'Coupang Announces Results for Second Quarter 2026: Net revenues reach $8.9 billion',
      timeDisplay: '2026/09/11 07:58:07',
      source: 'ir.aboutcoupang.com'
    }
  ];
  const persNews = pers.news || [
    {
      title: 'Coupang names new head of Fulfillment Technology',
      timeDisplay: '2026/09/12 07:58:07',
      isLatest: true,
      source: 'biz.com'
    },
    {
      title: 'Coupang Announces Results for Second Quarter 2026: Net revenues reach $8.9 billion',
      timeDisplay: '2026/09/11 07:58:07',
      source: 'ir.aboutcoupang.com'
    }
  ];

  return `
    <div class="biz-dual-cards-stack" id="bizDualCardsStack">
      <!-- 1. Top Card: Company Detail (Figma 13810:169821) -->
      <article class="biz-accordion-card biz-company-card ${isCompActive ? 'is-expanded' : 'is-collapsed'}" id="bizCompanyAccordionCard" data-entity-type="company" title="${isCompActive ? '' : 'Click to expand Coupang'}">
        <!-- Collapsed Bar (Top Card, height 52px) -->
        <div class="biz-card-collapsed-bar biz-company-collapsed-bar">
          <div class="biz-figma-activity-bar" style="background: transparent; height: 24px; padding: 0 2px; margin: 0;">
            <img src="./images/vertical/activity-dot.svg" alt="" class="biz-figma-act-dot" />
            <span class="biz-figma-act-date">2026/09/12 07:58:07</span>
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
              <img src="./images/vertical/coupang-logo.png" alt="Coupang Logo" class="biz-figma-logo-img" />
            </div>
            <div class="biz-figma-header-info">
              <div class="biz-figma-title-row">
                <h3 class="biz-figma-title">${comp.name || 'Coupang, Inc.'}</h3>
                <span class="biz-figma-tag biz-tag-company">Company</span>
              </div>
              <div class="biz-figma-links-row">
                <div class="biz-figma-link-item">
                  <img src="./images/vertical/stock-icon.svg" alt="" class="biz-figma-link-icon" />
                  <span class="biz-figma-link-text">${compTickerStr}</span>
                </div>
                <div class="biz-figma-link-item">
                  <img src="./images/vertical/city-icon.svg" alt="" class="biz-figma-link-icon" />
                  <span class="biz-figma-link-text">${compIds.website || 'aboutcoupang.com'}</span>
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
            ${comp.summary || 'One of South Korea’s largest e-commerce platforms, founded in 2010 and listed on the NYSE. Its core businesses span e-commerce, logistics fulfillment, and OTT streaming. Its self-built Rocket Delivery network reaches most of Korea’s population. In recent years, the company has focused its growth investments on advertising, food delivery, and international expansion—its Developing Offerings.'}
          </p>

          <!-- Metrics Grid -->
          <div class="biz-figma-stats-grid">
            <div class="biz-figma-stat-cell">
              <span class="biz-figma-stat-label">STOCK PRICE</span>
              <div class="biz-figma-stat-val-row">
                <span class="biz-figma-stat-val">$${compStock.price?.toFixed(2) || '14.29'}</span>
                <span class="biz-figma-stat-sub ${compStock.todays_change_percent < 0 ? 'biz-color-neg' : ''}">${compStock.todays_change_percent || -1.18}%</span>
              </div>
            </div>
            <div class="biz-figma-stat-cell">
              <span class="biz-figma-stat-label">52-WEEK HIGH</span>
              <div class="biz-figma-stat-val-row">
                <span class="biz-figma-stat-val">$${compStock.week_52_high?.toFixed(2) || '34.08'}</span>
              </div>
            </div>
            <div class="biz-figma-stat-cell">
              <span class="biz-figma-stat-label">52-WEEK LOW</span>
              <div class="biz-figma-stat-val-row">
                <span class="biz-figma-stat-val">$${compStock.week_52_low?.toFixed(2) || '14.15'}</span>
              </div>
            </div>
            <div class="biz-figma-stat-cell">
              <span class="biz-figma-stat-label">REVENUE</span>
              <div class="biz-figma-stat-val-row">
                <span class="biz-figma-stat-val">${formatMoneyCompact(compFin.revenue) || '$8.9B'}</span>
              </div>
            </div>
            <div class="biz-figma-stat-cell">
              <span class="biz-figma-stat-label">NET INCOME</span>
              <div class="biz-figma-stat-val-row">
                <span class="biz-figma-stat-val biz-color-neg">${formatMoneyCompact(compFin.net_income) || '-$570M'}</span>
              </div>
            </div>
            <div class="biz-figma-stat-cell">
              <span class="biz-figma-stat-label">VALUATION</span>
              <div class="biz-figma-stat-val-row">
                <span class="biz-figma-stat-val">${formatMoneyCompact(compFund.valuation) || '$9B'}</span>
              </div>
            </div>
          </div>

          <!-- Key People Section (Figma 13810:169880) -->
          <div class="biz-figma-sec-group">
            <h4 class="biz-figma-sec-title">Key People</h4>
            <div class="biz-figma-people-row">
              ${compPeople.map(p => `
                <div class="biz-figma-person-pill">
                  <span class="biz-figma-person-name">${p.name}</span>
                  <span class="biz-figma-person-role">${p.title}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Official Activities Section (Figma 13810:169891) -->
          <div class="biz-figma-sec-group">
            <h4 class="biz-figma-sec-title">Official Activities</h4>
            <div class="biz-figma-subcard">
              <div class="biz-figma-timeline-list">
                ${compActivities.map(act => {
                  const time = act.timeDisplay || (act.timePublished ? formatDateTime(act.timePublished) : '2026/09/12 07:58:07');
                  const domain = act.source || (act.url ? extractDomain(act.url) : 'biz.com');
                  return `
                    <div class="biz-figma-timeline-row">
                      <span class="biz-figma-timeline-dot"></span>
                      <div class="biz-figma-timeline-meta">
                        <span class="biz-figma-timeline-time">${time}</span>
                        ${act.isLatest ? '<span class="biz-figma-tag-latest">latest</span>' : ''}
                        <span class="biz-figma-timeline-domain">${domain}</span>
                      </div>
                      <p class="biz-figma-timeline-title" title="${act.title}">${act.title}</p>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Media News Section (Figma 13810:169915) -->
          <div class="biz-figma-sec-group">
            <h4 class="biz-figma-sec-title">Media News</h4>
            <div class="biz-figma-subcard">
              <div class="biz-figma-timeline-list">
                ${compNews.map(item => {
                  const time = item.timeDisplay || (item.timePublished ? formatDateTime(item.timePublished) : '2026/09/12 07:58:07');
                  const domain = item.source || (item.url ? extractDomain(item.url) : 'Barrons.com');
                  return `
                    <div class="biz-figma-timeline-row">
                      <span class="biz-figma-timeline-dot"></span>
                      <div class="biz-figma-timeline-meta">
                        <span class="biz-figma-timeline-time">${time}</span>
                        ${item.isLatest ? '<span class="biz-figma-tag-latest">latest</span>' : ''}
                        <span class="biz-figma-timeline-domain">${domain}</span>
                      </div>
                      <p class="biz-figma-timeline-title" title="${item.title}">${item.title}</p>
                    </div>
                  `;
                }).join('')}
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
      <article class="biz-accordion-card biz-person-card ${!isCompActive ? 'is-expanded' : 'is-collapsed'}" id="bizPersonAccordionCard" data-entity-type="person" title="${!isCompActive ? '' : 'Click to expand Bom Kim'}">
        <!-- Collapsed Bar (Bottom Card, height 52px) -->
        <div class="biz-card-collapsed-bar biz-person-collapsed-bar">
          <div class="biz-figma-avatar-wrap" style="width: 28px; height: 28px; flex-shrink: 0;">
            <img src="./images/vertical/bom-kim-avatar.svg" alt="Bom Kim" class="biz-figma-avatar-img" />
          </div>
          <span class="biz-person-collapsed-name">Bom Kim</span>
          <span class="biz-figma-tag biz-tag-person">Person</span>
          <span class="biz-person-collapsed-role">${persPos.title || 'Founder & CEO'}</span>
          <div class="biz-figma-handle-wrap biz-collapsed-handle" style="margin-left: auto; width: auto; padding: 0;">
            <div class="biz-figma-handle-bar"></div>
          </div>
        </div>

        <!-- Expanded Content (Scrollable, strictly contained within 414px card) -->
        <div class="biz-accordion-scroll-area biz-person-expanded-body">
          <!-- Header -->
          <div class="biz-figma-header">
            <div class="biz-figma-avatar-wrap" style="width: 44px; height: 44px; flex-shrink: 0;">
              <img src="./images/vertical/bom-kim-avatar.svg" alt="Bom Kim Avatar" class="biz-figma-avatar-img" />
            </div>
            <div class="biz-figma-header-info">
              <div class="biz-figma-title-row">
                <h3 class="biz-figma-title">${pers.name || 'Bom Kim'}</h3>
                <span class="biz-figma-tag biz-tag-person">Person</span>
              </div>
              <div class="biz-figma-links-row">
                <div class="biz-figma-link-item">
                  <img src="./images/vertical/id-card-icon.svg" alt="" class="biz-figma-link-icon" />
                  <span class="biz-figma-link-text">${persPos.title || 'Founder & CEO'}</span>
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
            ${pers.summary || 'Founder & CEO of Coupang since 2010. Harvard College graduate and Harvard Business School alumnus, led Coupang through its 2021 NYSE IPO and nationwide automated logistics rollout.'}
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
                ${persActivities.map(a => {
                  const time = a.timeDisplay || (a.timePublished ? formatDateTime(a.timePublished) : '2026/09/12 07:58:07');
                  const domain = a.source || (a.url ? extractDomain(a.url) : 'biz.com');
                  return `
                    <div class="biz-figma-timeline-row">
                      <span class="biz-figma-timeline-dot"></span>
                      <div class="biz-figma-timeline-meta">
                        <span class="biz-figma-timeline-time">${time}</span>
                        ${a.isLatest ? '<span class="biz-figma-tag-latest">latest</span>' : ''}
                        <span class="biz-figma-timeline-domain">${domain}</span>
                      </div>
                      <p class="biz-figma-timeline-title" title="${a.title}">${a.title}</p>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- News Section (Figma 13810:170004) -->
          <div class="biz-figma-sec-group">
            <h4 class="biz-figma-sec-title">News</h4>
            <div class="biz-figma-subcard">
              <div class="biz-figma-timeline-list">
                ${persNews.map(n => {
                  const time = n.timeDisplay || (n.timePublished ? formatDateTime(n.timePublished) : '2026/09/12 07:58:07');
                  const domain = n.source || (n.url ? extractDomain(n.url) : 'biz.com');
                  return `
                    <div class="biz-figma-timeline-row">
                      <span class="biz-figma-timeline-dot"></span>
                      <div class="biz-figma-timeline-meta">
                        <span class="biz-figma-timeline-time">${time}</span>
                        ${n.isLatest ? '<span class="biz-figma-tag-latest">latest</span>' : ''}
                        <span class="biz-figma-timeline-domain">${domain}</span>
                      </div>
                      <p class="biz-figma-timeline-title" title="${n.title}">${n.title}</p>
                    </div>
                  `;
                }).join('')}
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


