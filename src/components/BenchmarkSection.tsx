import React, { useState } from 'react';
import { Award, CheckCircle, TrendingUp } from 'lucide-react';

interface BenchmarkData {
  provider: string;
  simpleQa: number;
  freshQa: number;
  isOcten?: boolean;
}

const BENCHMARKS: BenchmarkData[] = [
  { provider: 'Octen', simpleQa: 95.2, freshQa: 55.8, isOcten: true },
  { provider: 'Exa instant', simpleQa: 89.2, freshQa: 52.8 },
  { provider: 'Parallel turbo', simpleQa: 88.6, freshQa: 52.8 },
  { provider: 'Tavily ultra-fast', simpleQa: 69.9, freshQa: 43.2 },
];

interface BenchmarkSectionProps {
  version?: 'v1' | 'v2' | 'v3';
}

export const BenchmarkSection: React.FC<BenchmarkSectionProps> = ({ version: propVersion }) => {
  const [metricMode, setMetricMode] = useState<'simple' | 'fresh'>('simple');
  const currentVersion = propVersion || (typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('v') as any) : 'v2') || 'v2';
  const isV1 = currentVersion === 'v1';
  const isV2 = currentVersion === 'v2';
  const isV3 = currentVersion === 'v3';
  const isWhiteBg = isV2 || isV3;

  return (
    <section
      id="benchmarks"
      style={{
        padding: '100px 0 120px',
        position: 'relative',
        backgroundColor: isWhiteBg ? '#ffffff' : 'transparent',
        color: isWhiteBg ? '#0f172a' : '#ffffff',
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* Bottom Transition Gradient for White Section to Dark Footer in v2/v3 */}
      {isWhiteBg && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to bottom, #ffffff, #050806)',
            pointerEvents: 'none'
          }}
        />
      )}

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* 2-Column Split Layout (Matching Reference Screenshot) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            maxWidth: '1140px',
            margin: '0 auto',
            alignItems: 'center'
          }}
        >
          {/* Left Column: Heading & Description */}
          <div>
            <div className="pill-badge" style={{ marginBottom: '16px', backgroundColor: isWhiteBg ? 'rgba(34, 197, 94, 0.1)' : 'rgba(96, 255, 112, 0.1)', borderColor: isWhiteBg ? '#16a34a' : '#60ff70', color: isWhiteBg ? '#15803d' : '#60ff70' }}>
              <Award size={14} color={isWhiteBg ? '#16a34a' : '#60ff70'} />
              <span>Performance & Accuracy</span>
            </div>
            <h2 style={{ color: isWhiteBg ? '#0f172a' : '#fff', marginBottom: '16px' }}>
              Built to Perform
            </h2>
            <h3 style={{ fontSize: '24px', color: isWhiteBg ? '#15803d' : '#60ff70', marginBottom: '16px' }}>
              Top on Industry Benchmarks
            </h3>
            <p style={{ fontSize: '16px', color: isWhiteBg ? '#334155' : 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
              Cleaner inputs for your LLM. Fewer hallucinations downstream. Rated #1 on SimpleQA accuracy and FreshQA Strict evaluation.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setMetricMode('simple')}
                style={{
                  padding: '8px 18px',
                  fontSize: '13.5px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: metricMode === 'simple' ? (isWhiteBg ? '#15803d' : '#60ff70') : (isWhiteBg ? '#f1f5f9' : 'rgba(255,255,255,0.05)'),
                  color: metricMode === 'simple' ? (isWhiteBg ? '#ffffff' : '#050806') : (isWhiteBg ? '#0f172a' : 'var(--text-muted)'),
                  border: isWhiteBg ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.1)'
                }}
              >
                SimpleQA Benchmark
              </button>
              <button
                onClick={() => setMetricMode('fresh')}
                style={{
                  padding: '8px 18px',
                  fontSize: '13.5px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: metricMode === 'fresh' ? (isWhiteBg ? '#15803d' : '#60ff70') : (isWhiteBg ? '#f1f5f9' : 'rgba(255,255,255,0.05)'),
                  color: metricMode === 'fresh' ? (isWhiteBg ? '#ffffff' : '#050806') : (isWhiteBg ? '#0f172a' : 'var(--text-muted)'),
                  border: isWhiteBg ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.1)'
                }}
              >
                FreshQA Strict
              </button>
            </div>
          </div>

          {/* Right Column: Visual Accuracy Bar Chart */}
          <div
            className={isWhiteBg ? (isV3 ? '' : '') : 'card-glass'}
            style={{
              padding: '32px',
              borderRadius: '16px',
              backgroundColor: isWhiteBg ? '#ffffff' : undefined,
              border: isWhiteBg ? '1px solid #e2e8f0' : '1px solid rgba(96, 255, 112, 0.25)',
              boxShadow: isWhiteBg ? '0 10px 30px rgba(0,0,0,0.05)' : undefined
            }}
          >
            <div style={{ fontSize: '12.5px', color: isWhiteBg ? '#475569' : 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>
              {metricMode === 'simple' ? 'SimpleQA Accuracy Score' : 'FreshQA Strict Accuracy Score'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {BENCHMARKS.map((item) => {
                const val = metricMode === 'simple' ? item.simpleQa : item.freshQa;
                return (
                  <div key={item.provider}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14.5px', fontWeight: item.isOcten ? 700 : 400, color: isWhiteBg ? (item.isOcten ? '#0f172a' : '#475569') : (item.isOcten ? '#ffffff' : '#cbd5e1') }}>
                        {item.provider}
                        {item.isOcten && <span className="pill-badge" style={{ fontSize: '10px', marginLeft: '8px', padding: '1px 6px', backgroundColor: isWhiteBg ? '#f0fdf4' : undefined, color: isWhiteBg ? '#16a34a' : undefined, borderColor: isWhiteBg ? '#86efac' : undefined }}>Octen</span>}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: item.isOcten ? (isWhiteBg ? '#15803d' : '#60ff70') : (isWhiteBg ? '#475569' : '#94a3b8') }}>
                        {val}%
                      </span>
                    </div>

                    <div style={{ width: '100%', height: '8px', backgroundColor: isWhiteBg ? '#e2e8f0' : 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${val}%`,
                          height: '100%',
                          backgroundColor: item.isOcten ? (isWhiteBg ? '#16a34a' : '#60ff70') : (isWhiteBg ? '#94a3b8' : '#334155'),
                          boxShadow: item.isOcten ? (isWhiteBg ? 'none' : '0 0 12px #60ff70') : 'none'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '20px', fontSize: '11.5px', color: isWhiteBg ? '#475569' : 'var(--text-dim)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
              FreshQA Strict & SimpleQA benchmarks · January 2026
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
