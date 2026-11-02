import { Card } from '@/components/Card/Card';
import { Metric } from '@/components/Metric/Metric';
import { ProviderLogo } from '@/components/ProviderLogo/ProviderLogo';
import { HIGHLIGHT_PROVIDER } from '@/data/providers';
import { LATENCY_DOMAIN_MS, LATENCY_ROWS } from '@/data/latency';
import { cx } from '@/lib/cx';
import styles from './LatencyCard.module.css';

const pct = (ms: number) => `${Math.min(100, (ms / LATENCY_DOMAIN_MS) * 100)}%`;

export function LatencyCard() {
  return (
    <Card
      title="Web Search latency"
      footer={
        <>
          <span>SealQA Hard benchmark · Run from us-west-1</span>
          <span>
            <strong>DIFF</strong> = P90−P50
          </span>
        </>
      }
    >
      <div className={styles.scroller}>
      <table className={styles.table}>
        <caption className="visually-hidden">P50 and P90 web search latency by provider, in milliseconds</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.provider}>Provider</th>
            <th scope="col" className={styles.num}>P50</th>
            <th scope="col" className={styles.barCol}>
              <span className="visually-hidden">Latency distribution</span>
            </th>
            <th scope="col" className={styles.num}>P90</th>
            <th scope="col" className={styles.num}>DIFF</th>
          </tr>
        </thead>
        <tbody>
          {LATENCY_ROWS.map((row) => {
            const active = row.provider === HIGHLIGHT_PROVIDER;
            const diff = row.p90 - row.p50;
            return (
              <tr key={row.label} className={cx(active && styles.active)}>
                <th scope="row" className={styles.provider}>
                  <span className={styles.providerInner}>
                    <ProviderLogo provider={row.provider} size={active ? 20 : 18} />
                    <span className={styles.name}>{row.label}</span>
                  </span>
                </th>
                <td className={styles.num}>
                  <Metric value={String(row.p50)} unit="ms" tone={active ? 'active' : 'default'} />
                </td>
                <td className={styles.barCol}>
                  <div className={styles.track} aria-hidden="true">
                    <div className={styles.p90} style={{ width: pct(row.p90) }} />
                    <div className={styles.p50} style={{ width: pct(row.p50) }} />
                  </div>
                </td>
                <td className={styles.num}>
                  <Metric value={String(row.p90)} unit="ms" tone={active ? 'active' : 'default'} />
                </td>
                <td className={styles.num}>
                  <Metric value={String(diff)} unit="ms" tone={active ? 'active' : 'error'} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </Card>
  );
}
