export type TabId = 'speed' | 'accuracy' | 'scale' | 'search-index' | 'freshness';

export interface TabDef {
  id: TabId;
  label: string;
  headline?: string;
  description?: string;
}

export const TABS: TabDef[] = [
  {
    id: 'speed',
    label: 'Speed',
    headline: '62ms P50 latency',
    description:
      'The fastest web search API in the world — without trading off accuracy. 4× faster than any vendor at P50, with top accuracy across QA benchmarks.',
  },
  { id: 'accuracy', label: 'Accuracy' },
  { id: 'scale', label: 'Scale' },
  { id: 'search-index', label: 'Search Index' },
  { id: 'freshness', label: 'Freshness' },
];
