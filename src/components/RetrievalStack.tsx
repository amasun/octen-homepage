import React, { useState } from 'react';
import { Database, Eye, FileText, Cpu, Award, ExternalLink, ArrowRight, Check } from 'lucide-react';

interface LeaderboardBarItem {
  model: string;
  score: number;
  maxScore: number;
  isOcten?: boolean;
}

const RTEB_BARS: LeaderboardBarItem[] = [
  { model: '1. Octen-Embedding-8B', score: 0.7953, maxScore: 0.85, isOcten: true },
  { model: '2. Octen-Embedding-4B', score: 0.7747, maxScore: 0.85, isOcten: true },
  { model: '3. MoD-Embedding', score: 0.7642, maxScore: 0.85 },
  { model: '4. voyage-4-large', score: 0.7623, maxScore: 0.85 },
  { model: '5. voyage-3-large', score: 0.7434, maxScore: 0.85 },
  { model: '6. Qwen3-Embedding-8B', score: 0.7310, maxScore: 0.85 },
  { model: '7. Octen-Embedding-0.6B', score: 0.7241, maxScore: 0.85, isOcten: true },
  { model: '8. gemini-embedding-001', score: 0.7218, maxScore: 0.85 }
];

const MMEB_BARS: LeaderboardBarItem[] = [
  { model: '1. octen-vl-embedding-large', score: 80.09, maxScore: 90, isOcten: true },
  { model: '2. Qwen3-VL-Embedding-8B', score: 77.82, maxScore: 90 },
  { model: '3. seed1.6-embedding-1215', score: 76.97, maxScore: 90 },
  { model: '4. octen-vl-embedding', score: 75.42, maxScore: 90, isOcten: true },
  { model: '5. DME-2B', score: 74.22, maxScore: 90 },
  { model: '6. WeMM-Embedding-8B', score: 73.90, maxScore: 90 }
];

interface RetrievalStackProps {
  version?: 'v1' | 'v2' | 'v3';
}

export const RetrievalStack: React.FC<RetrievalStackProps> = ({ version: propVersion }) => {
  const [activeItem, setActiveItem] = useState<'embedding' | 'vl-embedding' | 'extract' | 'gateway'>('embedding');
  const currentVersion = propVersion || (typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('v') as any) : 'v2') || 'v2';
  const isV1 = currentVersion === 'v1';
  const isV2 = currentVersion === 'v2';
  const isV3 = currentVersion === 'v3';
  const isWhiteBg = isV2 || isV3;

  return (
    <section
      id="stack"
      style={{
        padding: '100px 0',
        position: 'relative',
        backgroundColor: isWhiteBg ? '#ffffff' : 'rgba(255,255,255,0.01)',
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
            height: '80px',
            background: 'linear-gradient(to bottom, #ffffff, #050806)',
            pointerEvents: 'none'
          }}
        />
      )}

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 56px' }}>
          <div className="pill-badge" style={{ marginBottom: '16px', backgroundColor: isWhiteBg ? 'rgba(34, 197, 94, 0.1)' : 'rgba(96, 255, 112, 0.1)', borderColor: isWhiteBg ? '#16a34a' : '#60ff70', color: isWhiteBg ? '#15803d' : '#60ff70' }}>
            <Database size={14} color={isWhiteBg ? '#16a34a' : '#60ff70'} />
            <span>Beyond Search</span>
          </div>
          <h2 style={{ color: isWhiteBg ? '#0f172a' : '#fff', marginBottom: '16px' }}>
            The complete retrieval stack
          </h2>
          <p style={{ fontSize: '17.5px', color: isWhiteBg ? '#475569' : 'var(--text-muted)' }}>
            Pull clean content from any URL, and embed meaning with the #1 retrieval model for text and vision.
          </p>
        </div>

        {/* 2-Column Split Layout (Matching Reference Screenshot) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '40px',
            maxWidth: '1140px',
            margin: '0 auto',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Vertical Product List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Item 1: Embedding */}
            <div
              onClick={() => setActiveItem('embedding')}
              className={isWhiteBg ? '' : 'card-glass'}
              style={{
                cursor: 'pointer',
                padding: '24px',
                borderRadius: '16px',
                borderColor: activeItem === 'embedding' ? (isWhiteBg ? '#16a34a' : '#60ff70') : (isWhiteBg ? '#e2e8f0' : 'rgba(255,255,255,0.08)'),
                borderWidth: activeItem === 'embedding' ? '2px' : '1px',
                borderStyle: 'solid',
                backgroundColor: isWhiteBg ? (activeItem === 'embedding' ? '#f0fdf4' : '#ffffff') : (activeItem === 'embedding' ? 'rgba(96, 255, 112, 0.06)' : 'var(--bg-card)'),
                boxShadow: isWhiteBg ? '0 4px 16px rgba(0,0,0,0.04)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 600, color: isWhiteBg ? '#0f172a' : '#fff', marginBottom: '8px' }}>
                1. Embedding
              </div>
              <p style={{ fontSize: '14px', color: isWhiteBg ? '#475569' : 'var(--text-muted)', marginBottom: '16px' }}>
                The #1 text embedding model for retrieval. Built specifically to find what your agents need.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="pill-badge" style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: isWhiteBg ? '#f1f5f9' : undefined, color: isWhiteBg ? '#16a34a' : undefined, borderColor: isWhiteBg ? '#cbd5e1' : undefined }}>SOTA on RTEB</span>
                <a href="https://docs.octen.ai/api-reference/embedding" target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: isWhiteBg ? '#16a34a' : '#60ff70', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <span>View Docs</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Item 2: VL Embedding */}
            <div
              onClick={() => setActiveItem('vl-embedding')}
              className={isWhiteBg ? '' : 'card-glass'}
              style={{
                cursor: 'pointer',
                padding: '24px',
                borderRadius: '16px',
                borderColor: activeItem === 'vl-embedding' ? (isWhiteBg ? '#16a34a' : '#60ff70') : (isWhiteBg ? '#e2e8f0' : 'rgba(255,255,255,0.08)'),
                borderWidth: activeItem === 'vl-embedding' ? '2px' : '1px',
                borderStyle: 'solid',
                backgroundColor: isWhiteBg ? (activeItem === 'vl-embedding' ? '#f0fdf4' : '#ffffff') : (activeItem === 'vl-embedding' ? 'rgba(96, 255, 112, 0.06)' : 'var(--bg-card)'),
                boxShadow: isWhiteBg ? '0 4px 16px rgba(0,0,0,0.04)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 600, color: isWhiteBg ? '#0f172a' : '#fff', marginBottom: '8px' }}>
                2. VL Embedding
              </div>
              <p style={{ fontSize: '14px', color: isWhiteBg ? '#475569' : 'var(--text-muted)', marginBottom: '16px' }}>
                The #1 multimodal embedding model for retrieval. One embedding space across text, images, videos, and visual documents.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="pill-badge" style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: isWhiteBg ? '#f1f5f9' : undefined, color: isWhiteBg ? '#16a34a' : undefined, borderColor: isWhiteBg ? '#cbd5e1' : undefined }}>SOTA on MMEB-v2</span>
                <a href="https://docs.octen.ai/api-reference/vl-embedding" target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: isWhiteBg ? '#16a34a' : '#60ff70', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <span>View Docs</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Item 3: Extract */}
            <div
              onClick={() => setActiveItem('extract')}
              className={isWhiteBg ? '' : 'card-glass'}
              style={{
                cursor: 'pointer',
                padding: '24px',
                borderRadius: '16px',
                borderColor: activeItem === 'extract' ? (isWhiteBg ? '#16a34a' : '#60ff70') : (isWhiteBg ? '#e2e8f0' : 'rgba(255,255,255,0.08)'),
                borderWidth: activeItem === 'extract' ? '2px' : '1px',
                borderStyle: 'solid',
                backgroundColor: isWhiteBg ? (activeItem === 'extract' ? '#f0fdf4' : '#ffffff') : (activeItem === 'extract' ? 'rgba(96, 255, 112, 0.06)' : 'var(--bg-card)'),
                boxShadow: isWhiteBg ? '0 4px 16px rgba(0,0,0,0.04)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 600, color: isWhiteBg ? '#0f172a' : '#fff', marginBottom: '8px' }}>
                3. Extract
              </div>
              <p style={{ fontSize: '14px', color: isWhiteBg ? '#475569' : 'var(--text-muted)', marginBottom: '16px' }}>
                Turn any URL into clean markdown, with intent-focused highlights and page classification.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <a href="https://octen.ai/platform/extract" target="_blank" rel="noreferrer" className="btn-primary" style={{ fontSize: '12px', padding: '4px 12px', backgroundColor: isWhiteBg ? '#16a34a' : undefined, color: isWhiteBg ? '#fff' : undefined }}>
                  Get started
                </a>
                <a href="https://docs.octen.ai" target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: isWhiteBg ? '#475569' : 'var(--text-muted)', textDecoration: 'none' }}>
                  View Docs
                </a>
              </div>
            </div>

            {/* Item 4: Model Gateway */}
            <div
              onClick={() => setActiveItem('gateway')}
              className={isWhiteBg ? '' : 'card-glass'}
              style={{
                cursor: 'pointer',
                padding: '24px',
                borderRadius: '16px',
                borderColor: activeItem === 'gateway' ? (isWhiteBg ? '#16a34a' : '#60ff70') : (isWhiteBg ? '#e2e8f0' : 'rgba(255,255,255,0.08)'),
                borderWidth: activeItem === 'gateway' ? '2px' : '1px',
                borderStyle: 'solid',
                backgroundColor: isWhiteBg ? (activeItem === 'gateway' ? '#f0fdf4' : '#ffffff') : (activeItem === 'gateway' ? 'rgba(96, 255, 112, 0.06)' : 'var(--bg-card)'),
                boxShadow: isWhiteBg ? '0 4px 16px rgba(0,0,0,0.04)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 600, color: isWhiteBg ? '#0f172a' : '#fff', marginBottom: '8px' }}>
                4. Model Gateway
              </div>
              <p style={{ fontSize: '14px', color: isWhiteBg ? '#475569' : 'var(--text-muted)', marginBottom: '16px' }}>
                One API to access top-tier models with Octen Search integration. Supports text and image generation.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <a href="https://octen.ai/platform/model" target="_blank" rel="noreferrer" className="btn-primary" style={{ fontSize: '12px', padding: '4px 12px', backgroundColor: isWhiteBg ? '#16a34a' : undefined, color: isWhiteBg ? '#fff' : undefined }}>
                  Get started
                </a>
                <a href="https://docs.octen.ai" target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: isWhiteBg ? '#475569' : 'var(--text-muted)', textDecoration: 'none' }}>
                  View Docs
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Preview Panel */}
          <div
            className={isWhiteBg ? (isV3 ? '' : 'card-glass') : 'card-glass'}
            style={{
              padding: '28px',
              minHeight: '480px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: '16px',
              backgroundColor: isV3 ? '#ffffff' : (isV2 ? '#0c100e' : undefined),
              border: isV3 ? '1px solid #e2e8f0' : (isV2 ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(96, 255, 112, 0.2)'),
              boxShadow: isV3 ? '0 10px 30px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            {activeItem === 'embedding' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: isV3 ? '#16a34a' : '#60ff70', fontFamily: 'var(--font-mono)' }}>
                    RTEB Leaderboard · January 2026
                  </span>
                  <span className="pill-badge" style={{ fontSize: '11px', backgroundColor: isV3 ? '#f0fdf4' : undefined, color: isV3 ? '#16a34a' : undefined, borderColor: isV3 ? '#86efac' : undefined }}>Text Retrieval SOTA</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {RTEB_BARS.map((bar, idx) => {
                    const widthPct = (bar.score / bar.maxScore) * 100;
                    return (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                          <span style={{ color: isV3 ? (bar.isOcten ? '#0f172a' : '#475569') : (bar.isOcten ? '#ffffff' : 'var(--text-muted)'), fontWeight: bar.isOcten ? 600 : 400 }}>
                            {bar.model}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', color: isV3 ? (bar.isOcten ? '#16a34a' : '#64748b') : (bar.isOcten ? '#60ff70' : 'var(--text-dim)') }}>
                            {bar.score}
                          </span>
                        </div>
                        <div style={{ height: '7px', width: '100%', backgroundColor: isV3 ? '#e2e8f0' : 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${widthPct}%`,
                              height: '100%',
                              backgroundColor: isV3 ? (bar.isOcten ? '#16a34a' : '#cbd5e1') : (bar.isOcten ? '#60ff70' : '#334155'),
                              boxShadow: isV3 ? 'none' : (bar.isOcten ? '0 0 10px #60ff70' : 'none')
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeItem === 'vl-embedding' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: isV3 ? '#16a34a' : '#60ff70', fontFamily: 'var(--font-mono)' }}>
                    MMEB-V2 Leaderboard · May 2026
                  </span>
                  <span className="pill-badge" style={{ fontSize: '11px', backgroundColor: isV3 ? '#f0fdf4' : undefined, color: isV3 ? '#16a34a' : undefined, borderColor: isV3 ? '#86efac' : undefined }}>Multimodal Vision SOTA</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {MMEB_BARS.map((bar, idx) => {
                    const widthPct = (bar.score / bar.maxScore) * 100;
                    return (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                          <span style={{ color: isV3 ? (bar.isOcten ? '#0f172a' : '#475569') : (bar.isOcten ? '#ffffff' : 'var(--text-muted)'), fontWeight: bar.isOcten ? 600 : 400 }}>
                            {bar.model}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', color: isV3 ? (bar.isOcten ? '#16a34a' : '#64748b') : (bar.isOcten ? '#60ff70' : 'var(--text-dim)') }}>
                            {bar.score}
                          </span>
                        </div>
                        <div style={{ height: '7px', width: '100%', backgroundColor: isV3 ? '#e2e8f0' : 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${widthPct}%`,
                              height: '100%',
                              backgroundColor: isV3 ? (bar.isOcten ? '#16a34a' : '#cbd5e1') : (bar.isOcten ? '#60ff70' : '#334155'),
                              boxShadow: isV3 ? 'none' : (bar.isOcten ? '0 0 10px #60ff70' : 'none')
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeItem === 'extract' && (
              <div style={{ backgroundColor: '#070a08', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#60ff70', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
                  <span>https://www.apple.com/</span>
                  <span style={{ color: 'var(--text-dim)' }}>• 164ms</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '6px' }}>Title: <span style={{ color: '#fff' }}>Apple</span></div>
                <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '16px' }}>Category: <span style={{ color: '#cbd5e1' }}>Computers & Electronics</span></div>
                <div className="code-window">
                  <pre style={{ padding: '14px', fontSize: '12.5px', color: '#60ff70', margin: 0 }}>
                    {`## iPhone
Meet the latest iPhone lineup.
![iPhone 17 Pro, deep blue color, Pro Fusion camera system...]`}
                  </pre>
                </div>
              </div>
            )}

            {activeItem === 'gateway' && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Cpu size={48} color="#60ff70" style={{ marginBottom: '16px' }} />
                <h4 style={{ color: '#fff', fontSize: '20px', marginBottom: '8px' }}>Model Gateway Architecture</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  One API endpoint to access top LLM models with built-in Octen Search grounding natively integrated.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
