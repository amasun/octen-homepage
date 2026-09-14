import React, { useState } from 'react';
import { Cpu, Shield, Wrench, Layers, ArrowRight, ExternalLink } from 'lucide-react';

interface EcosystemCategory {
  title: string;
  items: Array<{ name: string; isNew?: boolean; url: string }>;
}

interface VercelEcosystemProps {
  version?: 'v1' | 'v2' | 'v3';
}

const CATEGORIES: EcosystemCategory[] = [
  {
    title: 'Agent Stack',
    items: [
      { name: 'AI SDK', url: 'https://vercel.com/ai-sdk' },
      { name: 'AI Gateway', url: 'https://vercel.com/ai-gateway' },
      { name: 'Sandbox', url: 'https://vercel.com/sandbox' },
      { name: 'Workflows', url: 'https://vercel.com/workflows' },
      { name: 'Connect', isNew: true, url: 'https://vercel.com/connect' },
      { name: 'Passport', isNew: true, url: 'https://vercel.com/passport' },
      { name: 'eve Framework', isNew: true, url: 'https://vercel.com/eve' }
    ]
  },
  {
    title: 'Core Platform & Security',
    items: [
      { name: 'Fluid Compute', url: 'https://vercel.com/fluid' },
      { name: 'Content Delivery (CDN)', url: 'https://vercel.com/cdn' },
      { name: 'Observability', url: 'https://vercel.com/products/observability' },
      { name: 'CI/CD Previews', url: 'https://vercel.com/products/previews' },
      { name: 'Platform WAF Security', url: 'https://vercel.com/security/web-application-firewall' },
      { name: 'Bot ID & Protection', url: 'https://vercel.com/botid' }
    ]
  },
  {
    title: 'Tools & AI Capabilities',
    items: [
      { name: 'Vercel Agent', url: 'https://vercel.com/agent' },
      { name: 'Vercel Drop', isNew: true, url: 'https://vercel.com/drop' },
      { name: 'Agent Skills (skills.sh)', url: 'https://skills.sh' },
      { name: 'Next.js Framework', url: 'https://vercel.com/frameworks/nextjs' },
      { name: 'v0 Generative UI', url: 'https://v0.app' },
      { name: 'Turborepo Monorepo', url: 'https://vercel.com/solutions/turborepo' }
    ]
  },
  {
    title: 'SDKs & Extensions',
    items: [
      { name: 'Vercel SDK', url: 'https://vercel.com/docs/rest-api/sdk' },
      { name: 'Workflow SDK', isNew: true, url: 'https://vercel.com/workflows' },
      { name: 'Flags SDK', url: 'https://vercel.com/docs/flags/flags-sdk-reference' },
      { name: 'Chat SDK', isNew: true, url: 'https://vercel.com/chat' },
      { name: 'Queues SDK', isNew: true, url: 'https://vercel.com/docs/queues/sdk' },
      { name: 'Streamdown AI', url: 'https://streamdown.ai' }
    ]
  }
];

export const VercelEcosystem: React.FC<VercelEcosystemProps> = ({ version }) => {
  const isV2 = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('v') !== 'v1';

  return (
    <section
      style={{
        padding: '90px 0 120px',
        position: 'relative',
        backgroundColor: isV2 ? '#ffffff' : 'transparent',
        color: isV2 ? '#0f172a' : '#ffffff',
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* Bottom Transition Gradient for White Section to Dark Footer in v2 */}
      {isV2 && (
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
        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 56px' }}>
          <div className="pill-badge" style={{ marginBottom: '16px', backgroundColor: isV2 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(96, 255, 112, 0.1)', borderColor: isV2 ? '#16a34a' : '#60ff70', color: isV2 ? '#15803d' : '#60ff70' }}>
            <Layers size={14} color={isV2 ? '#16a34a' : '#60ff70'} />
            <span>Complete Architecture</span>
          </div>
          <h2 style={{ color: isV2 ? '#0f172a' : '#fff', marginBottom: '12px' }}>
            Vercel Agentic Ecosystem
          </h2>
          <p style={{ fontSize: '17px', color: isV2 ? '#475569' : 'var(--text-muted)' }}>
            Explore products, SDKs, and platform building blocks powering modern autonomous systems.
          </p>
        </div>

        {/* Categories Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className={isV2 ? '' : 'card-glass'}
              style={{
                padding: '28px',
                borderRadius: '16px',
                backgroundColor: isV2 ? '#ffffff' : undefined,
                border: isV2 ? '1px solid #e2e8f0' : undefined,
                boxShadow: isV2 ? '0 4px 16px rgba(0,0,0,0.04)' : undefined
              }}
            >
              <h3 style={{ fontSize: '18px', color: isV2 ? '#0f172a' : '#fff', marginBottom: '20px', borderBottom: isV2 ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                {cat.title}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cat.items.map((item, itemIdx) => (
                  <a
                    key={itemIdx}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: isV2 ? '#475569' : 'var(--text-muted)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = isV2 ? '#16a34a' : '#60ff70')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = isV2 ? '#475569' : 'var(--text-muted)')}
                  >
                    <span>{item.name}</span>
                    {item.isNew && <span className="pill-badge" style={{ fontSize: '9px', padding: '1px 5px', backgroundColor: isV2 ? '#f0fdf4' : undefined, color: isV2 ? '#16a34a' : undefined, borderColor: isV2 ? '#86efac' : undefined }}>NEW</span>}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
