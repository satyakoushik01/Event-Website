import { useState } from 'react';
import { motion } from 'framer-motion';

const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Kannada', 'Bengali'];
const CONTACT_METHODS = [
  { id: 'call',      icon: '📞', label: 'Phone Call' },
  { id: 'whatsapp',  icon: '💬', label: 'WhatsApp' },
  { id: 'video',     icon: '🎥', label: 'Video Call' },
];
const REASONS = [
  'Event Planning Enquiry',
  'Quotation Discussion',
  'Vendor Recommendations',
  'Booking Confirmation',
  'Change / Modification',
  'General Enquiry',
];

/**
 * MIACallbackScheduler – callback booking form.
 * Props: onSchedule {function(formData)}
 */
export default function MIACallbackScheduler({ onSchedule }) {
  const [form, setForm] = useState({
    date: '', time: '', language: 'English', method: 'call', reason: '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const canSubmit = form.date && form.time && form.reason;

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      className="mia-callback"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mia-sched-header">
        <div className="mia-sched-icon">📞</div>
        <h3 className="mia-sched-title">Schedule a Callback</h3>
        <p className="mia-sched-sub">Tell us when and how to reach you — MIA will arrange everything.</p>
      </div>

      <div className="mia-callback-form">
        {/* Date & Time */}
        <div className="mia-callback-row">
          <div className="mia-form-group">
            <label className="mia-form-label">Preferred Date</label>
            <input
              className="mia-form-input"
              type="date"
              min={minDate}
              value={form.date}
              onChange={e => set('date', e.target.value)}
            />
          </div>
          <div className="mia-form-group">
            <label className="mia-form-label">Preferred Time</label>
            <input
              className="mia-form-input"
              type="time"
              value={form.time}
              onChange={e => set('time', e.target.value)}
            />
          </div>
        </div>

        {/* Contact Method */}
        <div className="mia-form-group">
          <label className="mia-form-label">Contact Method</label>
          <div className="mia-callback-methods">
            {CONTACT_METHODS.map(m => (
              <motion.button
                key={m.id}
                className={`mia-callback-method ${form.method === m.id ? 'mia-callback-method--active' : ''}`}
                onClick={() => set('method', m.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="mia-form-group">
          <label className="mia-form-label">Preferred Language</label>
          <div className="mia-callback-langs">
            {LANGUAGES.map(l => (
              <motion.button
                key={l}
                className={`mia-callback-lang ${form.language === l ? 'mia-callback-lang--active' : ''}`}
                onClick={() => set('language', l)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
              >
                {l}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div className="mia-form-group">
          <label className="mia-form-label">Reason for Call</label>
          <div className="mia-callback-reasons">
            {REASONS.map(r => (
              <motion.button
                key={r}
                className={`mia-planner-opt ${form.reason === r ? 'mia-planner-opt--active' : ''}`}
                onClick={() => set('reason', r)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{ textAlign: 'left', fontSize: '0.78rem', padding: '9px 14px' }}
              >
                {form.reason === r && <span className="mia-planner-opt-check">✓</span>}
                {r}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <motion.div className="mia-summary-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <motion.button
          className={`mia-btn ${canSubmit ? 'mia-btn--dark' : 'mia-btn--disabled'}`}
          onClick={canSubmit ? () => onSchedule(form) : undefined}
          whileHover={canSubmit ? { scale: 1.02 } : {}}
          whileTap={canSubmit ? { scale: 0.97 } : {}}
        >
          Schedule Callback →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
