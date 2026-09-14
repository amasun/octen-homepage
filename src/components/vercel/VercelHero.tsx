import React, { useState } from 'react';
import { ArrowRight, Cpu, Terminal, Shield, Zap, Sparkles, Check, ExternalLink, Code2 } from 'lucide-react';

interface AgentPillar {
  id: string;
  title: string;
  focus: string;
  desc: string;
  codeSnippet: string;
}

const PILLARS: AgentPillar[] = [
  {
    id: 'for-coding-agents',
    title: 'For Coding Agents',
    focus: 'Native Protocol & CLI Integration',
    desc: 'For coding agents to deploy in their native language, with Vercel’s API, CLI, MCP, and Skills.',
    codeSnippet: `npx skills add vercel/agent-deploy -a claude-code
# Deploying autonomously via MCP tool
vercel deploy --prod --token $VERCEL_AGENT_TOKEN`
  },
  {
    id: 'to-ship-apps',
    title: 'To Ship Apps & Agents',
    focus: 'Sandboxed VMs & Models',
    desc: 'To ship apps and agents in Sandboxed VMs, with durable backends, powered by hundreds of models.',
    codeSnippet: `import { createSandbox } from '@vercel/sandbox';

const vm = await createSandbox({
  runtime: 'node-20',
  timeout: '30m'
});
await vm.exec('pnpm install && pnpm build');`
  },
  {
    id: 'automated-by-agents',
    title: 'Automated by Agents',
    focus: 'Self-Healing AI PRs',
    desc: 'Automated by agents who autonomously investigate errors, plan fixes, and open verified GitHub PRs.',
    codeSnippet: `// Vercel Autonomous Agent Incident Remediation
[Agent] Detected 500 error on /api/checkout
[Agent] Isolated stacktrace -> Fixed in PR #402
[Agent] CI/CD status: Passed (Deploy Preview Live)`
  }
];

interface VercelHeroProps {
  version?: 'v1' | 'v2' | 'v3';
}

export const VercelHero: React.FC<VercelHeroProps> = ({ version: propVersion }) => {
  const [activePillar, setActivePillar] = useState<AgentPillar>(PILLARS[0]);
  const [copied, setCopied] = useState(false);

  const currentVersion = propVersion || (typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('v') as any) : 'v2') || 'v2';
  const isV1 = currentVersion === 'v1';

  const copySnippet = () => {
    navigator.clipboard.writeText(activePillar.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{ paddingTop: '150px', paddingBottom: '80px', position: 'relative' }}>
      {/* Background Top Glow (Hidden in v1 via CSS) */}
      {!isV1 && <div className="hero-top-glow" />}

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Event Banner */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <a
            href="https://vercel.fyi/qqAGIC2"
            target="_blank"
            rel="noreferrer"
            className="pill-badge"
            style={{ padding: '6px 18px', fontSize: '13.5px', textDecoration: 'none', cursor: 'pointer' }}
          >
            <Sparkles size={14} color="#60ff70" />
            <span>Ship 26 is coming to SF — Get your ticket →</span>
          </a>
        </div>

        {/* Hero Title (Strictly matching octen_ui_spec.json typography and vercel_website_content.md) */}
        <div style={{ textAlign: 'center', maxWidth: '920px', margin: '0 auto 28px' }}>
          <h1 style={{ color: '#ffffff', marginBottom: '20px', fontFamily: 'Fraunces, serif', fontWeight: 400 }}>
            Agentic Infrastructure
          </h1>
          <p style={{ fontSize: '19px', color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto', lineHeight: '1.5' }}>
            To ship apps and agents, for coding agents, automated by agents.
          </p>
        </div>

        {/* Primary Buttons (Matching vercel_website_content.md links) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '56px', flexWrap: 'wrap' }}>
          <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="btn-primary-solid">
            <span>Deploy now →</span>
          </a>
          <a href="https://vercel.com/contact/sales" target="_blank" rel="noreferrer" className="btn-secondary">
            <span>Talk to sales →</span>
          </a>
        </div>

        {/* 3 Core Pillars Section */}
        {isV1 ? (
          /* Pure MD + JSON Spec Mode: Clean 3 Pillars Grid representing the markdown spec table */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              maxWidth: '1100px',
              margin: '0 auto'
            }}
          >
            {PILLARS.map((p) => (
              <div
                key={p.id}
                className="card-glass"
                style={{
                  padding: '28px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div className="pill-badge" style={{ fontSize: '11px', padding: '2px 8px' }}>
                    {p.focus}
                  </div>
                </div>
                <h3 style={{ fontSize: '22px', color: '#ffffff', marginBottom: '12px', fontFamily: 'Fraunces, serif' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* v2 / v3 Interactive Code Dashboard Mode */
          <div
            className="card-glass"
            style={{
              maxWidth: '1060px',
              margin: '0 auto',
              padding: '32px',
              borderColor: 'rgba(96, 255, 112, 0.3)',
              boxShadow: '0 25px 80px -20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(96, 255, 112, 0.12)'
            }}
          >
            {/* Pillar Selector Buttons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '12px',
                marginBottom: '28px'
              }}
            >
              {PILLARS.map((p) => {
                const isSelected = activePillar.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setActivePillar(p)}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(96, 255, 112, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1px solid #60ff70' : '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 600, color: isSelected ? '#60ff70' : '#ffffff', marginBottom: '4px' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      {p.focus}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Pillar Snippet Window */}
            <div className="code-window">
              <div className="code-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={14} color="#60ff70" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{activePillar.title} — Spec & Protocol</span>
                </div>
                <button
                  onClick={copySnippet}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: copied ? '#60ff70' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copied ? <Check size={14} /> : <Code2 size={14} />}
                  <span>{copied ? 'Copied' : 'Copy Spec'}</span>
                </button>
              </div>
              <pre style={{ padding: '20px', margin: 0, overflowX: 'auto', color: '#60ff70', lineHeight: '1.6' }}>
                <code>{activePillar.codeSnippet}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
