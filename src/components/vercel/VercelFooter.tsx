import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const VercelFooter: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#050705',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '80px',
        paddingBottom: '40px',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Brand & Links Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '32px',
            marginBottom: '60px'
          }}
        >
          {/* Column 1: Solutions */}
          <div>
            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', marginBottom: '16px' }}>
              Solutions (Build)
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <li><a href="https://vercel.com/solutions/ai-apps" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>AI Apps</a></li>
              <li><a href="https://vercel.com/solutions/web-apps" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Web Apps</a></li>
              <li><a href="https://vercel.com/solutions/marketing-sites" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Marketing Sites</a></li>
              <li><a href="https://vercel.com/solutions/multi-tenant-saas" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Multi-Tenant Platforms</a></li>
              <li><a href="https://vercel.com/solutions/composable-commerce" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Composable Commerce</a></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', marginBottom: '16px' }}>
              Learn & Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <li><a href="https://vercel.com/docs" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Documentation</a></li>
              <li><a href="https://vercel.com/blog" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Vercel Blog</a></li>
              <li><a href="https://vercel.com/changelog" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Changelog</a></li>
              <li><a href="https://vercel.com/customers" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Customer Stories</a></li>
              <li><a href="https://vercel.com/templates" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Deploy Templates</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', marginBottom: '16px' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <li><a href="https://vercel.com/about" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About Vercel</a></li>
              <li><a href="https://vercel.com/careers" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Careers</a></li>
              <li><a href="https://vercel.com/enterprise" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Enterprise</a></li>
              <li><a href="https://vercel.com/pricing" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Pricing Plan</a></li>
            </ul>
          </div>

          {/* Column 4: Trust & Status */}
          <div>
            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', marginBottom: '16px' }}>
              Trust & Security
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', marginBottom: '20px' }}>
              <li><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a></li>
              <li><a href="https://vercel.com/legal/terms" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a></li>
              <li><a href="https://security.vercel.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Trust Center</a></li>
              <li><a href="https://vercel-status.com" target="_blank" rel="noreferrer" style={{ color: '#60ff70', textDecoration: 'none' }}>System Status: Operational</a></li>
            </ul>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ShieldCheck size={16} color="#60ff70" />
              <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>SOC 2® Type 2 Compliant</span>
            </div>
          </div>
        </div>

        {/* Legal Bar */}
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
          <div>© 2026 Vercel Inc. All rights reserved. Powered by Octen UI System.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="https://github.com/vercel" target="_blank" rel="noreferrer" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>GitHub</a>
            <a href="https://x.com/vercel" target="_blank" rel="noreferrer" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>X / Twitter</a>
            <a href="https://linkedin.com/company/vercel" target="_blank" rel="noreferrer" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
