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

const spiralNodes = [
  // Ring 1 (r ≈ 123px, 6 icons)
  { dx: 102.5, dy: 68.2, icon: 'icon-squirrel.svg', alt: 'squirrel' },
  { dx: 0, dy: 114.5, icon: 'icon-tulip.svg', alt: 'flower' },
  { dx: -104.2, dy: 68.8, icon: 'icon-bag.svg', alt: 'bag' },
  { dx: -107, dy: -56, icon: 'icon-shirt.svg', alt: 'shirt' },
  { dx: 0, dy: -122.2, icon: 'icon-dog.svg', alt: 'dog' },
  { dx: 107, dy: -56, icon: 'icon-haze.svg', alt: 'sun' },

  // Ring 2 (r ≈ 186px, 6 icons)
  { dx: 131, dy: 135.6, icon: 'icon-vr.svg', alt: 'vr' },
  { dx: -65.2, dy: 167.1, icon: 'icon-car.svg', alt: 'car' },
  { dx: -178, dy: 52.3, icon: 'icon-basketball.svg', alt: 'sports' },
  { dx: -146, dy: -114.7, icon: 'icon-image.svg', alt: 'photo' },
  { dx: 96.5, dy: -156, icon: 'icon-basket.svg', alt: 'shopping' },
  { dx: 186.6, dy: -1, icon: 'icon-citrus.svg', alt: 'food' },

  // Ring 3 (r ≈ 242px, 6 icons)
  { dx: 102, dy: 213.6, icon: 'icon-compass.svg', alt: 'navigation' },
  { dx: -163.5, dy: 182.6, icon: 'icon-bird.svg', alt: 'nature' },
  { dx: -242.7, dy: -25.5, icon: 'icon-salad.svg', alt: 'healthy' },
  { dx: -124, dy: -195, icon: 'icon-butterfly.svg', alt: 'wildlife' },
  { dx: 197.1, dy: -151.2, icon: 'icon-book.svg', alt: 'education' },
  { dx: 225.6, dy: 78.2, icon: 'icon-carton.svg', alt: 'product' },

  // Ring 4 (r ≈ 302px, 6 icons)
  { dx: 27, dy: 299.5, icon: 'icon-dog.svg', alt: 'pets' },
  { dx: -252.2, dy: 174.6, icon: 'icon-book.svg', alt: 'knowledge' },
  { dx: -271.7, dy: -136, icon: 'icon-citrus.svg', alt: 'grocery' },
  { dx: -77.2, dy: -293.1, icon: 'icon-carton.svg', alt: 'package' },
  { dx: 286.8, dy: -105.2, icon: 'icon-bird.svg', alt: 'animals' },
  { dx: 255.8, dy: 170.1, icon: 'icon-butterfly.svg', alt: 'fauna' },
];

/**
 * VideoSearchCard - React sub-component matching Figma 13716:172855
 */
const VideoSearchCard: React.FC = () => {
  const [scene, setScene] = React.useState<number>(1);
  const [centerIdx, setCenterIdx] = React.useState<number>(2);
  const [extractedIdx, setExtractedIdx] = React.useState<number>(-1);
  const [noTransition, setNoTransition] = React.useState<boolean>(false);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    let timeouts: any[] = [];
    const schedule = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay);
      timeouts.push(t);
      return t;
    };

    const run = () => {
      setScene(1);

      schedule(() => {
        setScene(2);

        schedule(() => {
          setScene(3);
          setExtractedIdx(centerIdx);

          schedule(() => {
            setScene(4);

            schedule(() => {
              setNoTransition(true);
              setCenterIdx((prev) => (prev - 1 + 4) % 4);

              requestAnimationFrame(() => {
                setNoTransition(false);
                run();
              });
            }, 860);
          }, 2100);
        }, 2000);
      }, 2200);
    };

    run();

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [centerIdx]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let waveTime = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = 716 * dpr;
      canvas.height = 60 * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = 716;
      const h = 60;
      ctx.clearRect(0, 0, w, h);
      waveTime += 0.03;
      const isScanning = scene === 2;

      ctx.beginPath();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = isScanning ? 'rgba(112, 254, 126, 0.45)' : 'rgba(209, 209, 209, 0.25)';
      for (let x = 0; x <= w; x += 4) {
        const y = 32 + Math.sin(x * 0.0095 + waveTime * 1.2) * 14 + Math.sin(x * 0.021 - waveTime * 0.8) * 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = isScanning ? 'rgba(112, 254, 126, 0.35)' : 'rgba(209, 209, 209, 0.22)';
      for (let x = 0; x <= w; x += 4) {
        const y = 30 + Math.sin(x * 0.0165 - waveTime * 1.5) * 11 + Math.cos(x * 0.008 + waveTime * 0.6) * 5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [scene]);

  // Compute position class for each slide based on current centerIdx and scene
  const getSlotClass = (idx: number) => {
    const isShift = scene === 4;
    // normal relative offsets: 0: center, -1: left, +1: right, -2: incoming
    let offset = (idx - centerIdx + 4) % 4;
    if (offset === 3) offset = -1; // left
    else if (offset === 2) offset = -2; // incoming

    if (isShift) {
      // During shift to right:
      // incoming (-2) -> left (-1)
      // left (-1) -> center (0)
      // center (0) -> right (+1)
      // right (+1) -> outgoing (+2)
      if (offset === -2) return 'pos-left';
      if (offset === -1) return 'pos-center';
      if (offset === 0) return 'pos-right';
      if (offset === 1) return 'pos-outgoing';
    }

    if (offset === 0) return 'pos-center';
    if (offset === -1) return 'pos-left';
    if (offset === 1) return 'pos-right';
    return 'pos-incoming';
  };

  return (
    <div
      className="octen-modality-visual-placeholder octen-video-card"
      data-scene={scene}
      data-node-id="13716:172855"
      id="octen-video-card"
    >
      <div className="octen-video-bg" aria-hidden="true" />
      <div className="octen-video-viewport">
        <div className={`octen-video-track ${noTransition ? 'no-transition' : ''}`} id="octen-video-track">
          {[0, 1, 2, 3].map((slideNum) => {
            const isExtracted = extractedIdx === slideNum;
            const slotClass = getSlotClass(slideNum);
            return (
              <div
                key={slideNum}
                className={`octen-video-slide ${slotClass} ${isExtracted ? 'is-extracted' : ''}`}
                id={`octen-video-slide-${slideNum}`}
              >
                <div className="octen-vcard-inner octen-vcard-video">
                  <div className="octen-vcard-header">
                    <div className="octen-vcard-dot" />
                    <div className="octen-vcard-titlebar" />
                  </div>
                  <div className="octen-vcard-body">
                    <img src="/images/video/videoplayer-play.svg" alt="" className="octen-vcard-play-icon" />
                    <div className="octen-vcard-robot">
                      <img src="/images/video/octen-robot.svg" alt="Octen Core" />
                    </div>
                  </div>
                  <div className="octen-vcard-scanline" />
                  <div className="octen-vcard-timeline">
                    <div className="octen-vcard-timeline-track">
                      <div className="octen-vcard-timeline-fill" style={{ width: '25%' }} />
                      <div className="octen-vcard-timeline-thumb" style={{ left: '25%' }} />
                    </div>
                  </div>
                </div>

                <div className="octen-vcard-inner octen-vcard-extract">
                  <div className="octen-extract-header">
                    <div className="octen-extract-tag" />
                    <div className="octen-extract-title-1" />
                    <div className="octen-extract-title-2" />
                  </div>
                  <div className="octen-extract-body">
                    <div className="octen-extract-line-tag" />
                    <div className="octen-extract-line-1" />
                    <div className="octen-extract-line-2" />
                    <div className="octen-extract-line-3" />
                  </div>
                  <div className="octen-extract-grid">
                    <div className="octen-extract-chip" />
                    <div className="octen-extract-chip" />
                    <div className="octen-extract-chip" />
                    <div className="octen-extract-chip" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="octen-video-wave-container" aria-hidden="true">
        <canvas ref={canvasRef} id="octen-audio-waves" className="octen-audio-waves-canvas" />
        <img src="/images/video/wave.svg" alt="" className="octen-video-wave-static" />
      </div>

      <div className="octen-video-vignette" aria-hidden="true" />
    </div>
  );
};

export const ImageVideoSearch: React.FC = () => {
  const [pulsingSet, setPulsingSet] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    let previousSet = new Set<number>();
    const pulseNext = () => {
      const count = Math.floor(Math.random() * 3) + 1;
      const pool: number[] = [];
      for (let i = 0; i < spiralNodes.length; i++) {
        if (!previousSet.has(i)) pool.push(i);
      }
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      const selected = new Set(pool.slice(0, count));
      previousSet = selected;
      setPulsingSet(selected);

      setTimeout(() => {
        setPulsingSet(new Set());
      }, 900);
    };

    const interval = setInterval(pulseNext, 1800);
    const initialTimeout = setTimeout(pulseNext, 300);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <section id="modalities-search" className="octen-modalities-section" data-node-id="13631:182359">
      {/* Anchor Targets for Navigation Compatibility */}
      <div id="image-search" style={{ position: 'absolute', top: '-80px', left: 0 }} />
      <div id="video-search" style={{ position: 'absolute', top: '-80px', left: 0 }} />

      <div className="octen-modalities-container">
        <div className="octen-modalities-grid">
          {modalitiesData.map((col) => (
            <div key={col.id} className="octen-modality-col" data-node-id={col.nodeId}>
              <div className="octen-modality-header" data-node-id={col.headerNodeId}>
                <span className="octen-modality-tag octen-search-fast-tag octen-search-premier-tag">
                  <span className="octen-search-fast-prefix">Search</span>
                  <span className="octen-search-fast-divider">/</span>
                  <span className="octen-search-premier-keyword octen-search-fast-keyword">PREMIER</span>
                </span>
                <div className="octen-modality-title-row">
                  <h2 className="octen-modality-title">{col.title}</h2>
                  <span className="octen-early-access-badge">{col.badge}</span>
                </div>
                <p className="octen-modality-desc">{col.description}</p>
              </div>

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
                className="octen-modality-request-btn octen-request-access-btn"
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

              {col.id === 'image-search' ? (
                <div
                  className="octen-modality-visual-placeholder octen-spiral-card"
                  data-node-id="13709:170101"
                  aria-label="Octen Multimodal Image Search Spiral Coverage"
                >
                  <div className="octen-spiral-bg" aria-hidden="true" />
                  <div className="octen-spiral-viewport">
                    {/* Oscillating Radar & Concentric Rings Layer (40° - 270° Sweep) */}
                    <div className="octen-spiral-radar" aria-hidden="true">
                      <img
                        src="/images/spiral/concentric-rings.svg"
                        alt=""
                        className="octen-spiral-rings"
                      />
                      <div className="octen-spiral-radar-sweep">
                        <div className="octen-spiral-radar-cone" />
                        <div className="octen-spiral-radar-arcs" />
                      </div>
                    </div>

                    {/* Revolving Icon Nodes Wheel (36s CCW) */}
                    <div className="octen-spiral-wheel">
                      {spiralNodes.map((node, idx) => (
                        <div
                          key={idx}
                          className="octen-spiral-node"
                          style={{ '--dx': `${node.dx}px`, '--dy': `${node.dy}px` } as React.CSSProperties}
                        >
                          <div className={`octen-spiral-icon-box ${pulsingSet.has(idx) ? 'is-pulsing' : ''}`}>
                            <img
                              src={`/images/spiral/${node.icon}`}
                              alt={node.alt}
                              className={`octen-spiral-icon ${pulsingSet.has(idx) ? 'is-pulsing' : ''}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="octen-spiral-center">
                      <img
                        src="/images/spiral/octen-chip.svg"
                        alt="Octen Multimodal Core"
                        className="octen-spiral-center-logo"
                      />
                    </div>
                  </div>
                  <div className="octen-spiral-vignette" aria-hidden="true" />
                </div>
              ) : (
                <VideoSearchCard />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageVideoSearch;
