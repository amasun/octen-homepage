import React from 'react';
import { Sparkles, Shield, Box, Terminal, ArrowRight, ExternalLink } from 'lucide-react';

interface VercelRecentlyShippedProps {
  version?: 'v1' | 'v2' | 'v3';
}

export const VercelRecentlyShipped: React.FC<VercelRecentlyShippedProps> = ({ version: propVersion }) => {
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
      {/* Top Transition Gradient for White Section in v2 */}
      {isV2 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to bottom, #050806, #ffffff)',
            pointerEvents: 'none'
          }}
        />
      )}

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
          <div className="pill-badge" style={{ marginBottom: '16px', backgroundColor: isV2 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(96, 255, 112, 0.1)', borderColor: isV2 ? '#16a34a' : '#60ff70', color: isV2 ? '#15803d' : '#60ff70' }}>
            <Sparkles size={14} color={isV2 ? '#16a34a' : '#60ff70'} />
            <span>Latest Innovations</span>
          </div>
          <h2 style={{ color: isV2 ? '#0f172a' : '#fff', marginBottom: '12px' }}>
            Recently Shipped
          </h2>
          <p style={{ fontSize: '17px', color: isV2 ? '#475569' : 'var(--text-muted)' }}>
            Cutting-edge developer tools and frameworks built for the agentic era.
          </p>
        </div>

        {/* 3 Shipped Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            maxWidth: '1100px',
            margin: '0 auto'
          }}
        >
          {/* Card 1: eve */}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Box size={18} color={isV2 ? '#16a34a' : '#60ff70'} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: isV2 ? '#64748b' : 'var(--text-dim)', textTransform: 'uppercase' }}>Framework</span>
                </div>
                <span className="pill-badge" style={{ fontSize: '11px', padding: '1px 6px', backgroundColor: isV2 ? '#f0fdf4' : undefined, color: isV2 ? '#16a34a' : undefined, borderColor: isV2 ? '#86efac' : undefined }}>NEW</span>
              </div>
              <h3 style={{ fontSize: '22px', color: isV2 ? '#0f172a' : '#fff', marginBottom: '10px' }}>eve Framework</h3>
              <p style={{ fontSize: '14px', color: isV2 ? '#475569' : 'var(--text-muted)', marginBottom: '24px' }}>
                A modern framework engineered specifically for building durable, stateful AI agents.
              </p>
            </div>
            <a href="https://vercel.com/eve" target="_blank" rel="noreferrer" className={isV2 ? '' : 'btn-secondary'} style={{ fontSize: '13px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', backgroundColor: isV2 ? '#f8fafc' : undefined, border: isV2 ? '1px solid #cbd5e1' : undefined, color: isV2 ? '#0f172a' : undefined, fontWeight: 600, textDecoration: 'none' }}>
              <span>Learn about eve</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Card 2: Passport */}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} color={isV2 ? '#16a34a' : '#60ff70'} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: isV2 ? '#64748b' : 'var(--text-dim)', textTransform: 'uppercase' }}>Security</span>
                </div>
                <span className="pill-badge" style={{ fontSize: '11px', padding: '1px 6px', backgroundColor: isV2 ? '#f0fdf4' : undefined, color: isV2 ? '#16a34a' : undefined, borderColor: isV2 ? '#86efac' : undefined }}>NEW</span>
              </div>
              <h3 style={{ fontSize: '22px', color: isV2 ? '#0f172a' : '#fff', marginBottom: '10px' }}>Passport</h3>
              <p style={{ fontSize: '14px', color: isV2 ? '#475569' : 'var(--text-muted)', marginBottom: '24px' }}>
                Secure every internal agent, app, and deployment with your existing identity provider.
              </p>
            </div>
            <a href="https://vercel.com/passport" target="_blank" rel="noreferrer" className={isV2 ? '' : 'btn-secondary'} style={{ fontSize: '13px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', backgroundColor: isV2 ? '#f8fafc' : undefined, border: isV2 ? '1px solid #cbd5e1' : undefined, color: isV2 ? '#0f172a' : undefined, fontWeight: 600, textDecoration: 'none' }}>
              <span>Learn about Passport</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Card 3: Connect */}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={18} color={isV2 ? '#16a34a' : '#60ff70'} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: isV2 ? '#64748b' : 'var(--text-dim)', textTransform: 'uppercase' }}>Database</span>
                </div>
                <span className="pill-badge" style={{ fontSize: '11px', padding: '1px 6px', backgroundColor: isV2 ? '#f0fdf4' : undefined, color: isV2 ? '#16a34a' : undefined, borderColor: isV2 ? '#86efac' : undefined }}>NEW</span>
              </div>
              <h3 style={{ fontSize: '22px', color: isV2 ? '#0f172a' : '#fff', marginBottom: '10px' }}>Connect</h3>
              <p style={{ fontSize: '14px', color: isV2 ? '#475569' : 'var(--text-muted)', marginBottom: '24px' }}>
                Safely link production databases and cloud backends directly to AI agents.
              </p>
            </div>
            <a href="https://vercel.com/connect" target="_blank" rel="noreferrer" className={isV2 ? '' : 'btn-secondary'} style={{ fontSize: '13px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', backgroundColor: isV2 ? '#f8fafc' : undefined, border: isV2 ? '1px solid #cbd5e1' : undefined, color: isV2 ? '#0f172a' : undefined, fontWeight: 600, textDecoration: 'none' }}>
              <span>Learn about Connect</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
