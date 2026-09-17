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
          borderTop: '1px solid rgba(207, 207, 207, 0.2)',
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
        backgroundColor: '#050806',
        borderTop: '1px solid rgba(207, 207, 207, 0.2)',
        paddingTop: '80px',
        paddingBottom: '0',
        position: 'relative'
      }}
      data-node-id="13625:174217"
    >
      <div className="container" style={{ position: 'relative' }} data-node-id="13625:174219">
        {/* Top Header: Logo & Slogan with bottom divider */}
        <div
          style={{
            borderBottom: '1px solid rgba(207, 207, 207, 0.2)',
            paddingBottom: '60px',
            marginBottom: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'flex-start',
            alignSelf: 'stretch'
          }}
          data-node-id="13625:178499"
        >
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: '20px', paddingBottom: '10px' }}>
            <img src="/_next/static/media/logo-white.690e48c0.svg" alt="Octen logo" style={{ width: '184px', height: 'auto' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '17px' }}>
            <span style={{ fontSize: '41.5px', fontFamily: 'var(--font-heading)', fontWeight: 300, color: '#fff', lineHeight: 1 }}>
              The Foundation of
            </span>
            <span style={{ fontSize: '41.5px', fontFamily: 'var(--font-heading)', fontStyle: 'italic', color: '#70fe7e', lineHeight: 1 }}>
              Real-Time AI
            </span>
          </div>
        </div>

        {/* 5-Column Navigation Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            gap: '40px',
            paddingBottom: '110px'
          }}
          data-node-id="13625:174221"
        >
          {/* Col 1: Get In Touch */}
          <div>
            <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '16px', fontWeight: 400, lineHeight: 1.5 }}>
              GET IN TOUCH
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <a href="mailto:support@octen.ai" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', lineHeight: '24px' }}>
                  <Mail size={16} color="#039855" />
                  <span>support@octen.ai</span>
                </a>
                <span style={{ fontSize: '14px', textTransform: 'uppercase', color: '#71717a', letterSpacing: '0.05em', paddingLeft: '24px', display: 'block', marginTop: '2px', lineHeight: 1 }}>
                  GENERAL INQUIRIES
                </span>
              </div>
              <div>
                <a href="mailto:kuan@octen.ai" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', lineHeight: '24px' }}>
                  <Mail size={16} color="#039855" />
                  <span>kuan@octen.ai</span>
                </a>
                <span style={{ fontSize: '14px', textTransform: 'uppercase', color: '#71717a', letterSpacing: '0.05em', paddingLeft: '24px', display: 'block', marginTop: '2px', lineHeight: 1 }}>
                  FOUNDER &amp; CEO
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Search */}
          <div>
            <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '16px', fontWeight: 400, lineHeight: 1.5 }}>
              SEARCH
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '16px', lineHeight: '24px' }}>
              <li><a href="https://docs.octen.ai/capabilities/broad-search" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Broad Search</a></li>
              <li><a href="https://docs.octen.ai/capabilities/web-search" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Web Search</a></li>
              <li><a href="https://docs.octen.ai/capabilities/image-search" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Image Search</a></li>
              <li><a href="https://docs.octen.ai/capabilities/video-search" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Video Search</a></li>
              <li><a href="#vertical-search" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>News Search</a></li>
              <li><a href="#vertical-search" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Business Search</a></li>
            </ul>
          </div>

          {/* Col 3: Models & Tools */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '16px', fontWeight: 400, lineHeight: 1.5 }}>
                MODELS
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '16px', lineHeight: '24px' }}>
                <li><a href="https://docs.octen.ai/capabilities/model-gateway" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Model Gateway</a></li>
                <li><a href="https://docs.octen.ai/capabilities/embedding" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Embedding</a></li>
                <li><a href="https://docs.octen.ai/capabilities/vl-embedding" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>VL Embedding</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '16px', fontWeight: 400, lineHeight: 1.5 }}>
                TOOLS
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '16px', lineHeight: '24px' }}>
                <li><a href="https://docs.octen.ai/capabilities/extract" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Extract</a></li>
                <li><a href="https://docs.octen.ai/capabilities/collect" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Collect</a></li>
              </ul>
            </div>
          </div>

          {/* Col 4: Application */}
          <div>
            <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '16px', fontWeight: 400, lineHeight: 1.5 }}>
              APPLICATION
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '16px', lineHeight: '24px' }}>
              <li><a href="https://docs.octen.ai/capabilities/answer" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Answer</a></li>
              <li><a href="https://docs.octen.ai/capabilities/answer" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Deep Research</a></li>
              <li><a href="https://docs.octen.ai/capabilities/answer" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Multimodal Chat</a></li>
              <li><a href="https://docs.octen.ai/capabilities/answer" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Grounded Generation</a></li>
            </ul>
          </div>

          {/* Col 5: Developers & Company (Stacked) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '110px' }}>
            <div>
              <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '16px', fontWeight: 400, lineHeight: 1.5 }}>
                DEVELOPERS
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '16px', lineHeight: '24px' }}>
                <li><a href="https://status.octen.ai/" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Status</a></li>
                <li><a href="https://github.com/Octen-Team" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>GitHub</a></li>
                <li><a href="https://octen.ai/platform/overview" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>API Platform</a></li>
                <li><a href="https://docs.octen.ai" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '16px', fontWeight: 400, lineHeight: 1.5 }}>
                COMPANY
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '16px', lineHeight: '24px' }}>
                <li><a href="https://octen.ai/blog" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Blog</a></li>
                <li><a href="https://octen.ai/contact-sales" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* SOC 2 Certification Badge (Figma 13625:174285 - absolute bottom-right logo above the bottom bar) */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: '91px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px 6px 12px',
            backgroundColor: 'rgba(15,32,24,0.53)',
            backdropFilter: 'blur(2px)',
            borderRadius: '8px',
            border: '1px solid #41535b',
            zIndex: 10
          }}
          data-node-id="13625:174285"
        >
          <ShieldCheck size={20} color="#FFFFFF" strokeWidth={2} />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: '12px', color: '#fff', fontWeight: 700, letterSpacing: '0.05em' }}>SOC 2®</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Type 2</div>
          </div>
        </div>

        {/* Bottom Legal Bar (Figma 13625:174279) */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '30px',
            paddingBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.8)'
          }}
          data-node-id="13625:174279"
        >
          <div>© 2026 APITECH AI PTE. LTD. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '30px' }}>
            <a href="https://octen.ai/privacy-policy" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="https://octen.ai/terms-of-service" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
