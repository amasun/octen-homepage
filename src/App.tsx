import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ArchitectureComparison } from './components/ArchitectureComparison';
import { MultimodalShowcase } from './components/MultimodalShowcase';
import { ImageVideoSearch } from './components/ImageVideoSearch';
import { VerticalSearch } from './components/VerticalSearch';
import { RetrievalStack } from './components/RetrievalStack';
import { BuiltOnOcten } from './components/BuiltOnOcten';
import { BenchmarkSection } from './components/BenchmarkSection';
import { QuickstartSection } from './components/QuickstartSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [version] = useState<'v1' | 'v2' | 'v3'>('v2');

  return (
    <div 
      className="app-root mode-v2-vision-corrected" 
      style={{ minHeight: '100vh', backgroundColor: '#050806', color: '#fff', position: 'relative' }}
    >
      <div className="grid-overlay" />
      <Navbar />
      <main>
        <Hero version={version} />
        <ArchitectureComparison />
        {/* [RESERVED / BACKUP: Image & Video Search moved to standalone backup page (/backup-modules.html)] */}
        {/* <ImageVideoSearch /> */}
        <MultimodalShowcase version={version} />
        <VerticalSearch />
        <RetrievalStack version={version} />
        <BuiltOnOcten version={version} />
        <BenchmarkSection version={version} />
        <QuickstartSection version={version} />
        <Footer version={version} />
      </main>
    </div>
  );
};

export default App;
