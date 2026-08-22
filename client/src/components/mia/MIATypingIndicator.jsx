import { motion } from 'framer-motion';

const dotVariants = {
  animate: (i) => ({
    y: [0, -7, 0],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.1,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: i * 0.18,
    },
  }),
};

/**
 * MIATypingIndicator – three animated gold dots in a glass bubble.
 * Mimics MIA "thinking" / waiting for a response.
 */
export default function MIATypingIndicator() {
  return (
    <motion.div
      className="mia-typing-wrap"
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mia-typing-bubble">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="mia-typing-dot"
            custom={i}
            variants={dotVariants}
            animate="animate"
          />
        ))}
      </div>
    </motion.div>
  );
}
