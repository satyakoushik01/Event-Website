import { motion } from 'framer-motion';

/**
 * MIAActionCard – a premium glass action card used inside the MIA side panel.
 *
 * Props:
 *  icon       {string}   – Emoji or icon character
 *  title      {string}   – Card headline
 *  subtitle   {string}   – Short descriptor beneath the title
 *  onClick    {function} – Click handler
 *  delay      {number}   – Stagger delay for entrance animation (seconds)
 */
export default function MIAActionCard({ icon, title, subtitle, onClick, delay = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.975 }}
      onClick={onClick}
      aria-label={title}
      className="mia-action-card group w-full text-left"
    >
      {/* Shimmer line on hover */}
      <motion.div
        className="mia-card-shimmer"
        initial={{ x: '-100%' }}
        whileHover={{ x: '200%' }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />

      <span className="mia-card-icon-wrap">
        <span className="mia-card-icon">{icon}</span>
      </span>

      <span className="mia-card-body">
        <span className="mia-card-title">{title}</span>
        <span className="mia-card-subtitle">{subtitle}</span>
      </span>

      {/* Arrow */}
      <motion.span
        className="mia-card-arrow"
        initial={{ x: 0, opacity: 0.4 }}
        whileHover={{ x: 4, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        →
      </motion.span>
    </motion.button>
  );
}
