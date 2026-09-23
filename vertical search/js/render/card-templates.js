/**
 * Card HTML Template Generators (Subject Cards & Timeline Article Cards)
 * Strictly aligned with originally finalized specification (Commit 7943111)
 */
import { formatDate, formatDateTime, extractDomain } from '../data/verticals-data.js';

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
