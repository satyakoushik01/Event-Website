import { motion } from 'framer-motion';

/* ── Mock quotation generator ─────────────────────────────────────────────── */
function buildQuote(data) {
  const base = {
    'Under ₹1 Lakh': 75000, '₹1 – 3 Lakhs': 200000, '₹3 – 5 Lakhs': 400000,
    '₹5 – 10 Lakhs': 750000, '₹10 – 25 Lakhs': 1750000, '₹25 Lakhs+': 3000000,
    'Not Decided Yet': 500000,
  };
  const budget = base[data?.budget] || 500000;
  const services = data?.services || ['Photography', 'Décor & Florals', 'Catering'];
  const fmt = (n) => '₹' + n.toLocaleString('en-IN');

  const serviceItems = services.slice(0, 6).map((s, i) => ({
    name: s,
    est: fmt(Math.round((budget / services.length) * (0.8 + i * 0.06))),
  }));

  const vendors = [
    { name: 'Lumière Studios', cat: 'Photography', rating: '4.9' },
    { name: 'Bloom & Blossom', cat: 'Décor & Florals', rating: '4.8' },
    { name: 'Savoir Faire Catering', cat: 'Catering', rating: '4.9' },
    { name: 'The Grand Pavilion', cat: 'Venue', rating: '4.7' },
  ];

  const timeline = [
    { day: 'D-90', task: 'Vendor Bookings & Deposits' },
    { day: 'D-60', task: 'Menu & Décor Finalisation' },
    { day: 'D-30', task: 'Guest Confirmations & Seating' },
    { day: 'D-7',  task: 'Final Walk-through & Briefing' },
    { day: 'D-Day', task: 'Event Execution by Moments Team' },
  ];

  return { budget: fmt(budget), serviceItems, vendors, timeline };
}

/**
 * MIAQuotation – premium quotation preview.
 * Props: data {object}, onRequest, onBook, onModify
 */
export default function MIAQuotation({ data = {}, onRequest, onBook, onModify }) {
  const quote = buildQuote(data);

  return (
    <motion.div
      className="mia-quote"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Hero */}
      <div className="mia-quote-hero">
        <div className="mia-quote-hero-bg" />
        <p className="mia-quote-hero-label">Estimated Budget</p>
        <motion.p
          className="mia-quote-hero-amount"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 16 }}
        >
          {quote.budget}
        </motion.p>
        <p className="mia-quote-hero-sub">Indicative estimate • Final quote on consultation</p>
      </div>

      {/* Recommended Services */}
      <div className="mia-quote-section">
        <h4 className="mia-quote-section-title">Recommended Services</h4>
        {quote.serviceItems.map((item, i) => (
          <motion.div
            key={item.name}
            className="mia-quote-service-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
          >
            <span className="mia-quote-service-name">{item.name}</span>
            <span className="mia-quote-service-est">{item.est}</span>
          </motion.div>
        ))}
      </div>

      {/* Suggested Vendors */}
      <div className="mia-quote-section">
        <h4 className="mia-quote-section-title">Suggested Vendors</h4>
        <div className="mia-quote-vendors">
          {quote.vendors.map((v, i) => (
            <motion.div
              key={v.name}
              className="mia-quote-vendor-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
            >
              <div className="mia-quote-vendor-dot" />
              <div>
                <p className="mia-quote-vendor-name">{v.name}</p>
                <p className="mia-quote-vendor-cat">{v.cat}</p>
              </div>
              <span className="mia-quote-vendor-rating">⭐ {v.rating}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mia-quote-section">
        <h4 className="mia-quote-section-title">Planning Timeline</h4>
        <div className="mia-quote-timeline">
          {quote.timeline.map((t, i) => (
            <motion.div
              key={t.day}
              className="mia-quote-tl-item"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
            >
              <span className="mia-quote-tl-day">{t.day}</span>
              <span className="mia-quote-tl-line" />
              <span className="mia-quote-tl-task">{t.task}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Deliverables */}
      <div className="mia-quote-section">
        <h4 className="mia-quote-section-title">Deliverables</h4>
        {['Dedicated event coordinator', 'Vendor management & coordination', 'Day-of execution & oversight', 'Post-event debrief & photo delivery'].map((d, i) => (
          <motion.div key={d} className="mia-quote-deliverable" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 + i * 0.06 }}>
            <span className="mia-quote-check">✦</span>{d}
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <motion.div className="mia-summary-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <motion.button className="mia-btn mia-btn--gold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onRequest}>
          Request Final Quote
        </motion.button>
        <motion.button className="mia-btn mia-btn--dark" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onBook}>
          Book Consultation
        </motion.button>
        <motion.button className="mia-btn mia-btn--ghost" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onModify}>
          Modify Requirements
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
