import { PROVIDERS, type ProviderId } from '@/data/providers';
import styles from './ProviderLogo.module.css';

interface ProviderLogoProps {
  provider: ProviderId;
  size?: number;
}

export function ProviderLogo({ provider, size = 18 }: ProviderLogoProps) {
  const p = PROVIDERS[provider];
  return (
    <img
      className={styles.logo}
      src={p.logo}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}
