import NumberFlow from '@number-flow/react';
import { ArrowUpRight, Coins, Gauge } from 'lucide-react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const NUM_FORMAT = { maximumFractionDigits: 2 };

type Cycle = 'Monthly' | 'Quarterly' | 'Annual';

interface CyclePrice {
  price: number;
  originalPrice?: number;
  save?: number;
  total: number;
  billed: string;
  unit: string;
}

function InfinityIcon() {
  return (
    <div className="sp-feature-icon">
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M10 10c-1-1.6-2.2-3-3.8-3a3 3 0 100 6c1.6 0 2.8-1.4 3.8-3zm0 0c1 1.6 2.2 3 3.8 3a3 3 0 100-6c-1.6 0-2.8 1.4-3.8 3z"
          stroke="#100F09"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="sp-feature-icon">
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M6.25 10.75L8.5 13L13.75 7"
          stroke="#100F09"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function CycleToggle({
  options,
  value,
  onChange,
}: {
  options: Cycle[];
  value: Cycle;
  onChange: (c: Cycle) => void;
}) {
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const el = btnRefs.current[value];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    Object.values(btnRefs.current).forEach((b) => b && ro?.observe(b));
    document.fonts?.ready.then(measure);
    return () => ro?.disconnect();
  }, [value, options]);

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div role="tablist" className="sp-toggle">
      {pill && (
        <span
          aria-hidden="true"
          className={`sp-toggle-pill ${animate ? 'sp-toggle-pill--animate' : ''}`}
          style={{ left: pill.left, width: pill.width }}
        />
      )}
      {options.map((opt) => (
        <button
          key={opt}
          ref={(el) => {
            btnRefs.current[opt] = el;
          }}
          type="button"
          role="tab"
          aria-selected={value === opt}
          onClick={() => onChange(opt)}
          className="sp-toggle-btn"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Collapse({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div aria-hidden={!show} className={`sp-collapse ${show ? 'sp-collapse--open' : ''}`}>
      <div className="sp-collapse-inner">{children}</div>
    </div>
  );
}

function AnimatedWidth({ children }: { children: React.ReactNode }) {
  const innerRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => setWidth(el.offsetWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="sp-anim-width" style={{ width }}>
      <span ref={innerRef} className="sp-anim-width-inner">
        {children}
      </span>
    </div>
  );
}

function SearchPlanCard({
  title,
  cycles,
  defaultCycle,
  prices,
  features,
  note,
  isPopular = false,
}: {
  title: string;
  cycles: Cycle[];
  defaultCycle: Cycle;
  prices: Partial<Record<Cycle, CyclePrice>>;
  features: { text: React.ReactNode; icon: 'infinity' | 'check' }[];
  note: string;
  isPopular?: boolean;
}) {
  const [cycle, setCycle] = useState<Cycle>(defaultCycle);
  const current = prices[cycle]!;

  const lastOriginal = useRef(current.originalPrice);
  const lastSave = useRef(current.save);
  if (current.originalPrice !== undefined) lastOriginal.current = current.originalPrice;
  if (current.save !== undefined) lastSave.current = current.save;

  return (
    <div className={`sp-card-shell ${isPopular ? 'sp-card-shell--popular' : 'sp-card-shell--regular'}`}>
      {isPopular && (
        <div className="sp-popular-bar">
          <p className="sp-popular-label">Recommended Plan</p>
        </div>
      )}

      <div className="sp-card">
        <div className="sp-header">
          <div className="sp-title-row">
            <h3 className="sp-title">{title}</h3>
            <CycleToggle options={cycles} value={cycle} onChange={setCycle} />
          </div>

          <div className="sp-price-block">
            <div className="sp-price-row">
              <div className="sp-price-main">
                <span className="sp-currency">$</span>
                <NumberFlow value={current.price} format={NUM_FORMAT} className="sp-price-num" />
              </div>
              <Collapse show={current.originalPrice !== undefined}>
                <span className="sp-original-price">
                  $<NumberFlow value={lastOriginal.current ?? 0} format={NUM_FORMAT} className="sp-nf-trim" />
                </span>
              </Collapse>
              <span className="sp-per-month">/ month</span>
            </div>

            <div className="sp-billed-row">
              <AnimatedWidth>
                <span className="sp-billed-text">
                  Billed {current.billed},{' '}
                  <strong>
                    $<NumberFlow value={current.total} format={NUM_FORMAT} className="sp-nf-trim" />
                  </strong>
                  /{current.unit}
                </span>
              </AnimatedWidth>
              <Collapse show={current.save !== undefined}>
                <span className="sp-save-wrap">
                  <span className="sp-save-badge">
                    Save&nbsp;$<NumberFlow value={lastSave.current ?? 0} format={NUM_FORMAT} className="sp-nf-trim" />
                  </span>
                </span>
              </Collapse>
            </div>
          </div>
        </div>

        <div className="sp-body">
          <div className="sp-features-wrap">
            <div className="sp-features-inner">
              <ul className="sp-features-list">
                {features.map((f, i) => (
                  <li key={i} className="sp-feature-item">
                    {f.icon === 'infinity' ? <InfinityIcon /> : <CheckIcon />}
                    <span className="sp-feature-text">{f.text}</span>
                  </li>
                ))}
              </ul>
              <p className="sp-note">{note}</p>
            </div>
          </div>

          <div className="sp-cta-wrap">
            <a
              href="https://octen.ai/platform/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="sp-cta"
            >
              Subscribe
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PricingSearchPlans() {
  return (
    <div className="sp-wrap">
      <div className="sp-grid">
        <SearchPlanCard
          isPopular
          title="Standard"
          cycles={['Monthly', 'Quarterly', 'Annual']}
          defaultCycle="Annual"
          prices={{
            Monthly: { price: 20, total: 20, billed: 'monthly', unit: 'month' },
            Quarterly: { price: 19, originalPrice: 20, save: 3, total: 57, billed: 'quarterly', unit: 'quarter' },
            Annual: { price: 15, originalPrice: 20, save: 60, total: 180, billed: 'annually', unit: 'year' },
          }}
          features={[
            {
              icon: 'infinity',
              text: (
                <>
                  <strong>Unlimited</strong> Web Search
                </>
              ),
            },
            { icon: 'check', text: 'No overage fees' },
            { icon: 'check', text: '1,000 Image Search / month' },
            { icon: 'check', text: 'Shared capacity, may queue at busy times' },
          ]}
          note="For prototypes, side projects and personal agents"
        />
        <SearchPlanCard
          title="Plus"
          cycles={['Monthly', 'Annual']}
          defaultCycle="Annual"
          prices={{
            Monthly: { price: 100, total: 100, billed: 'monthly', unit: 'month' },
            Annual: { price: 83.33, originalPrice: 100, save: 200, total: 1000, billed: 'annually', unit: 'year' },
          }}
          features={[
            {
              icon: 'infinity',
              text: (
                <>
                  <strong>Unlimited</strong> Web Search
                </>
              ),
            },
            { icon: 'check', text: 'No overage fees' },
            { icon: 'check', text: '5,000 Image Search / month' },
            { icon: 'check', text: 'Priority over Standard at busy times' },
          ]}
          note="For team workspaces, daily agent workflows and internal tools"
        />
      </div>

      <div className="sp-alt-section">
        <p className="sp-alt-caption">
          To experience the full Octen search capabilities, you may also want to know
        </p>
        <div className="sp-alt-grid">
        <a
          href="https://pring-octen-ai.vercel.app/#pay-as-you-go"
          target="_blank"
          rel="noopener noreferrer"
          className="sp-alt-card"
        >
          <div className="sp-alt-icon">
            <Coins size={20} strokeWidth={1.75} aria-hidden="true" />
          </div>
          <div className="sp-alt-content">
            <div className="sp-alt-head">
              <h4 className="sp-alt-title">Pay-As-You-Go</h4>
              <ArrowUpRight className="sp-alt-arrow" size={16} strokeWidth={1.75} aria-hidden="true" />
            </div>
            <p className="sp-alt-desc">
              Charges are deducted from your balance in real time, based on what you actually call.
            </p>
          </div>
        </a>

        <a
          href="https://pring-octen-ai.vercel.app/#qps-plans"
          target="_blank"
          rel="noopener noreferrer"
          className="sp-alt-card"
        >
          <div className="sp-alt-icon">
            <Gauge size={20} strokeWidth={1.75} aria-hidden="true" />
          </div>
          <div className="sp-alt-content">
            <div className="sp-alt-head">
              <h4 className="sp-alt-title">QPS Plan</h4>
              <ArrowUpRight className="sp-alt-arrow" size={16} strokeWidth={1.75} aria-hidden="true" />
            </div>
            <p className="sp-alt-desc">
              Pay as you go for usage. Add QPS when you need reserved search throughput.
            </p>
          </div>
        </a>
        </div>
      </div>
    </div>
  );
}
