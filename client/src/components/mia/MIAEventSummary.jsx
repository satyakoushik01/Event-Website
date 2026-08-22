import { motion } from 'framer-motion';

const FIELD_LABELS = {
  eventType: 'Event Type',
  eventDate: 'Event Date',
  location:  'Location',
  guests:    'Guest Count',
  budget:    'Budget',
  theme:     'Theme',
  services:  'Services',
  notes:     'Special Requests',
};

const FIELD_ICONS = {
  eventType: '🎪', eventDate: '📅', location: '📍', guests: '👥',
  budget: '💰', theme: '🎨', services: '✨', notes: '📝',
};

function SummaryRow({ fieldKey, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join(', ') : value;
  return (
    <motion.div
      className="mia-summary-row"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <span className="mia-summary-row-icon">{FIELD_ICONS[fieldKey]}</span>
      <div className="mia-summary-row-body">
        <span className="mia-summary-row-label">{FIELD_LABELS[fieldKey]}</span>
        <span className="mia-summary-row-value">{display}</span>
      </div>
    </motion.div>
  );
}

/**
 * MIAEventSummary – displays collected planner data.
 * Props: data {object}, onEdit {function}, onQuote {function}
 */
export default function MIAEventSummary({ data = {}, onEdit, onQuote }) {
  const keys = Object.keys(FIELD_LABELS);

  return (
    <motion.div
      className="mia-summary"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className="mia-summary-header">
        <div className="mia-summary-icon-wrap" aria-hidden="true">✦</div>
        <h3 className="mia-summary-title">Your Event Summary</h3>
        <p className="mia-summary-sub">Review your details before we generate a personalised quotation.</p>
      </div>

      {/* Rows */}
      <div className="mia-summary-rows">
        {keys.map((k, i) => (
          <motion.div key={k} transition={{ delay: 0.05 * i }}>
            <SummaryRow fieldKey={k} value={data[k]} />
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <motion.div
        className="mia-summary-actions"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button className="mia-btn mia-btn--ghost" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onEdit}>
          ✎ Edit Details
        </motion.button>
        <motion.button className="mia-btn mia-btn--gold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onQuote}>
          Generate Quotation →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
