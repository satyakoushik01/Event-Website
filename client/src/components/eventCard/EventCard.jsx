import React from 'react';
import styles from './EventCard.module.css';
import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  return (
    <Link to={`/events/${event.id}`} className={styles.card}>
      <div className={styles.imageWrapper} style={{ backgroundImage: `url(${event.images[0]})` }} />
      <div className={styles.info}>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.date}>{new Date(event.date).toLocaleDateString()}</p>
        <p className={styles.location}>{event.location}</p>
      </div>
    </Link>
  );
}
