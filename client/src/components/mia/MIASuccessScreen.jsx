import { motion } from 'framer-motion';

const CONFIG = {
  meeting:      { icon: '📅', title: 'Meeting Booked!',           sub: 'Your consultation has been confirmed. A calendar invite will be sent shortly.' },
  callback:     { icon: '📞', title: 'Callback Scheduled!',       sub: 'MIA will call you at your preferred time. We look forward to speaking with you.' },
  quotation:    { icon: '📋', title: 'Quotation Requested!',      sub: 'Your detailed quotation is being prepared. Expect it within 24 hours.' },
  conversation: { icon: '💾', title: 'Conversation Saved!',       sub: 'Your event discussion has been saved to your history for future reference.' },
  default:      { icon: '✓',  title: 'All Done!',                 sub: 'Your request has been successfully submitted.' },
};

const checkVariants = {
  hidden:  { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.6, delay: 0.3, ease: 'easeInOut' } },
};

const circleVariants = {
  hidden:  { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * MIASuccessScreen
 * Props: type {'meeting'|'callback'|'quotation'|'conversation'|'default'}, onAction, onClose
 */
export default function MIASuccessScreen({ type = 'default', onAction, onClose }) {
  const cfg = CONFIG[type] || CONFIG.default;

  return (
    <motion.div
      className="mia-success-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Confetti dots */}
      {[...Array(8)].map((_, i) => (
        <motion.span
          key={i}
          className="mia-success-confetti"
          style={{ '--i': i }}
          initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], y: -80 - i * 8, x: (i % 2 === 0 ? 1 : -1) * (20 + i * 10), scale: [0, 1, 0] }}
          transition={{ duration: 1.2, delay: 0.3 + i * 0.06, ease: 'easeOut' }}
        />
      ))}

      {/* Check circle */}
      <motion.div className="mia-success-circle" variants={circleVariants} initial="hidden" animate="visible">
        <svg viewBox="0 0 52 52" className="mia-success-svg" aria-hidden="true">
          <motion.circle cx="26" cy="26" r="24" fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="2" />
          <motion.circle
            cx="26" cy="26" r="24" fill="none"
            stroke="#d4af37" strokeWidth="2"
            variants={circleVariants}
            initial="hidden" animate="visible"
          />
          <motion.path
            fill="none" stroke="#d4af37" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            d="M14 27l8 8 16-16"
            variants={checkVariants} initial="hidden" animate="visible"
          />
        </svg>
      </motion.div>

      {/* Emoji */}
      <motion.span
        className="mia-success-icon"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 12 }}
      >
        {cfg.icon}
      </motion.span>

      <motion.h3
        className="mia-success-title"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        {cfg.title}
      </motion.h3>

      <motion.p
        className="mia-success-sub"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >
        {cfg.sub}
      </motion.p>

      <motion.div
        className="mia-success-actions"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
      >
        {onAction && (
          <motion.button className="mia-btn mia-btn--gold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onAction}>
            View Details
          </motion.button>
        )}
        <motion.button className="mia-btn mia-btn--ghost" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClose}>
          Back to Home
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
