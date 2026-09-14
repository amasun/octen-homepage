import React from 'react';
import { Sparkles, MessageSquare, Search, Zap, Image, Compass, ArrowRight } from 'lucide-react';

interface BuiltOnOctenProps {
  version?: 'v1' | 'v2' | 'v3';
}

export const BuiltOnOcten: React.FC<BuiltOnOctenProps> = ({ version: propVersion }) => {
  const currentVersion = propVersion || (typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('v') as any) : 'v2') || 'v2';
  const isV2 = currentVersion !== 'v1';

  return (
    <section
      style={{
        padding: '90px 0',
        position: 'relative',
        backgroundColor: isV2 ? '#ffffff' : 'transparent',
        color: isV2 ? '#0f172a' : '#ffffff',
        transition: 'background-color 0.3s ease'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
          <div className="pill-badge" style={{ marginBottom: '16px', backgroundColor: isV2 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(96, 255, 112, 0.1)', borderColor: isV2 ? '#16a34a' : '#60ff70', color: isV2 ? '#15803d' : '#60ff70' }}>
            <Sparkles size={14} color={isV2 ? '#16a34a' : '#60ff70'} />
            <span>Try it for Free</span>
          </div>
          <h2 style={{ color: isV2 ? '#0f172a' : '#fff', marginBottom: '12px' }}>
            Built on Octen Search
          </h2>
          <p style={{ fontSize: '17px', color: isV2 ? '#475569' : 'var(--text-muted)' }}>
            Real-world enterprise applications running live on Octen retrieval infrastructure.
          </p>
        </div>

        {/* 4 Cards Grid Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {/* Card 1: Answer */}
          <div
            className={isV2 ? '' : 'card-glass'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px',
              borderRadius: '16px',
              backgroundColor: isV2 ? '#ffffff' : undefined,
              border: isV2 ? '1px solid #e2e8f0' : undefined,
              boxShadow: isV2 ? '0 4px 16px rgba(0,0,0,0.04)' : undefined
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: isV2 ? '#64748b' : 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Application 01
                </span>
                <span className="pill-badge" style={{ fontSize: '11px', padding: '1px 6px', backgroundColor: isV2 ? '#f1f5f9' : undefined, color: isV2 ? '#16a34a' : undefined, borderColor: isV2 ? '#cbd5e1' : undefined }}>79ms</span>
              </div>
              <h3 style={{ fontSize: '22px', color: isV2 ? '#0f172a' : '#fff', marginBottom: '10px' }}>Answer API</h3>
              <p style={{ fontSize: '13.5px', color: isV2 ? '#475569' : 'var(--text-muted)', marginBottom: '20px' }}>
                Get structured answers assembled from dozens of sub-queries in milliseconds.
              </p>
            </div>
            <a href="https://octen.ai/platform/answer" target="_blank" rel="noreferrer" className={isV2 ? '' : 'btn-secondary'} style={{ fontSize: '13px', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', backgroundColor: isV2 ? '#f8fafc' : undefined, border: isV2 ? '1px solid #cbd5e1' : undefined, color: isV2 ? '#0f172a' : undefined, fontWeight: 600, textDecoration: 'none' }}>
              <span>Try Answer API</span>
              <ArrowRight size={13} />
            </a>
          </div>

          {/* Card 2: Deep Research */}
          <div
            className={isV2 ? '' : 'card-glass'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px',
              borderRadius: '16px',
              backgroundColor: isV2 ? '#ffffff' : undefined,
              border: isV2 ? '1px solid #e2e8f0' : undefined,
              boxShadow: isV2 ? '0 4px 16px rgba(0,0,0,0.04)' : undefined
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: isV2 ? '#64748b' : 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Application 02
                </span>
                <span className="pill-badge" style={{ fontSize: '11px', padding: '1px 6px', backgroundColor: isV2 ? '#f1f5f9' : undefined, color: isV2 ? '#16a34a' : undefined, borderColor: isV2 ? '#cbd5e1' : undefined }}>172 Queries</span>
              </div>
              <h3 style={{ fontSize: '22px', color: isV2 ? '#0f172a' : '#fff', marginBottom: '10px' }}>Deep Research</h3>
              <p style={{ fontSize: '13.5px', color: isV2 ? '#475569' : 'var(--text-muted)', marginBottom: '20px' }}>
                Enable deep, source-backed research reports across thousands of live web pages.
              </p>
            </div>
            <a href="https://octen.ai/platform/overview" target="_blank" rel="noreferrer" className={isV2 ? '' : 'btn-secondary'} style={{ fontSize: '13px', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', backgroundColor: isV2 ? '#f8fafc' : undefined, border: isV2 ? '1px solid #cbd5e1' : undefined, color: isV2 ? '#0f172a' : undefined, fontWeight: 600, textDecoration: 'none' }}>
              <span>Try Deep Research</span>
              <ArrowRight size={13} />
            </a>
          </div>

          {/* Card 3: Multimodal Chat */}
          <div
            className={isV2 ? '' : 'card-glass'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px',
              borderRadius: '16px',
              backgroundColor: isV2 ? '#ffffff' : undefined,
              border: isV2 ? '1px solid #e2e8f0' : undefined,
              boxShadow: isV2 ? '0 4px 16px rgba(0,0,0,0.04)' : undefined
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: isV2 ? '#64748b' : 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Application 03
                </span>
                <span className="pill-badge" style={{ fontSize: '11px', padding: '1px 6px', backgroundColor: isV2 ? '#f1f5f9' : undefined, color: isV2 ? '#16a34a' : undefined, borderColor: isV2 ? '#cbd5e1' : undefined }}>Multimodal</span>
              </div>
              <h3 style={{ fontSize: '22px', color: isV2 ? '#0f172a' : '#fff', marginBottom: '10px' }}>Multimodal Chat</h3>
              <p style={{ fontSize: '13.5px', color: isV2 ? '#475569' : 'var(--text-muted)', marginBottom: '20px' }}>
                Analyze, search, and chat across text, images, and complex visual documents.
              </p>
            </div>
            <a href="https://octen.ai/platform/overview" target="_blank" rel="noreferrer" className={isV2 ? '' : 'btn-secondary'} style={{ fontSize: '13px', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', backgroundColor: isV2 ? '#f8fafc' : undefined, border: isV2 ? '1px solid #cbd5e1' : undefined, color: isV2 ? '#0f172a' : undefined, fontWeight: 600, textDecoration: 'none' }}>
              <span>Try Multimodal</span>
              <ArrowRight size={13} />
            </a>
          </div>

          {/* Card 4: Grounded Generation */}
          <div
            className={isV2 ? '' : 'card-glass'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px',
              borderRadius: '16px',
              backgroundColor: isV2 ? '#ffffff' : undefined,
              border: isV2 ? '1px solid #e2e8f0' : undefined,
              boxShadow: isV2 ? '0 4px 16px rgba(0,0,0,0.04)' : undefined
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: isV2 ? '#64748b' : 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Application 04
                </span>
                <span className="pill-badge" style={{ fontSize: '11px', padding: '1px 6px', backgroundColor: isV2 ? '#f1f5f9' : undefined, color: isV2 ? '#16a34a' : undefined, borderColor: isV2 ? '#cbd5e1' : undefined }}>Visual</span>
              </div>
              <h3 style={{ fontSize: '22px', color: isV2 ? '#0f172a' : '#fff', marginBottom: '10px' }}>Visual Search</h3>
              <p style={{ fontSize: '13.5px', color: isV2 ? '#475569' : 'var(--text-muted)', marginBottom: '20px' }}>
                Retrieve fine-grained visual details across live web image repositories.
              </p>
            </div>
            <a href="https://octen.ai/platform/overview" target="_blank" rel="noreferrer" className={isV2 ? '' : 'btn-secondary'} style={{ fontSize: '13px', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', backgroundColor: isV2 ? '#f8fafc' : undefined, border: isV2 ? '1px solid #cbd5e1' : undefined, color: isV2 ? '#0f172a' : undefined, fontWeight: 600, textDecoration: 'none' }}>
              <span>Try Visual Search</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
