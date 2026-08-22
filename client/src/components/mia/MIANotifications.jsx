import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_NOTIFS = [
  { id: 1, type: 'quotation',     icon: '📋', title: 'Quotation Ready',         body: 'Your wedding package quotation of ₹8,50,000 is ready to review.',         time: '2m ago',  read: false },
  { id: 2, type: 'consultation',  icon: '📅', title: 'Consultation Confirmed',   body: 'Your consultation on 20 Jul at 3:00 PM has been confirmed.',               time: '1h ago',  read: false },
  { id: 3, type: 'reminder',      icon: '⏰', title: 'Event Reminder',           body: 'Your anniversary event is 30 days away. Time to finalise your décor!',    time: '3h ago',  read: true  },
  { id: 4, type: 'callback',      icon: '📞', title: 'Callback Scheduled',       body: 'MIA will call you on 18 Jul at 11:00 AM via WhatsApp.',                    time: '1d ago',  read: true  },
  { id: 5, type: 'quotation',     icon: '📋', title: 'Quotation Updated',        body: 'Your engagement ceremony quotation has been revised based on your feedback.','time': '2d ago', read: true },
];

const TYPE_STYLE = {
  quotation:    { color: '#d4af37', bg: 'rgba(212,175,55,0.1)' },
  consultation: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  reminder:     { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  callback:     { color: '#22c55e', bg: 'rgba(34,197,94,0.1)'  },
};

const TABS = ['All', 'Unread'];

/** MIANotifications – notification center. */
export default function MIANotifications() {
  const [tab, setTab]       = useState('All');
  const [read, setRead]     = useState(MOCK_NOTIFS.filter(n => n.read).map(n => n.id));
  const [dismissed, setDismissed] = useState([]);

  const markRead   = (id) => setRead(r => [...r, id]);
  const dismiss    = (id) => setDismissed(d => [...d, id]);
  const markAllRead = () => setRead(MOCK_NOTIFS.map(n => n.id));

  const visible = MOCK_NOTIFS.filter(n => {
    if (dismissed.includes(n.id)) return false;
    if (tab === 'Unread') return !read.includes(n.id);
    return true;
  });

  const unreadCount = MOCK_NOTIFS.filter(n => !read.includes(n.id) && !dismissed.includes(n.id)).length;

  return (
    <motion.div
      className="mia-notifs"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className="mia-page-header">
        <h3 className="mia-page-title">
          Notifications
          {unreadCount > 0 && <span className="mia-notif-badge">{unreadCount}</span>}
        </h3>
        {unreadCount > 0 && (
          <motion.button className="mia-text-btn" onClick={markAllRead} whileHover={{ scale: 1.04 }}>
            Mark all read
          </motion.button>
        )}
      </div>

      {/* Tabs */}
      <div className="mia-tabs">
        {TABS.map(t => (
          <motion.button
            key={t}
            className={`mia-tab ${tab === t ? 'mia-tab--active' : ''}`}
            onClick={() => setTab(t)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            {t}
          </motion.button>
        ))}
      </div>

      {/* List */}
      <div className="mia-notif-list">
        <AnimatePresence>
          {visible.length === 0 ? (
            <motion.div key="empty" className="mia-list-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="mia-list-empty-icon">🔔</span>
              <p className="mia-list-empty-title">No Notifications</p>
              <p className="mia-list-empty-sub">You're all caught up! Notifications will appear here.</p>
            </motion.div>
          ) : visible.map((n, i) => {
            const isRead = read.includes(n.id);
            const style = TYPE_STYLE[n.type] || TYPE_STYLE.reminder;
            return (
              <motion.div
                key={n.id}
                className={`mia-notif-item ${isRead ? 'mia-notif-item--read' : ''}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ delay: i * 0.05 }}
                layout
                onClick={() => markRead(n.id)}
              >
                <div className="mia-notif-icon-wrap" style={{ background: style.bg }}>
                  <span className="mia-notif-icon">{n.icon}</span>
                  {!isRead && <span className="mia-notif-unread-dot" />}
                </div>
                <div className="mia-notif-body">
                  <div className="mia-notif-top">
                    <p className="mia-notif-title">{n.title}</p>
                    <span className="mia-notif-time">{n.time}</span>
                  </div>
                  <p className="mia-notif-text">{n.body}</p>
                </div>
                <motion.button
                  className="mia-notif-dismiss"
                  onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                  whileHover={{ scale: 1.1 }}
                  aria-label="Dismiss"
                >
                  ✕
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
