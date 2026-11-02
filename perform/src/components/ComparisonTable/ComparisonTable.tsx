import { Metric } from '@/components/Metric/Metric';
import { ProviderLogo } from '@/components/ProviderLogo/ProviderLogo';
import { HIGHLIGHT_PROVIDER, PROVIDERS, type ProviderId } from '@/data/providers';
import { TABLE_COLUMNS, type SearchIndexRow } from '@/data/searchIndex';
import { cx } from '@/lib/cx';
import styles from './ComparisonTable.module.css';

interface ComparisonTableProps {
  rows: SearchIndexRow[];
  hovered: ProviderId | null;
  onHover: (id: ProviderId | null) => void;
}

export function ComparisonTable({ rows, hovered, onHover }: ComparisonTableProps) {
  const best = new Map(
    TABLE_COLUMNS.map((c) => {
      const values = rows.map(c.value);
      return [c.key, c.lowerIsBetter ? Math.min(...values) : Math.max(...values)] as const;
    }),
  );

  return (
    <div className={styles.wrap}>
      <table className={styles.table} onMouseLeave={() => onHover(null)}>
        <caption className="visually-hidden">Search API comparison, Artificial Analysis Search Index</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.provider}>Provider</th>
            {TABLE_COLUMNS.map((c) => (
              <th key={c.key} scope="col" className={styles.num}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const active = r.provider === HIGHLIGHT_PROVIDER;
            return (
              <tr
                key={r.provider}
                tabIndex={0}
                className={cx(active && styles.active, hovered === r.provider && styles.hovered)}
                onMouseEnter={() => onHover(r.provider)}
                onFocus={() => onHover(r.provider)}
                onBlur={() => onHover(null)}
              >
                <th scope="row" className={styles.provider}>
                  <span className={styles.providerInner}>
                    <ProviderLogo provider={r.provider} size={18} />
                    <span className={styles.name}>{PROVIDERS[r.provider].name}</span>
                    <span className={styles.config}>{r.config}</span>
                  </span>
                </th>
                {TABLE_COLUMNS.map((c) => {
                  const v = c.value(r);
                  const f = c.format(v);
                  return (
                    <td key={c.key} className={styles.num}>
                      <Metric
                        prefix={f.prefix}
                        value={f.value}
                        unit={f.unit}
                        tone={active ? 'active' : 'default'}
                        best={v === best.get(c.key)}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className={styles.note}>
        <span className={styles.noteDot} aria-hidden="true" /> Best in column · Cost per Task = model + search cost
        (USD) · Radar: Cost Efficiency and Speed = best value ÷ provider value × 100
      </p>
    </div>
  );
}
