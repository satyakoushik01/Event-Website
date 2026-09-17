import React from 'react';
import styles from './PrimaryButton.module.css';

export default function PrimaryButton({ children, onClick, type = 'button' }) {
  return (
    <button type={type} className={styles.btn} onClick={onClick}>
      {children}
    </button>
  );
}
