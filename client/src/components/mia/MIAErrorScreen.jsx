import { motion } from 'framer-motion';

const CONFIG = {
  network: {
    icon: '📡', title: 'Connection Lost',
    sub: 'Please check your internet connection and try again.',
  },
  default: {
    icon: '⚠️', title: 'Something Went Wrong',
    sub: 'An unexpected error occurred. Please try again in a moment.',
  },
  timeout: {
    icon: '⏱', title: 'Request Timed Out',
    sub: 'MIA is taking too long to respond. Please try again.',
  },
};

/**
 * MIAErrorScreen
 * Props: type {'network'|'timeout'|'default'}, onRetry, onClose
 */
export default function MIAErrorScreen({ type = 'default', onRetry, onClose }) {
  const cfg = CONFIG[type] || CONFIG.default;

  return (
    <motion.div
      className="mia-error-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Icon */}
      <motion.div
        className="mia-error-icon-wrap"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 15 }}
      >
        <span className="mia-error-icon">{cfg.icon}</span>
        {/* Radiating broken lines */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <motion.span
            key={deg}
            className="mia-error-ray"
            style={{ transform: `rotate(${deg}deg)` }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: [0, 0.5, 0] }}
            transition={{ delay: 0.3 + deg / 600, duration: 0.8 }}
          />
        ))}
      </motion.div>

      <motion.h3
        className="mia-error-title"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        {cfg.title}
      </motion.h3>

      <motion.p
        className="mia-error-sub"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        {cfg.sub}
      </motion.p>

      <motion.div
        className="mia-success-actions"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        {onRetry && (
          <motion.button className="mia-btn mia-btn--dark" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onRetry}>
            Try Again
          </motion.button>
        )}
        <motion.button className="mia-btn mia-btn--ghost" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClose}>
          Back to Home
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
