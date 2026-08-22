import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VOICE_STATES = ['listening', 'thinking', 'speaking'];

const STATE_CONFIG = {
  listening: { label: 'Listening…',   color: '#22c55e', sub: 'Speak naturally – MIA is all ears' },
  thinking:  { label: 'Thinking…',    color: '#d4af37', sub: 'Crafting the perfect response' },
  speaking:  { label: 'Speaking…',    color: '#3b82f6', sub: 'MIA is responding to your query' },
};

/* Waveform bar heights – two patterns for listening vs speaking */
const BAR_COUNT = 20;
const getBarHeight = (i, state) => {
  if (state === 'thinking') return 4;
  const base = [6,14,22,30,24,16,28,36,20,12,32,26,18,34,10,28,22,16,30,8];
  return base[i % base.length] * (state === 'speaking' ? 1.2 : 1);
};

function Waveform({ state }) {
  return (
    <div className="mia-voice-wave" aria-hidden="true">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <motion.span
          key={i}
          className="mia-voice-bar"
          animate={state === 'thinking'
            ? { height: 4, opacity: 0.3 }
            : { height: [getBarHeight(i, state) * 0.4, getBarHeight(i, state), getBarHeight(i, state) * 0.5], opacity: [0.6, 1, 0.7] }
          }
          transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.04, ease: 'easeInOut' }}
          style={{ width: 3, borderRadius: 2 }}
        />
      ))}
    </div>
  );
}

function Timer({ running }) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return <span className="mia-voice-timer">{m}:{s}</span>;
}

/**
 * MIAVoiceMode – Full voice experience screen.
 * Props: onEnd {function} – called when user ends the call
 */
export default function MIAVoiceMode({ onEnd }) {
  const [voiceState, setVoiceState] = useState('listening');
  const [active, setActive] = useState(true);
  const cycleRef = useRef(null);

  /* Auto-cycle states for UI demo */
  useEffect(() => {
    if (!active) return;
    let idx = 0;
    cycleRef.current = setInterval(() => {
      idx = (idx + 1) % VOICE_STATES.length;
      setVoiceState(VOICE_STATES[idx]);
    }, 3000);
    return () => clearInterval(cycleRef.current);
  }, [active]);

  const cfg = STATE_CONFIG[voiceState];

  const handleEnd = () => {
    setActive(false);
    clearInterval(cycleRef.current);
    setTimeout(onEnd, 400);
  };

  return (
    <motion.div
      className="mia-voice-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Dark ambient background */}
      <div className="mia-voice-bg" />
      <motion.div
        className="mia-voice-glow"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: `radial-gradient(circle, ${cfg.color}22 0%, transparent 70%)` }}
      />

      {/* Timer */}
      <div className="mia-voice-top">
        <Timer running={active} />
        <motion.span
          className="mia-voice-state-badge"
          key={voiceState}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: cfg.color, borderColor: `${cfg.color}44`, background: `${cfg.color}11` }}
        >
          {cfg.label}
        </motion.span>
      </div>

      {/* Central avatar orb */}
      <div className="mia-voice-center">
        {/* Expanding pulse rings */}
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="mia-voice-ring"
            style={{ borderColor: `${cfg.color}55` }}
            animate={{ scale: [1, 1.6 + i * 0.3], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.65, ease: 'easeOut' }}
          />
        ))}

        {/* Avatar */}
        <motion.div
          className="mia-voice-avatar"
          animate={{ boxShadow: [`0 0 0 0 ${cfg.color}44`, `0 0 30px 10px ${cfg.color}22`, `0 0 0 0 ${cfg.color}44`] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ borderColor: `${cfg.color}66` }}
        >
          <span className="mia-voice-avatar-letter">M</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={voiceState}
              className="mia-voice-state-icon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25 }}
              style={{ color: cfg.color }}
            >
              {voiceState === 'listening' ? '🎤' : voiceState === 'thinking' ? '✦' : '🔊'}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Subtitle */}
      <AnimatePresence mode="wait">
        <motion.p
          key={voiceState}
          className="mia-voice-sub"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
        >
          {cfg.sub}
        </motion.p>
      </AnimatePresence>

      {/* Waveform */}
      <Waveform state={voiceState} />

      {/* Controls */}
      <div className="mia-voice-controls">
        {/* Mute */}
        <motion.button
          className="mia-voice-ctrl-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Mute microphone"
          title="Mute"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
          </svg>
        </motion.button>

        {/* End call */}
        <motion.button
          className="mia-voice-end-btn"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleEnd}
          aria-label="End call"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7 2 2 0 011.72 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.42 19.42 0 013.43 9.67 19.79 19.79 0 01.36 1a2 2 0 012-2.18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.18 6.83" />
          </svg>
          End Call
        </motion.button>

        {/* Speaker */}
        <motion.button
          className="mia-voice-ctrl-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Speaker"
          title="Speaker"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
