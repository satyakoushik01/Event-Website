import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_HISTORY = [
  { id: 1, title: 'Wedding Planning – Sharma Family',   date: '14 Jul 2026', status: 'active',    preview: 'Discussed venue options, décor themes, and catering preferences…' },
  { id: 2, title: 'Corporate Annual Gala 2026',         date: '10 Jul 2026', status: 'completed', preview: 'Quotation generated, consultation booked for 20th July…' },
  { id: 3, title: 'Birthday Celebration – Rohan, 30th', date: '05 Jul 2026', status: 'completed', preview: 'Surprise theme finalised, caterer shortlisted…' },
  { id: 4, title: 'Engagement Ceremony – Verma Family',  date: '28 Jun 2026', status: 'archived',  preview: 'Initial enquiry, callback scheduled for follow-up…' },
];

const STATUS_STYLE = {
  active:    { label: 'Active',    color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)'   },
  completed: { label: 'Completed', color: '#d4af37', bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.25)' },
  archived:  { label: 'Archived',  color: '#8e8e8e', bg: 'rgba(142,142,142,0.1)',border: 'rgba(142,142,142,0.2)'  },
};

/**
 * MIAHistory – conversation history list with search.
 * Props: onOpen {function(id)}, onBack {function}
 */
export default function MIAHistory({ onOpen }) {
  const [query, setQuery]     = useState('');
  const [deleted, setDeleted] = useState([]);

  const filtered = MOCK_HISTORY.filter(
    h => !deleted.includes(h.id) && h.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      className="mia-history"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Page title */}
      <div className="mia-page-header">
        <h3 className="mia-page-title">Conversation History</h3>
        <p className="mia-page-sub">Your previous interactions with MIA</p>
      </div>

      {/* Search */}
      <div className="mia-search-wrap">
        <svg className="mia-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="mia-search-input"
          placeholder="Search conversations…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search conversations"
        />
        {query && (
          <motion.button className="mia-search-clear" onClick={() => setQuery('')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-label="Clear search">✕</motion.button>
        )}
      </div>

      {/* List */}
      <div className="mia-history-list">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div key="empty" className="mia-list-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="mia-list-empty-icon">💬</span>
              <p className="mia-list-empty-title">No Conversations Found</p>
              <p className="mia-list-empty-sub">{query ? 'Try a different search term.' : 'Your conversations with MIA will appear here.'}</p>
            </motion.div>
          ) : (
            filtered.map((item, i) => {
              const st = STATUS_STYLE[item.status] || STATUS_STYLE.archived;
              return (
                <motion.div
                  key={item.id}
                  className="mia-history-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  layout
                >
                  <div className="mia-history-card-top">
                    <h4 className="mia-history-card-title">{item.title}</h4>
                    <span className="mia-status-badge" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                      {st.label}
                    </span>
                  </div>
                  <p className="mia-history-card-preview">{item.preview}</p>
                  <div className="mia-history-card-footer">
                    <span className="mia-history-card-date">{item.date}</span>
                    <div className="mia-history-card-actions">
                      <motion.button className="mia-text-btn" whileHover={{ scale: 1.05 }} onClick={() => onOpen?.(item.id)}>Open →</motion.button>
                      <motion.button className="mia-text-btn mia-text-btn--danger" whileHover={{ scale: 1.05 }} onClick={() => setDeleted(d => [...d, item.id])}>Delete</motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
