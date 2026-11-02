import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  tag: string;
  title: string;
}

export function SectionHeader({ tag, title }: SectionHeaderProps) {
  return (
    <header className={styles.header}>
      <span className={styles.tag}>{tag}</span>
      <h2 className={styles.title}>{title}</h2>
    </header>
  );
}
