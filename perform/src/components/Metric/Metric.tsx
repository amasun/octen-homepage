import { cx } from '@/lib/cx';
import styles from './Metric.module.css';

export type MetricTone = 'default' | 'active' | 'error';

interface MetricProps {
  value: string;
  unit?: string;
  prefix?: string;
  tone?: MetricTone;
  /** Show the "best in column" dot before the value. */
  best?: boolean;
  className?: string;
}

/** Monospace number with a smaller grey unit, e.g. "62ms", "14.9s", "$0.024". */
export function Metric({ value, unit, prefix, tone = 'default', best, className }: MetricProps) {
  return (
    <span className={cx(styles.metric, styles[tone], className)}>
      {best && <span className={styles.best} aria-label="Best in column" />}
      {prefix && <span className={styles.unit}>{prefix}</span>}
      <span className={styles.value}>{value}</span>
      {unit && <span className={styles.unit}>{unit}</span>}
    </span>
  );
}
