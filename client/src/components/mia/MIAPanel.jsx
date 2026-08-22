import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import MIAActionCard       from './MIAActionCard';
import MIAChat             from './MIAChat';
import MIAVoiceMode        from './MIAVoiceMode';
import MIAEventPlanner     from './MIAEventPlanner';
import MIAEventSummary     from './MIAEventSummary';
import MIAQuotation        from './MIAQuotation';
import MIAMeetingScheduler from './MIAMeetingScheduler';
import MIACallbackScheduler from './MIACallbackScheduler';
import MIAHistory          from './MIAHistory';
import MIAProfile          from './MIAProfile';
import MIANotifications    from './MIANotifications';
import MIASuccessScreen    from './MIASuccessScreen';
import MIAErrorScreen      from './MIAErrorScreen';

/* ── Animation variants ─────────────────────────────────────────────────── */
const PANEL_WIDTH = 420;

const overlayV = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

const panelV = {
  hidden:  { x: PANEL_WIDTH + 40, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit:    { x: PANEL_WIDTH + 40, opacity: 0, transition: { duration: 0.4,  ease: [0.55, 0, 0.78, 0] } },
};

const viewV = (dir) => ({
  enter:  { opacity: 0, x: dir >= 0 ? 32 : -32, scale: 0.97 },
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, x: dir >= 0 ? -32 : 32, scale: 0.97, transition: { duration: 0.25, ease: [0.55, 0, 0.78, 0] } },
});

/* ── Home actions ────────────────────────────────────────────────────────── */
const HOME_ACTIONS = [
  { icon: '💬', title: 'Chat with MIA',    subtitle: 'Start a text conversation.',          id: 'mia-chat'     },
  { icon: '🗓️', title: 'Plan My Event',    subtitle: 'Step-by-step event planner.',          id: 'mia-planner'  },
  { icon: '🎤', title: 'Talk with MIA',    subtitle: 'Speak naturally with our AI.',          id: 'mia-voice'    },
  { icon: '📞', title: 'Request Callback', subtitle: "Let MIA call you when you're ready.",   id: 'mia-callback' },
];

/* ── Header icon button ──────────────────────────────────────────────────── */
function HdrBtn({ label, onClick, children, highlight = false }) {
  return (
    <motion.button
      className={`mia-header-icon-btn ${highlight ? 'mia-header-icon-btn--highlight' : ''}`}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.18 }}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </motion.button>
  );
}

/* ── View titles (for header context label) ──────────────────────────────── */
const VIEW_LABEL = {
  home: null, chat: 'Chat', voice: 'Voice Mode', planner: 'Event Planner',
  summary: 'Event Summary', quotation: 'Quotation Preview',
  scheduler: 'Book Consultation', callback: 'Schedule Callback',
  history: 'History', profile: 'My Profile', notifications: 'Notifications',
  success: null, error: null,
};

/**
 * MIAPanel – full view-stack navigation controller.
 * Manages home → chat / voice / planner / summary / quotation /
 *   scheduler / callback / history / profile / notifications / success / error.
 */
export default function MIAPanel({ isOpen, onClose }) {
  /* View stack: [{ name, data, dir }] – dir 1=forward, -1=back */
  const [stack, setStack] = useState([{ name: 'home', data: null, dir: 1 }]);

  const current = stack[stack.length - 1];
  const canGoBack = stack.length > 1;

  const push = useCallback((name, data = null) => {
    setStack(prev => [...prev, { name, data, dir: 1 }]);
  }, []);

  const pop = useCallback(() => {
    setStack(prev => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1).map((v, i, arr) => i === arr.length - 1 ? { ...v, dir: -1 } : v);
    });
  }, []);

  const reset = useCallback(() => {
    setStack([{ name: 'home', data: null, dir: 1 }]);
  }, []);

  const handleClose = () => {
    onClose();
    setTimeout(reset, 500);
  };

  /* ── View-specific navigation callbacks ─────────────────────────────── */
  const handleActionClick = (id) => {
    if (id === 'mia-chat')     push('chat');
    if (id === 'mia-planner')  push('planner');
    if (id === 'mia-voice')    push('voice');
    if (id === 'mia-callback') push('callback');
  };

  const handlePlannerDone    = (data)       => push('summary', data);
  const handleSummaryEdit    = ()           => pop();
  const handleSummaryQuote   = ()           => push('quotation', current.data);
  const handleQuoteBook      = ()           => push('scheduler', current.data);
  const handleQuoteRequest   = ()           => push('success', { type: 'quotation' });
  const handleQuoteModify    = ()           => push('planner');
  const handleSchedulerDone  = ()           => push('success', { type: 'meeting' });
  const handleCallbackDone   = ()           => push('success', { type: 'callback' });
  const handleVoiceEnd       = ()           => pop();
  const handleSuccessAction  = ()           => reset();
  const handleErrorRetry     = ()           => pop();

  /* ── Resolve current view component ─────────────────────────────────── */
  const renderView = () => {
    const { name, data } = current;

    switch (name) {
      case 'home':
        return (
          <motion.div key="home" className="mia-view" variants={viewV(current.dir)} initial="enter" animate="center" exit="exit">
            <motion.section className="mia-greeting" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
              <p className="mia-greeting-hi">Hi 👋</p>
              <p className="mia-greeting-welcome">Welcome to Moments Events.</p>
              <p className="mia-greeting-body">
                I'm MIA, your personal AI Event Concierge. I can help you plan your event,
                answer questions, recommend packages, and connect you with our team.
              </p>
            </motion.section>
            <section className="mia-actions" aria-label="Available actions">
              {HOME_ACTIONS.map((a, i) => (
                <MIAActionCard key={a.id} icon={a.icon} title={a.title} subtitle={a.subtitle}
                  delay={0.18 + i * 0.07} onClick={() => handleActionClick(a.id)} />
              ))}
            </section>
            <motion.footer className="mia-panel-footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <span className="mia-footer-dot" />&nbsp;Available 24×7
            </motion.footer>
          </motion.div>
        );

      case 'chat':
        return (
          <motion.div key="chat" className="mia-view mia-view--chat" variants={viewV(current.dir)} initial="enter" animate="center" exit="exit">
            <MIAChat initialChip={data?.chip ?? null} onNavigate={push} />
          </motion.div>
        );

      case 'voice':
        return (
          <motion.div key="voice" className="mia-view mia-view--voice" variants={viewV(current.dir)} initial="enter" animate="center" exit="exit">
            <MIAVoiceMode onEnd={handleVoiceEnd} />
          </motion.div>
        );

      case 'planner':
        return (
          <motion.div key="planner" className="mia-view mia-view--scroll" variants={viewV(current.dir)} initial="enter" animate="center" exit="exit">
            <MIAEventPlanner onComplete={handlePlannerDone} />
          </motion.div>
        );

      case 'summary':
        return (
          <motion.div key="summary" className="mia-view mia-view--scroll" variants={viewV(current.dir)} initial="enter" animate="center" exit="exit">
            <MIAEventSummary data={data} onEdit={handleSummaryEdit} onQuote={handleSummaryQuote} />
          </motion.div>
        );

      case 'quotation':
        return (
          <motion.div key="quotation" className="mia-view mia-view--scroll" variants={viewV(current.dir)} initial="enter" animate="center" exit="exit">
            <MIAQuotation data={data} onRequest={handleQuoteRequest} onBook={handleQuoteBook} onModify={handleQuoteModify} />
          </motion.div>
        );

      case 'scheduler':
        return (
          <motion.div key="scheduler" className="mia-view mia-view--scroll" variants={viewV(current.dir)} initial="enter" animate="center" exit="exit">
            <MIAMeetingScheduler onConfirm={handleSchedulerDone} />
          </motion.div>
        );

      case 'callback':
        return (
          <motion.div key="callback" className="mia-view mia-view--scroll" variants={viewV(current.dir)} initial="enter" animate="center" exit="exit">
            <MIACallbackScheduler onSchedule={handleCallbackDone} />
          </motion.div>
        );

      case 'history':
        return (
          <motion.div key="history" className="mia-view mia-view--scroll" variants={viewV(current.dir)} initial="enter" animate="center" exit="exit">
            <MIAHistory onOpen={(id) => push('chat', { historyId: id })} />
          </motion.div>
        );

      case 'profile':
        return (
          <motion.div key="profile" className="mia-view mia-view--scroll" variants={viewV(current.dir)} initial="enter" animate="center" exit="exit">
            <MIAProfile />
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div key="notifications" className="mia-view mia-view--scroll" variants={viewV(current.dir)} initial="enter" animate="center" exit="exit">
            <MIANotifications />
          </motion.div>
        );

      case 'success':
        return (
          <motion.div key="success" className="mia-view mia-view--centered" variants={viewV(current.dir)} initial="enter" animate="center" exit="exit">
            <MIASuccessScreen type={data?.type || 'default'} onAction={handleSuccessAction} onClose={reset} />
          </motion.div>
        );

      case 'error':
        return (
          <motion.div key="error" className="mia-view mia-view--centered" variants={viewV(current.dir)} initial="enter" animate="center" exit="exit">
            <MIAErrorScreen type={data?.type || 'default'} onRetry={handleErrorRetry} onClose={reset} />
          </motion.div>
        );

      default:
        return null;
    }
  };

  const viewLabel = VIEW_LABEL[current.name];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div key="mia-backdrop" className="mia-backdrop"
            variants={overlayV} initial="hidden" animate="visible" exit="hidden"
            transition={{ duration: 0.35 }} onClick={handleClose} aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside key="mia-panel" className="mia-panel"
            variants={panelV} initial="hidden" animate="visible" exit="exit"
            role="dialog" aria-modal="true" aria-label="MIA – Moments Intelligent Assistant"
          >
            <div className="mia-panel-glow" aria-hidden="true" />

            {/* ── HEADER ─────────────────────────────────────────────── */}
            <header className="mia-panel-header">
              <div className="mia-header-left">
                {/* Back */}
                <AnimatePresence>
                  {canGoBack && (
                    <motion.button key="back" className="mia-back-btn"
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }}
                      onClick={pop} aria-label="Go back" title="Back"
                    >←</motion.button>
                  )}
                </AnimatePresence>

                {/* Avatar */}
                <div className="mia-avatar" aria-hidden="true">
                  <span className="mia-avatar-letter">M</span>
                  <span className="mia-avatar-ring" />
                </div>

                <div className="mia-header-text">
                  <h2 className="mia-title">MIA</h2>
                  <AnimatePresence mode="wait">
                    <motion.p key={viewLabel || 'mia'} className="mia-subtitle"
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.2 }}
                    >
                      {viewLabel || 'Moments Intelligent Assistant'}
                    </motion.p>
                  </AnimatePresence>
                  <p className="mia-subtitle-2">Your Personal Event Concierge</p>
                </div>
              </div>

              <div className="mia-header-right">
                <div className="mia-header-actions">
                  <span className="mia-status" role="status" aria-label="Online">
                    <span className="mia-status-dot" aria-hidden="true" />Online
                  </span>

                  {/* Home / new conversation */}
                  <HdrBtn label="New conversation" onClick={reset}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </HdrBtn>

                  {/* History */}
                  <HdrBtn label="Conversation history" onClick={() => push('history')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                    </svg>
                  </HdrBtn>

                  {/* Notifications */}
                  <HdrBtn label="Notifications" onClick={() => push('notifications')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                  </HdrBtn>

                  {/* Profile */}
                  <HdrBtn label="My profile" onClick={() => push('profile')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                  </HdrBtn>

                  {/* Close */}
                  <motion.button className="mia-close-btn"
                    whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.25 }} onClick={handleClose} aria-label="Close MIA panel"
                  >✕</motion.button>
                </div>
              </div>
            </header>

            <div className="mia-divider" aria-hidden="true" />

            {/* ── VIEWS ──────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
              {renderView()}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
