import React, { useState } from 'react';
import { Cpu, Zap, Globe, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface CaseStudy {
  id: string;
  company: string;
  stat: string;
  headline: string;
  features: string[];
  metrics: Array<{ label: string; val: string }>;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'notion',
    company: 'Notion',
    stat: 'Millions of Agent Conversations Daily',
    headline: 'Build agents on infrastructure that thinks like them',
    features: [
      'Durable Orchestration & Workflow State',
      'Sandboxed VM Environments',
      'AI Model Gateway & Fallbacks',
      'Fluid Compute Auto-scaling'
    ],
    metrics: [
      { label: 'Daily Agent Chats', val: '10M+' },
      { label: 'Cold Start Latency', val: '< 15ms' },
      { label: 'Uptime SLA', val: '99.99%' }
    ]
  },
  {
    id: 'zapier',
    company: 'Zapier',
    stat: '100M+ Monthly Visits Served',
    headline: 'Ship apps that scale from zero to millions instantly',
    features: [
      'Global Edge CDN Delivery',
      'Instant Preview Deployment Environments',
      'High-Concurrency Serverless Functions',
      'Enterprise Web Application Firewall (WAF)'
    ],
    metrics: [
      { label: 'Monthly Visits', val: '100M+' },
      { label: 'Global Edge Locations', val: '100+' },
      { label: 'TTFB Latency', val: '18ms' }
    ]
  },
  {
    id: 'mintlify',
    company: 'Mintlify',
    stat: '20,000+ Companies Documented',
    headline: 'Host platforms that serve every customer',
    features: [
      'Multi-tenant Account & Data Isolation',
      'Custom Domain Management & Routing',
      'Automatic Custom SSL Certificate Issuance',
      'Instant Git Preview URLs'
    ],
    metrics: [
      { label: 'Active Docs Hosted', val: '20,000+' },
      { label: 'Custom Domains', val: '50k+' },
      { label: 'Global Availability', val: '100%' }
    ]
  }
];

export const VercelCaseStudies: React.FC = () => {
  const [activeStudy, setActiveStudy] = useState<CaseStudy>(CASE_STUDIES[0]);

  return (
    <section id="case-studies" style={{ padding: '90px 0', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px' }}>
          <div className="pill-badge" style={{ marginBottom: '16px' }}>
            <Globe size={14} color="#60ff70" />
            <span>Proven Enterprise Scale</span>
          </div>
          <h2 style={{ color: '#fff', marginBottom: '16px' }}>
            Infrastructure Engineered for AI Scale
          </h2>
          <p style={{ fontSize: '17.5px', color: 'var(--text-muted)' }}>
            Powering the next generation of AI-native enterprise products from zero to millions of requests.
          </p>
        </div>

        {/* Company Selector Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '36px', flexWrap: 'wrap' }}>
          {CASE_STUDIES.map((cs) => {
            const isSelected = activeStudy.id === cs.id;
            return (
              <button
                key={cs.id}
                onClick={() => setActiveStudy(cs)}
                className={isSelected ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '10px 24px', fontSize: '14.5px' }}
              >
                <span>{cs.company}</span>
                <span className="pill-badge" style={{ fontSize: '11px', padding: '2px 8px' }}>{cs.stat}</span>
              </button>
            );
          })}
        </div>

        {/* Case Study Card */}
        <div className="card-glass" style={{ maxWidth: '1020px', margin: '0 auto', padding: '36px', borderColor: 'rgba(96, 255, 112, 0.25)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
            {/* Left side text */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#60ff70', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
                {activeStudy.company} Case Study
              </div>
              <h3 style={{ fontSize: '26px', color: '#fff', marginBottom: '16px' }}>
                {activeStudy.headline}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {activeStudy.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', color: '#cbd5e1' }}>
                    <CheckCircle2 size={16} color="#60ff70" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <a href="https://vercel.com/customers" target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '13.5px' }}>
                <span>Read {activeStudy.company} Story</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Right side stats box */}
            <div style={{ backgroundColor: '#070a08', padding: '28px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '20px' }}>
                Real-World Scale Performance
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {activeStudy.metrics.map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{m.label}</span>
                    <span style={{ fontSize: '22px', fontWeight: 700, color: '#60ff70', fontFamily: 'var(--font-mono)' }}>{m.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
