import { useEffect, useState } from 'react';
import { LatencyCard } from '@/components/LatencyCard/LatencyCard';
import { SearchIndexCard } from '@/components/SearchIndexCard/SearchIndexCard';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import { Tabs } from '@/components/Tabs/Tabs';
import { TimePerTaskCard } from '@/components/TimePerTaskCard/TimePerTaskCard';
import { TABS, type TabId } from '@/data/tabs';
import styles from './BuiltToPerform.module.css';

const ID = 'perform';

const readHash = (): TabId => {
  const h = window.location.hash.replace('#', '') as TabId;
  return TABS.some((t) => t.id === h) ? h : 'speed';
};

function Panel({ tab }: { tab: TabId }) {
  switch (tab) {
    case 'speed':
      return (
        <div className={styles.grid2}>
          <LatencyCard />
          <TimePerTaskCard />
        </div>
      );
    case 'search-index':
      return <SearchIndexCard />;
    default:
      return <div className={styles.placeholder}>Charts for this view are coming soon.</div>;
  }
}

export function BuiltToPerform() {
  const [tab, setTab] = useState<TabId>(readHash);

  useEffect(() => {
    const onHash = () => setTab(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const select = (id: TabId) => {
    setTab(id);
    history.replaceState(null, '', `#${id}`);
  };

  const current = TABS.find((t) => t.id === tab)!;

  return (
    <section className={styles.section} aria-labelledby={`${ID}-title`}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.headerGroup}>
            <div id={`${ID}-title`}>
              <SectionHeader tag="Performance" title="Built to Perform" />
            </div>
            <Tabs items={TABS} value={tab} onChange={select} idPrefix={ID} label="Performance views" />
          </div>
          {current.headline && (
            <div className={styles.lede}>
              <p className={styles.headline}>{current.headline}</p>
              {current.description && <p className={styles.description}>{current.description}</p>}
            </div>
          )}
        </div>

        <div
          key={tab}
          id={`${ID}-panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`${ID}-tab-${tab}`}
          className={styles.panel}
        >
          <Panel tab={tab} />
        </div>
      </div>
    </section>
  );
}
