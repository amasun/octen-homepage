import React from 'react';

interface FeatureItem {
  title: string;
  desc: string;
}

interface ModalityCardData {
  id: string;
  title: string;
  badge: string;
  description: string;
  nodeId: string;
  headerNodeId: string;
  cardNodeId: string;
  items: FeatureItem[];
}

const modalitiesData: ModalityCardData[] = [
  {
    id: 'image-search',
    title: 'Image Search',
    badge: 'Early Access',
    description: 'Search visuals by text or image. Find the right reference, faster.',
    nodeId: '13631:182378',
    headerNodeId: '13631:182584',
    cardNodeId: '13631:182389',
    items: [
      {
        title: 'Text & image queries',
        desc: 'Search with a prompt or reference image.',
      },
      {
        title: 'Visual matches',
        desc: 'Find similar images across the web.',
      },
      {
        title: 'Focused results',
        desc: 'Search the sources that matter.',
      },
    ],
  },
  {
    id: 'video-search',
    title: 'Video Search',
    badge: 'Early Access',
    description: 'Find the right clip, tutorial, or moment—instantly.',
    nodeId: '13631:182427',
    headerNodeId: '13631:182741',
    cardNodeId: '13631:182438',
    items: [
      {
        title: 'Search by intent',
        desc: 'Describe the clip or moment you need.',
      },
      {
        title: 'Moment-level matches',
        desc: 'Find the exact scene, frame, or timestamp.',
      },
      {
        title: 'Fresh video results',
        desc: 'Retrieve relevant clips from the live web.',
      },
    ],
  },
];

export const ImageVideoSearch: React.FC = () => {
  return (
    <section id="modalities-search" className="octen-modalities-section" data-node-id="13631:182359">
      {/* Anchor Targets for Navigation Compatibility */}
      <div id="image-search" style={{ position: 'absolute', top: '-80px', left: 0 }} />
      <div id="video-search" style={{ position: 'absolute', top: '-80px', left: 0 }} />

      <div className="octen-modalities-container">
        <div className="octen-modalities-grid" data-node-id="13631:182376">
          {modalitiesData.map((col) => (
            <div key={col.id} className="octen-modality-col" data-node-id={col.nodeId}>
              {/* Header Block */}
              <div className="octen-modality-header" data-node-id={col.headerNodeId}>
                <span className="octen-modality-tag"><span className="octen-modality-tag-text"><span className="octen-search-fast-prefix">Search</span><span className="octen-search-fast-divider">/</span><span className="octen-search-premier-keyword">PREMIER</span></span></span>
                <div className="octen-modality-title-row">
                  <h2 className="octen-modality-title">{col.title}</h2>
                  <span className="octen-early-access-badge">{col.badge}</span>
                </div>

                <p className="octen-modality-desc">{col.description}</p>


              </div>

              {/* Bottom Feature Card */}
              <ul className="octen-modality-card" data-node-id={col.cardNodeId}>
                {col.items.map((item, idx) => (
                  <li key={idx} className="octen-feature-item">
                    <div className="octen-feature-icon-box">
                      <span>✦</span>
                    </div>
                    <div className="octen-feature-content">
                      <h4 className="octen-feature-title">{item.title}</h4>
                      <p className="octen-feature-desc">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

                <a
                  href="https://octen.ai/platform/overview"
                  target="_blank"
                  rel="noreferrer"
                  className="octen-modality-request-btn"
                >
                  <span>Request Access</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="octen-modality-btn-arrow"
                  >
                    <path d="M3 13L13 3M13 13V3H3" />
                  </svg>
                </a>

              <div className="octen-modality-visual-placeholder" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageVideoSearch;
