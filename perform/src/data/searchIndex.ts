import type { ProviderId } from './providers';

/**
 * Artificial Analysis Search Index — leaderboard values (data as of Oct 19, 2026).
 * Answer model: GPT-5.6 Luna (medium).
 */
export interface SearchIndexRow {
  provider: ProviderId;
  config: string;
  index: number;
  deepSearchQA: number; // F1
  browseComp: number; // accuracy
  omniscience: number; // accuracy
  searchCostPer1k: number; // USD per 1,000 tasks
  modelCostPer1k: number; // USD per 1,000 tasks
  timePerTask: number; // seconds
}

export const SEARCH_INDEX_ROWS: SearchIndexRow[] = [
  { provider: 'octen', config: 'highlights', index: 77, deepSearchQA: 80, browseComp: 86, omniscience: 66, searchCostPer1k: 9.07, modelCostPer1k: 14.92, timePerTask: 14.9 },
  { provider: 'exa', config: 'auto', index: 80, deepSearchQA: 86, browseComp: 83, omniscience: 73, searchCostPer1k: 53.17, modelCostPer1k: 12.43, timePerTask: 45.5 },
  { provider: 'perplexity', config: 'medium', index: 80, deepSearchQA: 81, browseComp: 87, omniscience: 72, searchCostPer1k: 62.3, modelCostPer1k: 8.04, timePerTask: 26.6 },
  { provider: 'parallel', config: 'advanced', index: 75, deepSearchQA: 81, browseComp: 77, omniscience: 67, searchCostPer1k: 47.93, modelCostPer1k: 11.29, timePerTask: 40.3 },
  { provider: 'brave', config: 'LLM context', index: 75, deepSearchQA: 78, browseComp: 77, omniscience: 69, searchCostPer1k: 61.96, modelCostPer1k: 17.46, timePerTask: 21.6 },
  { provider: 'youcom', config: 'highlights', index: 74, deepSearchQA: 77, browseComp: 77, omniscience: 69, searchCostPer1k: 47.54, modelCostPer1k: 19.58, timePerTask: 18.6 },
];

/** Cost per Task (USD) = (search + model cost per 1k tasks) / 1000. */
export const costPerTask = (r: SearchIndexRow) => (r.searchCostPer1k + r.modelCostPer1k) / 1000;

export type RadarAxisKey = 'deepSearchQA' | 'browseComp' | 'omniscience' | 'costEfficiency' | 'speed';

export interface RadarAxis {
  key: RadarAxisKey;
  label: string[]; // lines
}

/** Clockwise from 12 o'clock. Every axis reads "outer edge is better". */
export const RADAR_AXES: RadarAxis[] = [
  { key: 'deepSearchQA', label: ['DeepSearchQA F1'] },
  { key: 'browseComp', label: ['BrowseComp', 'Accuracy'] },
  { key: 'omniscience', label: ['Omniscience', 'Accuracy'] },
  { key: 'costEfficiency', label: ['Cost Efficiency'] },
  { key: 'speed', label: ['Speed'] },
];

/**
 * Radar scores (0–100, higher is better).
 * Quality metrics are used as reported; Cost Efficiency and Speed are the best
 * Cost / Time per Task among these providers divided by the provider's value × 100.
 */
export function radarScores(rows: SearchIndexRow[]): Map<ProviderId, Record<RadarAxisKey, number>> {
  const bestCost = Math.min(...rows.map(costPerTask));
  const bestTime = Math.min(...rows.map((r) => r.timePerTask));
  return new Map(
    rows.map((r) => [
      r.provider,
      {
        deepSearchQA: r.deepSearchQA,
        browseComp: r.browseComp,
        omniscience: r.omniscience,
        costEfficiency: (100 * bestCost) / costPerTask(r),
        speed: (100 * bestTime) / r.timePerTask,
      },
    ]),
  );
}

export type TableColumnKey = 'cost' | 'time' | 'browseComp' | 'index' | 'deepSearchQA' | 'omniscience';

export interface TableColumn {
  key: TableColumnKey;
  label: string;
  /** Lower values win (cost, time). */
  lowerIsBetter?: boolean;
  value: (r: SearchIndexRow) => number;
  format: (v: number) => { prefix?: string; value: string; unit?: string };
}

/** Column order puts Octen's strongest metrics first. */
export const TABLE_COLUMNS: TableColumn[] = [
  { key: 'cost', label: 'Cost per Task', lowerIsBetter: true, value: costPerTask, format: (v) => ({ prefix: '$', value: v.toFixed(3) }) },
  { key: 'time', label: 'Time per Task', lowerIsBetter: true, value: (r) => r.timePerTask, format: (v) => ({ value: v.toFixed(1), unit: 's' }) },
  { key: 'browseComp', label: 'BrowseComp', value: (r) => r.browseComp, format: (v) => ({ value: String(v) }) },
  { key: 'index', label: 'Index', value: (r) => r.index, format: (v) => ({ value: String(v) }) },
  { key: 'deepSearchQA', label: 'DeepSearchQA', value: (r) => r.deepSearchQA, format: (v) => ({ value: String(v) }) },
  { key: 'omniscience', label: 'Omniscience', value: (r) => r.omniscience, format: (v) => ({ value: String(v) }) },
];
