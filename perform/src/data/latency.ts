import type { ProviderId } from './providers';

/** Web Search latency — SealQA Hard benchmark, run from us-west-1. */
export interface LatencyRow {
  provider: ProviderId;
  label: string;
  p50: number; // ms
  p90: number; // ms
}

export const LATENCY_ROWS: LatencyRow[] = [
  { provider: 'octen', label: 'Octen', p50: 62, p90: 68 },
  { provider: 'tavily', label: 'Tavily Ultra-Fast', p50: 244, p90: 351 },
  { provider: 'parallel', label: 'Parallel Turbo', p50: 332, p90: 420 },
  { provider: 'exa', label: 'Exa Instant', p50: 372, p90: 507 },
  { provider: 'parallel', label: 'Parallel Adv.', p50: 2667, p90: 3843 },
];

/**
 * Bar track domain in ms. Values above it are clipped at the track end
 * (as in the design, where Parallel Adv. fills the whole track).
 */
export const LATENCY_DOMAIN_MS = 2300;
