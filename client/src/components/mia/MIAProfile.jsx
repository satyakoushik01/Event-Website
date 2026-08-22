import { motion } from 'framer-motion';

const MOCK_USER = {
  name: 'Aryan Kapoor',
  email: 'aryan.kapoor@email.com',
  phone: '+91 98765 43210',
  member: 'Gold Member since Jan 2025',
  savedEvents: ['Wedding – Feb 2027', 'Anniversary – Dec 2026'],
  consultations: [{ title: 'Wedding Planning', date: '20 Jul 2026', time: '3:00 PM', status: 'Upcoming' }],
  quotations: [
    { title: 'Wedding Package', amount: '₹8,50,000', date: '14 Jul 2026', status: 'Pending' },
    { title: 'Engagement Ceremony', amount: '₹2,20,000', date: '28 Jun 2026', status: 'Accepted' },
  ],
};

function Section({ title, children }) {
  return (
    <div className="mia-profile-section">
      <p className="mia-profile-section-title">{title}</p>
      {children}
    </div>
  );
}

function SettingRow({ label, value, onToggle }) {
  return (
    <div className="mia-setting-row">
      <span className="mia-setting-label">{label}</span>
      <motion.button
        className={`mia-toggle ${value ? 'mia-toggle--on' : ''}`}
        onClick={onToggle}
        whileTap={{ scale: 0.9 }}
        aria-label={label}
      >
        <motion.span className="mia-toggle-knob" layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
      </motion.button>
    </div>
  );
}

/** MIAProfile – user profile & settings screen. */
export default function MIAProfile() {
  const u = MOCK_USER;

  return (
    <motion.div
      className="mia-profile"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Avatar hero */}
      <div className="mia-profile-hero">
        <motion.div
          className="mia-profile-avatar"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 18 }}
        >
          {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </motion.div>
        <motion.h3 className="mia-profile-name" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {u.name}
        </motion.h3>
        <motion.p className="mia-profile-member" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          ⭐ {u.member}
        </motion.p>
      </div>

      {/* Contact info */}
      <Section title="Contact Information">
        {[{ icon: '✉️', val: u.email }, { icon: '📞', val: u.phone }].map(r => (
          <div key={r.val} className="mia-profile-info-row">
            <span>{r.icon}</span><span className="mia-profile-info-val">{r.val}</span>
          </div>
        ))}
      </Section>

      {/* Saved events */}
      <Section title="Saved Events">
        {u.savedEvents.length === 0
          ? <p className="mia-profile-empty">No saved events yet.</p>
          : u.savedEvents.map(e => (
            <div key={e} className="mia-profile-tag">{e}</div>
          ))
        }
      </Section>

      {/* Upcoming consultations */}
      <Section title="Upcoming Consultations">
        {u.consultations.length === 0
          ? <p className="mia-profile-empty">No upcoming consultations.</p>
          : u.consultations.map(c => (
            <div key={c.title} className="mia-history-card" style={{ padding: '12px 14px' }}>
              <div className="mia-history-card-top">
                <h4 className="mia-history-card-title" style={{ fontSize: '0.82rem' }}>{c.title}</h4>
                <span className="mia-status-badge" style={{ color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>{c.status}</span>
              </div>
              <p className="mia-history-card-date">{c.date} at {c.time}</p>
            </div>
          ))
        }
      </Section>

      {/* Recent quotations */}
      <Section title="Recent Quotations">
        {u.quotations.map(q => (
          <div key={q.title} className="mia-profile-quote-row">
            <div>
              <p className="mia-profile-quote-title">{q.title}</p>
              <p className="mia-profile-quote-date">{q.date}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="mia-profile-quote-amount">{q.amount}</p>
              <span className="mia-status-badge" style={{
                color: q.status === 'Accepted' ? '#22c55e' : '#d4af37',
                background: q.status === 'Accepted' ? 'rgba(34,197,94,0.08)' : 'rgba(212,175,55,0.08)',
                border: `1px solid ${q.status === 'Accepted' ? 'rgba(34,197,94,0.2)' : 'rgba(212,175,55,0.2)'}`,
                fontSize: '0.62rem',
              }}>{q.status}</span>
            </div>
          </div>
        ))}
      </Section>

      {/* Settings */}
      <Section title="Settings">
        <SettingRow label="Email Notifications" value={true} onToggle={() => {}} />
        <SettingRow label="WhatsApp Alerts" value={true} onToggle={() => {}} />
        <SettingRow label="SMS Reminders" value={false} onToggle={() => {}} />
        <SettingRow label="Save Chat History" value={true} onToggle={() => {}} />
      </Section>
    </motion.div>
  );
}
