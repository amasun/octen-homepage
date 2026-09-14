import React from 'react';
import { Mail, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  version?: 'v1' | 'v2' | 'v3';
}

export const Footer: React.FC<FooterProps> = ({ version }) => {
  const isV1 = version === 'v1';

  if (isV1) {
    return (
      <footer
        style={{
          backgroundColor: '#050806',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '60px',
          paddingBottom: '40px',
          color: '#94a3b8'
        }}
      >
        <div className="container">
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}>
              Footer & Resources
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '40px',
              marginBottom: '48px'
            }}
          >
            {/* Get in Touch */}
            <div>
              <h4 style={{ fontSize: '14px', color: '#ffffff', fontWeight: 600, marginBottom: '16px' }}>
                Get in Touch
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                <li>
                  General Inquiries: <a href="mailto:support@octen.ai" style={{ color: '#60ff70', textDecoration: 'underline' }}>support@octen.ai</a>
                </li>
                <li>
                  Founder & CEO: <a href="mailto:kuan@octen.ai" style={{ color: '#60ff70', textDecoration: 'underline' }}>kuan@octen.ai</a>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 style={{ fontSize: '14px', color: '#ffffff', fontWeight: 600, marginBottom: '16px' }}>
                Products
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <li><a href="https://octen.ai/platform/broad-search" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Broad Search</a></li>
                <li><a href="https://octen.ai/platform/web-search" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Web Search</a></li>
                <li>Image Search <em>(Early Access)</em></li>
                <li>Video Search <em>(Early Access)</em></li>
                <li><a href="https://octen.ai/platform/model" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Model Gateway</a></li>
                <li><a href="https://octen.ai/platform/extract" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Extract</a></li>
                <li><a href="https://docs.octen.ai/api-reference/embedding" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Embedding</a></li>
                <li><a href="https://docs.octen.ai/api-reference/vl-embedding" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>VL Embedding</a></li>
                <li><a href="https://octen.ai/platform/answer" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Application / Answer</a></li>
              </ul>
            </div>

            {/* Developers & Company */}
            <div>
              <h4 style={{ fontSize: '14px', color: '#ffffff', fontWeight: 600, marginBottom: '16px' }}>
                Developers & Company
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <li><a href="https://status.octen.ai/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Status</a></li>
                <li><a href="https://github.com/Octen-Team" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>GitHub</a></li>
                <li><a href="https://octen.ai/platform/overview" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>API Platform</a></li>
                <li><a href="https://docs.octen.ai" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Docs</a></li>
                <li><a href="https://octen.ai/blog" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Blog</a></li>
                <li><a href="https://octen.ai/contact-sales" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact Sales</a></li>
              </ul>
            </div>
          </div>

          {/* Certifications & Legal */}
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              fontSize: '13px'
            }}
          >
            <div>
              <strong>Certifications & Legal:</strong> SOC 2® Type 2 Compliant
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="https://octen.ai/privacy-policy" target="_blank" rel="noreferrer" style={{ color: '#60ff70', textDecoration: 'underline' }}>Privacy Policy</a>
              <span>•</span>
              <a href="https://octen.ai/terms-of-service" target="_blank" rel="noreferrer" style={{ color: '#60ff70', textDecoration: 'underline' }}>Terms of Service</a>
            </div>
            <div>© 2026 Octen Inc. All rights reserved.</div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      style={{
        backgroundColor: '#070907',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '80px',
        paddingBottom: '40px',
        position: 'relative'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}
        >
          {/* Brand Info */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #18331c, #070c08)',
                  border: '1px solid rgba(96, 255, 112, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#60ff70' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 600, color: '#fff' }}>
                Octen
              </span>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '360px', marginBottom: '24px', lineHeight: '1.6' }}>
              Real-time, low-latency AI-native web search and retrieval infrastructure engineered for enterprise AI agents.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
              <a href="mailto:support@octen.ai" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="#60ff70" />
                <span>support@octen.ai</span>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>(General Inquiries)</span>
              </a>
              <a href="mailto:kuan@octen.ai" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="#60ff70" />
                <span>kuan@octen.ai</span>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>(Founder & CEO)</span>
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', marginBottom: '20px' }}>
              Products
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><a href="https://octen.ai/platform/broad-search" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Broad Search</a></li>
              <li><a href="https://octen.ai/platform/web-search" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Web Search API</a></li>
              <li><span style={{ color: 'var(--text-dim)' }}>Image Search <span className="pill-badge" style={{ fontSize: '9px', padding: '1px 5px' }}>Early Access</span></span></li>
              <li><span style={{ color: 'var(--text-dim)' }}>Video Search <span className="pill-badge" style={{ fontSize: '9px', padding: '1px 5px' }}>Early Access</span></span></li>
              <li><a href="https://octen.ai/platform/model" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Model Gateway</a></li>
              <li><a href="https://octen.ai/platform/extract" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Extract API</a></li>
              <li><a href="https://docs.octen.ai/api-reference/embedding" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Embedding Model</a></li>
              <li><a href="https://docs.octen.ai/api-reference/vl-embedding" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>VL Embedding</a></li>
            </ul>
          </div>

          {/* Developers Column */}
          <div>
            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', marginBottom: '20px' }}>
              Developers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><a href="https://status.octen.ai/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>System Status</a></li>
              <li><a href="https://github.com/Octen-Team" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>GitHub Organization</a></li>
              <li><a href="https://octen.ai/platform/overview" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>API Platform</a></li>
              <li><a href="https://docs.octen.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Documentation</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', marginBottom: '20px' }}>
              Company & Trust
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', marginBottom: '24px' }}>
              <li><a href="https://octen.ai/blog" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Blog</a></li>
              <li><a href="https://octen.ai/contact-sales" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact Sales</a></li>
            </ul>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ShieldCheck size={16} color="#60ff70" />
              <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>SOC 2® Type 2 Certified</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '13px',
            color: 'var(--text-dim)'
          }}
        >
          <div>© 2026 Octen Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="https://octen.ai/privacy-policy" target="_blank" rel="noreferrer" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="https://octen.ai/terms-of-service" target="_blank" rel="noreferrer" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
