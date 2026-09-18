import React from 'react';
import { ArrowRight, Layers, Zap, GitFork, RefreshCw, CheckCircle, Globe, User, Search } from 'lucide-react';

const TOPICS = [
  'AI search engines',
  'LLM vs keyword',
  'Search accuracy',
  'Retrieval methods',
  'Vector databases',
  'Hybrid search',
  'AI agent search',
  'LLM search',
  'Real-time results',
  'Semantic search'
];

export const ArchitectureComparison: React.FC = () => {
  return (
    <section id="architecture" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        {/* Section Title */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 56px' }}>
          <div className="pill-badge search-fast-pill" style={{ marginBottom: '16px' }}>
            <span className="octen-search-fast-prefix">Search</span><span className="octen-search-fast-divider">/</span><span className="octen-search-fast-keyword">FAST</span>
          </div>
          <h2>
            Web Search
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--text-muted)', marginTop: '12px' }}>
            LLM-native web search delivering industry-leading real-time intelligence with lowest latency and enterprise-grade reliability.
          </p>
        </div>

        {/* Visual Architecture Comparison Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '48px'
          }}
        >
          {/* Traditional Search Card */}
          <div
            className="card-glass octen-web-search-card"
            style={{
              borderColor: 'var(--octen-web-search-border)',
              background: 'linear-gradient(180deg, #101411 0%, #0d100e 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '32px 24px'
            }}
          >
            <h3 style={{ fontSize: '24px', fontFamily: 'var(--font-heading)', color: '#ffffff', marginBottom: '6px' }}>
              Human Search
            </h3>

            <div style={{ fontSize: '15px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <span>Single Query</span>
              <span style={{ opacity: 0.6 }}>→</span>
              <span>Sequential Results</span>
            </div>

            {/* Human Search Interactive Flow */}
            <div className="octen-human-search-container">
              {/* Query Pill */}
              <div className="octen-human-query-pill">
                <div className="octen-human-user-avatar">
                  <User size={14} color="#ffffff" />
                </div>
                <span className="octen-human-query-text">What is the best AI search engine?</span>
                <Search size={16} color="#ffffff" strokeWidth={2.2} className="shrink-0" />
              </div>

              {/* Vertical Connector Line */}
              <div className="octen-human-connector-line" />

              {/* 5 Sequential Result Cards */}
              <div className="octen-human-results-panel">
                {[1, 2, 3, 4, 5].map((itemIndex) => (
                  <div key={itemIndex} className="octen-human-result-item">
                    <div className="octen-human-result-top">
                      <Globe className="octen-human-globe" strokeWidth={1.8} />
                      <div className="octen-human-lines-top">
                        <div className="octen-skeleton-bar line-bright" />
                        <div className="octen-skeleton-bar line-top-2" />
                      </div>
                    </div>
                    <div className="octen-human-lines-bottom">
                      <div className="octen-skeleton-bar line-bottom-1" />
                      <div className="octen-skeleton-bar line-bottom-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Octen Search Card */}
          <div
            className="card-glass"
            style={{
              borderColor: 'rgba(96, 255, 112, 0.4)',
              background: 'linear-gradient(180deg, #131d15 0%, #0c140d 100%)',
              boxShadow: '0 10px 40px -10px rgba(96, 255, 112, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#60ff70', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Next-Gen AI Search
              </span>
              <span className="pill-badge" style={{ backgroundColor: 'rgba(96, 255, 112, 0.15)', borderColor: '#60ff70', color: '#60ff70', fontSize: '12px' }}>
                Concurrent Execution
              </span>
            </div>

            <h3 style={{ fontSize: '24px', color: '#ffffff', marginBottom: '16px' }}>
              Octen Concurrent Search
            </h3>

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Intelligently decomposes complex intent into multiple sub-queries executed in parallel across live web indices in milliseconds.
            </p>

            {/* Pipeline visual diagram */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', backgroundColor: 'rgba(96,255,112,0.06)', borderRadius: '8px', border: '1px solid rgba(96,255,112,0.2)' }}>
                <GitFork size={16} color="#60ff70" />
                <span style={{ fontSize: '13.5px', fontFamily: 'var(--font-mono)', color: '#60ff70', fontWeight: 500 }}>
                  Multiple Sub-Queries (14+ Concurrent)
                </span>
              </div>
              
              <div style={{ textAlign: 'center', color: '#60ff70', fontSize: '12px', fontWeight: 500 }}>
                ⚡ Parallel High-Frequency Fan-out
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', backgroundColor: 'rgba(96,255,112,0.06)', borderRadius: '8px', border: '1px solid rgba(96,255,112,0.2)' }}>
                <CheckCircle size={16} color="#60ff70" />
                <span style={{ fontSize: '13.5px', fontFamily: 'var(--font-mono)', color: '#ffffff', fontWeight: 500 }}>
                  Live Concurrent Clean Context
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Concept Pill Tags */}
        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Built around core AI retrieval paradigms
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '880px', margin: '0 auto' }}>
            {TOPICS.map((topic, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '9999px',
                  fontSize: '13.5px',
                  color: '#e2e8f0',
                  transition: 'all 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#60ff70';
                  e.currentTarget.style.color = '#60ff70';
                  e.currentTarget.style.backgroundColor = 'rgba(96, 255, 112, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                }}
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
