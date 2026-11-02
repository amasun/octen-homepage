import { useMemo, useState } from 'react';
import { Card } from '@/components/Card/Card';
import { ComparisonTable } from '@/components/ComparisonTable/ComparisonTable';
import { RadarChart } from '@/components/RadarChart/RadarChart';
import type { ProviderId } from '@/data/providers';
import { radarScores, SEARCH_INDEX_ROWS } from '@/data/searchIndex';
import styles from './SearchIndexCard.module.css';

/** "Search API performance profile": radar + comparison table, linked on hover. */
export function SearchIndexCard() {
  const [hovered, setHovered] = useState<ProviderId | null>(null);
  const scores = useMemo(() => radarScores(SEARCH_INDEX_ROWS), []);

  return (
    <Card
      title="Search API performance profile"
      subtitle="Five dimensions, same answer model and harness · Outer edge is better"
      footer={
        <>
          <span>Source: Artificial Analysis Search Index · Data as of Oct 19, 2026</span>
          <span>Answer model: GPT-5.6 Luna (medium)</span>
        </>
      }
    >
      <div className={styles.body}>
        <div className={styles.radar}>
          <RadarChart scores={scores} hovered={hovered} onHover={setHovered} />
        </div>
        <div className={styles.table}>
          <ComparisonTable rows={SEARCH_INDEX_ROWS} hovered={hovered} onHover={setHovered} />
        </div>
      </div>
    </Card>
  );
}
