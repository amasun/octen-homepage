import { Card } from '@/components/Card/Card';
import { ProviderLogo } from '@/components/ProviderLogo/ProviderLogo';
import { HIGHLIGHT_PROVIDER } from '@/data/providers';
import { ARTIFICIAL_ANALYSIS_URL, TIME_PER_TASK } from '@/data/timePerTask';
import aaIcon from '@/assets/logos/artificial-analysis.svg';
import { cx } from '@/lib/cx';
import styles from './TimePerTaskCard.module.css';

/** Pixel height of the tallest bar (design: 130px for 38.5s). */
const MAX_BAR = 130;

function SourceBadge() {
  return (
    <a className={styles.badge} href={ARTIFICIAL_ANALYSIS_URL} target="_blank" rel="noreferrer noopener">
      <img src={aaIcon} width={12} height={12} alt="" aria-hidden="true" />
      <span>Artificial Analysis</span>
    </a>
  );
}

export function TimePerTaskCard() {
  const max = Math.max(...TIME_PER_TASK.map((r) => r.seconds));

  return (
    <Card
      title="Time per Task"
      titleAside={<SourceBadge />}
      footer={<span>Average model and search time per task · Lower is better</span>}
    >
      <div className={styles.scroller}>
        <figure className={styles.chart} aria-label="Average time per task in seconds, by search API">
          <ol className={styles.bars}>
            {TIME_PER_TASK.map((row, i) => {
              const active = row.provider === HIGHLIGHT_PROVIDER;
              const h = Math.round((row.seconds / max) * MAX_BAR);
              return (
                <li
                  key={row.provider + row.name}
                  className={cx(styles.col, active && styles.active)}
                  style={{ ['--i' as string]: i }}
                >
                  <span className={styles.value}>
                    <span className={styles.num}>{row.seconds.toFixed(1)}</span>
                    <span className={styles.unit}>s</span>
                  </span>
                  <span className={styles.bar} style={{ height: h }} />
                  <span className="visually-hidden">
                    {row.name} ({row.config.replace('\n', ' ')}): {row.seconds.toFixed(1)} seconds
                  </span>
                </li>
              );
            })}
          </ol>
          <div className={styles.axis} />
          <ol className={styles.labels} aria-hidden="true">
            {TIME_PER_TASK.map((row) => {
              const active = row.provider === HIGHLIGHT_PROVIDER;
              return (
                <li key={row.provider + row.name} className={cx(styles.labelCol, active && styles.active)}>
                  <ProviderLogo provider={row.provider} size={16} />
                  <span className={styles.label}>
                    <span className={styles.labelName}>{row.name}</span>
                    <span className={styles.labelConfig}>({row.config})</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </figure>
      </div>
    </Card>
  );
}
