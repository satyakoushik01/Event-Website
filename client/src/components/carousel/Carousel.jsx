import React, { useRef } from 'react';
import styles from './Carousel.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Carousel({ children }) {
  const containerRef = useRef(null);

  const scroll = (dir) => {
    const { current } = containerRef;
    if (current) {
      const scrollAmount = current.offsetWidth * 0.8;
      current.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.carouselWrapper}>
      <button className={styles.navBtn} onClick={() => scroll(-1)} aria-label="Scroll left">
        <FaChevronLeft />
      </button>
      <div className={styles.carousel} ref={containerRef}>
        {children}
      </div>
      <button className={styles.navBtn} onClick={() => scroll(1)} aria-label="Scroll right">
        <FaChevronRight />
      </button>
    </div>
  );
}
