import type { ProviderId } from './providers';

/**
 * Time per Task — average model + search time per benchmark task (seconds).
 * Source: Artificial Analysis Search Index.
 */
export interface TimePerTaskRow {
  provider: ProviderId;
  name: string;
  config: string;
  seconds: number;
}

export const TIME_PER_TASK: TimePerTaskRow[] = [
  { provider: 'octen', name: 'Octen Search', config: 'highlights', seconds: 14.9 },
  { provider: 'parallel', name: 'Parallel Search', config: 'no flags', seconds: 17.6 },
  { provider: 'youcom', name: 'You.com Search', config: 'highlights', seconds: 18.6 },
  { provider: 'keepable', name: 'Keepable Search', config: 'agentic', seconds: 19.7 },
  { provider: 'brave', name: 'Brave Search', config: 'LLM context', seconds: 21.6 },
  { provider: 'linkup', name: 'Linkup Search', config: 'flash, alpha', seconds: 24.4 },
  { provider: 'perplexity', name: 'Perplexity Search', config: 'medium', seconds: 26.6 },
  { provider: 'openai', name: 'OpenAI Web Search', config: 'medium', seconds: 29.8 },
  { provider: 'exa', name: 'Exa Search', config: 'lite+dynamic\nhighlights', seconds: 30.9 },
  { provider: 'deepseek', name: 'DeepSeek Search', config: 'summary', seconds: 38.5 },
];

export const ARTIFICIAL_ANALYSIS_URL = 'https://artificialanalysis.ai/agents/search-api';
