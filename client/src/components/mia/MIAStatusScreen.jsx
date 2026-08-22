import { motion } from 'framer-motion';

const CONFIG = {
  listening: {
    icon: '🎤', label: 'MIA is Listening…',
    color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)',
  },
  thinking: {
    icon: '✦', label: 'MIA is Thinking…',
    color: '#d4af37', bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.3)',
  },
  speaking: {
    icon: '🔊', label: 'MIA is Speaking…',
    color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)',
  },
  generating: {
    icon: '📋', label: 'Generating Your Quote…',
    color: '#d4af37', bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.3)',
  },
  scheduling: {
    icon: '📅', label: 'Scheduling Your Meeting…',
    color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)',
  },
  sending: {
    icon: '✉️', label: 'Sending Confirmation…',
    color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)',
  },
  completed: {
    icon: '✓', label: 'All Done!',
    color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)',
  },
};

const dotVariants = {
  animate: (i) => ({
    scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5],
    transition: { duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' },
  }),
};

/**
 * MIAStatusScreen – ambient status overlay for AI processing states.
 * Props: status {'listening'|'thinking'|'speaking'|'generating'|'scheduling'|'sending'|'completed'}
 */
export default function MIAStatusScreen({ status = 'thinking' }) {
  const cfg = CONFIG[status] || CONFIG.thinking;

  return (
    <motion.div
      className="mia-status-screen"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Ambient glow */}
      <div className="mia-status-glow" style={{ background: `radial-gradient(circle, ${cfg.bg} 0%, transparent 70%)` }} />

      {/* Icon orb */}
      <motion.div
        className="mia-status-orb"
        style={{ borderColor: cfg.border, background: cfg.bg }}
        animate={{ scale: [1, 1.06, 1], boxShadow: [`0 0 20px ${cfg.bg}`, `0 0 40px ${cfg.bg}`, `0 0 20px ${cfg.bg}`] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="mia-status-icon" style={{ color: cfg.color }}>
          {cfg.icon}
        </span>
        {/* Pulse rings */}
        {['', '1', '2'].map((n) => (
          <motion.span
            key={n}
            className="mia-status-ring"
            style={{ borderColor: cfg.border }}
            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: n === '' ? 0 : n === '1' ? 0.6 : 1.2, ease: 'easeOut' }}
          />
        ))}
      </motion.div>

      {/* Label */}
      <motion.p
        className="mia-status-label"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {cfg.label}
      </motion.p>

      {/* Animated dots */}
      <div className="mia-status-dots">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="mia-status-dot-sm"
            style={{ background: cfg.color }}
            custom={i}
            variants={dotVariants}
            animate="animate"
          />
        ))}
      </div>
    </motion.div>
  );
}
