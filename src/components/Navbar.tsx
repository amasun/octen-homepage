import React, { useState, useEffect } from 'react';
import { Terminal, ArrowUpRight, Check, Layers, Cpu } from 'lucide-react';

interface NavbarProps {
  activeSite: 'octen' | 'vercel';
  onToggleSite: (site: 'octen' | 'vercel') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSite, onToggleSite }) => {
  const [scrolled, setScrolled] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyApiKey = () => {
    navigator.clipboard.writeText('octen_sk_live_99283719a8f7e2');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        backgroundColor: scrolled ? 'rgba(5, 8, 6, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
        padding: '14px 0'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #18331c, #070c08)',
                border: '1px solid rgba(96, 255, 112, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(96, 255, 112, 0.25)'
              }}
            >
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#60ff70', boxShadow: '0 0 8px #60ff70' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>
              {activeSite === 'octen' ? 'Octen' : 'Vercel Agentic'}
            </span>
          </a>
        </div>

        {/* Desktop Navigation Links based on active site */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          {activeSite === 'octen' ? (
            <>
              <a href="#architecture" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }}>Architecture</a>
              <a href="#multimodal" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }}>Multimodal</a>
              <a href="#stack" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }}>Retrieval Stack</a>
              <a href="#benchmarks" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }}>Benchmarks</a>
            </>
          ) : (
            <>
              <a href="#case-studies" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }}>Scale Cases</a>
              <a href="https://vercel.com/ai-sdk" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }}>Agent Stack</a>
              <a href="https://vercel.com/fluid" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }}>Fluid Compute</a>
              <a href="https://vercel.com/pricing" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }}>Pricing</a>
            </>
          )}
        </nav>

        {/* Header Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={copyApiKey} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
            {copiedKey ? <Check size={14} color="#60ff70" /> : <Terminal size={14} />}
            <span>{copiedKey ? 'Key Copied!' : 'API Key'}</span>
          </button>
          <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="btn-primary-solid" style={{ padding: '8px 18px', fontSize: '13px' }}>
            <span>Deploy</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </header>
  );
};
