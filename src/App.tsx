import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ArchitectureComparison } from './components/ArchitectureComparison';
import { MultimodalShowcase } from './components/MultimodalShowcase';
import { RetrievalStack } from './components/RetrievalStack';
import { BuiltOnOcten } from './components/BuiltOnOcten';
import { BenchmarkSection } from './components/BenchmarkSection';
import { QuickstartSection } from './components/QuickstartSection';
import { Footer } from './components/Footer';

// Website 2 Components (Vercel Agentic Infrastructure with Octen Design Spec)
import { VercelHero } from './components/vercel/VercelHero';
import { VercelCaseStudies } from './components/vercel/VercelCaseStudies';
import { VercelRecentlyShipped } from './components/vercel/VercelRecentlyShipped';
import { VercelEcosystem } from './components/vercel/VercelEcosystem';
import { VercelFooter } from './components/vercel/VercelFooter';

export const App: React.FC = () => {
  const [activeSite, setActiveSite] = useState<'octen' | 'vercel'>(() => {
    const params = new URLSearchParams(window.location.search);
    const siteParam = params.get('site');
    if (siteParam === 'octen') return 'octen';
    if (siteParam === 'vercel') return 'vercel';
    return 'octen';
  });

  const [version, setVersion] = useState<'v1' | 'v2' | 'v3'>(() => {
    const params = new URLSearchParams(window.location.search);
    const vParam = params.get('v');
    if (vParam === 'v1') return 'v1';
    if (vParam === 'v2') return 'v2';
    if (vParam === 'v3') return 'v3';
    return 'v2';
  });

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const siteParam = params.get('site');
      const vParam = params.get('v');
      if (siteParam === 'octen' || siteParam === 'vercel') {
        setActiveSite(siteParam);
      }
      if (vParam === 'v1' || vParam === 'v2' || vParam === 'v3') {
        setVersion(vParam);
      }
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'SET_VERSION') {
        const v = e.data.version;
        if (v === 'v1' || v === 'v2' || v === 'v3') {
          setVersion(v);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleToggleSite = (site: 'octen' | 'vercel') => {
    setActiveSite(site);
    const url = new URL(window.location.href);
    url.searchParams.set('site', site);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div 
      className={`app-root ${
        version === 'v1' 
          ? 'mode-v1-standard' 
          : version === 'v3' 
          ? 'mode-v3-pro-max' 
          : 'mode-v2-vision-corrected'
      }`} 
      style={{ minHeight: '100vh', backgroundColor: '#050806', color: '#fff', position: 'relative' }}
    >
      {/* Background Animated Overlay (Only active in v2 vision corrected mode) */}
      {version === 'v2' && <div className="grid-overlay" />}

      {/* Navigation Header with Website Switcher */}
      <Navbar activeSite={activeSite} onToggleSite={handleToggleSite} />

      {/* Main Content Area */}
      <main>
        {activeSite === 'octen' ? (
          /* WEBSITE 1: OCTEN SEARCH PLATFORM */
          <>
            <Hero version={version} />
            <ArchitectureComparison />
            <MultimodalShowcase version={version} />
            <RetrievalStack version={version} />
            <BuiltOnOcten version={version} />
            <BenchmarkSection version={version} />
            <QuickstartSection version={version} />
            <Footer version={version} />
          </>
        ) : (
          /* WEBSITE 2: VERCEL AGENTIC INFRASTRUCTURE (OCTEN DESIGN SPEC) */
          <>
            <VercelHero version={version} />
            <VercelCaseStudies />
            <VercelRecentlyShipped version={version} />
            <VercelEcosystem version={version} />
            <QuickstartSection version={version} />
            <VercelFooter />
          </>
        )}
      </main>
    </div>
  );
};

export default App;
