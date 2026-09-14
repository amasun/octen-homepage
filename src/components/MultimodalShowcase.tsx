import React from 'react';
import { Eye, Image, Video, Sparkles, FileText, ArrowRight, Play, Check } from 'lucide-react';

interface MultimodalShowcaseProps {
  version?: 'v1' | 'v2' | 'v3';
}

export const MultimodalShowcase: React.FC<MultimodalShowcaseProps> = ({ version: propVersion }) => {
  const currentVersion = propVersion || (typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('v') as any) : 'v2') || 'v2';
  const isV1 = currentVersion === 'v1';

  return (
    <section id="multimodal" style={{ padding: '90px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background Section Green Aura */}
      <div className="section-green-aura" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
          <div className="pill-badge" style={{ marginBottom: '16px' }}>
            <Eye size={14} color="#60ff70" />
            <span>Multimodal Intelligence</span>
          </div>
          <h2 style={{ color: '#fff', marginBottom: '16px' }}>
            Search Beyond Text
          </h2>
          <p style={{ fontSize: '17.5px', color: 'var(--text-muted)' }}>
            Beyond text queries: Octen's multimodal search understands images and videos alongside text, all retrieved from the live web.
          </p>
        </div>

        {/* Feature Pills Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '48px', flexWrap: 'wrap' }}>
          <span className="pill-badge" style={{ padding: '8px 18px', fontSize: '14px', backgroundColor: 'rgba(96, 255, 112, 0.12)', borderColor: '#60ff70' }}>
            <Image size={15} /> Image Search
          </span>
          <span className="pill-badge" style={{ padding: '8px 18px', fontSize: '14px', backgroundColor: 'rgba(96, 255, 112, 0.12)', borderColor: '#60ff70' }}>
            <Video size={15} /> Video Search
          </span>
          <a href="https://octen.ai/platform/overview" target="_blank" rel="noopener noreferrer" className="btn-primary-solid" style={{ padding: '8px 20px', fontSize: '13.5px' }}>
            <span>Get Access</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {isV1 ? (
          /* RESULT 1 (PURE MD + JSON SPEC): Standard Clean 4-Card Grid Layout */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div className="card-glass" style={{ padding: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(96, 255, 112, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#60ff70' }}>
                <Video size={20} />
              </div>
              <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>Live Web Video Retrieval</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Extract relevant video segments and metadata across public streaming platforms.</p>
            </div>

            <div className="card-glass" style={{ padding: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(96, 255, 112, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#60ff70' }}>
                <Image size={20} />
              </div>
              <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>High-Res Image Search</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Index and retrieve high-resolution visual assets using vision-language embeddings.</p>
            </div>

            <div className="card-glass" style={{ padding: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(96, 255, 112, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#60ff70' }}>
                <FileText size={20} />
              </div>
              <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>URL Clean Extraction</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Extract structured Markdown from any web page, stripping boilerplate and ads.</p>
            </div>

            <div className="card-glass" style={{ padding: '24px', borderColor: 'rgba(96, 255, 112, 0.3)', backgroundColor: 'rgba(96, 255, 112, 0.04)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(96, 255, 112, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#60ff70' }}>
                <Sparkles size={20} />
              </div>
              <h3 style={{ fontSize: '18px', color: '#60ff70', marginBottom: '8px', fontWeight: 600 }}>MMEB-V2 #1 Rank</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>State-of-the-art vision-language embedding space benchmarked across retrieval tasks.</p>
            </div>
          </div>
        ) : (
          /* RESULT 2 (MD + JSON SPEC + SCREENSHOT VISION CORRECTION): Floating Radial Node Topology Graph */
          <div
            style={{
              maxWidth: '940px',
              margin: '0 auto',
              position: 'relative',
              minHeight: '380px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Central Octen Node */}
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                backgroundColor: '#0a140c',
                border: '2px solid #60ff70',
                boxShadow: '0 0 40px rgba(96, 255, 112, 0.5), inset 0 0 20px rgba(96, 255, 112, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#60ff70',
                  boxShadow: '0 0 20px #60ff70'
                }}
              />
            </div>

            {/* Connected Floating Nodes */}
            {/* Floating Node 1: Video Player (Top Left) */}
            <div
              className="card-glass"
              style={{
                position: 'absolute',
                top: '20px',
                left: '5%',
                width: '240px',
                padding: '12px',
                borderColor: 'rgba(255,255,255,0.15)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '110px', backgroundColor: '#18241b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #60ff70' }}>
                  <Play size={16} color="#60ff70" style={{ marginLeft: '2px' }} />
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#fff', marginTop: '8px', fontWeight: 500 }}>
                Live Web Video Retrieval
              </div>
            </div>

            {/* Floating Node 2: Image Visual (Top Right) */}
            <div
              className="card-glass"
              style={{
                position: 'absolute',
                top: '20px',
                right: '5%',
                width: '220px',
                padding: '12px',
                borderColor: 'rgba(255,255,255,0.15)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ borderRadius: '8px', overflow: 'hidden', height: '110px', backgroundColor: '#131f16', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60ff70' }}>
                <Image size={32} />
              </div>
              <div style={{ fontSize: '12px', color: '#fff', marginTop: '8px', fontWeight: 500 }}>
                High-Res Image Search
              </div>
            </div>

            {/* Floating Node 3: Extract Markdown (Bottom Left) */}
            <div
              className="card-glass"
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '12%',
                width: '220px',
                padding: '12px',
                borderColor: 'rgba(255,255,255,0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <FileText size={14} color="#60ff70" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>URL Extract</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Clean Markdown parsing
              </p>
            </div>

            {/* Floating Node 4: MMEB Metric Badge (Bottom Right) */}
            <div
              className="card-glass"
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '12%',
                width: '210px',
                padding: '12px',
                borderColor: 'rgba(96, 255, 112, 0.3)',
                backgroundColor: 'rgba(96, 255, 112, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={14} color="#60ff70" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#60ff70' }}>MMEB-V2 #1 Rank</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Unified Vision-Language Space
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
