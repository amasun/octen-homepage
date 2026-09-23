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

    return `
      <div class="business-card-wrapper" data-business-card="true" data-entity-idx="${index}" style="position: relative;">
        <article class="business-summary-card-box biz-figma-card" data-biz-type="company" data-entity-idx="${index}">
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

          <!-- Stats & Activity Body -->
          <div class="biz-figma-body-group">
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

            <div class="biz-figma-activity-bar">
              <img src="./images/vertical/activity-dot.svg" alt="" class="biz-figma-act-dot" />
              <span class="biz-figma-act-date">${actDateStr}</span>
              <span class="biz-figma-act-title" title="${actTitle}">${actTitle}</span>
            </div>
          </div>

          <!-- Handle -->
          <div class="biz-figma-handle-wrap" title="Click to view details">
            <div class="biz-figma-handle-bar"></div>
          </div>
        </article>
      </div>
    `;
  } else {
    // Person Summary Card (Bom Kim)
    return `
      <div class="business-card-wrapper" data-business-card="true" data-entity-idx="${index}" style="position: relative;">
        <article class="business-summary-card-box biz-figma-card" data-biz-type="person" data-entity-idx="${index}">
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

          <!-- Handle -->
          <div class="biz-figma-handle-wrap" title="Click to view details">
            <div class="biz-figma-handle-bar"></div>
          </div>
        </article>
      </div>
    `;
  }
}

/**
 * Stage 4/5: Business Expanded Detail Card (Coupang or Bom Kim)
 */
export function createBusinessDetailCardHTML(entity) {
  const isCompany = entity.type === 'company';

  if (isCompany) {
    const ids = entity.identifiers || {};
    const attrs = entity.attributes || {};
    const stock = entity.metrics?.stock || {};
    const fin = entity.metrics?.financials || {};
    const fund = entity.metrics?.funding || {};
    const traffic = entity.metrics?.web_traffic || {};
    const activities = entity.activities || [];
    const news = entity.news || [];

    // 52-week slider rail position
    const low = stock.week_52_low || 14.15;
    const high = stock.week_52_high || 34.08;
    const cur = stock.price || 14.29;
    const posPct = Math.min(Math.max(((cur - low) / (high - low)) * 100, 3), 97);
    const tickerStr = ids.stock_ticker ? ids.stock_ticker.replace(/^NYSE:\s*/i, '') + ' · NYSE' : 'CPENG · NYSE';

    return `
      <div class="biz-detail-content" data-detail-type="company">
        <!-- 1. Header & Meta Row -->
        <div class="biz-detail-header-block">
          <div class="biz-figma-logo-wrap" style="width: 48px; height: 48px; border-radius: 12px;">
            <img src="./images/vertical/coupang-logo.png" alt="Coupang" class="biz-detail-logo-img" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div class="biz-detail-header-main">
            <div class="biz-name-row">
              <h3 class="biz-detail-title">${entity.name}</h3>
              <span class="biz-figma-tag biz-tag-company">Company</span>
            </div>
            <div class="biz-identity-badges">
              <span class="biz-id-item"><img src="./images/vertical/stock-icon.svg" class="biz-id-icon" alt="" />${tickerStr}</span>
              <span class="biz-id-item">CIK ${ids.sec_cik}</span>
              <a href="https://${ids.website}" target="_blank" class="biz-id-link"><img src="./images/vertical/city-icon.svg" class="biz-id-icon" alt="" />${ids.website}</a>
              <a href="${ids.linkedin_url || '#'}" target="_blank" class="biz-id-link"><img src="./images/vertical/linkedin-icon.svg" class="biz-id-icon" alt="" />LinkedIn</a>
            </div>
          </div>
        </div>

        <!-- 2. Attributes Row -->
        <div class="biz-attributes-strip">
          <span class="biz-attr-item"><span class="biz-attr-k">Industry</span><span class="biz-attr-v">${attrs.industry}</span></span>
          <span class="biz-attr-item"><span class="biz-attr-k">HQ</span><span class="biz-attr-v">${attrs.hq_country}</span></span>
          <span class="biz-attr-item"><span class="biz-attr-k">Founded</span><span class="biz-attr-v">${attrs.founded_year}</span></span>
          <span class="biz-attr-item"><span class="biz-attr-k">Employees</span><span class="biz-attr-v">${attrs.employee_range}</span></span>
        </div>

        <!-- 3. Financial Metrics Board with 52-Week Slider Rail -->
        <div class="biz-metrics-board">
          <!-- Price and 52-week slider rail -->
          <div class="biz-price-rail-block">
            <div class="biz-price-live-col">
              <span class="biz-price-label">Stock Price</span>
              <div class="biz-price-number-row">
                <span class="biz-live-price">$${stock.price?.toFixed(2)}</span>
                <span class="biz-live-change ${stock.todays_change_percent < 0 ? 'neg' : 'pos'}">${stock.todays_change_percent}%</span>
              </div>
            </div>
            <div class="biz-52w-rail-col">
              <div class="biz-52w-labels">
                <span>52W Low: $${low.toFixed(2)}</span>
                <span class="biz-52w-center-tag">52-Week Range</span>
                <span>52W High: $${high.toFixed(2)}</span>
              </div>
              <div class="biz-52w-track">
                <div class="biz-52w-bar" style="width: 100%;"></div>
                <div class="biz-52w-thumb" style="left: ${posPct}%;" title="Current: $${cur.toFixed(2)}">
                  <span class="biz-52w-thumb-pin"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary Grid -->
          <div class="biz-secondary-metrics-grid">
            <div class="biz-sec-metric-cell">
              <span class="biz-sec-label">Revenue</span>
              <span class="biz-sec-val">${formatMoneyCompact(fin.revenue)}</span>
              <span class="biz-sec-caption">${fin.period} · +10% YoY</span>
            </div>
            <div class="biz-sec-metric-cell">
              <span class="biz-sec-label">Net Income</span>
              <span class="biz-sec-val neg">${formatMoneyCompact(fin.net_income)}</span>
              <span class="biz-sec-caption">${fin.period}</span>
            </div>
            <div class="biz-sec-metric-cell">
              <span class="biz-sec-label">Valuation</span>
              <span class="biz-sec-val">${formatMoneyCompact(fund.valuation)}</span>
              <span class="biz-sec-caption">${fund.round}</span>
            </div>
            <div class="biz-sec-metric-cell">
              <span class="biz-sec-label">Total Funding</span>
              <span class="biz-sec-val">${formatMoneyCompact(fund.total_funding)}</span>
              <span class="biz-sec-caption">All rounds</span>
            </div>
            <div class="biz-sec-metric-cell">
              <span class="biz-sec-label">Monthly Visits</span>
              <span class="biz-sec-val">${(traffic.visits_monthly / 1e6).toFixed(1)}M</span>
              <span class="biz-sec-caption">Global Rank #${traffic.rank}</span>
            </div>
          </div>
        </div>

        <!-- 4. Key People -->
        <div class="biz-section-group">
          <h4 class="biz-sec-heading">Key People</h4>
          <div class="biz-people-pills">
            ${(entity.key_people || []).map(p => `
              <div class="biz-person-pill">
                <span class="biz-person-name">${p.name}</span>
                <span class="biz-person-role">${p.title}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 5. Dual-Track: Activities (Timeline) vs News (List) -->
        <div class="biz-dual-track-container">
          <div class="biz-track-col">
            <div class="biz-track-title-row">
              <span class="biz-track-badge official">Official Activities</span>
              <span class="biz-track-desc">Timeline of corporate filings & milestones</span>
            </div>
            <div class="biz-activities-rail">
              ${activities.map((act, i) => `
                <div class="biz-activity-item">
                  <div class="biz-activity-node"></div>
                  <div class="biz-activity-body">
                    <span class="biz-activity-date">${act.timePublished?.slice(0, 10).replace(/-/g, '/')}</span>
                    <a href="${act.url}" target="_blank" class="biz-activity-title">${act.title}</a>
                    <p class="biz-activity-highlight">${act.highlight}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="biz-track-col">
            <div class="biz-track-title-row">
              <span class="biz-track-badge media">Media News</span>
              <span class="biz-track-desc">Independent publications & coverage</span>
            </div>
            <div class="biz-news-list">
              ${news.map(nw => `
                <div class="biz-news-item">
                  <div class="biz-news-top">
                    <span class="biz-news-source">${nw.source}</span>
                    <span class="biz-news-date">${nw.timePublished?.slice(0, 10).replace(/-/g, '/')}</span>
                  </div>
                  <a href="${nw.url}" target="_blank" class="biz-news-title">${nw.title}</a>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Handle bar -->
        <div class="biz-figma-handle-wrap" style="padding-top: 10px;">
          <div class="biz-figma-handle-bar"></div>
        </div>
      </div>
    `;
  } else {
    // Person Detail (Bom Kim)
    const pos = entity.current_position || {};
    const career = entity.career || [];
    const activities = entity.activities || [];
    const news = entity.news || [];

    return `
      <div class="biz-detail-content" data-detail-type="person">
        <!-- 1. Header & Identity -->
        <div class="biz-detail-header-block">
          <div class="biz-figma-avatar-wrap" style="width: 48px; height: 48px;">
            <img src="./images/vertical/bom-kim-avatar.svg" alt="Bom Kim" class="biz-detail-avatar-img" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div class="biz-detail-header-main">
            <div class="biz-name-row">
              <h3 class="biz-detail-title">${entity.name}</h3>
              <span class="biz-figma-tag biz-tag-person">Person</span>
            </div>
            <div class="biz-identity-badges">
              <span class="biz-id-item"><img src="./images/vertical/id-card-icon.svg" class="biz-id-icon" alt="" />${pos.title} · ${pos.organization}</span>
              <a href="${entity.linkedin_url}" target="_blank" class="biz-id-link"><img src="./images/vertical/linkedin-icon.svg" class="biz-id-icon" alt="" />LinkedIn Profile</a>
            </div>
          </div>
        </div>

        <!-- 2. Bio Summary -->
        <div class="biz-bio-box">
          <p class="biz-bio-text">${entity.summary}</p>
        </div>

        <!-- 3. Career Rail (Vertical Career Line) -->
        <div class="biz-section-group">
          <h4 class="biz-sec-heading">Career Experience</h4>
          <div class="biz-career-timeline">
            ${career.map((c, i) => {
              const isCurrent = c.end === null;
              const periodStr = isCurrent ? `${c.start} – Present` : `${c.start} – ${c.end}`;
              return `
                <div class="biz-career-item ${isCurrent ? 'is-active' : ''}">
                  <div class="biz-career-dot ${isCurrent ? 'active' : ''}"></div>
                  <div class="biz-career-info">
                    <span class="biz-career-period">${periodStr}</span>
                    <span class="biz-career-role">${c.title} <span class="biz-career-org">· ${c.organization}</span></span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 4. Key Activities & Remarks -->
        <div class="biz-dual-track-container">
          <div class="biz-track-col">
            <div class="biz-track-title-row">
              <span class="biz-track-badge official">Public Filings & Statements</span>
            </div>
            <div class="biz-activities-rail">
              ${activities.map(act => `
                <div class="biz-activity-item">
                  <div class="biz-activity-node"></div>
                  <div class="biz-activity-body">
                    <span class="biz-activity-date">${act.timePublished?.slice(0, 10).replace(/-/g, '/')}</span>
                    <a href="${act.url}" target="_blank" class="biz-activity-title">${act.title}</a>
                    <p class="biz-activity-highlight">${act.highlight}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="biz-track-col">
            <div class="biz-track-title-row">
              <span class="biz-track-badge media">In-Depth Profiles</span>
            </div>
            <div class="biz-news-list">
              ${news.map(nw => `
                <div class="biz-news-item">
                  <div class="biz-news-top">
                    <span class="biz-news-source">${nw.source}</span>
                    <span class="biz-news-date">${nw.timePublished?.slice(0, 10).replace(/-/g, '/')}</span>
                  </div>
                  <a href="${nw.url}" target="_blank" class="biz-news-title">${nw.title}</a>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Handle bar -->
        <div class="biz-figma-handle-wrap" style="padding-top: 10px;">
          <div class="biz-figma-handle-bar"></div>
        </div>
      </div>
    `;
  }
}

