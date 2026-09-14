import React from 'react';
import { ArrowRight, Layers, Zap, GitFork, RefreshCw, CheckCircle } from 'lucide-react';

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
          <div className="pill-badge" style={{ marginBottom: '16px' }}>
            <Layers size={14} color="#60ff70" />
            <span>Architecture Breakdown</span>
          </div>
          <h2>
            Web Search API <span className="text-gradient">Built for AI</span>
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
            className="card-glass"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.08)',
              background: 'linear-gradient(180deg, #101411 0%, #0d100e 100%)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Legacy Search Engine
              </span>
              <span className="pill-badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '12px' }}>
                Sequential Pipeline
              </span>
            </div>

            <h3 style={{ fontSize: '24px', color: '#cbd5e1', marginBottom: '16px' }}>
              Human Search
            </h3>

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Single keyword query sent to traditional index. Evaluates web pages sequentially, returning static blue links.
            </p>

            {/* Pipeline visual diagram */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                <span style={{ fontSize: '13.5px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>Single User Query</span>
              </div>
              
              <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '12px' }}>↓ Sequential processing</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#64748b' }} />
                <span style={{ fontSize: '13.5px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>10 Sequential Blue Links</span>
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
