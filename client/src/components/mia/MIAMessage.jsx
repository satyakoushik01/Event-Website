import { motion } from 'framer-motion';

/**
 * MIAMessage – a single chat bubble.
 *
 * Props:
 *  role     {'ai' | 'user'} – determines alignment & styling
 *  text     {string}        – message body
 *  time     {string}        – optional time label e.g. "Just now"
 */
export default function MIAMessage({ role = 'ai', text, time }) {
  const isAI = role === 'ai';

  return (
    <motion.div
      className={`mia-msg-row ${isAI ? 'mia-msg-row--ai' : 'mia-msg-row--user'}`}
      initial={{ opacity: 0, y: 14, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* AI avatar dot */}
      {isAI && (
        <span className="mia-msg-avatar" aria-hidden="true">
          M
        </span>
      )}

      <div className={`mia-msg-bubble ${isAI ? 'mia-msg-bubble--ai' : 'mia-msg-bubble--user'}`}>
        <p className="mia-msg-text">{text}</p>
        {time && <span className="mia-msg-time">{time}</span>}
      </div>
    </motion.div>
  );
}
