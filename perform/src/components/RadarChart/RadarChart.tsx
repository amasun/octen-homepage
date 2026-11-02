import { useMemo } from 'react';
import { HIGHLIGHT_PROVIDER, PROVIDERS, type ProviderId } from '@/data/providers';
import { RADAR_AXES, type RadarAxisKey } from '@/data/searchIndex';
import { cx } from '@/lib/cx';
import styles from './RadarChart.module.css';

const W = 500;
const H = 430;
const CX = W / 2;
const CY = H / 2 + 14;
const R = 150;
const RINGS = [20, 40, 60, 80, 100];
const MUTED = 'var(--color-series-muted)';

const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / RADAR_AXES.length;
const point = (i: number, v: number): [number, number] => [
  CX + ((R * v) / 100) * Math.cos(angle(i)),
  CY + ((R * v) / 100) * Math.sin(angle(i)),
];
const toPoints = (pts: Array<[number, number]>) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

interface RadarChartProps {
  scores: Map<ProviderId, Record<RadarAxisKey, number>>;
  hovered: ProviderId | null;
  onHover: (id: ProviderId | null) => void;
}

export function RadarChart({ scores, hovered, onHover }: RadarChartProps) {
  // Draw muted series first, Octen next, the hovered series last (on top).
  const order = useMemo(() => {
    const ids = [...scores.keys()];
    const rank = (id: ProviderId) => (id === hovered ? 2 : id === HIGHLIGHT_PROVIDER ? 1 : 0);
    return ids.sort((a, b) => rank(a) - rank(b));
  }, [scores, hovered]);

  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Radar chart comparing search APIs on five dimensions; outer edge is better"
      onMouseLeave={() => onHover(null)}
    >
      {/* Grid */}
      <g aria-hidden="true">
        {RINGS.map((lv) => (
          <polygon
            key={lv}
            className={lv === 100 ? styles.ringOuter : styles.ring}
            points={toPoints(RADAR_AXES.map((_, i) => point(i, lv)))}
          />
        ))}
        {RADAR_AXES.map((a, i) => {
          const [x, y] = point(i, 100);
          return <line key={a.key} className={styles.spoke} x1={CX} y1={CY} x2={x} y2={y} />;
        })}
      </g>

      {/* Series */}
      {order.map((id) => {
        const s = scores.get(id)!;
        const pts = RADAR_AXES.map((a, i) => point(i, s[a.key]));
        const isHovered = id === hovered;
        const isBrand = id === HIGHLIGHT_PROVIDER;
        const emphasised = isHovered || isBrand;
        const color = isBrand ? 'var(--color-active)' : isHovered ? PROVIDERS[id].accent : MUTED;
        const dimmed = hovered !== null && !emphasised;
        return (
          <g
            key={id}
            className={cx(styles.series, emphasised && styles.emphasised, dimmed && styles.dimmed)}
            style={{ ['--series' as string]: color }}
            onMouseEnter={() => onHover(id)}
          >
            <polygon className={styles.area} points={toPoints(pts)} />
            {pts.map(([x, y], i) => (
              <circle key={i} className={styles.dot} cx={x} cy={y} r={emphasised ? 4 : 2.25} />
            ))}
            <title>{PROVIDERS[id].name}</title>
          </g>
        );
      })}

      {/* Ring scale along the empty bottom edge */}
      <g aria-hidden="true">
        {RINGS.map((lv) => (
          <text
            key={lv}
            className={styles.ringLabel}
            x={CX}
            y={CY + ((R * lv) / 100) * Math.cos(Math.PI / 5) - 4}
            textAnchor="middle"
          >
            {lv}
          </text>
        ))}
      </g>

      {/* Axis labels */}
      <g aria-hidden="true">
        {RADAR_AXES.map((a, i) => {
          const c = Math.cos(angle(i));
          const s = Math.sin(angle(i));
          const x = CX + (R + 16) * c;
          const y = CY + (R + 16) * s;
          const anchor = c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle';
          const lineH = 17;
          const blockH = a.label.length * lineH;
          const top = s < -0.5 ? y - blockH : s > 0.5 ? y : y - blockH / 2;
          return (
            <text key={a.key} className={styles.axisLabel} x={x} y={top} textAnchor={anchor}>
              {a.label.map((line, j) => (
                <tspan key={line} x={x} dy={j === 0 ? 13 : lineH}>
                  {line}
                </tspan>
              ))}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
