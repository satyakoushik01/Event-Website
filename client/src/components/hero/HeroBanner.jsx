import React from 'react';
import styles from './HeroBanner.module.css';
import events from '../../mockData/events';

const categories = ['All','Festive Specials','Weekend Specials','Live Music','Comedy','DJ','Cultural','Family','Kids','Moments Originals'];

export default function HeroBanner({ onFilter }) {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <h1 className={styles.title}>Discover What&apos;s Happening</h1>
      <div className={styles.filterBar}>
        {categories.map(cat => (
          <button key={cat} className={styles.filterBtn} onClick={() => onFilter(cat)}>
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
}
