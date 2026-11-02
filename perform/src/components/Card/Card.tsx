import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Card.module.css';

interface CardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Element shown next to the title (e.g. a source badge). */
  titleAside?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Frosted chart card shared by every chart in the section. */
export function Card({ title, subtitle, titleAside, footer, className, children }: CardProps) {
  return (
    <section className={cx(styles.card, className)}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{title}</h3>
          {titleAside}
        </div>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>
      <div className={styles.body}>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </section>
  );
}
