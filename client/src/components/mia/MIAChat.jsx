import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MIAMessage from './MIAMessage';
import MIATypingIndicator from './MIATypingIndicator';

/* ── Static data ──────────────────────────────────────────────────────────── */

const WELCOME_TEXT =
  'Welcome to Moments Events.\n\nI\'m MIA, your Personal Event Concierge.\n\nI\'ll help you plan your event, recommend services, answer your questions, and prepare a personalized quotation.\n\nLet\'s begin.';

const QUICK_CHIPS = [
  { id: 'planner',      icon: '🗓️', label: 'Plan My Event', action: 'navigate:planner' },
  { id: 'wedding',     icon: '✨', label: 'Plan a Wedding' },
  { id: 'corporate',  icon: '🎉', label: 'Corporate Event' },
  { id: 'birthday',   icon: '🎂', label: 'Birthday Celebration' },
  { id: 'engagement', icon: '💍', label: 'Engagement' },
  { id: 'housewarming',icon: '🏡', label: 'Housewarming' },
  { id: 'photography',icon: '📸', label: 'Photography' },
  { id: 'decorations', icon: '💐', label: 'Decorations' },
];

const EMPTY_STATE_CARDS = [
  'Wedding Planning',
  'Venue Selection',
  'Decoration Ideas',
  'Budget Planning',
  'Vendor Recommendations',
  'Quotation Requests',
];

/* ── Typing-effect hook ───────────────────────────────────────────────────── */
function useTypingEffect(text, speed = 18) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed, done };
}

/* ── Welcome message with typing animation ───────────────────────────────── */
function MIAWelcomeMessage() {
  const { displayed } = useTypingEffect(WELCOME_TEXT, 16);

  return (
    <motion.div
      className="mia-msg-row mia-msg-row--ai"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="mia-msg-avatar" aria-hidden="true">M</span>
      <div className="mia-msg-bubble mia-msg-bubble--ai mia-msg-bubble--welcome">
        <p className="mia-msg-text mia-msg-text--typed" style={{ whiteSpace: 'pre-line' }}>
          {displayed}
          <span className="mia-cursor" aria-hidden="true" />
        </p>
      </div>
    </motion.div>
  );
}

/* ── Quick-action chips ──────────────────────────────────────────────────── */
function QuickChips({ onSelect, onNavigate }) {
  return (
    <motion.div
      className="mia-chips-wrap"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="mia-chips-label">Quick actions</p>
      <div className="mia-chips">
        {QUICK_CHIPS.map((chip, i) => (
          <motion.button
            key={chip.id}
            className={`mia-chip ${chip.action === 'navigate:planner' ? 'mia-chip--highlight' : ''}`}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (chip.action === 'navigate:planner' && onNavigate) {
                onNavigate('planner');
              } else {
                onSelect(chip.label);
              }
            }}
            aria-label={chip.label}
          >
            <span className="mia-chip-icon">{chip.icon}</span>
            <span className="mia-chip-label">{chip.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Empty state ─────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      className="mia-empty"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="mia-empty-label">I usually help with…</p>
      <div className="mia-empty-grid">
        {EMPTY_STATE_CARDS.map((item, i) => (
          <motion.div
            key={item}
            className="mia-empty-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05, duration: 0.35 }}
          >
            {item}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Main Chat component ─────────────────────────────────────────────────── */
/**
 * MIAChat – the full conversational screen rendered inside MIAPanel
 * when the user clicks "Chat with MIA".
 *
 * Props:
 *  initialChip {string|null}   – optional pre-filled message
 *  onNavigate  {function|null} – push a new view from within chat
 */
export default function MIAChat({ initialChip = null, onNavigate = null }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState(initialChip || '');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showChips, setShowChips] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  /* Auto-send initial chip */
  useEffect(() => {
    if (initialChip) {
      const timer = setTimeout(() => {
        handleSend(initialChip);
      }, 1800); // let welcome message type first
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Auto-scroll to bottom */
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  /* Send a message */
  const handleSend = useCallback((text) => {
    const trimmed = (text ?? inputValue).trim();
    if (!trimmed) return;

    setShowChips(false);
    setShowWelcome(false);

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
      time: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    /* Simulate AI response (UI only) */
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: getMockResponse(trimmed),
        time: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1600 + Math.random() * 800);
  }, [inputValue]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipSelect = (label) => {
    setInputValue(label);
    setTimeout(() => handleSend(label), 50);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="mia-chat">
      {/* ── Scrollable area ─────────────────────────────────────────── */}
      <div
        className="mia-chat-scroll"
        ref={scrollRef}
        role="log"
        aria-label="MIA conversation"
        aria-live="polite"
      >
        {/* Welcome typing message */}
        <AnimatePresence>
          {showWelcome && <MIAWelcomeMessage key="welcome" />}
        </AnimatePresence>

        {/* Empty state – show before any user message */}
        <AnimatePresence>
          {!hasMessages && showWelcome && (
            <EmptyState key="empty" />
          )}
        </AnimatePresence>

        {/* Quick chips */}
        <AnimatePresence>
          {showChips && !hasMessages && (
            <QuickChips key="chips" onSelect={handleChipSelect} onNavigate={onNavigate} />
          )}
        </AnimatePresence>

        {/* Conversation messages */}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MIAMessage
              key={msg.id}
              role={msg.role}
              text={msg.text}
              time={msg.time}
            />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && <MIATypingIndicator key="typing" />}
        </AnimatePresence>
      </div>

      {/* ── Input area ──────────────────────────────────────────────── */}
      <div className="mia-input-area">
        {/* Attachment */}
        <motion.button
          className="mia-input-icon-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Attach file (UI only)"
          title="Attach file"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </motion.button>

        {/* Text input */}
        <div className="mia-input-wrap">
          <textarea
            ref={inputRef}
            className="mia-input"
            placeholder="Tell MIA about your event…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Message MIA"
          />
        </div>

        {/* Mic */}
        <motion.button
          className="mia-input-icon-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Voice input (UI only)"
          title="Voice input"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
          </svg>
        </motion.button>

        {/* Send */}
        <motion.button
          className={`mia-send-btn ${inputValue.trim() ? 'mia-send-btn--active' : ''}`}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => handleSend()}
          aria-label="Send message"
          disabled={!inputValue.trim()}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

/* ── Mock AI response generator (UI only) ───────────────────────────────── */
function getMockResponse(userText) {
  const lower = userText.toLowerCase();
  if (lower.includes('wedding'))
    return "How wonderful! 💍 Our wedding packages are tailored to create truly unforgettable experiences. Could you share your preferred date, guest count, and venue type? I'll curate a personalised shortlist for you.";
  if (lower.includes('corporate'))
    return "Excellent choice! 🎉 We specialise in elegant corporate events — from intimate boardroom dinners to grand gala evenings. What is the approximate headcount and your preferred date?";
  if (lower.includes('birthday'))
    return "Celebrations are our speciality! 🎂 Tell me more about the guest of honour — their style, preferred colours, and any themes you have in mind. We'll craft something truly memorable.";
  if (lower.includes('engagement'))
    return "How beautiful! 💍 An engagement deserves a setting as special as the moment itself. Would you prefer an intimate gathering or a grand celebration? I'll guide you to the perfect vendors.";
  if (lower.includes('photography'))
    return "Our curated photography partners are masters of capturing emotion. 📸 Could you share the event type and date? I'll match you with the ideal photographer from our network.";
  if (lower.includes('decor') || lower.includes('decoration'))
    return "Exquisite décor transforms a venue into an experience. 💐 What is your colour palette or theme? Our décor specialists will bring your vision to life.";
  if (lower.includes('budget'))
    return "Absolutely — I'll help you design a stunning event within your budget. 💼 Could you share a rough range? This helps me tailor recommendations precisely for you.";
  if (lower.includes('vendor'))
    return "Moments Events partners exclusively with verified, premium vendors. 🌟 What service are you looking for — catering, photography, floral, entertainment, or something else?";
  return "Thank you for sharing that! ✨ I'm crafting the perfect recommendations for you. Could you tell me a bit more — your event date, location, and approximate guest count would be very helpful.";
}
