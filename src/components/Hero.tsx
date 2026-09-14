import React, { useState } from 'react';
import { Search, Zap, Clock, Database, ArrowRight, ExternalLink, Cpu, CheckCircle2, Terminal } from 'lucide-react';

interface PresetQuery {
  id: string;
  title: string;
  badge: string;
  latency: string;
  thinking: string;
  queriesCount: number;
  resultsCount: number;
  subQueries: string[];
  content: string;
}

const PRESETS: PresetQuery[] = [
  {
    id: 'ai-agents',
    title: 'What are AI agents actually being used for in production?',
    badge: 'Broad Search',
    latency: '74ms',
    thinking: '3.9s',
    queriesCount: 14,
    resultsCount: 99,
    subQueries: [
      'Enterprise AI agent production deployment cases 2026',
      'Belitsoft enterprise AI agent forecast 2026',
      'Federal AI use cases 2025 report',
      'Autonomous customer ticket resolution resolution rates',
      'AI agent deployment surfaces in tech & healthcare'
    ],
    content: 'AI agents have moved firmly into production across major enterprise industries in 2026. Forecasts show 40% of enterprise software will embed autonomous task-specific agents by year-end, with over 3,600 production use cases active.'
  },
  {
    id: 'investing-2026',
    title: 'Safest ways to invest in 2026',
    badge: 'Deep Research',
    latency: '130ms',
    thinking: '1m 43s',
    queriesCount: 172,
    resultsCount: 860,
    subQueries: [
      '2026 macro inflation & Fed interest rate cuts yield',
      'MYGA 6.30% annuities contractual capital preservation',
      'Series I savings bond rates 4.26% 2026',
      'OBBBA tax law SALT deduction cap tax haven investment strategy'
    ],
    content: 'In the 2026 macro slowdown, tax-optimized yield-locking strategies outpace 3.3% inflation. 6.30% MYGAs and 4.26% Series I Bonds serve as fortresses for capital preservation.'
  },
  {
    id: 'tonkotsu-ramen',
    title: 'How to make Tonkotsu ramen at home?',
    badge: 'Multimodal Chat',
    latency: '82ms',
    thinking: '2.1s',
    queriesCount: 18,
    resultsCount: 124,
    subQueries: [
      'Pork femur & trotter 12-hour high boil emulsion',
      'Mayu black garlic oil aromatic oil recipe',
      'Ajitsuke tamago 6-minute soft boiled egg marinade'
    ],
    content: 'Emulsify pork trotters and femur bones for 12 hours under high boil with garlic and scallions until rich white broth forms. Serve with hand-cut wheat noodles and soft-boiled ajitsuke tamago.'
  }
];

interface HeroProps {
  version?: 'v1' | 'v2' | 'v3';
}

export const Hero: React.FC<HeroProps> = ({ version: propVersion }) => {
  const [activePreset, setActivePreset] = useState<PresetQuery>(PRESETS[0]);
  const [queryInput, setQueryInput] = useState(PRESETS[0].title);
  const [isSearching, setIsSearching] = useState(false);
  const currentVersion = propVersion || (typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('v') as any) : 'v2') || 'v2';
  const isV1 = currentVersion === 'v1';

  const handleSelectPreset = (preset: PresetQuery) => {
    setQueryInput(preset.title);
    setActivePreset(preset);
  };

  const handleRunSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  return (
    <section style={{ paddingTop: '150px', paddingBottom: '90px', position: 'relative' }}>
      {/* Top Emerald Glow Lighting (Only in v2 Screenshot Visual Correction Mode) */}
      {!isV1 && <div className="hero-top-glow" />}

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main Headline */}
        <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 28px' }}>
          <h1 style={{ color: '#ffffff', marginBottom: '20px' }}>
            Search <br />
            infrastructure for AI
          </h1>

          {/* Green Pills Line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <span className="pill-badge" style={{ fontSize: '13px' }}>
              <span className="glow-point" style={{ width: '6px', height: '6px' }} /> Real-time indexing
            </span>
            <span className="pill-badge" style={{ fontSize: '13px' }}>
              <span className="glow-point" style={{ width: '6px', height: '6px' }} /> Low latency
            </span>
            <span className="pill-badge" style={{ fontSize: '13px' }}>
              <span className="glow-point" style={{ width: '6px', height: '6px' }} /> High reliability
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#quickstart" className="btn-primary-solid">
              <span>Start Building</span>
              <ArrowRight size={16} />
            </a>
            <a href="https://docs.octen.ai" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <span>View Docs</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {isV1 ? (
          /* RESULT 1 (PURE MD + JSON SPEC): Standard Clean API Code Card (No screenshot terminal console) */
          <div
            className="card-glass"
            style={{
              maxWidth: '800px',
              margin: '48px auto 0',
              padding: '24px',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={16} color="#60ff70" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  octen-search-api.sh
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>cURL / REST API</span>
            </div>
            <pre style={{ backgroundColor: '#070b08', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#60ff70', overflowX: 'auto', lineHeight: '1.6' }}>
              {"curl -X POST https://api.octen.ai/v1/search -H \"Authorization: Bearer $OCTEN_API_KEY\" -d '{\"query\": \"Enterprise AI agent search\"}'"}
            </pre>
          </div>
        ) : (
          /* RESULT 2 (MD + JSON SPEC + SCREENSHOT VISION CORRECTION): Live Search Terminal Console Mockup */
        <div
          className="card-glass"
          style={{
            maxWidth: '1060px',
            margin: '48px auto 0',
            padding: '24px',
            borderColor: 'rgba(96, 255, 112, 0.3)',
            boxShadow: '0 25px 80px -20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(96, 255, 112, 0.12)'
          }}
        >
          {/* Preset Buttons Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={16} color="#60ff70" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Octen Real-Time Execution Engine
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  style={{
                    backgroundColor: activePreset.id === p.id ? 'rgba(96, 255, 112, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: activePreset.id === p.id ? '1px solid #60ff70' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: activePreset.id === p.id ? '#60ff70' : 'var(--text-muted)',
                    borderRadius: '9999px',
                    padding: '5px 14px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {p.badge}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar Input */}
          <form onSubmit={handleRunSearch} style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#070b08',
                border: '1px solid rgba(96, 255, 112, 0.35)',
                borderRadius: '12px',
                padding: '8px 12px 8px 16px',
                gap: '12px'
              }}
            >
              <Search size={18} color="#60ff70" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="What would you like to search today?"
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '15.5px',
                  fontFamily: 'var(--font-body)'
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                {isSearching ? 'Executing...' : 'Run Query'}
              </button>
            </div>
          </form>

          {/* Dual Pane Terminal: Sub-Queries (Left) vs Grounded Response (Right) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '16px'
            }}
          >
            {/* Left Pane: Sub-query Decomposition */}
            <div
              style={{
                backgroundColor: '#080c09',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Sub-Query Decomposition
                </span>
                <span className="pill-badge" style={{ fontSize: '11px', padding: '1px 6px' }}>
                  {activePreset.queriesCount} Fan-out
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activePreset.subQueries.map((sub, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(96, 255, 112, 0.04)',
                      border: '1px solid rgba(96, 255, 112, 0.15)',
                      borderRadius: '6px',
                      fontSize: '12.5px',
                      fontFamily: 'var(--font-mono)',
                      color: '#cbd5e1'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#60ff70' }} />
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</span>
                    <span style={{ fontSize: '10px', color: '#60ff70' }}>OK</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Pane: Structured Stream Response */}
            <div
              style={{
                backgroundColor: '#080c09',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#60ff70" />
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#60ff70' }}>Grounded Output</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    <span>Latency: <strong style={{ color: '#60ff70' }}>{activePreset.latency}</strong></span>
                    <span>Results: <strong style={{ color: '#fff' }}>{activePreset.resultsCount}</strong></span>
                  </div>
                </div>

                <p style={{ fontSize: '13.5px', color: '#e2e8f0', lineHeight: '1.6' }}>
                  {activePreset.content}
                </p>
              </div>

              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: 'var(--text-dim)'
                }}
              >
                <span>Format: <strong>Clean Markdown / JSON</strong></span>
                <span style={{ color: '#60ff70' }}>Ready for LLM Context</span>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
};
