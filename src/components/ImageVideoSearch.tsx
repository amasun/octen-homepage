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
    description: 'When words fall short, find the exact visual you need. Search with text or another image to discover references, design inspiration, and ready-to-use layouts.',
    nodeId: '13631:182378',
    headerNodeId: '13631:182584',
    cardNodeId: '13631:182389',
    items: [
      {
        title: 'Find What You Mean',
        desc: 'Describe a look or upload an image to find matching real-world examples.',
      },
      {
        title: 'From Idea to Reality',
        desc: 'Turn visual inspiration directly into design summaries and workable layouts.',
      },
      {
        title: 'Stay Focused',
        desc: 'Search only the sites and creative spaces you care about most.',
      },
    ],
  },
  {
    id: 'video-search',
    title: 'Video Search',
    badge: 'Early Access',
    description: 'When showing beats telling. Find the exact clip, tutorial, or real-world moment across the web—ready to play, learn from, or inspire new creations.',
    nodeId: '13631:182427',
    headerNodeId: '13631:182741',
    cardNodeId: '13631:182438',
    items: [
      {
        title: 'Answers You Can Watch',
        desc: 'Step-by-step guides, live demos, and talks ready to stream right where you are.',
      },
      {
        title: 'Real-World Inspiration',
        desc: 'Discover authentic footage and real motion to ground your creative ideas.',
      },
      {
        title: 'Moments That Just Happened',
        desc: 'Catch up on recent events and key highlights fresh from this week.',
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
                <div className="octen-modality-title-row">
                  <h2 className="octen-modality-title">{col.title}</h2>
                  <span className="octen-early-access-badge">{col.badge}</span>
                </div>

                <p className="octen-modality-desc">{col.description}</p>

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
              </div>

              {/* Bottom Feature Card */}
              <div className="octen-modality-card" data-node-id={col.cardNodeId}>
                {col.items.map((item, idx) => (
                  <div key={idx} className="octen-feature-item">
                    <div className="octen-feature-icon-box">
                      <span>✦</span>
                    </div>
                    <div className="octen-feature-content">
                      <h4 className="octen-feature-title">{item.title}</h4>
                      <p className="octen-feature-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageVideoSearch;
