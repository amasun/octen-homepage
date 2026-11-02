import octen from '@/assets/logos/octen.svg';
import tavily from '@/assets/logos/tavily.svg';
import parallel from '@/assets/logos/parallel.svg';
import exa from '@/assets/logos/exa.svg';
import youcom from '@/assets/logos/youcom.png';
import keepable from '@/assets/logos/keepable.svg';
import brave from '@/assets/logos/brave.svg';
import linkup from '@/assets/logos/linkup.svg';
import perplexity from '@/assets/logos/perplexity.svg';
import openai from '@/assets/logos/openai.svg';
import deepseek from '@/assets/logos/deepseek.svg';

export type ProviderId =
  | 'octen'
  | 'tavily'
  | 'parallel'
  | 'exa'
  | 'youcom'
  | 'keepable'
  | 'brave'
  | 'linkup'
  | 'perplexity'
  | 'openai'
  | 'deepseek';

export interface Provider {
  id: ProviderId;
  name: string;
  logo: string;
  /** Accent used when this provider is highlighted (e.g. radar hover). */
  accent: string;
}

export const PROVIDERS: Record<ProviderId, Provider> = {
  octen: { id: 'octen', name: 'Octen', logo: octen, accent: '#039855' },
  tavily: { id: 'tavily', name: 'Tavily', logo: tavily, accent: '#3c3a39' },
  parallel: { id: 'parallel', name: 'Parallel', logo: parallel, accent: '#1d1c1a' },
  exa: { id: 'exa', name: 'Exa', logo: exa, accent: '#1f40ed' },
  youcom: { id: 'youcom', name: 'You.com', logo: youcom, accent: '#6b5bf5' },
  keepable: { id: 'keepable', name: 'Keepable', logo: keepable, accent: '#717680' },
  brave: { id: 'brave', name: 'Brave', logo: brave, accent: '#ff3c00' },
  linkup: { id: 'linkup', name: 'Linkup', logo: linkup, accent: '#717680' },
  perplexity: { id: 'perplexity', name: 'Perplexity', logo: perplexity, accent: '#20808d' },
  openai: { id: 'openai', name: 'OpenAI', logo: openai, accent: '#000000' },
  deepseek: { id: 'deepseek', name: 'DeepSeek', logo: deepseek, accent: '#4d6bfe' },
};

export const HIGHLIGHT_PROVIDER: ProviderId = 'octen';
